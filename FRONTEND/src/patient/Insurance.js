import React, { useState, useEffect } from "react";
import "./Insurance.css";

const BASE = "http://localhost:9090";
const hdrs = () => {
  const t = localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
};
const inr = n => `₹${Number(n).toLocaleString("en-IN")}`;

// ── icons ─────────────────────────────────────────────────────────────────────
const IcoBuilding = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;
const IcoShield   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoCheck    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoBack     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;


const StepBar = ({ step }) => (
  <div className="ins-stepbar">
    {["Companies","Plans","Confirm"].map((label, i) => (
      <React.Fragment key={label}>
        <div className={`ins-step${step>i?" done":""}${step===i?" active":""}`}>
          <div className="ins-step-dot">{step>i ? <IcoCheck/> : <span>{i+1}</span>}</div>
          <span className="ins-step-label">{label}</span>
        </div>
        {i < 2 && <div className={`ins-step-line${step>i?" done":""}`}/>}
      </React.Fragment>
    ))}
  </div>
);

const Skeleton = () => (
  <div className="ins-grid">
    {[1,2,3].map(i=>(
      <div key={i} className="ins-card ins-skeleton">
        <div className="skel-icon"/><div className="skel-line lg"/><div className="skel-line md"/><div className="skel-line sm"/>
      </div>
    ))}
  </div>
);

// ── main ──────────────────────────────────────────────────────────────────────
export default function Insurance() {
  const [step,     setStep]    = useState(0);
  const [companies,setComp]    = useState([]);
  const [plans,    setPlans]   = useState([]);
  const [company,  setCompany] = useState(null);
  const [plan,     setPlan]    = useState(null);
  const [loading,  setLoad]    = useState(false);
  const [error,    setError]   = useState("");
  const [enrolling,setBusy]    = useState(false);
  const [enrolled, setDone]    = useState(false);
  const [policy,   setPolicy]  = useState("");
  const [pid,      setPid]     = useState(null);
  const [resolving,setRes]     = useState(true);

  useEffect(() => { resolvePatient().then(fetchCompanies); }, []);

  async function resolvePatient() {
    setRes(true);
    const cached = localStorage.getItem("patientId");
    if (cached) { setPid(parseInt(cached)); setRes(false); return; }

    // find userId — try direct keys, JSON objects, then JWT
    let uid = null;
    for (const k of ["userId","user_id","id","uid"]) { const v=localStorage.getItem(k); if(v&&!isNaN(v)){uid=v;break;} }
    if (!uid) for (const k of ["user","currentUser","loggedInUser","userData"]) {
      try { const o=JSON.parse(localStorage.getItem(k)); if(o){uid=o.userId||o.user_id||o.id||o.uid; if(uid)break;} } catch{}
    }
    if (!uid) try { const p=JSON.parse(atob(localStorage.getItem("token").split(".")[1])); uid=p.userId||p.user_id||p.id||(p.sub&&!isNaN(p.sub)?p.sub:null); } catch{}

    if (uid) try {
      const r = await fetch(`${BASE}/patients/get/user/${uid}`, { headers: hdrs() });
      if (r.ok) { const d=await r.json(); const p=d.patientId||d.patient_id; if(p){localStorage.setItem("patientId",p);setPid(p);} }
    } catch {}
    setRes(false);
  }

  async function fetchCompanies() {
    setLoad(true); setError("");
    try { const r=await fetch(`${BASE}/insurance-companies/getall`,{headers:hdrs()}); if(!r.ok)throw 0; setComp(await r.json()); }
    catch { setError("Could not load companies. Please try again."); }
    finally { setLoad(false); }
  }

  async function fetchPlans(id) {
    setLoad(true); setError("");
    try { const r=await fetch(`${BASE}/plans/get/company/${id}`,{headers:hdrs()}); if(!r.ok)throw 0; setPlans(await r.json()); }
    catch { setError("Could not load plans. Please try again."); }
    finally { setLoad(false); }
  }

  function selectCompany(c) { setCompany(c); setStep(1); fetchPlans(c.companyId); }
  function selectPlan(p)    { setPlan(p); setPolicy("POL"+Date.now().toString().slice(-6)); setStep(2); }

  async function enroll() {
    if (!pid) { setError("Patient profile not found. Please complete your profile first."); return; }
    setBusy(true); setError("");
    const today=new Date().toISOString().split("T")[0], end=new Date();
    end.setFullYear(end.getFullYear()+1);
    try {
      const r = await fetch(`${BASE}/patient-insurance/add`, {
        method:"POST", headers:hdrs(),
        body: JSON.stringify({ policyNumber:policy, startDate:today, endDate:end.toISOString().split("T")[0], status:"ACTIVE", patientId:pid, planId:plan.planId })
      });
      if(!r.ok) throw await r.text();
      setDone(true);
    } catch(e) { setError("Enrollment failed: "+(e||"Please try again.")); }
    finally { setBusy(false); }
  }

  function reset() { setStep(0);setCompany(null);setPlan(null);setDone(false);setError("");fetchCompanies(); }

  if (resolving) return (
    <div className="ins-root">
      <div className="ins-resolving"><div className="ins-spinner"/><p>Loading your patient profile…</p></div>
    </div>
  );

  const confirmRows = [
    ["Company",company?.companyName],["Plan",plan?.planName],
    ["Max Coverage",inr(plan?.maxCoverageAmount)],["Annual Premium",inr(plan?.premiumAmount)],
    ["Coverage Details",plan?.coverageDetails],["Policy Number",policy],
    ["Start Date",new Date().toLocaleDateString("en-IN")],
    ["End Date",new Date(new Date().setFullYear(new Date().getFullYear()+1)).toLocaleDateString("en-IN")],
  ];

  return (
    <div className="ins-root">

      {/* Header */}
      <div className="ins-header">
        <div className="ins-header-icon"><IcoShield/></div>
        <div>
          <h2 className="ins-title">Insurance Plans</h2>
          <p className="ins-sub">
            Browse companies and enroll in a plan
            {pid ? <span className="ins-pid-badge"> · Patient #{pid}</span>
                 : <span className="ins-pid-missing"> · ⚠ Profile not linked</span>}
          </p>
        </div>
      </div>

      <StepBar step={step}/>

      {error && <div className="ins-error"><span>{error}</span><button className="ins-retry-btn" onClick={()=>setError("")}>Dismiss</button></div>}

      {/* Step 0 — Companies */}
      {step===0 && <>
        <div className="ins-section-header">
          <h3 className="ins-section-title"><IcoBuilding/> Choose an Insurance Company</h3>
        </div>
        {loading ? <Skeleton/> : (
          <div className="ins-grid">
            {companies.length===0
              ? <div className="ins-empty">No insurance companies available right now.</div>
              : companies.map(c=>(
                <div key={c.companyId} className="ins-card">
                  <div className="ins-card-icon company-icon"><IcoBuilding/></div>
                  <h3 className="ins-card-name">{c.companyName}</h3>
                  {[["Address",c.address],["Email",c.contactEmail],["Phone",c.contactPhone]].map(([l,v])=>(
                    <p key={l} className="ins-card-detail"><span className="ins-label">{l}</span><span>{v}</span></p>
                  ))}
                  <button className="ins-btn ins-btn-primary" onClick={()=>selectCompany(c)}>View Plans →</button>
                </div>
              ))}
          </div>
        )}
      </>}

      {/* Step 1 — Plans */}
      {step===1 && <>
        <div className="ins-section-header">
          <button className="ins-back-btn" onClick={()=>{setStep(0);setCompany(null);}}><IcoBack/> Back</button>
          <h3 className="ins-section-title">Plans by <span className="ins-highlight">{company?.companyName}</span></h3>
        </div>
        {loading ? <Skeleton/> : (
          <div className="ins-grid">
            {plans.length===0
              ? <div className="ins-empty">No plans available for this company.</div>
              : plans.map(p=>(
                <div key={p.planId} className="ins-card">
                  <div className="ins-card-icon plan-icon"><IcoShield/></div>
                  <h3 className="ins-card-name">{p.planName}</h3>
                  <div className="ins-stat-row">
                    <div className="ins-stat"><span className="ins-stat-val">{inr(p.maxCoverageAmount)}</span><span className="ins-stat-label">Max Coverage</span></div>
                    <div className="ins-stat-divider"/>
                    <div className="ins-stat"><span className="ins-stat-val">{inr(p.premiumAmount)}</span><span className="ins-stat-label">Annual Premium</span></div>
                  </div>
                  <p className="ins-card-detail"><span className="ins-label">Coverage Details</span><span>{p.coverageDetails}</span></p>
                  <button className="ins-btn ins-btn-primary" onClick={()=>selectPlan(p)}>Select this Plan →</button>
                </div>
              ))}
          </div>
        )}
      </>}

      {/* Step 2 — Confirm */}
      {step===2 && !enrolled && (
        <div className="ins-confirm-wrap">
          <div className="ins-confirm-card">
            <div className="ins-confirm-header">
              <div className="ins-card-icon plan-icon"><IcoShield/></div>
              <h3>Confirm Enrollment</h3>
            </div>
            {!pid && <div className="ins-warn-box">⚠️ Patient profile not linked. Please go to Profile tab first.</div>}
            {confirmRows.map(([label,value])=>(
              <div key={label} className="ins-confirm-row">
                <span className="ins-label">{label}</span>
                {label==="Policy Number" ? <span className="ins-policy-badge">{value}</span> : <span>{value}</span>}
              </div>
            ))}
            <div className="ins-confirm-actions">
              <button className="ins-btn ins-btn-outline" onClick={()=>setStep(1)} disabled={enrolling}><IcoBack/> Change Plan</button>
              <button className="ins-btn ins-btn-primary" onClick={enroll} disabled={enrolling||!pid}>{enrolling?"Enrolling…":"Confirm & Enroll"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {enrolled && (
        <div className="ins-success-wrap">
          <div className="ins-success-card">
            <div className="ins-success-icon"><IcoCheck/></div>
            <h2 className="ins-success-title">Enrollment Successful!</h2>
            <p className="ins-success-sub">You are now enrolled in <strong>{plan?.planName}</strong> by <strong>{company?.companyName}</strong>.</p>
            <div className="ins-policy-display">
              <span className="ins-label">Your Policy Number</span>
              <span className="ins-policy-big">{policy}</span>
            </div>
            <button className="ins-btn ins-btn-primary" onClick={reset}>Browse More Plans</button>
          </div>
        </div>
      )}
    </div>
  );
}