const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

mongoose
  .connect("mongodb://127.0.0.1/Contador", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Conexão com o MongoDB estabelecida"))
  .catch((err) => console.log("Erro ao conectar ao MongoDB:", err));

const contadorSchema = new mongoose.Schema({
  stop_table: String,
  // outras propriedades do seu esquema, se houver
});

const Contador = mongoose.model("Contador", contadorSchema);

// Configuração do WebSocket
io.on("connection", (socket) => {
  console.log("Cliente conectado ao WebSocket");

  // Monitorar as mudanças em "stop_table" usando Change Streams
  const changeStream = Contador.watch({ fullDocument: "updateLookup" });

  // Tratar eventos de mudança
  changeStream.on("change", (change) => {
    const updatedStopTable = change.fullDocument.stop_table;
    console.log("Valor de 'stop_table' atualizado:", updatedStopTable);

    // Envia o valor de "stop_table" para todos os clientes conectados via WebSocket
    io.emit("stop_table_updated", updatedStopTable);
  });

  // Lidar com a desconexão do cliente
  socket.on("disconnect", () => {
    console.log("Cliente desconectado do WebSocket");
    // Fechar o changeStream para liberar recursos quando o cliente se desconectar
    changeStream.close();
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Restante do código da sua aplicação, como rotas e outras configurações

const port = process.env.PORT || 3001;
http.listen(port, () => {
  console.log(`Servidor WebSocket iniciado na porta ${port}`);
});
