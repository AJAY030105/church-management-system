const Event = require('../models/Event');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, image, location, category } = req.body;
    if (!title || !description || !date)
      return res.status(400).json({ message: 'Title, description and date are required' });

    const event = await Event.create({
      title, description, date, image, location, category,
      createdBy: req.user._id,
    });

    // Auto-create notification
    const notification = await Notification.create({
      message: `New event: "${title}" on ${new Date(date).toLocaleDateString()}`,
      type: 'event',
      relatedId: event._id,
      relatedModel: 'Event',
    });

    // Send email to all users
    const users = await User.find({}, 'email name');
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; background: #fff8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #8B1A2C; padding: 30px; text-align: center;">
          <h1 style="color: #f5e6c8; margin: 0; font-size: 24px;">✝ Parish Announcement</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #8B1A2C;">${title}</h2>
          <p style="color: #555; line-height: 1.7;">${description}</p>
          <div style="background: #f5e6c8; border-left: 4px solid #8B1A2C; padding: 15px; border-radius: 4px;">
            <p style="margin: 0;"><strong>📅 Date:</strong> ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            ${location ? `<p style="margin: 8px 0 0;"><strong>📍 Location:</strong> ${location}</p>` : ''}
          </div>
          <p style="color: #999; font-size: 13px; margin-top: 20px;">God bless you. — Parish Administration</p>
        </div>
      </div>
    `;

    for (const user of users) {
      await sendEmail({ to: user.email, subject: `📢 New Event: ${title}`, html: emailHtml });
    }

    res.status(201).json({ event, notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getAllEvents, getEvent, updateEvent, deleteEvent };
