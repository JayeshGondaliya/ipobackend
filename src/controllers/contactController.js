
import ContactMessage from "../models/ContactMessage.js";
import { sendContactEmail } from "../services/contactEmailService.js";

// Submit contact form
export async function submitContactMessage(req, res) {
    try {
        const { fullName, email, number, msg } = req.body ?? {};

        if (
            typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof number !== "string" ||
            typeof msg !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const contact = {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            number: number.trim(),
            msg: msg.trim()
        };

        const digitCount = contact.number.replace(/\D/g, "").length;

        if (contact.fullName.length < 2 || contact.fullName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 100 characters."
            });
        }

        if (
            contact.email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        if (
            !/^\+?[\d\s().-]+$/.test(contact.number) ||
            digitCount < 7 ||
            digitCount > 15
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number."
            });
        }

        if (contact.msg.length < 5 || contact.msg.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Message must be between 5 and 5000 characters."
            });
        }

        // Save to MongoDB
        const savedContact = await ContactMessage.create(contact);

        console.log("Contact saved:", savedContact._id);

        // Send email separately
        try {
            await sendContactEmail(contact);
            console.log("Contact email sent successfully.");
        } catch (emailError) {
            console.error("SMTP ERROR:", emailError);
        }

        // Successful submission if database save succeeds
        return res.status(201).json({
            success: true,
            message: "Your message has been received successfully.",
            contactId: savedContact._id
        });

    } catch (error) {
        console.error("CONTACT DATABASE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save your message. Please try again."
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
            contacts
        });

    } catch (error) {
        console.error("FETCH CONTACT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact messages."
        });
    }
}
