const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const sgMail = require("@sendgrid/mail");

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
