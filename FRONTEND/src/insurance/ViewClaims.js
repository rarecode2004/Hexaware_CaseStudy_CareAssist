import React, { useState, useEffect } from "react";
import { useCompanyId } from "./useCompanyId";
import "./InsuranceDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };
const fmt  = n => `₹${Number(n||0).toLocaleString("en-IN")}`;

export default function ViewClaims() {
  const { companyId, resolving } = useCompanyId();
  const [claims, setClaims] = useState([]);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExp]  = useState(null);
  const [acting, setAct]    = useState(null);
  const [msg, setMsg]       = useState("");

  useEffect(() => { if (!resolving && companyId) fetchClaims(); }, [resolving, companyId]);

  async function fetchClaims() {
    setLoad(true); setError("");
    try {
      const r = await fetch(`${BASE}/claims/getall`, { headers:hdrs() });
      if (!r.ok) throw 0;
      const all = await r.json();
      // ✅ filter by THIS company only
      setClaims(all.filter(c => String(c.companyId) === String(companyId)));
    } catch { setError("Could not load claims."); }
    setLoad(false);
  }

  async function updateStatus(claimId, status) {
    setAct(claimId);
    try {
      const r = await fetch(`${BASE}/claims/update/${claimId}/${status}`, { method:"PUT", headers:hdrs() });
      if (!r.ok) throw 0;
      setClaims(prev => prev.map(c => c.claimId===claimId ? {...c, claimStatus:status} : c));
      setMsg(`Claim ${status.toLowerCase()} — patient notified by email.`);
      setTimeout(() => setMsg(""), 4000);
    } catch { setError("Failed to update status."); }
    setAct(null);
  }

  const filtered = filter==="ALL" ? claims : claims.filter(c=>c.claimStatus===filter);
  const stats = {
    total:    claims.length,
    pending:  claims.filter(c=>c.claimStatus==="PENDING").length,
    approved: claims.filter(c=>c.claimStatus==="APPROVED").length,
    rejected: claims.filter(c=>c.claimStatus==="REJECTED").length,
  };

  if (resolving) return <div className="ic-loading"><div className="ic-spinner"/><p>Identifying your company…</p></div>;
  if (!companyId) return <div className="ic-error" style={{margin:0}}>Company profile not found. Please complete your profile first.</div>;

  return (
    <div>
      {/* stats */}
      <div className="ic-stats">
        {[["Total",stats.total,"📋"],["Pending",stats.pending,"⏳"],["Approved",stats.approved,"✅"],["Rejected",stats.rejected,"❌"]].map(([l,v,i])=>(
          <div key={l} className="ic-stat">
            <div style={{fontSize:"1.3rem"}}>{i}</div>
            <div className="ic-stat-val">{v}</div>
            <div className="ic-stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="ic-card">
        <div className="ic-header">
          <div className="ic-icon">📋</div>
          <div>
            <h2 className="ic-title">Incoming Claims</h2>
            <p className="ic-sub">Claims submitted to your company (ID #{companyId})</p>
          </div>
        </div>

        {msg   && <div className="ic-success">{msg}</div>}
        {error && <div className="ic-error">{error}</div>}

        <div className="ic-filters">
          {["ALL","PENDING","APPROVED","REJECTED"].map(s=>(
            <button key={s} className={`ic-filter-btn${filter===s?" active":""}`} onClick={()=>setFilter(s)}>{s}</button>
          ))}
        </div>

        {loading ? (
          <div className="ic-loading"><div className="ic-spinner"/><p>Loading…</p></div>
        ) : filtered.length===0 ? (
          <div className="ic-empty">No {filter!=="ALL"?filter.toLowerCase()+" ":""} claims found for your company.</div>
        ) : (
          <div className="ic-list">
            {filtered.map(c=>(
              <div key={c.claimId} className={`ic-row${expanded===c.claimId?" expanded":""}`}>
                {/* summary */}
                <div className="ic-row-top" onClick={()=>setExp(expanded===c.claimId?null:c.claimId)}>
                  <div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,color:"var(--text)",fontSize:".95rem"}}>{c.claimNumber}</div>
                    <div style={{fontSize:".73rem",color:"var(--text-s)",marginTop:2}}>
                      Patient #{c.patientId} · Invoice #{c.invoiceId} · {c.diagnosis}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,color:"var(--g1)"}}>{fmt(c.claimAmount)}</div>
                    <span className={`ic-badge badge-${c.claimStatus}`}>{c.claimStatus}</span>
                    <span style={{color:"var(--text-s)",fontSize:".8rem"}}>{expanded===c.claimId?"▲":"▼"}</span>
                  </div>
                </div>

                {/* expanded */}
                {expanded===c.claimId && (
                  <div className="ic-row-detail">
                    <div className="ic-detail-grid">
                      {[
                        ["Claim ID",      `#${c.claimId}`],
                        ["Claim Number",  c.claimNumber],
                        ["Patient ID",    `#${c.patientId}`],
                        ["Invoice ID",    `#${c.invoiceId}`],
                        ["Claim Amount",  fmt(c.claimAmount)],
                        ["Status",        c.claimStatus],
                        ["Diagnosis",     c.diagnosis||"—"],
                        ["Treatment",     c.treatmentDetails||"—"],
                      ].map(([l,v])=>(
                        <div key={l} className="ic-detail-item">
                          <span className="ic-detail-label">{l}</span>
                          <span className={`ic-detail-value${l==="Claim Amount"?" green":""}`}>{v}</span>
                        </div>
                      ))}
                    </div>

                    {c.claimStatus==="PENDING" ? (
                      <div className="ic-row-actions">
                        <button className="ic-btn approve sm" onClick={()=>updateStatus(c.claimId,"APPROVED")} disabled={acting===c.claimId}>
                          {acting===c.claimId ? "…" : "✅ Approve"}
                        </button>
                        <button className="ic-btn reject sm" onClick={()=>updateStatus(c.claimId,"REJECTED")} disabled={acting===c.claimId}>
                          {acting===c.claimId ? "…" : "❌ Reject"}
                        </button>
                      </div>
                    ) : (
                      <div style={{fontSize:".82rem",color:"var(--text-s)",fontStyle:"italic"}}>
                        This claim has already been {c.claimStatus.toLowerCase()}.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}