import React, { useState, useEffect } from "react";
import "./InsuranceDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };

function resolveUserId() {
  for (const k of ["userId","user_id","id","uid"]) { const v=localStorage.getItem(k); if(v&&!isNaN(v)) return v; }
  for (const k of ["user","currentUser","userData"]) { try{const o=JSON.parse(localStorage.getItem(k)); if(o){const u=o.userId||o.user_id||o.id; if(u) return String(u);}}catch{} }
  try{const p=JSON.parse(atob(localStorage.getItem("token").split(".")[1])); return p.userId||p.user_id||p.id||(p.sub&&!isNaN(p.sub)?p.sub:null);}catch{return null;}
}

export default function InsuranceProfile() {
  const [form, setForm]     = useState({ companyName:"", address:"", contactEmail:"", contactPhone:"", userId:"" });
  const [companyId, setCid] = useState(null);
  const [loading, setLoad]  = useState(true);
  const [saving, setSave]   = useState(false);
  const [msg, setMsg]       = useState({ type:"", text:"" });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoad(true);
    const uid = resolveUserId();
    if (!uid) { setLoad(false); return; }
    setForm(f=>({...f, userId:uid}));
    try {
      const r = await fetch(`${BASE}/insurance-companies/get/user/${uid}`, { headers:hdrs() });
      if (r.ok) {
        const d = await r.json();
        setCid(d.companyId);
        localStorage.setItem("companyId", d.companyId);
        setForm({ companyName:d.companyName||"", address:d.address||"", contactEmail:d.contactEmail||"", contactPhone:d.contactPhone||"", userId:uid });
      }
    } catch {}
    setLoad(false);
  }

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function save(e) {
    e.preventDefault(); setSave(true); setMsg({type:"",text:""});
    const isNew = !companyId;
    const url    = isNew ? `${BASE}/insurance-companies/add` : `${BASE}/insurance-companies/update`;
    const method = isNew ? "POST" : "PUT";
    const body   = isNew ? form : {...form, companyId};
    try {
      const r = await fetch(url, { method, headers:hdrs(), body:JSON.stringify(body) });
      if (!r.ok) throw await r.text();
      if (isNew) await load();
      setMsg({ type:"success", text: isNew ? "Company profile created!" : "Profile updated successfully!" });
    } catch(e) { setMsg({ type:"error", text:"Failed: "+(e||"Please try again.") }); }
    setSave(false);
  }

  if (loading) return <div className="ic-loading"><div className="ic-spinner"/><p>Loading profile…</p></div>;

  return (
    <div className="ic-card">
      <div className="ic-header">
        <div className="ic-icon">🏢</div>
        <div>
          <h2 className="ic-title">{companyId ? "Update Profile" : "Create Company Profile"}</h2>
          <p className="ic-sub">{companyId ? "Update your insurance company details" : "Set up your company profile to start reviewing claims"}</p>
        </div>
      </div>
      {msg.text && <div className={msg.type==="success"?"ic-success":"ic-error"}>{msg.text}</div>}
      <form onSubmit={save} className="ic-form">
        <div className="field span2">
          <label>Company Name *</label>
          <input value={form.companyName} onChange={set("companyName")} placeholder="e.g. Apollo Insurance Ltd" required/>
        </div>
        <div className="field span2">
          <label>Address</label>
          <input value={form.address} onChange={set("address")} placeholder="e.g. No.123, Anna Salai, India"/>
        </div>
        <div className="field">
          <label>Contact Email</label>
          <input type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="contact@company.com"/>
        </div>
        <div className="field">
          <label>Contact Phone</label>
          <input value={form.contactPhone} onChange={set("contactPhone")} placeholder="9876543210"/>
        </div>
        <div className="field">
          <label>User ID</label>
          <input value={form.userId} readOnly/>
        </div>
        {companyId && <div className="field"><label>Company ID</label><input value={companyId} readOnly/></div>}
        <div className="field span2" style={{marginTop:6}}>
          <button className="ic-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : (companyId ? "Update Profile" : "Create Profile")}
          </button>
        </div>
      </form>
    </div>
  );
}