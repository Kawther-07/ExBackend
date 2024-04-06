const Doctor = require("../models/doctor");
const Admin = require("../models/admin");

const admins = [
  {
    first_name: "Doolab",
    last_name: "Admin",
    email: "admin@doolab.com",
    password: "123456",
    phone: "0655555555",
    role: "admin",
  },
];

const doctors = [
  {
    first_name: "Ines",
    last_name: "Boukhors",
    email: "ines.boukhors@univ-constantine2.dz",
    password: "123456",
    phone: "0555555555",
    role: "doctor",
    speciality: "Diabete",
    address: "Constantine",
    bio: "I am a doctor specialized in diabete. I have been working in this field for 10 years. I am here to help you with your diabete problems.",
    document: "https://www.google.com",
    profilePicture: "https://www.google.com",
  },
  {
    first_name: "Kawther",
    last_name: "Rached",
    email: "kawther@gmail.com",
    password: "123456",
    phone: "0687543291",
    role: "doctor",
    speciality: "Diabete",
    address: "Mssila",
    bio: "I am a doctor specialized in diabete. I have been working in this field for 10 years. I am here to help you with your diabete problems.",
    document: "https://www.google.com",
    profilePicture: "https://www.google.com",
  },
];

async function seedDatabase() {
  try {
    await Admin.bulkCreate(admins);
    await Doctor.bulkCreate(doctors);
    console.log("Database seed completed!");
  } catch (err) {
    console.log("Error seeding the database:", err);
  }
}

module.exports = { seedDatabase };
