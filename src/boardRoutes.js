const express = require("express");
const Board = require("./models/Board");
const Row = require("./models/Row");
const routes = express.Router();

routes.get("/", async (req, res) => {
  try {
    let boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: "Problem to find the list of Boards" });
  }
});

routes.get("/mac/:macAddress", async function (req, res) {
  try {
    const { macAddress } = req.params;
    let isANewBoard = false;

    let board = await Board.findOne({ mac: macAddress });

    if (!board) {
      let newBoard = new Board({
        mac: macAddress,
      });

      await newBoard.save();
    }

    let row = await Row.findOne({ board: board._id });

    if (row) {
      res.status(200).json({ id: row._id, status: "connected" });
    } else if (isANewBoard == true) {
      res.status(200).json({ status: "new board created and cant find a row" });
    } else {
      res.status(200).json({ status: "cant find a row" });
    }
  } catch (error) {
    res.status(500).json({ error: "Problem to find the Row 1" });
  }
});

routes.post("/", async (req, res) => {
  const { mac } = req.body;

  try {
    const newBoard = new Board({
      mac: mac,
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new board" });
  }
});

routes.put("/:id", async function (req, res) {
  const { mac, row, board_free } = req.body;
  const { id } = req.params;

  try {
    let updatedFields = {
      mac: mac,
      row: row,
      board_free: board_free,
    };

    const board = await Board.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { upsert: true, new: true }
    );
    return res.status(200).json(board);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Problem to find the Board" });
  }
});

routes.delete("/:id", async function (req, res) {
  const { id } = req.params;

  try {
    await Board.findByIdAndDelete(id);
    res.json({ message: "Ok" }).status(204);
  } catch (error) {
    res.status(500).json({ error: "Problem to delete a board" });
  }
});

module.exports = routes;
