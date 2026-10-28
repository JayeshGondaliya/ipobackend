import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    number: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    msg: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true, strict: "throw" }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;