const express = require("express");
const router = express.Router();
const db = require("../db/connection");

const EXPECTED_TOKEN = process.env.SECRET_TOKEN;

router.get("/", async (req, res) => {
  const { steamId, amount, token } = req.query;

  if (!steamId || !amount) {
    return res.status(400).send("Missing steamId or amount");
  }

  if (token !== EXPECTED_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  try {
    const [result] = await db.execute(
      "UPDATE arkshopplayers SET Points = Points + ? WHERE SteamId = ?",
      [parseInt(amount, 10), steamId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("No matching SteamId found");
    }

    res.send(`Added ${amount} points to ${steamId}`);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
