import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true, // Necessary for HTTP-only cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store access token in memory for security
let accessToken = null;

/**
 * Sets the access token in memory.
 * @param {string|null} token 
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Gets the current access token.
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return accessToken;
};

// Request Interceptor: Attach the current access token to the Authorization header
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variables for managing the refresh process
let isRefreshing = false;
let failedQueue = [];

/**
 * Process all queued requests by either resolving or rejecting them.
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle expired access tokens (401) and request fresh ones
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and the request hasn't been retried yet, and is not login/register
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes('/api/auth/login') &&
      !originalRequest.url.includes('/api/auth/register')
    ) {
      // If we are already in the middle of refreshing a token, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request a new access token from the refresh endpoint
        const response = await axios.post(
          `${api.defaults.baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        window.dispatchEvent(new CustomEvent('token-refreshed', { detail: { token: newAccessToken, role: response.data.role } }));

        // Dispatch new token to all waiting requests in the queue
        processQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        window.dispatchEvent(new CustomEvent('token-refreshed', { detail: { token: null, role: null } }));

        // Custom event or redirect can be dispatched here on token refresh failure
        // For example: window.location.href = '/signin';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
