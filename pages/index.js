import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState(null);

  const login = () => {
    window.location.href = "/api/auth";
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#111",
        color: "#fff",
        fontFamily: "sans-serif"
      }}
    >
      <h1>🎮 Xbox Remote Web</h1>
      {!user ? (
        <button
          onClick={login}
          style={{
            marginTop: 20,
            padding: "12px 24px",
            background: "#107C10",
            border: "none",
            color: "white",
            fontSize: "16px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Sign in with Microsoft
        </button>
      ) : (
        <p>Welcome, {user.gamertag}!</p>
      )}
    </main>
  );
}