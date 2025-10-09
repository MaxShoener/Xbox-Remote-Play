import express from "express";
import { RTCPeerConnection } from "wrtc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

// Serve React build
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.post("/api/session", async (req, res) => {
  console.log("Session start:", req.body);
  const pc = new RTCPeerConnection();
  pc.ondatachannel = (event) => {
    const channel = event.channel;
    console.log("Data channel opened");
    channel.onmessage = (m) => console.log("Input:", m.data);
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  res.json({ sdpOffer: offer.sdp });
});

// For SPA routing
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
