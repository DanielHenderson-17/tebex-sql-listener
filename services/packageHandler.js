const db = require("../db/connection");

async function handle(event) {
  const eventType = event.event_id;
  const player = event.player;
  const packageInfo = event.package;

  if (!player || !player.id || !packageInfo) {
    return { status: 400, message: "Missing player or package data" };
  }

  const steamId = player.id;
  const packageName = packageInfo.name;

  switch (eventType) {
    case "payment_completed":
      return handlePoints(steamId, packageName);

    // You can add more handlers here as needed
    // case 'subscription_created': ...
    // case 'refund_issued': ...

    default:
      return { status: 200, message: `Ignored event: ${eventType}` };
  }
}

async function handlePoints(steamId, packageName) {
  // 🔧 TEMP: map package name → points
  const pointsMap = {
    "500 Points": 500,
    "1000 Points": 1000,
    "VIP Subscription": 2500,
  };

  const points = pointsMap[packageName];
  if (!points) {
    return {
      status: 200,
      message: `No points mapped for package: ${packageName}`,
    };
  }

  try {
    const [result] = await db.execute(
      "UPDATE arkshopplayers SET Points = Points + ? WHERE SteamId = ?",
      [points, steamId]
    );

    if (result.affectedRows === 0) {
      return { status: 404, message: `SteamId not found: ${steamId}` };
    }

    return { status: 200, message: `✅ Added ${points} points to ${steamId}` };
  } catch (err) {
    console.error("DB error:", err);
    return { status: 500, message: "Database error" };
  }
}

module.exports = { handle };
