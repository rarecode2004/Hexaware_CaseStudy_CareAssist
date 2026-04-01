import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };

function getUserId() {
  for (const k of ["userId","user_id","id","uid"]) { const v=localStorage.getItem(k); if(v&&!isNaN(v)) return v; }
  for (const k of ["user","currentUser","userData"]) { try{const o=JSON.parse(localStorage.getItem(k)); if(o){const u=o.userId||o.user_id||o.id; if(u) return String(u);}}catch{} }
  try{const p=JSON.parse(atob(localStorage.getItem("token").split(".")[1])); return p.userId||p.user_id||p.id||(p.sub&&!isNaN(p.sub)?p.sub:null);}catch{return null;}
}

export default function AdminProfile() {
  const [form, setForm]   = useState({ username:"", email:"", password:"", roleId:1 });
  const [userId, setUid]  = useState(null);
  const [loading, setLoad]= useState(true);
  const [saving, setSave] = useState(false);
  const [msg, setMsg]     = useState({ type:"", text:"" });

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    setLoad(true);
    const uid = getUserId();
    if (!uid) { setLoad(false); return; }
    try {
      const r = await fetch(`${BASE}/users/get/${uid}`, { headers:hdrs() });
      if (r.ok) {
        const d = await r.json();
        setUid(d.userId);
        setForm({ username:d.username||"", email:d.email||"", password:"", roleId:d.roleId||1 });
      }
    } catch {}
    setLoad(false);
  }

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function save(e) {
    e.preventDefault(); setSave(true); setMsg({type:"",text:""});
    try {
      const payload = { ...form, userId, roleId:1 };
      const r = await fetch(`${BASE}/users/update`, { method:"PUT", headers:hdrs(), body:JSON.stringify(payload) });
      if (!r.ok) throw await r.text();
      setMsg({ type:"success", text:"Profile updated successfully!" });
      setForm(f=>({...f, password:""}));
    } catch(e) { setMsg({ type:"error", text:"Failed: "+(e||"Try again.") }); }
    setSave(false);
  }

  if (loading) return <div className="ad-loading"><div className="ad-spinner"/><p>Loading…</p></div>;

  return (
    <div className="ad-card">
      <div className="ad-header">
        <div className="ad-icon">👤</div>
        <div>
          <h2 className="ad-title">Admin Profile</h2>
          <p className="ad-sub">{userId ? "Update your administrator account details" : "Set up your admin profile"}</p>
        </div>
      </div>
      {msg.text && <div className={msg.type==="success"?"ad-success":"ad-error"}>{msg.text}</div>}
      <form onSubmit={save} className="ad-form">
        <div className="field">
          <label>Username</label>
          <input value={form.username} onChange={set("username")} placeholder="admin_username" required/>
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={set("email")} placeholder="admin@careassist.com" required/>
        </div>
        <div className="field">
          <label>New Password (leave blank to keep current)</label>
          <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••"/>
        </div>
        <div className="field">
          <label>Role</label>
          <input value="ADMIN" readOnly/>
        </div>
        {userId && <div className="field"><label>User ID</label><input value={userId} readOnly/></div>}
        <div className="field span2" style={{marginTop:6}}>
          <button className="ad-btn" type="submit" disabled={saving}>{saving?"Saving…":"Update Profile"}</button>
        </div>
      </form>
    </div>
  );
}