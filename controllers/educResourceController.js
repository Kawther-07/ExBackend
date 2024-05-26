const EducationalResource = require('../models/educationalResource');

// Create new educational resource
exports.createEducationalResource = async (req, res) => {
  try {
    const { title, description, article } = req.body;

    const resource = await EducationalResource.create({
      title,
      description,
      article,
    });

    res.status(201).json({ status: true, message: 'Resource created successfully', resource });
  } catch (error) {
    console.error('Error creating educational resource:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Fetch all educational resources
exports.getAllEducationalResources = async (req, res) => {
  try {
    const resources = await EducationalResource.findAll();
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Fetch a single educational resource by ID
exports.getEducationalResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await EducationalResource.findByPk(id);
    if (!resource) {
      return res.status(404).json({ status: false, message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching educational resource:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
