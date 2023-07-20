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
    planing_date,
    observation,
    date_revision,
    notification_id,
    team,
    revision,
  } = req.body;
  let row = new Row({
    table: table,
    line: line,
    customer: customer,
    fluig_number: fluig_number,
    count_number: count_number,
    notification_id: notification_id,
    counter: counter,
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
    planing_date,
    observation,
    date_revision,
    notification_id,
    team,
    desabled,
    revision,
  } = req.body;
  const { id } = req.params;

  try {
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
      planing_date: planing_date,
      observation: observation,
      notification_id: notification_id,
      date_revision: date_revision,
      team: team,
      desabled: desabled,
      revision: revision,
      updated_at: new Date(),
    };

    // console.log("1");
    // let noti;
    // let noti2;

    // if (updatedFields.count_number !== count_number) {
    //   console.log("2");
    //   updatedFields.last_count_number = new Date();
    // } else {
    //   console.log("3");
    //   let notifications = {
    //     body: "O numero recebido é menor que o anterior",
    //     row_id: id,
    //   };
    //   noti = await Notification.create(notifications);

    //   // Adiciona a notificação ao array notification_id
    //   if (updatedFields.notification_id) {
    //     updatedFields.notification_id.push(noti._id);
    //   } else {
    //     updatedFields.notification_id = [noti._id];
    //   }
    // }

    console.log("4");

    let row = await Row.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { upsert: true, new: true }
    );
    return res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the Row" });
  }
});

routes.delete("/:id", async function (req, res) {});

module.exports = routes;
