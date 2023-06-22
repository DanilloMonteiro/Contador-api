const routes = require("express").Router();
const Table = require("./models/Table");

routes.get("/", async (req, res) => {
  try {
    let tables = await Table.find();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the list of table" });
  }
});

routes.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    let table = await Table.findById(id);
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the table" });
  }
});

routes.post("/", async (req, res) => {
  const {
    mesa,
    linha,
    cliente,
    nFluig,
    nCiclos,
    contador,
    materialDisp,
    datePlan,
    observation,
    team,
  } = req.body;
  let table = new Table({
    mesa: mesa,
    linha: linha,
    cliente: cliente,
    nFluig: nFluig,
    nCiclos: nCiclos,
    contador: contador,
    materialDisp: materialDisp,
    datePlan: datePlan,
    observation: observation,
    team: team,
  });

  try {
    await table.save();

    res.status(200).json(table);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem to create a new contador" });
  }
});

routes.put("/:id", async function (req, res) {
  const {
    mesa,
    linha,
    cliente,
    nFluig,
    nCiclos,
    contador,
    materialDisp,
    datePlan,
    observation,
    team,
  } = req.body;
  const { id } = req.params;

  try {
    let table = await Table.findByIdAndUpdate(
      id,
      {
        $set: {
          mesa: mesa,
          linha: linha,
          cliente: cliente,
          nFluig: nFluig,
          nCiclos: nCiclos,
          contador: contador,
          materialDisp: materialDisp,
          datePlan: datePlan,
          observation: observation,
          team: team,
          updated_at: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the table" });
  }
});

routes.delete("/:id", async function (req, res) {});

module.exports = routes;
