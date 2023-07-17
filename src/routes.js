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
    digital_table,
    material,
    planing_date,
    observation,
    date_revision,
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
    team,
    desabled,
    revision,
  } = req.body;
  const { id } = req.params;

  try {
    let row_count = await Row.findById(id);

    if (row_count.count_number <= count_number) {
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
        date_revision: date_revision,
        team: team,
        desabled: desabled,
        revision: revision,
        updated_at: new Date(),
      };

      // Atualiza last_count_number somente se count_number foi alterado
      if (row_count.count_number !== count_number) {
        console.log(row_count.count_number, "row_count.count_number");
        console.log(count_number, "count_number");
        console.log("aqui");
        updatedFields.last_count_number = new Date();
      }

      let row = await Row.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { upsert: true, new: true }
      );
      return res.status(200).json(row);
    } else {
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
            digital_table: digital_table,
            observation: observation,
            team: team,
            desabled: desabled,
            date_revision: date_revision,
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
