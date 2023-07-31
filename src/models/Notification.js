const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: String,
  body: String,
  table: String,
  fluig: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

NotificationSchema.pre("findByIdAndDelete", async function (next) {
  const notificationId = this.getQuery()["_id"];

  try {
    // Encontre a Row que contém a notificação a ser deletada
    const row = await mongoose
      .model("Row")
      .findOneAndUpdate(
        { notifications: notificationId },
        { $pull: { notifications: notificationId } },
        { new: true }
      );

    // Se necessário, você pode fazer alguma lógica adicional com a "row" aqui

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Notification", NotificationSchema);
