// requirements
const express = require("express");
const subscriber = require("../models/subscriber");
const router = express.Router();
const Subscriber = require("../models/subscriber");
const nodemailer = require("nodemailer");

// getting all

router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// getting one

router.get("/:id", findsubscriber, (req, res) => {
  res.send(res.subscriber);
});

//creating one

router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscriberToChannel: req.body.subscriberToChannel,
  });

  try {
    const newsubscriber = await subscriber.save();
    //res.status(201).json(newsubscriber);

    //sending an email to new user on successful registeration
    sendemails(req, res, newsubscriber.subscriberToChannel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//updating one

router.patch("/:id", findsubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscriberToChannel != null) {
    res.subscriber.subscriberToChannel = req.body.subscriberToChannel;
  }
  try {
    const updatedsubscriber = await res.subscriber.save();
    res.json(updatedsubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//deleting one

router.delete("/:id", findsubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "successfully deleted the subscriber " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// middleware function to find using id
async function findsubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "cannot find subscriber" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.subscriber = subscriber;
  next();
}

async function sendemails(req, res, useremail) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hammasdev576@gmail.com",
      pass: "necrophos",
    },
  });

  const msg = {
    from: "hammasdev576@gmail.com", // sender address
    to: `${useremail}`, // list of receivers
    subject: "Sucessful registeration on CRUD", // Subject line
    text: "Dear User you are successfully registred on CRUD", // plain text body
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(msg);

  //console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  res.json({ message: "successfully sent " });
}

module.exports = router;
