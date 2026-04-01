import React, { useState, useEffect } from "react";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };
const fmt  = n => `₹${Number(n||0).toLocaleString("en-IN")}`;

const STATUS_STYLE = {
  PAID:      { background:"#ecfdf5", color:"#059669", border:"1px solid #a7f3d0" },
  PENDING:   { background:"#fffbeb", color:"#b45309", border:"1px solid #fcd34d" },
  CANCELLED: { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" },
};

const CSS = `
  .inv-root{max-width:860px;margin:0 auto;padding:4px 0 40px;font-family:'DM Sans',sans-serif}
  .inv-header{display:flex;align-items:center;gap:14px;margin-bottom:24px}
  .inv-header-icon{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#059669,#0891b2);display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 4px 14px rgba(5,150,105,.28);flex-shrink:0}
  .inv-title{font-family:'Outfit',sans-serif;font-size:1.5rem;font-weight:800;color:#0c1a12;letter-spacing:-.03em;margin:0}
  .inv-sub{font-size:.85rem;color:#7a9a85;margin:2px 0 0}
  .inv-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
  .inv-stat-card{background:#fff;border:1px solid #d1fae5;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:0 2px 8px rgba(5,150,105,.05);text-align:center}
  .inv-stat-icon{font-size:1.3rem}
  .inv-stat-val{font-family:'Outfit',sans-serif;font-size:1.25rem;font-weight:800;color:#059669;line-height:1}
  .inv-stat-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#7a9a85}
  .inv-toast{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:12px 16px;color:#059669;font-size:.875rem;font-weight:500;margin-bottom:16px}
  .inv-error{display:flex;justify-content:space-between;align-items:center;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 16px;color:#dc2626;font-size:.875rem;margin-bottom:16px}
  .inv-error button{background:none;border:none;color:#dc2626;font-size:1rem;cursor:pointer}
  .inv-empty{text-align:center;padding:56px 20px;background:#fff;border:1px dashed #a7f3d0;border-radius:16px;color:#7a9a85}
  .inv-empty p{font-size:1rem;font-weight:500;color:#3d5a47;margin-bottom:6px}
  .inv-list{display:flex;flex-direction:column;gap:12px}
  .inv-card{background:#fff;border:1px solid #d1fae5;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(5,150,105,.05);transition:all .24s}
  .inv-card:hover{box-shadow:0 6px 20px rgba(5,150,105,.1);border-color:#a7f3d0}
  .inv-card.expanded{border-color:#a7f3d0;box-shadow:0 6px 24px rgba(5,150,105,.12)}
  .inv-card-row{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;cursor:pointer;gap:16px}
  .inv-card-left{display:flex;flex-direction:column;gap:3px}
  .inv-card-num{font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;color:#0c1a12}
  .inv-card-date{font-size:.75rem;color:#7a9a85}
  .inv-card-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
  .inv-card-amount{font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:800;color:#059669}
  .inv-status-badge{padding:3px 12px;border-radius:100px;font-size:.72rem;font-weight:700;letter-spacing:.04em;white-space:nowrap}
  .inv-chevron{color:#7a9a85;font-size:.8rem}
  .inv-detail{border-top:1px solid #d1fae5;padding:20px 22px;display:flex;flex-direction:column;gap:16px;background:#f9fefb}
  .inv-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
  .inv-detail-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #d1fae5;font-size:.875rem}
  .inv-detail-row:last-child{border-bottom:none}
  .inv-detail-label{color:#7a9a85;font-weight:500}
  .inv-detail-value{color:#0c1a12;font-weight:600;text-align:right}
  .inv-detail-value.highlight{color:#059669;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:800}
  .inv-pay-btn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#059669,#0891b2);color:#fff;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(5,150,105,.28);transition:all .24s}
  .inv-pay-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 22px rgba(5,150,105,.38)}
  .inv-pay-btn:disabled{opacity:.65;cursor:not-allowed}
  .inv-paid-badge{text-align:center;padding:12px;border-radius:10px;background:#ecfdf5;border:1px solid #a7f3d0;color:#059669;font-weight:600;font-size:.9rem}
  .inv-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:80px 20px;color:#7a9a85;font-size:.9rem}
  .inv-spinner{width:34px;height:34px;border-radius:50%;border:3px solid #a7f3d0;border-top-color:#059669;animation:invspin .8s linear infinite}
  @keyframes invspin{to{transform:rotate(360deg)}}
  @media(max-width:600px){.inv-stats{grid-template-columns:repeat(2,1fr)}.inv-detail-grid{grid-template-columns:1fr}.inv-card-row{flex-direction:column;align-items:flex-start}.inv-card-right{width:100%;justify-content:space-between}}
`;

// ── resolve patientId — tries localStorage then backend ──────────────────────
async function resolvePatientId() {
  // 1. cached
  const cached = localStorage.getItem("patientId");
  if (cached && !isNaN(cached)) return parseInt(cached);

  // 2. find userId
  let uid = null;
  for (const k of ["userId","user_id","id","uid"]) { const v=localStorage.getItem(k); if(v&&!isNaN(v)){uid=v;break;} }
  if (!uid) { for (const k of ["user","currentUser","userData"]) { try{const o=JSON.parse(localStorage.getItem(k)); if(o){uid=o.userId||o.user_id||o.id; if(uid)break;}}catch{} } }
  if (!uid) { try{const p=JSON.parse(atob(localStorage.getItem("token").split(".")[1])); uid=p.userId||p.user_id||p.id||(p.sub&&!isNaN(p.sub)?p.sub:null);}catch{} }

  // 3. call backend
  if (uid) {
    try {
      const r = await fetch(`${BASE}/patients/get/user/${uid}`, { headers: hdrs() });
      if (r.ok) {
        const d = await r.json();
        const pid = d.patientId || d.patient_id;
        if (pid) { localStorage.setItem("patientId", pid); return pid; }
      }
    } catch {}
  }
  return null;
}

export default function Invoice() {
  const [invoices, setInv]  = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState("");
  const [paying, setPaying] = useState(null);
  const [msg, setMsg]       = useState("");
  const [selected, setSel]  = useState(null);
  const [pid, setPid]       = useState(null);

  useEffect(() => {
    resolvePatientId().then(id => {
      if (id) { setPid(id); fetchInvoices(id); }
      else { setError("Patient profile not found. Please complete your Profile first."); setLoad(false); }
    });
  }, []);

  async function fetchInvoices(id) {
    setLoad(true); setError("");
    try {
      const r = await fetch(`${BASE}/invoices/get/patient/${id}`, { headers: hdrs() });
      if (!r.ok) throw 0;
      const data = await r.json();
      setInv(Array.isArray(data) ? data : []);
    } catch { setError("Could not load invoices. Please try again."); }
    setLoad(false);
  }

  async function markPaid(inv) {
    setPaying(inv.invoiceId);
    try {
      const r = await fetch(`${BASE}/invoices/update`, { method:"PUT", headers:hdrs(), body:JSON.stringify({...inv, status:"PAID"}) });
      if (!r.ok) throw 0;
      setInv(prev => prev.map(i => i.invoiceId===inv.invoiceId ? {...i, status:"PAID"} : i));
      if (selected?.invoiceId===inv.invoiceId) setSel(s=>({...s, status:"PAID"}));
      setMsg("Payment recorded successfully!"); setTimeout(()=>setMsg(""), 3000);
    } catch { setError("Failed to update payment status."); }
    setPaying(null);
  }

  const stats = {
    total:   invoices.length,
    paid:    invoices.filter(i=>i.status==="PAID").length,
    pending: invoices.filter(i=>i.status==="PENDING").length,
    due:     invoices.filter(i=>i.status==="PENDING").reduce((a,i)=>a+i.totalAmount,0),
  };

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="inv-root"><div className="inv-loading"><div className="inv-spinner"/><p>Loading your invoices…</p></div></div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="inv-root">

        <div className="inv-header">
          <div className="inv-header-icon">🧾</div>
          <div>
            <h2 className="inv-title">My Invoices</h2>
            <p className="inv-sub">View and pay your medical invoices{pid ? ` · Patient #${pid}` : ""}</p>
          </div>
        </div>

        {/* stats — only show if there are invoices */}
        {invoices.length > 0 && (
          <div className="inv-stats">
            {[["Total",stats.total,"📋"],["Paid",stats.paid,"✅"],["Pending",stats.pending,"⏳"],["Amount Due",fmt(stats.due),"💳"]].map(([l,v,i])=>(
              <div key={l} className="inv-stat-card">
                <span className="inv-stat-icon">{i}</span>
                <div className="inv-stat-val">{v}</div>
                <div className="inv-stat-label">{l}</div>
              </div>
            ))}
          </div>
        )}

        {msg   && <div className="inv-toast">✅ {msg}</div>}
        {error && <div className="inv-error"><span>{error}</span><button onClick={()=>setError("")}>✕</button></div>}

        {invoices.length === 0 && !error ? (
          <div className="inv-empty">
            <div style={{fontSize:"2.5rem",marginBottom:12}}>🧾</div>
            <p>No invoices found for your account.</p>
            <span>Invoices generated by your healthcare provider will appear here.</span>
          </div>
        ) : (
          <div className="inv-list">
            {invoices.map(inv=>(
              <div key={inv.invoiceId} className={`inv-card${selected?.invoiceId===inv.invoiceId?" expanded":""}`}>
                <div className="inv-card-row" onClick={()=>setSel(selected?.invoiceId===inv.invoiceId?null:inv)}>
                  <div className="inv-card-left">
                    <div className="inv-card-num">{inv.invoiceNumber}</div>
                    <div className="inv-card-date">Invoice: {inv.invoiceDate} · Due: {inv.dueDate}</div>
                  </div>
                  <div className="inv-card-right">
                    <div className="inv-card-amount">{fmt(inv.totalAmount)}</div>
                    <span className="inv-status-badge" style={STATUS_STYLE[inv.status]||STATUS_STYLE.PENDING}>{inv.status}</span>
                    <span className="inv-chevron">{selected?.invoiceId===inv.invoiceId?"▲":"▼"}</span>
                  </div>
                </div>
                {selected?.invoiceId===inv.invoiceId && (
                  <div className="inv-detail">
                    <div className="inv-detail-grid">
                      {[
                        ["Consultation Fee",    fmt(inv.consultationFee)],
                        ["Diagnostic Test Fee", fmt(inv.diagnosticTestFee)],
                        ["Scan Fee",            fmt(inv.scanFee)],
                        ["Medicine Fee",        fmt(inv.medicineFee)],
                        ["Tax",                 fmt(inv.tax)],
                        ["Total Amount",        fmt(inv.totalAmount)],
                        ["Provider ID",         `#${inv.providerId}`],
                        ["Invoice Date",        inv.invoiceDate],
                        ["Due Date",            inv.dueDate],
                        ["Status",              inv.status],
                      ].map(([label,value])=>(
                        <div key={label} className="inv-detail-row">
                          <span className="inv-detail-label">{label}</span>
                          <span className={`inv-detail-value${label==="Total Amount"?" highlight":""}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                    {inv.status!=="PAID"
                      ? <button className="inv-pay-btn" onClick={()=>markPaid(inv)} disabled={paying===inv.invoiceId}>{paying===inv.invoiceId?"Processing…":"💳 Mark as Paid"}</button>
                      : <div className="inv-paid-badge">✅ Payment Complete</div>
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}