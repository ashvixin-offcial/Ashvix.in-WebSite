/* =========================================================
   ASHVIX SOLUTIONS - 3D EXPERIENCE
   - Real WebGL 3D (Three.js): extruded AX logo, page scenes,
     and a fixed 3D background world.
   - CSS 3D: tilt cards, depth layers, exploded phone UI.
   - Nothing here touches forms, links or page workflow.
   ========================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var isSmall = window.innerWidth < 760;
  var TAU = Math.PI * 2;

  /* ---------- logo geometry (traced from the AX logo) ---------- */
  var LOGO = [{"id":"A","kind":"silver","pts":[[-0.7721,0.6967],[-2.0,-1.0856],[-1.6052,-1.0856],[-0.7866,0.1771],[-0.2961,-0.5602],[-0.0435,-0.3832]]},{"id":"A2","kind":"silver","pts":[[-0.1655,-0.8215],[0.119,-0.6444],[0.4151,-1.0798],[-0.0029,-1.0798]]},{"id":"TL","kind":"gold","pts":[[-0.2961,0.5486],[0.18,0.5486],[0.4412,0.1597],[0.1829,-0.1016]]},{"id":"BR","kind":"gold","pts":[[0.4499,-0.4064],[0.7112,-0.1655],[1.3556,-1.0798],[0.9173,-1.0798]]},{"id":"SW","kind":"gold","pts":[[-1.3759,-1.1669],[-1.327,-1.1548],[-1.2781,-1.1422],[-1.2291,-1.1253],[-1.1802,-1.1054],[-1.1313,-1.0837],[-1.0823,-1.0605],[-1.0334,-1.0386],[-0.9845,-1.0157],[-0.9356,-0.9919],[-0.8866,-0.9671],[-0.8377,-0.9413],[-0.7888,-0.9146],[-0.7399,-0.8869],[-0.6909,-0.8583],[-0.642,-0.8287],[-0.5931,-0.7982],[-0.5442,-0.7667],[-0.4952,-0.7343],[-0.4463,-0.701],[-0.3974,-0.6668],[-0.3485,-0.6317],[-0.2995,-0.5957],[-0.2506,-0.5589],[-0.2017,-0.5211],[-0.1528,-0.4825],[-0.1038,-0.4429],[-0.0549,-0.4025],[-0.006,-0.3611],[0.043,-0.3187],[0.0919,-0.2754],[0.1408,-0.2312],[0.1897,-0.1859],[0.2387,-0.1398],[0.2876,-0.0927],[0.3365,-0.0447],[0.3854,0.0042],[0.4344,0.0538],[0.4833,0.1041],[0.5322,0.1551],[0.5811,0.2064],[0.6301,0.2581],[0.679,0.31],[0.7279,0.3618],[0.7768,0.4135],[0.8258,0.4646],[0.8747,0.5152],[0.9236,0.5649],[0.9726,0.6134],[1.0215,0.6607],[1.0704,0.7064],[1.1193,0.7504],[1.1683,0.7925],[1.2172,0.8326],[1.2661,0.8704],[1.315,0.906],[1.364,0.9392],[1.4129,0.9701],[1.4618,0.9986],[1.5107,1.0248],[1.5597,1.0487],[1.6086,1.0704],[1.6575,1.0901],[1.7064,1.1077],[1.7554,1.1202],[1.8043,1.1314],[1.8532,1.1412],[1.9021,1.1501],[1.9511,1.1575],[2.0,1.1669],[1.9511,1.1554],[1.9021,1.1407],[1.8532,1.1193],[1.8043,1.0923],[1.7554,1.0611],[1.7064,1.0263],[1.6575,0.9921],[1.6086,0.9553],[1.5597,0.9162],[1.5107,0.8746],[1.4618,0.8307],[1.4129,0.7844],[1.364,0.7358],[1.315,0.685],[1.2661,0.6322],[1.2172,0.5775],[1.1683,0.5213],[1.1193,0.4639],[1.0704,0.4054],[1.0215,0.3464],[0.9726,0.287],[0.9236,0.2276],[0.8747,0.1686],[0.8258,0.1103],[0.7768,0.0528],[0.7279,-0.0035],[0.679,-0.0584],[0.6301,-0.1117],[0.5811,-0.1634],[0.5322,-0.2134],[0.4833,-0.2616],[0.4344,-0.308],[0.3854,-0.3526],[0.3365,-0.3954],[0.2876,-0.4366],[0.2387,-0.4762],[0.1897,-0.5144],[0.1408,-0.5512],[0.0919,-0.5867],[0.043,-0.621],[-0.006,-0.6543],[-0.0549,-0.6865],[-0.1038,-0.7178],[-0.1528,-0.7481],[-0.2017,-0.7776],[-0.2506,-0.806],[-0.2995,-0.8336],[-0.3485,-0.8601],[-0.3974,-0.8856],[-0.4463,-0.9099],[-0.4952,-0.9331],[-0.5442,-0.9551],[-0.5931,-0.9758],[-0.642,-0.9952],[-0.6909,-1.0134],[-0.7399,-1.0303],[-0.7888,-1.0461],[-0.8377,-1.0608],[-0.8866,-1.0745],[-0.9356,-1.0875],[-0.9845,-1.0997],[-1.0334,-1.1114],[-1.0823,-1.1225],[-1.1313,-1.1306],[-1.1802,-1.1382],[-1.2291,-1.1452],[-1.2781,-1.1514],[-1.327,-1.1568]]}];

  /* =========================================================
     1. UI: mobile menu, reveal, tilt
     ========================================================= */
  function initMenu() {
    var nav = doc.querySelector('nav .nav');
    var links = nav && nav.querySelector('.links');
    if (!nav || !links) return;

    var start = nav.querySelector('.btn.primary');
    if (start) {
      var li = doc.createElement('a');
      li.className = 'links-cta';
      li.href = start.getAttribute('href');
      li.textContent = start.textContent;
      links.appendChild(li);
    }

    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    function close() {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') close(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 850) close(); });
  }

  function initReveal() {
    var singles = doc.querySelectorAll('.head, .cta, .product, .enquiry-form, .project-form, .hero-copy, .page-hero .hero-copy');
    var groups = doc.querySelectorAll('.grid, .workflow, .contacts');
    var i;
    for (i = 0; i < singles.length; i++) singles[i].classList.add('rv');
    for (i = 0; i < groups.length; i++) {
      groups[i].classList.add('rv-group');
      var kids = groups[i].children;
      for (var k = 0; k < kids.length; k++) kids[k].style.setProperty('--i', k);
    }
    var targets = doc.querySelectorAll('.rv, .rv-group');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      for (i = 0; i < targets.length; i++) targets[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    for (i = 0; i < targets.length; i++) io.observe(targets[i]);
  }

  function initTilt() {
    if (!finePointer || reduceMotion) return;
    var els = doc.querySelectorAll('.card, .cta, .step, .contact, .visual');
    els.forEach(function (el) {
      var max = el.classList.contains('visual') ? 5 : (el.classList.contains('cta') ? 3.5 : 8);
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        el.classList.add('is-tilting');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--rx', '0deg');
        el.classList.remove('is-tilting');
      });
    });
  }

  /* =========================================================
     2. WebGL 3D
     ========================================================= */
  var T = window.THREE;
  if (!T) { boot(); return; }

  var pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', function (e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  var items = [];       // every live 3D view
  var clock = 0;
  var lastNow = 0;
  var rafId = 0;

  /* ----- shared helpers ----- */
  function makeRenderer(canvas) {
    var r = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
    r.setClearColor(0x000000, 0);
    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    return r;
  }

  // Procedural "photo studio" environment so the metal has something bright to reflect.
  function softboxTexture() {
    var c = doc.createElement('canvas'); c.width = 256; c.height = 256;
    var g = c.getContext('2d');
    var grd = g.createLinearGradient(0, 0, 256, 256);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.35, '#eceff6');
    grd.addColorStop(0.62, '#8d97ad');
    grd.addColorStop(1, '#f4f6fb');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    var t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }
  function makeEnv(renderer) {
    var pm = new T.PMREMGenerator(renderer);
    var s = new T.Scene();
    s.add(new T.Mesh(new T.BoxGeometry(26, 26, 26), new T.MeshBasicMaterial({ color: new T.Color(0x3a4257).multiplyScalar(1.1), side: T.BackSide })));
    function panel(w, h, color, k, pos, map) {
      var mat = new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(k), side: T.DoubleSide });
      if (map) mat.map = map;
      var m = new T.Mesh(new T.PlaneGeometry(w, h), mat);
      m.position.set(pos[0], pos[1], pos[2]);
      m.lookAt(0, 0, 0);
      s.add(m);
    }
    panel(16, 12, 0xffffff, 1.7, [1, 1, 10], softboxTexture());   // big front softbox
    panel(14, 3, 0xffffff, 9, [0, 10, 4]);                        // top strip
    panel(3, 12, 0xfff0c8, 5, [-10, 1, 4]);                       // warm left
    panel(3, 12, 0xd4e0ff, 3, [10, 0, 4]);                        // cool right
    panel(14, 3, 0xffe2a0, 1.6, [0, -9, 5]);                      // floor bounce
    panel(10, 10, 0xffd070, 2.6, [0, 3, -10]);                    // back
    panel(6, 6, 0x7d92e6, 1.2, [-7, -3, -7]);
    var rt = pm.fromScene(s, 0.03);
    pm.dispose();
    return rt.texture;
  }

  function makeMats(env) {
    return {
      gold: new T.MeshPhysicalMaterial({ color: 0xf6bd2f, metalness: 1, roughness: 0.27, envMap: env, envMapIntensity: 1.3, clearcoat: 0.5, clearcoatRoughness: 0.18 }),
      silver: new T.MeshPhysicalMaterial({ color: 0xe8edf5, metalness: 1, roughness: 0.22, envMap: env, envMapIntensity: 1.2, clearcoat: 0.45, clearcoatRoughness: 0.18 }),
      navy: new T.MeshStandardMaterial({ color: 0x0d1d4d, metalness: 0.75, roughness: 0.36, envMap: env, envMapIntensity: 0.95 }),
      steel: new T.MeshStandardMaterial({ color: 0x8b98b1, metalness: 0.9, roughness: 0.4, envMap: env, envMapIntensity: 0.9 }),
      dark: new T.MeshStandardMaterial({ color: 0x0a1230, metalness: 0.5, roughness: 0.5, envMap: env, envMapIntensity: 0.6 }),
      glowGold: new T.MeshBasicMaterial({ color: 0xffd772 }),
      glowBlue: new T.MeshBasicMaterial({ color: 0x9dbbff })
    };
  }

  // brushed-metal gradient for the logo faces (UVs of the extruded faces are the logo's x/y)
  function metalTexture(stops) {
    var c = doc.createElement('canvas'); c.width = c.height = 1024;
    var g = c.getContext('2d');
    var grd = g.createLinearGradient(0, 0, 1024, 1024);
    stops.forEach(function (st) { grd.addColorStop(st[0], st[1]); });
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
    for (var i = 0; i < 2200; i++) {
      var light = Math.random() < 0.5;
      g.fillStyle = light ? 'rgba(255,255,255,' + (0.015 + Math.random() * 0.04) + ')' : 'rgba(0,0,0,' + (0.015 + Math.random() * 0.045) + ')';
      g.fillRect(0, Math.random() * 1024, 1024, 1);
    }
    var t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 4;
    t.repeat.set(0.22, 0.22); t.offset.set(0.5, 0.5);
    t.center.set(0.5, 0.5); t.rotation = 0.5;
    return t;
  }
  function makeLogoMats(env) {
    var silverMap = metalTexture([[0, '#ffffff'], [0.3, '#eef2f8'], [0.5, '#b4bdcf'], [0.72, '#f8fafd'], [1, '#9aa5bb']]);
    var goldMap = metalTexture([[0, '#fff0b0'], [0.3, '#ffd23a'], [0.5, '#e2a012'], [0.75, '#ffde6b'], [1, '#eaab1e']]);
    return {
      silver: new T.MeshPhysicalMaterial({ color: 0xffffff, map: silverMap, metalness: 1, roughness: 0.3, envMap: env, envMapIntensity: 1.0, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
      gold: new T.MeshPhysicalMaterial({ color: 0xffffff, map: goldMap, metalness: 1, roughness: 0.3, envMap: env, envMapIntensity: 1.05, clearcoat: 0.5, clearcoatRoughness: 0.2 })
    };
  }

  var dotTexture = null;
  function dotTex() {
    if (dotTexture) return dotTexture;
    var c = doc.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.35, 'rgba(255,255,255,.55)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    dotTexture = new T.CanvasTexture(c);
    return dotTexture;
  }

  function sparkles(n, spread, color, size) {
    var geo = new T.BufferGeometry();
    var pos = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var r = spread * (0.55 + Math.random() * 0.9);
      var th = Math.random() * TAU, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.25;
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.85;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    var m = new T.PointsMaterial({ map: dotTex(), color: color, size: size || 0.09, transparent: true, opacity: 0.85, depthWrite: false, blending: T.AdditiveBlending });
    return new T.Points(geo, m);
  }

  function roundedRectShape(w, h, r) {
    var s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y);
    s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
    s.lineTo(x + w, y + h - r);
    s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    s.lineTo(x + r, y + h);
    s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    s.lineTo(x, y + r);
    s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    return s;
  }
  // flat slab lying in the XZ plane, thickness along Y
  function slabGeo(w, d, h, r, bev) {
    var g = new T.ExtrudeGeometry(roundedRectShape(w, d, r), { depth: h, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 10 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, -h / 2, 0);
    return g;
  }
  // upright plate in the XY plane, thickness along Z
  function plateGeo(w, h, d, r, bev) {
    var g = new T.ExtrudeGeometry(roundedRectShape(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 8 });
    g.translate(0, 0, -d / 2);
    return g;
  }
  function ease(t) { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 3); }

  /* =========================================================
     SCENES  (each returns {root, update(t,dt,age), fit:[w,h]})
     ========================================================= */

  /* ---- home: the extruded AX logo ---- */
  function sceneLogo(ctx) {
    var m = ctx.mats;
    var lm = makeLogoMats(ctx.env);
    var root = new T.Group();
    var logo = new T.Group();
    var parts = [];
    LOGO.forEach(function (s, idx) {
      var sh = new T.Shape();
      s.pts.forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); });
      var front = s.id === 'SW';
      var depth = front ? 0.3 : 0.36;
      var geo = new T.ExtrudeGeometry(sh, {
        depth: depth, bevelEnabled: true,
        bevelThickness: front ? 0.025 : 0.04, bevelSize: front ? 0.014 : 0.032,
        bevelSegments: front ? 2 : 3, curveSegments: 1
      });
      var face = s.kind === 'gold' ? lm.gold : lm.silver;
      var mesh = new T.Mesh(geo, [face, m.navy]);
      var z0 = front ? 0.36 : 0;
      mesh.position.z = z0;
      var ang = (idx / LOGO.length) * TAU;
      parts.push({
        mesh: mesh, z0: z0,
        from: new T.Vector3(Math.cos(ang) * 3.4, Math.sin(ang) * 2.2 + 0.4, -3 - idx * 0.5),
        spin: (idx % 2 ? 1 : -1) * (1.2 + idx * 0.15),
        delay: idx * 0.09
      });
      logo.add(mesh);
    });
    logo.position.z = -0.32;
    root.add(logo);

    // glowing platform ring behind / below the logo
    var ring = new T.Mesh(new T.TorusGeometry(2.7, 0.012, 8, 160), new T.MeshBasicMaterial({ color: 0xf4b92b, transparent: true, opacity: 0.55 }));
    ring.position.set(0, -1.75, 0); ring.rotation.x = Math.PI / 2 - 0.12;
    ring.scale.y = 0.5;
    root.add(ring);
    var ring2 = ring.clone(); ring2.scale.set(1.25, 1.25 * 0.5, 1); ring2.material = new T.MeshBasicMaterial({ color: 0xaab5c8, transparent: true, opacity: 0.22 });
    root.add(ring2);

    var sp = sparkles(isSmall ? 70 : 130, 3.0, 0xffd772, 0.085);
    root.add(sp);

    return {
      root: root, fit: [4.7, 3.1],
      update: function (t, dt, age) {
        parts.forEach(function (p) {
          var k = reduceMotion ? 1 : ease((age - 0.15 - p.delay) / 1.5);
          p.mesh.position.set(p.from.x * (1 - k), p.from.y * (1 - k), p.z0 + p.from.z * (1 - k));
          p.mesh.rotation.z = p.spin * (1 - k);
          p.mesh.rotation.y = p.spin * 0.8 * (1 - k);
        });
        logo.position.y = Math.sin(t * 0.9) * 0.06;
        root.rotation.z = Math.sin(t * 0.5) * 0.012;
        sp.rotation.y = t * 0.06;
        ring.material.opacity = 0.45 + Math.sin(t * 1.4) * 0.12;
      }
    };
  }

  /* ---- services: stacked layers (idea -> build -> explain -> deploy) ---- */
  function sceneLayers(ctx) {
    var m = ctx.mats, root = new T.Group(), slabs = [];
    var mats = [m.silver, m.steel, m.silver, m.gold];
    for (var i = 0; i < 4; i++) {
      var s = new T.Mesh(slabGeo(3.0 - i * 0.12, 2.0 - i * 0.08, 0.2, 0.22, 0.05), mats[i]);
      root.add(s); slabs.push(s);
      if (i === 3) {
        var dot = new T.Mesh(new T.SphereGeometry(0.11, 24, 16), m.glowGold);
        dot.position.set(0.7, 0.16, 0.2); s.add(dot);
        var dot2 = dot.clone(); dot2.position.set(-0.75, 0.16, -0.25); dot2.scale.setScalar(0.7); s.add(dot2);
      }
    }
    var beam = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 3.2, 8), new T.MeshBasicMaterial({ color: 0xf4b92b, transparent: true, opacity: 0.5 }));
    root.add(beam);
    var sp = sparkles(isSmall ? 50 : 90, 2.5, 0xffd772, 0.08); root.add(sp);
    root.rotation.x = 0.28;
    return {
      root: root, fit: [4.0, 3.3],
      update: function (t) {
        var open = 0.5 + 0.5 * Math.sin(t * 0.9);
        for (var i = 0; i < 4; i++) {
          slabs[i].position.y = (i - 1.5) * (0.34 + open * 0.42);
          slabs[i].rotation.y = t * 0.35 + i * 0.22;
        }
        beam.position.y = 0; beam.material.opacity = 0.25 + open * 0.4;
        sp.rotation.y = -t * 0.08;
      }
    };
  }

  /* ---- projects: ring of project cards ---- */
  function sceneRing(ctx) {
    var m = ctx.mats, root = new T.Group(), ring = new T.Group(), N = 10;
    var body = plateGeo(0.92, 1.3, 0.07, 0.09, 0.02);
    var bar = new T.BoxGeometry(0.62, 0.05, 0.02);
    var pane = new T.PlaneGeometry(0.72, 0.62);
    for (var i = 0; i < N; i++) {
      var a = (i / N) * TAU, g = new T.Group();
      var gold = i % 5 === 0;
      g.add(new T.Mesh(body, gold ? m.gold : m.silver));
      var p = new T.Mesh(pane, m.dark); p.position.set(0, 0.16, 0.052); g.add(p);
      var b1 = new T.Mesh(bar, gold ? m.silver : m.gold); b1.position.set(0, -0.32, 0.055); g.add(b1);
      var b2 = new T.Mesh(bar, m.steel); b2.scale.x = 0.6; b2.position.set(-0.12, -0.44, 0.055); g.add(b2);
      var led = new T.Mesh(new T.SphereGeometry(0.035, 12, 10), new T.MeshBasicMaterial({ color: 0x3ddc97 }));
      led.position.set(0.34, 0.52, 0.06); g.add(led);
      g.position.set(Math.sin(a) * 2.35, 0, Math.cos(a) * 2.35);
      g.rotation.y = a;
      ring.add(g);
    }
    root.add(ring);
    var base = new T.Mesh(new T.TorusGeometry(2.35, 0.018, 8, 140), new T.MeshBasicMaterial({ color: 0xf4b92b, transparent: true, opacity: 0.6 }));
    base.rotation.x = Math.PI / 2; base.position.y = -0.95; root.add(base);
    var core = new T.Mesh(new T.OctahedronGeometry(0.42, 0), m.gold); root.add(core);
    var sp = sparkles(isSmall ? 50 : 90, 2.6, 0xffd772, 0.08); root.add(sp);
    root.rotation.x = 0.22;
    return {
      root: root, fit: [5.4, 3.3],
      update: function (t) {
        ring.rotation.y = t * 0.32;
        core.rotation.y = -t * 0.9; core.rotation.x = t * 0.5;
        core.position.y = Math.sin(t * 1.2) * 0.08;
        sp.rotation.y = t * 0.05;
      }
    };
  }

  /* ---- products: smart home ---- */
  function sceneHome(ctx) {
    var m = ctx.mats, root = new T.Group(), house = new T.Group();
    var base = new T.Mesh(slabGeo(3.5, 2.6, 0.16, 0.25, 0.04), m.navy); base.position.y = -0.85; root.add(base);
    var body = new T.Mesh(new T.BoxGeometry(1.9, 1.1, 1.5), m.silver); body.position.y = -0.2; house.add(body);
    var rs = new T.Shape(); rs.moveTo(-1.15, 0); rs.lineTo(1.15, 0); rs.lineTo(0, 0.85); rs.closePath();
    var rg = new T.ExtrudeGeometry(rs, { depth: 1.7, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 });
    rg.translate(0, 0, -0.85);
    var roof = new T.Mesh(rg, m.gold); roof.position.y = 0.35; house.add(roof);
    var door = new T.Mesh(new T.BoxGeometry(0.34, 0.6, 0.06), m.navy); door.position.set(0.35, -0.45, 0.76); house.add(door);
    var w1 = new T.Mesh(new T.PlaneGeometry(0.4, 0.34), new T.MeshBasicMaterial({ color: 0xffd772 })); w1.position.set(-0.5, -0.1, 0.76); house.add(w1);
    var w2 = w1.clone(); w2.position.set(0.35, 0.06, 0.76); w2.scale.set(0.001, 0.001, 1); w2.visible = false;
    var chim = new T.Mesh(new T.BoxGeometry(0.2, 0.5, 0.2), m.steel); chim.position.set(0.55, 0.85, -0.2); house.add(chim);
    root.add(house);
    var waves = [];
    for (var i = 0; i < 3; i++) {
      var w = new T.Mesh(new T.TorusGeometry(0.5, 0.018, 8, 80), new T.MeshBasicMaterial({ color: 0xf4b92b, transparent: true, opacity: 0.6 }));
      w.rotation.x = Math.PI / 2; w.position.y = 1.4; root.add(w); waves.push(w);
    }
    var nodes = [];
    [[-1.5, -0.35, 0.9, m.glowGold], [1.55, -0.2, 0.6, m.glowBlue], [0.1, -0.55, 1.4, m.glowGold]].forEach(function (n) {
      var s = new T.Mesh(new T.SphereGeometry(0.1, 16, 12), n[3]); s.position.set(n[0], n[1], n[2]); root.add(s); nodes.push(s);
    });
    var sp = sparkles(isSmall ? 50 : 90, 2.5, 0xffd772, 0.08); root.add(sp);
    root.rotation.x = 0.2; root.position.y = -0.1;
    return {
      root: root, fit: [4.0, 3.3],
      update: function (t) {
        house.rotation.y = Math.sin(t * 0.5) * 0.25;
        waves.forEach(function (w, i) {
          var k = ((t * 0.5 + i / 3) % 1);
          w.scale.setScalar(0.4 + k * 2.4);
          w.material.opacity = (1 - k) * 0.6;
          w.position.y = 1.35 + k * 0.5;
        });
        nodes.forEach(function (n, i) { n.position.y += Math.sin(t * 2 + i) * 0.0025; });
        w1.material.color.setHex(Math.sin(t * 2) > -0.6 ? 0xffd772 : 0xa87d1a);
        sp.rotation.y = t * 0.05;
      }
    };
  }

  /* ---- technology: orbiting stack ---- */
  function sceneOrbit(ctx) {
    var m = ctx.mats, root = new T.Group();
    var core = new T.Mesh(new T.IcosahedronGeometry(0.85, 2), m.gold); root.add(core);
    var wire = new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(1.15, 1)), new T.LineBasicMaterial({ color: 0xdfe5ef, transparent: true, opacity: 0.45 }));
    root.add(wire);
    var orbits = [], radii = [1.75, 2.3, 2.85], tilts = [[0.5, 0, 0.2], [-0.9, 0.3, 0], [0.2, 0, -0.75]];
    var matsList = [m.silver, m.gold, m.silver];
    for (var i = 0; i < 3; i++) {
      var g = new T.Group(); g.rotation.set(tilts[i][0], tilts[i][1], tilts[i][2]);
      var ring = new T.Mesh(new T.TorusGeometry(radii[i], 0.01, 8, 140), new T.MeshBasicMaterial({ color: 0xaab5c8, transparent: true, opacity: 0.4 }));
      ring.rotation.x = Math.PI / 2; g.add(ring);
      var pivot = new T.Group();
      for (var k = 0; k < 2; k++) {
        var s = new T.Mesh(new T.SphereGeometry(0.13 + i * 0.03, 24, 16), k ? matsList[(i + 1) % 3] : matsList[i]);
        var a = k * Math.PI + i; s.position.set(Math.cos(a) * radii[i], 0, Math.sin(a) * radii[i]); pivot.add(s);
      }
      g.add(pivot); root.add(g); orbits.push({ pivot: pivot, speed: 0.55 - i * 0.12 });
    }
    var sp = sparkles(isSmall ? 60 : 110, 2.8, 0xffd772, 0.08); root.add(sp);
    return {
      root: root, fit: [5.6, 4.8],
      update: function (t) {
        core.rotation.y = t * 0.4; core.rotation.x = t * 0.2;
        wire.rotation.y = -t * 0.25; wire.rotation.z = t * 0.12;
        orbits.forEach(function (o) { o.pivot.rotation.y = t * o.speed; });
        sp.rotation.y = -t * 0.04;
      }
    };
  }

  /* ---- contact: envelope ---- */
  function sceneMail(ctx) {
    var m = ctx.mats, root = new T.Group(), env = new T.Group();
    var body = new T.Mesh(plateGeo(2.6, 1.7, 0.16, 0.12, 0.03), m.silver); env.add(body);
    var letter = new T.Mesh(plateGeo(2.2, 1.35, 0.03, 0.04, 0.01), m.dark); letter.position.set(0, 0.05, 0.02);
    var lines = new T.Group();
    for (var i = 0; i < 4; i++) {
      var l = new T.Mesh(new T.BoxGeometry(i === 3 ? 0.9 : 1.6, 0.05, 0.02), i === 0 ? m.gold : m.steel);
      l.position.set(i === 3 ? -0.35 : 0, 0.38 - i * 0.22, 0.05); lines.add(l);
    }
    letter.add(lines); env.add(letter);
    var pocket = new T.Shape(); pocket.moveTo(-1.3, -0.85); pocket.lineTo(1.3, -0.85); pocket.lineTo(1.3, 0.85); pocket.lineTo(0, -0.05); pocket.lineTo(-1.3, 0.85); pocket.closePath();
    var pg = new T.ExtrudeGeometry(pocket, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
    var front = new T.Mesh(pg, m.steel); front.position.z = 0.09; env.add(front);
    var fs = new T.Shape(); fs.moveTo(-1.3, 0); fs.lineTo(1.3, 0); fs.lineTo(0, -0.95); fs.closePath();
    var fg = new T.ExtrudeGeometry(fs, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
    var flap = new T.Group(); var fm = new T.Mesh(fg, m.gold); flap.add(fm); flap.position.set(0, 0.85, 0.11); env.add(flap);
    root.add(env);
    var orbit = new T.Group();
    for (var j = 0; j < 3; j++) {
      var s = new T.Mesh(new T.SphereGeometry(0.1, 16, 12), j % 2 ? m.glowBlue : m.glowGold);
      var a = j * TAU / 3; s.position.set(Math.cos(a) * 2.2, Math.sin(a * 2) * 0.3, Math.sin(a) * 2.2); orbit.add(s);
    }
    root.add(orbit);
    var sp = sparkles(isSmall ? 50 : 90, 2.4, 0xffd772, 0.08); root.add(sp);
    root.rotation.x = 0.12;
    return {
      root: root, fit: [4.5, 3.1],
      update: function (t) {
        var cyc = (t * 0.28) % 1;
        var open = cyc < 0.15 ? ease(cyc / 0.15) : (cyc < 0.65 ? 1 : (cyc < 0.8 ? 1 - ease((cyc - 0.65) / 0.15) : 0));
        flap.rotation.x = open * 2.75;
        letter.position.y = 0.05 + open * 0.55 * (cyc > 0.15 && cyc < 0.75 ? 1 : 0);
        env.position.y = Math.sin(t * 1.1) * 0.08;
        env.rotation.y = Math.sin(t * 0.4) * 0.3;
        orbit.rotation.y = t * 0.5; orbit.rotation.z = 0.25;
        sp.rotation.y = t * 0.05;
      }
    };
  }

  /* ---- start project: rocket ---- */
  function sceneRocket(ctx) {
    var m = ctx.mats, root = new T.Group(), rocket = new T.Group();
    var prof = [], i;
    for (i = 0; i <= 14; i++) { var u = i / 14; prof.push(new T.Vector2(0.001 + 0.52 * Math.sin(u * 1.35) * (0.9 + 0.1 * u), -1.2 + u * 1.75)); }
    for (i = 1; i <= 6; i++) prof.push(new T.Vector2(0.52 - i * 0.02, 0.55 - i * 0.02 + i * 0.001));
    var bodyPts = [new T.Vector2(0.001, -1.25), new T.Vector2(0.4, -1.25), new T.Vector2(0.5, -1.05), new T.Vector2(0.55, -0.4), new T.Vector2(0.55, 0.35), new T.Vector2(0.5, 0.75)];
    var body = new T.Mesh(new T.LatheGeometry(bodyPts, 48), m.silver); rocket.add(body);
    var nosePts = []; for (i = 0; i <= 12; i++) { var v = i / 12; nosePts.push(new T.Vector2(0.5 * Math.cos(v * Math.PI / 2 * 0.98) + 0.001, 0.75 + 1.15 * Math.sin(v * Math.PI / 2))); }
    var nose = new T.Mesh(new T.LatheGeometry(nosePts, 48), m.gold); rocket.add(nose);
    var band = new T.Mesh(new T.TorusGeometry(0.53, 0.035, 12, 60), m.gold); band.rotation.x = Math.PI / 2; band.position.y = 0.7; rocket.add(band);
    var band2 = band.clone(); band2.position.y = -0.85; band2.scale.setScalar(1.02); rocket.add(band2);
    var win = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.08, 32), m.navy); win.rotation.x = Math.PI / 2; win.position.set(0, 0.15, 0.53); rocket.add(win);
    var rim = new T.Mesh(new T.TorusGeometry(0.2, 0.04, 12, 40), m.gold); rim.position.set(0, 0.15, 0.55); rocket.add(rim);
    var glass = new T.Mesh(new T.CircleGeometry(0.16, 32), new T.MeshBasicMaterial({ color: 0x9dbbff })); glass.position.set(0, 0.15, 0.585); rocket.add(glass);
    var fs = new T.Shape(); fs.moveTo(0, 0); fs.lineTo(0.62, -0.35); fs.lineTo(0.62, -1.05); fs.lineTo(0, -0.7); fs.closePath();
    var fg = new T.ExtrudeGeometry(fs, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
    for (i = 0; i < 3; i++) {
      var fin = new T.Mesh(fg, m.gold); var g = new T.Group();
      fin.position.set(0.42, -0.35, -0.025); g.add(fin); g.rotation.y = i * TAU / 3; rocket.add(g);
    }
    var flame = new T.Mesh(new T.ConeGeometry(0.32, 1.3, 24, 1, true), new T.MeshBasicMaterial({ color: 0xffb02e, transparent: true, opacity: 0.85 }));
    flame.rotation.x = Math.PI; flame.position.y = -1.9; rocket.add(flame);
    var flame2 = new T.Mesh(new T.ConeGeometry(0.16, 0.9, 20, 1, true), new T.MeshBasicMaterial({ color: 0xfff1b0, transparent: true, opacity: 0.95 }));
    flame2.rotation.x = Math.PI; flame2.position.y = -1.7; rocket.add(flame2);
    rocket.rotation.z = -0.5; rocket.rotation.x = 0.1;
    root.add(rocket);
    var orbit = new T.Mesh(new T.TorusGeometry(2.3, 0.012, 8, 140), new T.MeshBasicMaterial({ color: 0xaab5c8, transparent: true, opacity: 0.35 }));
    orbit.rotation.x = 1.15; orbit.rotation.y = 0.3; root.add(orbit);
    var moon = new T.Mesh(new T.SphereGeometry(0.16, 24, 16), m.silver); root.add(moon);
    var sp = sparkles(isSmall ? 60 : 110, 2.7, 0xffd772, 0.085); root.add(sp);
    return {
      root: root, fit: [4.6, 4.8],
      update: function (t) {
        rocket.position.y = Math.sin(t * 1.3) * 0.12;
        rocket.rotation.y = t * 0.6;
        var f = 0.85 + Math.sin(t * 22) * 0.1 + Math.sin(t * 9) * 0.08;
        flame.scale.set(1, f, 1); flame2.scale.set(1, f * 1.05, 1);
        var a = t * 0.8;
        moon.position.set(Math.cos(a) * 2.3, Math.sin(a) * 2.3 * Math.sin(1.15) * 0.9, Math.sin(a) * 2.3 * Math.cos(1.15));
        sp.rotation.y = t * 0.06;
      }
    };
  }

  var SCENES = { logo: sceneLogo, layers: sceneLayers, ring: sceneRing, home: sceneHome, orbit: sceneOrbit, mail: sceneMail, rocket: sceneRocket };

  /* ---- stage: a canvas placed in a hero, one per page ---- */
  function initStage(el) {
    var build = SCENES[el.getAttribute('data-scene')];
    if (!build) return;
    var canvas = doc.createElement('canvas');
    var renderer;
    try { renderer = makeRenderer(canvas); } catch (e) { return; }
    el.insertBefore(canvas, el.firstChild);

    var scene = new T.Scene();
    var cam = new T.PerspectiveCamera(36, 1, 0.1, 100);
    var env = makeEnv(renderer);
    var mats = makeMats(env);
    var key = new T.DirectionalLight(0xfff2d6, 1.1); key.position.set(-3, 4, 5); scene.add(key);
    var rim = new T.DirectionalLight(0x7fa2ff, 0.8); rim.position.set(4, 1, -3); scene.add(rim);
    scene.add(new T.AmbientLight(0x7f8fb8, 0.25));

    var pivot = new T.Group();
    var sc = build({ mats: mats, env: env });
    pivot.add(sc.root);
    scene.add(pivot);

    var st = { offY: 0, offX: 0, dragging: false, lastX: 0, lastY: 0, sx: 0, sy: 0 };
    el.style.touchAction = 'pan-y';
    el.addEventListener('pointerdown', function (e) {
      st.dragging = true; st.lastX = e.clientX; st.lastY = e.clientY;
      el.classList.add('dragging');
      try { el.setPointerCapture(e.pointerId); } catch (x) { }
    });
    el.addEventListener('pointermove', function (e) {
      if (!st.dragging) return;
      st.offY += (e.clientX - st.lastX) * 0.011;
      st.offX += (e.clientY - st.lastY) * 0.006;
      st.offX = Math.max(-0.7, Math.min(0.7, st.offX));
      st.lastX = e.clientX; st.lastY = e.clientY;
    });
    function up() { st.dragging = false; el.classList.remove('dragging'); }
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);

    var item = {
      el: el, renderer: renderer, scene: scene, camera: cam, visible: true, age: 0, w: 0, h: 0,
      resize: function () {
        var w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        if (w === item.w && h === item.h) return;
        item.w = w; item.h = h;
        renderer.setSize(w, h, false);
        cam.aspect = w / h;
        var tanH = Math.tan(cam.fov * Math.PI / 360);
        var d = Math.max(sc.fit[1] / (2 * tanH), sc.fit[0] / (2 * tanH * cam.aspect));
        cam.position.set(0, 0.08, d);
        cam.lookAt(0, 0, 0);
        cam.updateProjectionMatrix();
      },
      update: function (t, dt) {
        item.age += dt;
        // drag offsets ease back to rest after release
        if (!st.dragging) {
          st.offY *= Math.pow(0.35, dt); st.offX *= Math.pow(0.25, dt);
        }
        pivot.rotation.y = (reduceMotion ? 0 : pointer.sx * 0.42) + st.offY + Math.sin(t * 0.35) * (reduceMotion ? 0 : 0.14);
        pivot.rotation.x = (reduceMotion ? 0 : -pointer.sy * 0.16) + st.offX;
        sc.update(t, dt, item.age);
      }
    };
    item.resize();
    if ('ResizeObserver' in window) new ResizeObserver(function () { item.resize(); if (reduceMotion) renderOne(item); }).observe(el);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { item.visible = en[0].isIntersecting; }, { rootMargin: '80px' }).observe(el);
    }
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); item.visible = false; });
    items.push(item);
    el.classList.add('ready');
  }

  /* ---- fixed 3D world behind every page ---- */
  function initWorld() {
    var canvas = doc.getElementById('bg3d');
    if (!canvas) return;
    var renderer;
    try { renderer = makeRenderer(canvas); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    var scene = new T.Scene();
    scene.fog = new T.Fog(0x050914, 14, 52);
    var cam = new T.PerspectiveCamera(55, 1, 0.1, 120);
    cam.position.set(0, 0, 11);
    var env = makeEnv(renderer);
    var mats = makeMats(env);
    var key = new T.DirectionalLight(0xfff2d6, 1.0); key.position.set(-4, 6, 6); scene.add(key);
    scene.add(new T.AmbientLight(0x7f8fb8, 0.3));

    var world = new T.Group(); scene.add(world);

    // depth dust
    var N = isSmall ? 260 : 700;
    var geo = new T.BufferGeometry(), pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    var gold = new T.Color(0xf4b92b), silver = new T.Color(0xcfd8e8), c = new T.Color();
    for (var i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -35 + Math.random() * 42;
      c.copy(Math.random() < 0.28 ? gold : silver); var k = 0.35 + Math.random() * 0.65;
      col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k;
    }
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    var dust = new T.Points(geo, new T.PointsMaterial({ map: dotTex(), size: 0.22, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false, blending: T.AdditiveBlending }));
    world.add(dust);

    // receding floor grid
    var grid = new T.Group();
    var gl = [], size = 60, step = 3, half = size / 2, j;
    for (j = -half; j <= half; j += step) { gl.push(-half, 0, j, half, 0, j); gl.push(j, 0, -half, j, 0, half); }
    var gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(gl, 3));
    var lines = new T.LineSegments(gg, new T.LineBasicMaterial({ color: 0x8fa3d6, transparent: true, opacity: 0.16 }));
    grid.add(lines); grid.position.y = -9; world.add(grid);

    // floating solids + wireframes, anchored to the screen edges so text stays clear
    var floaters = [];
    function addSolid(geom, mat, side, frac, y, z, sc, sp) { if (isSmall) { sc *= 0.5; frac *= 1.15; } var mesh = new T.Mesh(geom, mat); mesh.scale.setScalar(sc); world.add(mesh); floaters.push({ m: mesh, side: side, frac: frac, z: z, sp: sp, y0: y, ph: Math.random() * TAU }); mesh.position.z = z; }
    function addWire(geom, colr, side, frac, y, z, sc, sp) { if (isSmall) { sc *= 0.5; frac *= 1.2; } var mesh = new T.LineSegments(new T.EdgesGeometry(geom), new T.LineBasicMaterial({ color: colr, transparent: true, opacity: 0.4 })); mesh.scale.setScalar(sc); world.add(mesh); floaters.push({ m: mesh, side: side, frac: frac, z: z, sp: sp, y0: y, ph: Math.random() * TAU }); mesh.position.z = z; }
    addSolid(new T.OctahedronGeometry(1, 0), mats.gold, -1, 0.95, 3.6, -5, 0.85, 0.35);
    addSolid(new T.IcosahedronGeometry(1, 0), mats.silver, 1, 0.96, -3.2, -6, 0.75, -0.3);
    addSolid(new T.TorusGeometry(0.9, 0.26, 24, 48), mats.gold, 1, 0.9, 6.4, -9, 0.85, 0.25);
    addSolid(new T.OctahedronGeometry(1, 0), mats.silver, -1, 0.98, -5.5, -8, 0.7, -0.4);
    addWire(new T.IcosahedronGeometry(1, 1), 0xf4b92b, -1, 1.0, -0.5, -10, 2.4, 0.15);
    addWire(new T.DodecahedronGeometry(1, 0), 0xdfe5ef, 1, 1.0, 1.2, -14, 3.2, -0.12);
    addWire(new T.TorusKnotGeometry(1, 0.3, 90, 10), 0x9dbbff, -1, 0.92, 8, -16, 1.6, 0.1);

    var view = { w: 0, h: 0 };
    var item = {
      el: canvas, renderer: renderer, scene: scene, camera: cam, visible: true, age: 0,
      resize: function () {
        var w = window.innerWidth, h = window.innerHeight;
        if (w === view.w && h === view.h) return;
        view.w = w; view.h = h;
        renderer.setSize(w, h, false);
        cam.aspect = w / h; cam.updateProjectionMatrix();
        var tanH = Math.tan(cam.fov * Math.PI / 360);
        floaters.forEach(function (f) {
          var d = cam.position.z - f.z;
          f.m.position.x = f.side * d * tanH * cam.aspect * f.frac;
        });
      },
      update: function (t, dt) {
        var max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
        var sp = (window.pageYOffset || 0) / max;
        cam.position.x += ((reduceMotion ? 0 : pointer.sx * 1.4) - cam.position.x) * 0.05;
        cam.position.y += ((reduceMotion ? 0 : -pointer.sy * 0.8) - sp * 5 - cam.position.y) * 0.05;
        cam.lookAt(0, -sp * 3, 0);
        world.rotation.y = sp * 0.5;
        dust.rotation.y = t * 0.01;
        grid.position.z = reduceMotion ? 0 : (t * 0.7) % step;
        floaters.forEach(function (f) {
          f.m.rotation.x += dt * f.sp * 0.6; f.m.rotation.y += dt * f.sp;
          f.m.position.y = f.y0 + Math.sin(t * 0.5 + f.ph) * 0.35;
        });
      }
    };
    item.resize();
    window.addEventListener('resize', function () { item.resize(); if (reduceMotion) renderOne(item); });
    canvas.classList.add('ready');
    doc.body.classList.add('has-world');
    items.push(item);
  }

  /* ---------- render loop ---------- */
  function renderOne(it) { it.update(clock, 0.016); it.renderer.render(it.scene, it.camera); }

  function frame(now) {
    var dt = Math.min((now - lastNow) / 1000, 0.05) || 0.016;
    lastNow = now; clock += dt;
    var k = Math.min(1, dt * 4);
    pointer.sx += (pointer.x - pointer.sx) * k;
    pointer.sy += (pointer.y - pointer.sy) * k;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.visible) continue;
      it.resize();
      it.update(clock, dt);
      it.renderer.render(it.scene, it.camera);
    }
    rafId = requestAnimationFrame(frame);
  }
  function start() { if (!rafId) { lastNow = performance.now(); rafId = requestAnimationFrame(frame); } }
  function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }

  function boot3d() {
    doc.querySelectorAll('.stage[data-scene]').forEach(initStage);
    initWorld();
    if (!items.length) return;
    if (reduceMotion) { clock = 3; items.forEach(function (it) { it.age = 3; renderOne(it); }); return; }
    start();
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) stop(); else start(); });
  }

  function boot() {
    initMenu(); initReveal(); initTilt();
  }

  boot();
  boot3d();
})();
