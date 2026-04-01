import React, { useState, useEffect } from "react";
import { useCompanyId } from "./useCompanyId";
import "./InsuranceDashboard.css";

const BASE  = "http://localhost:9090";
const hdrs  = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };
const fmt   = n => `₹${Number(n||0).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().split("T")[0];

export default function ProcessPayment() {
  const { companyId, resolving } = useCompanyId();
  const [claims, setClaims] = useState([]);
  const [loading, setLoad]  = useState(false);
  const [form, setForm]     = useState({ claimId:"", paymentAmount:"", paymentDate:today(), paymentStatus:"SUCCESS" });
  const [saving, setSave]   = useState(false);
  const [msg, setMsg]       = useState({ type:"", text:"" });

  useEffect(() => { if (!resolving && companyId) fetchApproved(); }, [resolving, companyId]);

  async function fetchApproved() {
    setLoad(true);
    try {
      const r = await fetch(`${BASE}/claims/getall`, { headers:hdrs() });
      if (r.ok) {
        const all = await r.json();
        // only APPROVED claims for THIS company
        const approved = all.filter(c => String(c.companyId)===String(companyId) && c.claimStatus==="APPROVED");
        setClaims(approved);
        if (approved.length===1) setForm(f=>({...f, claimId:approved[0].claimId, paymentAmount:approved[0].claimAmount}));
      }
    } catch {}
    setLoad(false);
  }

  const set = k => e => {
    const val = e.target.value;
    setForm(f => {
      const u = {...f, [k]:val};
      if (k==="claimId") { const c=claims.find(c=>String(c.claimId)===String(val)); if(c) u.paymentAmount=c.claimAmount; }
      return u;
    });
  };

  async function submit(e) {
    e.preventDefault();
    if (!form.claimId) { setMsg({type:"error",text:"Please select a claim."}); return; }
    setSave(true); setMsg({type:"",text:""});
    try {
      const r = await fetch(`${BASE}/payments/add`, {
        method:"POST", headers:hdrs(),
        body: JSON.stringify({ ...form, claimId:parseInt(form.claimId), paymentAmount:parseFloat(form.paymentAmount) })
      });
      if (!r.ok) throw await r.text();
      setMsg({ type:"success", text:"✅ Payment processed! Patient notified by email." });
      setForm({ claimId:"", paymentAmount:"", paymentDate:today(), paymentStatus:"SUCCESS" });
      fetchApproved();
    } catch(e) { setMsg({ type:"error", text:"Failed: "+(e||"Please try again.") }); }
    setSave(false);
  }

  if (resolving) return <div className="ic-loading"><div className="ic-spinner"/><p>Identifying your company…</p></div>;
  if (!companyId) return <div className="ic-error" style={{margin:0}}>Company profile not found. Please complete your profile first.</div>;

  const selected = claims.find(c=>String(c.claimId)===String(form.claimId));

  return (
    <div className="ic-card">
      <div className="ic-header">
        <div className="ic-icon">💳</div>
        <div>
          <h2 className="ic-title">Process Payment</h2>
          <p className="ic-sub">Initiate payment for approved claims — patient notified automatically</p>
        </div>
      </div>

      {msg.text && <div className={msg.type==="success"?"ic-success":"ic-error"}>{msg.text}</div>}

      {loading ? <div className="ic-loading"><div className="ic-spinner"/></div>
      : claims.length===0 ? (
        <div className="ic-empty">
          No approved claims awaiting payment.<br/>
          <span style={{fontSize:".8rem"}}>Approve claims from the "View Claims" tab first.</span>
        </div>
      ) : (
        <form onSubmit={submit} className="ic-form">
          <div className="field span2">
            <label>Select Approved Claim *</label>
            <select value={form.claimId} onChange={set("claimId")} required>
              <option value="">-- Select Claim --</option>
              {claims.map(c=>(
                <option key={c.claimId} value={c.claimId}>
                  {c.claimNumber} · Patient #{c.patientId} · {fmt(c.claimAmount)}
                </option>
              ))}
            </select>
          </div>

          {/* claim detail chip */}
          {selected && (
            <div className="field span2">
              <div style={{background:"#ecfdf5",border:"1px solid var(--border-m)",borderRadius:10,padding:"12px 16px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px",fontSize:".82rem"}}>
                {[["Claim",selected.claimNumber],["Patient",`#${selected.patientId}`],["Invoice",`#${selected.invoiceId}`],["Claim Amt",fmt(selected.claimAmount)]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{color:"var(--text-s)",fontSize:".63rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em"}}>{l}</div>
                    <div style={{color:"var(--text)",fontWeight:600,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="field">
            <label>Payment Amount (₹)</label>
            <input type="number" min="0" step="0.01" value={form.paymentAmount} onChange={set("paymentAmount")} required/>
          </div>
          <div className="field">
            <label>Payment Date</label>
            <input type="date" value={form.paymentDate} onChange={set("paymentDate")} required/>
          </div>
          <div className="field span2">
            <label>Payment Status</label>
            <select value={form.paymentStatus} onChange={set("paymentStatus")}>
              <option>SUCCESS</option><option>FAILED</option>
            </select>
          </div>
          <div className="field span2" style={{marginTop:4}}>
            <button className="ic-btn" type="submit" disabled={saving}>
              {saving ? "Processing…" : "💳 Process Payment"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}