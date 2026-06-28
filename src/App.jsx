import { useState, useEffect } from "react";

// ── Supabase ──────────────────────────────────────────────
const SUPA_URL = "https://swtzujdshvjhxrmjhjxg.supabase.co";
const SUPA_KEY = "sb_publishable_FloqiQT_1Bp-7lTj2Vf2Vw_d6oKj4wt";

const supaFetch = async (path, options={}) => {
  const res = await fetch(`${SUPA_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const getCitas = () => supaFetch("/citas?order=fecha,hora");
const insertCita = (cita) => supaFetch("/citas", { method:"POST", body: JSON.stringify(cita) });
const updateCita = (id, data) => supaFetch(`/citas?id=eq.${id}`, { method:"PATCH", body: JSON.stringify(data) });

// ── LocalStorage (para config local) ─────────────────────
const load = (k,fb) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):fb; } catch { return fb; } };
const save = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };



const C = {
  bg:"#0a0a0a", panel:"#111111", card:"#1a1a1a", border:"#2a2a2a",
  gold:"#c9a84c", goldL:"#e8c96a", goldD:"#8a6f2e",
  white:"#f5f0e8", muted:"#666666", mutedL:"#999999",
  success:"#4caf7d", danger:"#e05252", warning:"#e09c52",
};

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_SEMANA = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const PIN_BARBERO_DEFAULT = "1234";

const SERVICIOS_DEFAULT = [
  { id:"s1", nombre:"Corte clásico",     precio:5000,  duracion:30, emoji:"✂️" },
  { id:"s2", nombre:"Corte + barba",     precio:8000,  duracion:45, emoji:"🪒" },
  { id:"s3", nombre:"Barba",             precio:4000,  duracion:20, emoji:"🧔" },
  { id:"s4", nombre:"Corte niño",        precio:4000,  duracion:25, emoji:"👦" },
  { id:"s5", nombre:"Diseño de cejas",   precio:2500,  duracion:15, emoji:"✨" },
  { id:"s6", nombre:"Combo completo",    precio:10000, duracion:60, emoji:"💎" },
];

const INSUMOS_DEFAULT = [
  { id:"i1", nombre:"Navajas",          costo:3500, cantidad:10, unidad:"pack" },
  { id:"i2", nombre:"Talco",            costo:2000, cantidad:1,  unidad:"frasco" },
  { id:"i3", nombre:"Cera de pelo",     costo:4500, cantidad:1,  unidad:"pote" },
  { id:"i4", nombre:"Espuma de afeitar",costo:3000, cantidad:1,  unidad:"lata" },
  { id:"i5", nombre:"Aceite de barba",  costo:5000, cantidad:1,  unidad:"frasco" },
];

const HORAS_DEFAULT = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00"];

const fmtPrecio = n => `$${Number(n).toLocaleString("es-CL")}`;
const isoHoy = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const fmtFecha = iso => { const d=new Date(iso+"T00:00"); return `${DIAS_SEMANA[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const diasEnMes = (m,a) => new Date(a,m+1,0).getDate();
const primerDia = (m,a) => new Date(a,m,1).getDay();
const isoFecha = (d,m,a) => `${a}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

const generarDemo = () => {
  const h = isoHoy();
  const man = new Date(); man.setDate(man.getDate()+1);
  const m = isoFecha(man.getDate(),man.getMonth(),man.getFullYear());
  const sem = new Date(); sem.setDate(sem.getDate()+3);
  const s = isoFecha(sem.getDate(),sem.getMonth(),sem.getFullYear());
  return [
    { id:"d1", servicios:["s1"],     servicioNombre:"Corte clásico",      servicioEmoji:"✂️", precio:5000,  duracion:30, fecha:h, hora:"09:00", nombre:"Carlos Muñoz",      telefono:"+56912345678", nota:"",              estado:"confirmada", metodoPago:"efectivo",      creadaEn:new Date().toISOString() },
    { id:"d2", servicios:["s1","s3"],servicioNombre:"Corte + Barba",       servicioEmoji:"✂️", precio:9000,  duracion:50, fecha:h, hora:"10:00", nombre:"Diego Rojas",        telefono:"+56987654321", nota:"Barba larga",   estado:"confirmada", metodoPago:"transferencia", creadaEn:new Date().toISOString() },
    { id:"d3", servicios:["s6"],     servicioNombre:"Combo completo",      servicioEmoji:"💎", precio:10000, duracion:60, fecha:h, hora:"11:30", nombre:"Matías González",    telefono:"+56911223344", nota:"",              estado:"pendiente",  metodoPago:null,            creadaEn:new Date().toISOString() },
    { id:"d4", servicios:["s2"],     servicioNombre:"Corte + barba",       servicioEmoji:"🪒", precio:8000,  duracion:45, fecha:h, hora:"14:00", nombre:"Sebastián López",    telefono:"+56966778899", nota:"Degradé",       estado:"confirmada", metodoPago:"debito",        creadaEn:new Date().toISOString() },
    { id:"d5", servicios:["s4"],     servicioNombre:"Corte niño",          servicioEmoji:"👦", precio:4000,  duracion:25, fecha:h, hora:"15:30", nombre:"Pedro Vargas",       telefono:"+56933445566", nota:"",              estado:"pendiente",  metodoPago:null,            creadaEn:new Date().toISOString() },
    { id:"d6", servicios:["s1","s5"],servicioNombre:"Corte + Cejas",       servicioEmoji:"✂️", precio:7500,  duracion:45, fecha:m, hora:"09:30", nombre:"Andrés Castro",      telefono:"+56944556677", nota:"",              estado:"confirmada", metodoPago:"efectivo",      creadaEn:new Date().toISOString() },
    { id:"d7", servicios:["s3"],     servicioNombre:"Barba",               servicioEmoji:"🧔", precio:4000,  duracion:20, fecha:m, hora:"10:30", nombre:"Felipe Herrera",     telefono:"+56955667788", nota:"Perfilar solo", estado:"pendiente",  metodoPago:null,            creadaEn:new Date().toISOString() },
    { id:"d8", servicios:["s1"],     servicioNombre:"Corte clásico",       servicioEmoji:"✂️", precio:5000,  duracion:30, fecha:s, hora:"12:00", nombre:"Carlos Muñoz",       telefono:"+56912345678", nota:"",              estado:"confirmada", metodoPago:"efectivo",      creadaEn:new Date().toISOString() },
  ];
};

// ── UI Atoms ──────────────────────────────────────────────
const GoldLine = () => <div style={{ height:2, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, margin:"2px 0" }}/>;

function Btn({ children, onClick, disabled, variant="gold", style={}, small=false }) {
  const base = { border:"none", borderRadius:8, cursor:disabled?"not-allowed":"pointer", fontWeight:700, fontFamily:"inherit", transition:"all 0.15s", fontSize:small?12:14 };
  const vars = {
    gold:    { background:disabled?"#333":C.gold,    color:disabled?C.muted:"#000", padding:small?"7px 14px":"12px 20px" },
    ghost:   { background:"transparent", color:C.mutedL, border:`1px solid ${C.border}`, padding:small?"6px 12px":"10px 16px" },
    danger:  { background:"transparent", color:C.danger, border:`1px solid ${C.danger}44`, padding:small?"6px 12px":"10px 16px" },
    success: { background:C.success, color:"#000", padding:small?"7px 14px":"12px 20px" },
  };
  return <button onClick={disabled?undefined:onClick} style={{ ...base,...vars[variant],...style }}>{children}</button>;
}

function Field({ value, onChange, placeholder, type="text", style={} }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type}
    style={{ width:"100%", boxSizing:"border-box", background:"#0f0f0f", border:`1px solid ${C.border}`, borderRadius:8, padding:"11px 14px", color:C.white, fontSize:14, outline:"none", fontFamily:"inherit", ...style }}/>;
}

function Badge({ children, color }) {
  return <span style={{ background:`${color}22`, color, borderRadius:6, padding:"3px 9px", fontSize:11, fontWeight:700 }}>{children}</span>;
}

function Panel({ children, style={} }) {
  return <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:14, ...style }}>{children}</div>;
}

function SecTitle({ children }) {
  return <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>{children}</div>;
}

// ── VISTA CLIENTE ─────────────────────────────────────────
function VistaCliente({ servicios, citas, setCitas, agregarCita, horasDisponibles, diasBloqueados, ubicaciones, datosBancarios, configPremio }) {
  const [paso, setPaso] = useState(1);
  const [fechaSel, setFechaSel] = useState(null);
  const [serviciosSel, setServiciosSel] = useState([]);
  const [horaSel, setHoraSel] = useState(null);
  const [form, setForm] = useState({ nombre:"", telefono:"", nota:"" });
  const [metodoPago, setMetodoPago] = useState(null); // efectivo | debito | transferencia
  const [pagoCon, setPagoCon] = useState(""); // monto con que paga en efectivo
  const [mesVista, setMesVista] = useState(() => { const d=new Date(); return {m:d.getMonth(),a:d.getFullYear()}; });

  const totalPrecio = serviciosSel.reduce((s,id)=>{ const sv=servicios.find(x=>x.id===id); return s+(sv?.precio||0); },0);
  const totalTiempo = serviciosSel.reduce((s,id)=>{ const sv=servicios.find(x=>x.id===id); return s+(sv?.duracion||0); },0);

  const horasOcupadas = f => citas.filter(c=>c.fecha===f&&c.estado!=="cancelada").map(c=>c.hora);
  const horasLibres   = f => {
    const horasDelDia = Array.isArray(horasDisponibles) ? horasDisponibles : (horasDisponibles[f] || []);
    return horasDelDia.filter(h=>!horasOcupadas(f).includes(h));
  };

  const toggleServicio = id => setServiciosSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const numDias = diasEnMes(mesVista.m,mesVista.a);
  const inicio  = primerDia(mesVista.m,mesVista.a);
  const celdas  = [...Array(inicio).fill(null),...Array.from({length:numDias},(_,i)=>i+1)];
  while(celdas.length%7!==0) celdas.push(null);

  const irMes = d => setMesVista(p => { let m=p.m+d,a=p.a; if(m>11){m=0;a++;} if(m<0){m=11;a--;} return {m,a}; });
  const hoyIso = isoHoy();

  const confirmar = async () => {
    if (!form.nombre.trim()||!form.telefono.trim()||serviciosSel.length===0) return;
    const svs = serviciosSel.map(id=>servicios.find(s=>s.id===id)).filter(Boolean);
    const nuevaCita = {
      id:`c-${Date.now()}`, servicios:serviciosSel,
      servicioNombre:svs.map(s=>s.nombre).join(" + "),
      servicioEmoji:svs[0]?.emoji||"✂️",
      precio:totalPrecio, duracion:totalTiempo,
      fecha:fechaSel, hora:horaSel,
      nombre:form.nombre.trim(), telefono:form.telefono.trim(), nota:form.nota.trim(),
      estado:"pendiente", metodoPago:metodoPago||"por_definir",
      pagoCon: metodoPago==="efectivo"?parseInt(pagoCon)||null:null,
      creadaEn:new Date().toISOString(),
    };
    await agregarCita(nuevaCita);
    setPaso(5);
  };

  const reset = () => { setPaso(1); setServiciosSel([]); setFechaSel(null); setHoraSel(null); setForm({nombre:"",telefono:"",nota:""}); setMetodoPago(null); setPagoCon(""); };

  const BarraResumen = () => serviciosSel.length>0 ? (
    <div style={{ position:"sticky",top:0,zIndex:10,background:`${C.panel}ee`,borderBottom:`1px solid ${C.gold}44`,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",backdropFilter:"blur(8px)" }}>
      <div style={{ fontSize:12,color:C.muted }}>⏱ {totalTiempo} min · {serviciosSel.length} servicio{serviciosSel.length>1?"s":""}</div>
      <div style={{ color:C.gold,fontWeight:900,fontSize:18 }}>{fmtPrecio(totalPrecio)}</div>
    </div>
  ) : null;

  return (
    <div style={{ minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif",maxWidth:480,margin:"0 auto" }}>
      {/* Header */}
      <div style={{ padding:"24px 20px 18px",textAlign:"center",borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:36,marginBottom:6 }}>✂️</div>
        <h1 style={{ margin:0,fontSize:28,fontWeight:900,letterSpacing:-1,color:C.gold }}>BROLY BARBER</h1>
        <p style={{ margin:"4px 0 0",color:C.muted,fontSize:11,letterSpacing:2,textTransform:"uppercase" }}>Reserva tu hora</p>
        {/* Ubicación actual */}
        {(() => {
          const hoyStr = isoHoy();
          const ubicActiva = ubicaciones?.find(u=>hoyStr>=u.desde&&hoyStr<=u.hasta);
          return (
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"6px 14px",background:ubicActiva?`${C.success}22`:`${C.gold}18`,borderRadius:20,border:`1px solid ${ubicActiva?C.success+"44":C.gold+"33"}` }}>
              <span style={{ fontSize:14 }}>📍</span>
              <span style={{ fontSize:12,fontWeight:700,color:ubicActiva?C.success:C.gold }}>
                {ubicActiva?`Atendiendo en ${ubicActiva.ciudad}`:"Atendiendo en Vallenar"}
              </span>
            </div>
          );
        })()}
        <GoldLine/>
        {paso<5 && (
          <div style={{ display:"flex",justifyContent:"center",gap:6,marginTop:12 }}>
            {["Fecha","Servicios","Hora","Datos"].map((s,i)=>(
              <div key={s} style={{ display:"flex",alignItems:"center",gap:6 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,
                  background:paso>i+1?C.gold:paso===i+1?C.goldD:"#1a1a1a",
                  color:paso>i+1?"#000":paso===i+1?C.gold:C.muted,
                  border:paso===i+1?`2px solid ${C.gold}`:"2px solid transparent" }}>
                  {paso>i+1?"✓":i+1}
                </div>
                {i<3&&<div style={{ width:14,height:1,background:paso>i+1?C.gold:C.border }}/>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PASO 1 — CALENDARIO */}
      {paso===1 && (
        <div style={{ padding:16 }}>
          {/* Helper ubicación por fecha */}
          {(()=>{ window._ubicDeF = iso => ubicaciones?.find(u=>iso>=u.desde&&iso<=u.hasta)||null; return null; })()}
          <h2 style={{ margin:"0 0 14px",fontSize:17,fontWeight:800 }}>¿Qué día quieres venir?</h2>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <button onClick={()=>irMes(-1)} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:8,width:34,height:34,color:C.gold,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
            <span style={{ fontWeight:800,fontSize:16 }}>{MESES[mesVista.m]} {mesVista.a}</span>
            <button onClick={()=>irMes(1)}  style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:8,width:34,height:34,color:C.gold,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
          </div>
          <div style={{ background:C.card,borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}` }}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"#151515" }}>
              {DIAS_SEMANA.map(d=><div key={d} style={{ textAlign:"center",padding:"8px 0",fontSize:11,fontWeight:700,color:C.muted }}>{d}</div>)}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)" }}>
              {celdas.map((dia,idx)=>{
                if(!dia) return <div key={`v-${idx}`} style={{ minHeight:52 }}/>;
                const iso=isoFecha(dia,mesVista.m,mesVista.a);
                const esHoyM = iso===hoyIso;
                const esPasado = iso<hoyIso;
                const esDom = new Date(iso+"T00:00").getDay()===0;
                const bloqueado = diasBloqueados?.includes(iso);
                const libres = (!esPasado&&!esDom&&!bloqueado)?horasLibres(iso).length:0;
                const disabled = esPasado||esDom||bloqueado||libres===0;
                const ubic = !disabled ? (ubicaciones?.find(u=>iso>=u.desde&&iso<=u.hasta)||null) : null;
                return (
                  <div key={dia} onClick={()=>!disabled&&(setFechaSel(iso),setPaso(2))}
                    style={{ minHeight:52,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
                      cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.3:1,
                      background:fechaSel===iso?`${C.gold}22`:ubic?`${C.success}0a`:"transparent",
                      borderBottom:`1px solid ${C.border}`,borderRight:idx%7!==6?`1px solid ${C.border}`:"none" }}>
                    <div style={{ width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                      background:esHoyM?`linear-gradient(135deg,${C.gold},${C.goldD})`:fechaSel===iso?`${C.gold}33`:"transparent",
                      color:esHoyM?"#000":C.white,fontWeight:esHoyM?800:400,fontSize:13 }}>
                      {bloqueado?"🔒":dia}
                    </div>
                    {!disabled&&<div style={{ width:6,height:6,borderRadius:"50%",background:libres>5?C.success:libres>2?C.warning:C.danger }}/>}
                    {ubic&&!disabled&&<div style={{ fontSize:9,color:C.success,fontWeight:700 }}>📍</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leyenda */}
          <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginTop:10,justifyContent:"center" }}>
            {[[C.success,"Disponible"],[C.warning,"Pocas horas"],[C.danger,"Casi lleno"]].map(([c,l])=>(
              <div key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:c }}/>{l}
              </div>
            ))}
            {ubicaciones?.length>0&&(
              <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.success }}>📍 Otra ciudad</div>
            )}
          </div>

          {/* Banner ubicación del día seleccionado */}
          {fechaSel&&(()=>{
            const ubic = ubicaciones?.find(u=>fechaSel>=u.desde&&fechaSel<=u.hasta)||null;
            return (
              <div style={{ marginTop:12,padding:"12px 14px",borderRadius:12,display:"flex",alignItems:"center",gap:10,
                border:`1px solid ${ubic?C.success+"55":C.gold+"44"}`,
                background:ubic?`${C.success}15`:`${C.gold}11` }}>
                <span style={{ fontSize:22,flexShrink:0 }}>📍</span>
                <div>
                  <div style={{ fontWeight:800,fontSize:14,color:ubic?C.success:C.gold }}>
                    {ubic?`Ese día atiende en ${ubic.ciudad}`:"Ese día atiende en Vallenar"}
                  </div>
                  <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>
                    {ubic
                      ? `Deberás ir a ${ubic.ciudad} · Del ${fmtFecha(ubic.desde)} al ${fmtFecha(ubic.hasta)}`
                      : "Ubicación habitual del barbero"}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* PASO 2 — SERVICIOS */}
      {paso===2 && (
        <div>
          <BarraResumen/>
          <div style={{ padding:16 }}>
            <button onClick={()=>setPaso(1)} style={{ background:"none",border:"none",color:C.gold,cursor:"pointer",fontFamily:"inherit",fontSize:13,marginBottom:12,padding:0 }}>← Volver</button>
            <div style={{ background:C.card,borderRadius:10,padding:"10px 14px",border:`1px solid ${C.gold}44`,marginBottom:8,display:"flex",justifyContent:"space-between" }}>
              <span style={{ color:C.muted,fontSize:13 }}>Fecha</span>
              <span style={{ color:C.gold,fontWeight:700,fontSize:13 }}>{fmtFecha(fechaSel)}</span>
            </div>
            {/* Ubicación del día */}
            {(()=>{
              const ubic = ubicaciones?.find(u=>fechaSel>=u.desde&&fechaSel<=u.hasta)||null;
              return (
                <div style={{ padding:"8px 12px",borderRadius:9,marginBottom:16,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,
                  background:ubic?`${C.success}18`:`${C.gold}11`,
                  color:ubic?C.success:C.gold }}>
                  📍 {ubic?`Ese día atiende en ${ubic.ciudad}`:"Atiende en Vallenar"}
                </div>
              );
            })()}
            <h2 style={{ margin:"0 0 6px",fontSize:17,fontWeight:800 }}>¿Qué servicios necesitas?</h2>
            <p style={{ margin:"0 0 14px",color:C.muted,fontSize:13 }}>Puedes elegir más de uno</p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {servicios.map(s=>{
                const sel=serviciosSel.includes(s.id);
                return (
                  <button key={s.id} onClick={()=>toggleServicio(s.id)}
                    style={{ background:sel?`${C.gold}18`:C.card,border:`2px solid ${sel?C.gold:C.border}`,borderRadius:12,padding:"13px 16px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ width:28,height:28,borderRadius:"50%",background:sel?C.gold:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sel?14:18,fontWeight:900,color:sel?"#000":C.white,flexShrink:0 }}>
                        {sel?"✓":s.emoji}
                      </div>
                      <div>
                        <div style={{ color:sel?C.gold:C.white,fontWeight:700,fontSize:14 }}>{s.nombre}</div>
                        <div style={{ color:C.muted,fontSize:12,marginTop:2 }}>⏱ {s.duracion} min</div>
                      </div>
                    </div>
                    <div style={{ color:sel?C.gold:C.mutedL,fontWeight:900,fontSize:16 }}>{fmtPrecio(s.precio)}</div>
                  </button>
                );
              })}
            </div>
            {serviciosSel.length>0&&(
              <div style={{ marginTop:16 }}>
                <div style={{ background:C.card,borderRadius:12,border:`1px solid ${C.gold}44`,padding:"14px 16px",marginBottom:12 }}>
                  <SecTitle>Resumen selección</SecTitle>
                  {serviciosSel.map(id=>{ const s=servicios.find(x=>x.id===id); return s?(<div key={id} style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><span style={{ fontSize:13 }}>{s.emoji} {s.nombre}</span><span style={{ fontSize:13,color:C.gold,fontWeight:700 }}>{fmtPrecio(s.precio)}</span></div>):null; })}
                  <div style={{ height:1,background:C.border,margin:"8px 0" }}/>
                  <div style={{ display:"flex",justifyContent:"space-between" }}>
                    <span style={{ fontWeight:800 }}>Total</span><span style={{ fontWeight:900,color:C.gold,fontSize:18 }}>{fmtPrecio(totalPrecio)}</span>
                  </div>
                  <div style={{ fontSize:12,color:C.muted,marginTop:4 }}>⏱ {totalTiempo} minutos</div>
                </div>
                <Btn onClick={()=>setPaso(3)} style={{ width:"100%",padding:"14px",fontSize:15 }}>Elegir hora →</Btn>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PASO 3 — HORA */}
      {paso===3&&(
        <div>
          <BarraResumen/>
          <div style={{ padding:16 }}>
            <button onClick={()=>setPaso(2)} style={{ background:"none",border:"none",color:C.gold,cursor:"pointer",fontFamily:"inherit",fontSize:13,marginBottom:12,padding:0 }}>← Volver</button>
            <div style={{ background:C.card,borderRadius:10,padding:"10px 14px",border:`1px solid ${C.gold}44`,marginBottom:16,display:"flex",justifyContent:"space-between" }}>
              <span style={{ color:C.muted,fontSize:13 }}>{fmtFecha(fechaSel)}</span>
              <span style={{ color:C.gold,fontWeight:700,fontSize:13 }}>{fmtPrecio(totalPrecio)} · {totalTiempo}min</span>
            </div>
            <h2 style={{ margin:"0 0 14px",fontSize:17,fontWeight:800 }}>¿A qué hora?</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
              {horasLibres(fechaSel).map(h=>(
                <button key={h} onClick={()=>{setHoraSel(h);setPaso(4);}}
                  style={{ background:horaSel===h?`${C.gold}22`:C.card,border:`2px solid ${horaSel===h?C.gold:C.border}`,borderRadius:10,padding:"14px 8px",cursor:"pointer",fontFamily:"inherit",color:horaSel===h?C.gold:C.white,fontWeight:700,fontSize:15 }}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PASO 4 — DATOS */}
      {paso===4&&(
        <div>
          <BarraResumen/>
          <div style={{ padding:16 }}>
            <button onClick={()=>setPaso(3)} style={{ background:"none",border:"none",color:C.gold,cursor:"pointer",fontFamily:"inherit",fontSize:13,marginBottom:12,padding:0 }}>← Volver</button>
            <div style={{ background:C.card,borderRadius:12,border:`1px solid ${C.gold}44`,padding:"14px 16px",marginBottom:20 }}>
              <SecTitle>Tu reserva</SecTitle>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><span style={{ color:C.muted,fontSize:13 }}>Fecha</span><span style={{ color:C.white,fontWeight:700,fontSize:13 }}>{fmtFecha(fechaSel)}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}><span style={{ color:C.muted,fontSize:13 }}>Hora</span><span style={{ color:C.gold,fontWeight:700,fontSize:13 }}>⏰ {horaSel}</span></div>
              <div style={{ height:1,background:C.border,marginBottom:8 }}/>
              {serviciosSel.map(id=>{ const s=servicios.find(x=>x.id===id); return s?(<div key={id} style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}><span style={{ fontSize:13 }}>{s.emoji} {s.nombre}</span><span style={{ fontSize:13,color:C.mutedL }}>{fmtPrecio(s.precio)}</span></div>):null; })}
              <div style={{ height:1,background:C.border,margin:"8px 0" }}/>
              <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ fontWeight:800 }}>Total</span><span style={{ color:C.gold,fontWeight:900,fontSize:18 }}>{fmtPrecio(totalPrecio)}</span></div>
              <div style={{ fontSize:12,color:C.muted,marginTop:4 }}>⏱ {totalTiempo} minutos aprox.</div>
            </div>
            {/* WhatsApp recordatorio */}
            <div style={{ background:`${C.success}11`,borderRadius:10,border:`1px solid ${C.success}33`,padding:"10px 14px",marginBottom:16,fontSize:12,color:C.success }}>
              📱 Recibirás recordatorio por WhatsApp el día antes de tu cita
            </div>
            <h2 style={{ margin:"0 0 14px",fontSize:17,fontWeight:800 }}>Tus datos</h2>
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
              <Field value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))} placeholder="Nombre completo *"/>
              <Field value={form.telefono} onChange={e=>setForm(p=>({...p,telefono:e.target.value}))} placeholder="Teléfono / WhatsApp *" type="tel"/>
              <Field value={form.nota} onChange={e=>setForm(p=>({...p,nota:e.target.value}))} placeholder="Alguna nota (opcional)"/>
            </div>

            {/* Método de pago */}
            <div style={{ background:C.card, borderRadius:12, border:`1px solid ${C.border}`, padding:"14px 14px", marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:800, color:C.white, marginBottom:12 }}>¿Cómo vas a pagar?</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom: metodoPago==="efectivo"?12:0 }}>
                {[["efectivo","💵","Efectivo"],["debito","💳","Débito"],["transferencia","📲","Transferencia"]].map(([val,ico,lab])=>(
                  <button key={val} onClick={()=>{ setMetodoPago(val); setPagoCon(""); }}
                    style={{ padding:"12px 4px", borderRadius:10, border:`2px solid ${metodoPago===val?C.gold:C.border}`,
                      background:metodoPago===val?`${C.gold}22`:C.bg,
                      cursor:"pointer", fontFamily:"inherit",
                      display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:24 }}>{ico}</span>
                    <span style={{ fontSize:12, fontWeight:metodoPago===val?700:400, color:metodoPago===val?C.gold:C.muted }}>{lab}</span>
                  </button>
                ))}
              </div>

              {/* EFECTIVO — calculadora de vuelto */}
              {metodoPago==="efectivo" && (
                <div style={{ marginTop:4 }}>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>¿Con cuánto vas a pagar?</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                    {[5000,10000,15000,20000,50000].filter(b=>b>=totalPrecio).slice(0,4).map(b=>(
                      <button key={b} onClick={()=>setPagoCon(String(b))}
                        style={{ padding:"8px 12px", borderRadius:8, border:`2px solid ${pagoCon===String(b)?C.gold:C.border}`,
                          background:pagoCon===String(b)?`${C.gold}22`:C.bg,
                          color:pagoCon===String(b)?C.gold:C.muted, fontWeight:pagoCon===String(b)?700:400,
                          fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                        {fmtPrecio(b)}
                      </button>
                    ))}
                  </div>
                  <Field value={pagoCon} onChange={e=>setPagoCon(e.target.value)} placeholder="O ingresa el monto" type="number" style={{ marginBottom: pagoCon?10:0 }}/>
                  {pagoCon && parseInt(pagoCon)>=totalPrecio && (
                    <div style={{ padding:"12px 14px", borderRadius:10, background:`${C.success}18`, border:`1px solid ${C.success}44`, textAlign:"center" }}>
                      <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Vuelto que recibirás</div>
                      <div style={{ fontSize:28, fontWeight:900, color:C.success }}>{fmtPrecio(parseInt(pagoCon)-totalPrecio)}</div>
                    </div>
                  )}
                  {pagoCon && parseInt(pagoCon)<totalPrecio && (
                    <div style={{ padding:"10px", borderRadius:10, background:`${C.danger}18`, border:`1px solid ${C.danger}44`, fontSize:13, color:C.danger, textAlign:"center" }}>
                      ⚠ El monto ingresado no cubre el total
                    </div>
                  )}
                </div>
              )}

              {/* DÉBITO */}
              {metodoPago==="debito" && (
                <div style={{ marginTop:4, padding:"10px 12px", borderRadius:9, background:`${C.gold}11`, border:`1px solid ${C.gold}33`, fontSize:12, color:C.gold }}>
                  💳 El barbero tendrá lista la máquina de débito para tu cita
                </div>
              )}

              {/* TRANSFERENCIA */}
              {metodoPago==="transferencia" && (
                <div style={{ marginTop:4 }}>
                  {datosBancarios?.banco ? (
                    <div style={{ background:`${C.success}11`, borderRadius:10, border:`1px solid ${C.success}33`, padding:"12px 14px" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.success, marginBottom:10 }}>📲 Datos para transferencia</div>
                      {[
                        ["Banco",    datosBancarios.banco],
                        ["Nombre",   datosBancarios.nombre],
                        ["RUT",      datosBancarios.rut],
                        ["N° Cuenta",datosBancarios.cuenta],
                        ["Tipo",     datosBancarios.tipo],
                        ["Monto",    fmtPrecio(totalPrecio)],
                      ].map(([k,v])=>v?(
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:12, color:C.muted }}>{k}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:C.white }}>{v}</span>
                        </div>
                      ):null)}
                      <button onClick={()=>{
                        const txt=`Transferencia Broly Barber\nBanco: ${datosBancarios.banco}\nNombre: ${datosBancarios.nombre}\nRUT: ${datosBancarios.rut}\nCuenta: ${datosBancarios.cuenta}\nTipo: ${datosBancarios.tipo}\nMonto: ${fmtPrecio(totalPrecio)}`;
                        navigator.clipboard?.writeText(txt);
                      }} style={{ width:"100%", marginTop:8, padding:"8px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.mutedL, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                        📋 Copiar datos
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding:"10px 12px", borderRadius:9, background:`${C.warning}11`, border:`1px solid ${C.warning}33`, fontSize:12, color:C.warning }}>
                      ⚠ El barbero aún no ha configurado sus datos bancarios
                    </div>
                  )}
                </div>
              )}
            </div>

            <Btn onClick={confirmar} disabled={!form.nombre.trim()||!form.telefono.trim()||!metodoPago} style={{ width:"100%",padding:"15px",fontSize:16 }}>✅ Confirmar reserva</Btn>
            {!metodoPago && <div style={{ textAlign:"center", fontSize:12, color:C.muted, marginTop:8 }}>Selecciona un método de pago para continuar</div>}
          </div>
        </div>
      )}

      {/* PASO 5 — CONFIRMADO */}
      {paso===5&&(
        <div style={{ padding:"40px 20px",textAlign:"center" }}>
          <div style={{ fontSize:64,marginBottom:16 }}>✅</div>
          <h2 style={{ margin:"0 0 8px",color:C.gold,fontSize:24,fontWeight:900 }}>¡Hora reservada!</h2>
          <p style={{ color:C.mutedL,fontSize:14,marginBottom:24 }}>Te esperamos, {form.nombre.split(" ")[0]}</p>
          <div style={{ background:C.card,borderRadius:14,padding:20,border:`1px solid ${C.gold}44`,marginBottom:20,textAlign:"left" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}><span style={{ color:C.muted,fontSize:13 }}>Fecha</span><span style={{ color:C.white,fontWeight:700 }}>{fmtFecha(fechaSel)}</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}><span style={{ color:C.muted,fontSize:13 }}>Hora</span><span style={{ color:C.gold,fontWeight:700 }}>⏰ {horaSel}</span></div>
            <div style={{ height:1,background:C.border,margin:"8px 0" }}/>
            {serviciosSel.map(id=>{ const s=servicios.find(x=>x.id===id); return s?(<div key={id} style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}><span style={{ fontSize:13 }}>{s.emoji} {s.nombre}</span><span style={{ fontSize:13,color:C.mutedL }}>{fmtPrecio(s.precio)}</span></div>):null; })}
            <div style={{ height:1,background:C.border,margin:"8px 0" }}/>
            <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ fontWeight:800 }}>Total</span><span style={{ color:C.gold,fontWeight:900,fontSize:18 }}>{fmtPrecio(totalPrecio)}</span></div>
            <div style={{ fontSize:12,color:C.muted,marginTop:4 }}>⏱ {totalTiempo} min aprox.</div>
          </div>
          {/* Recordatorio WhatsApp */}
          <div style={{ background:`${C.success}18`,borderRadius:12,border:`1px solid ${C.success}44`,padding:"14px 16px",marginBottom:20,textAlign:"left" }}>
            <div style={{ fontSize:13,fontWeight:700,color:C.success,marginBottom:6 }}>📱 Guardar recordatorio</div>
            <div style={{ fontSize:12,color:C.mutedL,marginBottom:10 }}>Envíate el recordatorio por WhatsApp</div>
            <button onClick={()=>{
              const txt=`✂️ *Recordatorio Broly Barber*\n\n📅 ${fmtFecha(fechaSel)}\n⏰ ${horaSel}\n💈 ${serviciosSel.map(id=>servicios.find(s=>s.id===id)?.nombre).join(" + ")}\n💰 Total: ${fmtPrecio(totalPrecio)}\n\n¡Te esperamos!`;
              window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,"_blank");
            }} style={{ width:"100%",padding:"11px",background:"#25d366",border:"none",borderRadius:10,color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>
              Enviarme recordatorio por WhatsApp 📲
            </button>
          </div>
          {/* Premio fidelización */}
          {configPremio?.activo && (()=>{
            const telCliente = form.telefono.trim();
            const visitasCliente = citas.filter(c=>c.telefono===telCliente&&c.estado==="confirmada").length;
            const meta = configPremio.visitas;
            const progreso = visitasCliente % meta;
            const ganoHoy = progreso === 0 && visitasCliente > 0;
            return (
              <div style={{ background:`${C.gold}18`, borderRadius:12, border:`1px solid ${C.gold}44`, padding:"14px 16px", marginBottom:20, textAlign:"left" }}>
                {ganoHoy ? (
                  <>
                    <div style={{ fontSize:22, marginBottom:6 }}>🎉🎁🎉</div>
                    <div style={{ fontWeight:800, fontSize:16, color:C.gold, marginBottom:4 }}>¡Ganaste un premio!</div>
                    <div style={{ fontSize:13, color:C.mutedL }}>
                      {configPremio.sorpresa
                        ? "Completaste tus visitas. ¡Pregúntale al barbero cuál es tu sorpresa!"
                        : `Completaste ${meta} visitas. Tu premio: ${configPremio.premio}`}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:13, fontWeight:700, color:C.gold, marginBottom:8 }}>
                      ⭐ Visita {visitasCliente} de {meta} para tu premio
                      {!configPremio.sorpresa && ` — ${configPremio.premio}`}
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      {Array.from({length:meta},(_,i)=>(
                        <div key={i} style={{ flex:1, height:7, borderRadius:4, background:i<progreso?C.gold:C.border, transition:"background 0.3s" }}/>
                      ))}
                    </div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>
                      Te faltan {meta-progreso} visita{meta-progreso!==1?"s":""} para tu premio
                      {configPremio.sorpresa?" 🎁":""}
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          <Btn onClick={reset} style={{ width:"100%" }}>Reservar otra hora</Btn>
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD BARBERO ─────────────────────────────────────
function DashboardBarbero({ citas, setCitas, actualizarCita, servicios, setServicios, insumos, setInsumos, horasDisponibles, setHorasDisponibles, diasBloqueados, setDiasBloqueados, ubicaciones, setUbicaciones, datosBancarios, setDatosBancarios, configPremio, setConfigPremio, pinBarbero, setPinBarbero }) {
  const [tab, setTab] = useState("hoy");
  const [nuevoServ, setNuevoServ] = useState({ nombre:"", precio:"", duracion:"", emoji:"✂️" });
  const [editServId, setEditServId] = useState(null);
  const [nuevoInsumo, setNuevoInsumo] = useState({ nombre:"", costo:"", cantidad:"", unidad:"" });
  const [clienteBuscar, setClienteBuscar] = useState("");
  const [ordenClientes, setOrdenClientes] = useState("visitas"); // visitas | gasto | reciente
  const [fechaBloquear, setFechaBloquear] = useState("");
  const [mesVista, setMesVista] = useState(() => { const d=new Date(); return {m:d.getMonth(),a:d.getFullYear()}; });
  const [citaDetalle, setCitaDetalle] = useState(null);
  const [ubicForm, setUbicForm] = useState({ ciudad:"", desde:"", hasta:"" });
  const [pinForm, setPinForm] = useState({ actual:"", nuevo:"", confirmar:"" });
  const [pinMsg, setPinMsg] = useState(null);

  const hoy = isoHoy();
  const mesActual = new Date().toISOString().slice(0,7);
  const semIni = new Date(); semIni.setDate(semIni.getDate()-semIni.getDay());
  const semFin = new Date(semIni); semFin.setDate(semIni.getDate()+6);

  const citasHoy      = citas.filter(c=>c.fecha===hoy).sort((a,b)=>a.hora.localeCompare(b.hora));
  const citasPend     = citas.filter(c=>c.fecha>=hoy&&c.estado==="pendiente").sort((a,b)=>a.fecha.localeCompare(b.fecha)||a.hora.localeCompare(b.hora));
  const citasMes      = citas.filter(c=>c.fecha.startsWith(mesActual)&&c.estado==="confirmada");
  const cancelasMes   = citas.filter(c=>c.fecha.startsWith(mesActual)&&c.estado==="cancelada");
  const ingresoHoy    = citasHoy.filter(c=>c.estado==="confirmada").reduce((s,c)=>s+c.precio,0);
  const ingresoMes    = citasMes.reduce((s,c)=>s+c.precio,0);
  const costoInsumos  = insumos.reduce((s,i)=>s+i.costo*i.cantidad,0);
  const gananciaNeta  = Math.max(0,ingresoMes-costoInsumos);

  // Ticket promedio
  const ticketProm = citasMes.length>0 ? Math.round(ingresoMes/citasMes.length) : 0;

  // Ingreso semana
  const ingresoSemana = citas.filter(c=>{
    const f=new Date(c.fecha+"T00:00");
    return f>=semIni&&f<=semFin&&c.estado==="confirmada";
  }).reduce((s,c)=>s+c.precio,0);

  // Servicio más popular
  const conteoServ = {};
  citas.filter(c=>c.estado!=="cancelada").forEach(c=>{ (c.servicios||[]).forEach(id=>{ conteoServ[id]=(conteoServ[id]||0)+1; }); });
  const topServId = Object.entries(conteoServ).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const topServ = servicios.find(s=>s.id===topServId);

  // Historial de clientes únicos
  const clientesMap = {};
  citas.filter(c=>c.estado==="confirmada").forEach(c=>{
    if(!clientesMap[c.telefono]) clientesMap[c.telefono]={ nombre:c.nombre, telefono:c.telefono, visitas:[], totalGastado:0 };
    clientesMap[c.telefono].visitas.push(c);
    clientesMap[c.telefono].totalGastado+=c.precio;
  });
  const clientes = Object.values(clientesMap).sort((a,b)=>{
    if(ordenClientes==="visitas") return b.visitas.length-a.visitas.length;
    if(ordenClientes==="gasto")   return b.totalGastado-a.totalGastado;
    if(ordenClientes==="reciente"){
      const fa=a.visitas.sort((x,y)=>y.fecha.localeCompare(x.fecha))[0]?.fecha||"";
      const fb=b.visitas.sort((x,y)=>y.fecha.localeCompare(x.fecha))[0]?.fecha||"";
      return fb.localeCompare(fa);
    }
    return 0;
  });
  const clientesFiltrados = clientes.filter(c=>c.nombre.toLowerCase().includes(clienteBuscar.toLowerCase())||c.telefono.includes(clienteBuscar));

  const cambiarEstado = (id,estado,pago=null) => {
    const cambios = { estado, ...(pago ? {metodoPago:pago} : {}) };
    actualizarCita(id, cambios);
  };

  const guardarServicio = () => {
    if(!nuevoServ.nombre||!nuevoServ.precio) return;
    if(editServId) {
      setServicios(p=>p.map(s=>s.id===editServId?{...s,...nuevoServ,precio:parseInt(nuevoServ.precio),duracion:parseInt(nuevoServ.duracion)||30}:s));
      setEditServId(null);
    } else {
      setServicios(p=>[...p,{...nuevoServ,id:`s-${Date.now()}`,precio:parseInt(nuevoServ.precio),duracion:parseInt(nuevoServ.duracion)||30}]);
    }
    setNuevoServ({nombre:"",precio:"",duracion:"",emoji:"✂️"});
  };

  const statusColor = e => e==="confirmada"?C.success:e==="cancelada"?C.danger:C.warning;

  // Enviar recordatorio WhatsApp
  const enviarRecordatorio = (c) => {
    const txt=`✂️ *Recordatorio Broly Barber*\n\nHola ${c.nombre.split(" ")[0]}! 👋\n\nTe recordamos tu cita:\n📅 ${fmtFecha(c.fecha)}\n⏰ ${c.hora}\n💈 ${c.servicioNombre}\n💰 ${fmtPrecio(c.precio)}\n\n¡Te esperamos! Si necesitas cancelar avísanos con anticipación.`;
    window.open(`https://wa.me/${c.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(txt)}`,"_blank");
  };

  const CardCita = ({ c, mostrarFecha=false }) => (
    <div style={{ background:C.card,borderRadius:12,border:`1px solid ${statusColor(c.estado)}33`,overflow:"hidden",marginBottom:10 }}>
      <div style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
              <span style={{ fontSize:18 }}>{c.servicioEmoji}</span>
              <span style={{ fontWeight:800,fontSize:15,color:C.white }}>{c.nombre}</span>
            </div>
            {mostrarFecha&&<div style={{ fontSize:12,color:C.muted,marginBottom:2 }}>{fmtFecha(c.fecha)}</div>}
            <div style={{ fontSize:13,color:C.muted }}>
              <span style={{ color:C.gold,fontWeight:700 }}>⏰ {c.hora}</span> · {c.servicioNombre}
            </div>
            {c.telefono&&<div style={{ fontSize:12,color:C.muted,marginTop:2 }}>📱 {c.telefono}</div>}
            {c.nota&&<div style={{ fontSize:12,color:C.muted,fontStyle:"italic",marginTop:2 }}>"{c.nota}"</div>}
            {c.metodoPago&&c.metodoPago!=="por_definir"&&(
              <div style={{ marginTop:4, display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                <Badge color={C.success}>{c.metodoPago==="efectivo"?"💵":c.metodoPago==="debito"?"💳":"📲"} {c.metodoPago}</Badge>
                {c.metodoPago==="efectivo"&&c.pagoCon&&(
                  <Badge color={C.warning}>Paga con {fmtPrecio(c.pagoCon)} · Vuelto: {fmtPrecio(c.pagoCon-c.precio)}</Badge>
                )}
                {c.metodoPago==="debito"&&<Badge color={C.gold}>Ten lista la máquina</Badge>}
                {c.metodoPago==="transferencia"&&<Badge color={C.accentLight||C.gold}>Pago por transferencia</Badge>}
              </div>
            )}
            {c.metodoPago==="por_definir"&&<Badge color={C.muted}>Pago no especificado</Badge>}
          </div>
          <div style={{ textAlign:"right",flexShrink:0,marginLeft:10 }}>
            <div style={{ color:C.gold,fontWeight:900,fontSize:16 }}>{fmtPrecio(c.precio)}</div>
            <Badge color={statusColor(c.estado)}>{c.estado}</Badge>
            <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>⏱{c.duracion}min</div>
          </div>
        </div>
        {/* Acciones */}
        {c.estado==="pendiente"&&(
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:4 }}>
            <div style={{ display:"flex",gap:6,marginBottom:6 }}>
              <Btn onClick={()=>cambiarEstado(c.id,"confirmada")} variant="success" small style={{ flex:1 }}>✓ Confirmar</Btn>
              <Btn onClick={()=>cambiarEstado(c.id,"cancelada")} variant="danger" small style={{ flex:1 }}>✕ Cancelar</Btn>
            </div>
            <div style={{ display:"flex",gap:6 }}>
              <button onClick={()=>enviarRecordatorio(c)}
                style={{ flex:1,padding:"7px",background:"#25d36622",border:"1px solid #25d36644",borderRadius:7,color:"#25d366",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>
                📲 Recordatorio WA
              </button>
            </div>
          </div>
        )}
        {c.estado==="confirmada"&&!c.metodoPago&&(
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:8,marginTop:4 }}>
            <div style={{ fontSize:11,color:C.muted,marginBottom:6 }}>Registrar método de pago:</div>
            <div style={{ display:"flex",gap:6 }}>
              {[["efectivo","💵"],["debito","💳"],["transferencia","📲"]].map(([m,i])=>(
                <button key={m} onClick={()=>cambiarEstado(c.id,"confirmada",m)}
                  style={{ flex:1,padding:"7px 4px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.mutedL,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>
                  {i} {m.charAt(0).toUpperCase()+m.slice(1,4)}
                </button>
              ))}
            </div>
            <button onClick={()=>enviarRecordatorio(c)}
              style={{ width:"100%",marginTop:6,padding:"7px",background:"#25d36622",border:"1px solid #25d36644",borderRadius:7,color:"#25d366",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>
              📲 Enviar recordatorio WA
            </button>
          </div>
        )}
        {c.estado==="confirmada"&&c.metodoPago&&(
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:8,marginTop:4,display:"flex",gap:6 }}>
            <Btn onClick={()=>cambiarEstado(c.id,"cancelada")} variant="danger" small>Cancelar cita</Btn>
            <button onClick={()=>enviarRecordatorio(c)}
              style={{ flex:1,padding:"7px",background:"#25d36622",border:"1px solid #25d36644",borderRadius:7,color:"#25d366",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>
              📲 WA Recordatorio
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const TABS = [
    {id:"hoy",       icon:"📅", label:"Hoy"},
    {id:"citas",     icon:"🗓", label:"Citas"},
    {id:"dashboard", icon:"📊", label:"Stats"},
    {id:"clientes",  icon:"👥", label:"Clientes"},
    {id:"servicios", icon:"✂️", label:"Servicios"},
    {id:"insumos",   icon:"🧴", label:"Insumos"},
    {id:"config",    icon:"⚙️", label:"Config"},
  ];

  return (
    <div style={{ minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif",maxWidth:480,margin:"0 auto",paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div style={{ fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:2 }}>Panel Barbero</div>
          <div style={{ fontSize:18,fontWeight:900,color:C.gold }}>✂️ Broly Barber</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20,fontWeight:900,color:C.success }}>{fmtPrecio(ingresoHoy)}</div>
          <div style={{ fontSize:10,color:C.muted }}>ingreso hoy</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",background:C.panel,borderBottom:`1px solid ${C.border}`,overflowX:"auto",scrollbarWidth:"none" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ flex:"0 0 auto",padding:"11px 12px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",
              borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`,
              color:tab===t.id?C.gold:C.muted,fontWeight:tab===t.id?700:400,fontSize:11,
              display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
            <span style={{ fontSize:16 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:14 }}>

        {/* ── HOY ── */}
        {tab==="hoy"&&(
          <>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16 }}>
              {[
                {label:"Cortes hoy",   val:citasHoy.filter(c=>c.estado==="confirmada").length, color:C.gold},
                {label:"Pendientes",   val:citasPend.filter(c=>c.fecha===hoy).length,           color:C.warning},
                {label:"Ingreso hoy",  val:fmtPrecio(ingresoHoy),                              color:C.success},
                {label:"Ingreso semana",val:fmtPrecio(ingresoSemana),                          color:C.goldL},
              ].map(s=>(
                <Panel key={s.label} style={{ padding:"12px 14px" }}>
                  <div style={{ fontSize:20,fontWeight:900,color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{s.label}</div>
                </Panel>
              ))}
            </div>
            <SecTitle>Agenda de hoy — {fmtFecha(hoy)}</SecTitle>
            {citasHoy.length===0
              ? <div style={{ textAlign:"center",color:C.muted,padding:"30px 0",fontSize:14 }}>Sin citas para hoy ✂️</div>
              : citasHoy.map(c=><CardCita key={c.id} c={c}/>)
            }
          </>
        )}

        {/* ── CITAS ── */}
        {tab==="citas"&&(
          <>
            <SecTitle>Próximas citas ({citasPend.length} pendientes)</SecTitle>
            {citasPend.length===0
              ? <div style={{ textAlign:"center",color:C.muted,padding:"30px 0",fontSize:14 }}>Sin citas pendientes</div>
              : citasPend.map(c=><CardCita key={c.id} c={c} mostrarFecha/>)
            }
          </>
        )}

        {/* ── DASHBOARD / STATS ── */}
        {tab==="dashboard"&&(
          <>
            {/* KPIs */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
              {[
                {label:"Ingreso del mes",   val:fmtPrecio(ingresoMes),   color:C.success},
                {label:"Ganancia neta",     val:fmtPrecio(gananciaNeta), color:C.goldL},
                {label:"Ticket promedio",   val:fmtPrecio(ticketProm),   color:C.gold},
                {label:"Cancelaciones mes", val:cancelasMes.length,      color:C.danger},
              ].map(s=>(
                <Panel key={s.label} style={{ padding:"12px 14px" }}>
                  <div style={{ fontSize:18,fontWeight:900,color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{s.label}</div>
                </Panel>
              ))}
            </div>

            {/* Servicio estrella */}
            {topServ&&(
              <Panel style={{ marginBottom:12,border:`1px solid ${C.gold}44` }}>
                <SecTitle>⭐ Servicio más popular</SecTitle>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <span style={{ fontSize:28 }}>{topServ.emoji}</span>
                    <div>
                      <div style={{ fontWeight:800,fontSize:15,color:C.gold }}>{topServ.nombre}</div>
                      <div style={{ fontSize:12,color:C.muted }}>{conteoServ[topServId]} veces pedido</div>
                    </div>
                  </div>
                  <div style={{ fontWeight:900,color:C.gold,fontSize:18 }}>{fmtPrecio(topServ.precio)}</div>
                </div>
              </Panel>
            )}

            {/* Métodos de pago */}
            <Panel style={{ marginBottom:12 }}>
              <SecTitle>💳 Ingresos por método de pago (mes)</SecTitle>
              {[["efectivo","💵 Efectivo"],["debito","💳 Débito"],["transferencia","📲 Transferencia"]].map(([k,l])=>{
                const val=citasMes.filter(c=>c.metodoPago===k).reduce((s,c)=>s+c.precio,0);
                const pct=ingresoMes>0?Math.round(val/ingresoMes*100):0;
                return (
                  <div key={k} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                      <span style={{ fontSize:13 }}>{l}</span>
                      <div style={{ display:"flex",gap:8 }}>
                        <span style={{ color:C.success,fontWeight:700,fontSize:13 }}>{fmtPrecio(val)}</span>
                        <span style={{ color:C.muted,fontSize:12 }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ background:C.border,borderRadius:99,height:6,overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`,height:"100%",background:k==="efectivo"?C.success:k==="debito"?C.gold:C.warning,borderRadius:99 }}/>
                    </div>
                  </div>
                );
              })}
            </Panel>

            {/* Servicios más pedidos */}
            <Panel style={{ marginBottom:12 }}>
              <SecTitle>✂️ Servicios más pedidos</SecTitle>
              {servicios.map(s=>{
                const cnt=conteoServ[s.id]||0;
                const ing=citas.filter(c=>(c.servicios||[]).includes(s.id)&&c.estado==="confirmada").reduce((sum,c)=>sum+s.precio,0);
                const max=Math.max(...servicios.map(sv=>conteoServ[sv.id]||0),1);
                return (
                  <div key={s.id} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                      <span style={{ fontSize:13 }}>{s.emoji} {s.nombre}</span>
                      <div style={{ display:"flex",gap:8 }}>
                        <span style={{ color:C.success,fontSize:12 }}>{fmtPrecio(ing)}</span>
                        <span style={{ color:C.gold,fontWeight:700,fontSize:13 }}>{cnt}×</span>
                      </div>
                    </div>
                    <div style={{ background:C.border,borderRadius:99,height:6,overflow:"hidden" }}>
                      <div style={{ width:`${cnt/max*100}%`,height:"100%",background:`linear-gradient(90deg,${C.goldD},${C.gold})`,borderRadius:99 }}/>
                    </div>
                  </div>
                );
              })}
            </Panel>

            {/* Resumen financiero */}
            <Panel>
              <SecTitle>💰 Resumen financiero del mes</SecTitle>
              {[
                ["Ingresos brutos",   fmtPrecio(ingresoMes),  C.success],
                ["Costo insumos",     fmtPrecio(costoInsumos),C.danger],
                ["Ganancia neta",     fmtPrecio(gananciaNeta),C.goldL],
                ["Clientes atendidos",citasMes.length+" citas",C.white],
                ["Ticket promedio",   fmtPrecio(ticketProm),  C.gold],
              ].map(([k,v,col])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ color:C.muted,fontSize:13 }}>{k}</span>
                  <span style={{ color:col,fontWeight:700,fontSize:14 }}>{v}</span>
                </div>
              ))}

              {/* Desglose por método de pago */}
              <div style={{ height:1,background:C.border,margin:"4px 0 12px" }}/>
              <div style={{ fontSize:12,color:C.muted,marginBottom:10 }}>Desglose por método de pago</div>
              {[["efectivo","💵","Efectivo"],["debito","💳","Débito"],["transferencia","📲","Transferencia"]].map(([k,ico,lab])=>{
                const monto=citasMes.filter(c=>c.metodoPago===k&&c.cobrado!==false).reduce((s,c)=>s+c.precio,0);
                const count=citasMes.filter(c=>c.metodoPago===k&&c.cobrado!==false).length;
                return monto>0?(
                  <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                    <span style={{ fontSize:13 }}>{ico} {lab} <span style={{ color:C.muted }}>({count})</span></span>
                    <span style={{ fontWeight:700,color:C.success,fontSize:13 }}>{fmtPrecio(monto)}</span>
                  </div>
                ):null;
              })}
            </Panel>

            {/* ── CONFIRMACIÓN DE COBRO ── */}
            {(()=>{
              const pendEfectivo = citas.filter(c=>c.metodoPago==="efectivo"&&c.estado==="confirmada"&&c.cobrado===undefined);
              const pendTransf   = citas.filter(c=>c.metodoPago==="transferencia"&&c.estado==="confirmada"&&c.cobrado===undefined);
              const pendientes   = [...pendEfectivo, ...pendTransf];
              if(pendientes.length===0) return null;
              return (
                <Panel style={{ border:`1px solid ${C.warning}55`, marginTop:0 }}>
                  <SecTitle>⚠️ Cobros por confirmar</SecTitle>
                  <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                    {pendientes.map(c=>(
                      <div key={c.id} style={{ background:C.bg,borderRadius:10,padding:"12px 13px",border:`1px solid ${C.warning}33` }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                          <div>
                            <div style={{ fontWeight:700,fontSize:14 }}>{c.nombre}</div>
                            <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>
                              {c.metodoPago==="efectivo"?"💵 Efectivo":"📲 Transferencia"} · {fmtFecha(c.fecha)} {c.hora}
                            </div>
                            <div style={{ fontSize:13,fontWeight:700,color:C.gold,marginTop:4 }}>{fmtPrecio(c.precio)}</div>
                          </div>
                        </div>
                        <div style={{ fontSize:12,color:C.warning,marginBottom:8,fontStyle:"italic" }}>
                          {c.metodoPago==="transferencia"
                            ? `¿Recibiste la transferencia de ${c.nombre.split(" ")[0]}?`
                            : `¿Confirmaste el pago en efectivo de ${c.nombre.split(" ")[0]}?`}
                        </div>
                        <div style={{ display:"flex",gap:7 }}>
                          <button onClick={()=>setCitas(p=>p.map(x=>x.id===c.id?{...x,cobrado:true}:x))}
                            style={{ flex:1,padding:"9px",background:`${C.success}22`,border:`1px solid ${C.success}55`,borderRadius:8,color:C.success,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
                            ✅ Sí, recibí el pago
                          </button>
                          <button onClick={()=>setCitas(p=>p.map(x=>x.id===c.id?{...x,cobrado:false}:x))}
                            style={{ flex:1,padding:"9px",background:`${C.danger}18`,border:`1px solid ${C.danger}44`,borderRadius:8,color:C.danger,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
                            ❌ No lo recibí
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              );
            })()}
          </>
        )}

        {/* ── CLIENTES ── */}
        {tab==="clientes"&&(
          <>
            <Field value={clienteBuscar} onChange={e=>setClienteBuscar(e.target.value)} placeholder="🔍 Buscar cliente..." style={{ marginBottom:10 }}/>
            {/* Filtros de orden */}
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>
              {[
                ["visitas",  "🏆 Más visitas"],
                ["gasto",    "💰 Más gasto"],
                ["reciente", "🕐 Más reciente"],
              ].map(([val,label])=>(
                <button key={val} onClick={()=>setOrdenClientes(val)}
                  style={{ flex:1, padding:"8px 4px", borderRadius:9, border:`2px solid ${ordenClientes===val?C.gold:C.border}`,
                    background:ordenClientes===val?`${C.gold}18`:C.card,
                    color:ordenClientes===val?C.gold:C.muted,
                    fontWeight:ordenClientes===val?700:400, fontSize:11,
                    cursor:"pointer", fontFamily:"inherit" }}>
                  {label}
                </button>
              ))}
            </div>
            <SecTitle>{clientesFiltrados.length} cliente{clientesFiltrados.length!==1?"s":""} · ordenado por {ordenClientes==="visitas"?"más visitas":ordenClientes==="gasto"?"mayor gasto":"más reciente"}</SecTitle>
            {clientesFiltrados.length===0
              ? <div style={{ textAlign:"center",color:C.muted,padding:"30px 0" }}>Sin clientes aún</div>
              : clientesFiltrados.map((cl, idx)=>{
                  const ultima=cl.visitas.sort((a,b)=>b.fecha.localeCompare(a.fecha))[0];
                  const fidelidad=cl.visitas.length>=10?"🏆":cl.visitas.length>=5?"⭐":"🔵";
                  const medallaColor = idx===0?"#FFD700":idx===1?"#C0C0C0":idx===2?"#CD7F32":C.border;
                  const rankLabel = idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":`#${idx+1}`;
                  return (
                    <Panel key={cl.telefono} style={{ marginBottom:10, border:`2px solid ${idx<3?medallaColor+"88":cl.visitas.length>=5?C.gold+"44":C.border}` }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                        <div style={{ display:"flex",alignItems:"flex-start",gap:10 }}>
                          {/* Posición */}
                          <div style={{ width:32,height:32,borderRadius:"50%",background:idx<3?medallaColor+"33":C.border+"44",border:`2px solid ${idx<3?medallaColor:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:idx<3?16:12,fontWeight:900,color:idx<3?medallaColor:C.muted,flexShrink:0 }}>
                            {rankLabel}
                          </div>
                          <div>
                            <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
                              <span style={{ fontSize:16 }}>{fidelidad}</span>
                              <span style={{ fontWeight:800,fontSize:15,color:idx<3?medallaColor:cl.visitas.length>=5?C.gold:C.white }}>{cl.nombre}</span>
                            </div>
                            <div style={{ fontSize:12,color:C.muted }}>📱 {cl.telefono}</div>
                            <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Última visita: {fmtFecha(ultima?.fecha||"")}</div>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:18,fontWeight:900,color:C.gold }}>{cl.visitas.length}</div>
                          <div style={{ fontSize:10,color:C.muted }}>visitas</div>
                          <div style={{ fontSize:13,fontWeight:700,color:C.success,marginTop:4 }}>{fmtPrecio(cl.totalGastado)}</div>
                          <div style={{ fontSize:10,color:C.muted }}>total</div>
                        </div>
                      </div>
                      {/* Servicios que prefiere */}
                      <div style={{ fontSize:11,color:C.muted,marginBottom:6 }}>Servicios frecuentes:</div>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>
                        {(() => {
                          const cnt={};
                          cl.visitas.forEach(v=>(v.servicios||[]).forEach(id=>{ cnt[id]=(cnt[id]||0)+1; }));
                          return Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id,n])=>{
                            const s=servicios.find(x=>x.id===id);
                            return s?<Badge key={id} color={C.gold}>{s.emoji} {s.nombre} ×{n}</Badge>:null;
                          });
                        })()}
                      </div>
                      {/* Fidelización */}
                      <div style={{ background:C.bg,borderRadius:8,padding:"8px 10px",marginBottom:8 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                          <span style={{ fontSize:11,color:C.muted }}>Fidelización (cada 10 cortes = 1 gratis)</span>
                          <span style={{ fontSize:11,fontWeight:700,color:C.gold }}>{cl.visitas.length%configPremio.visitas}/{configPremio.visitas}</span>
                        </div>
                        <div style={{ display:"flex",gap:3 }}>
                          {Array.from({length:configPremio.visitas},(_,i)=>(
                            <div key={i} style={{ flex:1,height:6,borderRadius:3,background:i<cl.visitas.length%configPremio.visitas?C.gold:C.border }}/>
                          ))}
                        </div>
                        {cl.visitas.length%configPremio.visitas===0&&cl.visitas.length>0&&(
                          <div style={{ fontSize:11,color:C.gold,marginTop:4,fontWeight:700 }}>🎉 ¡Le corresponde un corte gratis!</div>
                        )}
                      </div>
                      {/* WhatsApp */}
                      <button onClick={()=>{
                        const txt=`Hola ${cl.nombre.split(" ")[0]}! 👋 Aquí Broly Barber. ¿Cuándo te vemos? Reserva tu hora en nuestro link. ✂️`;
                        window.open(`https://wa.me/${cl.telefono.replace(/\D/g,"")}?text=${encodeURIComponent(txt)}`,"_blank");
                      }} style={{ width:"100%",padding:"8px",background:"#25d36622",border:"1px solid #25d36644",borderRadius:8,color:"#25d366",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>
                        📲 Enviar WhatsApp
                      </button>
                    </Panel>
                  );
                })
            }
          </>
        )}

        {/* ── SERVICIOS ── */}
        {tab==="servicios"&&(
          <>
            <Panel style={{ marginBottom:12 }}>
              <SecTitle>{editServId?"✏️ Editar servicio":"+ Nuevo servicio"}</SecTitle>
              <div style={{ display:"flex",gap:8,marginBottom:8 }}>
                <Field value={nuevoServ.emoji} onChange={e=>setNuevoServ(p=>({...p,emoji:e.target.value}))} placeholder="✂️" style={{ width:54,textAlign:"center",fontSize:22,padding:"10px 6px",flexShrink:0 }}/>
                <Field value={nuevoServ.nombre} onChange={e=>setNuevoServ(p=>({...p,nombre:e.target.value}))} placeholder="Nombre del servicio" style={{ flex:1 }}/>
              </div>
              <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                <div style={{ position:"relative",flex:1 }}>
                  <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13 }}>$</span>
                  <input value={nuevoServ.precio} onChange={e=>setNuevoServ(p=>({...p,precio:e.target.value}))} placeholder="Precio" type="number"
                    style={{ width:"100%",boxSizing:"border-box",background:"#0f0f0f",border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 10px 11px 24px",color:C.white,fontSize:14,outline:"none",fontFamily:"inherit" }}/>
                </div>
                <Field value={nuevoServ.duracion} onChange={e=>setNuevoServ(p=>({...p,duracion:e.target.value}))} placeholder="Min" type="number" style={{ flex:1 }}/>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <Btn onClick={guardarServicio} disabled={!nuevoServ.nombre||!nuevoServ.precio} style={{ flex:1 }}>{editServId?"Guardar":"+ Agregar"}</Btn>
                {editServId&&<Btn onClick={()=>{setEditServId(null);setNuevoServ({nombre:"",precio:"",duracion:"",emoji:"✂️"});}} variant="ghost">Cancelar</Btn>}
              </div>
            </Panel>
            {servicios.map(s=>(
              <div key={s.id} style={{ background:C.card,borderRadius:12,padding:"13px 14px",border:`1px solid ${C.border}`,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:24 }}>{s.emoji}</span>
                  <div>
                    <div style={{ fontWeight:700,fontSize:14 }}>{s.nombre}</div>
                    <div style={{ fontSize:12,color:C.muted }}>⏱ {s.duracion} min</div>
                  </div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ color:C.gold,fontWeight:900,fontSize:16 }}>{fmtPrecio(s.precio)}</span>
                  <button onClick={()=>{setEditServId(s.id);setNuevoServ({nombre:s.nombre,precio:String(s.precio),duracion:String(s.duracion),emoji:s.emoji});}}
                    style={{ background:C.border,border:"none",borderRadius:7,padding:"5px 9px",color:C.mutedL,cursor:"pointer",fontSize:13 }}>✏️</button>
                  <button onClick={()=>setServicios(p=>p.filter(x=>x.id!==s.id))}
                    style={{ background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:18,padding:0 }}>×</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── INSUMOS ── */}
        {tab==="insumos"&&(
          <>
            <Panel style={{ marginBottom:12 }}>
              <SecTitle>+ Agregar insumo</SecTitle>
              <Field value={nuevoInsumo.nombre} onChange={e=>setNuevoInsumo(p=>({...p,nombre:e.target.value}))} placeholder="Nombre del insumo" style={{ marginBottom:8 }}/>
              <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                <div style={{ position:"relative",flex:2 }}>
                  <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13 }}>$</span>
                  <input value={nuevoInsumo.costo} onChange={e=>setNuevoInsumo(p=>({...p,costo:e.target.value}))} placeholder="Costo" type="number"
                    style={{ width:"100%",boxSizing:"border-box",background:"#0f0f0f",border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 10px 11px 24px",color:C.white,fontSize:14,outline:"none",fontFamily:"inherit" }}/>
                </div>
                <Field value={nuevoInsumo.cantidad} onChange={e=>setNuevoInsumo(p=>({...p,cantidad:e.target.value}))} placeholder="Cant." type="number" style={{ flex:1 }}/>
                <Field value={nuevoInsumo.unidad} onChange={e=>setNuevoInsumo(p=>({...p,unidad:e.target.value}))} placeholder="Unidad" style={{ flex:1 }}/>
              </div>
              <Btn onClick={()=>{
                if(!nuevoInsumo.nombre||!nuevoInsumo.costo) return;
                setInsumos(p=>[...p,{...nuevoInsumo,id:`i-${Date.now()}`,costo:parseInt(nuevoInsumo.costo),cantidad:parseInt(nuevoInsumo.cantidad)||1}]);
                setNuevoInsumo({nombre:"",costo:"",cantidad:"",unidad:""});
              }} disabled={!nuevoInsumo.nombre||!nuevoInsumo.costo} style={{ width:"100%" }}>+ Agregar</Btn>
            </Panel>
            <div style={{ background:`${C.gold}18`,borderRadius:10,padding:"10px 14px",border:`1px solid ${C.gold}44`,marginBottom:12,display:"flex",justifyContent:"space-between" }}>
              <span style={{ color:C.gold,fontWeight:700 }}>Costo total insumos</span>
              <span style={{ color:C.gold,fontWeight:900,fontSize:16 }}>{fmtPrecio(costoInsumos)}</span>
            </div>
            {insumos.map(i=>(
              <div key={i.id} style={{ background:C.card,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.border}`,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:14 }}>🧴 {i.nombre}</div>
                  <div style={{ fontSize:12,color:C.muted }}>{i.cantidad} {i.unidad} · {fmtPrecio(i.costo)} c/u</div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ color:C.danger,fontWeight:700 }}>{fmtPrecio(i.costo*i.cantidad)}</span>
                  <button onClick={()=>setInsumos(p=>p.filter(x=>x.id!==i.id))} style={{ background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:18,padding:0 }}>×</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── CONFIG ── */}
        {tab==="config"&&(
          <>
            {/* Horario */}
            <Panel style={{ marginBottom:12 }}>
              {/* Datos bancarios */}
              <Panel style={{ marginBottom:12 }}>
                <SecTitle>📲 Datos para transferencia</SecTitle>
                <p style={{ margin:"0 0 12px", fontSize:12, color:C.muted }}>El cliente los verá al elegir pago por transferencia.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
                  {[
                    ["banco",    "Banco (ej: BancoEstado, Santander...)"],
                    ["nombre",   "Nombre del titular"],
                    ["rut",      "RUT (ej: 12.345.678-9)"],
                    ["cuenta",   "N° de cuenta"],
                    ["tipo",     "Tipo de cuenta (Corriente, Vista, RUT...)"],
                  ].map(([k,ph])=>(
                    <Field key={k} value={datosBancarios[k]||""} onChange={e=>setDatosBancarios(p=>({...p,[k]:e.target.value}))} placeholder={ph}/>
                  ))}
                </div>
                <Btn onClick={()=>{ save("bb_banco", datosBancarios); }} style={{ width:"100%", marginBottom:8 }}>
                  💾 Guardar datos bancarios
                </Btn>
                {datosBancarios.banco && (
                  <div style={{ padding:"10px 12px", background:`${C.success}18`, borderRadius:9, border:`1px solid ${C.success}33`, fontSize:12, color:C.success }}>
                    ✅ Datos configurados — los clientes los verán al pagar por transferencia
                  </div>
                )}
              </Panel>

              {/* Premio fidelización configurable */}
              <Panel style={{ marginBottom:12 }}>
                <SecTitle>🎁 Sistema de premios</SecTitle>
                <p style={{ margin:"0 0 12px", fontSize:12, color:C.muted }}>Configura cuántas visitas se necesitan para ganar un premio y qué se gana.</p>

                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:13, color:C.white, flexShrink:0 }}>Premio cada</span>
                  <div style={{ display:"flex", gap:6 }}>
                    {[5,6,7,8,10].map(n=>(
                      <button key={n} onClick={()=>setConfigPremio(p=>({...p,visitas:n}))}
                        style={{ width:36, height:36, borderRadius:9, border:`2px solid ${configPremio.visitas===n?C.gold:C.border}`, background:configPremio.visitas===n?`${C.gold}22`:C.bg, color:configPremio.visitas===n?C.gold:C.muted, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize:13, color:C.white }}>visitas</span>
                </div>

                {/* Sorpresa o anunciado */}
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <button onClick={()=>setConfigPremio(p=>({...p,sorpresa:false}))}
                    style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${!configPremio.sorpresa?C.gold:C.border}`, background:!configPremio.sorpresa?`${C.gold}22`:C.bg, color:!configPremio.sorpresa?C.gold:C.muted, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    🎯 Premio anunciado
                  </button>
                  <button onClick={()=>setConfigPremio(p=>({...p,sorpresa:true}))}
                    style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${configPremio.sorpresa?C.gold:C.border}`, background:configPremio.sorpresa?`${C.gold}22`:C.bg, color:configPremio.sorpresa?C.gold:C.muted, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    🎁 Sorpresa
                  </button>
                </div>

                {/* Descripción del premio si no es sorpresa */}
                {!configPremio.sorpresa && (
                  <Field
                    value={configPremio.premio}
                    onChange={e=>setConfigPremio(p=>({...p,premio:e.target.value}))}
                    placeholder="¿Qué gana? (ej: Corte gratis, 50% descuento...)"
                    style={{ marginBottom:12 }}
                  />
                )}

                {/* Activar/desactivar */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 13px", background:C.bg, borderRadius:9, border:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13, color:C.mutedL }}>Sistema de premios activo</span>
                  <button onClick={()=>setConfigPremio(p=>({...p,activo:!p.activo}))}
                    style={{ padding:"6px 14px", borderRadius:8, border:"none", background:configPremio.activo?C.success:C.border, color:configPremio.activo?"#000":C.muted, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                    {configPremio.activo?"Activo":"Inactivo"}
                  </button>
                </div>

                <div style={{ marginTop:10, padding:"10px 12px", background:`${C.gold}11`, borderRadius:9, border:`1px solid ${C.gold}33`, fontSize:12, color:C.gold }}>
                  {configPremio.activo
                    ? `⭐ Cada ${configPremio.visitas} visitas → ${configPremio.sorpresa?"🎁 Sorpresa":configPremio.premio}`
                    : "Sistema de premios desactivado"}
                </div>
              </Panel>

              {/* ── HORARIO SEMANAL POR DÍA ── */}
              <Panel style={{ marginBottom:12 }}>
                <SecTitle>🕐 Horario semanal</SecTitle>
                <p style={{ margin:"0 0 14px", fontSize:12, color:C.muted }}>
                  Configura qué horas atiendes cada día. Solo esas horas aparecerán para los clientes.
                </p>

                {/* Semana actual — 7 días desde hoy */}
                {(()=>{
                  const dias = [];
                  const hoy = new Date(); hoy.setHours(0,0,0,0);
                  // Ir al lunes de esta semana
                  const lunes = new Date(hoy);
                  const diaSemana = hoy.getDay();
                  const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
                  lunes.setDate(hoy.getDate() + diffLunes);
                  for(let i=0;i<7;i++){
                    const d = new Date(lunes);
                    d.setDate(lunes.getDate()+i);
                    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                    dias.push({ iso, label:`${DIAS_SEMANA[d.getDay()]} ${d.getDate()}` });
                  }

                  const TODAS_HORAS = [
                    "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
                    "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
                    "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00"
                  ];

                  return dias.map(({ iso, label }) => {
                    const horasDelDia = horasDisponibles[iso] || [];
                    const esPasado = iso < isoHoy();
                    return (
                      <div key={iso} style={{ marginBottom:14, opacity:esPasado?0.5:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                          <span style={{ fontWeight:700, fontSize:14, color:iso===isoHoy()?C.gold:C.white }}>
                            {iso===isoHoy()?"⭐ ":""}{label}
                          </span>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={()=>setHorasDisponibles(p=>({...p,[iso]:TODAS_HORAS}))}
                              style={{ fontSize:11, color:C.gold, background:"none", border:`1px solid ${C.gold}44`, borderRadius:6, padding:"3px 8px", cursor:"pointer", fontFamily:"inherit" }}>
                              Todo
                            </button>
                            <button onClick={()=>setHorasDisponibles(p=>({...p,[iso]:[]}))}
                              style={{ fontSize:11, color:C.muted, background:"none", border:`1px solid ${C.border}`, borderRadius:6, padding:"3px 8px", cursor:"pointer", fontFamily:"inherit" }}>
                              Limpiar
                            </button>
                          </div>
                        </div>
                        {/* AM */}
                        <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>AM</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
                          {TODAS_HORAS.filter(h=>parseInt(h)<13).map(h=>{
                            const activa = horasDelDia.includes(h);
                            return (
                              <button key={h} onClick={()=>{
                                if(esPasado) return;
                                setHorasDisponibles(p=>({
                                  ...p,
                                  [iso]: activa ? (p[iso]||[]).filter(x=>x!==h) : [...(p[iso]||[]),h].sort()
                                }));
                              }}
                                style={{ padding:"6px 10px", borderRadius:7, fontSize:12, fontWeight:activa?700:400,
                                  border:`2px solid ${activa?C.gold:C.border}`,
                                  background:activa?`${C.gold}22`:C.bg,
                                  color:activa?C.gold:C.muted,
                                  cursor:esPasado?"not-allowed":"pointer", fontFamily:"inherit" }}>
                                {h}
                              </button>
                            );
                          })}
                        </div>
                        {/* PM */}
                        <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>PM</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                          {TODAS_HORAS.filter(h=>parseInt(h)>=13).map(h=>{
                            const activa = horasDelDia.includes(h);
                            return (
                              <button key={h} onClick={()=>{
                                if(esPasado) return;
                                setHorasDisponibles(p=>({
                                  ...p,
                                  [iso]: activa ? (p[iso]||[]).filter(x=>x!==h) : [...(p[iso]||[]),h].sort()
                                }));
                              }}
                                style={{ padding:"6px 10px", borderRadius:7, fontSize:12, fontWeight:activa?700:400,
                                  border:`2px solid ${activa?C.gold:C.border}`,
                                  background:activa?`${C.gold}22`:C.bg,
                                  color:activa?C.gold:C.muted,
                                  cursor:esPasado?"not-allowed":"pointer", fontFamily:"inherit" }}>
                                {h}
                              </button>
                            );
                          })}
                        </div>
                        {horasDelDia.length>0 && (
                          <div style={{ fontSize:11, color:C.success, marginTop:6 }}>
                            ✓ {horasDelDia.length} hora{horasDelDia.length!==1?"s":""} disponible{horasDelDia.length!==1?"s":""}
                          </div>
                        )}
                        <div style={{ height:1, background:C.border, marginTop:12 }}/>
                      </div>
                    );
                  });
                })()}
              </Panel>

            {/* Días bloqueados */}
            <Panel style={{ marginBottom:12 }}>
              <SecTitle>🔒 Bloquear días (feriados / vacaciones)</SecTitle>
              <div style={{ display:"flex",gap:8,marginBottom:10 }}>
                <Field value={fechaBloquear} onChange={e=>setFechaBloquear(e.target.value)} type="date" style={{ flex:1 }}/>
                <Btn onClick={()=>{
                  if(!fechaBloquear||diasBloqueados.includes(fechaBloquear)) return;
                  setDiasBloqueados(p=>[...p,fechaBloquear].sort());
                  setFechaBloquear("");
                }} disabled={!fechaBloquear}>Bloquear</Btn>
              </div>
              {diasBloqueados.length===0
                ? <div style={{ fontSize:13,color:C.muted }}>Sin días bloqueados</div>
                : <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                    {diasBloqueados.map(d=>(
                      <div key={d} style={{ background:`${C.danger}22`,border:`1px solid ${C.danger}44`,borderRadius:8,padding:"5px 10px",display:"flex",alignItems:"center",gap:7 }}>
                        <span style={{ fontSize:12,color:C.danger }}>🔒 {fmtFecha(d)}</span>
                        <button onClick={()=>setDiasBloqueados(p=>p.filter(x=>x!==d))} style={{ background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:14,padding:0 }}>×</button>
                      </div>
                    ))}
                  </div>
              }
            </Panel>


            {/* Ubicaciones */}
            <Panel style={{ marginBottom:12 }}>
              <SecTitle>📍 Ubicaciones de trabajo</SecTitle>
              <p style={{ margin:"0 0 12px", fontSize:12, color:C.muted }}>
                Agrega períodos donde trabajas en otra ciudad. Los clientes verán la ubicación al reservar.
              </p>

              {/* Ubicación base */}
              <div style={{ background:`${C.gold}11`, borderRadius:9, padding:"10px 13px", border:`1px solid ${C.gold}33`, marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>🏠</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>Ubicación habitual</div>
                  <div style={{ fontSize:12, color:C.muted }}>Vallenar — disponible siempre por defecto</div>
                </div>
              </div>

              {/* Formulario nueva ubicación */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                <Field value={ubicForm.ciudad} onChange={e=>setUbicForm(p=>({...p,ciudad:e.target.value}))} placeholder="Ciudad (ej: La Serena, Santiago...)"/>
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Desde</div>
                    <Field value={ubicForm.desde} onChange={e=>setUbicForm(p=>({...p,desde:e.target.value}))} type="date"/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Hasta</div>
                    <Field value={ubicForm.hasta} onChange={e=>setUbicForm(p=>({...p,hasta:e.target.value}))} type="date"/>
                  </div>
                </div>
                <Btn onClick={()=>{
                  if(!ubicForm.ciudad||!ubicForm.desde||!ubicForm.hasta) return;
                  if(ubicForm.hasta<ubicForm.desde) return;
                  setUbicaciones(p=>[...p,{id:`u-${Date.now()}`,ciudad:ubicForm.ciudad.trim(),desde:ubicForm.desde,hasta:ubicForm.hasta}].sort((a,b)=>a.desde.localeCompare(b.desde)));
                  setUbicForm({ciudad:"",desde:"",hasta:""});
                }} disabled={!ubicForm.ciudad||!ubicForm.desde||!ubicForm.hasta||ubicForm.hasta<ubicForm.desde}>
                  + Agregar período
                </Btn>
              </div>

              {/* Lista de períodos */}
              {ubicaciones.length===0
                ? <div style={{ fontSize:13,color:C.muted,textAlign:"center",padding:"8px 0" }}>Sin períodos fuera de Vallenar</div>
                : <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                    {ubicaciones.map(u=>{
                      const ahora = isoHoy();
                      const activa = ahora>=u.desde&&ahora<=u.hasta;
                      const pasada = ahora>u.hasta;
                      return (
                        <div key={u.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 13px",background:activa?`${C.success}18`:pasada?C.bg:C.card,borderRadius:10,border:`1px solid ${activa?C.success+"44":pasada?C.border:C.gold+"33"}` }}>
                          <div>
                            <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                              <span style={{ fontSize:16 }}>📍</span>
                              <span style={{ fontWeight:700,fontSize:14,color:activa?C.success:pasada?C.muted:C.gold }}>{u.ciudad}</span>
                              {activa&&<Badge color={C.success}>Activo ahora</Badge>}
                              {pasada&&<Badge color={C.muted}>Terminado</Badge>}
                            </div>
                            <div style={{ fontSize:12,color:C.muted,marginTop:3 }}>
                              {fmtFecha(u.desde)} → {fmtFecha(u.hasta)}
                            </div>
                          </div>
                          <button onClick={()=>setUbicaciones(p=>p.filter(x=>x.id!==u.id))}
                            style={{ background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:18,padding:0 }}>×</button>
                        </div>
                      );
                    })}
                  </div>
              }
            </Panel>

              {/* PIN — cambiar desde la app */}
              <Panel>
                <SecTitle>🔐 Cambiar PIN de acceso</SecTitle>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
                  <Field value={pinForm.actual} onChange={e=>setPinForm(p=>({...p,actual:e.target.value}))}
                    placeholder="PIN actual" type="password" style={{ letterSpacing:4, textAlign:"center" }}/>
                  <Field value={pinForm.nuevo} onChange={e=>setPinForm(p=>({...p,nuevo:e.target.value}))}
                    placeholder="PIN nuevo (4 dígitos)" type="password" style={{ letterSpacing:4, textAlign:"center" }}/>
                  <Field value={pinForm.confirmar} onChange={e=>setPinForm(p=>({...p,confirmar:e.target.value}))}
                    placeholder="Confirmar PIN nuevo" type="password" style={{ letterSpacing:4, textAlign:"center" }}/>
                </div>
                <Btn onClick={()=>{
                  if(pinForm.actual !== pinBarbero){ setPinMsg({tipo:"error", txt:"PIN actual incorrecto"}); return; }
                  if(pinForm.nuevo.length < 4){ setPinMsg({tipo:"error", txt:"El PIN debe tener al menos 4 dígitos"}); return; }
                  if(pinForm.nuevo !== pinForm.confirmar){ setPinMsg({tipo:"error", txt:"Los PINs nuevos no coinciden"}); return; }
                  setPinBarbero(pinForm.nuevo);
                  setPinForm({actual:"",nuevo:"",confirmar:""});
                  setPinMsg({tipo:"ok", txt:"✅ PIN cambiado correctamente"});
                  setTimeout(()=>setPinMsg(null), 3000);
                }} style={{ width:"100%", marginBottom:8 }}>
                  Cambiar PIN
                </Btn>
                {pinMsg && (
                  <div style={{ padding:"9px 12px", borderRadius:9, fontSize:12, fontWeight:700,
                    background:pinMsg.tipo==="ok"?`${C.success}18`:`${C.danger}18`,
                    border:`1px solid ${pinMsg.tipo==="ok"?C.success:C.danger}44`,
                    color:pinMsg.tipo==="ok"?C.success:C.danger }}>
                    {pinMsg.txt}
                  </div>
                )}
              </Panel>
          </>
        )}
      </div>
    </div>
  );
}

// ── App root ──────────────────────────────────────────────
export default function App() {
  const [vista,          setVista]          = useState(()=>load("bb_vista","splash"));
  const [pinInput,       setPinInput]       = useState("");
  const [pinError,       setPinError]       = useState(false);
  const [showPin,        setShowPin]        = useState(false);
  const [citas, setCitasState] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar citas desde Supabase al iniciar
  useEffect(() => {
    getCitas().then(data => {
      if (data) setCitasState(data);
      setCargando(false);
    });
    // Recargar cada 30 segundos para sincronizar en tiempo real
    const interval = setInterval(() => {
      getCitas().then(data => { if (data) setCitasState(data); });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Wrapper para actualizar citas tanto en Supabase como en estado local
  const setCitas = async (updater) => {
    if (typeof updater === "function") {
      setCitasState(prev => updater(prev));
    } else {
      setCitasState(updater);
    }
  };

  const agregarCita = async (nuevaCita) => {
    await insertCita(nuevaCita);
    const data = await getCitas();
    if (data) setCitasState(data);
  };

  const actualizarCita = async (id, cambios) => {
    await updateCita(id, cambios);
    setCitasState(prev => prev.map(c => c.id === id ? {...c, ...cambios} : c));
  };
  const [servicios,      setServicios]      = useState(()=>load("bb_servicios",SERVICIOS_DEFAULT));
  const [insumos,        setInsumos]        = useState(()=>load("bb_insumos",INSUMOS_DEFAULT));
  const [horasDis,       setHorasDis]       = useState(()=>load("bb_horas",{}));
  const [diasBloq,       setDiasBloq]       = useState(()=>load("bb_diasbloq",[]));
  const [ubicaciones,    setUbicaciones]    = useState(()=>load("bb_ubicaciones",[]));
  const [datosBancarios, setDatosBancarios] = useState(()=>load("bb_banco",{
    banco:"BancoEstado",
    nombre:"Maxy Vega",
    rut:"21.938.684-2",
    cuenta:"21938684",
    tipo:"Cuenta Vista"
  }));
  const [configPremio,   setConfigPremio]   = useState(()=>load("bb_premio",{ visitas:10, premio:"Corte gratis", sorpresa:false, activo:true }));
  const [pinBarbero,     setPinBarbero]     = useState(()=>load("bb_pin", PIN_BARBERO_DEFAULT));

  useEffect(()=>save("bb_vista",        vista),          [vista]);
  useEffect(()=>save("bb_servicios",    servicios),      [servicios]);
  useEffect(()=>save("bb_insumos",      insumos),        [insumos]);
  useEffect(()=>save("bb_horas",        horasDis),       [horasDis]);
  useEffect(()=>save("bb_diasbloq",     diasBloq),       [diasBloq]);
  useEffect(()=>save("bb_ubicaciones",  ubicaciones),    [ubicaciones]);
  useEffect(()=>save("bb_banco",        datosBancarios), [datosBancarios]);
  useEffect(()=>save("bb_premio",       configPremio),   [configPremio]);
  useEffect(()=>save("bb_pin",          pinBarbero),     [pinBarbero]);

  const entrar = () => {
    if(pinInput===pinBarbero){ setVista("barbero"); setShowPin(false); setPinInput(""); setPinError(false); }
    else { setPinError(true); setPinInput(""); }
  };

  // ── SPLASH ───────────────────────────────────────────────
  if(vista==="splash") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif", padding:24 }}>
      {/* Logo área */}
      <div style={{ marginBottom:48, textAlign:"center" }}>
        <div style={{ width:120, height:120, borderRadius:"50%", background:`linear-gradient(135deg,${C.goldD},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:56, margin:"0 auto 20px", boxShadow:`0 0 60px ${C.gold}44` }}>
          ✂️
        </div>
        <h1 style={{ margin:0, fontSize:36, fontWeight:900, color:C.gold, letterSpacing:-1 }}>BROLY</h1>
        <h2 style={{ margin:"2px 0 0", fontSize:18, fontWeight:400, color:C.mutedL, letterSpacing:6, textTransform:"uppercase" }}>Barbershop</h2>
        <div style={{ height:2, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, margin:"16px auto", width:160 }}/>
        <p style={{ margin:0, color:C.muted, fontSize:13 }}>¿Quién eres?</p>
      </div>

      {/* Botones */}
      <div style={{ width:"100%", maxWidth:320, display:"flex", flexDirection:"column", gap:14 }}>
        <button onClick={()=>setVista("cliente")}
          style={{ width:"100%", padding:"18px", borderRadius:16, border:"none",
            background:`linear-gradient(135deg,${C.gold},${C.goldD})`,
            color:"#000", fontWeight:900, fontSize:18, cursor:"pointer", fontFamily:"inherit",
            display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            boxShadow:`0 6px 30px ${C.gold}44` }}>
          <span style={{ fontSize:26 }}>💈</span>
          Soy cliente
        </button>

        <button onClick={()=>setShowPin(true)}
          style={{ width:"100%", padding:"18px", borderRadius:16,
            background:"transparent", border:`2px solid ${C.border}`,
            color:C.mutedL, fontWeight:700, fontSize:16, cursor:"pointer", fontFamily:"inherit",
            display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>🔐</span>
          Soy el barbero
        </button>
      </div>

      <p style={{ position:"absolute", bottom:24, color:C.muted, fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>
        Vallenar · Chile
      </p>

      {/* Modal PIN desde splash */}
      {showPin&&(
        <div style={{ position:"fixed",inset:0,background:"#000d",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div style={{ background:C.panel,borderRadius:20,padding:28,width:"100%",maxWidth:300,border:`1px solid ${C.gold}44`,textAlign:"center" }}>
            <div style={{ fontSize:36,marginBottom:12 }}>✂️</div>
            <div style={{ fontSize:18,fontWeight:800,color:C.white,marginBottom:6 }}>Acceso Barbero</div>
            <div style={{ fontSize:13,color:C.muted,marginBottom:20 }}>Ingresa tu PIN</div>
            <input value={pinInput} onChange={e=>setPinInput(e.target.value)} type="password" placeholder="••••" maxLength={4}
              onKeyDown={e=>e.key==="Enter"&&entrar()}
              style={{ width:"100%",boxSizing:"border-box",background:"#0f0f0f",border:`1px solid ${pinError?C.danger:C.border}`,borderRadius:8,padding:"14px",color:C.white,fontSize:22,textAlign:"center",outline:"none",letterSpacing:8,marginBottom:pinError?6:14,fontFamily:"inherit" }}/>
            {pinError&&<div style={{ color:C.danger,fontSize:12,marginBottom:12 }}>PIN incorrecto</div>}
            <div style={{ display:"flex",gap:8 }}>
              <Btn onClick={()=>{setShowPin(false);setPinInput("");setPinError(false);}} variant="ghost" style={{ flex:1 }}>Cancelar</Btn>
              <Btn onClick={entrar} style={{ flex:1 }}>Entrar</Btn>
            </div>
            <div style={{ fontSize:11,color:C.muted,marginTop:12 }}>PIN por defecto: 1234</div>
          </div>
        </div>
      )}
    </div>
  );

  // ── CLIENTE ───────────────────────────────────────────────
  if(vista==="cliente") return (
    <div>
      {/* Botón volver al inicio */}
      <button onClick={()=>setVista("splash")}
        style={{ position:"fixed",top:12,left:12,zIndex:100,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 12px",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
        ← Inicio
      </button>
      <VistaCliente servicios={servicios} citas={citas} setCitas={setCitas} agregarCita={agregarCita} horasDisponibles={horasDis} diasBloqueados={diasBloq} ubicaciones={ubicaciones} datosBancarios={datosBancarios} configPremio={configPremio}/>
    </div>
  );

  // ── BARBERO ───────────────────────────────────────────────
  return (
    <div>
      {/* Botón volver al inicio */}
      <button onClick={()=>setVista("splash")}
        style={{ position:"fixed",top:12,left:12,zIndex:100,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 12px",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
        ← Inicio
      </button>
      <DashboardBarbero
        citas={citas} setCitas={setCitas} actualizarCita={actualizarCita}
        servicios={servicios} setServicios={setServicios}
        insumos={insumos} setInsumos={setInsumos}
        horasDisponibles={horasDis} setHorasDisponibles={setHorasDis}
        diasBloqueados={diasBloq} setDiasBloqueados={setDiasBloq}
        ubicaciones={ubicaciones} setUbicaciones={setUbicaciones}
        datosBancarios={datosBancarios} setDatosBancarios={setDatosBancarios}
        configPremio={configPremio} setConfigPremio={setConfigPremio}
        pinBarbero={pinBarbero} setPinBarbero={setPinBarbero}
      />
    </div>
  );
}
