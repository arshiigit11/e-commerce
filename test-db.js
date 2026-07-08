const mongoose = require('mongoose');
process.env.MONGODB_URI = 'mongodb+srv://arshianam159_db_user:IRltjnBQkvA8VUNQ@arshi.xbxip82.mongodb.net/ecommerce?appName=Arshi';

async function test() {
  console.log("Connecting to", process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully!");
    process.exit(0);
  } catch (e) {
    console.error("Connection failed:", e.message);
    process.exit(1);
  }
}
test();
