const routes = require("express").Router();
const Row = require("./models/Row");

routes.get("/", async (req, res) => {
  try {
    let rows = await Row.find();
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

routes.post("/", async (req, res) => {
  const {
    table,
    line,
    customer,
    fluig_number,
    count_number,
    counter,
    material,
    planing_date,
    observation,
    team,
    revision,
  } = req.body;
  let row = new Row({
    table: table,
    line: line,
    customer: customer,
    fluig_number: fluig_number,
    count_number: count_number,
    counter: counter,
    material: material,
    planing_date: planing_date,
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
    counter,
    material,
    planing_date,
    observation,
    team,
    revision,
  } = req.body;
  const { id } = req.params;

  try {
    let row_count = await Row.findById(id);

    if (row_count.count_number !== count_number) {
      let row = await Row.findByIdAndUpdate(
        id,
        {
          $set: {
            table: table,
            line: line,
            customer: customer,
            fluig_number: fluig_number,
            count_number: count_number,
            counter: counter,
            material: material,
            planing_date: planing_date,
            observation: observation,
            team: team,
            revision: revision,
            updated_at: new Date(),
          },
        },
        { upsert: true, new: true }
      );
      return res.status(200).json(row);
    } else if (row_count.count_number == count_number) {
      let row = await Row.findByIdAndUpdate(
        id,
        {
          $set: {
            table: table,
            line: line,
            customer: customer,
            fluig_number: fluig_number,
            counter: counter,
            material: material,
            planing_date: planing_date,
            observation: observation,
            team: team,
            revision: revision,
          },
        },
        { upsert: true, new: true }
      );
      return res.status(200).json(row);
    }
  } catch (error) {
    res.status(500).json({ error: "Problem to find the Row" });
  }
});

routes.delete("/:id", async function (req, res) {});

module.exports = routes;
