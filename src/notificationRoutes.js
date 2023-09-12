const express = require("express");
const Notification = require("./models/Notification");
const routes = express.Router();

routes.get("/", async (req, res) => {
  try {
    let notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Problem to find the list of Notifications" });
  }
});

routes.post("/", async (req, res) => {
  const { title, body } = req.body;

  try {
    const newNotification = new Notification({
      title: title,
      body: body,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new notification" });
  }
});

routes.delete("/:id", async function (req, res) {
  const { id } = req.params;

  try {
    await Notification.findByIdAndDelete(id);
    res.json({ message: "Ok" }).status(204);
  } catch (error) {
    res.status(500).json({ error: "Problem to delete a notification" });
  }
});

module.exports = routes;
