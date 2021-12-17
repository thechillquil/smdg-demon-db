var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var DemonSchema = new Schema({
  name: {type: String, required: true, unique: true},
  level: Number,
  arcana: String,
  alignment: String,
  size: String,
  personality: String,
  evolvesTo: String,
  primaryElement: String,
  HP: Number,
  SP: Number,
  movement: Number,
  movementModifier: String,
  itemizedInto: String,
  itemizedCategory: String,
  knowledge: Number,
  guts: Number,
  proficiency: Number,
  empathy: Number,
  charm: Number,
  strength: Number,
  magic: Number,
  endurance: Number,
  agility: Number,
  luck: Number,
  weaknesses: [String],
  resistances: [String],
  blocks: [String],
  repels: [String],
  drains: [String],
  traits: [String],
  skills: [String],
  background: String
});

module.exports = mongoose.model("Demon", DemonSchema);
