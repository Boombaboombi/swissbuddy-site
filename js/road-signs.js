import { roadSigns, roadSignCategories } from './road-signs-data.js';

const uiTexts = {
  de: {
    title: 'Schweizer Verkehrstafeln',
    intro: 'Thai-Lernhilfe für wichtige Schweizer Signale, Markierungen und Zusatztafeln. Besonders nützlich für Kontrollfahrt und privates Üben.',
    search: 'Suchen: Stop, Kreisel, Parkieren, ทางม้าลาย ...',
    all: 'Alle Kategorien',
    important: 'Nur sehr wichtige anzeigen',
    disclaimer: 'Lernhilfe: Rechtlich verbindlich sind die offiziellen Schweizer Verkehrsregeln und Signale.',
    quiz: 'Mini-Quiz starten',
    showAll: 'Alle anzeigen',
    source: 'Quelle: ASTRA / Schweizer Signalisationsverordnung'
  },
  th: {
    title: 'ป้ายจราจรในสวิตเซอร์แลนด์',
    intro: 'ตัวช่วยเรียนภาษาไทยสำหรับป้ายจราจร เครื่องหมายบนถนน และป้ายเสริมที่สำคัญในสวิตเซอร์แลนด์ เหมาะสำหรับการเตรียม Kontrollfahrt',
    search: 'ค้นหา: Stop, Kreisel, Parkieren, ทางม้าลาย ...',
    all: 'ทุกหมวดหมู่',
    important: 'แสดงเฉพาะป้ายสำคัญมาก',
    disclaimer: 'นี่เป็นเพียงตัวช่วยเรียน กฎและป้ายจราจรของสวิตเซอร์แลนด์ฉบับทางการเป็นสิ่งที่มีผลทางกฎหมาย',
    quiz: 'เริ่มมินิควิซ',
    showAll: 'แสดงทั้งหมด',
    source: 'แหล่งที่มา: ASTRA / กฎหมายป้ายจราจรสวิตเซอร์แลนด์'
  },
  en: {
    title: 'Swiss Road Signs',
    intro: 'Thai learning aid for important Swiss traffic signs, markings and supplementary plates.',
    search: 'Search: Stop, roundabout, parking, ทางม้าลาย ...',
    all: 'All categories',
    important: 'Show very important only',
    disclaimer: 'Learning aid: Swiss official traffic rules and signs remain legally binding.',
    quiz: 'Start mini quiz',
    showAll: 'Show all',
    source: 'Source: ASTRA / Swiss Signalling Ordinance'
  },
  fr: {
    title: 'Signaux routiers suisses',
    intro: 'Aide en thaï pour apprendre les principaux signaux suisses.',
    search: 'Rechercher: Stop, giratoire, stationnement ...',
    all: 'Toutes les catégories',
    important: 'Afficher seulement les plus importants',
    disclaimer: 'Aide privée: les règles et signaux officiels suisses font foi.',
    quiz: 'Démarrer le mini quiz',
    showAll: 'Tout afficher',
    source: 'Source: OFROU / Ordonnance suisse sur la signalisation'
  },
  it: {
    title: 'Segnali stradali svizzeri',
    intro: 'Aiuto in thailandese per imparare i principali segnali svizzeri.',
    search: 'Cerca: Stop, rotonda, parcheggio ...',
    all: 'Tutte le categorie',
    important: 'Mostra solo molto importanti',
    disclaimer: 'Aiuto privato: fanno fede le regole e i segnali ufficiali svizzeri.',
    quiz: 'Avvia mini quiz',
    showAll: 'Mostra tutto',
    source: 'Fonte: USTRA / Ordinanza svizzera sulla segnaletica'
  }
};

function getUiLang(){
  return (localStorage.getItem('uiLang') || document.documentElement.lang || 'de').toLowerCase();
}
function tx(key){
  const lang = getUiLang();
  return uiTexts[lang]?.[key] || uiTexts.de[key] || key;
}
function catName(cat){
  const lang = getUiLang();
  return roadSignCategories[cat]?.[lang] || roadSignCategories[cat]?.de || cat;
}
function escapeHtml(s){
  return String(s || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}

function card(sign){
  const very = sign.importance === 'very_high' ? '<span class="road-badge">Top</span>' : '';
  return `
    <article class="road-card" data-category="${escapeHtml(sign.category)}" data-importance="${escapeHtml(sign.importance)}">
      <div class="road-img-wrap"><img src="${escapeHtml(sign.image)}" alt="${escapeHtml(sign.id + ' ' + sign.de)}" loading="lazy"></div>
      <div class="road-content">
        <div class="road-meta"><span>${escapeHtml(sign.id)}</span><span>${escapeHtml(catName(sign.category))}</span>${very}</div>
        <h3>${escapeHtml(sign.de)}</h3>
        <h4 lang="th">${escapeHtml(sign.th)}</h4>
        <p>${escapeHtml(sign.simpleDe)}</p>
        <p lang="th">${escapeHtml(sign.simpleTh)}</p>
      </div>
    </article>`;
}

function renderRoadSigns(){
  const root = document.getElementById('road-signs-root');
  if(!root) return;
  const lang = getUiLang();
  const categories = [...new Set(roadSigns.map(s => s.category))];
  root.innerHTML = `
    <div class="road-hero">
      <div>
        <h2>${escapeHtml(tx('title'))}</h2>
        <p>${escapeHtml(tx('intro'))}</p>
      </div>
      <button id="road-quiz-btn" type="button">${escapeHtml(tx('quiz'))}</button>
    </div>
    <div class="road-controls">
      <input id="road-search" type="search" placeholder="${escapeHtml(tx('search'))}">
      <select id="road-category"><option value="">${escapeHtml(tx('all'))}</option>${categories.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(catName(c))}</option>`).join('')}</select>
      <label class="road-check"><input id="road-important" type="checkbox"> ${escapeHtml(tx('important'))}</label>
    </div>
    <div id="road-quiz" class="road-quiz" hidden></div>
    <div id="road-list" class="road-grid"></div>
    <p class="road-disclaimer">${escapeHtml(tx('disclaimer'))}<br>${escapeHtml(tx('source'))}</p>
  `;
  const list = root.querySelector('#road-list');
  const search = root.querySelector('#road-search');
  const category = root.querySelector('#road-category');
  const important = root.querySelector('#road-important');

  function apply(){
    const q = (search.value || '').toLowerCase().trim();
    const cat = category.value;
    const onlyTop = important.checked;
    const filtered = roadSigns.filter(s => {
      const hay = `${s.id} ${s.de} ${s.th} ${s.simpleDe} ${s.simpleTh} ${catName(s.category)}`.toLowerCase();
      return (!q || hay.includes(q)) && (!cat || s.category === cat) && (!onlyTop || s.importance === 'very_high');
    });
    list.innerHTML = filtered.map(card).join('');
  }
  search.addEventListener('input', apply);
  category.addEventListener('change', apply);
  important.addEventListener('change', apply);
  apply();

  root.querySelector('#road-quiz-btn')?.addEventListener('click', () => startRoadQuiz(root));
}

function startRoadQuiz(root){
  const quiz = root.querySelector('#road-quiz');
  if(!quiz) return;
  const pool = roadSigns.filter(s => s.importance === 'very_high');
  const q = pool[Math.floor(Math.random()*pool.length)];
  const options = [q, ...pool.filter(s => s.id !== q.id).sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
  quiz.hidden = false;
  quiz.innerHTML = `
    <div class="road-quiz-box">
      <p><strong>Quiz:</strong> Was bedeutet dieses Signal?</p>
      <img src="${escapeHtml(q.image)}" alt="Quiz signal">
      <div class="road-quiz-options">
        ${options.map(o=>`<button type="button" data-answer="${escapeHtml(o.id)}">${escapeHtml(o.th)}</button>`).join('')}
      </div>
      <p id="road-quiz-feedback" class="road-feedback"></p>
    </div>`;
  quiz.querySelectorAll('button[data-answer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ok = btn.dataset.answer === q.id;
      quiz.querySelector('#road-quiz-feedback').textContent = ok ? `✅ ${q.de} – ${q.simpleTh}` : `❌ Richtige Antwort: ${q.th} (${q.de})`;
      quiz.querySelectorAll('button[data-answer]').forEach(b => b.disabled = true);
    });
  });
}

window.addEventListener('DOMContentLoaded', renderRoadSigns);
window.addEventListener('storage', renderRoadSigns);
window.renderRoadSigns = renderRoadSigns;
window.addEventListener('hashchange', () => {
  if(location.hash === '#roadsigns') renderRoadSigns();
});

document.addEventListener('click', (e) => {
  if(e.target.closest('.ui-lang-btn')) setTimeout(renderRoadSigns, 0);
});
