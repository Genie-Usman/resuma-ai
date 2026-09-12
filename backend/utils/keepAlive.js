/**
 * Self-ping Keep-Alive utility to prevent servers (e.g. Render, Railway, Fly, Heroku) from going to sleep.
 * Checks for BACKEND_URL, SERVER_URL, or RENDER_EXTERNAL_URL in environment variables.
 */
function startKeepAlive() {
  const targetUrl =
    process.env.BACKEND_URL ||
    process.env.SERVER_URL ||
    process.env.RENDER_EXTERNAL_URL;

  if (!targetUrl) {
    return;
  }

  // Default interval: 10 minutes (well before standard 15-minute sleep thresholds)
  const intervalMinutes = parseInt(process.env.PING_INTERVAL_MINUTES, 10) || 10;
  const intervalMs = intervalMinutes * 60 * 1000;
  const pingUrl = `${targetUrl.replace(/\/+$/, "")}/api/ping`;

  console.log(`[KeepAlive] Self-ping active: Pinging ${pingUrl} every ${intervalMinutes} minutes.`);

  setInterval(async () => {
    try {
      const response = await fetch(pingUrl);
      if (response.ok) {
        console.log(`[KeepAlive] Self-ping successful at ${new Date().toLocaleTimeString()} (HTTP ${response.status})`);
      } else {
        console.warn(`[KeepAlive] Self-ping received status ${response.status}`);
      }
    } catch (err) {
      console.warn(`[KeepAlive] Self-ping network error: ${err.message}`);
    }
  }, intervalMs);
}

module.exports = {
  startKeepAlive,
};
