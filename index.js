require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User'); // Adjust path if needed

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Checking MongoDB Connection... Connected!'))
    .catch((err) => {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    });

const importData = async () => {
    try {
        // 1. Clear existing users
        await User.deleteMany();
        console.log('🗑️  Old data cleared...');

        // 2. Hash password once (Same password for everyone)
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // 3. Define 50+ Unique Users
        const users = [
            // --- ADMINS ---
            { fullName: 'Super Admin', email: 'admin@purplemerit.com', role: 'admin', status: 'active', password },
            { fullName: 'Aryaman Singh', email: 'aryaman@purplemerit.com', role: 'admin', status: 'active', password },

            // --- ACTIVE USERS ---
            { fullName: 'Aarav Patel', email: 'aarav.patel@example.com', role: 'user', status: 'active', password },
            { fullName: 'Vivaan Gupta', email: 'vivaan.g@example.com', role: 'user', status: 'active', password },
            { fullName: 'Aditya Kumar', email: 'aditya.k@example.com', role: 'user', status: 'active', password },
            { fullName: 'Vihaan Sharma', email: 'vihaan.sharma@example.com', role: 'user', status: 'active', password },
            { fullName: 'Arjun Reddy', email: 'arjun.reddy@example.com', role: 'user', status: 'active', password },
            { fullName: 'Sai Krishna', email: 'sai.krishna@example.com', role: 'user', status: 'active', password },
            { fullName: 'Reyansh Joshi', email: 'reyansh.j@example.com', role: 'user', status: 'active', password },
            { fullName: 'Ayaan Malhotra', email: 'ayaan.m@example.com', role: 'user', status: 'active', password },
            { fullName: 'Krishna Verma', email: 'krishna.v@example.com', role: 'user', status: 'active', password },
            { fullName: 'Ishaan Mehta', email: 'ishaan.mehta@example.com', role: 'user', status: 'active', password },
            { fullName: 'Shaunak Das', email: 'shaunak.das@example.com', role: 'user', status: 'active', password },
            { fullName: 'Rohan Nair', email: 'rohan.nair@example.com', role: 'user', status: 'active', password },
            { fullName: 'Kabir Kapoor', email: 'kabir.k@example.com', role: 'user', status: 'active', password },
            { fullName: 'Ananya Iyer', email: 'ananya.iyer@example.com', role: 'user', status: 'active', password },
            { fullName: 'Diya Chatterjee', email: 'diya.c@example.com', role: 'user', status: 'active', password },
            { fullName: 'Kiara Kaur', email: 'kiara.kaur@example.com', role: 'user', status: 'active', password },
            { fullName: 'Myra Khan', email: 'myra.khan@example.com', role: 'user', status: 'active', password },
            { fullName: 'Amaira Jain', email: 'amaira.j@example.com', role: 'user', status: 'active', password },
            { fullName: 'Sarthak Agarwal', email: 'sarthak.a@example.com', role: 'user', status: 'active', password },
            { fullName: 'Rianna Singh', email: 'rianna.s@example.com', role: 'user', status: 'active', password },
            { fullName: 'Sarah Johnson', email: 'sarah.j@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Michael Chen', email: 'michael.chen@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Jessica Williams', email: 'jessica.w@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'David Brown', email: 'david.b@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Emily Davis', email: 'emily.d@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Daniel Wilson', email: 'daniel.w@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Sophia Miller', email: 'sophia.m@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'James Taylor', email: 'james.t@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Olivia Anderson', email: 'olivia.a@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Robert Thomas', email: 'robert.t@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Isabella Jackson', email: 'isabella.j@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'William White', email: 'william.w@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Mia Harris', email: 'mia.h@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Ethan Martin', email: 'ethan.m@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Charlotte Thompson', email: 'charlotte.t@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Alexander Garcia', email: 'alex.g@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Amelia Martinez', email: 'amelia.m@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Benjamin Robinson', email: 'ben.r@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Harper Clark', email: 'harper.c@techmail.com', role: 'user', status: 'active', password },
            { fullName: 'Lucas Rodriguez', email: 'lucas.r@techmail.com', role: 'user', status: 'active', password },

            // --- INACTIVE USERS (To test filters/bans) ---
            { fullName: 'Inactive Ian', email: 'ian.suspended@test.com', role: 'user', status: 'inactive', password },
            { fullName: 'Suspended Susan', email: 'susan.banned@test.com', role: 'user', status: 'inactive', password },
            { fullName: 'Bot Account 01', email: 'bot01@spam.com', role: 'user', status: 'inactive', password },
            { fullName: 'Leaver Luke', email: 'luke.left@company.com', role: 'user', status: 'inactive', password },
            { fullName: 'Old Employee', email: 'old.emp@legacy.com', role: 'user', status: 'inactive', password },
            { fullName: 'Test Fail', email: 'fail.test@bug.com', role: 'user', status: 'inactive', password },
            { fullName: 'Guest User', email: 'guest.temp@visit.com', role: 'user', status: 'inactive', password },
            { fullName: 'Expired Trial', email: 'trial.exp@saas.com', role: 'user', status: 'inactive', password },
            { fullName: 'Flagged Account', email: 'flagged@security.com', role: 'user', status: 'inactive', password },
            { fullName: 'System Test', email: 'sys.test@dev.com', role: 'user', status: 'inactive', password },
        ];

        // 4. Insert into Database
        await User.insertMany(users);

        console.log(`✅ Successfully imported ${users.length} unique users!`);
        console.log(`🔑 All Passwords: password123`);
        console.log(`🔑 Admin: admin@purplemerit.com`);

        process.exit();

    } catch (error) {
        console.error('❌ Error with data import:', error);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error('❌ Error with data destruction:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    importData();
}