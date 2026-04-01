import React, { useState } from "react";
import "./AdminDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };

const BLANK = { username:"", email:"", password:"", roleId:1 };

export default function AddAdmin() {
  const [form, setForm] = useState(BLANK);
  const [saving, setSave]= useState(false);
  const [msg, setMsg]   = useState({ type:"", text:"" });

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function handleSubmit(e) {
    e.preventDefault(); setSave(true); setMsg({type:"",text:""});
    try {
      const r = await fetch(`${BASE}/users/add`, { method:"POST", headers:hdrs(), body:JSON.stringify({...form, roleId:1}) });
      if (!r.ok) throw await r.text();
      setMsg({ type:"success", text:`✅ Admin account created for "${form.username}". They can now log in.` });
      setForm(BLANK);
    } catch(e) { setMsg({ type:"error", text:"Failed: "+(e||"Please try again.") }); }
    setSave(false);
  }

  return (
    <div className="ad-card">
      <div className="ad-header">
        <div className="ad-icon">➕</div>
        <div>
          <h2 className="ad-title">Add New Admin</h2>
          <p className="ad-sub">Create a new administrator account — only existing admins can do this</p>
        </div>
      </div>

      <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:10,padding:"10px 14px",color:"#92400e",fontSize:".82rem",marginBottom:18}}>
        ⚠️ Admin accounts have full system access. Only create accounts for trusted personnel.
      </div>

      {msg.text && <div className={msg.type==="success"?"ad-success":"ad-error"}>{msg.text}</div>}

      <form onSubmit={handleSubmit} className="ad-form">
        <div className="field">
          <label>Username *</label>
          <input value={form.username} onChange={set("username")} placeholder="e.g. admin_jane" required/>
        </div>
        <div className="field">
          <label>Email *</label>
          <input type="email" value={form.email} onChange={set("email")} placeholder="jane@careassist.com" required/>
        </div>
        <div className="field">
          <label>Password *</label>
          <input type="password" value={form.password} onChange={set("password")} placeholder="Min 8 characters" minLength={6} required/>
        </div>
        <div className="field">
          <label>Role</label>
          <input value="ADMIN (roleId: 1)" readOnly/>
        </div>
        <div className="field span2" style={{marginTop:6}}>
          <button className="ad-btn" type="submit" disabled={saving}>
            {saving ? "Creating…" : "➕ Create Admin Account"}
          </button>
        </div>
      </form>
    </div>
  );
}