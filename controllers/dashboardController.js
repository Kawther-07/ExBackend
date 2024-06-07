const { Op } = require("sequelize");
const sequelize = require("../config/database");
const {
  Patient,
  Doctor,
  MedicalRecord,
} = require("../models/associations"); // Adjust the path as necessary

exports.getStatistics = async (req, res) => {
  try {
    const user = req.user;
    console.log("user: ", user);
    let total_users = 0;
    let total_patients = 0;
    let total_doctors = 0;
    let total_doctors_archived = 0;
    let total_patients_archived = 0;
    if (user.role === "doctor") {
      // Get total number of patients fo the specified doctorId
      total_patients = await Patient.count({
        where: { isArchived: false },
        include: {
          model: MedicalRecord,
          where: { doctorId: user.doctor.id },
        },
      });

      total_patients_archived = await Patient.count({
        where: { isArchived: true },
        include: {
          model: MedicalRecord,
          where: { doctorId: user.doctor.id },
        },
      });
      res.json({
        status: true,
        data: {
          total_users,
          total_patients,
          total_doctors,
          total_doctors_archived,
          total_patients_archived,
        },
      });
    } else {
      total_patients = await Patient.count({ where: { isArchived: false } });
      total_doctors = await Doctor.count({ where: { isArchived: false } });
      total_users = total_patients + total_doctors;
      total_doctors_archived = await Doctor.count({
        where: { isArchived: true },
      });
      // array of doctors and patients registered count for each day (for the last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const registeredCountPatients = await Patient.findAll({
        where: {
          created_at: { [Op.gte]: sevenDaysAgo },
        },
        attributes: [
          [sequelize.fn("date", sequelize.col("created_at")), "date"],
          [sequelize.fn("count", sequelize.col("id")), "count"],
          [sequelize.literal("'Patient'"), "role"],
        ],
        group: [sequelize.fn("date", sequelize.col("created_at"))],
      });

      const registeredCountDoctors = await Doctor.findAll({
        where: {
          created_at: { [Op.gte]: sevenDaysAgo },
        },
        attributes: [
          [sequelize.fn("date", sequelize.col("created_at")), "date"],
          [sequelize.fn("count", sequelize.col("id")), "count"],
          [sequelize.literal("'Doctor'"), "role"],
        ],
        group: [sequelize.fn("date", sequelize.col("created_at"))],
      });

      const registeredCount = [
        ...registeredCountPatients,
        ...registeredCountDoctors,
      ];

      // sort the registeredCount array by date
      registeredCount.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      res.json({
        status: true,
        data: {
          total_users,
          total_patients,
          total_doctors,
          total_doctors_archived,
          total_patients_archived,
          registeredCount,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching patient profiles:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
