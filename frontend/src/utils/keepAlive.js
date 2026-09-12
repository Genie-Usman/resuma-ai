import { BASE_URL, API_PATHS } from "./apiPaths";

let lastPingTime = 0;

/**
 * Sends a lightweight keepalive ping to the backend API.
 */
export const pingServer = async () => {
  try {
    const baseUrl = (BASE_URL || "").replace(/\/+$/, "");
    const pingUrl = `${baseUrl}${API_PATHS.PING}`;
    lastPingTime = Date.now();
    await fetch(pingUrl, {
      method: "GET",
      cache: "no-store",
    });
  } catch {
    // Silently ignore keepalive ping failures in the client
  }
};

/**
 * Starts a background heartbeat that keeps the server awake:
 * 1. Pings immediately on application load.
 * 2. Pings periodically every 5 minutes while the app is open.
 * 3. Pings immediately when the tab is refocused if > 3 minutes elapsed.
 */
export const startKeepAliveHeartbeat = () => {
  // 1. Initial warm-up ping
  pingServer();

  // 2. Periodic heartbeat (every 5 minutes)
  const intervalId = setInterval(pingServer, 5 * 60 * 1000);

  // 3. Tab refocus wake-up listener
  const handleWakeUp = () => {
    if (document.visibilityState === "visible" && Date.now() - lastPingTime > 3 * 60 * 1000) {
      pingServer();
    }
  };

  window.addEventListener("visibilitychange", handleWakeUp);
  window.addEventListener("focus", handleWakeUp);

  return () => {
    clearInterval(intervalId);
    window.removeEventListener("visibilitychange", handleWakeUp);
    window.removeEventListener("focus", handleWakeUp);
  };
};
