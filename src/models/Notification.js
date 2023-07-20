const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  body: String,
  row_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Row",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);
