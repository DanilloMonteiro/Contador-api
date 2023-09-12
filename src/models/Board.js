const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  mac: { type: String, unique: true },
  row: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Row",
    },
  ],
  board_free: { type: Boolean, default: true },
  date_free: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Board", BoardSchema);
