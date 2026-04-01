import React, { useState, useEffect, useRef } from "react";
import "./AdminDashboard.css";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };
const fmt  = n => `₹${Number(n||0).toLocaleString("en-IN")}`;

function PieChart({ data }) {
  const total = data.reduce((a,d)=>a+d.value,0);
  if (!total) return null;
  let angle = -90;
  const slices = data.map(d => {
    const pct   = d.value/total;
    const start = angle;
    angle += pct*360;
    return { ...d, pct, start, end:angle };
  });
  const toXY = (cx,cy,r,deg) => {
    const rad = (deg*Math.PI)/180;
    return [cx+r*Math.cos(rad), cy+r*Math.sin(rad)];
  };
  const arc = (cx,cy,r,start,end) => {
    const [sx,sy] = toXY(cx,cy,r,start);
    const [ex,ey] = toXY(cx,cy,r,end);
    const large   = end-start>180?1:0;
    return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`;
  };

  return (
    <div style={{display:"flex",alignItems:"center",gap:28,flexWrap:"wrap"}}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {slices.map((s,i)=>(
          <path key={i} d={arc(90,90,80,s.start,s.end)} fill={s.color} opacity=".9"/>
        ))}
        <circle cx="90" cy="90" r="38" fill="#fff"/>
        <text x="90" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0c1a12">{total}</text>
        <text x="90" y="100" textAnchor="middle" fontSize="9" fill="#7a9a85">Total Users</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {slices.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:".85rem"}}>
            <div style={{width:12,height:12,borderRadius:3,background:s.color,flexShrink:0}}/>
            <span style={{color:"#0c1a12",fontWeight:600}}>{s.label}</span>
            <span style={{color:"#7a9a85"}}>— {s.value} ({(s.pct*100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditModal({ type, item, onClose, onSave }) {
  const [form, setForm] = useState({ ...item });
  const [saving, setSave] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const fields = {
    patients:  [["fullName","Full Name"],["age","Age"],["gender","Gender"],["mobile","Mobile"],["address","Address"]],
    providers: [["providerName","Provider Name"],["address","Address"],["contactNumber","Contact Number"]],
    companies: [["companyName","Company Name"],["address","Address"],["contactEmail","Contact Email"],["contactPhone","Contact Phone"]],
  };

  async function submit(e) {
    e.preventDefault(); setSave(true);
    const urlMap = { patients:`${BASE}/patients/update`, providers:`${BASE}/healthcare-providers/update`, companies:`${BASE}/insurance-companies/update` };
    try {
      const r = await fetch(urlMap[type], { method:"PUT", headers:hdrs(), body:JSON.stringify(form) });
      if (!r.ok) throw 0;
      onSave(form); onClose();
    } catch { alert("Update failed."); }
    setSave(false);
  }

  return (
    <div className="ad-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="ad-modal">
        <div className="ad-modal-header">
          <h3 className="ad-modal-title">Edit Record</h3>
          <button className="ad-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="ad-form single">
          {(fields[type]||[]).map(([k,label])=>(
            <div key={k} className="field">
              <label>{label}</label>
              <input value={form[k]||""} onChange={set(k)}/>
            </div>
          ))}
          <div className="field" style={{marginTop:6}}>
            <button className="ad-btn" type="submit" disabled={saving}>{saving?"Saving…":"Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DataTable({ type, data, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);

  const colsMap = {
    patients:  ["#","ID","Full Name","Age","Gender","Mobile","Address","Actions"],
    providers: ["#","ID","Provider Name","Address","Contact","Actions"],
    companies: ["#","ID","Company Name","Address","Email","Phone","Actions"],
    users:     ["#","ID","Username","Email","Role ID","Actions"],
  };

  const rowMap = {
    patients:  p => [p.patientId,  p.fullName,     p.age,  p.gender,  p.mobile,       p.address],
    providers: p => [p.providerId, p.providerName, p.address, p.contactNumber],
    companies: p => [p.companyId,  p.companyName,  p.address, p.contactEmail, p.contactPhone],
    users:     p => [p.userId,     p.username,     p.email, p.roleId],
  };

  const deleteUrlMap = {
    patients:  id => `${BASE}/patients/delete/${id}`,
    providers: id => `${BASE}/healthcare-providers/delete/${id}`,
    companies: id => `${BASE}/insurance-companies/delete/${id}`,
    users:     id => `${BASE}/users/delete/${id}`,
  };

  const idKey = { patients:"patientId", providers:"providerId", companies:"companyId", users:"userId" };

  async function handleDelete(item) {
    if (!window.confirm(`Delete this record? This cannot be undone.`)) return;
    const id = item[idKey[type]];
    try {
      const r = await fetch(deleteUrlMap[type](id), { method:"DELETE", headers:hdrs() });
      if (!r.ok) throw 0;
      onDelete(id);
    } catch { alert("Delete failed."); }
  }

  const cols = colsMap[type]||[];
  const rows = rowMap[type]||(() => []);

  return (
    <>
      {editing && <EditModal type={type} item={editing} onClose={()=>setEditing(null)} onSave={updated=>{ onUpdate(updated); setEditing(null); }}/>}
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {data.length===0
              ? <tr><td colSpan={cols.length} style={{textAlign:"center",padding:"32px",color:"var(--text-s)"}}>No records found.</td></tr>
              : data.map((item,i)=>(
                <tr key={i}>
                  <td>{i+1}</td>
                  {rows(item).map((v,j)=><td key={j}>{v||"—"}</td>)}
                  <td>
                    <div style={{display:"flex",gap:6}}>
                      {type!=="users" && <button className="ad-btn sm outline" onClick={()=>setEditing(item)}>Edit</button>}
                      <button className="ad-btn sm danger" onClick={()=>handleDelete(item)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Analytics() {
  const [data, setData]       = useState({ users:[], patients:[], providers:[], companies:[] });
  const [loading, setLoad]    = useState(true);
  const [activeTable, setTbl] = useState(null); // null | "patients" | "providers" | "companies" | "users"

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoad(true);
    const [users,patients,providers,companies] = await Promise.all([
      fetch(`${BASE}/users/getall`,               {headers:hdrs()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      fetch(`${BASE}/patients/getall`,             {headers:hdrs()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      fetch(`${BASE}/healthcare-providers/getall`, {headers:hdrs()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      fetch(`${BASE}/insurance-companies/getall`,  {headers:hdrs()}).then(r=>r.ok?r.json():[]).catch(()=>[]),
    ]);
    setData({ users, patients, providers, companies });
    setLoad(false);
  }

  function handleUpdate(type, updated) {
    const idKey = { patients:"patientId", providers:"providerId", companies:"companyId", users:"userId" };
    setData(d=>({ ...d, [type]: d[type].map(i=>i[idKey[type]]===updated[idKey[type]]?updated:i) }));
  }
  function handleDelete(type, id) {
    const idKey = { patients:"patientId", providers:"providerId", companies:"companyId", users:"userId" };
    setData(d=>({ ...d, [type]: d[type].filter(i=>i[idKey[type]]!==id) }));
  }

  const pieData = [
    { label:"Patients",           value:data.patients.length,  color:"#059669" },
    { label:"Healthcare Providers",value:data.providers.length, color:"#0891b2" },
    { label:"Insurance Companies", value:data.companies.length, color:"#7c3aed" },
  ];

  const statCards = [
    { key:"users",     label:"Total Users",         val:data.users.length,     emoji:"👥", hint:"click to view" },
    { key:"patients",  label:"Total Patients",       val:data.patients.length,  emoji:"🏥", hint:"click to manage" },
    { key:"providers", label:"Healthcare Providers", val:data.providers.length, emoji:"👨‍⚕️", hint:"click to manage" },
    { key:"companies", label:"Insurance Companies",  val:data.companies.length, emoji:"🏢", hint:"click to manage" },
  ];

  if (loading) return <div className="ad-loading"><div className="ad-spinner"/><p>Loading analytics…</p></div>;

  return (
    <div>
      <div className="ad-stats">
        {statCards.map(s=>(
          <div key={s.key} className={`ad-stat${activeTable===s.key?" selected":""}`} onClick={()=>setTbl(activeTable===s.key?null:s.key)}>
            <div className="ad-stat-emoji">{s.emoji}</div>
            <div className="ad-stat-val">{s.val}</div>
            <div className="ad-stat-label">{s.label}</div>
            <div className="ad-stat-hint">{activeTable===s.key?"▲ hide":"▼ "+s.hint}</div>
          </div>
        ))}
      </div>

      {/* pie chart */}
      <div className="ad-card">
        <div className="ad-header">
          <div className="ad-icon">🥧</div>
          <div><h2 className="ad-title">User Distribution</h2><p className="ad-sub">Breakdown of registered users by role</p></div>
        </div>
        <PieChart data={pieData}/>
      </div>

     
      {activeTable && (
        <div className="ad-card">
          <div className="ad-header">
            <div className="ad-icon">{statCards.find(s=>s.key===activeTable)?.emoji}</div>
            <div>
              <h2 className="ad-title">{statCards.find(s=>s.key===activeTable)?.label}</h2>
              <p className="ad-sub">{data[activeTable]?.length} records · edit or delete any entry</p>
            </div>
            <button className="ad-btn outline sm" style={{marginLeft:"auto"}} onClick={()=>setTbl(null)}>✕ Close</button>
          </div>
          <DataTable
            type={activeTable}
            data={data[activeTable]||[]}
            onUpdate={u=>handleUpdate(activeTable,u)}
            onDelete={id=>handleDelete(activeTable,id)}
          />
        </div>
      )}
    </div>
  );
}
