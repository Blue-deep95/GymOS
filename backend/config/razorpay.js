const Razorpay = require('razorpay');

let razorpay = null;
if (process.env.RAZOR_KEY && process.env.RAZOR_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZOR_KEY,
        key_secret: process.env.RAZOR_SECRET
    });
} else {
    console.warn('\n====================================');
    console.warn('[PAYMENT OFFLINE] Razorpay credentials missing. Fallback to mock simulated transactions.');
    console.warn('====================================\n');
}

module.exports = razorpay;
