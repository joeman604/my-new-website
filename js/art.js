/* ==========================================================================
   Ember & Bun — hand-built SVG illustrations
   Every burger, fry, shake and cup on the site is drawn here in code so it
   stays razor-sharp at any size and every layer can be animated on its own.
   ========================================================================== */

let uid = 0;
const nextId = () => `a${++uid}`;

// Deterministic pseudo-random so the art looks hand-made but never "jumps".
const rand = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/* ---------- Shared gradients ---------- */
const burgerDefs = (id) => `
<defs>
  <linearGradient id="${id}-bunTop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FBC56A"/>
    <stop offset=".45" stop-color="#E8952F"/>
    <stop offset="1" stop-color="#B35A17"/>
  </linearGradient>
  <linearGradient id="${id}-bunBot" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#E9A04A"/>
    <stop offset="1" stop-color="#A9541A"/>
  </linearGradient>
  <linearGradient id="${id}-patty" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7A4327"/>
    <stop offset=".5" stop-color="#4E2615"/>
    <stop offset="1" stop-color="#2B1309"/>
  </linearGradient>
  <linearGradient id="${id}-chicken" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFCB63"/>
    <stop offset=".55" stop-color="#E39A34"/>
    <stop offset="1" stop-color="#B8661C"/>
  </linearGradient>
  <linearGradient id="${id}-cheese" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFD84A"/>
    <stop offset="1" stop-color="#F7A912"/>
  </linearGradient>
  <linearGradient id="${id}-lettuce" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8BDB5C"/>
    <stop offset="1" stop-color="#3E9A2E"/>
  </linearGradient>
  <linearGradient id="${id}-bacon" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#D2553A"/>
    <stop offset="1" stop-color="#8E2C1A"/>
  </linearGradient>
  <radialGradient id="${id}-shadow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#000" stop-opacity=".55"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
</defs>`;

/* ---------- Burger layers (local coords, x spans ~40–360) ---------- */
const LAYERS = {
  topBun: (id) => ({
    h: 128,
    label: "Toasted brioche crown",
    svg: `
      <path d="M50 116 C50 40 120 0 200 0 C280 0 350 40 350 116 Q350 128 336 128 H64 Q50 128 50 116Z" fill="url(#${id}-bunTop)"/>
      <path d="M58 112 Q200 132 342 112" stroke="#8E4512" stroke-width="3" fill="none" opacity=".35"/>
      <ellipse cx="140" cy="40" rx="62" ry="17" transform="rotate(-16 140 40)" fill="#fff" opacity=".22"/>
      <ellipse cx="118" cy="34" rx="20" ry="6" transform="rotate(-22 118 34)" fill="#fff" opacity=".35"/>
      ${[
        [120, 40, -30], [162, 24, 10], [206, 18, -5], [250, 26, 25], [292, 46, -20],
        [140, 72, 15], [186, 56, -35], [232, 60, 20], [276, 80, -10], [98, 88, 30],
        [318, 94, 15], [210, 94, -25], [160, 100, 40], [255, 104, -40],
      ]
        .map(
          ([x, y, r]) =>
            `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y + 1.5}" rx="6.5" ry="3.4" fill="#8E4512" opacity=".35"/><ellipse cx="${x}" cy="${y}" rx="6.5" ry="3.4" fill="#FFF3DA"/></g>`
        )
        .join("")}`,
  }),

  lettuce: (id) => ({
    h: 30,
    label: "Crisp green leaf",
    svg: `
      <path d="M40 2 H360 Q372 12 356 18 Q338 32 320 18 Q302 32 284 18 Q266 32 248 18 Q230 32 212 18 Q194 32 176 18 Q158 32 140 18 Q122 32 104 18 Q86 32 68 18 Q30 14 40 2Z" fill="url(#${id}-lettuce)"/>
      <path d="M64 9 Q120 4 170 10 T280 9 T342 8" stroke="#B8F08F" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>`,
  }),

  tomato: () => ({
    h: 20,
    label: "Vine tomato",
    svg: `
      <rect x="60" y="2" width="138" height="17" rx="8.5" fill="#E2412E"/>
      <rect x="202" y="2" width="138" height="17" rx="8.5" fill="#D93A27"/>
      <rect x="72" y="5" width="114" height="5" rx="2.5" fill="#FF8A6E" opacity=".7"/>
      <rect x="214" y="5" width="114" height="5" rx="2.5" fill="#FF8A6E" opacity=".7"/>`,
  }),

  pickles: () => ({
    h: 14,
    label: "House pickles",
    svg: [90, 150, 210, 270, 318]
      .map(
        (x, i) =>
          `<ellipse cx="${x}" cy="7" rx="26" ry="6.5" fill="${i % 2 ? "#7FA83A" : "#6C9530"}"/><ellipse cx="${x}" cy="6" rx="16" ry="3" fill="#B7D96B" opacity=".6"/>`
      )
      .join(""),
  }),

  cheese: (id) => ({
    h: 36,
    label: "Melted aged cheddar",
    svg: `
      <path d="M34 0 H366 L358 14 Q352 22 344 14 L326 12 Q318 36 306 12 H234 Q224 42 214 12 H144 Q134 32 124 12 H76 Q66 26 56 12 Z" fill="url(#${id}-cheese)"/>
      <path d="M44 4 H356" stroke="#FFE98A" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`,
  }),

  patty: (id, n = 0) => ({
    h: 46,
    label: "Smashed beef patty",
    svg: `
      <rect x="44" y="0" width="312" height="46" rx="23" fill="url(#${id}-patty)"/>
      <path d="M72 7 Q200 -1 328 7" stroke="#9A5A35" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>
      ${Array.from({ length: 26 }, (_, i) => {
        const x = 64 + rand(i + n * 31) * 272;
        const y = 12 + rand(i * 3 + n * 17) * 24;
        const r = 1.4 + rand(i * 7 + n) * 2.6;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${i % 3 ? "#2A1007" : "#8B4C2A"}" opacity=".8"/>`;
      }).join("")}
      <path d="M96 20 h34 M178 28 h44 M262 18 h36" stroke="#1E0B05" stroke-width="4" stroke-linecap="round" opacity=".55"/>`,
  }),

  bacon: (id) => ({
    h: 30,
    label: "Thick-cut smoked bacon",
    svg: `
      <path d="M40 10 C88 -6 118 26 160 10 S232 -6 272 10 S332 26 360 8 L360 20 C332 38 302 4 272 22 S202 36 160 22 S88 6 40 22 Z" fill="url(#${id}-bacon)"/>
      <path d="M42 16 C88 0 118 32 160 16 S232 0 272 16 S332 32 358 14" stroke="#F7B7A0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M42 12 C88 -4 118 28 160 12" stroke="#5E1A0E" stroke-width="1.5" fill="none" opacity=".4"/>`,
  }),

  chicken: (id) => {
    // Craggy, crunchy outline built from a bumpy top and bottom edge.
    const top = [];
    const bot = [];
    for (let x = 52, i = 0; x <= 348; x += 14, i++) {
      top.push([x, 6 + rand(i + 3) * 9]);
      bot.push([x, 52 + rand(i + 40) * 8]);
    }
    let d = `M${top[0][0]} ${top[0][1] + 10} `;
    top.forEach(([x, y], i) => {
      d += i === 0 ? `Q${x} ${y} ${x + 7} ${y}` : ` Q${x - 4} ${y - 5} ${x} ${y}`;
    });
    d += ` Q362 30 ${bot[bot.length - 1][0]} ${bot[bot.length - 1][1]}`;
    [...bot].reverse().forEach(([x, y]) => (d += ` Q${x + 4} ${y + 5} ${x} ${y}`));
    d += ` Q38 30 ${top[0][0]} ${top[0][1] + 10}Z`;
    const crumbs = Array.from({ length: 46 }, (_, i) => {
      const x = 60 + rand(i * 5 + 1) * 280;
      const y = 14 + rand(i * 11 + 2) * 36;
      const r = 1.2 + rand(i * 13) * 2.4;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${i % 2 ? "#FFE2A0" : "#A85A15"}" opacity=".85"/>`;
    }).join("");
    return {
      h: 60,
      label: "Double-dredged crispy chicken",
      svg: `<path d="${d}" fill="url(#${id}-chicken)"/>${crumbs}
        <path d="M80 14 Q200 4 320 14" stroke="#FFF0C2" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>`,
    };
  },

  sauce: () => ({
    h: 16,
    label: "Signature ember sauce",
    svg: `<path d="M48 2 H352 Q356 8 344 10 Q330 22 318 10 Q300 10 286 12 Q276 24 266 12 H190 Q180 26 170 12 H110 Q98 22 88 11 Q60 12 48 2Z" fill="#FFE9C7"/>
          <path d="M60 4 H340" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>`,
  }),

  bottomBun: (id) => ({
    h: 52,
    label: "Butter-toasted heel",
    svg: `
      <path d="M54 0 H346 Q360 0 357 13 L349 40 Q345 52 330 52 H70 Q55 52 51 40 L43 13 Q40 0 54 0Z" fill="url(#${id}-bunBot)"/>
      <rect x="52" y="0" width="296" height="8" rx="4" fill="#F7D49B"/>
      <path d="M70 44 Q200 52 330 44" stroke="#7E3A0E" stroke-width="2" fill="none" opacity=".35"/>`,
  }),
};

// overlap: how far each layer tucks under the one beneath it
const OVERLAP = { topBun: 14, lettuce: 10, tomato: 6, pickles: 4, cheese: 18, patty: 6, bacon: 10, chicken: 10, sauce: 8, bottomBun: 0 };

export const STACKS = {
  double: ["bottomBun", "patty", "cheese", "patty", "cheese", "pickles", "tomato", "lettuce", "topBun"],
  bacon: ["bottomBun", "patty", "cheese", "bacon", "bacon", "tomato", "lettuce", "topBun"],
  chicken: ["bottomBun", "lettuce", "chicken", "sauce", "pickles", "topBun"],
};

/**
 * Build a burger SVG from a list of layer names (bottom → top).
 * Every layer is wrapped in <g class="layer"> so CSS/JS can move it freely.
 */
export function burgerSVG(stack, { className = "" } = {}) {
  const id = nextId();
  const baseline = 400;
  let y = baseline;
  let pattyCount = 0;
  const groups = stack.map((name, i) => {
    const layer = LAYERS[name](id, name === "patty" ? pattyCount++ : 0);
    y -= layer.h;
    const g = `<g class="layer layer--${name}" data-label="${layer.label}" style="--i:${i};--n:${stack.length}"><g transform="translate(0 ${y})">${layer.svg}</g></g>`;
    y += OVERLAP[name] ?? 0;
    return g;
  });
  const top = y - (OVERLAP[stack[stack.length - 1]] ?? 0) - 20;
  const h = baseline - top + 36;
  return `<svg class="burger ${className}" viewBox="0 ${top} 400 ${h}" xmlns="http://www.w3.org/2000/svg" role="img" overflow="visible">
    ${burgerDefs(id)}
    <ellipse class="burger__shadow" cx="200" cy="${baseline + 12}" rx="190" ry="20" fill="url(#${id}-shadow)"/>
    ${groups.join("")}
  </svg>`;
}

/* ---------- Fries ---------- */
function friesSet(kind, id) {
  const thick = kind === "thick";
  const count = thick ? 8 : 17;
  const w = thick ? 24 : 10;
  const span = 150;
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x = 125 + t * span - w / 2 + (rand(i + (thick ? 7 : 70)) - 0.5) * 8;
    const top = 58 + rand(i * 3 + (thick ? 1 : 9)) * 50 + Math.abs(t - 0.5) * 50;
    const rot = (t - 0.5) * 26 + (rand(i + 99) - 0.5) * 8;
    const h = 260 - top;
    return `<g class="fry" style="--d:${(i * (thick ? 45 : 22)).toFixed(0)}ms">
      <g transform="rotate(${rot.toFixed(1)} ${x + w / 2} 250)">
        <rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="${thick ? 5 : 3}" fill="url(#${id}-fry)"/>
        <rect x="${(x + w * 0.18).toFixed(1)}" y="${(top + 4).toFixed(1)}" width="${(w * 0.22).toFixed(1)}" height="${(h * 0.5).toFixed(1)}" rx="2" fill="#FFF3B8" opacity=".55"/>
        <rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w}" height="${thick ? 7 : 4}" rx="${thick ? 3 : 2}" fill="#D98A1F" opacity=".55"/>
      </g>
    </g>`;
  }).join("");
}

export function friesSVG() {
  const id = nextId();
  return `<svg class="fries" viewBox="40 20 320 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fries in a red carton">
    <defs>
      <linearGradient id="${id}-fry" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#F6B42B"/><stop offset=".5" stop-color="#FFD866"/><stop offset="1" stop-color="#EAA020"/>
      </linearGradient>
      <linearGradient id="${id}-box" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FF4D2E"/><stop offset="1" stop-color="#B91E12"/>
      </linearGradient>
      <radialGradient id="${id}-sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse cx="200" cy="370" rx="120" ry="14" fill="url(#${id}-sh)"/>
    <path d="M112 190 Q200 166 288 190 L292 200 H108Z" fill="#7E140B"/>
    <g class="fries__set fries__set--thick">${friesSet("thick", id)}</g>
    <g class="fries__set fries__set--thin">${friesSet("thin", id)}</g>
    <path d="M104 192 Q200 226 296 192 L272 362 Q270 372 258 372 H142 Q130 372 128 362Z" fill="url(#${id}-box)"/>
    <path d="M104 192 Q200 226 296 192" stroke="#FF8A6B" stroke-width="3" fill="none" opacity=".7"/>
    <path d="M128 230 L140 360" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".12"/>
    <g transform="translate(200 288)">
      <circle r="36" fill="#FFF3E3"/>
      <path d="M0 -24 C14 -10 18 0 12 12 C8 20 -8 22 -14 12 C-20 2 -12 -6 -8 -14 C-6 -6 -2 -2 2 -4 C6 -10 4 -18 0 -24Z" fill="#E8341C"/>
      <path d="M0 -4 C6 2 6 10 1 14 C-4 16 -8 10 -5 4 C-4 8 -1 8 0 -4Z" fill="#FFB800"/>
    </g>
  </svg>`;
}

/* ---------- Milkshake ---------- */
export function shakeSVG() {
  const id = nextId();
  const glass = "M128 150 L272 150 L258 372 Q256 386 242 386 H158 Q144 386 142 372 Z";
  return `<svg class="shake" viewBox="40 0 320 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Milkshake">
    <defs>
      <clipPath id="${id}-glass"><path d="${glass}"/></clipPath>
      <radialGradient id="${id}-sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-gl" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/>
      </linearGradient>
    </defs>
    <ellipse cx="200" cy="392" rx="96" ry="10" fill="url(#${id}-sh)"/>
    <g class="shake__straw"><g transform="rotate(14 234 110)">
      <rect x="226" y="10" width="16" height="200" rx="4" fill="#FFF7EE"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M226 ${18 + i * 26} L242 ${12 + i * 26} V${24 + i * 26} L226 ${30 + i * 26}Z" fill="var(--accent)"/>`).join("")}
    </g></g>
    <path d="${glass}" fill="#ffffff" opacity=".08"/>
    <g clip-path="url(#${id}-glass)">
      <g class="shake__liquid">
        <path class="shake__wave" d="M-200 170 Q-175 158 -150 170 T-100 170 T-50 170 T0 170 T50 170 T100 170 T150 170 T200 170 T250 170 T300 170 T350 170 T400 170 T450 170 T500 170 T550 170 T600 170 V400 H-200Z" fill="var(--liquid)"/>
        <rect x="120" y="190" width="160" height="210" fill="var(--liquid-2)" opacity=".35"/>
      </g>
      <g class="shake__bubbles">
        ${Array.from({ length: 9 }, (_, i) => `<circle cx="${150 + rand(i + 5) * 100}" cy="${250 + rand(i + 50) * 120}" r="${2 + rand(i) * 4}" fill="#fff" opacity=".35" style="--d:${(rand(i + 9) * 3).toFixed(2)}s"/>`).join("")}
      </g>
    </g>
    <path d="${glass}" fill="url(#${id}-gl)" stroke="#ffffff" stroke-opacity=".35" stroke-width="3"/>
    <path d="M144 170 L156 360" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".25"/>
    <g class="shake__cream">
      <path d="M118 152 Q110 128 136 122 Q130 96 162 94 Q166 66 200 70 Q234 66 238 94 Q270 96 264 122 Q290 128 282 152 Q200 166 118 152Z" fill="#FFF8EE"/>
      <path d="M140 120 Q170 112 196 118 M176 92 Q200 86 222 94" stroke="#EADBC8" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path class="shake__drip" d="M150 150 Q154 176 160 152 M230 154 Q234 186 240 152" stroke="#FFF8EE" stroke-width="8" stroke-linecap="round" fill="none"/>
    </g>
    <g class="shake__topper shake__topper--choc">
      <path d="M128 130 Q150 116 170 132 Q190 146 210 122 Q232 102 252 126 Q262 138 272 134" stroke="#4A2412" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M150 100 Q176 84 200 98 Q224 110 246 96" stroke="#4A2412" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${[[160, 110], [188, 84], [226, 112], [244, 132], [178, 138], [212, 80]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="7" height="3" rx="1.5" fill="${["#FF5A1F", "#FFB800", "#fff", "#5DBB46"][i % 4]}" transform="rotate(${i * 40} ${x} ${y})"/>`).join("")}
    </g>
    <g class="shake__topper shake__topper--banana">
      ${[[162, 116, -12], [236, 120, 14], [200, 92, 0]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="17" ry="13" fill="#FFEFA8" stroke="#F2D46B" stroke-width="3"/><circle cx="${x}" cy="${y}" r="3" fill="#C9A44A"/></g>`).join("")}
    </g>
    <g class="shake__cherry">
      <path d="M200 66 Q204 40 222 28" stroke="#5B8A2B" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="200" cy="70" r="15" fill="#D7192D"/>
      <circle cx="194" cy="64" r="4.5" fill="#fff" opacity=".6"/>
    </g>
  </svg>`;
}

/* ---------- Fountain pop cup ---------- */
export function cupSVG({ color, color2, label, mark }) {
  const id = nextId();
  return `<svg class="cup" viewBox="0 0 220 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label} cup">
    <defs>
      <linearGradient id="${id}-c" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${color2}"/><stop offset=".45" stop-color="${color}"/><stop offset="1" stop-color="${color2}"/>
      </linearGradient>
      <radialGradient id="${id}-sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse cx="110" cy="326" rx="66" ry="9" fill="url(#${id}-sh)"/>
    <g class="cup__straw"><rect x="116" y="6" width="13" height="110" rx="4" fill="${color}" transform="rotate(10 122 60)"/><rect x="116" y="6" width="13" height="110" rx="4" fill="#fff" opacity=".35" transform="rotate(10 122 60)"/></g>
    <g class="cup__bubbles">
      ${Array.from({ length: 7 }, (_, i) => `<circle cx="${70 + rand(i + 21) * 80}" cy="90" r="${2 + rand(i + 3) * 3.5}" fill="${color}" style="--d:${(i * 0.18).toFixed(2)}s;--x:${((rand(i + 8) - 0.5) * 40).toFixed(0)}px"/>`).join("")}
    </g>
    <path d="M34 96 H186 L168 312 Q166 322 156 322 H64 Q54 322 52 312Z" fill="url(#${id}-c)"/>
    <path d="M44 150 H176 L170 222 H50Z" fill="#fff" opacity=".95"/>
    <text x="110" y="196" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="30" letter-spacing="1" fill="${color2}">${mark}</text>
    <path d="M58 110 L72 300" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".2"/>
    <rect x="26" y="80" width="168" height="22" rx="8" fill="#F4ECE2"/>
    <path d="M44 80 Q110 56 176 80Z" fill="#E5DACB"/>
  </svg>`;
}
