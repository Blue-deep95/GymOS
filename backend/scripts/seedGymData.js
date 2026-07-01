const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectMongoDB = require('../config/db');
const User = require('../models/User');
const Membership = require('../models/Membership');

async function seedData() {
    try {
        await connectMongoDB();
        console.log('\n--- SEEDING GYM TRAINERS AND MEMBERS DATA ---');

        // 1. Remove any existing seeded accounts to prevent duplicates
        const emailsToDelete = [
            'marcus.aurelius@gymos.com',
            'serena.williams@gymos.com',
            'dorian.yates@gymos.com',
            'franco.columbu@gymos.com',
            'phil.heath@gymos.com',
            'jay.cutler@gymos.com',
            'ronnie.coleman@gymos.com',
            'arnold.schwarzenegger@gymos.com',
            'lee.haney@gymos.com',
            'frank.zane@gymos.com',
            'lou.ferrigno@gymos.com',
            'larry.scott@gymos.com'
        ];
        await User.deleteMany({ email: { $in: emailsToDelete } });
        console.log('Cleared existing seeded trainer & member accounts.');

        // 2. Create Trainers
        const trainer1 = new User({
            fullName: 'Marcus Aurelius',
            email: 'marcus.aurelius@gymos.com',
            password: 'trainer123',
            role: 'trainer',
            phone: '555-0301',
            specialization: 'Powerlifting & Strength'
        });
        const trainer2 = new User({
            fullName: 'Serena Williams',
            email: 'serena.williams@gymos.com',
            password: 'trainer123',
            role: 'trainer',
            phone: '555-0302',
            specialization: 'Cardio & Athletic Endurance'
        });

        await trainer1.save();
        await trainer2.save();
        console.log('Seeded 2 Trainer accounts.');

        // 3. Define Members mapped to trainers
        const memberDefs = [
            { name: 'Dorian Yates', email: 'dorian.yates@gymos.com', trainer: trainer1, plan: '6 Months' },
            { name: 'Franco Columbu', email: 'franco.columbu@gymos.com', trainer: trainer1, plan: '3 Months' },
            { name: 'Phil Heath', email: 'phil.heath@gymos.com', trainer: trainer1, plan: '1 Month' },
            { name: 'Jay Cutler', email: 'jay.cutler@gymos.com', trainer: trainer1, plan: '6 Months' },
            { name: 'Ronnie Coleman', email: 'ronnie.coleman@gymos.com', trainer: trainer1, plan: '3 Months' },
            { name: 'Arnold Schwarzenegger', email: 'arnold.schwarzenegger@gymos.com', trainer: trainer2, plan: '6 Months' },
            { name: 'Lee Haney', email: 'lee.haney@gymos.com', trainer: trainer2, plan: '3 Months' },
            { name: 'Frank Zane', email: 'frank.zane@gymos.com', trainer: trainer2, plan: '1 Month' },
            { name: 'Lou Ferrigno', email: 'lou.ferrigno@gymos.com', trainer: trainer2, plan: '6 Months' },
            { name: 'Larry Scott', email: 'larry.scott@gymos.com', trainer: trainer2, plan: '3 Months' }
        ];

        for (const def of memberDefs) {
            // Create user document
            const user = new User({
                fullName: def.name,
                email: def.email,
                password: 'member123',
                role: 'member',
                phone: `555-040${Math.floor(Math.random() * 10)}`,
                assignedTrainer: def.trainer._id
            });
            await user.save();

            // Create membership package
            const startDate = new Date();
            const endDate = new Date();
            if (def.plan === '1 Month') endDate.setMonth(endDate.getMonth() + 1);
            if (def.plan === '3 Months') endDate.setMonth(endDate.getMonth() + 3);
            if (def.plan === '6 Months') endDate.setMonth(endDate.getMonth() + 6);

            const membership = new Membership({
                memberId: user._id,
                planType: def.plan,
                startDate,
                endDate,
                status: 'Active',
                price: def.plan === '1 Month' ? 50 : def.plan === '3 Months' ? 135 : 240
            });
            await membership.save();

            // Link membership back to user
            user.currentMembership = membership._id;
            await user.save();
        }

        console.log('Seeded 10 Member accounts with active memberships linked to respective trainers.');
        console.log('\nSeed Data Logins:');
        console.log('  Trainers:');
        console.log('    - marcus.aurelius@gymos.com / trainer123');
        console.log('    - serena.williams@gymos.com / trainer123');
        console.log('  Members:');
        console.log('    - dorian.yates@gymos.com / member123');
        console.log('    - arnold.schwarzenegger@gymos.com / member123');
        console.log('    (and 8 others)');
        console.log('\n--- SEEDING COMPLETED ---');
        process.exit(0);
    } catch (err) {
        console.error('Seeding script failed:', err.message);
        process.exit(1);
    }
}

seedData();
