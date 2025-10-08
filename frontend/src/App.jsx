import React, { useRef, useState } from "react";
import * as msal from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";

const msalInstance = new msal.PublicClientApplication(msalConfig);

export default function App() {
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);
  const dataRef = useRef(null);

  const signIn = async () => {
    const res = await msalInstance.loginPopup({ scopes: ["XboxLive.signin"] });
    setUser(res.account);
  };

  const startSession = async () => {
    const resp = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    });
    const data = await resp.json();

    const pc = new RTCPeerConnection();
    const ch = pc.createDataChannel("inputs");
    dataRef.current = ch;
    ch.onopen = () => console.log("Input channel open");

    pc.ontrack = (ev) => {
      videoRef.current.srcObject = ev.streams[0];
    };

    await pc.setRemoteDescription({ type: "offer", sdp: data.sdpOffer });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    console.log("Session started!");
  };

  const sendInput = (msg) => {
    if (dataRef.current?.readyState === "open")
      dataRef.current.send(JSON.stringify(msg));
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>Xbox Remote Web</h1>
      {!user && <button onClick={signIn}>Sign in with Microsoft</button>}
      {user && <button onClick={startSession}>Start Remote Play</button>}
      <video ref={videoRef} autoPlay playsInline style={{ width: "80%", marginTop: 20 }} />
      <div>
        <button onClick={() => sendInput({ key: "A" })}>Send Input A</button>
      </div>
    </div>
  );
}