const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Apellido: { type: String, required: true },
  Correo: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
}); // Especifica la colección aquí

const User = mongoose.model("users", userSchema);

module.exports = User;
