import { burgerSVG, friesSVG, shakeSVG, cupSVG, STACKS } from "./art.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- 1. Paint the artwork ---------- */
$$("[data-art]").forEach((el) => {
  const kind = el.dataset.art;
  if (kind === "hero" || kind === "anatomy") el.innerHTML = burgerSVG(STACKS.double);
  else if (STACKS[kind]) el.innerHTML = burgerSVG(STACKS[kind]);
  else if (kind === "fries") el.innerHTML = friesSVG();
  else if (kind === "shake") el.innerHTML = shakeSVG();
  else if (kind === "cup") el.innerHTML = cupSVG(el.dataset);
});

/* ---------- 2. Split hero headline into characters ---------- */
$$(".hero__title .split").forEach((line, li) => {
  const text = line.textContent;
  line.setAttribute("aria-label", text);
  line.innerHTML = [...text]
    .map((c, ci) => `<span class="char" aria-hidden="true" style="--ci:${ci};--li:${li}">${c === " " ? "&nbsp;" : c}</span>`)
    .join("");
});

/* ---------- 3. Floating embers ---------- */
const embers = $(".hero__embers");
if (embers && !reduceMotion) {
  for (let i = 0; i < 26; i++) {
    const e = document.createElement("span");
    e.className = "ember";
    e.style.cssText = `left:${Math.random() * 100}%;--s:${2 + Math.random() * 5}px;--t:${6 + Math.random() * 8}s;--d:${-Math.random() * 12}s;--x:${(Math.random() - 0.5) * 200}px`;
    embers.appendChild(e);
  }
}

/* ---------- 4. Preloader ---------- */
const loader = $(".loader");
const countEl = $("[data-loader-count]");
const loadStart = performance.now();
const minDuration = reduceMotion ? 200 : 1700;
let pageLoaded = document.readyState === "complete";
window.addEventListener("load", () => (pageLoaded = true));
// Never hold visitors hostage if a font or asset is slow.
setTimeout(() => (pageLoaded = true), 4000);

function tickLoader(now) {
  const t = clamp((now - loadStart) / minDuration);
  const shown = pageLoaded ? t : Math.min(t, 0.9);
  countEl.textContent = Math.round(easeInOut(shown) * 100);
  if (shown >= 1) {
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    setTimeout(() => {
      $(".hero").classList.add("is-in");
      $$(".reveal, .footer").forEach((el) => io.observe(el));
    }, 250);
    setTimeout(() => loader.remove(), 1400);
    return;
  }
  requestAnimationFrame(tickLoader);
}
requestAnimationFrame(tickLoader);

/* ---------- 5. Reveal on scroll + counters ---------- */
function runCounter(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const dur = reduceMotion ? 1 : 1800;
  const start = performance.now();
  const step = (now) => {
    const t = clamp((now - start) / dur);
    const v = target * (1 - Math.pow(1 - t, 4));
    el.textContent = v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (t === 1 ? suffix : "");
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function fillStars(el) {
  const target = (parseFloat(getComputedStyle(el).getPropertyValue("--rating")) / 5) * 100;
  const span = $("span", el);
  const start = performance.now();
  const step = (now) => {
    const t = clamp((now - start) / (reduceMotion ? 1 : 1800));
    span.style.setProperty("--fill", (target * (1 - Math.pow(1 - t, 3))).toFixed(2));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-in");
      $$("[data-count]", el).forEach(runCounter);
      if (el.matches("[data-count]")) runCounter(el);
      $$(".stars", el).forEach(fillStars);
      io.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
);

/* ---------- 6. Nav, progress bar, active links ---------- */
const nav = $(".nav");
const progress = $(".progress");
const navLinks = $$(".nav__links a");
const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
let lastY = window.scrollY;

function onScrollUI() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
  nav.classList.toggle("is-scrolled", y > 40);
  const menuOpen = document.body.classList.contains("menu-open");
  nav.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 600);
  lastY = y;

  let current = null;
  sections.forEach((s) => {
    if (s.getBoundingClientRect().top < innerHeight * 0.45) current = s;
  });
  navLinks.forEach((a) => a.classList.toggle("is-active", current && a.getAttribute("href") === `#${current.id}`));
}

/* ---------- 7. Anatomy: explode the burger on scroll ---------- */
const anatomy = $(".anatomy");
const anatomySvg = $(".anatomy__burger svg");
const anatomyLayers = anatomySvg ? $$(".layer", anatomySvg) : [];
const labelList = $(".anatomy__labels");
const stage = $(".anatomy__stage");
const labels = anatomyLayers
  .slice()
  .reverse()
  .map((layer, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${String(idx + 1).padStart(2, "0")}</b>${layer.dataset.label}`;
    labelList.appendChild(li);
    return { li, layer };
  });

function onScrollAnatomy() {
  if (!anatomy) return;
  const rect = anatomy.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > innerHeight) return;
  const raw = clamp(-rect.top / (rect.height - innerHeight));
  const p = easeInOut(clamp((raw - 0.08) / 0.62));
  const n = anatomyLayers.length;
  const mid = (n - 1) / 2;

  // Fit the exploded stack inside the stage on any screen.
  const svgRect = anatomySvg.getBoundingClientRect();
  const vb = anatomySvg.viewBox.baseVal;
  const scale = svgRect.width / vb.width;
  const room = stage.clientHeight - vb.height * scale;
  const spread = clamp(room / (n - 1) / scale, 8, 46);

  anatomyLayers.forEach((layer, i) => {
    layer.style.transform = `translateY(${(-(i - mid) * spread * p).toFixed(2)}px)`;
  });
  anatomySvg.style.transform = `rotate(${(-4 * p).toFixed(2)}deg)`;

  const stageRect = stage.getBoundingClientRect();
  const right = svgRect.right - stageRect.left - 6;
  labels.forEach(({ li, layer }, idx) => {
    const r = layer.getBoundingClientRect();
    const o = clamp((p - 0.25 - idx * 0.05) / 0.25);
    li.style.top = `${r.top + r.height / 2 - stageRect.top}px`;
    li.style.left = `${right}px`;
    li.style.maxWidth = `${Math.max(90, stageRect.width - right - 4)}px`;
    li.style.setProperty("--o", o.toFixed(3));
  });
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    onScrollUI();
    onScrollAnatomy();
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

/* ---------- 8. Mobile menu ---------- */
const burgerBtn = $(".nav__burger");
const mobileMenu = $(".mobile-menu");
function setMenu(open) {
  burgerBtn.setAttribute("aria-expanded", open);
  burgerBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", !open);
  document.body.classList.toggle("menu-open", open);
  document.body.style.overflow = open ? "hidden" : "";
}
burgerBtn.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("is-open")));
$$("a", mobileMenu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- 9. Fries: thick vs thin ---------- */
const toggle = $(".toggle");
const friesWrap = $(".fries-wrap");
$$("button", toggle).forEach((btn) =>
  btn.addEventListener("click", () => {
    const cut = btn.dataset.cut;
    toggle.dataset.cut = cut;
    friesWrap.dataset.cut = cut;
    $$("button", toggle).forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-checked", b === btn);
    });
    $$("[data-cut-info]").forEach((i) => i.classList.toggle("is-active", i.dataset.cutInfo === cut));
  })
);

/* ---------- 10. Shakes: flavour switcher ---------- */
const shakes = $(".shakes");
const shakeWrap = $(".shake-wrap");
$$(".flavor").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (shakes.dataset.flavor === btn.dataset.flavor) return;
    shakes.dataset.flavor = btn.dataset.flavor;
    $$(".flavor").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", b === btn);
    });
    shakeWrap.classList.remove("is-swapping");
    void shakeWrap.offsetWidth; // restart the animation
    shakeWrap.classList.add("is-swapping");
  })
);

/* ---------- 11. Open / closed status ---------- */
const HOURS = { 0: [12, 21], 1: [11, 22], 2: [11, 22], 3: [11, 22], 4: [11, 22], 5: [11, 24], 6: [11, 24] };
const status = $("[data-open-status]");
if (status) {
  const now = new Date();
  const [open, close] = HOURS[now.getDay()];
  const h = now.getHours() + now.getMinutes() / 60;
  const isOpen = h >= open && h < close;
  const fmt = (x) => (x === 24 ? "midnight" : x === 12 ? "12pm" : x > 12 ? `${x - 12}pm` : `${x}am`);
  status.textContent = isOpen ? `Open now · until ${fmt(close)}` : h < open ? `Closed · opens ${fmt(open)}` : "Closed · see you tomorrow";
  status.parentElement.classList.toggle("is-closed", !isOpen);
}
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- 12. Pointer candy: cursor, magnetic buttons, 3D tilt ---------- */
if (finePointer && !reduceMotion) {
  const cursor = $(".cursor");
  const label = $(".cursor__label");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  (function follow() {
    cx = lerp(cx, mx, 0.2);
    cy = lerp(cy, my, 0.2);
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(follow);
  })();

  document.addEventListener("pointerover", (e) => {
    const big = e.target.closest("[data-cursor]");
    const link = e.target.closest("a, button");
    cursor.classList.toggle("is-big", !!big);
    cursor.classList.toggle("is-link", !big && !!link);
    if (big) label.textContent = big.dataset.cursor;
  });
  document.addEventListener("pointerleave", () => cursor.classList.remove("is-big", "is-link"));

  $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });

  $$(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 12}deg) translateY(-6px)`;
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });

  // Gentle parallax on the hero burger.
  const heroArt = $(".hero__art");
  window.addEventListener("pointermove", (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    heroArt.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
  });
}
