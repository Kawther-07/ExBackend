const Doctor = require("../models/doctor");
const Admin = require("../models/admin");
const Patient = require("../models/patient");
const MedicalRecord = require("../models/medicalRecord");
const PatientPersonalProfile = require("../models/patientProfile");

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
  {
    first_name: "Ikram",
    last_name: "Bouleam",
    email: "ikram@gmail.com",
    password: "123456",
    phone: "0698754321",
    role: "doctor",
    speciality: "Generalist",
    address: "Constantine",
    bio: "",
    document: "https://www.google.com",
    profilePicture: "https://www.google.com",
  },
];

const patients = [
  {
    first_name: "Patient",
    last_name: "1",
    email: "patient@doolab.com",
    phone: "0755555555",
    password: "123456",
    address: "Annaba",
  },
];

// {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   patientId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: "patient",
//       key: "id",
//     },
//   },

//   // i'm not sure if it's true or false, i mean we need these info for the recommendation system, don't we?
//   gender: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   height: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   weight: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   birth_date: {
//     type: DataTypes.DATEONLY,
//     allowNull: false,
//   },

const patientProfiles = [
  {
    patientId: 1,
    gender: 'female',
    height: 1.65,
    weight: 60,
    birth_date: "2001-08-22",
  }
]

const medicalRecords = [
  {
    patientId: 1,
    doctorId: 1,
    diabetesType: "Type 1",
    hasDFU: true,
    isSmoker: false,
    hadDiabetes: "2021-01-01",
    bloodGroup: "A+",
  },
];

async function seedDatabase() {
  try {
    await Admin.bulkCreate(admins);
    await Doctor.bulkCreate(doctors);
    await Patient.bulkCreate(patients);
    await PatientPersonalProfile.bulkCreate(patientProfiles);
    await MedicalRecord.bulkCreate(medicalRecords);
    console.log("Database seed completed!");
  } catch (err) {
    console.log("Error seeding the database:", err);
  }
}

module.exports = { seedDatabase };
