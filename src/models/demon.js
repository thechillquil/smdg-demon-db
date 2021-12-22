var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var DemonSchema = new Schema({
  name: {type: String, required: true, unique: true, default: ""},
  displayName: {type: String, default: ""},
  level: {type: Number, default: 0},
  arcana: {type: String, default: ""},
  alignment: {type: String, default: ""},
  size: {type: String, default: ""},
  personality: {type: String, default: ""},
  evolvesTo: {type: String, default: null},
  primaryElement: {type: String, default: ""},
  HP: {type: Number, default: 0},
  SP: {type: Number, default: 0},
  movement: {type: Number, default: 0},
  movementModifier: {type: String, default: ""},
  itemizedInto: {type: String, default: ""},
  itemizedCategory: {type: String, default: ""},
  knowledge: {type: Number, default: 0},
  guts: {type: Number, default: 0},
  proficiency: {type: Number, default: 0},
  empathy: {type: Number, default: 0},
  charm: {type: Number, default: 0},
  strength: {type: Number, default: 0},
  magic: {type: Number, default: 0},
  endurance: {type: Number, default: 0},
  agility: {type: Number, default: 0},
  luck: {type: Number, default: 0},
  weaknesses: [String],
  resistances: [String],
  blocks: [String],
  repels: [String],
  drains: [String],
  traits: [
    {
      name: {type: String, default: ""},
      description: {type: String, default: ""}
    }
  ],
  skills: [
    {
      name: {type: String, default: ""},
      description: {type: String, default: ""}
    }
  ],
  background: {type: String, default: ""}
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

DemonSchema.virtual("evolvesToReference", {
  ref: "Demon",
  localField: "evolvesTo",
  foreignField: "name",
  justOne: true
});

module.exports = mongoose.model("Demon", DemonSchema);
