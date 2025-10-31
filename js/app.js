import { i18n, vocab } from "./i18n.js";

/* ===== App-State ===== */
let uiLang = localStorage.getItem("uiLang") || "de";          // App-/UI-Sprache
let learnLang = localStorage.getItem("learnLang") || uiLang;   // Trainingssprache (Vokabel/Quiz)
let voicesCache = [];
let preferredVoices = {};
const t = (key) => i18n[uiLang]?.[key] || key;

/* ===== UI-Refs ===== */
const navEl         = document.getElementById("main-nav");
const langModal     = document.getElementById("lang-modal");
const btnLang       = document.getElementById("btn-lang");
const langClose     = document.getElementById("lang-close");
const uiLangLabelEl = document.getElementById("ui-lang-label");
const themeToggle   = document.getElementById("theme-toggle");

/* ===== Theme (Dark/Light) ===== */
(function initTheme(){
  const stored = localStorage.getItem("theme");
  if(stored){
    document.documentElement.setAttribute("data-theme", stored);
  }else if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
themeToggle?.addEventListener("click", ()=>{
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

/* ===== Routing / Navigation ===== */
function show(route){
  navEl?.querySelectorAll("a").forEach(a => {
    a.classList.toggle("active", a.dataset.screen === route);
  });
  document.querySelectorAll("[id^='screen-']").forEach(s => {
    s.hidden = !s.id.endsWith(route);
  });
}
function syncRoute(){
  const r = (location.hash.replace("#","") || "home");
  show(r);
  if(r === "currency"){ initCurrency(); }
  if(r === "vocab"){ renderVocab(); }
}
navEl?.addEventListener("click", (e)=>{
  const a = e.target.closest("a");
  if(!a) return;
  e.preventDefault();
  const target = a.getAttribute("href");
  if(target) location.hash = target;
});
window.addEventListener("hashchange", syncRoute);

/* ===== UI Language & Training Language ===== */
function updateUiLangLabel(){
  if(uiLangLabelEl){
    uiLangLabelEl.textContent = (uiLang || "de").toUpperCase();
  }
}

btnLang?.addEventListener("click", ()=>{
  if(!langModal) return;
  try { langModal.showModal(); } catch { langModal.show(); }
  document.querySelectorAll(".ui-lang-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === uiLang);
  });
});

langClose?.addEventListener("click", ()=> langModal.close());

document.querySelectorAll(".ui-lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const newLang = btn.dataset.lang;
    if(!newLang || newLang === uiLang) return;
    uiLang = newLang;
    localStorage.setItem("uiLang", uiLang);
    document.querySelectorAll(".ui-lang-btn").forEach(b =>
      b.classList.toggle("active", b.dataset.lang === uiLang)
    );
    renderTexts();
  });
});

document.querySelectorAll(".learn-lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const newLang = btn.dataset.lang;
    if(!newLang || newLang === learnLang) return;
    learnLang = newLang;
    localStorage.setItem("learnLang", learnLang);
    document.querySelectorAll(".learn-lang-btn").forEach(b =>
      b.classList.toggle("active", b.dataset.lang === learnLang)
    );
    renderVocab();
  });
});

/* ===== Vokabel-Suche ===== */
const vocabSearchInput = document.getElementById("vocab-search");
if(vocabSearchInput){
  vocabSearchInput.addEventListener("input", () => renderVocab());
}

/* ===== Quiz-Größe ===== */
let quizSize = 5;
const quizSizeSelect = document.getElementById("quiz-size");
if(quizSizeSelect){
  // initial aus aktuellem Select übernehmen
  (function(){
    const val = quizSizeSelect.value;
    quizSize = (val === "all") ? vocab.length : parseInt(val, 10) || 5;
  })();
  quizSizeSelect.addEventListener("change", () => {
    const val = quizSizeSelect.value;
    quizSize = (val === "all") ? vocab.length : parseInt(val, 10) || 5;
  });
}

/* ===== Texte & Vokabeln ===== */
function renderTexts(){
  // alle data-i18n Elemente übersetzen
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
  // Placeholder der Vokabelsuche
  const searchEl = document.getElementById("vocab-search");
  if(searchEl){ searchEl.setAttribute("placeholder", t("vocab_search_placeholder")); }
  // "Alle" im Quiz-Select
  const quizAllOption = document.querySelector("#quiz-size option[value='all']");
  if(quizAllOption){ quizAllOption.textContent = t("quiz_all"); }
  // Labels & Buttons hervorheben
  updateUiLangLabel();
  document.querySelectorAll(".ui-lang-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.lang === uiLang)
  );
  document.querySelectorAll(".learn-lang-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.lang === learnLang)
  );
  // Inhalte, die Daten brauchen
  renderVocab();
}

function voiceLangFromLearnLang(lang){
  switch(lang){
    case "de": return "de-CH";
    case "fr": return "fr-CH";
    case "it": return "it-CH";
    case "en": return "en-GB";
    default: return "de-CH";
  }
}

function renderVocab(){
  const list = document.getElementById("vocab-list");
  if(!list) return;
  list.innerHTML = "";

  const searchEl = document.getElementById("vocab-search");
  const filter = (searchEl?.value || "").trim().toLowerCase();

  const leftKey = learnLang || "de";
  const sayKey  = leftKey + "Say";

  vocab.forEach(item => {
    const leftWord  = item[leftKey];
    const rightWord = item.th;
    if(filter && !(leftWord.toLowerCase().includes(filter) || rightWord.toLowerCase().includes(filter))){
      return;
    }
    const sayText = item[sayKey] || leftWord;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong style="font-size:18px">${leftWord}</strong>
      <div class="muted">${rightWord}</div>
      <button class="speak-btn" style="margin-top:8px"
              data-say="${encodeURIComponent(sayText)}"
              data-saylang="${leftKey}">▶︎</button>`;
    list.appendChild(card);

    card.addEventListener("pointerdown", () => card.style.transform = "translateY(0) scale(.995)");
    card.addEventListener("pointerup",   () => card.style.transform = "");
    card.addEventListener("pointerleave",() => card.style.transform = "");
  });

  list.querySelectorAll(".speak-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = decodeURIComponent(btn.dataset.say);
      const lang = btn.dataset.saylang;
      speak(text, voiceLangFromLearnLang(lang));
    });
  });
}

/* ===== TTS – Stimmenwahl ===== */
function loadVoices(){
  voicesCache = window.speechSynthesis?.getVoices() || [];
  const rank = (tag, want) => {
    if(!tag) return 0;
    const t = tag.toLowerCase(), w = want.toLowerCase();
    if(t === w) return 100;
    if(t.startsWith(w.split("-")[0])) return 60;
    return 10;
  };
  ["de-CH","fr-CH","it-CH","en-GB","de-DE","fr-FR","it-IT","en-US","th-TH"].forEach(want=>{
    const best = voicesCache
      .map(v => ({ v, score: rank(v.lang, want) }))
      .sort((a,b)=>b.score - a.score)[0];
    if(best && best.score >= 60){
      preferredVoices[want] = best.v;
    }
  });
}
window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);

function speak(text, langTag){
  if(!("speechSynthesis" in window)) return;
  if(!voicesCache.length) loadVoices();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = langTag;

  const candidates = [
    langTag,
    langTag.split("-")[0],
    (langTag.startsWith("de") ? "de-DE" :
     langTag.startsWith("fr") ? "fr-FR" :
     langTag.startsWith("it") ? "it-IT" :
     langTag.startsWith("en") ? "en-GB" : "th-TH")
  ];

  for(const c of candidates){
    const tryVoice =
      preferredVoices[c] ||
      voicesCache.find(v => v.lang && v.lang.toLowerCase() === c.toLowerCase()) ||
      voicesCache.find(v => v.lang && v.lang.toLowerCase().startsWith(c.split("-")[0].toLowerCase()));
    if(tryVoice){ u.voice = tryVoice; break; }
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/* ===== Quiz (Region ↔ TH) ===== */
let quizItems = [];
let quizIndex = 0;
let quizScore = 0;
let currentOptionNodes = [];

function shuffle(arr){
  return [...arr].sort(() => Math.random() - 0.5);
}
function sample(arr, n){
  return shuffle(arr).slice(0, n);
}
function buildQuizSet(){
  const pool = shuffle(vocab).slice(0, Math.min(quizSize, vocab.length));
  return pool.map(item => {
    const askWord  = item[learnLang] || item.de;
    const correct  = item.th;
    const distractPool = vocab.filter(v => v !== item).map(v => v.th);
    const distractors  = sample(distractPool, 3);
    const options = shuffle([correct, ...distractors]);
    return { askWord, correct, options };
  });
}

/* Quiz-UI */
const elStart  = document.getElementById("quiz-start");
const elArea   = document.getElementById("quiz-area");
const elResult = document.getElementById("quiz-result");
const elStatus = document.getElementById("quiz-status");
const elQ      = document.getElementById("quiz-question");
const elOpts   = document.getElementById("quiz-options");
const btnStart = document.getElementById("btn-start-quiz");
const btnNext  = document.getElementById("btn-next");
const btnRetry = document.getElementById("btn-retry");
const elScore  = document.getElementById("quiz-score");

function startQuiz(){
  quizItems = buildQuizSet();
  quizIndex = 0;
  quizScore = 0;
  elStart.hidden  = true;
  elResult.hidden = true;
  elArea.hidden   = false;
  btnNext.disabled = true;
  renderQuestion();
}
function renderQuestion(){
  const q = quizItems[quizIndex];
  elStatus.textContent = `${quizIndex + 1} / ${quizItems.length}`;
  elQ.textContent = q.askWord;
  
elOpts.innerHTML = "";
currentOptionNodes = [];
q.options.forEach(opt => {
  const div = document.createElement("div");
  div.className = "quiz-option";
  div.setAttribute("data-val", opt);
  div.innerHTML = `<span class="txt">${opt}</span><span class="quiz-badge" aria-hidden="true"></span>`;
  div.onclick = () => selectAnswer(div, opt, q.correct);
  elOpts.appendChild(div);
  currentOptionNodes.push(div);
});

}


function selectAnswer(el, chosen, correct){
  const children = [...elOpts.children];
  children.forEach(c => c.onclick = null);

  const setBadge = (node, symbol) => {
    const b = node?.querySelector(".quiz-badge");
    if(b) b.textContent = symbol || "";
  };

  const correctNode = currentOptionNodes.find(n => n.getAttribute("data-val") === String(correct));
  const chosenNode  = el;

  if(String(chosen) === String(correct)){
    chosenNode?.classList.add("correct");
    setBadge(chosenNode, "✅");
    quizScore += 1;
  }else{
    chosenNode?.classList.add("wrong");
    setBadge(chosenNode, "❌");
    correctNode?.classList.add("correct");
    setBadge(correctNode, "✅");
  }
  btnNext.disabled = false;
  btnNext.scrollIntoView({behavior:"smooth", block:"center"});
}


btnNext?.addEventListener("click", () => {
  quizIndex += 1;
  btnNext.disabled = true;
  if(quizIndex >= quizItems.length){
    elArea.hidden = true;
    elResult.hidden = false;
    elScore.textContent = (uiLang === "de")
      ? `Du hast ${quizScore} von ${quizItems.length} richtig.`
      : `คุณตอบถูก ${quizScore} จาก ${quizItems.length} ข้อ`;
    elStart.hidden = false;
  }else{
    renderQuestion();
  }
});
btnStart?.addEventListener("click", startQuiz);
btnRetry?.addEventListener("click", startQuiz);

// zusätzliche Sicherheit: falls der Button beim ersten Durchlauf noch nicht im DOM war
window.addEventListener("click", (e)=>{
  const b = e.target.closest("#btn-start-quiz");
  if(b){ startQuiz(); }
});

/* ===== Service Worker – in Dev aus, in Prod ohne Query registrieren ===== */
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
if ("serviceWorker" in navigator) {
  if (!isLocalhost) {
    window.addEventListener("load", ()=> navigator.serviceWorker.register("sw.js"));
  } else {
    // in Dev SW sicherheitshalber deregistrieren
    navigator.serviceWorker.getRegistrations?.().then(rs => rs.forEach(r => r.unregister()));
  }
}

/* ===== Währungsrechner ===== */
const CURRENCY_API_BASE = "https://open.er-api.com/v6/latest/"; // öffentlicher Demo-Endpunkt
const currencyRates = {}; // { baseLower: { rates: {...}, nextUpdate: ts } }

async function getRates(base){
  const key = base.toLowerCase();
  const cache = currencyRates[key];
  const now = Date.now();
  if(cache && cache.nextUpdate && now < cache.nextUpdate){
    return cache.rates;
  }
  try{
    const resp = await fetch(`${CURRENCY_API_BASE}${key.toUpperCase()}`);
    const data = await resp.json();
    const rawRates = data?.rates || {};
    const rates = {};
    Object.entries(rawRates).forEach(([k, v]) => { rates[k.toUpperCase()] = v; });
    currencyRates[key] = { rates, nextUpdate: now + 12*60*60*1000 };
    return rates;
  }catch(e){
    console.error("Currency API error", e);
    if(cache) return cache.rates;
    throw e;
  }
}

function initCurrency(){
  const amountInput = document.getElementById("currency-amount");
  const fromSel     = document.getElementById("currency-from");
  const toSel       = document.getElementById("currency-to");
  const resultEl    = document.getElementById("currency-result");
  const swapBtn     = document.getElementById("btn-swap-currency");
  if(!amountInput || !fromSel || !toSel || !resultEl || !swapBtn) return;

  function parseAmount(v){
    // Komma -> Punkt, nur Ziffern & Punkt behalten
    const norm = (v || "").toString().replace(",", ".").replace(/[^0-9.]/g, "");
    const n = parseFloat(norm);
    return isNaN(n) ? 0 : n;
  }

  async function convert(){
    const amt = parseAmount(amountInput.value);
    const from = (fromSel.value || "CHF").toUpperCase();
    const to   = (toSel.value || "THB").toUpperCase();
    if(!amt){ resultEl.textContent = "–"; return; }

    try{
      const rates = await getRates(from);
      const rate  = rates[to];
      if(rate){
        const out = amt * rate;
        resultEl.textContent = out.toFixed(2) + " " + to;
      }else{
        resultEl.textContent = "–";
      }
    }catch{
      resultEl.textContent = (uiLang === "de"
        ? "Fehler beim Laden der Kurse"
        : "เกิดข้อผิดพลาดในการโหลดอัตราแลกเปลี่ยน");
    }
  }

  amountInput.addEventListener("input", convert);
  fromSel.addEventListener("change", convert);
  toSel.addEventListener("change", convert);

  swapBtn.addEventListener("click", () => {
    const tmp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = tmp;
    convert();
  });

  convert(); // initial, falls schon ein Wert steht
}

/* ===== App-Init NACH DOM-Load ===== */
function init(){
  updateUiLangLabel();
  renderTexts();
  syncRoute();
}
window.addEventListener("DOMContentLoaded", init);
