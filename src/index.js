const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const rowRoutes = require("./rowRoutes");
const notificationRoutes = require("./notificationRoutes");
const boardRoutes = require("./boardRoutes");

const row = require("./models/Row");

var mqtt = require("mqtt");

const http = require("http").Server(app);

mongoose
  .connect("mongodb://127.0.0.1/Contador", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Conexão com o MongoDB estabelecida"))
  .catch((err) => console.log("Erro ao conectar ao MongoDB:", err));

// app.use(bodyParser.json());

// const serialPort = new SerialPort("COM1", {
//   baudRate: 115200,
// });

// app.post("/enviar-comando-serial", (req, res) => {
//   const { comando } = req.body;
//   if (!serialPort.isOpen) {
//     return res.status(500).send("Conexão serial não está estabelecida.");
//   }

//   serialPort.write(comando, (error) => {
//     if (error) {
//       console.error("Erro ao enviar comando serial:", error);
//       res.status(500).send("Erro ao enviar comando serial.");
//     } else {
//       console.log("Comando enviado: " + comando);
//       res.status(200).send("Comando enviado com sucesso.");
//     }
//   });
// });

var options = {
  host: "6596d56e9ba5437781a17a0edd528963.s2.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "DanilloBra",
  password: "braBRA1414",
};

// initialize the MQTT client
var client = mqtt.connect(options);

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
    console.log("Received message from contagem:", topic, message.toString());

    const parts = message.toString().split(";");

    const counterValue = parts[0];
    const itemId = parts[1];

    console.log("Counter Value:", counterValue);
    console.log("Item ID:", itemId);

    if (!itemId || !counterValue) {
      return;
    }

    row
      .findOne({ _id: itemId }) // Substitua 'ID_DA_ROW_AQUI' pelo ID real da row que você deseja modificar
      .then((foundRow) => {
        if (foundRow) {
          // Modifique os campos que você deseja alterar
          foundRow.count_number = counterValue; // Substitua 'nomeDoCampo' e 'novoValor' pelos valores reais

          // Salve a row modificada no banco de dados
          foundRow
            .save()
            .then((modifiedRow) => {
              console.log("Row modificada:", modifiedRow._id);
              // Aqui você pode enviar uma resposta para o cliente, indicando que a modificação foi bem-sucedida
            })
            .catch((error) => {
              console.error("Erro ao salvar a row modificada:", error);
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
  console.log("Received message:", topic, message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe("contador");

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

// Restante do código da sua aplicação, como rotas e outras configurações

const port = process.env.PORT || 3001;
http.listen(port, () => {
  console.log(`Servidor WebSocket iniciado na porta ${port}`);
});
