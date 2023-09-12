const express = require("express");
const Row = require("./models/Row");
const Notification = require("./models/Notification");
const routes = express.Router();

routes.get("/", async (req, res) => {
  // Rota para listar todas as linhas
  try {
    let rows = await Row.find().populate("board");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the list of Row" });
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

routes.get("/table/:table", async function (req, res) {
  try {
    const { table } = req.params;
    console.log(table);
    let row = await Row.findOne({ table: `Mesa ${table}` }).populate("board");
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the Row" });
  }
});

routes.post("/", async (req, res) => {
  const {
    table,
    line,
    customer,
    fluig_number,
    count_number,
    last_count_date,
    stop_table,
    digital_table,
    board,
    has_counter,
    material,
    planing_date,
    observation,
    team,
    date_revision,
    notifications,
    revision,
    disabled,
  } = req.body;
  let row = new Row({
    table: table,
    line: line,
    customer: customer,
    fluig_number: fluig_number,
    count_number: count_number,
    last_count_date: last_count_date,
    stop_table: stop_table,
    digital_table: digital_table,
    board: board,
    has_counter: has_counter,
    material: material,
    planing_date: planing_date,
    observation: observation,
    team: team,
    date_revision: date_revision,
    notifications: notifications,
    revision: revision,
    disabled: disabled,
  });

  try {
    await row.save();

    res.status(200).json({ row, id: row._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem to create a new Row", id: row._id });
  }
});

routes.put("/:id", async function (req, res) {
  const {
    table,
    line,
    customer,
    fluig_number,
    count_number,
    last_count_date,
    stop_table,
    digital_table,
    board,
    has_counter,
    material,
    planing_date,
    observation,
    team,
    date_revision,
    notifications,
    revision,
    disabled,
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
      last_count_date: last_count_date,
      stop_table: stop_table,
      digital_table: digital_table,
      board: board,
      has_counter: has_counter,
      material: material,
      planing_date: planing_date,
      observation: observation,
      team: team,
      date_revision: date_revision,
      notifications: notifications,
      revision: revision,
      disabled: disabled,
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
