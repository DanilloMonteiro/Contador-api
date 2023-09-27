// config.js

module.exports = {
  // Configurações gerais da aplicação
  app: {
    port: process.env.PORT || 3001,
    secretKey: process.env.SECRET_KEY || "sua_chave_secreta",
  },

  // Configurações do banco de dados
  database: {
    url: "mongodb://127.0.0.1/Contador",
    options: {
      useNewUrlParser: true,
      // Outras opções do MongoDB, se necessário
    },
  },

  // Configurações MQTT
  mqtt: {
    host: "172.29.11.154",
    port: 1883,
    protocol: "mqtt",
    username: "Esp32mqtt",
    password: "braBRA1414",
  },
};
