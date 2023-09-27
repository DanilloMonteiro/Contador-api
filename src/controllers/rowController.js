const rowService = require("../services/rowService");
const notificationService = require("../services/notificationService");

async function updateRow(req, res) {
  try {
    const { id } = req.params;

    await rowService.updateRevisionRow(
      id,
      req.body.index,
      req.body.new_date,
      req.body.revType
    );

    await rowService.updateRow(id, req.body);

    await rowService.checkRevision(id);

    await notificationService.stopTable(id, req.body);

    await rowService.changeBoard(id, req.body);

    const lastRowUpdate = await rowService.date_revision(id);

    // if (count_number < oldFields.count_number) {
    //   const notificationData = {
    //     title: "Erro ao gravar contagem",
    //     body: `Ao gravar o numero da mesa foi idenficado o erro: o numero de contagem enviado é menor que a ultima contagem. (numero antigo: ${oldFields.count_number}, numero atual: ${count_number})`,
    //     table: table,
    //     fluig: fluig_number,
    //   };

    //   const newNotification = new Notification(notificationData);
    //   const savedNotification = await newNotification.save();

    //   rowRevision.notifications.push(savedNotification._id);
    //   await rowRevision.save();
    // }

    return res.status(200).json({ lastRowUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Problem updating the Row" });
  }
}

async function deleteRow(req, res) {
  const { id } = req.params;

  try {
    await rowService.deleteRow(id);
    res.json({ message: "Ok" }).status(204);
  } catch (error) {
    res.status(500).json({ error: "Problem to delete a row" });
  }
}

async function createRow(req, res) {
  const {
    table,
    line,
    customer,
    fluig_number,
    count_number,
    last_count_date,
    digital_table,
    board,
    material,
    planing_date,
    observation,
    team,
    next_revision,
    date_revision,
    notifications,
    disabled,
  } = req.body;

  try {
    const createdRow = await rowService.createRow(req.body);

    res.status(200).json({ createdRow });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem to create a new Row" });
  }
}

module.exports = {
  updateRow,
  deleteRow,
  createRow,
};
