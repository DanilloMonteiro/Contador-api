const express = require("express");
const Row = require("../models/Row");
const rowController = require("../controllers/rowController");
const routes = express.Router();

routes.get("/", async (req, res) => {
  // Rota para listar todas as linhas

  try {
    const filter = {};

    if (req.query.table !== "" && req.query.table !== "undefined") {
      filter.table = req.query.table;
    }

    if (req.query.line !== "" && req.query.line !== "undefined") {
      filter.line = req.query.line;
    }

    if (req.query.customer !== "" && req.query.customer !== "undefined") {
      filter.customer = req.query.customer;
    }

    if (req.query.fluig !== "" && req.query.fluig !== "undefined") {
      filter.fluig_number = req.query.fluig;
    }

    if (
      req.query.highCount !== "undefined" &&
      req.query.lowCount !== "undefined" &&
      req.query.highCount !== "" &&
      req.query.lowCount !== ""
    ) {
      // Crie uma condição de filtro para o campo count
      filter.count_number = {
        $gte: req.query.lowCount, // Maior ou igual a valorMin
        $lte: req.query.highCount, // Menor ou igual a valorMax
      };
    }

    if (req.query.digital !== "" && req.query.digital !== "undefined") {
      filter.digital_table = req.query.digital;
    }

    if (req.query.material !== "" && req.query.material !== "undefined") {
      filter.material = req.query.material;
    }

    let rows = await Row.find(filter).populate("board");

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the list of Row" });
  }
});

routes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let row = await Row.findById(id);
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the Row" });
  }
});

routes.get("/table/:table", async (req, res) => {
  try {
    const { table } = req.params;
    console.log(table);
    let row = await Row.findOne({ table: `${table}` }).populate("board");
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the Row" });
  }
});

routes.post("/", rowController.createRow);

routes.put("/:id", rowController.updateRow);

routes.delete("/:id", rowController.deleteRow);

module.exports = routes;
