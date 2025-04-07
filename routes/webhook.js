const express = require("express");
const router = express.Router();
const packageHandler = require("../services/packageHandler");

const EXPECTED_TOKEN = process.env.SECRET_TOKEN;

router.post("/", express.json(), async (req, res) => {
  const event = req.body;

  if (event?.type === "validation.webhook") {
    return res.status(200).send("Validation OK");
  }

  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${EXPECTED_TOKEN}`) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const result = await packageHandler.handle(event);
    res.status(result.status).send(result.message);
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Internal error");
  }
});

module.exports = router;
