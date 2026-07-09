import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { theme } from './theme';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Lazy load page components (Named exports resolved with .then)
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const SignIn = lazy(() => import('./pages/SignIn').then(m => ({ default: m.SignIn })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Plans = lazy(() => import('./pages/Plans').then(m => ({ default: m.Plans })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));

// Protected Owner Routes
const OwnerLayout = lazy(() => import('./pages/owner/OwnerLayout').then(m => ({ default: m.OwnerLayout })));
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard').then(m => ({ default: m.OwnerDashboard })));
const MembersList = lazy(() => import('./pages/owner/MembersList').then(m => ({ default: m.MembersList })));
const TrainersList = lazy(() => import('./pages/owner/TrainersList').then(m => ({ default: m.TrainersList })));
const ReportGenerator = lazy(() => import('./pages/owner/ReportGenerator').then(m => ({ default: m.ReportGenerator })));

// Protected Receptionist Routes
const ReceptionistLayout = lazy(() => import('./pages/receptionist/ReceptionistLayout').then(m => ({ default: m.ReceptionistLayout })));
const ReceptionistDashboard = lazy(() => import('./pages/receptionist/ReceptionistDashboard').then(m => ({ default: m.ReceptionistDashboard })));
const RecepMembers = lazy(() => import('./pages/receptionist/RecepMembers').then(m => ({ default: m.RecepMembers })));
const CheckInDesk = lazy(() => import('./pages/receptionist/CheckInDesk').then(m => ({ default: m.CheckInDesk })));

// Protected Trainer Routes
const TrainerLayout = lazy(() => import('./pages/trainer/TrainerLayout').then(m => ({ default: m.TrainerLayout })));
const TrainerDashboard = lazy(() => import('./pages/trainer/TrainerDashboard').then(m => ({ default: m.TrainerDashboard })));
const TrainerMembers = lazy(() => import('./pages/trainer/TrainerMembers').then(m => ({ default: m.TrainerMembers })));
const WorkoutTemplates = lazy(() => import('./pages/trainer/WorkoutTemplates').then(m => ({ default: m.WorkoutTemplates })));

// Protected Member Routes
const MemberLayout = lazy(() => import('./pages/member/MemberLayout').then(m => ({ default: m.MemberLayout })));
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard').then(m => ({ default: m.MemberDashboard })));
const MemberWorkout = lazy(() => import('./pages/member/MemberWorkout').then(m => ({ default: m.MemberWorkout })));
const MemberAttendance = lazy(() => import('./pages/member/MemberAttendance').then(m => ({ default: m.MemberAttendance })));
const MemberProgress = lazy(() => import('./pages/member/MemberProgress').then(m => ({ default: m.MemberProgress })));
const ConfirmPurchase = lazy(() => import('./pages/member/ConfirmPurchase').then(m => ({ default: m.ConfirmPurchase })));
const MemberQrCard = lazy(() => import('./pages/member/MemberQrCard').then(m => ({ default: m.MemberQrCard })));
const MemberProfile = lazy(() => import('./pages/member/MemberProfile').then(m => ({ default: m.MemberProfile })));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Navbar />
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '70vh',
                  }}
                >
                  <CircularProgress color="inherit" size={40} thickness={4} />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected Owner Routes */}
                <Route path="/owner" element={<OwnerLayout />}>
                  <Route path="dashboard" element={<OwnerDashboard />} />
                  <Route path="members" element={<MembersList />} />
                  <Route path="trainers" element={<TrainersList />} />
                  <Route path="reports" element={<ReportGenerator />} />
                </Route>

                {/* Protected Receptionist Routes */}
                <Route path="/receptionist" element={<ReceptionistLayout />}>
                  <Route path="dashboard" element={<ReceptionistDashboard />} />
                  <Route path="members" element={<RecepMembers />} />
                  <Route path="checkin" element={<CheckInDesk />} />
                </Route>

                {/* Protected Trainer Routes */}
                <Route path="/trainer" element={<TrainerLayout />}>
                  <Route path="dashboard" element={<TrainerDashboard />} />
                  <Route path="members" element={<TrainerMembers />} />
                  <Route path="templates" element={<WorkoutTemplates />} />
                </Route>

                {/* Protected Member Routes */}
                <Route path="/member" element={<MemberLayout />}>
                  <Route path="dashboard" element={<MemberDashboard />} />
                  <Route path="workout" element={<MemberWorkout />} />
                  <Route path="attendance" element={<MemberAttendance />} />
                  <Route path="progress" element={<MemberProgress />} />
                  <Route path="confirm-purchase" element={<ConfirmPurchase />} />
                  <Route path="qr-card" element={<MemberQrCard />} />
                  <Route path="profile" element={<MemberProfile />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
