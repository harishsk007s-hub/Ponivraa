import Enquiry from '../models/Enquiry.js';

// @desc Submit new contact enquiry
// @route POST /api/enquiries
// @access Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: name, phone, email, and message',
      });
    }

    const enquiry = new Enquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      isRead: false,
    });

    const savedEnquiry = await enquiry.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      data: savedEnquiry,
    });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry',
      error: error.message,
    });
  }
};

// @desc Get all enquiries (Admin)
// @route GET /api/enquiries
// @access Private (Admin)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    const unreadCount = await Enquiry.countDocuments({ isRead: false });

    return res.status(200).json({
      success: true,
      unreadCount,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
      error: error.message,
    });
  }
};

// @desc Mark enquiry as read/unread
// @route PATCH /api/enquiries/:id/read
// @access Private (Admin)
export const toggleEnquiryRead = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    enquiry.isRead = req.body.isRead !== undefined ? req.body.isRead : !enquiry.isRead;
    const updated = await enquiry.save();

    return res.status(200).json({
      success: true,
      message: `Enquiry marked as ${updated.isRead ? 'read' : 'unread'}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error toggling enquiry status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status',
      error: error.message,
    });
  }
};

// @desc Delete enquiry
// @route DELETE /api/enquiries/:id
// @access Private (Admin)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry',
      error: error.message,
    });
  }
};

