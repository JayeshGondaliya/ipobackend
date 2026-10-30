import ContactMessage from "../models/ContactMessage.js";
import { sendContactEmail } from "../services/contactEmailService.js";

export async function submitContactMessage(req, res) {
  const { fullName, email, number, msg } = req.body ?? {};

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

  const contact = {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    number: number.trim(),
    msg: msg.trim(),
  };
  const digitCount = contact.number.replace(/\D/g, "").length;

  if (contact.fullName.length < 2 || contact.fullName.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Full name must be between 2 and 100 characters.",
    });
  }

  if (
    contact.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  if (!/^\+?[\d\s().-]+$/.test(contact.number) || digitCount < 7 || digitCount > 15) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid phone number.",
    });
  }

  if (!contact.msg || contact.msg.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Message is required and must be at most 5000 characters.",
    });
  }

  try {
    await ContactMessage.create(contact);
    await sendContactEmail(contact);
    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact message submission failed:", error.message);
    return res.status(503).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
}

// Get all contact messages
export async function getAllContactMessages(req, res) {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Failed to fetch contact messages:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact messages.",
    });
  }
}
