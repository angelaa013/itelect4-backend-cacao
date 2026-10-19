import { randomUUID } from "node:crypto";
import { Router } from "express";
import { connectDatabase } from "../config/database";
import { AdoptionRequestModel, AdopterModel, PetModel } from "../models";

const router = Router();

router.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/pets", async (_req, res) => {
  const pets = await PetModel.find().select({ _id: 0 }).lean().exec();
  res.json(pets);
});

router.get("/pets/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ error: "Pet ID must be a positive integer" });
    return;
  }

  const pet = await PetModel.findOne({ id }).select({ _id: 0 }).lean().exec();
  if (!pet) {
    res.status(404).json({ error: "Pet not found" });
    return;
  }

  res.json(pet);
});

router.get("/adopters", async (_req, res) => {
  const adopters = await AdopterModel.find().select({ _id: 0 }).lean().exec();
  res.json(adopters);
});

router.get("/requests", async (_req, res) => {
  const requests = await AdoptionRequestModel.find()
    .sort({ requestedDate: -1 })
    .select({ _id: 0 })
    .lean()
    .exec();
  res.json(requests);
});

router.post("/requests", async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ error: "Request body must be a JSON object" });
    return;
  }

  const {
    adopterName,
    adopterAddress,
    adopterContact,
    adopterGithub,
    petName: rawPetName,
    petId: rawPetId,
    requestedDate,
  } = req.body as Record<string, unknown>;

  if (typeof adopterName !== "string" || !adopterName.trim()) {
    res.status(400).json({ error: "adopterName is required" });
    return;
  }

  let petId: number | undefined;
  let petName =
    typeof rawPetName === "string" && rawPetName.trim()
      ? rawPetName.trim()
      : undefined;
  if (rawPetId !== undefined) {
    if (typeof rawPetId !== "number" || !Number.isSafeInteger(rawPetId) || rawPetId < 1) {
      res.status(400).json({ error: "petId must be a positive integer" });
      return;
    }

    petId = rawPetId;
    const pet = await PetModel.findOne({ id: petId }).select({ name: 1 }).lean().exec();
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    petName = pet.name;
  }

  if (!petName) {
    res.status(400).json({ error: "petName or petId is required" });
    return;
  }

  for (const [field, value] of Object.entries({
    adopterAddress,
    adopterContact,
    adopterGithub,
  })) {
    if (value !== undefined && typeof value !== "string") {
      res.status(400).json({ error: `${field} must be a string` });
      return;
    }
  }

  if (
    requestedDate !== undefined &&
    (typeof requestedDate !== "string" || Number.isNaN(Date.parse(requestedDate)))
  ) {
    res.status(400).json({ error: "requestedDate must be a valid date string" });
    return;
  }

  const optionalString = (value: unknown): string | undefined =>
    typeof value === "string" ? value.trim() : undefined;
  const newRequest = new AdoptionRequestModel({
    id: randomUUID(),
    petName,
    adopterName: adopterName.trim(),
    adopterAddress: optionalString(adopterAddress),
    adopterContact: optionalString(adopterContact),
    adopterGithub: optionalString(adopterGithub),
    petId,
    status: "pending",
    requestedDate:
      typeof requestedDate === "string"
        ? requestedDate
        : new Date().toISOString().slice(0, 10),
  });

  const savedRequest = await newRequest.save();
  const response = savedRequest.toObject();
  delete response._id;
  res.status(201).json(response);
});

export default router;
