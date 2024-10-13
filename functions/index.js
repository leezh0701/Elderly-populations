const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const sgMail = require("@sendgrid/mail");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {to, subject, text} = req.body;

    const msg = {
      to: to,
      from: "leezh0701@gmail.com",
      subject: subject,
      text: text,
    };

    try {
      await sgMail.send(msg);
      res.status(200).json({message: "Email sent successfully"});
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({error: "Failed to send email"});
    }
  });
});

exports.storeSearch = functions.https.onRequest(async (req, res) => {
  const {userId, location} = req.body;

  try {
    await db.collection("searches").add({
      userId,
      location,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).send("Search stored successfully");
  } catch (error) {
    res.status(500).send("Error storing search: " + error);
  }
});

exports.sendBulkEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {emails, subject, text} = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).json({message: "No email addresses provided."});
    }
    if (!subject || !text) {
      return res.status(400).json({message: "Subject and text are required."});
    }

    console.log("Sending to the following emails:", emails);

    const msg = {
      personalizations: emails.map((email) => ({
        to: [{email: email}],
      })),
      from: "leezh0701@gmail.com",
      subject: subject,
      text: text,
      html: `<strong>${text}</strong>`,
    };

    try {
      await sgMail.send(msg);
      res.status(200).json({message: "Bulk emails sent successfully"});
    } catch (error) {
      console.error("Error sending emails:", error.response.body.errors);
      res.status(500).json({
        message: "Failed to send emails",
        error: error.response.body.errors,
      });
    }
  });
});
