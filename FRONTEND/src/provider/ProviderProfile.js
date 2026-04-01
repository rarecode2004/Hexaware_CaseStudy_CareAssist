import React, { useState, useEffect } from "react";
import "./ProviderDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };

function resolveUserId() {
  for (const k of ["userId","user_id","id","uid"]) { const v=localStorage.getItem(k); if(v&&!isNaN(v)) return v; }
  for (const k of ["user","currentUser","userData"]) { try { const o=JSON.parse(localStorage.getItem(k)); if(o){const u=o.userId||o.user_id||o.id; if(u) return String(u);} } catch{} }
  try { const p=JSON.parse(atob(localStorage.getItem("token").split(".")[1])); return p.userId||p.user_id||p.id||(p.sub&&!isNaN(p.sub)?p.sub:null); } catch{ return null; }
}

export default function ProviderProfile() {
  const [form, setForm]       = useState({ providerName:"", address:"", contactNumber:"", userId:"" });
  const [providerId, setPid]  = useState(null);
  const [loading, setLoad]    = useState(true);
  const [saving, setSave]     = useState(false);
  const [msg, setMsg]         = useState({ type:"", text:"" });

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    setLoad(true);
    const uid = resolveUserId();
    if (!uid) { setLoad(false); return; }
    setForm(f => ({ ...f, userId: uid }));
    try {
      const r = await fetch(`${BASE}/healthcare-providers/get/user/${uid}`, { headers: hdrs() });
      if (r.ok) {
        const d = await r.json();
        setPid(d.providerId);
        localStorage.setItem("providerId", d.providerId);
        setForm({ providerName: d.providerName||"", address: d.address||"", contactNumber: d.contactNumber||"", userId: uid });
      }
    } catch {}
    setLoad(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSave(true); setMsg({ type:"", text:"" });
    const isUpdate = !!providerId;
    const url  = isUpdate ? `${BASE}/healthcare-providers/update` : `${BASE}/healthcare-providers/add`;
    const method = isUpdate ? "PUT" : "POST";
    const body = isUpdate ? { ...form, providerId } : form;
    try {
      const r = await fetch(url, { method, headers: hdrs(), body: JSON.stringify(body) });
      if (!r.ok) throw await r.text();
      if (!isUpdate) {
        // reload to get the new providerId
        await loadProfile();
      }
      setMsg({ type:"success", text: isUpdate ? "Profile updated successfully!" : "Profile created successfully!" });
    } catch(e) {
      setMsg({ type:"error", text: "Failed to save profile: " + (e||"Please try again.") });
    }
    setSave(false);
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  if (loading) return <div className="prov-loading"><div className="prov-spinner"/><p>Loading profile…</p></div>;

  return (
    <div className="prov-card">
      <div className="prov-header">
        <div className="prov-section-icon">🏥</div>
        <div>
          <h2 className="prov-title">{providerId ? "Update Profile" : "Create Profile"}</h2>
          <p className="prov-sub">{providerId ? "Update your provider information below" : "Set up your healthcare provider profile to get started"}</p>
        </div>
      </div>

      {msg.text && <div className={msg.type==="success" ? "prov-success" : "prov-error"}>{msg.text}</div>}

      <form onSubmit={handleSubmit} className="prov-form">
        <div className="field span2">
          <label>Provider / Hospital Name *</label>
          <input value={form.providerName} onChange={set("providerName")} placeholder="e.g. Apollo Hospital" required/>
        </div>
        <div className="field span2">
          <label>Address</label>
          <input value={form.address} onChange={set("address")} placeholder="e.g. 123, Mount Road, Chennai"/>
        </div>
        <div className="field">
          <label>Contact Number</label>
          <input value={form.contactNumber} onChange={set("contactNumber")} placeholder="e.g. 9876543210"/>
        </div>
        <div className="field">
          <label>User ID</label>
          <input value={form.userId} readOnly style={{background:"#f9fafb",color:"var(--text-s)"}}/>
        </div>
        <div className="field span2" style={{marginTop:8}}>
          <button className="prov-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : (providerId ? "Update Profile" : "Create Profile")}
          </button>
        </div>
      </form>
    </div>
  );
}