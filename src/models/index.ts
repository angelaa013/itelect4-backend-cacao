import { model, models, Schema } from "mongoose";

const petSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["dog", "cat", "bird", "other"] },
    breed: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, enum: ["male", "female", "unknown"] },
    description: { type: String, trim: true },
    vaccinated: { type: Boolean },
    adoptionFee: { type: Number, min: 0 },
  },
  { versionKey: false, collection: "pets" },
);

const adopterSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    contact: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { versionKey: false, collection: "adopters" },
);

const adoptionRequestSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    petName: { type: String, required: true, trim: true },
    adopterName: { type: String, required: true, trim: true },
    adopterAddress: { type: String, trim: true },
    adopterContact: { type: String, trim: true },
    adopterGithub: { type: String, trim: true },
    petId: { type: Number },
    adopterId: { type: Number },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
    },
    requestedDate: { type: String, required: true },
    totalFee: { type: Number, min: 0 },
  },
  { versionKey: false, collection: "requests" },
);

export const PetModel = models.Pet ?? model("Pet", petSchema);
export const AdopterModel = models.Adopter ?? model("Adopter", adopterSchema);
export const AdoptionRequestModel =
  models.AdoptionRequest ?? model("AdoptionRequest", adoptionRequestSchema);
