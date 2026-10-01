import styles from "./Skyline.module.css";

// The hero's Neo-Gotham skyline. It has no client code: the city is drawn once
// on the server as four stacked SVG planes that share one 1600x1000 view box.
// `slice` with bottom-right anchoring makes every plane cover the hero and
// keeps the tall towers and the owl-signal in view on narrow screens.
// Hero.js sets --scroll on the section, which drives the depth parallax.

const VIEW_BOX = "0 0 1600 1000";
const FIT = "xMaxYMax slice";
const GROUND = 1000;

// [x, width, height, crown, neon?]. The left half stays low so the hero text
// sits on open sky; the tall towers rise on the right. A fifth value outlines
// that tower in neon tubing.
const FAR = [
  [0, 70, 150, "flat"], [62, 88, 172, "setback"], [148, 58, 128, "flat"],
  [202, 84, 160, "ziggurat"], [284, 66, 136, "flat"], [346, 100, 170, "setback"],
  [440, 58, 118, "flat"], [494, 92, 166, "dome"], [582, 70, 146, "flat"],
  [648, 104, 176, "ziggurat"], [748, 82, 330, "spire"], [826, 112, 420, "setback"],
  [934, 70, 360, "fin"], [1000, 122, 520, "spire", "red"], [1118, 82, 400, "ziggurat"],
  [1196, 102, 470, "setback"], [1294, 72, 380, "fin"], [1404, 104, 540, "spire"],
  [1504, 96, 450, "ziggurat", "pink"],
];

const MID = [
  [0, 112, 108, "flat"], [104, 80, 140, "setback"], [176, 118, 98, "water"],
  [288, 92, 130, "ziggurat"], [372, 112, 112, "flat"], [478, 92, 144, "setback"],
  [562, 120, 118, "water"], [676, 94, 150, "dome"], [770, 100, 262, "ziggurat"],
  [862, 90, 330, "setback", "red"], [946, 112, 282, "flat"], [1052, 90, 400, "fin", "pink"],
  [1136, 130, 340, "setback"], [1262, 92, 300, "ziggurat"], [1348, 120, 420, "spire", "red"],
  [1462, 80, 322, "fin"], [1536, 64, 380, "setback"],
];

const NEON_COLOR = { red: "#FF4A45", pink: "#FF5C93" };

const NEAR = [
  [0, 140, 72, "water"], [132, 92, 96, "setback"], [216, 150, 62, "flat"],
  [358, 102, 86, "ziggurat"], [452, 132, 70, "water"], [576, 112, 100, "setback"],
  [682, 124, 80, "flat"], [798, 122, 170, "ziggurat"], [912, 92, 240, "fin"],
  [998, 142, 200, "setback"], [1132, 92, 290, "spire"], [1216, 156, 470, "hero"],
  [1364, 92, 330, "fin"], [1448, 152, 250, "fluted"],
];

const round = (n) => Math.round(n * 10) / 10;

// Seeded PRNG (mulberry32): the lit windows are identical on every render.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One building's outline, the top of its windowed body, and the tip where an
// aviation light can sit.
function building(x, w, h, crown) {
  const T = GROUND - h;
  const cx = x + w / 2;
  const R = x + w;

  switch (crown) {
    case "setback": {
      const s1 = w * 0.14, s2 = w * 0.3;
      const t1 = 10 + h * 0.06, t2 = 8 + h * 0.05;
      const top = T - t1 - t2;
      return {
        d: `M${x} ${GROUND}V${T}H${x + s1}V${T - t1}H${x + s2}V${top}H${R - s2}V${T - t1}H${R - s1}V${T}H${R}V${GROUND}Z`,
        body: T,
        tip: null,
      };
    }
    case "spire": {
      const s1 = w * 0.14, s2 = w * 0.3;
      const t1 = 10 + h * 0.06, t2 = 8 + h * 0.05;
      const top = T - t1 - t2;
      const mw = Math.max(6, w * 0.1), mh = 18 + h * 0.08, nh = 28 + h * 0.1;
      return {
        d:
          `M${x} ${GROUND}V${T}H${x + s1}V${T - t1}H${x + s2}V${top}` +
          `H${cx - mw / 2}V${top - mh}H${cx - 1.2}V${top - mh - nh}H${cx + 1.2}V${top - mh}H${cx + mw / 2}V${top}` +
          `H${R - s2}V${T - t1}H${R - s1}V${T}H${R}V${GROUND}Z`,
        body: T,
        tip: [cx, top - mh - nh],
      };
    }
    case "ziggurat": {
      const n = 4, s = w * 0.085, rise = 9 + h * 0.015;
      let d = `M${x} ${GROUND}V${T}`;
      for (let i = 1; i <= n; i++) d += `H${x + i * s}V${T - i * rise}`;
      d += `H${R - n * s}`;
      for (let i = n - 1; i >= 0; i--) d += `V${T - i * rise}H${R - i * s}`;
      return { d: `${d}V${GROUND}Z`, body: T, tip: null };
    }
    case "fin": {
      // Neo-Gotham blade: a raked roof rising to a needle near the right edge.
      const apex = x + w * 0.72, left = T + w * 0.62, right = T + w * 0.22;
      return {
        d: `M${x} ${GROUND}V${left}L${apex - 1.2} ${T}V${T - 36}H${apex + 1.2}V${T}L${R} ${right}V${GROUND}Z`,
        body: left,
        tip: [apex, T - 36],
      };
    }
    case "dome": {
      const rx = w * 0.36, ry = w * 0.26;
      return {
        d:
          `M${x} ${GROUND}V${T}H${cx - rx}A${rx} ${ry} 0 0 1 ${cx + rx} ${T}H${R}V${GROUND}Z` +
          `M${cx - 1.5} ${T - ry + 2}V${T - ry - 16}H${cx + 1.5}V${T - ry + 2}Z`,
        body: T,
        tip: null,
      };
    }
    case "water": {
      // Flat roof with a water tank on legs, as on every noir rooftop.
      const tx = x + w * 0.58, tw = 18, ty = T - 24;
      return {
        d:
          `M${x} ${GROUND}V${T}H${R}V${GROUND}Z` +
          `M${tx} ${T}V${ty + 14}H${tx + 2}V${T}Z M${tx + tw - 2} ${T}V${ty + 14}H${tx + tw}V${T}Z` +
          `M${tx - 1} ${ty + 15}V${ty + 3}L${tx + tw / 2} ${ty - 6}L${tx + tw + 1} ${ty + 3}V${ty + 15}Z`,
        body: T,
        tip: null,
      };
    }
    case "hero": {
      // The tallest tower: four setbacks, a mast, and a needle crossing the moon.
      const i1 = w * 0.1, i2 = w * 0.2, i3 = w * 0.3, i4 = w * 0.38;
      const y1 = T - 34, y2 = y1 - 30, y3 = y2 - 26, crown = y3 - 40;
      const mw = w * 0.08, mh = 70, nh = 112;
      return {
        d:
          `M${x} ${GROUND}V${T}H${x + i1}V${y1}H${x + i2}V${y2}H${x + i3}V${y3}H${x + i4}V${crown}` +
          `H${cx - mw / 2}V${crown - mh}H${cx - 1.5}V${crown - mh - nh}H${cx + 1.5}V${crown - mh}H${cx + mw / 2}V${crown}` +
          `H${R - i4}V${y3}H${R - i3}V${y2}H${R - i2}V${y1}H${R - i1}V${T}H${R}V${GROUND}Z`,
        body: T,
        tip: [cx, crown - mh - nh],
      };
    }
    case "fluted":
      return {
        d: `M${x} ${GROUND}V${T + 8}H${x + 5}V${T}H${R - 5}V${T + 8}H${R}V${GROUND}Z`,
        body: T + 8,
        tip: null,
      };
    default:
      return { d: `M${x} ${GROUND}V${T}H${R}V${GROUND}Z`, body: T, tip: null };
  }
}

// Outline, lit windows, neon tubing and aviation-light positions for one plane.
function plane(buildings, { seed, density, winW, winH, col, row, pad, base }) {
  const rand = seeded(seed);
  let outline = "";
  const amber = [];
  const cream = [];
  const tips = [];
  const neon = [];

  for (const [x, w, h, crown, tube] of buildings) {
    const b = building(x, w, h, crown);
    outline += b.d;
    if (b.tip) tips.push(b.tip);
    if (tube) neon.push({ d: b.d, color: NEON_COLOR[tube] });

    const cols = Math.floor((w - 2 * pad - winW) / col) + 1;
    if (cols < 1) continue;
    const startX = x + (w - ((cols - 1) * col + winW)) / 2;

    for (let wy = b.body + pad; wy + winH <= GROUND - base; wy += row) {
      // Whole floors burn late or sit dark, so bias each row.
      const floor = 0.3 + rand() * 1.7;
      for (let c = 0; c < cols; c++) {
        if (rand() < density * floor) {
          const seg = `M${round(startX + c * col)} ${round(wy)}h${winW}v${winH}h-${winW}z`;
          (rand() < 0.14 ? cream : amber).push(seg);
        }
      }
    }
  }

  return { outline, amber: amber.join(""), cream: cream.join(""), tips, neon };
}

// Night sky: a scatter of faint stars above the towers, seeded like the windows.
const STARS = (() => {
  const rand = seeded(7);
  return Array.from({ length: 70 }, () => ({
    x: round(rand() * 1600),
    y: round(12 + rand() * 400),
    r: round(0.6 + rand() * 1.1),
    o: round(0.3 + rand() * 0.55),
  }));
})();

// A tower traced in neon: the outline as glowing tube, inside its own plane
// so nearer buildings still hide what they should.
function NeonTubes({ tubes, filter, opacity = 1 }) {
  return (
    <g filter={`url(#${filter})`} opacity={opacity}>
      {tubes.map((t, i) => (
        <path key={i} d={t.d} fill="none" stroke={t.color} strokeWidth="2" strokeLinejoin="miter" />
      ))}
    </g>
  );
}

function GlowFilter({ id, blur = 3 }) {
  return (
    <filter id={id}>
      <feGaussianBlur stdDeviation={blur} result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

const far = plane(FAR, { seed: 29, density: 0.1, winW: 3, winH: 5, col: 9, row: 13, pad: 7, base: 20 });
const mid = plane(MID, { seed: 1929, density: 0.16, winW: 4, winH: 7, col: 11, row: 16, pad: 8, base: 26 });
const near = plane(NEAR, { seed: 2039, density: 0.07, winW: 5, winH: 8, col: 13, row: 19, pad: 9, base: 34 });

// Neon strips climbing the right-hand blade tower, Batman Beyond style.
const NEON_TOWER = NEAR.find((b) => b[0] === 1364);
const NEON = [0.2, 0.4, 0.6].map((f, i) => {
  const [x, w, h] = NEON_TOWER;
  const T = GROUND - h;
  const apex = w * 0.72;
  const lx = x + w * f;
  const roof = T + w * 0.62 - ((lx - x) / apex) * (w * 0.62); // raked roof above this strip
  return { x: round(lx), y: round(roof + 12), h: [150, 190, 120][i] };
});

const OWL = { cx: 990, cy: 200, w: 71, h: 104 };

export default function Skyline() {
  return (
    <div className={styles.scene} aria-hidden="true">
      {/* Sky: the moon */}
      <svg className={`${styles.plane} ${styles.sky}`} viewBox={VIEW_BOX} preserveAspectRatio={FIT} focusable="false">
        <defs>
          <radialGradient id="sky-moon" cx="45%" cy="40%" r="60%">
            <stop offset="0" stopColor="#F4643F" />
            <stop offset="1" stopColor="#D93A2B" />
          </radialGradient>
          <radialGradient id="sky-moon-halo">
            <stop offset="0.55" stopColor="#E8452F" stopOpacity="0.32" />
            <stop offset="1" stopColor="#E8452F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFE9D6" opacity={s.o} />
        ))}
        <circle cx="1300" cy="392" r="232" fill="url(#sky-moon-halo)" />
        <circle cx="1300" cy="392" r="136" fill="url(#sky-moon)" />
      </svg>

      {/* The owl-signal on its beam. A plane of its own, so on screens wider
          than the view box it can drop back into view below the navbar. */}
      <svg className={`${styles.plane} ${styles.signalPlane}`} viewBox={VIEW_BOX} preserveAspectRatio={FIT} focusable="false">
        <defs>
          <linearGradient id="sky-beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.03" />
            <stop offset="0.55" stopColor="#FFE9C4" stopOpacity="0.14" />
            <stop offset="1" stopColor="#FFE9C4" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="sky-signal-halo">
            <stop offset="0.5" stopColor="#FFE2B0" stopOpacity="0.38" />
            <stop offset="1" stopColor="#FFE2B0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sky-signal" cx="50%" cy="45%" r="55%">
            <stop offset="0" stopColor="#FFF6E4" />
            <stop offset="0.75" stopColor="#FCE3BA" />
            <stop offset="1" stopColor="#F2C58A" />
          </radialGradient>
          <filter id="sky-soften" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          {/* Turns the owl logo into a stencil: dark ink, original alpha */}
          <filter id="sky-stencil">
            <feColorMatrix type="matrix" values="0 0 0 0 0.07  0 0 0 0 0.03  0 0 0 0 0.03  0 0 0 1 0" />
          </filter>
        </defs>

        <g className={styles.signal}>
          <polygon points="1079,700 1091,700 1100,206 880,206" fill="url(#sky-beam)" filter="url(#sky-soften)" />
          <ellipse cx={OWL.cx} cy={OWL.cy} rx="164" ry="104" fill="url(#sky-signal-halo)" />
          <ellipse cx={OWL.cx} cy={OWL.cy} rx="112" ry="70" fill="url(#sky-signal)" />
          <image
            href="/logo-owl.png"
            x={OWL.cx - OWL.w / 2}
            y={OWL.cy - OWL.h / 2}
            width={OWL.w}
            height={OWL.h}
            filter="url(#sky-stencil)"
            opacity="0.9"
          />
        </g>
      </svg>

      {/* Sweeping searchlights, behind the far towers */}
      <div className={styles.beams}>
        <span className={`${styles.beam} ${styles.beamA}`} />
        <span className={`${styles.beam} ${styles.beamB}`} />
      </div>

      {/* Far: red-brown towers dissolving into the haze */}
      <svg className={`${styles.plane} ${styles.far}`} viewBox={VIEW_BOX} preserveAspectRatio={FIT} focusable="false">
        <defs>
          <linearGradient id="far-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D8342A" stopOpacity="0" />
            <stop offset="1" stopColor="#D8342A" stopOpacity="0.22" />
          </linearGradient>
          <GlowFilter id="far-glow" blur={3} />
        </defs>
        <path d={far.outline} fill="#5A0F12" />
        <path d={far.amber} fill="#F2B544" opacity="0.42" />
        <path d={far.cream} fill="#FFE3AE" opacity="0.5" />
        <NeonTubes tubes={far.neon} filter="far-glow" opacity={0.7} />
        <rect x="0" y="640" width="1600" height="360" fill="url(#far-haze)" />
      </svg>

      {/* Mid: darker blocks with warm windows and neon-traced towers */}
      <svg className={`${styles.plane} ${styles.mid}`} viewBox={VIEW_BOX} preserveAspectRatio={FIT} focusable="false">
        <defs>
          <GlowFilter id="mid-glow" blur={3.5} />
        </defs>
        <path d={mid.outline} fill="#2B0709" />
        <path d={mid.amber} fill="#F2B544" opacity="0.85" />
        <path d={mid.cream} fill="#FFE3AE" opacity="0.9" />
        <NeonTubes tubes={mid.neon} filter="mid-glow" />
        {mid.tips.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="#FFB86B" className={styles.blink} style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </svg>

      {/* Near: black silhouettes, fluting and neon trim */}
      <svg className={`${styles.plane} ${styles.near}`} viewBox={VIEW_BOX} preserveAspectRatio={FIT} focusable="false">
        <defs>
          <pattern id="near-flutes" width="9" height="10" patternUnits="userSpaceOnUse">
            <rect width="3" height="10" fill="#1F0D0E" />
          </pattern>
          <filter id="near-neon" x="-400%" y="-10%" width="900%" height="120%">
            <feGaussianBlur stdDeviation="3.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="near-street" x="-2%" y="-400%" width="104%" height="900%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={`${near.outline}M0 ${GROUND}V972H1600V${GROUND}Z`} fill="#0D0708" />
        <rect x="1453" y="760" width="142" height="212" fill="url(#near-flutes)" />
        <path d={near.amber} fill="#F2B544" />
        <path d={near.cream} fill="#FFE3AE" />
        <g filter="url(#near-neon)">
          {NEON.map((n) => (
            <rect key={n.x} x={n.x} y={n.y} width="2" height={n.h} fill="#FF8C78" />
          ))}
        </g>
        {/* Street-level neon running along the foot of the city */}
        <g filter="url(#near-street)">
          <rect x="0" y="979" width="1600" height="2.5" fill="#FF4A45" />
          <rect x="0" y="986" width="1600" height="1.5" fill="#FF5C93" />
        </g>
        {near.tips.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="#FFC98A" className={styles.blink} style={{ animationDelay: `${0.35 + i * 0.9}s` }} />
        ))}
      </svg>
    </div>
  );
}
