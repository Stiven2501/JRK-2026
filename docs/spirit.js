
document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.getElementById('toggleTheme');
  const username = document.getElementById('username');
  const saveProfile = document.getElementById('saveProfile');
  const form = document.getElementById('journalForm');
  const dateInput = document.getElementById('journalDate');
  const saveBtn = document.getElementById('saveBtn');
  const downloadPdf = document.getElementById('downloadPdf');
  const autofillAyat = document.getElementById('autofillAyat');
  const autofillRenungan = document.getElementById('autofillRenungan');

  // theme toggle
  toggle.addEventListener('click', function(){
    if(document.body.classList.toggle('dark')){
      document.body.style.background = '#111';
      document.body.style.color = '#ddd';
    } else {
      document.body.style.background = '';
      document.body.style.color = '';
    }
  });

  // sample ayat list
  const sampleAyat = [
    {ref: "Mazmur 23:1", text: "Tuhan adalah gembalaku, takkan kekurangan aku."},
    {ref: "Filipi 4:6", text: "Janganlah hendaknya kamu khawatir tentang apa pun juga..."},
    {ref: "Yeremia 29:11", text: "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku tentang kamu..."},
    {ref: "Matius 6:33", text: "Tetapi carilah dahulu Kerajaan Allah..."}
  ];

  autofillAyat.addEventListener('click', function(){
    const pick = sampleAyat[new Date(dateInput.value || Date()).getDate() % sampleAyat.length];
    document.getElementById('ayat_ref').value = pick.ref;
    document.getElementById('ayat_text').value = pick.text;
  });

  autofillRenungan.addEventListener('click', function(){
    const day = dateInput.value || new Date().toLocaleDateString();
    document.getElementById('penjelasan').value = "Renungan singkat untuk " + day + ": Biarlah hati tetap tenang dan menerima dorongan Roh.";
  });

  // local per-date save/load
  function storageKey(d){
    return 'jrk_' + d;
  }
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
      if(els && els[0]){
        els[0].value = data[k];
      }
    }
  }
  // date navigation
  function setDateToToday(){
    const today = new Date().toISOString().slice(0,10);
    dateInput.value = today;
  }
  document.getElementById('prevDay').addEventListener('click', function(){
    const d = new Date(dateInput.value);
    d.setDate(d.getDate()-1);
    dateInput.value = d.toISOString().slice(0,10);
    loadForDate(dateInput.value);
  });
  document.getElementById('nextDay').addEventListener('click', function(){
    const d = new Date(dateInput.value);
    d.setDate(d.getDate()+1);
    dateInput.value = d.toISOString().slice(0,10);
    loadForDate(dateInput.value);
  });

  saveBtn.addEventListener('click', saveForDate);
  document.getElementById('saveProfile').addEventListener('click', function(){
    if(username.value.trim()) localStorage.setItem('jrk_user', username.value.trim());
    alert('Profil disimpan (lokal).');
  });

  // download via print
  downloadPdf.addEventListener('click', function(){
    window.print();
  });

  // load on start
  const savedUser = localStorage.getItem('jrk_user');
  if(savedUser) username.value = savedUser;
  setDateToToday();
  loadForDate(dateInput.value);
});
