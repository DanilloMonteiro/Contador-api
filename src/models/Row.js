const mongoose = require("mongoose");

const RowSchema = new mongoose.Schema({
  table: { type: String, required: true, unique: true },
  line: { type: String, required: true },
  customer: { type: String, required: true },
  fluig_number: { type: Number, required: true },
  count_number: { type: Number, default: 0 },
  last_count_date: Date,
  stop_table: { type: Number, default: 30000 },
  digital_table: Boolean,
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  has_counter: { type: Boolean, default: true },
  material: { type: Boolean, default: false },
  planing_date: {
    type: Date,
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
  revision: {
    R0: {
      date: { type: Date, default: Date.now },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: true },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: true },
    },
    R30: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    R55: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    R80: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    R105: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    time1: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    time2: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
    time3: {
      date: { type: Date },
      date_filter: { type: Boolean, default: true },
      ready: { type: Boolean, default: false },
      ready_filter: { type: Boolean, default: true },
      checked: { type: Boolean, default: false },
    },
  },
  disabled: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Row", RowSchema);
