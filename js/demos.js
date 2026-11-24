/* =========================================================
   58 種動畫效果示範
   每個示範都畫在固定 240×180 的舞台上，再依容器大小縮放。
   全部以 CSS / SVG 製作，不需要任何外部函式庫。
   ========================================================= */
(function () {
  'use strict';

  const SV = (inner, cls = '') => `<svg viewBox="0 0 240 180" class="${cls}" aria-hidden="true">${inner}</svg>`;
  const DR = (d, cls = '', extra = '') => `<path pathLength="1" class="dr ${cls}" d="${d}" ${extra}/>`;

  // 固定亂數，讓每次產生的拼貼位置都一樣
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const cube = (cls) => `<div class="cube ${cls}">${['f', 'b', 'l', 'r', 't', 'd'].map(f => `<i class="fc ${f}"></i>`).join('')}</div>`;

  function sinePath(x0, w, cy, amp, n = 48) {
    let d = '';
    for (let i = 0; i <= n; i++) {
      const x = x0 + (w * i) / n;
      const y = cy - amp * Math.sin((Math.PI * 2 * i) / n);
      d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d;
  }

  function isoBox(cx, by, w, h, top, left, right) {
    // cx：中心 x、by：底部中心 y、w：半寬、h：高度
    const q = w / 2;
    return `<polygon points="${cx - w},${by - q - h} ${cx},${by - h} ${cx},${by} ${cx - w},${by - q}" fill="${left}"/>
      <polygon points="${cx},${by - h} ${cx + w},${by - q - h} ${cx + w},${by - q} ${cx},${by}" fill="${right}"/>
      <polygon points="${cx - w},${by - q - h} ${cx},${by - 2 * q - h} ${cx + w},${by - q - h} ${cx},${by - h}" fill="${top}"/>`;
  }

  const D = {};

  /* ============ 光影科技 ============ */
  D.hologram = () => `<div class="stage d-holo">
    <div class="ab beam"></div>
    ${SV(`<g class="globe">
        <circle cx="120" cy="80" r="34"/>
        <ellipse cx="120" cy="80" rx="34" ry="11"/>
        <ellipse cx="120" cy="66" rx="30" ry="8"/>
        <ellipse cx="120" cy="94" rx="30" ry="8"/>
        <ellipse class="m" cx="120" cy="80" rx="34" ry="34"/>
        <ellipse class="m m2" cx="120" cy="80" rx="34" ry="34"/>
        <ellipse class="m m3" cx="120" cy="80" rx="34" ry="34"/>
        <circle class="dot" cx="138" cy="70" r="2.2"/>
      </g>
      <ellipse cx="120" cy="150" rx="44" ry="9"/>
      <ellipse cx="120" cy="150" rx="30" ry="5" class="faint"/>`)}
    <div class="ab scan"></div>
    <div class="ab hud">HOLO.SYS // EARTH v2.0</div>
  </div>`;

  D.cyberpunk = () => `<div class="stage d-cyber">
    <div class="ab sun"></div>
    ${SV(`<g class="city">
      <rect x="18" y="62" width="22" height="44"/><rect x="44" y="40" width="18" height="66"/>
      <rect x="66" y="70" width="26" height="36"/><rect x="150" y="50" width="20" height="56"/>
      <rect x="174" y="30" width="24" height="76"/><rect x="202" y="66" width="22" height="40"/>
      </g>
      <g class="win"><rect x="48" y="48" width="4" height="4"/><rect x="54" y="60" width="4" height="4"/><rect x="179" y="40" width="4" height="4"/><rect x="188" y="56" width="4" height="4"/><rect x="155" y="62" width="4" height="4"/></g>`)}
    <div class="ab floor"><div class="grid"></div></div>
    <div class="ab title">NEON CITY</div>
  </div>`;

  D.glowsketch = () => `<div class="stage d-glow">
    ${SV(`<g class="stars"><circle cx="40" cy="30" r="1.5"/><circle cx="200" cy="44" r="1.5"/><circle cx="60" cy="110" r="1.2"/><circle cx="190" cy="120" r="1.2"/><circle cx="170" cy="20" r="1"/></g>
      ${DR('M20 156 H220', 'ground')}
      <g class="rocket">
        ${DR('M120 26 C140 48 142 92 137 122 L103 122 C98 92 100 48 120 26 Z', 'p1')}
        ${DR('M104 104 L90 132 L104 124', 'p2')}
        ${DR('M136 104 L150 132 L136 124', 'p2')}
        <circle pathLength="1" class="dr p3" cx="120" cy="70" r="9"/>
        <path class="flame" d="M108 126 Q120 160 132 126 Z"/>
      </g>`)}
  </div>`;

  D.xray = () => `<div class="stage d-xray">
    <div class="ab phone"></div>
    <div class="ab inside">${SV(`
      <rect x="92" y="34" width="28" height="22" rx="3"/><path d="M98 34 V28 M106 34 V28 M114 34 V28 M98 56 V62 M106 56 V62 M114 56 V62"/>
      <circle cx="140" cy="40" r="7"/><circle cx="140" cy="40" r="3"/>
      <rect x="92" y="76" width="56" height="58" rx="4"/><path d="M100 90 H140 M100 104 H140 M100 118 H128"/>
      <path d="M120 140 V150 M110 150 H130"/>`)}
      <span class="xl l1">晶片</span><span class="xl l2">鏡頭</span><span class="xl l3">電池</span>
    </div>
    <div class="ab bar"></div>
    <div class="ab hud">X-RAY SCAN</div>
  </div>`;

  D.thermal = () => `<div class="stage d-therm">
    <div class="ab blob b1"></div><div class="ab blob b2"></div><div class="ab blob b3"></div>
    <div class="ab scale"></div>
    <div class="ab hud">● REC THERMAL<br><b>36.6°C</b></div>
    <div class="ab cross"></div>
  </div>`;

  D.ascii = () => `<div class="stage d-ascii">
    <div class="ab term">
      <div class="lines">
        <div>$ claude --draw cat</div>
        <div>&gt; thinking...</div>
        <div>&gt; rendering 5 lines</div>
        <div>      /\\_/\\</div>
        <div>     ( o.o )</div>
        <div>      &gt; ^ &lt;</div>
        <div>     /|   |\\</div>
        <div>    (_|   |_)</div>
        <div>&gt; done ✓<span class="cur"></span></div>
      </div>
    </div>
  </div>`;

  D.crt = () => `<div class="stage d-crt">
    ${SV(`<g class="ship"><polygon points="120,58 146,104 132,98 120,118 108,98 94,104"/><polyline points="112,98 120,88 128,98"/></g>
      <g class="rock r1"><polygon points="40,40 56,34 66,46 60,60 44,58 36,48"/></g>
      <g class="rock r2"><polygon points="186,124 200,118 212,128 206,142 190,142"/></g>
      <g class="rock r3"><polygon points="190,40 200,36 206,46 196,52"/></g>`)}
    <div class="ab hud">SCORE 00842</div>
    <div class="ab lines"></div>
  </div>`;

  D.glitch = () => `<div class="stage d-glitch">
    <div class="ab bars"></div>
    <div class="ab gw"><span class="g t">CLAUDE</span><span class="g r">CLAUDE</span><span class="g c">CLAUDE</span></div>
    <div class="ab sub"><span>動畫風格</span></div>
    <div class="ab sig">▌▌ SIGNAL LOST</div>
  </div>`;

  D.spellgrid = () => {
    const rows = ['GJZVIA', 'QWJRFL', 'CLAUDE', 'XZDHJM', 'UVMAGU'];
    let cells = '';
    rows.forEach((r, ri) => r.split('').forEach((ch, ci) => {
      cells += ri === 2 ? `<i class="hit" style="--i:${ci}">${ch}</i>` : `<i>${ch}</i>`;
    }));
    return `<div class="stage d-spell">
      ${SV(`<circle class="ring" cx="120" cy="90" r="80"/><circle class="ring r2" cx="120" cy="90" r="68"/>`)}
      <div class="ab grid">${cells}</div>
    </div>`;
  };

  D.blueprint = () => `<div class="stage d-blue">
    ${SV(`${DR('M120 30 C88 30 80 62 95 88 L108 110 L132 110 L145 88 C160 62 152 30 120 30 Z', 'b1')}
      ${DR('M120 30 C108 50 107 86 113 110', 'b2')}${DR('M120 30 C132 50 133 86 127 110', 'b2')}
      ${DR('M110 110 L113 126 M130 110 L127 126', 'b3')}
      ${DR('M111 126 H129 V140 H111 Z', 'b3')}
      <g class="dim"><path d="M82 18 H158 M82 14 V22 M158 14 V22"/><path d="M172 30 V140 M168 30 H176 M168 140 H176" />
      <text x="120" y="12">Ø 18 m</text><text x="182" y="88" class="v">22 m</text></g>`)}
    <div class="ab dtag">BALLOON-01 / SCALE 1:100</div>
  </div>`;

  D.neonoutline = () => `<div class="stage d-nout">
    ${SV(`<path class="solid" d="M30 140 V110 H60 V80 H90 V125 H110 V58 H140 V100 H165 V84 H192 V140 Z"/>
      ${DR('M30 140 V110 H60 V80 H90 V125 H110 V58 H140 V100 H165 V84 H192 V140', 'edge')}
      <path class="base" d="M20 150 H220"/>`)}
  </div>`;

  D.synthwave = () => `<div class="stage d-synth">
    <div class="ab sun"></div>
    <div class="ab floor"><div class="grid"></div></div>
    <div class="ab cw">${cube('c-synth')}</div>
  </div>`;

  D.neonorbit = () => `<div class="stage d-orbit">
    ${SV(`<path class="ring back" d="M60 100 A60 18 0 0 1 180 100"/>`, 'z1')}
    <div class="ab planet"></div>
    ${SV(`<path class="ring front" d="M60 100 A60 18 0 0 0 180 100"/>`, 'z3')}
    <div class="ab spark"></div>
  </div>`;

  D.pixelbeam = () => {
    let cells = '';
    for (let r = 0; r < 7; r++) for (let c = 0; c < 12; c++) cells += `<i style="--c:${c};--r:${r}"></i>`;
    return `<div class="stage d-pbeam"><div class="ab grid">${cells}</div><div class="ab beam"></div></div>`;
  };

  D.pixelbolt = () => {
    const pts = [[120, 20], [112, 28], [104, 36], [112, 44], [104, 52], [96, 60], [104, 68], [112, 76], [104, 84], [96, 92], [104, 100], [112, 108], [104, 116], [112, 124], [120, 132]];
    const bolt = pts.map(p => `<rect x="${p[0]}" y="${p[1]}" width="9" height="9"/>`).join('');
    let parts = '';
    const R = rng(7);
    for (let i = 0; i < 14; i++) {
      const a = R() * Math.PI - Math.PI;
      const dist = 30 + R() * 50;
      parts += `<i style="--dx:${(Math.cos(a) * dist).toFixed(0)}px;--dy:${(Math.sin(a) * dist * .7).toFixed(0)}px"></i>`;
    }
    return `<div class="stage d-bolt">
      <div class="ab cloud c1"></div><div class="ab cloud c2"></div>
      ${SV(`<g class="bolt">${bolt}</g>`)}
      <div class="ab parts">${parts}</div>
      <div class="ab flash"></div>
    </div>`;
  };

  /* ============ 手作材質 ============ */
  const hill = 'M0 40 Q60 0 120 40 T240 40 T360 40 T480 40 V110 H0 Z';
  D.papercut = () => `<div class="stage d-paper">
    <div class="ab sun"></div>
    <div class="ab cloud c1"></div><div class="ab cloud c2"></div>
    <div class="ab balloon"><svg viewBox="0 0 40 56"><path d="M20 2 C6 2 2 14 6 24 L14 38 H26 L34 24 C38 14 34 2 20 2Z" fill="#ff6b5a"/><path d="M20 2 C14 10 14 28 17 38 H23 C26 28 26 10 20 2Z" fill="#fff3e0"/><rect x="15" y="42" width="10" height="9" rx="2" fill="#a9643a"/></svg></div>
    <svg class="ab hill h1" viewBox="0 0 480 110"><path d="${hill}"/></svg>
    <svg class="ab hill h2" viewBox="0 0 480 110"><path d="${hill}"/></svg>
    <svg class="ab hill h3" viewBox="0 0 480 110"><path d="${hill}"/></svg>
  </div>`;

  D.clay = () => `<div class="stage d-clay">
    <div class="ab floor"></div>
    <div class="ab shadow"></div>
    <div class="ab ball"><i class="e1"></i><i class="e2"></i></div>
    <div class="ab dtag">FRAME 071 · 12fps</div>
  </div>`;

  D.claybox = () => `<div class="stage d-cbox">
    <div class="ab box">
      <div class="ab sky"></div><div class="ab sunb"></div>
      <div class="ab ground"></div>
      <div class="ab house"><i class="roof"></i><i class="wall"></i><i class="door"></i></div>
      <div class="ab tree"><i class="crown"></i><i class="trunk"></i></div>
      <div class="ab kid"><i class="head"></i><i class="body"></i><i class="arm"></i></div>
    </div>
  </div>`;

  D.bricks = () => {
    const cols = ['#e63946', '#ffb703', '#219ebc', '#2a9d8f', '#e63946', '#fb8500', '#3a86ff', '#ffb703', '#2a9d8f', '#e63946'];
    const pos = [[40, 140], [80, 140], [120, 140], [160, 140], [60, 118], [100, 118], [140, 118], [80, 96], [120, 96], [100, 74]];
    const b = pos.map((p, i) => `<i class="brick" style="left:${p[0]}px;top:${p[1]}px;--c:${cols[i]};--d:${(i * .2).toFixed(2)}s"></i>`).join('');
    return `<div class="stage d-bricks"><div class="ab ground"></div>${b}<div class="ab count">10 / 10 塊</div></div>`;
  };

  D.miniature = () => `<div class="stage d-mini">
    <div class="ab road h"></div><div class="ab road v"></div>
    <i class="ab hs" style="left:22px;top:20px;--c:#ff6b6b"></i><i class="ab hs" style="left:62px;top:28px;--c:#ffd166"></i>
    <i class="ab hs" style="left:160px;top:18px;--c:#4dabf7"></i><i class="ab hs" style="left:196px;top:34px;--c:#c77dff"></i>
    <i class="ab hs" style="left:30px;top:128px;--c:#63e6be"></i><i class="ab hs" style="left:168px;top:130px;--c:#ff922b"></i>
    <i class="ab tr" style="left:80px;top:130px"></i><i class="ab tr" style="left:206px;top:126px"></i><i class="ab tr" style="left:100px;top:24px"></i>
    <i class="ab car c1"></i><i class="ab car c2"></i>
    <div class="ab tilt top"></div><div class="ab tilt bot"></div>
  </div>`;

  D.knit = () => `<div class="stage d-knit">
    <div class="ab yarn"></div>
    ${SV(`<path class="thread" d="M46 150 C80 170 90 120 104 128"/>`)}
    <div class="ab doll">
      <i class="arm al"></i><i class="arm ar"></i>
      <i class="leg ll"></i><i class="leg lr"></i>
      <i class="body"></i>
      <i class="head"><b class="eye e1"></b><b class="eye e2"></b><b class="cheek"></b></i>
    </div>
  </div>`;

  D.mosaic = () => {
    const R = rng(42);
    const blues = ['#1f6feb', '#3a86ff', '#5aa9ff', '#4361ee', '#2f80ed'];
    let t = '';
    for (let r = 0; r < 7; r++) for (let c = 0; c < 9; c++) {
      const d = Math.hypot(c - 4, (r - 3) * 1.05);
      let col = d < 1.3 ? '#ffe066' : d < 2.2 ? '#ffb703' : d < 3 ? '#fb8500' : blues[Math.floor(R() * blues.length)];
      const x = ((R() - .5) * 320).toFixed(0), y = ((R() - .5) * 240).toFixed(0), ro = ((R() - .5) * 360).toFixed(0);
      t += `<i style="--col:${col};--x:${x}px;--y:${y}px;--r:${ro}deg;--d:${(R() * .7).toFixed(2)}s"></i>`;
    }
    return `<div class="stage d-mosaic"><div class="ab grid">${t}</div></div>`;
  };

  D.watercolor = () => `<div class="stage d-water">
    <i class="ab wb w1"></i><i class="ab wb w2"></i><i class="ab wb w3"></i><i class="ab wb w4"></i><i class="ab wb w5"></i>
    <div class="ab paper"></div>
  </div>`;

  D.inkwash = () => `<div class="stage d-ink">
    <i class="ab moon"></i>
    ${SV(`<path class="m m1" d="M0 110 C30 70 50 60 70 80 C90 40 110 30 130 70 C150 50 170 55 190 75 C205 60 225 60 240 80 V180 H0 Z"/>
      <path class="m m2" d="M0 130 C25 100 45 95 65 112 C85 85 105 80 125 108 C150 92 175 100 200 118 C215 110 230 112 240 120 V180 H0 Z"/>
      <path class="m m3" d="M0 150 C30 135 60 140 80 150 C110 160 150 150 180 152 C210 156 230 150 240 152 V180 H0 Z"/>
      <g class="boat"><path d="M0 0 H26 L20 6 H6 Z"/><path d="M12 0 V-12" class="mast"/></g>`)}
    <div class="ab mist"></div>
    <div class="ab seal">山水</div>
  </div>`;

  D.woodblock = () => `<div class="stage d-wood">
    <div class="ab grain"></div>
    ${SV(`<path class="mt" d="M150 150 L176 118 L202 150 Z"/><path class="mtc" d="M168 128 L176 118 L184 128 L178 126 L176 130 L172 126 Z"/>
      <g class="wave">
        <path class="w1" d="M0 180 C10 120 50 66 116 58 C158 54 184 74 180 100 C177 118 156 122 150 108 C146 98 157 92 164 98 C160 80 136 74 116 86 C86 104 82 146 96 180 Z"/>
        <path class="w2" d="M30 180 C38 140 64 106 100 96 C80 116 76 150 84 180 Z"/>
        <g class="foam"><circle cx="164" cy="98" r="3"/><circle cx="174" cy="92" r="2.4"/><circle cx="154" cy="88" r="2.6"/><circle cx="182" cy="104" r="2"/><circle cx="144" cy="80" r="2"/></g>
      </g>
      <path class="boat" d="M120 150 Q160 160 210 146 L206 154 Q160 166 124 158 Z"/>
      <g class="sea"><path d="M96 168 Q120 158 144 168 T192 168 T240 168"/><path d="M100 176 Q124 166 148 176 T196 176 T244 176"/></g>`)}
    <div class="ab card">浪</div>
  </div>`;

  D.storybook = () => `<div class="stage d-book">
    <div class="ab book">
      <div class="pg left"><p class="type">很久很久以前……</p><i class="ln"></i><i class="ln s"></i><i class="ln"></i></div>
      <div class="pg right">
        <i class="sun"></i><i class="tree"></i><i class="trunk"></i><i class="fox"></i><i class="hill"></i>
      </div>
      <div class="pg flip"></div>
    </div>
  </div>`;

  /* ============ 動漫遊戲 ============ */
  D.animecel = () => `<div class="stage d-anime">
    <div class="ab speed"></div>
    ${SV(`<g class="hero">
        <path class="scarf" d="M108 94 L64 84 L70 100 L110 102 Z"/>
        <path class="leg" d="M110 138 L96 162 M128 138 L146 158"/>
        <path class="body" d="M104 94 H136 L142 140 H98 Z"/>
        <path class="bshade" d="M124 94 H136 L142 140 H128 Z"/>
        <circle class="face" cx="120" cy="74" r="18"/>
        <path class="fshade" d="M126 57 A18 18 0 0 1 126 91 Q134 74 126 57 Z"/>
        <polygon class="hair" points="100,72 96,50 108,58 110,40 120,54 130,38 133,55 146,46 141,70 128,62 112,62"/>
        <rect class="eye" x="124" y="70" width="4" height="8" rx="1.5"/>
      </g>`)}
    <div class="ab pow">衝刺！</div>
  </div>`;

  D.comic = () => `<div class="stage d-comic">
    <div class="ab panel">
      <div class="ab dots"></div>
      <div class="ab face"><i class="ey e1"></i><i class="ey e2"></i><i class="mo"></i></div>
      <div class="ab burst"><span>POW!</span></div>
      <div class="ab bubble">WHAT?!</div>
      <div class="ab cap">MEANWHILE, #10…</div>
    </div>
  </div>`;

  D.explainer = () => `<div class="stage d-expl">
    <div class="ab board">
      <i class="bar" style="--h:40px;--c:#ff6b6b;--d:.6s"></i><i class="bar" style="--h:62px;--c:#20c997;--d:.9s"></i><i class="bar" style="--h:86px;--c:#ffc93c;--d:1.2s"></i>
    </div>
    <div class="ab blob"><i class="e1"></i><i class="e2"></i><i class="arm"></i></div>
    <div class="ab bubble">比較一下</div>
  </div>`;

  D.rubberhose = () => `<div class="stage d-hose">
    <div class="ab curtain"></div>
    ${SV(`<g class="pal">
        <g class="armL"><path d="M106 100 C90 96 84 80 76 70"/><circle cx="74" cy="66" r="7" class="glove"/></g>
        <g class="armR"><path d="M134 100 C150 96 156 80 164 70"/><circle cx="166" cy="66" r="7" class="glove"/></g>
        <path d="M110 128 C108 140 100 148 94 156" class="limb"/><path d="M130 128 C132 140 140 148 146 156" class="limb"/>
        <ellipse cx="92" cy="158" rx="10" ry="5" class="shoe"/><ellipse cx="148" cy="158" rx="10" ry="5" class="shoe"/>
        <ellipse cx="120" cy="114" rx="18" ry="22" class="blk"/>
        <circle cx="120" cy="72" r="20" class="blk"/>
        <ellipse cx="120" cy="54" rx="22" ry="4" class="blk"/><path d="M108 54 Q108 36 120 36 Q132 36 132 54 Z" class="blk"/><path d="M109 50 H131" class="band"/>
        <ellipse cx="120" cy="80" rx="13" ry="10" class="wht"/>
        <ellipse cx="114" cy="68" rx="4" ry="7" class="wht"/><ellipse cx="126" cy="68" rx="4" ry="7" class="wht"/>
        <ellipse cx="115" cy="70" rx="2" ry="4" class="blk"/><ellipse cx="127" cy="70" rx="2" ry="4" class="blk"/>
        <path d="M112 84 Q120 92 128 84" class="mouth"/>
      </g>`)}
    <div class="ab grain"></div><div class="ab scratch"></div><div class="ab vig"></div>
  </div>`;

  D.flatvector = () => `<div class="stage d-flat">
    <i class="ab sun"></i>
    <i class="ab cl c1"></i><i class="ab cl c2"></i>
    <i class="ab bd" style="left:20px;height:70px;--c:#ffd6a5"></i><i class="ab bd" style="left:52px;height:96px;--c:#a0c4ff"></i>
    <i class="ab bd" style="left:88px;height:58px;--c:#ffadad"></i><i class="ab bd" style="left:150px;height:84px;--c:#caffbf"></i>
    <i class="ab bd" style="left:184px;height:110px;--c:#bdb2ff"></i>
    <i class="ab hillf"></i>
    <svg class="ab plane" viewBox="0 0 30 20"><path d="M0 10 L30 0 L18 20 L14 12 Z" fill="#fff"/><path d="M14 12 L30 0 L18 20 Z" fill="#dbe4ff"/></svg>
  </div>`;

  // 像素小人（字元地圖 → box-shadow）
  function sprite(map, px, colors) {
    const sh = [];
    map.forEach((row, y) => row.split('').forEach((ch, x) => {
      if (colors[ch]) sh.push(`${x * px}px ${y * px}px 0 ${colors[ch]}`);
    }));
    return sh.join(',');
  }
  const HERO = sprite(['..RRRR..', '.RRRRRR.', '.SSHSS..', 'SSSSSSS.', '..SSSS..', '.BRBBRB.', 'BBBBBBBB', 'S.BBBB.S', '..B..B..', '.NN..NN.'], 4,
    { R: '#7b61ff', S: '#ffc9a0', H: '#3b2314', B: '#10b49f', N: '#1d1b3a' });
  D.pixelart = () => `<div class="stage d-pixel">
    <i class="ab pc c1"></i><i class="ab pc c2"></i>
    <div class="ab qb">?</div>
    <i class="ab coin"></i>
    <div class="ab hero"><i style="box-shadow:${HERO}"></i></div>
    <div class="ab ground"></div>
    <div class="ab hud">SCORE 003800 &nbsp; ●×11</div>
  </div>`;

  D.lowpoly = () => `<div class="stage d-poly">
    ${SV(`<g class="mts">
      <polygon points="0,104 30,60 60,104" fill="#6c7a89"/><polygon points="30,60 60,104 48,104" fill="#56636f"/>
      <polygon points="40,104 80,50 120,104" fill="#7f8c9b"/><polygon points="80,50 120,104 96,104" fill="#5e6b7a"/>
      <polygon points="120,104 165,56 210,104" fill="#74838f"/><polygon points="165,56 210,104 180,104" fill="#56636f"/>
      <polygon points="190,104 220,72 250,104" fill="#8796a5"/></g>`)}
    <div class="ab ground"><div class="road"></div></div>
    <div class="ab fog"></div>
    ${SV(`<g class="car">
      <polygon points="96,150 144,150 150,164 90,164" fill="#d62828"/>
      <polygon points="104,138 136,138 144,150 96,150" fill="#ef4444"/>
      <polygon points="108,140 132,140 138,149 102,149" fill="#1e293b"/>
      <polygon points="90,164 150,164 148,170 92,170" fill="#7f1d1d"/>
      <rect x="92" y="156" width="8" height="4" fill="#fde68a"/><rect x="140" y="156" width="8" height="4" fill="#fde68a"/></g>`, 'top')}
    <div class="ab spd">113 km/h</div>
  </div>`;

  D.emotion = () => {
    let f = '';
    for (let i = 0; i < 6; i++) f += `<div class="fc" style="--i:${i}"><i class="br b1"></i><i class="br b2"></i><i class="ey e1"></i><i class="ey e2"></i><i class="mo"></i></div>`;
    return `<div class="stage d-emo"><div class="ab grid">${f}</div></div>`;
  };

  D.minimal = () => `<div class="stage d-min">
    ${SV(`${DR('M10 140 H52 L66 96 L76 140 H108 Q140 104 172 140 H230', 'ln')}
      ${DR('M190 40 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0', 'ln sun')}`)}
    <div class="ab quote">less is more.</div>
  </div>`;

  D.dankoe = () => `<div class="stage d-dk">
    <div class="ab ttl">• 思考的方式</div>
    ${SV(`<circle cx="140" cy="82" r="18" class="c"/><circle cx="140" cy="82" r="38" class="c"/><circle cx="140" cy="82" r="58" class="c dash"/>
      <g class="orb"><circle cx="140" cy="44" r="3.5" class="dot"/></g>
      <g class="stick"><circle cx="54" cy="112" r="6"/><path d="M54 118 V140 M54 126 L44 134 M54 126 L64 120 M54 140 L46 154 M54 140 L62 154"/></g>
      <path d="M20 156 H220" class="c"/>`)}
    <div class="ab q">看見全局，才能專注</div>
  </div>`;

  D.storyboard = () => {
    const man = `<i class="hd"></i><i class="bd"></i>`;
    return `<div class="stage d-sb">
      <div class="ab pn p1"><b>起因</b>${man}<i class="ball"></i></div>
      <div class="ab pn p2"><b>行動</b>${man}<i class="ball mv"></i></div>
      <div class="ab pn p3"><b>結果</b>${man}<i class="ball end"></i><span class="bang">!</span></div>
    </div>`;
  };

  D.noir = () => `<div class="stage d-noir">
    <i class="ab bd" style="left:8px;width:34px;height:110px"></i><i class="ab bd" style="left:46px;width:26px;height:140px"></i>
    <i class="ab bd" style="left:170px;width:30px;height:126px"></i><i class="ab bd" style="left:204px;width:30px;height:96px"></i>
    <div class="ab spot"></div>
    <div class="ab man"><i class="hat"></i><i class="hd"></i><i class="coat"></i></div>
    <div class="ab shad"></div>
    <div class="ab rain"></div>
  </div>`;

  /* ============ 立體數據 ============ */
  D.isometric = () => `<div class="stage d-iso">
    ${SV(`<g class="gridl"><path d="M0 150 L240 30 M0 110 L160 30 M40 180 L240 80 M0 30 L240 150 M60 0 L240 90 M0 80 L200 180"/></g>
      ${isoBox(60, 140, 26, 26, '#ffe066', '#f4b400', '#d99a00')}
      ${isoBox(120, 110, 26, 26, '#74c0fc', '#339af0', '#1c7ed6')}
      ${isoBox(180, 80, 26, 26, '#8ce99a', '#40c057', '#2f9e44')}
      <text x="48" y="168">輸入</text><text x="108" y="138">處理</text><text x="168" y="108">輸出</text>`)}
    <i class="ab pk k1"></i><i class="ab pk k2"></i><i class="ab pk k3"></i>
  </div>`;

  D.cgi = () => `<div class="stage d-cgi">
    <div class="ab stagefloor"></div>
    <i class="ab sh s1"></i><i class="ab sh s2"></i><i class="ab sh s3"></i>
    <i class="ab sp p1"></i><i class="ab sp p2"></i><i class="ab sp p3"></i>
  </div>`;

  D.explainer3d = () => `<div class="stage d-mol">
    <div class="ab ml top">氧原子 O</div>
    <div class="ab mol">
      <i class="bond b1"></i><i class="bond b2"></i>
      <i class="at o"><b></b></i><i class="at h1"><b></b></i><i class="at h2"><b></b></i>
    </div>
    <div class="ab ml bot">H₂O　鍵角 104.5°</div>
  </div>`;

  D.zackd = () => `<div class="stage d-zack">
    <div class="ab zl l1">${SV(`<circle cx="120" cy="90" r="60" class="cell"/><circle cx="120" cy="90" r="20" class="nuc"/><circle cx="90" cy="70" r="6" class="org"/><circle cx="150" cy="112" r="8" class="org"/>`)}</div>
    <div class="ab zl l2">${SV(`<path class="dna" d="${sinePath(40, 160, 90, 22, 32)}"/><path class="dna b" d="${sinePath(40, 160, 90, -22, 32)}"/>`)}</div>
    <div class="ab zl l3">${SV(`<circle cx="120" cy="90" r="50" class="cell"/><circle cx="104" cy="80" r="12" class="nuc"/><circle cx="136" cy="102" r="10" class="nuc"/>`)}</div>
    <div class="ab mag">×600</div>
    <div class="ab cap">再放大：細胞核</div>
  </div>`;

  D.chart3d = () => {
    const hs = [34, 70, 52, 100, 82];
    const cols = [['#ff8787', '#fa5252', '#c92a2a'], ['#63e6be', '#20c997', '#0ca678'], ['#ffe066', '#fcc419', '#e0a800'], ['#74c0fc', '#339af0', '#1971c2'], ['#d0bfff', '#9775fa', '#7048e8']];
    let bars = '';
    hs.forEach((h, i) => {
      const x = 44 + i * 36;
      bars += `<g class="bar" style="--d:${i * .25}s">
        <rect x="${x}" y="${150 - h}" width="20" height="${h}" fill="${cols[i][1]}"/>
        <polygon points="${x + 20},${150 - h} ${x + 28},${144 - h} ${x + 28},144 ${x + 20},150" fill="${cols[i][2]}"/>
        <polygon points="${x},${150 - h} ${x + 8},${144 - h} ${x + 28},${144 - h} ${x + 20},${150 - h}" fill="${cols[i][0]}"/></g>`;
    });
    return `<div class="stage d-chart">${SV(`<path class="ax" d="M34 20 V150 H230"/>${bars}
      <g class="lbl"><text x="52" y="166">1</text><text x="88" y="166">2</text><text x="124" y="166">3</text><text x="160" y="166">4</text><text x="196" y="166">5</text></g>`)}
      <div class="ab note">示意數據</div></div>`;
  };

  D.statreveal = () => `<div class="stage d-stat">
    <div class="ab ring"><div class="num"></div></div>
    <div class="ab track"><i></i></div>
    <div class="ab cap">統計揭示｜示意數據</div>
  </div>`;

  D.maths = () => {
    const wave = sinePath(112, 116, 90, 36);
    return `<div class="stage d-math">
      ${SV(`<path class="ax" d="M14 90 H232 M60 40 V140"/><circle cx="60" cy="90" r="36" class="uc"/>
        <g class="rad"><path d="M60 90 H96" class="r"/><circle cx="96" cy="90" r="4" class="pt"/></g>
        <path class="wave" pathLength="1" d="${wave}"/>`)}
      <i class="ab wd" style="offset-path:path('${wave}')"></i>
      <div class="ab eq">y = sin θ</div>
    </div>`;
  };

  D.marble = () => {
    const track = 'M28 28 L204 52 L36 86 L204 116 L36 146 L132 160';
    return `<div class="stage d-marble">
      ${SV(`<path class="tk" d="${track}"/><path class="tk2" d="${track}"/>
        <g class="cp"><circle cx="204" cy="52" r="8"/><text x="204" y="56">1</text><circle cx="36" cy="86" r="8"/><text x="36" y="90">2</text>
        <circle cx="204" cy="116" r="8"/><text x="204" y="120">3</text><circle cx="36" cy="146" r="8"/><text x="36" y="150">4</text></g>
        <path class="cup" d="M132 152 v14 h22 v-14"/>`)}
      <i class="ab ball" style="offset-path:path('${track}')"></i>
    </div>`;
  };

  const sector = (r) => `M120 90 L120 ${90 - r} A${r} ${r} 0 0 1 ${120 + r} 90 Z`;
  D.cutaway = () => `<div class="stage d-cut">
    ${SV(`<circle cx="120" cy="90" r="52" class="sea"/>
      <path class="land" d="M80 70 C90 56 104 60 100 74 C96 86 84 92 78 84 Z M96 112 C110 104 120 116 112 128 C104 136 92 126 96 112 Z M136 112 C150 108 160 118 152 126 C146 132 134 124 136 112Z"/>
      <g class="layers"><path d="${sector(52)}" fill="#a0522d"/><path d="${sector(46)}" fill="#f97316"/><path d="${sector(28)}" fill="#fb923c"/><path d="${sector(16)}" fill="#fde047"/></g>
      <path class="cover" d="${sector(52)}"/>
      <g class="labs"><path d="M150 52 L192 30 M156 72 L200 70 M128 84 L196 112"/><text x="194" y="28">地殼</text><text x="202" y="73">地函</text><text x="198" y="116">地核</text></g>`)}
    <div class="ab cap">地球內部構造</div>
  </div>`;

  D.exploded = () => {
    // [類別, 名稱, 疊起來的位置, 拆開後的位置]
    const L = [['bun-t', '上層麵包', -24, -66], ['let', '生菜', -6, -40], ['tom', '番茄', 0, -16], ['che', '起司', 6, 8], ['pat', '肉排', 11, 32], ['bun-b', '下層麵包', 22, 58]];
    return `<div class="stage d-burger">
      <i class="ab axis"></i>
      ${L.map(l => `<div class="ab ly ${l[0]}" style="--s0:${l[2]}px;--o:${l[3]}px"><i></i><span>${l[1]}</span></div>`).join('')}
      <div class="ab dtag">EXPLODED VIEW</div>
    </div>`;
  };

  D.solid3d = () => `<div class="stage d-solid"><i class="ab flr"></i><div class="ab cw">${cube('c-solid')}</div></div>`;
  D.retro3d = () => `<div class="stage d-r3d"><div class="ab floor"><div class="grid"></div></div><div class="ab cw">${cube('c-retro')}</div></div>`;

  D.pixelexplain = () => {
    const R = rng(11), pal = ['#ff6b6b', '#ffd43b', '#51cf66', '#339af0', '#cc5de8', '#ff922b', '#22b8cf'];
    let c = '';
    for (let r = 0; r < 7; r++) for (let k = 0; k < 13; k++) c += `<i style="--c:${pal[Math.floor(R() * pal.length)]};--k:${k + r * .5}"></i>`;
    return `<div class="stage d-pex"><div class="ab grid">${c}</div><div class="ab sl"><i></i></div><div class="ab cap">格點 → 訊號依序傳遞</div></div>`;
  };

  /* ============ 教學圖解 ============ */
  D.flowchart = () => {
    const tok = 'M120 17 V47 V82 H178 V117 V140 H120 V159';
    return `<div class="stage d-flow">
      ${SV(`<path class="ar" d="M120 26 V38 M120 56 V67 M98 82 H62 V108 M142 82 H178 V108 M62 126 V140 H178 M178 126 V140 M120 140 V150"/>`)}
      <div class="ab nd n0" style="--d:0s">開始</div>
      <div class="ab nd n1" style="--d:.4s">讀題目</div>
      <div class="ab nd dm" style="--d:.8s"><span>會寫嗎？</span></div>
      <div class="ab nd n3" style="--d:1.2s">查課本</div>
      <div class="ab nd n4" style="--d:1.2s">寫答案</div>
      <div class="ab nd n5" style="--d:1.6s">完成！</div>
      <i class="ab tok" style="offset-path:path('${tok}')"></i>
    </div>`;
  };

  D.whiteboard = () => `<div class="stage d-wb">
    ${SV(`<g class="rays">${DR('M86 40 L76 32')}${DR('M120 22 V10')}${DR('M154 40 L164 32')}${DR('M76 70 H64')}${DR('M164 70 H176')}</g>
      ${DR('M100 78 C90 58 104 34 120 34 C136 34 150 58 140 78 C136 86 132 90 132 100 H108 C108 90 104 86 100 78 Z', 'bulb')}
      ${DR('M110 106 H130 M112 112 H128', 'base')}
      ${DR('M112 84 L116 72 L120 84 L124 72 L128 84', 'fil')}`, 'pen')}
    <div class="ab txt"><span class="w">點子</span><br>＝畫出來</div>
    <div class="ab chk">✓看 ✓想 ✓畫</div>
  </div>`;

  D.timeline = () => {
    const ev = [['1928', '黑白', '#ff6b6b'], ['1937', '長片', '#ffa94d'], ['1995', '3D', '#ffd43b'], ['2010', 'HTML5', '#51cf66'], ['2026', 'AI', '#4dabf7']];
    return `<div class="stage d-tl">
      ${SV(DR('M16 96 H224', 'ln'))}
      ${ev.map((e, i) => `<div class="ab ev" style="left:${30 + i * 45}px;--d:${.5 + i * .45}s;--c:${e[2]}"><b>${e[0]}</b><i></i><span>${e[1]}</span></div>`).join('')}
      <i class="ab ptr"></i>
      <div class="ab cap">時間方向 →</div>
    </div>`;
  };

  D.sketchnote = () => `<div class="stage d-sk">
    ${SV(`<g class="boil">
      ${DR('M86 70 C84 56 92 52 120 53 C150 52 158 56 156 70 C158 86 150 90 120 89 C92 90 84 86 86 70 Z', 'box')}
      ${DR('M84 74 C60 74 50 90 46 112', 'ar a1')}${DR('M42 104 L46 114 L54 106', 'ar a1')}
      ${DR('M158 66 C182 60 194 46 198 30', 'ar a2')}${DR('M190 34 L199 28 L202 38', 'ar a2')}
      ${DR('M160 80 C182 88 192 104 198 124', 'ar a3')}${DR('M190 118 L198 126 L204 116', 'ar a3')}
      ${DR('M30 34 L36 22 L42 34 L54 36 L44 44 L47 56 L36 49 L25 56 L28 44 L18 36 Z', 'star')}
      </g>`)}
    <i class="ab hl"></i>
    <div class="ab key">重點</div>
    <div class="ab n1">定義</div><div class="ab n2">例子</div><div class="ab n3">比較</div>
  </div>`;

  D.mindmap = () => {
    const br = [[48, 36, '#ff6b6b', '分支1'], [192, 36, '#fcc419', '分支2'], [48, 144, '#4dabf7', '分支3'], [192, 144, '#cc5de8', '分支4']];
    return `<div class="stage d-mm">
      ${SV(br.map((b, i) => DR(`M120 90 Q${(120 + b[0]) / 2} ${b[1] > 90 ? 100 : 80} ${b[0]} ${b[1]}`, '', `style="stroke:${b[2]};--d:${.4 + i * .3}s"`)).join('') +
        br.map((b, i) => DR(`M${b[0]} ${b[1]} L${b[0] + (b[0] < 120 ? -22 : 22)} ${b[1] + (b[1] < 90 ? -18 : 18)}`, 'sub', `style="stroke:${b[2]};--d:${1.6 + i * .2}s"`)).join(''))}
      <div class="ab core">主題</div>
      ${br.map((b, i) => `<div class="ab nd" style="left:${b[0] - 26}px;top:${b[1] - 12}px;--c:${b[2]};--d:${.7 + i * .3}s">${b[3]}</div>`).join('')}
    </div>`;
  };

  D.chalkboard = () => `<div class="stage d-chalk">
    <div class="ab board"></div>
    <div class="ab ttl">戰術 A：兩翼包抄</div>
    ${SV(`<g class="ch">
      ${DR('M40 120 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'o1')}
      ${DR('M90 70 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'o2')}
      ${DR('M150 120 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'o3')}
      ${DR('M62 132 L74 144 M74 132 L62 144', 'x1')}${DR('M122 84 L134 96 M134 84 L122 96', 'x2')}
      ${DR('M48 112 C70 60 110 40 160 54', 'a1 dash')}${DR('M152 46 L162 54 L150 60', 'a1')}
      ${DR('M98 76 C120 110 160 116 200 100', 'a2 dash')}${DR('M192 94 L202 100 L192 108', 'a2')}
    </g>`)}
  </div>`;

  D.conceptmap = () => {
    const nodes = [[24, 38, 112, 24], [92, 38, 40, 70], [160, 38, 170, 120], [160, 112, 30, 140], [92, 112, 200, 30], [24, 112, 120, 150]];
    const cols = ['#ff6b6b', '#20c997', '#fcc419', '#4dabf7', '#cc5de8', '#ff6fb5'];
    return `<div class="stage d-cmap">
      ${SV(DR('M80 50 H92 M148 50 H160 M188 62 V112 M160 124 H148 M92 124 H80', 'cn'))}
      ${nodes.map((n, i) => `<div class="ab nd" style="left:${n[0]}px;top:${n[1]}px;--sx:${n[2] - n[0]}px;--sy:${n[3] - n[1]}px;--c:${cols[i]}">步驟${i + 1}</div>`).join('')}
    </div>`;
  };

  window.DEMOS = D;

  /* 縮放：讓 240×180 的舞台填滿容器 */
  const ro = 'ResizeObserver' in window ? new ResizeObserver(entries => {
    entries.forEach(e => {
      const w = e.contentRect.width;
      if (w > 0) e.target.style.setProperty('--s', (w / 240).toFixed(4));
    });
  }) : null;

  window.mountDemo = function (el, id) {
    const fn = D[id];
    el.innerHTML = fn ? fn() : '';
    el.dataset.demo = id;
    if (ro) ro.observe(el);
    else el.style.setProperty('--s', (el.clientWidth / 240).toFixed(4));
  };
})();
