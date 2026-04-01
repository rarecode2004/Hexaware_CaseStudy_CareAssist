import React, { useState, useEffect } from "react";
import { useCompanyId } from "./useCompanyId";
import "./InsuranceDashboard.css";

const BASE = "http://localhost:9090";

const hdrs = () => {
  const t = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function ClaimHistory() {
  const { companyId, resolving } = useCompanyId();

  const [claims, setClaims] = useState([]);
  const [invoices, setInv] = useState({});
  const [loading, setLoad] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!resolving && companyId) fetchAll();
  }, [resolving, companyId]);

  async function fetchAll() {
    setLoad(true);
    try {
      const r = await fetch(`${BASE}/claims/getall`, { headers: hdrs() });
      if (!r.ok) throw 0;

      const all = await r.json();

      const mine = all.filter(
        (c) => String(c.companyId) === String(companyId)
      );

      setClaims(mine);

      // fetch invoices (FIXED)
      const invMap = {};
      await Promise.all(
        [
          ...new Set(
            mine
              .map(
                (c) =>
                  c.invoiceId ||
                  c.invoice_id ||
                  c.invoice_invoice_id
              )
              .filter(Boolean)
          ),
        ].map(async (id) => {
          try {
            const ri = await fetch(`${BASE}/invoices/get/${id}`, {
              headers: hdrs(),
            });
            if (ri.ok) invMap[id] = await ri.json();
          } catch {}
        })
      );

      setInv(invMap);
    } catch {}
    setLoad(false);
  }

  const filtered = claims
    .filter((c) => filter === "ALL" || c.claimStatus === filter)
    .filter(
      (c) =>
        !search ||
        c.claimNumber?.toLowerCase().includes(search.toLowerCase()) ||
        String(c.patientId).includes(search)
    );

  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.claimStatus === "APPROVED").length,
    rejected: claims.filter((c) => c.claimStatus === "REJECTED").length,
  };

  if (resolving)
    return (
      <div className="ic-loading">
        <div className="ic-spinner" />
        <p>Identifying your company…</p>
      </div>
    );

  if (!companyId)
    return (
      <div className="ic-error" style={{ margin: 0 }}>
        Company profile not found. Please complete your profile first.
      </div>
    );

  return (
    <div>
      {/* Stats */}
      <div className="ic-stats">
        {[
          ["Total Claims", stats.total, "📊"],
          ["Approved", stats.approved, "✅"],
          ["Rejected", stats.rejected, "❌"],
        ].map(([l, v, i]) => (
          <div key={l} className="ic-stat">
            <div style={{ fontSize: "1.3rem" }}>{i}</div>
            <div className="ic-stat-val">{v}</div>
            <div className="ic-stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="ic-card">
        <div className="ic-header">
          <div className="ic-icon">📊</div>
          <div>
            <h2 className="ic-title">Claim History</h2>
            <p className="ic-sub">
              Full history — invoice amount, claim amount
            </p>
          </div>
        </div>

        
          <div className="ic-filters" style={{margin:0}}>
            {["ALL","PENDING","APPROVED","REJECTED"].map((s) => (
              <button key={s} className={`ic-filter-btn${filter===s?" active":""}`} onClick={() => setFilter(s)}>
                {s}
              </button>
            ))}
          </div>
        

        {/* Table */}
        {loading ? (
          <div className="ic-loading">
            <div className="ic-spinner" />
            <p>Loading history…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ic-empty">No claims found.</div>
        ) : (
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:".84rem"}}>
              <thead>
                <tr style={{borderBottom:"2px solid var(--border-m)"}}>
                  {["Claim #","Patient","Diagnosis","Invoice Amt","Claim Amt","Claim Status"].map((h) => (
                    <th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:".66rem",textTransform:"uppercase",letterSpacing:".06em",color:"var(--text-s)",whiteSpace:"nowrap"}}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((c, i) => {
                  const inv = invoices[c.invoiceId || c.invoice_id || c.invoice_invoice_id];

                  return (
                    <tr key={c.claimId} style={{borderBottom:"1px solid var(--border)",background:i%2===0?"#fff":"#f9fefb"}}>
                      <td style={{padding:"11px 12px",fontFamily:"'Outfit',sans-serif",fontWeight:700,color:"var(--text)"}}>{c.claimNumber}</td>
                      <td style={{padding:"11px 12px",color:"var(--text-m)"}}># {c.patientId}</td>
                      <td style={{padding:"11px 12px",color:"var(--text-m)",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.diagnosis||"—"}</td>
                      <td style={{padding:"11px 12px",color:"var(--text)",fontWeight:600}}>{inv?.totalAmount ? fmt(inv.totalAmount) : "—"}</td>
                      <td style={{padding:"11px 12px",color:"var(--g1)",fontFamily:"'Outfit',sans-serif",fontWeight:800}}>{fmt(c.claimAmount)}</td>
                      <td style={{padding:"11px 12px"}}><span className={`ic-badge badge-${c.claimStatus}`}>{c.claimStatus}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}