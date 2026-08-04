/* ==========================================================================
   Кыз узатуу · Аяна — логика приглашения
   ========================================================================== */

/* --------------------------------------------------------------------------
   RSVP: сюда вставьте URL вашего Google Apps Script Web App
   (инструкция — в README.md). Пока пусто — форма работает в демо-режиме.
   -------------------------------------------------------------------------- */
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbySJTpe3pPjO0I-qMtN-N9ODGvuLk9EItP6M5LBqva-eftO5J22py6alYqYm5aKFQc6kQ/exec";

/* Дата и время события (Бишкек, UTC+6) */
const EVENT_DATE = new Date("2026-08-26T16:00:00+06:00");

/* --------------------------------------------------------------------------
   Переводы
   -------------------------------------------------------------------------- */
const I18N = {
  kg: {
    "uzatuu.word": "кыз узатуу",
    "envelope.hint": "ачуу үчүн басыңыз",
    "hero.invite": "Кызыбызды узатуу тоюна чакырабыз",
    "hero.name": "Аяна",
    "hero.date": "шаршемби · 26 август, 2026",
    "hero.tagline": "Кызыбыздын бактысына ак батаңызды бериңиз",
    "cd.days": "күн", "cd.hours": "саат", "cd.mins": "мүнөт", "cd.secs": "секунд",
    "where.title": "КАЙДА ЖАНА КАЧАН",
    "where.venue": "«Arna» той залы",
    "where.address": "Курманжан Датка көчөсү, 152, Бишкек",
    "where.time": "той 16:00дө башталат",
    "where.btn2gis": "2ГИСтен ачуу",
    "where.btnmaps": "Google Maps",
    "rsvp.title": "ЫРАСТОО",
    "rsvp.question": "Тойго келе аласызбы?",
    "rsvp.note": "Столдорду так эсептеш үчүн 12-августка чейин билдирип коюңуз.",
    "rsvp.name": "Атыңыз",
    "rsvp.namePh": "Аты-жөнүңүз",
    "rsvp.guests": "Конок саны",
    "rsvp.submit": "Ырастоо",
    "rsvp.success": "Рахмат! Жообуңуз кабыл алынды.",
    "closing.text": "Ушул кубанычтуу күндү биз менен бирге тосууга чакырабыз.",
    "closing.sign": "Чын жүрөктөн, ата-энеси",
    "closing.name": "Аяна · 26.08.2026",
    "err.name": "Атыңызды жазыңыз",
    "err.guests": "Конок санын туура жазыңыз",
    "err.send": "Жөнөтүүдө ката кетти. Кайра аракет кылыңыз.",
  },
  ru: {
    "uzatuu.word": "кыз узатуу",
    "envelope.hint": "нажмите, чтобы открыть",
    "hero.invite": "Приглашаем вас на кыз узатуу нашей дочери",
    "hero.name": "Аяна",
    "hero.date": "среда · 26 августа 2026",
    "hero.tagline": "Подарите нашей дочери своё тёплое благословение",
    "cd.days": "дней", "cd.hours": "часов", "cd.mins": "минут", "cd.secs": "секунд",
    "where.title": "ГДЕ И КОГДА",
    "where.venue": "Ресторан «Arna»",
    "where.address": "улица Курманжан Датка, 152, Бишкек",
    "where.time": "начало в 16:00",
    "where.btn2gis": "Открыть в 2ГИС",
    "where.btnmaps": "Google Maps",
    "rsvp.title": "ПОДТВЕРЖДЕНИЕ",
    "rsvp.question": "Придёте на праздник?",
    "rsvp.note": "Пожалуйста, сообщите до 12 августа — чтобы мы точно рассчитали места.",
    "rsvp.name": "Ваше имя",
    "rsvp.namePh": "Имя и фамилия",
    "rsvp.guests": "Количество гостей",
    "rsvp.submit": "Подтвердить",
    "rsvp.success": "Спасибо! Ваш ответ принят.",
    "closing.text": "Будем счастливы разделить с вами этот радостный день.",
    "closing.sign": "С любовью, родители",
    "closing.name": "Аяна · 26.08.2026",
    "err.name": "Пожалуйста, укажите имя",
    "err.guests": "Укажите корректное количество гостей",
    "err.send": "Не удалось отправить. Попробуйте ещё раз.",
  },
  en: {
    "uzatuu.word": "kyz uzatuu",
    "envelope.hint": "tap to open",
    "hero.invite": "We invite you to our daughter's send-off — Kyz Uzatuu",
    "hero.name": "Aiana",
    "hero.date": "Wednesday · August 26, 2026",
    "hero.tagline": "Share your warm blessing for our daughter's happiness",
    "cd.days": "days", "cd.hours": "hours", "cd.mins": "minutes", "cd.secs": "seconds",
    "where.title": "WHERE & WHEN",
    "where.venue": "Arna Restaurant",
    "where.address": "152 Kurmanjan Datka St, Bishkek",
    "where.time": "starts at 16:00",
    "where.btn2gis": "Open in 2GIS",
    "where.btnmaps": "Google Maps",
    "rsvp.title": "RSVP",
    "rsvp.question": "Will you join us?",
    "rsvp.note": "Please let us know by August 12 so we can plan the seating.",
    "rsvp.name": "Your name",
    "rsvp.namePh": "Full name",
    "rsvp.guests": "Number of guests",
    "rsvp.submit": "Confirm",
    "rsvp.success": "Thank you! Your response has been received.",
    "closing.text": "We would be delighted to share this joyful day with you.",
    "closing.sign": "With love, the parents",
    "closing.name": "Aiana · 26.08.2026",
    "err.name": "Please enter your name",
    "err.guests": "Please enter a valid number of guests",
    "err.send": "Could not send. Please try again.",
  },
};

let currentLang = "ru";

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || key;
}

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
}

/* --------------------------------------------------------------------------
   Экраны: язык → конверт → приглашение
   -------------------------------------------------------------------------- */
const langScreen = document.getElementById("lang-screen");
const envScreen = document.getElementById("envelope-screen");
const envelope = document.getElementById("envelope");
const main = document.getElementById("main");

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyLang(btn.getAttribute("data-lang"));
    langScreen.style.transition = "opacity .5s ease";
    langScreen.style.opacity = "0";
    setTimeout(() => {
      langScreen.classList.add("hidden");
      envScreen.classList.remove("hidden");
    }, 500);
  });
});

let opened = false;
envelope.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  envelope.classList.add("open");
  setTimeout(() => {
    envScreen.style.transition = "opacity .7s ease";
    envScreen.style.opacity = "0";
    setTimeout(() => {
      envScreen.classList.add("hidden");
      main.classList.remove("hidden");
      initReveals();
      revealHero();
      window.scrollTo(0, 0);
    }, 700);
  }, 1500);
});

/* --------------------------------------------------------------------------
   Обратный отсчёт
   -------------------------------------------------------------------------- */
const cd = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  mins: document.getElementById("cd-mins"),
  secs: document.getElementById("cd-secs"),
};
function pad(n) { return String(n).padStart(2, "0"); }
function tickCountdown() {
  let diff = Math.floor((EVENT_DATE.getTime() - Date.now()) / 1000);
  if (diff < 0) diff = 0;
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  cd.days.textContent = pad(d);
  cd.hours.textContent = pad(h);
  cd.mins.textContent = pad(m);
  cd.secs.textContent = pad(s);
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* --------------------------------------------------------------------------
   Появление секций при прокрутке
   -------------------------------------------------------------------------- */
let io;
function initReveals() {
  if (io) return;
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}
function revealHero() {
  const hero = document.querySelector(".hero-content");
  if (hero) setTimeout(() => hero.classList.add("in"), 100);
}

/* --------------------------------------------------------------------------
   Падающие лепестки
   -------------------------------------------------------------------------- */
(function makePetals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.getElementById("petals");
  const colors = [
    ["#f6ddd6", "#e6b7ad"],
    ["#efd0c8", "#d59a92"],
    ["#fbeae4", "#f0cfc6"],
  ];
  const COUNT = window.innerWidth < 600 ? 12 : 20;
  for (let i = 0; i < COUNT; i++) {
    const wrap = document.createElement("div");
    wrap.className = "petal-wrap";
    const petal = document.createElement("div");
    petal.className = "petal";

    const left = Math.round((i / COUNT) * 100 + (i * 37) % 9);
    const size = 9 + ((i * 13) % 9);
    const fallDur = 9 + ((i * 7) % 9);
    const swayDur = 2.6 + ((i * 5) % 4) * 0.4;
    const delay = -((i * 17) % 12);
    const c = colors[i % colors.length];

    wrap.style.left = left + "%";
    wrap.style.animation = `petal-fall ${fallDur}s linear ${delay}s infinite`;
    petal.style.setProperty("--sz", size + "px");
    petal.style.setProperty("--pc1", c[0]);
    petal.style.setProperty("--pc2", c[1]);
    petal.style.animation = `petal-sway ${swayDur}s ease-in-out ${delay}s infinite alternate`;

    wrap.appendChild(petal);
    layer.appendChild(wrap);
  }
})();

/* --------------------------------------------------------------------------
   Форма RSVP → Google Sheet
   -------------------------------------------------------------------------- */
const form = document.getElementById("rsvp-form");
const msg = document.getElementById("form-msg");
const successBox = document.getElementById("rsvp-success");
const submitBtn = document.getElementById("rsvp-submit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  msg.classList.remove("error");

  const name = form.name.value.trim();
  const guests = parseInt(form.guests.value, 10);

  if (!name) {
    msg.textContent = t("err.name");
    msg.classList.add("error");
    form.name.focus();
    return;
  }
  if (!guests || guests < 1) {
    msg.textContent = t("err.guests");
    msg.classList.add("error");
    form.guests.focus();
    return;
  }

  submitBtn.disabled = true;
  const original = submitBtn.textContent;
  submitBtn.textContent = "…";

  try {
    if (RSVP_ENDPOINT) {
      const body = new URLSearchParams({
        name: name,
        guests: String(guests),
        lang: currentLang,
      });
      await fetch(RSVP_ENDPOINT, { method: "POST", mode: "no-cors", body });
    } else {
      // демо-режим: endpoint ещё не настроен
      console.warn("RSVP_ENDPOINT не задан — ответ не сохранён (демо-режим).");
      await new Promise((r) => setTimeout(r, 600));
    }
    form.classList.add("hidden");
    successBox.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    msg.textContent = t("err.send");
    msg.classList.add("error");
    submitBtn.disabled = false;
    submitBtn.textContent = original;
  }
});

/* стартовый язык по умолчанию */
applyLang("ru");
