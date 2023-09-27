const express = require("express");
const Board = require("../models/Board");
const Row = require("../models/Row");
const routes = express.Router();

var mqtt = require("mqtt");

var options = {
  host: "6596d56e9ba5437781a17a0edd528963.s2.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "DanilloBra",
  password: "braBRA1414",
};

// initialize the MQTT client
var client = mqtt.connect(options);

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

      isANewBoard = true;

      await newBoard.save();
    }

    let row = await Row.findOne({ board: board._id });

    if (row) {
      res
        .status(200)
        .json({ id: row._id, status: "connected", counter: row.count_number });
    } else if (isANewBoard == true) {
      res.status(200).json({ status: "New board created and cant find a row" });
    } else if (!row) {
      res.status(200).json({ status: "Can't find a row" });
    }
  } catch (error) {
    res.status(500).json({ error: "Problem in route /boards/mac/mac:" });
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

    if (board) {
      client.publish("command1", mac);
    }

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
