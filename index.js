const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const addPointsRoute = require("./routes/addPoints");
const webhookRoute = require("./routes/webhook");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Security middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, slow down 🐌",
});
app.use(limiter);

// Form data and JSON
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/addpoints", addPointsRoute);
app.use("/api/webhook", webhookRoute);

app.listen(PORT, () => {
  console.log(`Tebex SQL listener running on port ${PORT}`);
});
