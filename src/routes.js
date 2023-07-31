const routes = require("express").Router();
const Notification = require("./models/Notification");
const Row = require("./models/Row");

routes.get("/", async (req, res) => {
  try {
    let rows = await Row.find();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the list of Row" });
  }
});

routes.get("/notifications", async (req, res) => {
  try {
    let notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Problem to find the list of Notifications" });
  }
});

routes.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    let row = await Row.findById(id);
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the Row" });
  }
});

routes.post("/notifications", async (req, res) => {
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

routes.post("/", async (req, res) => {
  const {
    table,
    line,
    customer,
    fluig_number,
    count_number,
    counter,
    digital_table,
    material,
    stop_table,
    planing_date,
    observation,
    date_revision,
    notifications_id,
    team,
    revision,
  } = req.body;
  let row = new Row({
    table: table,
    line: line,
    customer: customer,
    fluig_number: fluig_number,
    count_number: count_number,
    notifications_id: notifications_id,
    counter: counter,
    stop_table: stop_table,
    digital_table: digital_table,
    material: material,
    planing_date: planing_date,
    date_revision: date_revision,
    observation: observation,
    team: team,
    revision: revision,
  });

  try {
    await row.save();

    res.status(200).json(row);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem to create a new Row" });
  }
});

routes.put("/:id", async function (req, res) {
  const {
    table,
    line,
    customer,
    fluig_number,
    count_number,
    last_count_number,
    digital_table,
    counter,
    material,
    stop_table,
    planing_date,
    observation,
    date_revision,
    team,
    desabled,
    revision,
  } = req.body;
  const { id } = req.params;

  try {
    const oldFields = await Row.findById(id);

    let updatedFields = {
      table: table,
      line: line,
      customer: customer,
      fluig_number: fluig_number,
      count_number: count_number,
      last_count_number: last_count_number,
      digital_table: digital_table,
      counter: counter,
      material: material,
      stop_table: stop_table,
      planing_date: planing_date,
      observation: observation,
      date_revision: date_revision,
      team: team,
      desabled: desabled,
      revision: revision,
      updated_at: new Date(),
    };

    if (count_number >= stop_table - 3) {
      const notificationData = {
        title: "Mesa parada necessita manutenção!",
        body: `Mesa atingiu o limite de contagem sem revisão. Foi parada a ${table} na contagem ${count_number} e necessita manutenção`,
        table: table,
        fluig: fluig_number,
      };

      const newNotification = new Notification(notificationData);
      const savedNotification = await newNotification.save();

      const row1 = await Row.findById(id);

      row1.notifications.push(savedNotification._id);
      await row1.save();
    }

    if (count_number < oldFields.count_number) {
      const notificationData = {
        title: "Erro ao gravar contagem",
        body: `Ao gravar o numero da mesa foi idenficado o erro: o numero de contagem enviado é menor que a ultima contagem. (numero antigo: ${oldFields.count_number}, numero atual: ${count_number})`,
        table: table,
        fluig: fluig_number,
      };

      const newNotification = new Notification(notificationData);
      const savedNotification = await newNotification.save();

      const row1 = await Row.findById(id);

      row1.notifications.push(savedNotification._id);
      await row1.save();
    }

    const row = await Row.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { upsert: true, new: true }
    );
    return res.status(200).json(row);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem to find the Row" });
  }
});

routes.delete("/notifications/:id", async function (req, res) {
  const { id } = req.params;

  try {
    await Notification.findByIdAndDelete(id);
    res.json({ message: "Ok" }).status(204);
  } catch (error) {
    res.status(500).json({ error: "Problem to delete a notification" });
  }
});

routes.delete("/:id", async function (req, res) {
  const { id } = req.params;

  try {
    await Row.findByIdAndDelete(id);
    res.json({ message: "Ok" }).status(204);
  } catch (error) {
    res.status(500).json({ error: "Problem to delete a row" });
  }
});

module.exports = routes;
