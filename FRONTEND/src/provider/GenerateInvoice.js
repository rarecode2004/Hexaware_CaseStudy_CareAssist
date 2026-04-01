import React, { useState, useEffect } from "react";
import "./ProviderDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };
const today  = () => new Date().toISOString().split("T")[0];
const due30  = () => { const d=new Date(); d.setDate(d.getDate()+30); return d.toISOString().split("T")[0]; };
const fmt    = n  => `₹${Number(n||0).toLocaleString("en-IN")}`;

const FEES = [
  ["consultationFee",   "Consultation Fee (₹)"],
  ["diagnosticTestFee", "Diagnostic Test Fee (₹)"],
  ["scanFee",           "Scan Fee (₹)"],
  ["medicineFee",       "Medicine Fee (₹)"],
  ["tax",               "Tax (₹)"],
];

const BLANK = { invoiceNumber:"", invoiceDate:today(), dueDate:due30(),
  consultationFee:"0", diagnosticTestFee:"0", scanFee:"0", medicineFee:"0", tax:"0",
  totalAmount:"0", status:"PENDING" };

export default function GenerateInvoice() {
  const [form, setForm]         = useState(BLANK);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatId]   = useState("");
  const [patientInfo, setInfo]  = useState(null); // verified patient object
  const [searching, setSearch]  = useState(false);
  const [submitting, setSub]    = useState(false);
  const [msg, setMsg]           = useState({ type:"", text:"" });
  const [done, setDone]         = useState(null);
  const [useDropdown, setMode]  = useState(true); // toggle between dropdown & search

  useEffect(() => {
    setForm(f => ({ ...f, invoiceNumber:"INV"+Date.now().toString().slice(-6) }));
    tryFetchPatients();
  }, []);

  // auto-recalculate total
  useEffect(() => {
    const bill = FEES.slice(0,4).reduce((a,[k])=>a+parseFloat(form[k]||0),0);
    const total = bill + parseFloat(form.tax||0);
    setForm(f => ({ ...f, totalAmount: total.toFixed(2) }));
  }, [form.consultationFee, form.diagnosticTestFee, form.scanFee, form.medicineFee, form.tax]);

  async function tryFetchPatients() {
    try {
      const r = await fetch(`${BASE}/patients/getall`, { headers: hdrs() });
      if (r.ok) { setPatients(await r.json()); setMode(true); }
      else { setMode(false); } // fallback to manual search
    } catch { setMode(false); }
  }

  // look up a single patient by ID (uses the /get/{id} endpoint which provider CAN access)
  async function lookupPatient() {
    if (!patientId) return;
    setSearch(true); setInfo(null); setMsg({ type:"", text:"" });
    try {
      const r = await fetch(`${BASE}/patients/get/${patientId}`, { headers: hdrs() });
      if (r.ok) {
        const d = await r.json();
        setInfo(d);
        setMsg({ type:"success", text:`Patient found: ${d.fullName} (ID #${d.patientId})` });
      } else {
        setMsg({ type:"error", text:`No patient found with ID ${patientId}.` });
      }
    } catch {
      setMsg({ type:"error", text:"Failed to look up patient." });
    }
    setSearch(false);
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const pid  = useDropdown ? patientId : (patientInfo?.patientId);
    const provId = localStorage.getItem("providerId");
    if (!pid)    { setMsg({ type:"error", text:"Please select or look up a patient." }); return; }
    if (!provId) { setMsg({ type:"error", text:"Provider profile not set. Go to Profile tab first." }); return; }

    setSub(true); setMsg({ type:"", text:"" });
    const payload = {
      ...form,
      patientId: parseInt(pid), providerId: parseInt(provId),
      consultationFee: parseFloat(form.consultationFee),
      diagnosticTestFee: parseFloat(form.diagnosticTestFee),
      scanFee: parseFloat(form.scanFee),
      medicineFee: parseFloat(form.medicineFee),
      tax: parseFloat(form.tax),
      totalAmount: parseFloat(form.totalAmount),
    };
    try {
      const r = await fetch(`${BASE}/invoices/add`, { method:"POST", headers:hdrs(), body:JSON.stringify(payload) });
      if (!r.ok) throw await r.text();
      setDone({ ...payload, patientName: patientInfo?.fullName || `Patient #${pid}` });
      setMsg({ type:"success", text:"✅ Invoice generated! PDF email sent to patient." });
      setForm({ ...BLANK, invoiceNumber:"INV"+Date.now().toString().slice(-6), invoiceDate:today(), dueDate:due30() });
      setPatId(""); setInfo(null);
    } catch(e) { setMsg({ type:"error", text:"Failed: "+(e||"Please try again.") }); }
    setSub(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>

      {/* success summary */}
      {done && (
        <div className="prov-card" style={{borderColor:"var(--border-m)"}}>
          <div className="prov-header">
            <div className="prov-section-icon">✅</div>
            <div><h2 className="prov-title">Invoice Sent!</h2><p className="prov-sub">Saved to database · Email dispatched to patient</p></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px 24px",fontSize:".875rem"}}>
            {[["Invoice No.",done.invoiceNumber],["Patient",done.patientName],["Invoice Date",done.invoiceDate],
              ["Due Date",done.dueDate],["Total",fmt(done.totalAmount)],["Status",done.status]].map(([l,v])=>(
              <div key={l}>
                <div style={{color:"var(--text-s)",fontSize:".65rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em"}}>{l}</div>
                <div style={{color:"var(--text)",fontWeight:600,marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* form */}
      <div className="prov-card">
        <div className="prov-header">
          <div className="prov-section-icon">📄</div>
          <div><h2 className="prov-title">Generate Invoice</h2>
            <p className="prov-sub">Select a patient, fill in service fees — email sent automatically</p>
          </div>
        </div>

        {msg.text && <div className={msg.type==="success"?"prov-success":"prov-error"} style={{marginBottom:16}}>{msg.text}</div>}

        <form onSubmit={handleSubmit} className="prov-form">

          {/* Invoice number + date */}
          <div className="field">
            <label>Invoice Number</label>
            <input value={form.invoiceNumber} onChange={set("invoiceNumber")} required/>
          </div>
          <div className="field">
            <label>Invoice Date</label>
            <input type="date" value={form.invoiceDate} onChange={set("invoiceDate")} required/>
          </div>
          <div className="field">
            <label>Due Date</label>
            <input type="date" value={form.dueDate} onChange={set("dueDate")} required/>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={set("status")}>
              <option>PENDING</option><option>PAID</option><option>CANCELLED</option>
            </select>
          </div>

          {/* Patient selector */}
          <div className="field span2">
            <label>Select Patient *</label>
            {useDropdown && patients.length > 0 ? (
              <select value={patientId} onChange={e=>setPatId(e.target.value)} required>
                <option value="">-- Select Patient --</option>
                {patients.map(p=>(
                  <option key={p.patientId} value={p.patientId}>#{p.patientId} — {p.fullName} ({p.gender}, Age {p.age})</option>
                ))}
              </select>
            ) : (
              /* fallback: search by patient ID */
              <div style={{display:"flex",gap:8}}>
                <input
                  type="number" placeholder="Enter Patient ID (e.g. 2, 3, 5…)"
                  value={patientId} onChange={e=>setPatId(e.target.value)}
                  style={{flex:1}}
                />
                <button type="button" className="prov-btn" style={{padding:"10px 18px",marginTop:0,whiteSpace:"nowrap"}}
                  onClick={lookupPatient} disabled={searching||!patientId}>
                  {searching ? "…" : "Verify Patient"}
                </button>
              </div>
            )}
            {/* patient info chip */}
            {patientInfo && !useDropdown && (
              <div style={{marginTop:8,background:"#ecfdf5",border:"1px solid var(--border-m)",borderRadius:8,padding:"8px 14px",fontSize:".85rem",color:"var(--g1)",fontWeight:500}}>
                ✓ {patientInfo.fullName} · {patientInfo.gender} · Age {patientInfo.age} · 📍 {patientInfo.address}
              </div>
            )}
            {/* toggle hint */}
            {!useDropdown && (
              <span style={{fontSize:".72rem",color:"var(--text-s)",marginTop:4}}>
                💡 Patient IDs in your DB: 2 (John Doe), 3 (Tom), 5 (Test), 6 (gopi), 7 (gopika)
              </span>
            )}
          </div>

          {/* fee fields */}
          {FEES.map(([k,label])=>(
            <div className="field" key={k}>
              <label>{label}</label>
              <input type="number" min="0" step="0.01" value={form[k]} onChange={set(k)}/>
            </div>
          ))}

          {/* total */}
          <div className="field span2">
            <label>Total Amount (auto-calculated)</label>
            <input readOnly value={`₹ ${form.totalAmount}`}
              style={{background:"#ecfdf5",color:"var(--g1)",fontWeight:800,fontFamily:"'Outfit',sans-serif",fontSize:"1.1rem"}}/>
          </div>

          <div className="field span2" style={{marginTop:8}}>
            <button className="prov-btn" type="submit" disabled={submitting}>
              {submitting ? "Generating…" : "Generate Invoice & Notify Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}