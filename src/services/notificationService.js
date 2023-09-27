const Row = require("../models/Row");
const Notification = require("../models/Notification");

async function stopTable(id, data) {
  try {
    const row = await Row.findById(id)
      .populate("board")
      .populate("notifications");

    const existingNotification = row.notifications.find(
      (notification) =>
        notification.title === "Mesa parada necessita manutenção!"
    );

    if (!row) {
      throw new Error("Row not found");
    }

    if (data.count_number >= row.next_revision) {
      if (!existingNotification) {
        const notificationData = {
          title: "Mesa parada necessita manutenção!",
          body: `Mesa atingiu o limite de contagem sem revisão. Foi parada a ${table} na contagem ${count_number} e necessita manutenção`,
          table: table,
          fluig: fluig_number,
        };

        const newNotification = new Notification(notificationData);
        const savedNotification = await newNotification.save();

        row.notifications.push(savedNotification._id);
        await row.save(); // Atualize o documento existente
      }
    }

    return row;
  } catch (error) {
    throw new Error("Problem updating the Row");
  }
}

module.exports = {
  stopTable,
};
