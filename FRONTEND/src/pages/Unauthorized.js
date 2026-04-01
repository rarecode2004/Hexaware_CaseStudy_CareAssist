import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <Navbar slim />
      <div className="auth-bg" aria-hidden="true" />

      <main style={{
        position:"relative", zIndex:5, flex:1,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", gap:16, textAlign:"center", padding:"20px"
      }}>
        <div style={{
          fontSize:"3.5rem", width:80, height:80, borderRadius:"50%",
          background:"#fef2f2", display:"flex", alignItems:"center", justifyContent:"center"
        }}>🚫</div>

        <h1 style={{
          fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:"2rem",
          color:"var(--text)", letterSpacing:"-.03em"
        }}>
          Access Denied
        </h1>

        <p style={{ color:"var(--text-m)", maxWidth:360 }}>
          You don't have permission to view this page.
          Please log in with the correct role.
        </p>

        <button
          style={{ marginTop:8 }}
          onClick={() => navigate("/roles")}
        >
          Go to Roles →
        </button>
      </main>
    </div>
  );
}