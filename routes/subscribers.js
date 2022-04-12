// requirements
const express = require("express");
const subscriber = require("../models/subscriber");
const router = express.Router();
const Subscriber = require("../models/subscriber");

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
    res.status(201).json(newsubscriber);
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

module.exports = router;
