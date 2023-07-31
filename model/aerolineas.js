const mongoose = require("mongoose");

// Definimos el esquema para la colección "Aerolineas"
const aerolineaSchema = new mongoose.Schema({
  Aerolinea: {
    type: String,
    required: true,
  },
  Asiento: {
    type: String,
    required: true,
  },
  Destino: {
    type: String,
    required: true,
  },
  FechaLlegada: {
    type: String,
    required: true,
  },
  FechaSalida: {
    type: String,
    required: true,
  },
  PaisSalida: {
    type: String,
    required: true,
  },
  Precio: {
    type: String,
    required: true,
  },
});

// Creamos el modelo "Aerolinea" basado en el esquema
const Aerolinea = mongoose.model("aerolineas", aerolineaSchema);

module.exports = Aerolinea;
