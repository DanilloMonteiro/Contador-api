const mongoose = require("mongoose");

const RowSchema = new mongoose.Schema({
  table: { type: String, required: true, unique: true },
  line: { type: String, required: true },
  customer: { type: String, required: true },
  fluig_number: { type: Number, required: true },
  count_number: { type: Number, default: 0 },
  last_count_date: Date,
  digital_table: Boolean,
  count_status: String,
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  material: { type: Boolean, default: false },
  planing_date: {
    type: Date,
    default: null,
  },
  observation: String,
  team: String,
  date_revision: Number,
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  next_revision: { type: Number, default: 30000 },
  revision: [
    {
      code: String,
      date: { type: Date, default: null },
      date_filter: Boolean,
      ready: Boolean,
      ready_filter: Boolean,
      checked: Boolean,
      stop: Number,
    },
  ],
  revision_time: [
    {
      code: String,
      date: { type: Date, default: null },
      date_filter: Boolean,
      ready: Boolean,
      ready_filter: Boolean,
      checked: Boolean,
      stop: { type: Number, default: 0 },
    },
  ],
  disabled: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Row", RowSchema);
