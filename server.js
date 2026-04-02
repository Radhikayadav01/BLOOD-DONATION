require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("DB Error ❌", err));

// ================= SCHEMAS =================

const donorSchema = new mongoose.Schema({
  name: String,
  blood_group: String,
  city: String,
  phone: String,
  is_available: { type: Boolean, default: true }
});

const requestSchema = new mongoose.Schema({
  blood_group: String,
  hospital: String,
  contact: String,
  status: { type: String, default: "open" }
});

const Donor = mongoose.model("Donor", donorSchema);
const Request = mongoose.model("Request", requestSchema);

// ================= ROUTES =================

// Test Route
app.get("/", (req, res) => {
  res.send("Server + DB Connected ✅");
});

// Add Donor
app.post("/donor", async (req, res) => {
  const donor = new Donor(req.body);
  await donor.save();
  res.json({ message: "Donor Added ✅" });
});

// Add Request
app.post("/request", async (req, res) => {
  const request = new Request(req.body);
  await request.save();
  res.json({ message: "Request Added ✅" });
});

// Stats (IMPORTANT 🔥)
app.get("/stats", async (req, res) => {
  try {
    const donors = await Donor.countDocuments();
    const requests = await Request.countDocuments();

    res.json({
      donors: donors,
      requests: requests
    });
  } catch (err) {
    res.json({ donors: 0, requests: 0 });
  }
});


// ================= SERVER =================
const path = require("path");

app.use(express.static(path.resolve("client")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("client", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
