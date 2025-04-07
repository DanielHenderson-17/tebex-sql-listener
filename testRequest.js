const axios = require("axios");

//Mock data for testing
const steamId = "76561198021051512";
const amount = 1000;
const token = "addKeyHere"; // Replace with your actual token from .env file

const url = `http://localhost:5002/api/addpoints?steamId=${encodeURIComponent(
  steamId
)}&amount=${amount}&token=${token}`;

axios
  .get(url)
  .then((res) => {
    console.log("✅ Success:", res.data);
  })
  .catch((err) => {
    console.error("❌ Error:", err.response?.data || err.message);
  });
