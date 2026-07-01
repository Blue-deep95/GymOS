const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectMongoDB = require('../config/db');
const User = require('../models/User');

async function seedOwner() {
    try {
        // Connect to MongoDB
        await connectMongoDB();

        const ownerEmail = 'owner@gymos.com';
        const existingOwner = await User.findOne({ email: ownerEmail });

        if (existingOwner) {
            console.log(`[INFO] Owner account already exists: ${ownerEmail}`);
            // Check role
            if (existingOwner.role !== 'owner') {
                existingOwner.role = 'owner';
                await existingOwner.save();
                console.log(`[SUCCESS] Updated existing user role to 'owner'.`);
            }
            process.exit(0);
        }

        const ownerUser = new User({
            fullName: 'GymOS Owner',
            email: ownerEmail,
            password: 'owner123',
            role: 'owner',
            phone: '555-0199',
            emergencyContact: '555-0100',
            fitnessGoals: 'Manage Gym OS Operations',
            medicalNotes: 'None'
        });

        await ownerUser.save();
        console.log(`[SUCCESS] Owner account seeded successfully:`);
        console.log(`  - Email: ${ownerEmail}`);
        console.log(`  - Password: owner123`);
        console.log(`  - Role: owner`);

        process.exit(0);
    } catch (err) {
        console.error(`[ERROR] Seeding owner failed:`, err.message);
        process.exit(1);
    }
}

seedOwner();
