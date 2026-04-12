import Query from "../../models/query.js";
import { sendEmail } from "../../configs/nodemailer.js";

export const createQuery = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const query = await Query.create({ name, email, phone, message });
    return res.status(200).json({ success: true, query });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    return res.status(200).json({ success: true, queries });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const replyToQuery = async (req, res) => {
  try {
    const { queryId, reply } = req.body;
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ success: false, message: "Query not found" });
    }

    //send mail to user
    await sendEmail({
      to: query.email,
      subject: "Reply to your query",
      html: `<p>Hello ${query.name},</p><p>Thank you for your query. Here is our reply:</p><p>${reply}</p>`
    });
    query.reply = reply;
    await query.save();
    return res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
