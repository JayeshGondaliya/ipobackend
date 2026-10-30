import ContactMessage from "../models/ContactMessage.js";
import { sendContactEmail } from "../services/contactEmailService.js";

// Submit contact form
export async function submitContactMessage(req, res) {
  const { fullName, email, number, msg } = req.body ?? {};

  // Validate required fields
  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof number !== "string" ||
    typeof msg !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Full name, email, number, and message are required.",
    });
  }

  // Normalize input
  const contact = {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    number: number.trim(),
    msg: msg.trim(),
  };

  const digitCount = contact.number.replace(/\D/g, "").length;

  // Validate full name
  if (
    contact.fullName.length < 2 ||
    contact.fullName.length > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Full name must be between 2 and 100 characters.",
    });
  }

  // Validate email
  if (
    contact.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  // Validate phone number
  if (
    !/^\+?[\d\s().-]+$/.test(contact.number) ||
    digitCount < 7 ||
    digitCount > 15
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid phone number.",
    });
  }

  // Validate message
  if (!contact.msg || contact.msg.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Message is required and must be at most 5000 characters.",
    });
  }

  try {
    // Save contact message to MongoDB
    const savedContact = await ContactMessage.create(contact);

    // Send contact email
    await sendContactEmail(contact);

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      contactId: savedContact._id,
    });
  } catch (error) {
    console.error(
      "Contact message submission failed:",
      error.message
    );

    return res.status(503).json({
      success: false,
      message: "Unable to process your request right now. Please try again later.",
    });
  }
}

// Get all contact messages
export async function getAllContactMessages(req, res) {
  try {
    const contacts = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error(
      "Failed to fetch contact messages:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact messages.",
    });
  }
}