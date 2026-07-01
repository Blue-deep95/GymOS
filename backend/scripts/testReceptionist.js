const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectMongoDB = require('../config/db');
const User = require('../models/User');
const Membership = require('../models/Membership');
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');

// A quick automated verification runner
async function runTests() {
    try {
        await connectMongoDB();
        console.log('\n--- STARTING RECEP ROUTE VERIFICATION ---');

        // Clear existing test data
        await User.deleteMany({ email: { $in: ['test_member@gymos.com', 'test_trainer@gymos.com'] } });

        // 1. Create a member
        const testMember = new User({
            fullName: 'Test Member',
            email: 'test_member@gymos.com',
            password: 'password123',
            role: 'member'
        });
        await testMember.save();
        console.log('[1/5] Created test member user');

        // 2. Create a trainer
        const testTrainer = new User({
            fullName: 'Test Trainer',
            email: 'test_trainer@gymos.com',
            password: 'password123',
            role: 'trainer',
            specialization: 'Calisthenics Master'
        });
        await testTrainer.save();
        console.log('[2/5] Created test trainer user');

        // Get receptionist user to fetch credentials
        const receptionist = await User.findOne({ role: 'receptionist' });
        if (!receptionist) {
            throw new Error('No receptionist user found in database. Seed first.');
        }

        // Mock sign a token for receptionist
        const receptionistToken = jwt.sign(
            { id: receptionist._id, role: receptionist.role },
            process.env.ACCESS_TOKEN_SECRET || 'default_access_secret_key_12345',
            { expiresIn: '10m' }
        );

        // We can simulate the controller requests directly in-memory to test logic!
        const reqMock = {
            user: { id: receptionist._id, role: receptionist.role }
        };

        const { getMembersList, assignMembership, assignTrainer, checkInMember } = require('../controllers/receptionistController');

        // Mock response helper
        const resHelper = (callback) => {
            return {
                status: (code) => ({
                    json: (data) => callback(code, data)
                })
            };
        };

        // 3. Test Membership Assignment
        console.log('[3/5] Testing Membership Assignment...');
        const reqAssignMem = {
            ...reqMock,
            params: { id: testMember._id.toString() },
            body: { planType: '3 Months', startDate: new Date() }
        };
        await assignMembership(reqAssignMem, resHelper((code, data) => {
            if (code !== 21) { // 201 Created
                console.log(`  -> Status: ${code}`, data);
                if (code === 201) {
                    console.log(`  [SUCCESS] Membership assigned: ${data.membership.planType}, expires: ${data.membership.endDate}`);
                } else {
                    throw new Error('Failed membership assignment verification');
                }
            }
        }));

        // 4. Test Trainer Assignment
        console.log('[4/5] Testing Trainer Assignment...');
        const reqAssignTrainer = {
            ...reqMock,
            params: { id: testMember._id.toString() },
            body: { trainerId: testTrainer._id.toString() }
        };
        await assignTrainer(reqAssignTrainer, resHelper((code, data) => {
            if (code === 200) {
                console.log(`  [SUCCESS] Trainer linked successfully: ${data.assignedTrainerId}`);
            } else {
                console.log(`  -> Status: ${code}`, data);
                throw new Error('Failed trainer assignment verification');
            }
        }));

        // 5. Test Check-in (Attendance)
        console.log('[5/5] Testing Daily Check-In & Duplicate Guard...');
        // Clear today's attendance for test member
        const todayStr = new Date().toISOString().split('T')[0];
        await Attendance.deleteMany({ memberId: testMember._id, date: todayStr });

        const reqCheckIn = {
            ...reqMock,
            body: { memberId: testMember._id.toString() }
        };

        // First check-in
        await checkInMember(reqCheckIn, resHelper(async (code1, data1) => {
            if (code1 === 201) {
                console.log(`  [SUCCESS] Checked in successfully for date: ${data1.attendance.date}`);

                // Try double check-in
                await checkInMember(reqCheckIn, resHelper((code2, data2) => {
                    if (code2 === 400) {
                        console.log(`  [SUCCESS] Double check-in rejected correctly: "${data2.message}"`);
                    } else {
                        console.log(`  -> Status: ${code2}`, data2);
                        throw new Error('Duplicate check-in was allowed! Failure.');
                    }
                }));
            } else {
                console.log(`  -> Status: ${code1}`, data1);
                throw new Error('First check-in failed');
            }
        }));

        // Verify user directory fetch
        console.log('\nTesting Directory Fetch...');
        await getMembersList(reqMock, resHelper((code, data) => {
            if (code === 200) {
                const found = data.members.find(m => m.email === 'test_member@gymos.com');
                if (found && found.currentMembership && found.assignedTrainer) {
                    console.log('  [SUCCESS] Member list populated references:');
                    console.log(`    - Plan: ${found.currentMembership.planType}`);
                    console.log(`    - Trainer: ${found.assignedTrainer.fullName}`);
                } else {
                    console.log('  -> Directory entry:', found);
                    throw new Error('Populate failed or user not retrieved');
                }
            }
        }));

        console.log('\n--- ALL TEST PASSED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('\n[VERIFICATION ERROR]:', err.message);
        process.exit(1);
    }
}

runTests();
