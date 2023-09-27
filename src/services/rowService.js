const Board = require("../models/Board");
const Row = require("../models/Row");
var mqtt = require("mqtt");
const config = require("../config/database");

var client = mqtt.connect(config.mqtt);

async function updateRevisionRow(id, index, new_date, revType) {
  try {
    const row = await Row.findById(id).populate("board");

    if (!row) {
      throw new Error("Row not found");
    }

    if (revType == 0) {
      if (index >= 0 && index < row.revision.length) {
        const rowRevision = row.revision[index];

        rowRevision.date = new_date;
        rowRevision.checked = true;
        rowRevision.ready_filter = true;
        rowRevision.date_filter = true;
        rowRevision.ready = true;
        row.material = false;
        row.planing_date = null;

        row.markModified("revision");
      }
    } else {
      if (index >= 0 && index < row.revision_time.length) {
        const rowRevision = row.revision_time[index];

        rowRevision.date = new_date;
        rowRevision.checked = true;
        rowRevision.ready_filter = true;
        rowRevision.date_filter = true;
        rowRevision.ready = true;
        row.material = false;
        row.planing_date = null;

        if (row.count_number >= row.next_revision - 15000) {
          for (let i = 0; i < 41; i++) {
            if (row.revision[i].checked == false) {
              row.revision[i].date = new_date;
              row.revision[i].checked = true;
              row.revision[i].ready_filter = true;
              row.revision[i].date_filter = true;
              row.revision[i].ready = true;

              i = 42;

              row.markModified("revision");
            }
          }
        }

        row.markModified("revision_time");
      }
    }

    await row.save(); // Atualize o documento existente

    return row;
  } catch (error) {
    throw new Error("Problem updating the Row");
  }
}

async function updateRow(id, data) {
  try {
    const rowStatus = await Row.findById(id);
    let status;

    if (
      rowStatus.count_number < rowStatus.next_revision - 5000 ||
      rowStatus.date_revision > 30
    ) {
      status = "green";
    } else if (
      rowStatus.count_number < rowStatus.next_revision ||
      rowStatus.date_revision > 2
    ) {
      status = "yellow";
    } else {
      status = "red";
    }

    const updatedFields = {
      table: data.table,
      line: data.line,
      customer: data.customer,
      fluig_number: data.fluig_number,
      count_number: data.count_number,
      last_count_date: data.last_count_date,
      digital_table: data.digital_table,
      material: data.material,
      planing_date: data.planing_date,
      observation: data.observation,
      team: data.team,
      count_status: status,
      date_revision: data.date_revision,
      notifications: data.notifications,
      next_revision: data.next_revision,
      revision: data.revision,
      disabled: data.disabled,
      updated_at: new Date(),
    };

    const row = await Row.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { upsert: true, new: true }
    );

    if (!row) {
      throw new Error("Row not found");
    }

    return row;
  } catch (error) {
    throw new Error("Problem updating the Row");
  }
}

async function checkRevision(id) {
  try {
    const row1 = await Row.findById(id).populate("board");
    const rev = row1.revision;
    var next_revision;

    if (!row1) {
      throw new Error("Row not found");
    }

    for (i = 0; i < 39; i++) {
      if (rev[i].checked == false) {
        next_revision = rev[i].stop;
        i = 40;
      }
    }

    const row = await Row.findByIdAndUpdate(
      id,
      { $set: { next_revision } },
      { upsert: true, new: true }
    );

    return row;
  } catch (error) {
    throw new Error("Problem updating the Row");
  }
}

async function changeBoard(id, data) {
  const row = await Row.findById(id).populate("board");
  try {
    if (data.board) {
      const actualBoard = await Board.findById(data.board);
      if (data.board._id !== String(row.board._id)) {
        const payload = actualBoard.mac;
        client.publish("command1", payload); // comando que gera a troca de row na placa

        const updatedFields = {
          board: data.board,
          updated_at: new Date(),
        };

        const row2 = await Row.findByIdAndUpdate(
          id,
          { $set: updatedFields },
          { upsert: true, new: true }
        );

        if (!row2) {
          throw new Error("Row not found");
        }

        Board.findByIdAndUpdate(
          data.board,
          { $set: { board_free: false } },
          { upsert: true, new: true }
        )
          .then((updatedDoc) => {
            // O documento foi atualizado e salvo com sucesso
            // console.log("Documento atualizado 1:", updatedDoc);
          })
          .catch((error) => {
            // Trate os erros de atualização aqui
            // console.error("Erro ao atualizar o documento:", error);
          });

        const oldBoard = row.board._id; //tem  coisa errada aqui e na atualizao de varios campos pois caso ele receba board antes agora ja vai ter trocado fugindo da ferificação ate amanha danillo

        const updatedBoard = {
          row: null,
          board_free: true,
          date_free: Date.now(),
        };

        Board.findByIdAndUpdate(
          oldBoard,
          { $set: updatedBoard },
          { upsert: true, new: true }
        )
          .then((updatedDoc) => {
            // O documento foi atualizado e salvo com sucesso
            // console.log("Documento atualizado 2:", updatedDoc);
          })
          .catch((error) => {
            // Trate os erros de atualização aqui
            // console.error("Erro ao atualizar o documento:", error);
          });
      } else {
        console.log("Row with same Board!");
      }
    } else {
      console.log("Row without board!");
    }
    return row;
  } catch (error) {
    throw new Error("Problem updating the Row");
  }
}

async function deleteRow(id) {
  await Row.findByIdAndDelete(id);
}

async function createRow(data) {
  const revisionArray = [
    {
      code: "R0",
      date: Date.now(),
      date_filter: true,
      ready: true,
      ready_filter: true,
      checked: true,
      stop: 0,
    },
  ];

  const revisionTimeArray = [];

  for (let i = 0; i <= 39; i++) {
    var code;
    var stop;

    if (i == 0) {
      code = `R30`;
      stop = 30000;
    } else {
      code = `R${30 + i * 25}`;
      stop = 30000 + i * 25000;
    }

    const revisionItem = {
      code,
      date_filter: true,
      ready: false,
      ready_filter: true,
      checked: false,
      stop,
    };

    revisionArray.push(revisionItem);
  }

  for (let i = 0; i <= 19; i++) {
    var code;
    var stop;

    code = `Revisão por tempo ${i + 1}`;

    const revisionItem = {
      code,
      date_filter: true,
      ready: false,
      ready_filter: true,
      checked: false,
    };

    revisionTimeArray.push(revisionItem);
  }

  let row = new Row({
    table: data.table,
    line: data.line,
    customer: data.customer,
    fluig_number: data.fluig_number,
    count_number: data.count_number,
    last_count_date: data.last_count_date,
    digital_table: data.digital_table,
    board: data.board,
    material: data.material,
    planing_date: data.planing_date,
    observation: data.observation,
    team: data.team,
    count_status: data.status,
    next_revision: data.next_revision,
    date_revision: data.date_revision,
    notifications: data.notifications,
    revision: revisionArray,
    revision_time: revisionTimeArray,
    disabled: data.disabled,
  });

  if (row.count_number < row.next_revision - 5000) {
    row.count_status = "green";
  } else if (row.count_number < row.next_revision) {
    row.count_status = "yellow";
  } else {
    row.count_status = "red";
  }

  await row.save();

  return row;
}

async function date_revision(id) {
  try {
    const row = await Row.findById(id).populate("board");

    let lastRevisionDate;
    let lastRevisionTimeDate;
    let doc;

    for (let i = 0; i <= 39; i++) {
      if (row.revision[i].checked === false) {
        lastRevisionDate = row.revision[i - 1].date;
        i = 40;
      }
    }

    for (let i = 0; i <= 19; i++) {
      if (row.revision_time[i].checked === false) {
        if (i == 0) {
          lastRevisionTimeDate = row.revision_time[i].date;
          i = 20;
        } else {
          lastRevisionTimeDate = row.revision_time[i - 1].date;
          i = 20;
        }
      }
    }

    if (lastRevisionTimeDate == undefined || lastRevisionTimeDate == null) {
      // Converta as strings em objetos de data
      const lastRevisionDateObj = new Date(lastRevisionDate);

      // Obtenha a data atual
      const currentDate = new Date();

      // Calcule a diferença em milissegundos
      const differenceInMilliseconds = currentDate - lastRevisionDateObj;

      // Converta a diferença em dias
      const daysToRevision = differenceInMilliseconds / (1000 * 60 * 60 * 24);

      const daysToRevisionInt = Math.max(0, Math.floor(daysToRevision));

      const daysToOneYear = 365 - daysToRevisionInt;
      // Arredonda o número para baixo e converte para inteiro

      doc = daysToOneYear;
    } else {
      // Converta as strings em objetos de data
      const lastRevisionDateObj = new Date(lastRevisionDate);
      const lastRevisionTimeDateObj = new Date(lastRevisionTimeDate);

      // Obtenha a data atual
      const currentDate = new Date();

      // Calcule a diferença em milissegundos
      const differenceInMilliseconds = currentDate - lastRevisionTimeDateObj;
      const differenceInMilliseconds2 = currentDate - lastRevisionDateObj;

      // Converta a diferença em dias
      const daysToRevisionTime =
        differenceInMilliseconds / (1000 * 60 * 60 * 24);
      const daysToRevision = differenceInMilliseconds2 / (1000 * 60 * 60 * 24);

      const daysToRevisionTimeInt = Math.max(0, Math.floor(daysToRevisionTime));
      const daysToRevisionInt = Math.max(0, Math.floor(daysToRevision));

      daysToOneYearTime = 365 - daysToRevisionTimeInt;
      daysToOneYear = 365 - daysToRevisionInt;

      if (daysToOneYear > daysToOneYearTime) {
        doc = daysToOneYear;
      } else {
        doc = daysToOneYearTime;
      }
      // Arredonda o número para baixo e converte para inteiro
    }

    const row2 = await Row.findByIdAndUpdate(
      id,
      { $set: { date_revision: doc } },
      { upsert: true, new: true }
    );

    return row2;
  } catch (error) {
    throw new Error("Problem updating the Row");
  }
}

module.exports = {
  changeBoard,
  checkRevision,
  updateRow,
  deleteRow,
  updateRevisionRow,
  createRow,
  date_revision,
};
