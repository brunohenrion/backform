require("dotenv").config();

const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { log } = require("console");

const app = express();
app.use(cors());
app.use(express.json());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: process.env.USERNAME,
  key: process.env.API_KEY_MAILGUN,
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome !!!!" });
});

app.post("/form", async (req, res) => {
  console.log("route /form");
  console.log("FIRSTNAME===>", req.body);
  try {
    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
      to: process.env.DEST_MAIL,
      subject: "Hello",
      text: req.body.message,
    };
    // Version async/await
    const response = await client.messages.create(
      process.env.DOMAIN_MAILGUN,
      messageData
    );

    console.log("response>>", response);
    res.status(200).json(response);
    // Version .then().cathc()
    // client.messages
    //   .create(process.env.DOMAIN_MAILGUN, messageData)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server has started 🤓");
});
