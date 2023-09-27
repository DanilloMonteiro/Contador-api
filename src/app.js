const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
var mqtt = require("mqtt");
const config = require("./config/database.js");
const row = require("./models/Row.js");
const board = require("./models/Board.js");

const rowRoutes = require("./routes/rowRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const boardRoutes = require("./routes/boardRoutes.js");

var mqtt = require("mqtt");

const http = require("http").Server(app);

mongoose
  .connect(config.database.url, config.database.options, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Conexão com o MongoDB estabelecida"))
  .catch((err) => console.log("Erro ao conectar ao MongoDB:", err));

// initialize the MQTT client
var client = mqtt.connect(config.mqtt);

// setup the callbacks
client.on("connect", function () {
  console.log("Connected");
});

client.on("error", function (error) {
  console.log(error);
});

client.on("message", function (topic, message) {
  // called each time a message is received
  if (topic == "contador") {
    // console.log("Received message from contagem:", topic, message.toString());

    const parts = message.toString().split(";");

    const counterValue = parts[0];
    const itemId = parts[1];

    // console.log("Counter Value:", counterValue);
    // console.log("Item ID:", itemId);

    if (!itemId || !counterValue) {
      return;
    }

    row
      .findOne({ _id: itemId }) // Substitua 'ID_DA_ROW_AQUI' pelo ID real da row que você deseja modificar
      .then((foundRow) => {
        if (foundRow) {
          // Modifique os campos que você deseja alterar
          foundRow.count_number = counterValue; // Substitua 'nomeDoCampo' e 'novoValor' pelos valores reais
          foundRow.last_count_date = Date.now();

          // Salve a row modificada no banco de dados
          foundRow
            .save()
            .then((modifiedRow) => {
              // console.log("Row modificada:", modifiedRow._id);
              // Aqui você pode enviar uma resposta para o cliente, indicando que a modificação foi bem-sucedida
            })
            .catch((error) => {
              // console.error("Erro ao salvar a row modificada:", error);
              // Aqui você pode enviar uma resposta de erro para o cliente
            });
        } else {
          console.log("Row não encontrada");
          // Aqui você pode enviar uma resposta para o cliente informando que a row não foi encontrada
        }
      })
      .catch((error) => {
        console.error("Erro ao encontrar a row:", error);
        // Aqui você pode enviar uma resposta de erro para o cliente
      });
  }

  // console.log("Received message:", topic, message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe("contador");
client.subscribe("MQTT-1-rowData");

// publish message 'Hello' to topic 'my/test/topic'
client.publish("my/test/topic", "Hello");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Use as rotas relacionadas a cada modelo
app.use("/rows", rowRoutes);
app.use("/notifications", notificationRoutes);
app.use("/boards", boardRoutes);

const port = config.app.port;
// Restante do código da sua aplicação, como rotas e outras configurações

http.listen(port, () => {
  console.log(`Servidor http iniciado na porta ${port}`);
});
