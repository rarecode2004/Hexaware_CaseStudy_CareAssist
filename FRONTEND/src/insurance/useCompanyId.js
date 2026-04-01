// useCompanyId.js — resolves companyId from localStorage or backend
import { useState, useEffect } from "react";

const BASE = "http://localhost:9090";
const hdrs = () => { const t=localStorage.getItem("token"); return {"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})}; };

function resolveUserId() {
  for (const k of ["userId","user_id","id","uid"]) { const v=localStorage.getItem(k); if(v&&!isNaN(v)) return v; }
  for (const k of ["user","currentUser","userData"]) { try{const o=JSON.parse(localStorage.getItem(k)); if(o){const u=o.userId||o.user_id||o.id; if(u) return String(u);}}catch{} }
  try{const p=JSON.parse(atob(localStorage.getItem("token").split(".")[1])); return p.userId||p.user_id||p.id||(p.sub&&!isNaN(p.sub)?p.sub:null);}catch{return null;}
}

export function useCompanyId() {
  const [companyId, setCid] = useState(null);
  const [resolving, setRes] = useState(true);

  useEffect(() => {
    async function resolve() {
      // 1. already cached
      const cached = localStorage.getItem("companyId");
      if (cached && !isNaN(cached)) { setCid(parseInt(cached)); setRes(false); return; }

      // 2. fetch from backend using userId
      const uid = resolveUserId();
      if (uid) {
        try {
          const r = await fetch(`${BASE}/insurance-companies/get/user/${uid}`, { headers:hdrs() });
          if (r.ok) {
            const d = await r.json();
            localStorage.setItem("companyId", d.companyId);
            setCid(d.companyId);
          }
        } catch {}
      }
      setRes(false);
    }
    resolve();
  }, []);

  return { companyId, resolving };
}