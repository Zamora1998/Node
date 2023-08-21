const mongoose = require("mongoose");

const curriculumSchema = new mongoose.Schema({
  Nombre: String,
  pdfFile: {
    filename: String,
    fileId: mongoose.Schema.Types.ObjectId,
  },
});

const Curriculum = mongoose.model("Curriculum", curriculumSchema);

module.exports = Curriculum;
