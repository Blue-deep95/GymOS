const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectMongoDB = require('../config/db');
const User = require('../models/User');

async function seedReceptionist() {
    try {
        await connectMongoDB();

        const recepEmail = 'receptionist@gymos.com';
        const existingRecep = await User.findOne({ email: recepEmail });

        if (existingRecep) {
            console.log(`[INFO] Receptionist account already exists: ${recepEmail}`);
            if (existingRecep.role !== 'receptionist') {
                existingRecep.role = 'receptionist';
                await existingRecep.save();
                console.log(`[SUCCESS] Updated existing user role to 'receptionist'.`);
            }
            process.exit(0);
        }

        const recepUser = new User({
            fullName: 'GymOS Receptionist',
            email: recepEmail,
            password: 'receptionist123',
            role: 'receptionist',
            phone: '555-0201'
        });

        await recepUser.save();
        console.log(`[SUCCESS] Receptionist account seeded successfully:`);
        console.log(`  - Email: ${recepEmail}`);
        console.log(`  - Password: receptionist123`);
        console.log(`  - Role: receptionist`);

        process.exit(0);
    } catch (err) {
        console.error(`[ERROR] Seeding receptionist failed:`, err.message);
        process.exit(1);
    }
}

seedReceptionist();
