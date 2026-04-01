import React, { useState, useEffect } from "react";
import "./Claims.css";
const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };
const fmt  = n => `₹${Number(n||0).toLocaleString("en-IN")}`;

const STATUS_STYLE = {
  PENDING:  { background:"#fffbeb", color:"#b45309", border:"1px solid #fcd34d" },
  APPROVED: { background:"#ecfdf5", color:"#059669", border:"1px solid #a7f3d0" },
  REJECTED: { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" },
};


async function resolvePatientId() {
  const cached = localStorage.getItem("patientId");
  if (cached && !isNaN(cached)) return parseInt(cached);
  let uid = null;
  for (const k of ["userId","user_id","id","uid"]) { const v=localStorage.getItem(k); if(v&&!isNaN(v)){uid=v;break;} }
  if (!uid) { for (const k of ["user","currentUser","userData"]) { try{const o=JSON.parse(localStorage.getItem(k)); if(o){uid=o.userId||o.user_id||o.id; if(uid)break;}}catch{} } }
  if (!uid) { try{const p=JSON.parse(atob(localStorage.getItem("token").split(".")[1])); uid=p.userId||p.user_id||p.id||(p.sub&&!isNaN(p.sub)?p.sub:null);}catch{} }
  if (uid) {
    try {
      const r = await fetch(`${BASE}/patients/get/user/${uid}`, { headers: hdrs() });
      if (r.ok) { const d=await r.json(); const pid=d.patientId||d.patient_id; if(pid){localStorage.setItem("patientId",pid); return pid;} }
    } catch {}
  }
  return null;
}

const BLANK_FORM = { claimNumber:"", diagnosis:"", treatmentDetails:"", claimAmount:"", invoiceId:"", companyId:"", claimStatus:"PENDING" };

export default function Claims() {
  const [activeTab, setTab]   = useState("submit");  
  const [pid, setPid]         = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [claims, setClaims]   = useState([]);
  const [form, setForm]       = useState(BLANK_FORM);
  const [files, setFiles]     = useState([]);
  const [submitting, setSub]  = useState(false);
  const [loading, setLoad]    = useState(false);
  const [msg, setMsg]         = useState({ type:"", text:"" });
  const [expanded, setExp]    = useState(null);

  useEffect(() => {
    resolvePatientId().then(id => {
      if (id) {
        setPid(id);
        setForm(f=>({...f, claimNumber:"CLM"+Date.now().toString().slice(-6)}));
        fetchDropdowns(id);
        fetchClaims(id);
      }
    });
  }, []);

  async function fetchDropdowns(id) {
    // fetch this patient's invoices for the dropdown
    try {
      const r = await fetch(`${BASE}/invoices/get/patient/${id}`, { headers:hdrs() });
      if (r.ok) setInvoices(await r.json());
    } catch {}
    // fetch all insurance companies
    try {
      const r = await fetch(`${BASE}/insurance-companies/getall`, { headers:hdrs() });
      if (r.ok) setCompanies(await r.json());
    } catch {}
  }

  async function fetchClaims(id) {
    setLoad(true);
    try {
      const r = await fetch(`${BASE}/claims/get/patient/${id}`, { headers:hdrs() });
      if (r.ok) { const d=await r.json(); setClaims(Array.isArray(d)?d:[]); }
    } catch {}
    setLoad(false);
  }

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!pid) { setMsg({type:"error",text:"Patient profile not found."}); return; }
    setSub(true); setMsg({type:"",text:""});

    try {
      if (files.length > 0) {
        // multipart/form-data for claim with documents
        const fd = new FormData();
        fd.append("patientId",       pid);
        fd.append("invoiceId",       form.invoiceId);
        fd.append("companyId",       form.companyId);
        fd.append("diagnosis",       form.diagnosis);
        fd.append("treatmentDetails",form.treatmentDetails);
        fd.append("claimAmount",     form.claimAmount);
        files.forEach(f => fd.append("files", f));

        const token = localStorage.getItem("token");
        const r = await fetch(`${BASE}/claims/add-with-docs`, {
          method: "POST",
          headers: token ? { Authorization:`Bearer ${token}` } : {},
          body: fd,
        });
        if (!r.ok) throw await r.text();
      } else {
        // JSON claim without documents
        const payload = {
          claimNumber:     form.claimNumber,
          claimStatus:     "PENDING",
          diagnosis:       form.diagnosis,
          treatmentDetails:form.treatmentDetails,
          claimAmount:     parseFloat(form.claimAmount),
          patientId:       pid,
          invoiceId:       parseInt(form.invoiceId),
          companyId:       parseInt(form.companyId),
        };
        const r = await fetch(`${BASE}/claims/add`, { method:"POST", headers:hdrs(), body:JSON.stringify(payload) });
        if (!r.ok) throw await r.text();
      }

      setMsg({ type:"success", text:"✅ Claim submitted! You will be notified via email." });
      setForm({...BLANK_FORM, claimNumber:"CLM"+Date.now().toString().slice(-6)});
      setFiles([]);
      fetchClaims(pid);

      // switching to track tab after short delay
      setTimeout(() => setTab("track"), 1500);
    } catch(e) { setMsg({ type:"error", text:"Submission failed: "+(e||"Please try again.") }); }
    setSub(false);
  }

  return (
    <>
      
      <div className="cl-root">

      
        <div className="cl-tabs">
          {[
            { key:"submit", icon:"📝", title:"Submit a Claim", sub:"File a new insurance claim with documents" },
            { key:"track",  icon:"📊", title:"Track My Claims", sub:`${claims.length} claim${claims.length!==1?"s":""} found for your account` },
          ].map(t=>(
            <div key={t.key} className={`cl-tab${activeTab===t.key?" active":""}`} onClick={()=>setTab(t.key)}>
              <div className="cl-tab-icon">{t.icon}</div>
              <div>
                <p className="cl-tab-title">{t.title}</p>
                <p className="cl-tab-sub">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SUBMIT CLAIM ── */}
        {activeTab==="submit" && (
          <div className="cl-card">
            <div className="cl-header">
              <div className="cl-header-icon">📝</div>
              <div><h2 className="cl-title">Submit a Claim</h2><p className="cl-sub">Fill in the details below — an email confirmation will be sent to you</p></div>
            </div>

            {msg.text && <div className={msg.type==="success"?"cl-success":"cl-error"}>{msg.text}</div>}

            {!pid ? (
              <div className="cl-error">Patient profile not found. Please complete your Profile tab first.</div>
            ) : (
              <form onSubmit={handleSubmit} className="cl-form">
                <div className="cl-field">
                  <label>Claim Number</label>
                  <input value={form.claimNumber} onChange={set("claimNumber")} required/>
                </div>
                <div className="cl-field">
                  <label>Claim Amount (₹) *</label>
                  <input type="number" min="0" step="0.01" value={form.claimAmount} onChange={set("claimAmount")} placeholder="e.g. 25000" required/>
                </div>
                <div className="cl-field">
                  <label>Select Invoice *</label>
                  <select value={form.invoiceId} onChange={set("invoiceId")} required>
                    <option value="">-- Select Invoice --</option>
                    {invoices.map(inv=>(
                      <option key={inv.invoiceId} value={inv.invoiceId}>{inv.invoiceNumber} · {fmt(inv.totalAmount)} · {inv.status}</option>
                    ))}
                  </select>
                </div>
                <div className="cl-field">
                  <label>Select Insurance Company *</label>
                  <select value={form.companyId} onChange={set("companyId")} required>
                    <option value="">-- Select Company --</option>
                    {companies.map(c=>(
                      <option key={c.companyId} value={c.companyId}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
                <div className="cl-field span2">
                  <label>Diagnosis *</label>
                  <input value={form.diagnosis} onChange={set("diagnosis")} placeholder="e.g. Fracture in leg" required/>
                </div>
                <div className="cl-field span2">
                  <label>Treatment Details *</label>
                  <textarea value={form.treatmentDetails} onChange={set("treatmentDetails")} placeholder="e.g. Physiotherapy required for 6 weeks" required/>
                </div>
                <div className="cl-field span2">
                  <label>Supporting Documents (optional)</label>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e=>setFiles([...e.target.files])}
                    style={{padding:"8px 14px",border:"1px solid #a7f3d0",borderRadius:9,cursor:"pointer"}}
                  />
                  {files.length>0 && <span style={{fontSize:".75rem",color:"#059669",marginTop:4}}>{files.length} file(s) selected</span>}
                </div>
                <div className="cl-field span2" style={{marginTop:4}}>
                  <button className="cl-btn" type="submit" disabled={submitting}>
                    {submitting ? "Submitting…" : "📝 Submit Claim"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ── TRACK CLAIMS ── */}
        {activeTab==="track" && (
          <div className="cl-card">
            <div className="cl-header">
              <div className="cl-header-icon">📊</div>
              <div><h2 className="cl-title">My Claims</h2><p className="cl-sub">Track the status of all your submitted claims</p></div>
            </div>

            {loading ? (
              <div className="cl-loading"><div className="cl-spinner"/><p>Loading claims…</p></div>
            ) : claims.length===0 ? (
              <div className="cl-empty">
                <div style={{fontSize:"2rem",marginBottom:8}}>📋</div>
                <p>No claims submitted yet.</p>
                <span style={{fontSize:".82rem"}}>Click "Submit a Claim" above to file your first claim.</span>
              </div>
            ) : (
              <div className="cl-list">
                {claims.map(c=>(
                  <div key={c.claimId} className={`cl-row${expanded===c.claimId?" expanded":""}`}>
                    <div className="cl-row-top" onClick={()=>setExp(expanded===c.claimId?null:c.claimId)}>
                      <div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,color:"#0c1a12",fontSize:".95rem"}}>{c.claimNumber}</div>
                        <div style={{fontSize:".72rem",color:"#7a9a85",marginTop:2}}>{c.diagnosis} · Invoice #{c.invoiceId}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,color:"#059669"}}>{fmt(c.claimAmount)}</div>
                        <span className="cl-badge" style={STATUS_STYLE[c.claimStatus]||STATUS_STYLE.PENDING}>{c.claimStatus}</span>
                        <span style={{color:"#7a9a85",fontSize:".8rem"}}>{expanded===c.claimId?"▲":"▼"}</span>
                      </div>
                    </div>
                    {expanded===c.claimId && (
                      <div className="cl-row-detail">
                        {[
                          ["Claim ID",     `#${c.claimId}`],
                          ["Claim Number", c.claimNumber],
                          ["Invoice ID",   `#${c.invoiceId}`],
                          ["Company ID",   `#${c.companyId}`],
                          ["Claim Amount", fmt(c.claimAmount)],
                          ["Status",       c.claimStatus],
                          ["Diagnosis",    c.diagnosis||"—"],
                          ["Treatment",    c.treatmentDetails||"—"],
                        ].map(([l,v])=>(
                          <div key={l} className="cl-detail-item">
                            <span className="cl-detail-label">{l}</span>
                            <span className={`cl-detail-value${l==="Claim Amount"?" green":""}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}