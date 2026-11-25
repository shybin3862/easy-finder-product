/* Easy Finder Product: categories, cross-refs, photos, owner mode, image search. */
(function(){
  if(typeof RAW==='undefined'||typeof ROWS==='undefined') return;
  const XREFS=RAW.xrefs||{};
  const IMGS=RAW.imgs||{};
  const APPROX=RAW.approx||{};
  const SUB_RULES=[
    ["cabin filter", /\b(CABIN|POLLEN|HABITACLE|INTERIOR FILTER|FILTER,? *CABIN)\b/i],
    ["air filter (panel)", /\bAIR FILTER\b|\bAIR CLEANER ELEMENT\b|\bPANEL AIR\b/i],
    ["oil filter (cartridge)", /\bOIL FILTER\b.*\b(ELMT|ELEMENT|CARTRIDGE|INSERT)\b|\bFILTER ELMT\b|\bSET OIL-FILTER\b/i],
    ["oil filter (spin-on)", /\bOIL FILTER\b|\bSPIN.?ON\b/i],
    ["fuel filter", /\bFUEL FILTER\b|\bFILTER,? *FUEL\b/i],
    ["hydraulic filter", /\bHYDRAULIC FILTER\b|\bSTEERING FILTER\b/i],
    ["filter (other)", /\bFILTER\b/i],
    ["brake pad", /\bBRAKE PAD|\bBREAK PAD|\bDISC PAD|\bPAD FRONT|\bPAD REAR|\bPAD WITH SHIM/i],
    ["brake shoe", /\bBRAKE SHOE|\bSHOE BRAKE|\bSHOE FRONT|\bSHOE REAR/i],
    ["brake disc", /\bBRAKE DISC|\bBRAKE ROTOR|\bDISC ROTOR|\bROTOR DISC/i],
    ["brake drum", /\bBRAKE DRUM|\bDRUM BRAKE/i],
    ["brake caliper", /\bCALIPER\b/i],
    ["brake hose / line", /\bBRAKE HOSE|\bBRAKE LINE|\bBRAKE PIPE|\bBRAKE TUBE/i],
    ["brake (other)", /\bBRAKE\b|\bBRAKE BOOSTER|\bMASTER CYLINDER/i],
    ["shock absorber", /\bSHOCK ABSORBER\b|\bSHOCK ABS\b/i],
    ["strut", /\bSTRUT\b|\bMACPHERSON\b/i],
    ["coil spring", /\bCOIL SPRING\b|\bSPRING COIL\b/i],
    ["control arm", /\bCONTROL ARM\b|\bWISHBONE\b|\bSUSPENSION ARM\b|\bTRACK CONTROL\b/i],
    ["ball joint", /\bBALL JOINT\b/i],
    ["tie rod", /\bTIE ROD\b|\bTIE-ROD\b|\bDRAG LINK\b/i],
    ["stabilizer / sway bar link", /\bSTABILIZER\b|\bSWAY BAR\b|\bANTI.?ROLL\b|\bDROP LINK\b|\bKOPPEL\b/i],
    ["bushing", /\bBUSHING\b|\bBUSH\b|\bSILENTBLOC|\bSILENT BLOCK/i],
    ["wheel hub / bearing hub", /\bWHEEL HUB\b|\bHUB BEARING\b|\bHUB UNIT\b|\bHUB BALL\b|\bHUB ASSEMBLY/i],
    ["cv joint / axle", /\bCV JOINT\b|\bDRIVE SHAFT\b|\bDRIVESHAFT\b|\bCV AXLE\b|\bAXLE SHAFT\b/i],
    ["wheel bearing", /\bWHEEL BEARING\b/i],
    ["bearing", /\bBEARING\b/i],
    ["piston", /\bPISTON ASSY\b|\bPISTON\b/i],
    ["ring set", /\bPISTON RING|\bRING SET\b/i],
    ["engine valve", /\bVALVE,EXHAUST|\bVALVE,INTAKE|\bEXHAUST VALVE|\bINTAKE VALVE|\bENGINE VALVE/i],
    ["timing chain / kit", /\bTIMING CHAIN|\bCHAIN KIT\b/i],
    ["timing belt", /\bTIMING BELT\b/i],
    ["camshaft / crankshaft", /\bCAMSHAFT\b|\bCRANKSHAFT\b/i],
    ["serpentine / V-ribbed belt", /\bRIB ACE\b|\bRIBBED BELT\b|\bSERPENTINE\b|\bV-RIB|\bPK BELT\b|\bFAN BELT\b|\bDRIVE BELT\b|\bV BELT\b|\bBELT,V/i],
    ["belt tensioner", /\bTENSIONER\b|\bIDLER\b/i],
    ["pulley", /\bPULLEY\b/i],
    ["radiator cap", /\bRADIATOR CAP\b/i],
    ["radiator", /\bRADIATOR\b/i],
    ["water pump", /\bWATER PUMP\b/i],
    ["thermostat", /\bTHERMOSTAT\b/i],
    ["cooling fan", /\bCOOLING FAN\b|\bFAN MOTOR\b|\bCONDENSER FAN\b/i],
    ["blower motor", /\bBLOWER MOTOR\b|\bBLOWER\b/i],
    ["compressor / AC", /\bCOMPRESSOR\b|\bAIR COND|\bCONDENSER\b|\bEVAPORATOR\b/i],
    ["oil cooler", /\bOIL COOLER\b/i],
    ["ignition coil", /\bIGNITION COIL\b|\bCOIL,IGN/i],
    ["spark plug", /\bSPARK PLUG\b/i],
    ["glow plug", /\bGLOW PLUG\b/i],
    ["battery", /\bBATTERY\b/i],
    ["bulb H4", /\bH4\b/i],
    ["bulb H7", /\bH7\b/i],
    ["bulb H11 / HB", /\bH11\b|\bHB3\b|\bHB4\b|\bH8\b|\bH9\b/i],
    ["bulb (other)", /\bBULB\b|\bLAMP\b|\bHEADLIGHT\b|\bHEADLAMP\b/i],
    ["wiper blade", /\bWIPER\b/i],
    ["alternator", /\bALTERNATOR\b/i],
    ["starter", /\bSTARTER\b/i],
    ["sensor", /\bSENSOR\b|\bLAMBDA\b|\bO2 SENSOR\b/i],
    ["clutch kit / disc", /\bCLUTCH KIT\b|\bCLUTCH DISC\b|\bCLUTCH COVER\b|\bCLUTCH PLATE\b|\bCLUTCH PRESSURE/i],
    ["clutch release bearing", /\bCLUTCH RELEASE|\bRELEASE BEARING\b/i],
    ["clutch (other)", /\bCLUTCH\b/i],
    ["flywheel", /\bFLYWHEEL\b/i],
    ["transmission / gearbox part", /\bGEARBOX\b|\bTRANSMISSION\b|\bSYNCHRO\b|\bTRANSFER CASE\b|\bTRANSFER SHIFT/i],
    ["fuel injector", /\bINJECTOR\b/i],
    ["fuel pump", /\bFUEL PUMP\b/i],
    ["fuel line / tank", /\bFUEL LINE\b|\bFUEL PIPE\b|\bFUEL TANK\b|\bFUEL HOSE\b|\bFUEL CAP\b/i],
    ["head gasket", /\bGASKET HEAD\b|\bHEAD GASKET\b|\bGASKET,HEAD\b/i],
    ["full gasket set", /\bGASKET FULL\b|\bGASKET SET\b|\bOVERHAUL GASKET\b/i],
    ["gasket / seal", /\bGASKET\b|\bSEAL\b|\bO-RING\b|\bORING\b|\bOIL SEAL\b/i],
    ["horn", /\bHORN\b/i],
    ["hose", /\bHOSE\b/i],
    ["bolt / nut / hardware", /\bBOLT\b|\bNUT\b|\bWASHER\b|\bCLIP\b|\bCLAMP\b|\bSCREW\b/i],
    ["turbocharger", /\bTURBOCHARGER\b|\bTURBO\b/i],
    ["exhaust part", /\bEXHAUST\b|\bMUFFLER\b|\bSILENCER\b|\bCATALYTIC\b/i],
    ["engine oil", /\bENGINE OIL\b|\bMOTOR OIL\b|\b0W-|\b5W-|\b10W-|\b15W-|\b20W-/i],
    ["ATF / transmission fluid", /\bATF\b|\bDEXRON\b|\bGEAR OIL\b|\bTRANSMISSION FLUID\b/i],
    ["grease", /\bGREASE\b/i],
    ["chemical / additive", /\bCLEANER\b|\bADDITIVE\b|\bBRAKE FLUID\b|\bCOOLANT\b|\bANTIFREEZE\b|\bSPRAY\b/i],
    ["oil pump", /\bOIL PUMP\b/i],
    ["pump (other)", /\bPUMP\b/i],
  ];
  const SUB_FALLBACK={"Bearings": "bearing", "Steering & Suspension": "steering / suspension part", "Braking": "brake (other)", "Engine Internals": "engine part", "Filters": "filter (other)", "Cooling & Climate": "cooling part", "Transmission & Clutch": "clutch (other)", "Hardware & Hoses": "hose", "Belts & Pulleys": "serpentine / V-ribbed belt", "Gaskets & Seals": "gasket / seal", "Body & Lighting": "bulb (other)", "Electrical & Sensors": "sensor", "Fuel System": "fuel system part", "Pumps": "pump (other)", "Lubricants & Fluids": "engine oil", "Turbo & Exhaust": "exhaust part", "Other Parts": "automotive spare part"};
  const LUBE_RULES=[
    ["ATF / transmission fluid", /\bMTF\b|\bGL-?[1-5]\b|\bCVT\b|\bSYN OEM\b|\bGEAR OIL\b|\bTRANSMISSION (OIL|FLUID)\b/i],
    ["chemical / additive", /\bFLUSH\b|\bOCTANE\b|\bAXIS L\d|\bHYDRAULIC (OIL|FLUID)\b|\bPOWER STEERING\b|\bADDITIVE\b|\bCLEANER\b/i],
  ];
  function subtypeOf(desc, cat){
    const d=desc||'';
    if(cat==='Lubricants & Fluids'){ for(const [name,rx] of LUBE_RULES){ if(rx.test(d)) return name; } }
    for(const [name,rx] of SUB_RULES){ if(rx.test(d)) return name; }
    return SUB_FALLBACK[cat||'']||'automotive spare part';
  }
  function shippedImgs(sku, desc, cat){
    if(IMGS[sku]&&IMGS[sku].length) return IMGS[sku];
    const t=subtypeOf(desc, cat);
    const rec=APPROX[t];
    return rec?[Object.assign({},rec,{typ:t,k:'approx'})]:[];
  }
  const PIN_H='efp-owner-hash', PIN_S='efp-owner-salt', PIN_OK='efp-owner-ok';
  const IDB_NAME='efp-owner-photos', IDB_STORE='photos';
  const EMB_URL='embeddings.json';
  const MODEL_JSON='vendor/mobilenet/model.json';
  if(!DataView.prototype.getFloat16){
    DataView.prototype.getFloat16=function(byteOffset, littleEndian){
      const u=this.getUint16(byteOffset, littleEndian);
      const s=(u&0x8000)>>15, e=(u&0x7C00)>>10, f=u&0x03FF;
      if(e===0) return (s?-1:1)*Math.pow(2,-14)*(f/1024);
      if(e===0x1F) return f?NaN:((s?-1:1)*Infinity);
      return (s?-1:1)*Math.pow(2,e-15)*(1+f/1024);
    };
  }
  const MORE_N=4;
  let browse='vehicle';
  let ownerOn=false;
  let imgHits=null; /* [{r, score}] or null */
  let imgMsg='';
  let modelP=null, embedder=null, catalogEmb=null;
  let toastT=null;

  const PRICES=RAW.prices||{};
  const fmtAED=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  /* price: [incl_vat, ex_vat, pack, discontinued]; no price (or null) -> "Price on request" */
  function priceHtml(r){
    const p=r._price;
    if(!p||p[0]==null) return '<div class="price none">Price on request</div>';
    const pk=(p[2]&&p[2]!=='Per unit')?` <span class="pk">\u00b7 ${esc(p[2])}</span>`:(p[2]==='Per unit'?' <span class="pk">\u00b7 per unit</span>':'');
    return `<div class="price"><span class="cur">AED</span> <b>${fmtAED(p[0])}</b> <small>incl. 5% VAT</small>${pk}${p[3]?' <span class="disc">Discontinued</span>':''}</div>`;
  }
  function priceDetail(r){
    const p=r._price;
    if(!p||p[0]==null) return '<div class="k">Price</div><div class="price none big">Price on request</div>';
    const ex=(p[1]!=null)?`<div class="k" style="margin-top:2px">AED ${fmtAED(p[1])} excl. VAT</div>`:'';
    const pk=(p[2]&&p[2]!=='Per unit')?`<div class="k" style="margin-top:2px">Pack: ${esc(p[2])}</div>`:'<div class="k" style="margin-top:2px">Per unit</div>';
    return `<div class="k">Price</div><div class="price big"><span class="cur">AED</span> <b>${fmtAED(p[0])}</b> <small>incl. 5% VAT</small>${p[3]?' <span class="disc">Discontinued</span>':''}</div>${ex}${pk}`;
  }
  ROWS.forEach(r=>{
    r._price=PRICES[r._sku]||null;
    r._xrefs=XREFS[r._sku]||[];
    r._imgs=shippedImgs(r._sku,r._desc,r._cat);
    if(r._xrefs.length){
      r.u+=' '+r._xrefs.join(' ').toUpperCase();
      r.k+=' '+r._xrefs.map(N).join(' ');
    }
  });
  const bySku={};
  ROWS.forEach(r=>{ bySku[r._sku]=r; });

  /* ---------- DOM chrome ---------- */
  const style=document.createElement('style');
  style.textContent=`
.hdr-actions{margin-left:auto;display:flex;gap:8px;align-items:center}.hdr-actions .theme-toggle{margin-left:0}
.modes{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}
.xref{margin-top:4px;display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:11px;color:var(--mu)}
.xref b{font-weight:700;color:var(--mu);margin-right:2px}
.xchip{display:inline-block;border:1px solid var(--bd);background:var(--bg);color:var(--tx);
  border-radius:8px;padding:1px 7px;font-size:11px;font-weight:650;cursor:pointer;box-shadow:var(--inset)}
.xchip:hover{border-color:var(--cu);color:var(--cu)}
.xmore{border:0;background:transparent;color:var(--cu);font-weight:700;cursor:pointer;font-size:11px;padding:0 4px}
.thumb{width:48px;height:48px;object-fit:cover;border-radius:8px;background:var(--hl);border:1px solid var(--bd);flex-shrink:0}
.td-item{display:flex;gap:8px;align-items:flex-start}
.badge{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.02em;text-transform:uppercase;
  background:var(--cu);color:#fff;border-radius:6px;padding:1px 6px;margin-right:4px}
.badge.own{background:#1a7f4e}
.badge.approx{background:#8a6a00}
.gallery{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.gallery figure{margin:0;width:110px}
.gallery img{width:110px;height:110px;object-fit:cover;border-radius:10px;border:1px solid var(--bd);cursor:zoom-in;background:var(--hl)}
.gallery figcaption{font-size:10px;color:var(--mu);margin-top:3px}
#lb{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:20;padding:16px}
#lb.open{display:flex}
#lb img{max-width:100%;max-height:100%;border-radius:12px;box-shadow:0 12px 40px #000}
.modal-back{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;z-index:18;padding:16px}
.modal-back.open{display:flex}
.modal{background:var(--card);color:var(--tx);border-radius:16px;padding:18px;max-width:360px;width:100%;box-shadow:var(--shadow);border:1px solid var(--bd)}
.modal h3{margin:0 0 8px;color:var(--cu)}
.modal p{margin:0 0 10px;color:var(--mu);font-size:13px}
.modal input{margin:6px 0 10px}
.modal .row{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}
#toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#1a1214;color:#fff;
  padding:8px 14px;border-radius:10px;font-size:13px;opacity:0;pointer-events:none;z-index:30;transition:.2s}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
#clist{overflow:auto;flex:1;padding:0 6px 8px;display:none}
.side.cat-mode #mlist,.side.cat-mode #vlist,.side.cat-mode #ms,.side.cat-mode #vs,
.side.cat-mode h3.veh-h{display:none}
.side.cat-mode #clist{display:block}
#imgq-status{font-size:12px;color:var(--mu);margin:6px 0 0}
imgq-note, .imgq-note{font-size:13px;color:var(--cu);font-weight:700;margin:0 0 6px}
.price{margin-top:3px;font-size:12px;color:var(--mu)}
.price b{color:var(--cu);font-size:15px;font-weight:800}
.price .cur{font-weight:700;color:var(--cu);font-size:11px}
.price .pk{color:var(--mu)}
.price .disc{display:inline-block;background:#8a6a00;color:#fff;border-radius:6px;padding:0 6px;font-size:10px;font-weight:800;text-transform:uppercase}
.price.none{font-style:italic;color:var(--mu)}
.price.big{font-size:13px;margin-top:2px}.price.big b{font-size:22px}
.add-photo{margin-top:10px}
.del-own{display:block;margin-top:2px;font-size:10px;color:var(--cu);cursor:pointer;background:none;border:0;padding:0}
  `;
  document.head.appendChild(style);

  const th=$('th');
  if(th && !th.parentElement.classList.contains('hdr-actions')){
    const wrap=document.createElement('div');
    wrap.className='hdr-actions';
    const ob=document.createElement('button');
    ob.type='button'; ob.id='ownerBtn'; ob.className='theme-toggle';
    ob.setAttribute('aria-label','Owner mode'); ob.title='Owner mode';
    ob.textContent='Owner';
    th.parentElement.insertBefore(wrap, th);
    wrap.appendChild(ob);
    wrap.appendChild(th);
  }
  const top=document.querySelector('.top');
  if(top && !$('modes')){
    const modes=document.createElement('div');
    modes.className='modes'; modes.id='modes';
    modes.innerHTML=`<button type="button" class="chip on" data-mode="vehicle" id="mode-veh">Vehicles</button>
      <button type="button" class="chip" data-mode="category" id="mode-cat">Categories</button>
      <button type="button" class="chip" id="imgq-btn">Search by image</button>
      <input type="file" id="imgq-file" accept="image/*" capture="environment" hidden>
      <input type="file" id="own-file" accept="image/*" multiple hidden>`;
    top.insertBefore(modes, top.firstChild);
    const st=document.createElement('div');
    st.id='imgq-status';
    top.appendChild(st);
  }
  const side=document.querySelector('.side');
  if(side){
    side.querySelectorAll('h3').forEach((h,i)=>{h.classList.add('veh-h');});
    if(!$('clist')){
      const c=document.createElement('div'); c.id='clist';
      side.appendChild(c);
    }
    /* category heading */
    if(!$('cat-h')){
      const h=document.createElement('h3');
      h.id='cat-h'; h.textContent='Browse categories'; h.style.display='none';
      side.insertBefore(h, $('clist'));
    }
  }
  if(!$('lb')){
    const lb=document.createElement('div'); lb.id='lb'; lb.innerHTML='<img alt="">';
    lb.onclick=()=>lb.classList.remove('open');
    document.body.appendChild(lb);
  }
  if(!$('efp-modal')){
    const mb=document.createElement('div'); mb.className='modal-back'; mb.id='efp-modal';
    mb.innerHTML='<div class="modal" id="efp-modal-box"></div>';
    mb.addEventListener('click',e=>{ if(e.target===mb) closeModal(); });
    document.body.appendChild(mb);
  }
  if(!$('toast')){
    const t=document.createElement('div'); t.id='toast'; document.body.appendChild(t);
  }

  function toast(msg){
    const t=$('toast'); if(!t) return;
    t.textContent=msg; t.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'), 1800);
  }
  function openLightbox(src){
    const lb=$('lb'); const img=lb.querySelector('img');
    img.src=src; lb.classList.add('open');
  }
  function closeModal(){ $('efp-modal').classList.remove('open'); }
  function openModal(html){
    $('efp-modal-box').innerHTML=html;
    $('efp-modal').classList.add('open');
  }

  /* ---------- Cross-ref chips ---------- */
  function xrefHtml(r, expanded){
    const xs=r._xrefs||[];
    if(!xs.length) return '';
    const show=expanded?xs:xs.slice(0,MORE_N);
    const more=(!expanded && xs.length>MORE_N)?`<button type="button" class="xmore" data-exp="${esc(r._sku)}">+${xs.length-MORE_N} more</button>`:'';
    return `<div class="xref"><b>Cross ref:</b>${show.map(x=>`<button type="button" class="xchip" data-copy="${esc(x)}" title="Copy">${esc(x)}</button>`).join('')}${more}</div>`;
  }
  document.addEventListener('click',e=>{
    const chip=e.target.closest('.xchip');
    if(chip && chip.dataset.copy){
      e.preventDefault(); e.stopPropagation();
      const v=chip.dataset.copy;
      (navigator.clipboard&&navigator.clipboard.writeText(v)?navigator.clipboard.writeText(v):Promise.reject())
        .catch(()=>{ const i=document.createElement('input'); i.value=v; document.body.appendChild(i); i.select(); try{document.execCommand('copy');}catch(err){} i.remove(); })
        .then(()=>toast('Copied '+v));
      return;
    }
    const more=e.target.closest('.xmore');
    if(more){
      e.preventDefault(); e.stopPropagation();
      const r=bySku[more.dataset.exp]; if(!r) return;
      more.parentElement.outerHTML=xrefHtml(r,true);
    }
  });

  /* ---------- Images (shipped + owner) ---------- */
  function shippedSrc(im){ return im.f; }
  function kindLabel(im){
    if(im.own) return 'Own photo';
    const k=(im.k||'photo').toLowerCase();
    if(k==='diagram') return 'Diagram';
    if(k==='image') return 'Image';
    if(k==='approx'||k==='approximate'){
      const t=im.typ||im.t||'part';
      return 'Approximate – typical '+t;
    }
    if(im.src) return 'Source: '+im.src;
    return 'Photo';
  }
  async function allImagesFor(sku){
    const own=ownerOn?await listOwn(sku):await listOwn(sku).catch(()=>[]);
    const shipped=(bySku[sku]&&bySku[sku]._imgs)||[];
    const out=[];
    (own||[]).forEach(o=>out.push({f:o.url, k:'photo', own:true, id:o.id}));
    shipped.forEach(s=>out.push(s));
    return out;
  }
  function thumbHtml(imgs){
    if(!imgs||!imgs.length) return '';
    const first=imgs[0];
    const lab=kindLabel(first);
    return `<img class="thumb" src="${esc(shippedSrc(first))}" alt="${esc(lab)}" data-full="${esc(shippedSrc(first))}">`;
  }

  /* ---------- Override draw / details / run ---------- */
  const _draw=draw;
  const _run=run;
  const _appOk=appOk;

  window.draw=function(){
    const slice=res.slice(0,shown);
    const heading=imgHits? 'Closest looking parts, confirm by part number' : null;
    if($('cnt')){
      $('cnt').textContent=res.length.toLocaleString()+(imgHits?' closest':' matches');
    }
    const rows=slice.map((r,i)=>{
      const score=imgHits && r._sim!=null? `<div class="xref">Similarity ${Math.round(r._sim*100)}%${r._simApprox?' · <span class="badge approx">Approximate – typical '+esc(r._simTyp||'part')+'</span>':''}</div>`:'';
      const imgs=r._dispImgs||r._imgs;
      return `<tr data-i="${i}">
        <td><div class="td-item">${thumbHtml(imgs)}<div><b>${esc(r._sku)}</b>${priceHtml(r)}${xrefHtml(r,false)}${score}</div></div></td>
        <td>${esc(r._desc)}</td>
        <td>${esc(r._brand)}</td>
        <td>${appText(r).map(x=>'<span class="tag">'+esc(x)+'</span>').join(' ')}</td>
        <td>${(r._years||[]).map(([a,b])=>esc(yrLab(a,b))).join(', ')}</td>
        <td>${r._eng.map(e=>'<span class="tag">'+esc(e)+'</span>').join(' ')}</td>
        <td>${esc(r._cat)}</td>
        <td>${esc(r._uom)}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="8" style="color:var(--mu);padding:20px">No matches.</td></tr>';
    $('tb').innerHTML=rows;
    $('more').style.display=shown<res.length?'':'none';
    /* attach own thumbs asynchronously */
    fillListThumbs(slice);
  };

  async function fillListThumbs(slice){
    for(let i=0;i<slice.length;i++){
      const r=slice[i];
      const imgs=await allImagesFor(r._sku);
      r._dispImgs=imgs;
      const cell=$('tb').querySelector(`tr[data-i="${i}"] .td-item`);
      if(!cell||!imgs.length) continue;
      const th=cell.querySelector('.thumb');
      if(th){ th.src=imgs[0].f; th.dataset.full=imgs[0].f; th.alt=kindLabel(imgs[0]); }
      else{
        const wrap=cell;
        wrap.insertAdjacentHTML('afterbegin', thumbHtml(imgs));
      }
    }
  }

  window.run=function(){
    if(imgHits){
      fillYearEng(imgHits.map(h=>h.r));
      let base=imgHits.map(h=>{ h.r._sim=h.score; return h.r; });
      base=base.filter(r=>(!year||yearHit(r._years,year))&&(!eng||r._eng.includes(eng)));
      if(browse==='category' && cat) base=base.filter(r=>r._cat===cat);
      else if(cat) base=base.filter(r=>r._cat===cat);
      const cc={}; base.forEach(r=>cc[r._cat]=(cc[r._cat]||0)+1);
      $('chips').innerHTML=`<button type="button" class="chip ${cat?'':'on'}" data-c="">All ${base.length}</button>`+
        Object.keys(cc).sort((a,b)=>cc[b]-cc[a]).map(c=>`<button type="button" class="chip ${c===cat?'on':''}" data-c="${esc(c)}">${esc(c)} ${cc[c]}</button>`).join('');
      res=base;
      $('vt').innerHTML='Closest looking parts, confirm by part number';
      shown=Math.max(STEP, 10);
      draw();
      return;
    }
    _run();
    if(browse==='category'){
      const bits=cat?`Category <b>${esc(cat)}</b>`:'All categories';
      const veh=(make||model!==null)?` · ${esc([make, model===null?'':(model||'Unspecified')].filter(Boolean).join(' · '))}`:'';
      $('vt').innerHTML=bits+veh;
    }
  };

  function clist(){
    const counts={};
    ROWS.forEach(r=>{ counts[r._cat]=(counts[r._cat]||0)+1; });
    const cats=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]||a.localeCompare(b));
    let h=`<div class="v ${!cat?'on':''}" data-c=""><span>All categories</span><small>${ROWS.length.toLocaleString()}</small></div>`;
    cats.forEach(c=>{
      h+=`<div class="v ${c===cat?'on':''}" data-c="${esc(c)}"><span>${esc(c)}</span><small>${counts[c].toLocaleString()}</small></div>`;
    });
    if($('clist')) $('clist').innerHTML=h;
  }
  function setBrowse(mode){
    browse=mode;
    const sideEl=document.querySelector('.side');
    if(sideEl) sideEl.classList.toggle('cat-mode', mode==='category');
    if($('mode-veh')) $('mode-veh').classList.toggle('on', mode==='vehicle');
    if($('mode-cat')) $('mode-cat').classList.toggle('on', mode==='category');
    if($('cat-h')) $('cat-h').style.display=mode==='category'?'':'none';
    if(mode==='category') clist();
    run();
  }
  if($('mode-veh')) $('mode-veh').onclick=()=>setBrowse('vehicle');
  if($('mode-cat')) $('mode-cat').onclick=()=>setBrowse('category');
  if($('clist')) $('clist').onclick=e=>{
    const d=e.target.closest('.v'); if(!d) return;
    cat=d.dataset.c||''; clist(); shown=STEP; run();
  };

  $('tb').onclick=e=>{
    if(e.target.closest('.xchip,.xmore')) return;
    const full=e.target.closest('img[data-full]');
    if(full){ e.stopPropagation(); openLightbox(full.dataset.full); return; }
    const t=e.target.closest('tr[data-i]'); if(!t) return;
    const r=res[+t.dataset.i]; if(!r) return;
    openDetails(r);
  };

  async function openDetails(r){
    const imgs=await allImagesFor(r._sku);
    const gal=imgs.length? `<div class="k">Pictures</div><div class="gallery">${imgs.map(im=>`
      <figure>
        <img src="${esc(im.f)}" alt="${esc(kindLabel(im))}" data-full="${esc(im.f)}">
        <figcaption><span class="badge ${im.own?'own':''}">${esc(kindLabel(im))}</span>${im.own&&ownerOn?`<button type="button" class="del-own" data-del="${esc(im.id)}">Remove</button>`:''}</figcaption>
      </figure>`).join('')}</div>`:`<div class="k">Pictures</div><p class="k" style="margin:4px 0 0">No picture on file for this part.</p>`;
    const add=ownerOn?`<div class="add-photo"><button type="button" id="add-photo-btn">Add photo</button></div>`:'';
    $('det').innerHTML=`<button class="ghost" onclick="document.getElementById('det').classList.remove('open')" style="float:right">\u2715</button>
      <h2>${esc(r._sku)}</h2>
      ${priceDetail(r)}
      <div class="k">Description</div>${esc(r._desc)}
      <div class="k">Brand</div>${esc(r._brand)}
      <div class="k">Category</div>${esc(r._cat)}
      <div class="k">UoM</div>${esc(r._uom)||'\u2014'}
      <div class="k">Cross ref</div>${(r._xrefs&&r._xrefs.length)?r._xrefs.map(x=>`<button type="button" class="xchip" data-copy="${esc(x)}">${esc(x)}</button>`).join(' '):'\u2014'}
      ${gal}${add}
      <div class="k">Application (from description)</div>${appText(r).join('<br>')||'\u2014'}
      <div class="k">Year in description</div>${(r._years||[]).map(([a,b])=>yrLab(a,b)).join(', ')||'\u2014'}
      <div class="k">Engine in description</div>${r._eng.join(', ')||'\u2014'}
      <p class="k">Confirm fitment before sale. These tags are parsed from the item description and are not verified fitment. Stock quantities are not shown. Prices are in AED incl. 5% VAT as per the price list; confirm before sale.</p>`;
    $('det').classList.add('open');
    $('det').querySelectorAll('img[data-full]').forEach(im=>im.onclick=ev=>{ ev.stopPropagation(); openLightbox(im.dataset.full); });
    const addBtn=$('add-photo-btn');
    if(addBtn) addBtn.onclick=()=>{ $('own-file').dataset.sku=r._sku; $('own-file').click(); };
    $('det').querySelectorAll('.del-own').forEach(btn=>{
      btn.onclick=async ev=>{ ev.stopPropagation(); await deleteOwn(btn.dataset.del); toast('Photo removed'); openDetails(r); draw(); };
    });
  }

  const _csv=$('csv').onclick;
  $('csv').onclick=()=>{
    const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
    const L=[['Item No.','Description','Brand','Category','UoM','Price (AED incl. 5% VAT)','Pack','Cross refs','Application (from description)','Year','Engine'].join(',')].concat(
      res.map(r=>[r._sku,r._desc,r._brand,r._cat,r._uom,(r._price&&r._price[0]!=null)?r._price[0].toFixed(2):'Price on request',(r._price&&r._price[2])||'',(r._xrefs||[]).join(' | '),appText(r).join(' | '),(r._years||[]).map(([a,b])=>yrLab(a,b)).join(' | '),r._eng.join(' | ')].map(q).join(','))
    );
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['\ufeff'+L.join('\r\n')],{type:'text/csv'}));
    a.download='easy-finder-product-'+(make||cat||'all').replace(/\W+/g,'_')+'.csv'; a.click();
  };

  /* ---------- Owner mode (PIN hashed on device, IndexedDB photos) ---------- */
  function randSalt(){
    const a=new Uint8Array(16); crypto.getRandomValues(a);
    return [...a].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function hashPin(pin, salt){
    const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt+':'+pin));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function pinOk(p){ return /^\d{4,6}$/.test(p||''); }
  function hasPin(){ try{ return !!localStorage.getItem(PIN_H); }catch(e){ return false; } }
  function isUnlocked(){ try{ return sessionStorage.getItem(PIN_OK)==='1'; }catch(e){ return false; } }
  function setUnlocked(v){ try{ v?sessionStorage.setItem(PIN_OK,'1'):sessionStorage.removeItem(PIN_OK); }catch(e){} ownerOn=!!v; updateOwnerBtn(); }
  function updateOwnerBtn(){
    const b=$('ownerBtn'); if(!b) return;
    b.textContent=ownerOn?'Owner ✓':'Owner';
    b.title=ownerOn?'Owner mode on — tap to lock or export':'Owner mode';
  }
  function ownerMenu(){
    openModal(`<h3>Owner mode</h3>
      <p>Photos you add stay on this device and work offline. Export a file to include them in the next published release.</p>
      <div class="row">
        <button type="button" id="own-export">Export my photos</button>
        <button type="button" class="ghost" id="own-lock">Lock</button>
      </div>
      <div class="row"><button type="button" class="ghost" id="own-cancel">Close</button></div>`);
    $('own-cancel').onclick=closeModal;
    $('own-lock').onclick=()=>{ setUnlocked(false); closeModal(); toast('Owner mode locked'); draw(); if($('det').classList.contains('open')){ const sku=$('det').querySelector('h2'); if(sku){ const r=bySku[sku.textContent]; if(r) openDetails(r);} } };
    $('own-export').onclick=()=>{ closeModal(); exportOwn(); };
  }
  function askSetPin(){
    openModal(`<h3>Set owner PIN</h3>
      <p>Choose a 4–6 digit PIN. It is stored only on this device (hashed). There is no server and no way to recover it if you forget it.</p>
      <input id="pin1" type="password" inputmode="numeric" maxlength="6" placeholder="PIN (4–6 digits)" autocomplete="new-password">
      <input id="pin2" type="password" inputmode="numeric" maxlength="6" placeholder="Confirm PIN" autocomplete="new-password">
      <div class="row"><button type="button" class="ghost" id="pin-cancel">Cancel</button><button type="button" id="pin-save">Save PIN</button></div>`);
    $('pin-cancel').onclick=closeModal;
    $('pin-save').onclick=async()=>{
      const a=$('pin1').value, b=$('pin2').value;
      if(!pinOk(a)){ toast('PIN must be 4–6 digits'); return; }
      if(a!==b){ toast('PINs do not match'); return; }
      const salt=randSalt(); const h=await hashPin(a,salt);
      try{ localStorage.setItem(PIN_S,salt); localStorage.setItem(PIN_H,h); }catch(e){ toast('Could not save PIN'); return; }
      setUnlocked(true); closeModal(); toast('Owner mode unlocked');
    };
  }
  function askUnlock(){
    openModal(`<h3>Unlock owner mode</h3>
      <p>Enter your 4–6 digit PIN. It never leaves this device.</p>
      <input id="pinu" type="password" inputmode="numeric" maxlength="6" placeholder="PIN" autocomplete="current-password">
      <div class="row"><button type="button" class="ghost" id="pin-cancel">Cancel</button><button type="button" id="pin-go">Unlock</button></div>`);
    $('pin-cancel').onclick=closeModal;
    const go=async()=>{
      const p=$('pinu').value;
      if(!pinOk(p)){ toast('PIN must be 4–6 digits'); return; }
      let salt,h; try{ salt=localStorage.getItem(PIN_S); h=localStorage.getItem(PIN_H); }catch(e){}
      if(!salt||!h){ askSetPin(); return; }
      const got=await hashPin(p,salt);
      if(got!==h){ toast('Incorrect PIN'); return; }
      setUnlocked(true); closeModal(); toast('Owner mode unlocked');
    };
    $('pin-go').onclick=go;
    $('pinu').addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
  }
  if($('ownerBtn')) $('ownerBtn').onclick=()=>{
    if(ownerOn){ ownerMenu(); return; }
    if(!hasPin()) askSetPin(); else askUnlock();
  };
  if(isUnlocked()){ ownerOn=true; updateOwnerBtn(); }

  function idb(){
    return new Promise((res,rej)=>{
      const r=indexedDB.open(IDB_NAME,1);
      r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(IDB_STORE)){ const s=db.createObjectStore(IDB_STORE,{keyPath:'id'}); s.createIndex('sku','sku',{unique:false}); } };
      r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);
    });
  }
  async function listOwn(sku){
    const db=await idb();
    return new Promise((res,rej)=>{
      const tx=db.transaction(IDB_STORE,'readonly');
      const idx=tx.objectStore(IDB_STORE).index('sku');
      const q=idx.getAll(sku);
      q.onsuccess=()=>{
        const rows=q.result||[];
        res(rows.map(p=>({id:p.id, sku:p.sku, url:URL.createObjectURL(p.blob), mime:p.mime, ts:p.ts})));
      };
      q.onerror=()=>rej(q.error);
    });
  }
  async function allOwn(){
    const db=await idb();
    return new Promise((res,rej)=>{
      const q=db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).getAll();
      q.onsuccess=()=>res(q.result||[]);
      q.onerror=()=>rej(q.error);
    });
  }
  async function saveOwn(sku, blob, mime){
    const db=await idb();
    const rec={id:sku+'__'+Date.now()+'__'+Math.random().toString(36).slice(2,8), sku, blob, mime:mime||blob.type||'image/webp', ts:Date.now(), w:0, h:0};
    return new Promise((res,rej)=>{
      const q=db.transaction(IDB_STORE,'readwrite').objectStore(IDB_STORE).put(rec);
      q.onsuccess=()=>res(rec); q.onerror=()=>rej(q.error);
    });
  }
  async function deleteOwn(id){
    const db=await idb();
    return new Promise((res,rej)=>{
      const q=db.transaction(IDB_STORE,'readwrite').objectStore(IDB_STORE).delete(id);
      q.onsuccess=()=>res(); q.onerror=()=>rej(q.error);
    });
  }
  async function compressFile(file){
    const bmp=await createImageBitmap(file);
    const scale=Math.min(1, 1000/Math.max(bmp.width,bmp.height));
    const c=document.createElement('canvas');
    c.width=Math.max(1,Math.round(bmp.width*scale));
    c.height=Math.max(1,Math.round(bmp.height*scale));
    c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
    const blob=await new Promise(r=>{
      if(c.toBlob) c.toBlob(b=>r(b),'image/webp',0.8);
      else r(null);
    });
    if(blob) return {blob, mime:'image/webp'};
    const jpg=await new Promise(r=>c.toBlob(b=>r(b),'image/jpeg',0.8));
    return {blob:jpg||file, mime:(jpg&&jpg.type)||file.type||'image/jpeg'};
  }
  if($('own-file')) $('own-file').onchange=async ev=>{
    const sku=ev.target.dataset.sku; const files=[...ev.target.files||[]]; ev.target.value='';
    if(!sku||!files.length||!ownerOn) return;
    for(const f of files){
      try{
        const {blob,mime}=await compressFile(f);
        await saveOwn(sku, blob, mime);
      }catch(err){ toast('Could not save photo'); }
    }
    toast('Photo'+(files.length>1?'s':'')+' saved on this device');
    const r=bySku[sku]; if(r){ openDetails(r); draw(); }
  };

  /* ZIP (STORE) writer for export */
  function crc32(u8){
    let c=~0; const tbl=crc32.t||(crc32.t=(()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let x=n; for(let k=0;k<8;k++) x=x&1?0xedb88320^(x>>>1):x>>>1; t[n]=x; } return t; })());
    for(let i=0;i<u8.length;i++) c=tbl[(c^u8[i])&255]^(c>>>8);
    return ~c>>>0;
  }
  function zipStore(files){
    const enc=s=>new TextEncoder().encode(s);
    const locals=[], cents=[], chunks=[];
    let offset=0;
    for(const f of files){
      const name=enc(f.name); const data=f.data;
      const crc=crc32(data);
      const loc=new ArrayBuffer(30+name.length); const lv=new DataView(loc);
      lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true);
      lv.setUint16(8,0,true); lv.setUint16(10,0,true); lv.setUint16(12,0,true);
      lv.setUint32(14,crc,true); lv.setUint32(18,data.length,true); lv.setUint32(22,data.length,true);
      lv.setUint16(26,name.length,true);
      const locU=new Uint8Array(loc); locU.set(name,30);
      chunks.push(locU, data);
      const cen=new ArrayBuffer(46+name.length); const cv=new DataView(cen);
      cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true);
      cv.setUint32(16,crc,true); cv.setUint32(20,data.length,true); cv.setUint32(24,data.length,true);
      cv.setUint16(28,name.length,true);
      cv.setUint32(42,offset,true);
      const cenU=new Uint8Array(cen); cenU.set(name,46);
      cents.push(cenU);
      offset+=locU.length+data.length;
    }
    const cdStart=offset;
    let cdLen=0; for(const c of cents){ chunks.push(c); cdLen+=c.length; offset+=c.length; }
    const end=new ArrayBuffer(22); const ev=new DataView(end);
    ev.setUint32(0,0x06054b50,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true);
    ev.setUint32(12,cdLen,true); ev.setUint32(16,cdStart,true);
    chunks.push(new Uint8Array(end));
    return new Blob(chunks,{type:'application/zip'});
  }
  async function exportOwn(){
    const recs=await allOwn();
    if(!recs.length){ toast('No photos saved on this device yet'); return; }
    const photos=[];
    const files=[];
    for(const p of recs){
      const buf=new Uint8Array(await p.blob.arrayBuffer());
      const ext=(p.mime||'').includes('jpeg')?'jpg':((p.mime||'').includes('png')?'png':'webp');
      const rel=`photos/${p.sku}/${p.id}.${ext}`;
      files.push({name:rel, data:buf});
      let b64='';
      const CHUNK=0x8000; for(let i=0;i<buf.length;i+=CHUNK) b64+=String.fromCharCode.apply(null, buf.subarray(i,i+CHUNK));
      photos.push({sku:p.sku, mime:p.mime||'image/webp', file:rel, data_b64:btoa(b64), ts:p.ts});
    }
    const manifest=JSON.stringify({version:1, app:'Easy Finder Product', exportedAt:new Date().toISOString(), photos}, null, 2);
    files.push({name:'manifest.json', data:new TextEncoder().encode(manifest)});
    files.push({name:'easy-finder-product-photos.json', data:new TextEncoder().encode(manifest)});
    const blob=zipStore(files);
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='easy-finder-product-photos.zip';
    a.click();
    toast('Export ready — share the zip to be merged into the next release');
  }

  /* ---------- Search by image ---------- */
  function imgStatus(s){ if($('imgq-status')) $('imgq-status').textContent=s||''; }
  function loadScript(src){
    return new Promise((res,rej)=>{
      const s=document.createElement('script'); s.src=src; s.onload=()=>res(); s.onerror=()=>rej(new Error('Failed to load '+src));
      document.head.appendChild(s);
    });
  }
  async function loadCatalogEmb(){
    if(catalogEmb) return catalogEmb;
    const r=await fetch(EMB_URL, {cache:'force-cache'});
    if(!r.ok) throw new Error('No embeddings file');
    const j=await r.json();
    const bin=Uint8Array.from(atob(j.embeddings_f16), c=>c.charCodeAt(0));
    const view=new DataView(bin.buffer, bin.byteOffset, bin.byteLength);
    const dim=j.dim, n=j.count, vecs=[];
    let o=0;
    for(let i=0;i<n;i++){
      const v=new Float32Array(dim);
      for(let d=0;d<dim;d++,o+=2) v[d]=view.getFloat16(o,true);
      vecs.push(v);
    }
    catalogEmb={meta:j, vecs};
    return catalogEmb;
  }
  async function loadModel(){
    if(embedder) return embedder;
    if(modelP) return modelP;
    modelP=(async()=>{
      imgStatus('Loading on-device model…');
      if(!window.tf) await loadScript('vendor/tf.min.js');
      const tf=window.tf;
      const base=await tf.loadLayersModel(MODEL_JSON);
      embedder=tf.model({inputs:base.inputs, outputs:base.getLayer('global_average_pooling2d_1').output});
      /* warmup */
      tf.tidy(()=>embedder.predict(tf.zeros([1,224,224,3])));
      return embedder;
    })();
    try{ return await modelP; }catch(e){ modelP=null; throw e; }
  }
  function cover224(img){
    const size=224, c=document.createElement('canvas');
    c.width=c.height=size;
    const ctx=c.getContext('2d');
    const w=img.width||img.naturalWidth, h=img.height||img.naturalHeight;
    const scale=Math.max(size/w, size/h);
    const nw=w*scale, nh=h*scale;
    ctx.drawImage(img, (size-nw)/2, (size-nh)/2, nw, nh);
    return c;
  }
  async function embedImage(img){
    const tf=window.tf;
    const canvas=cover224(img);
    const v=tf.tidy(()=>{
      const t=tf.browser.fromPixels(canvas).toFloat();
      const pre=t.div(127.5).sub(1).expandDims(0);
      const e=embedder.predict(pre);
      return e.squeeze().div(e.norm());
    });
    const arr=Float32Array.from(await v.data()); v.dispose();
    return arr;
  }
  function cosine(a,b){
    let s=0; const n=Math.min(a.length,b.length);
    for(let i=0;i<n;i++) s+=a[i]*b[i];
    return s;
  }
  async function ownEmbeddings(){
    const recs=await allOwn().catch(()=>[]);
    const out=[];
    if(!recs.length) return out;
    for(const p of recs){
      try{
        const url=URL.createObjectURL(p.blob);
        const img=await new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=url; });
        const v=await embedImage(img);
        URL.revokeObjectURL(url);
        out.push({sku:p.sku, v, own:true});
      }catch(e){}
    }
    return out;
  }
  async function runImageSearch(file){
    try{
      imgStatus('Preparing image search…');
      await loadModel();
      const catE=await loadCatalogEmb().catch(()=>({meta:{items:[]},vecs:[]}));
      const img=await createImageBitmap(file);
      const q=await embedImage(img);
      const ownE=await ownEmbeddings();
      const best=new Map(); /* sku -> {score, approx, typ} */
      const add=(sku,score,approx,typ)=>{
        const prev=best.get(sku);
        if(!prev || score>prev.score || (score===prev.score && prev.approx && !approx)){
          best.set(sku, {score, approx:!!approx, typ:typ||null});
        }
      };
      const approxCands=[];
      (catE.meta.items||[]).forEach((it,i)=>{
        if(!it) return;
        const score=cosine(q, catE.vecs[i]);
        if(it.k==='approx'||it.k==='approximate'){
          approxCands.push({score, typ:it.typ||'part', skus:it.skus||(it.sku?[it.sku]:[])});
          return;
        }
        if(it.sku) add(it.sku, score, false, it.typ);
      });
      ownE.forEach(o=>add(o.sku, cosine(q,o.v), false, null));
      // For each strong approx match, add up to 3 example parts (category filter applied later)
      approxCands.sort((a,b)=>b.score-a.score);
      const usedTyp=new Set();
      for(const a of approxCands.slice(0,8)){
        if(usedTyp.has(a.typ)) continue;
        usedTyp.add(a.typ);
        let n=0;
        for(const sku of a.skus){
          if(n>=3) break;
          if(!bySku[sku]) continue;
          add(sku, a.score, true, a.typ);
          n++;
        }
      }
      const ranked=[...best.entries()].sort((a,b)=>b[1].score-a[1].score).slice(0,40);
      imgHits=ranked.map(([sku,info])=>{
        const r=bySku[sku]; if(!r) return null;
        r._simApprox=!!info.approx;
        r._simTyp=info.typ||((r._imgs&&r._imgs[0]&&r._imgs[0].typ)||'');
        return {r, score:info.score};
      }).filter(Boolean);
      if(!imgHits.length){
        imgHits=null;
        imgStatus('No comparable photos on file yet. Add owner photos or wait for the next catalogue images.');
        return;
      }
      imgStatus('Showing the closest looking parts — confirm by part number. You can still use the category filter.');
      cat=''; shown=10; run();
    }catch(err){
      console.error(err);
      imgStatus('Image search could not start. Check that the model files are available, then try again.');
    }
  }
  if($('imgq-btn')) $('imgq-btn').onclick=()=>{
    if(imgHits){
      imgHits=null; imgStatus(''); $('q').value=$('q').value; run();
    }
    $('imgq-file').click();
  };
  if($('imgq-file')) $('imgq-file').onchange=ev=>{
    const f=ev.target.files&&ev.target.files[0]; ev.target.value='';
    if(f) runImageSearch(f);
  };

  /* Escape already clears search; also clear image hits */
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ imgHits=null; imgStatus(''); }
  });

  clist();
  /* first paint already happened; refresh thumbs / chips */
  draw();
})();
