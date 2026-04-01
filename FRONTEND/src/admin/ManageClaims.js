import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };
const fmt  = n => `₹${Number(n||0).toLocaleString("en-IN")}`;

export default function ManageClaims() {
  const [tab, setTab]       = useState("claims");
  const [claims, setClaims] = useState([]);
  const [payments, setPay]  = useState([]);
  const [loading, setLoad]  = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [acting, setAct]    = useState(null);
  const [msg, setMsg]       = useState({ type:"", text:"" });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoad(true);
    const [c, p] = await Promise.all([
      fetch(`${BASE}/claims/getall`,  {headers:hdrs()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      // payments: fetch per claim (admin can't getall payments directly, so we loop)
      // We'll fetch claims first then batch-fetch payments
      Promise.resolve([]),
    ]);
    setClaims(c);

    // batch fetch payments for all claims
    const allPay = [];
    await Promise.all(c.map(async cl => {
      try {
        const r = await fetch(`${BASE}/payments/get/payments/${cl.claimId}`, {headers:hdrs()});
        if (r.ok) { const arr=await r.json(); arr.forEach(p=>allPay.push({...p, claimNumber:cl.claimNumber, patientId:cl.patientId})); }
      } catch {}
    }));
    setPay(allPay);
    setLoad(false);
  }

  async function updateStatus(claimId, status) {
    setAct(claimId);
    try {
      const r = await fetch(`${BASE}/claims/update/${claimId}/${status}`, { method:"PUT", headers:hdrs() });
      if (!r.ok) throw 0;
      setClaims(prev=>prev.map(c=>c.claimId===claimId?{...c,claimStatus:status}:c));
      setMsg({ type:"success", text:`Claim ${status.toLowerCase()} — patient notified.` });
      setTimeout(()=>setMsg({type:"",text:""}), 3000);
    } catch { setMsg({ type:"error", text:"Failed to update status." }); }
    setAct(null);
  }

  async function deleteClaim(claimId) {
    if (!window.confirm("Delete this claim permanently?")) return;
    try {
      const r = await fetch(`${BASE}/claims/delete/${claimId}`, { method:"DELETE", headers:hdrs() });
      if (!r.ok) throw 0;
      setClaims(prev=>prev.filter(c=>c.claimId!==claimId));
    } catch { alert("Delete failed."); }
  }

  async function deletePayment(paymentId) {
    if (!window.confirm("Delete this payment permanently?")) return;
    try {
      const r = await fetch(`${BASE}/payments/delete/${paymentId}`, { method:"DELETE", headers:hdrs() });
      if (!r.ok) throw 0;
      setPay(prev=>prev.filter(p=>p.paymentId!==paymentId));
    } catch { alert("Delete failed."); }
  }

  const filteredClaims = claims
    .filter(c=>filter==="ALL"||c.claimStatus===filter)
    .filter(c=>!search||c.claimNumber?.toLowerCase().includes(search.toLowerCase())||String(c.patientId).includes(search));

  const claimStats = {
    total:    claims.length,
    pending:  claims.filter(c=>c.claimStatus==="PENDING").length,
    approved: claims.filter(c=>c.claimStatus==="APPROVED").length,
    rejected: claims.filter(c=>c.claimStatus==="REJECTED").length,
  };

  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {[["claims","📋 All Claims"],["payments","💳 All Payments"]].map(([k,l])=>(
          <button key={k} className={`ad-btn${tab===k?"":" outline"}`} style={{padding:"10px 22px"}} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {msg.text && <div className={msg.type==="success"?"ad-success":"ad-error"} style={{marginBottom:16}}>{msg.text}</div>}

      {tab==="claims" && (
        <div>
          <div className="ad-stats" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
            {[["Total",claimStats.total,"📋"],["Pending",claimStats.pending,"⏳"],["Approved",claimStats.approved,"✅"],["Rejected",claimStats.rejected,"❌"]].map(([l,v,i])=>(
              <div key={l} className="ad-stat" style={{cursor:"default"}}>
                <div style={{fontSize:"1.3rem"}}>{i}</div>
                <div className="ad-stat-val">{v}</div>
                <div className="ad-stat-label">{l}</div>
              </div>
            ))}
          </div>

          <div className="ad-card">
            <div className="ad-header">
              <div className="ad-icon">📋</div>
              <div><h2 className="ad-title">All Claims</h2><p className="ad-sub">Every claim in the system — all patients, all companies</p></div>
            </div>

            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
              
              <div className="ad-filters" style={{margin:0}}>
                {["ALL","PENDING","APPROVED","REJECTED"].map(s=>(
                  <button key={s} className={`ad-filter-btn${filter===s?" active":""}`} onClick={()=>setFilter(s)}>{s}</button>
                ))}
              </div>
            </div>

            {loading ? <div className="ad-loading"><div className="ad-spinner"/></div>
            : filteredClaims.length===0 ? <div className="ad-empty">No claims found.</div>
            : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>{["#","Claim #","Patient","Company","Invoice","Amount","Diagnosis","Status","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredClaims.map((c,i)=>(
                      <tr key={c.claimId}>
                        <td>{i+1}</td>
                        <td style={{fontFamily:"'Outfit',sans-serif",fontWeight:700}}>{c.claimNumber}</td>
                        <td>#{c.patientId}</td>
                        <td>#{c.companyId}</td>
                        <td>#{c.invoiceId}</td>
                        <td style={{color:"var(--g1)",fontWeight:700}}>{fmt(c.claimAmount)}</td>
                        <td style={{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.diagnosis||"—"}</td>
                        <td><span className={`ad-badge badge-${c.claimStatus}`}>{c.claimStatus}</span></td>
                        <td>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            {c.claimStatus==="PENDING" && <>
                              <button className="ad-btn sm" style={{background:"linear-gradient(135deg,#059669,#0891b2)",padding:"5px 10px",fontSize:".72rem"}} onClick={()=>updateStatus(c.claimId,"APPROVED")} disabled={acting===c.claimId}>✅</button>
                              <button className="ad-btn sm danger" style={{padding:"5px 10px",fontSize:".72rem"}} onClick={()=>updateStatus(c.claimId,"REJECTED")} disabled={acting===c.claimId}>❌</button>
                            </>}
                            <button className="ad-btn sm danger" onClick={()=>deleteClaim(c.claimId)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {tab==="payments" && (
        <div className="ad-card">
          <div className="ad-header">
            <div className="ad-icon">💳</div>
            <div><h2 className="ad-title">All Payments</h2><p className="ad-sub">Every payment processed in the system</p></div>
          </div>

          {loading ? <div className="ad-loading"><div className="ad-spinner"/></div>
          : payments.length===0 ? <div className="ad-empty">No payments found.</div>
          : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead><tr>{["#","Payment ID","Claim #","Patient","Amount","Date","Status","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {payments.map((p,i)=>(
                    <tr key={p.paymentId}>
                      <td>{i+1}</td>
                      <td style={{fontWeight:700}}>#{p.paymentId}</td>
                      <td style={{fontFamily:"'Outfit',sans-serif",fontWeight:600}}>{p.claimNumber||`#${p.claimId}`}</td>
                      <td>#{p.patientId||"—"}</td>
                      <td style={{color:"var(--g1)",fontWeight:700}}>{fmt(p.paymentAmount)}</td>
                      <td style={{color:"var(--text-s)"}}>{p.paymentDate||"—"}</td>
                      <td><span className={`ad-badge badge-${p.paymentStatus}`}>{p.paymentStatus}</span></td>
                      <td><button className="ad-btn sm danger" onClick={()=>deletePayment(p.paymentId)}>🗑 Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}