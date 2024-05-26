const DfuRecordService = require('../services/dfuRecordService');
const upload = require('../config/multerConfig'); 
const DfuRecord = require('../models/dfuRecord');

exports.createDfuRecordWithImage = async (req, res) => {
  try {
    const { medicalRecordId, image } = req.body;
    console.log('Request received to create DFU record with image');
    console.log('Medical Record ID:', medicalRecordId);
    console.log('Image:', image); // Log the received image data

    // Assuming image is saved previously, as per your comment
    const savedImage = "path/to/saved/image.jpg"; // Update this with the actual saved image path

    // Once the image is saved, create the DFU record
    const dfuRecordData = { medicalRecordId, image: savedImage }; // Update to use saved image data
    const dfuRecord = await DfuRecordService.createDfuRecord(dfuRecordData);
    console.log('DFU record created successfully:', dfuRecord);
    res.status(201).json({ status: true, dfuRecord });
  } catch (error) {
    console.error('Error creating DFU record:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};


// dfuRecordController.js
// exports.uploadImage = async (req, res) => {
//   try {
//     const medicalRecordId = req.body.medicalRecordId;
//     if (!medicalRecordId) {
//       return res.status(400).json({ success: false, message: 'Missing medicalRecordId' });
//     }

//     // Check if an image file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No image file uploaded' });
//     }

//     // Process the uploaded image file
//     const imageData = req.file.buffer; // Image data as a buffer

//     // Save the image data to the database
//     const dfuRecord = await DfuRecordService.createDfuRecord({
//       medicalRecordId,
//       image: imageData // Save image data directly
//     });

//     return res.status(200).json({ success: true, message: 'Image uploaded successfully', dfuRecord });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

exports.uploadImage = async (req, res) => {
  try {
    console.log('Request received to upload image');
    console.log('Request body:', req.body); // Log the request body
    console.log('Request file:', req.file); // Log the file object

    const { medicalRecordId, imageUrl } = req.body; // Assuming medicalRecordId and imageUrl are sent in the request body
    console.log('Medical Record ID:', medicalRecordId);
    console.log('Image URL:', imageUrl);

    if (!medicalRecordId || !imageUrl) {
      console.log('Missing medicalRecordId or imageUrl');
      return res.status(400).json({ success: false, message: 'Missing medicalRecordId or imageUrl' });
    }

    // Now save the image URL to your database (PostgreSQL)
    const dfuRecord = await DfuRecord.create({ medicalRecordId, image: imageUrl });
    console.log('Image URL saved successfully:', dfuRecord);
    return res.status(200).json({ success: true, message: 'Image URL saved successfully', dfuRecord });
  } catch (error) {
    console.error('Error uploading image URL:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.getDfuRecordsByPatientId = async (req, res) => {
  try {
    // Extract patient ID from the request parameters
    const { patientId } = req.params;

    console.log('Request received to get DFU records by patient ID:', patientId);

    // Retrieve DFU records by patient ID using the service function
    const dfuRecords = await DfuRecordService.getDfuRecordsByPatientId(patientId);

    console.log('DFU records retrieved successfully:', dfuRecords);

    // Return DFU records as JSON response
    res.status(200).json({ status: true, dfuRecords });
  } catch (error) {
    console.error('Error retrieving DFU records:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
