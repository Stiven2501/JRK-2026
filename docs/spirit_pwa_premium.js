// Enhanced spirit.js for PWA Premium
document.addEventListener('DOMContentLoaded', async function(){
  // register service worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered');
    } catch(e){ console.warn('SW register failed', e); }
  }

  // load offline ayat DB
  async function loadAyatDB(){
    try{
      const resp = await fetch('/offline_ayat.json');
      const data = await resp.json();
      return data;
    }catch(e){
      return [];
    }
  }

  const ayatDB = await loadAyatDB();

  // helper to pick ayat by date
  function ayatForDate(d){
    if(!d) d = new Date();
    const dayOfYear = Math.floor((new Date(d) - new Date(d.getFullYear(),0,0))/86400000);
    return ayatDB[(dayOfYear % ayatDB.length)];
  }

  // auto-fill ayat button
  const autofillAyat = document.getElementById('autofillAyat');
  if(autofillAyat){
    autofillAyat.addEventListener('click', function(){
      const pick = ayatForDate(document.getElementById('journalDate').value || new Date());
      document.getElementById('ayat_ref').value = pick.ref;
      document.getElementById('ayat_text').value = pick.text;
    });
  }

  // show splash on load (basic)
  const splash = document.createElement('div');
  splash.style.position='fixed';splash.style.left=0;splash.style.top=0;
  splash.style.width='100%';splash.style.height='100%';
  splash.style.background='linear-gradient(180deg,#fff7ef, #e6c77a)';
  splash.style.display='flex';splash.style.alignItems='center';splash.style.justifyContent='center';
  splash.style.zIndex=9999;
  splash.innerHTML = '<div style="text-align:center"><img src="/splash.png" style="max-width:60%;height:auto;border-radius:12px"/><div style="margin-top:12px;font-family: Georgia, serif;font-size:18px;color:#3b2d1c">JURNAL ROH KUDUS — ULTRA PREMIUM</div></div>';
  document.body.appendChild(splash);
  setTimeout(()=>{ splash.style.transition='opacity 0.6s'; splash.style.opacity=0; setTimeout(()=>splash.remove(),700); },1400);

  // rest of existing spirit behavior: save/load per date
  const form = document.getElementById('journalForm');
  const dateInput = document.getElementById('journalDate');
  function storageKey(d){ return 'jrk_' + d; }
  function saveForDate(){
    const d = dateInput.value || new Date().toISOString().slice(0,10);
    const data = {};
    new FormData(form).forEach((v,k)=>data[k]=v);
    localStorage.setItem(storageKey(d), JSON.stringify(data));
    alert('Tersimpan untuk tanggal ' + d);
  }
  function loadForDate(d){
    const raw = localStorage.getItem(storageKey(d));
    if(!raw) return;
    const data = JSON.parse(raw);
    for(const k in data){
      const els = document.getElementsByName(k);
      if(els && els[0]) els[0].value = data[k];
    }
  }
  document.getElementById('saveBtn').addEventListener('click', saveForDate);

  // load on start
  const today = new Date().toISOString().slice(0,10);
  if(document.getElementById('journalDate')) document.getElementById('journalDate').value = today;
  loadForDate(today);
});
