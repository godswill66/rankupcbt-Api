require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the User Schema (Matching your main User model)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // 2. Clean up existing admin to avoid duplicates
    await User.deleteOne({ username: 'admin_rankup' });
    console.log('🧹 Cleaned up existing admin (if any)');

    // 3. Hash the password
    const plainPassword = 'valentinavalee';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // 4. Create the Admin User
    const adminUser = new User({
      username: 'admin_rankup',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('-----------------------------------------------');
    console.log('🚀 SUCCESS: Admin user seeded successfully!');
    console.log(`👤 Username: admin_rankup`);
    console.log(`🔑 Password: ${plainPassword}`);
    console.log('-----------------------------------------------');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    // 5. Always close the connection
    mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
}

seedAdmin();