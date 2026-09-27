/* Voltaic — vanilla JS demo store.
   Auth here is a client-only simulation (localStorage), meant to demonstrate
   a login/register/logout flow with no backend. Do not reuse this pattern
   for real user accounts or real passwords. */

const Voltaic = (() => {
  const USERS_KEY = "voltaic_users";
  const SESSION_KEY = "voltaic_session";

  /* ---------------- Data ---------------- */
  const PRODUCTS = [
    {
      id: 1,
      name: "Pulse Wireless Earbuds",
      category: "Audio",
      price: 89,
      icon: "audio",
      blurb: "In-ear buds with active noise cancelling and a case that tops them up on the go.",
      specs: [
        ["Battery", "30 hrs with case"],
        ["Noise cancelling", "Active, 2-mic"],
        ["Water resistance", "IPX4"],
        ["Charging", "USB-C, wireless pad"]
      ]
    },
    {
      id: 2,
      name: "Aria Over-Ear Headphones",
      category: "Audio",
      price: 149,
      icon: "headphones",
      blurb: "Studio-tuned drivers in a foldable, over-ear build made for long listening sessions.",
      specs: [
        ["Driver size", "40mm dynamic"],
        ["Battery", "42 hrs"],
        ["Fold design", "Yes, travel case included"],
        ["Connection", "Bluetooth 5.3 / 3.5mm"]
      ]
    },
    {
      id: 3,
      name: "Orbit Smartwatch",
      category: "Wearables",
      price: 199,
      icon: "watch",
      blurb: "Round-face smartwatch with continuous heart-rate, GPS, and a battery that lasts the week.",
      specs: [
        ["Display", "1.4\" AMOLED, always-on"],
        ["Battery", "Up to 7 days"],
        ["Tracking", "Heart rate, SpO2, GPS"],
        ["Water resistance", "5 ATM"]
      ]
    },
    {
      id: 4,
      name: "Flux Fitness Band",
      category: "Wearables",
      price: 59,
      icon: "band",
      blurb: "A light, waterproof band for sleep and workout tracking without the smartwatch price tag.",
      specs: [
        ["Battery", "12 days"],
        ["Water resistance", "Swim-safe, 50m"],
        ["Tracking", "Sleep, steps, workouts"],
        ["Weight", "22g"]
      ]
    },
    {
      id: 5,
      name: "Nova 14 Laptop",
      category: "Computing",
      price: 1099,
      icon: "laptop",
      blurb: "A 14-inch OLED laptop built for all-day work, thin enough to forget it's in your bag.",
      specs: [
        ["Display", "14\" OLED, 2.8K"],
        ["Battery", "Up to 18 hrs"],
        ["Memory", "16GB unified"],
        ["Storage", "512GB SSD"]
      ]
    },
    {
      id: 6,
      name: "Keystroke Mechanical Keyboard",
      category: "Computing",
      price: 129,
      icon: "keyboard",
      blurb: "Hot-swappable mechanical keyboard with a sound and feel you tune to your own taste.",
      specs: [
        ["Switches", "Hot-swappable, tactile"],
        ["Layout", "75%, compact"],
        ["Connection", "USB-C / Bluetooth"],
        ["Backlight", "Per-key RGB"]
      ]
    },
    {
      id: 7,
      name: "Lumen Mirrorless Camera",
      category: "Photography",
      price: 749,
      icon: "camera",
      blurb: "A 24MP mirrorless body with 4K video, built for people moving up from a phone camera.",
      specs: [
        ["Sensor", "24MP APS-C"],
        ["Video", "4K/30fps"],
        ["Stabilisation", "In-body, 5-axis"],
        ["Viewfinder", "2.36M-dot EVF"]
      ]
    },
    {
      id: 8,
      name: "Skyline Drone 4K",
      category: "Photography",
      price: 399,
      icon: "drone",
      blurb: "Foldable 4K drone with obstacle sensing, for aerial shots without the steep learning curve.",
      specs: [
        ["Camera", "4K/30fps, 3-axis gimbal"],
        ["Flight time", "30 minutes"],
        ["Range", "8 km"],
        ["Obstacle sensing", "Front & downward"]
      ]
    }
  ];

  /* ---------------- Icons (inline SVG, line style) ---------------- */
  const ICONS = {
    audio: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <circle cx="40" cy="70" r="16"/><circle cx="80" cy="70" r="16"/>
      <path d="M40 70V46a20 20 0 0 1 40 0v24"/>
      <circle cx="40" cy="70" r="4" fill="var(--accent)"/><circle cx="80" cy="70" r="4" fill="var(--accent)"/>
    </svg>`,
    headphones: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <path d="M24 68v-8a36 36 0 0 1 72 0v8"/>
      <rect x="16" y="64" width="20" height="30" rx="8"/>
      <rect x="84" y="64" width="20" height="30" rx="8"/>
      <path d="M36 94c0 8 8 10 16 10" stroke-linecap="round"/>
    </svg>`,
    watch: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <rect x="36" y="36" width="48" height="48" rx="12"/>
      <path d="M50 36V22h20v14M50 84v14h20V84"/>
      <path d="M60 52v12l8 6" stroke-linecap="round"/>
    </svg>`,
    band: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <rect x="40" y="44" width="40" height="32" rx="10"/>
      <path d="M40 60H20M80 60h20" stroke-linecap="round"/>
      <circle cx="60" cy="60" r="6" fill="var(--accent)" stroke="none"/>
    </svg>`,
    laptop: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <rect x="30" y="34" width="60" height="40" rx="4"/>
      <path d="M18 84h84l-6 10H24l-6-10Z" stroke-linejoin="round"/>
    </svg>`,
    keyboard: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <rect x="18" y="42" width="84" height="40" rx="6"/>
      <path d="M30 56h6M44 56h6M58 56h6M72 56h6M86 56h6M30 70h44M82 70h6" stroke-linecap="round"/>
    </svg>`,
    camera: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <rect x="20" y="42" width="80" height="50" rx="8"/>
      <path d="M44 42l6-10h20l6 10"/>
      <circle cx="60" cy="68" r="16"/>
      <circle cx="60" cy="68" r="6" fill="var(--accent)" stroke="none"/>
    </svg>`,
    drone: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--accent)" stroke-width="3">
      <rect x="46" y="50" width="28" height="20" rx="4"/>
      <path d="M46 56 24 40M74 56l22-16M46 64 24 80M74 64l22 16"/>
      <circle cx="24" cy="36" r="8"/><circle cx="96" cy="36" r="8"/>
      <circle cx="24" cy="84" r="8"/><circle cx="96" cy="84" r="8"/>
    </svg>`
  };

  const CATEGORY_ICON = {
    Audio: ICONS.headphones,
    Wearables: ICONS.watch,
    Computing: ICONS.laptop,
    Photography: ICONS.camera
  };

  /* ---------------- Storage helpers ---------------- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }
  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }));
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }
  // Demo-only obfuscation, NOT real password hashing/security.
  function obfuscate(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  /* ---------------- Toast ---------------- */
  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------------- Nav (auth-aware) ---------------- */
  function paintNav() {
    const session = getSession();
    const authSlot = document.querySelector("[data-nav-auth]");
    if (!authSlot) return;
    if (session) {
      authSlot.innerHTML = `
        <span class="nav-user">Hi, <strong>${escapeHtml(session.name.split(" ")[0])}</strong></span>
        <button class="btn-ghost" id="navLogout">Sign out</button>
      `;
      document.getElementById("navLogout").addEventListener("click", () => {
        clearSession();
        toast("Signed out");
        setTimeout(() => (window.location.href = "index.html"), 500);
      });
    } else {
      authSlot.innerHTML = `
        <a class="btn-ghost" href="login.html">Sign in</a>
        <a class="btn-primary" href="register.html">Create account</a>
      `;
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* ---------------- Validators ---------------- */
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function setFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const err = document.getElementById("err-" + inputId);
    if (input) input.classList.toggle("invalid", !!message);
    if (err) err.textContent = message || "";
  }

  /* ---------------- Page: Login ---------------- */
  function initLoginPage() {
    paintNav();
    const form = document.getElementById("loginForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      let ok = true;

      if (!isEmail(email)) { setFieldError("loginEmail", "Enter a valid email address."); ok = false; }
      else setFieldError("loginEmail", "");

      if (!password) { setFieldError("loginPassword", "Enter your password."); ok = false; }
      else setFieldError("loginPassword", "");

      if (!ok) return;

      const users = getUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const msg = document.getElementById("loginMsg");

      if (!user || user.password !== obfuscate(password)) {
        msg.textContent = "That email and password don't match an account.";
        msg.className = "form-msg bad";
        return;
      }

      setSession(user);
      msg.textContent = "Signed in — redirecting…";
      msg.className = "form-msg ok";
      setTimeout(() => (window.location.href = "index.html"), 500);
    });

    setupPasswordToggles();
  }

  /* ---------------- Page: Register ---------------- */
  function initRegisterPage() {
    paintNav();
    const form = document.getElementById("registerForm");
    if (!form) return;

    const pwInput = document.getElementById("regPassword");
    const meter = document.getElementById("pwMeter")?.querySelector("span");
    if (pwInput && meter) {
      pwInput.addEventListener("input", () => {
        const v = pwInput.value;
        let score = 0;
        if (v.length >= 8) score++;
        if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
        if (/\d/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;
        const pct = [0, 25, 55, 80, 100][score];
        const colors = ["var(--border)", "var(--danger)", "#e0a13c", "var(--accent)", "var(--accent-2)"];
        meter.style.width = pct + "%";
        meter.style.background = colors[score];
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;
      const password2 = document.getElementById("regPassword2").value;
      let ok = true;

      if (name.length < 2) { setFieldError("regName", "Enter your name."); ok = false; }
      else setFieldError("regName", "");

      if (!isEmail(email)) { setFieldError("regEmail", "Enter a valid email address."); ok = false; }
      else setFieldError("regEmail", "");

      if (password.length < 8) { setFieldError("regPassword", "Use at least 8 characters."); ok = false; }
      else setFieldError("regPassword", "");

      if (password2 !== password || !password2) { setFieldError("regPassword2", "Passwords don't match."); ok = false; }
      else setFieldError("regPassword2", "");

      if (!ok) return;

      const users = getUsers();
      const msg = document.getElementById("registerMsg");
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        msg.textContent = "An account with that email already exists.";
        msg.className = "form-msg bad";
        setFieldError("regEmail", "Already registered.");
        return;
      }

      const user = { name, email, password: obfuscate(password) };
      users.push(user);
      saveUsers(users);
      setSession(user);

      msg.textContent = "Account created — redirecting…";
      msg.className = "form-msg ok";
      setTimeout(() => (window.location.href = "index.html"), 600);
    });

    setupPasswordToggles();
  }

  function setupPasswordToggles() {
    document.querySelectorAll(".pw-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        const showing = input.type === "text";
        input.type = showing ? "password" : "text";
        btn.textContent = showing ? "Show" : "Hide";
      });
    });
  }

  /* ---------------- Page: Landing ---------------- */
  function initLandingPage() {
    paintNav();
    const grid = document.querySelector("[data-featured-grid]");
    if (grid) {
      grid.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
    }
  }

  /* ---------------- Page: Products ---------------- */
  function initProductsPage() {
    paintNav();
    const grid = document.querySelector("[data-product-grid]");
    const chips = document.querySelectorAll(".filter-chip");
    if (!grid) return;

    function render(filter) {
      const list = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
      grid.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<div class="empty-state">No products in this category yet.</div>`;
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        render(chip.dataset.filter);
      });
    });

    const params = new URLSearchParams(window.location.search);
    const requested = params.get("cat");
    const match = requested && Array.from(chips).find((c) => c.dataset.filter === requested);
    if (match) {
      chips.forEach((c) => c.classList.remove("active"));
      match.classList.add("active");
      render(requested);
    } else {
      render("All");
    }
  }

  function productCard(p) {
    return `
      <a class="product-card" href="product.html?id=${p.id}">
        <div class="product-media">${CATEGORY_ICON[p.category] || ICONS.audio}</div>
        <div class="product-body">
          <div class="product-cat">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">$${p.price}</div>
        </div>
      </a>
    `;
  }

  /* ---------------- Page: Product detail ---------------- */
  function initProductPage() {
    paintNav();
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

    document.title = `Voltaic — ${product.name}`;
    document.querySelector("[data-detail-media]").innerHTML = CATEGORY_ICON[product.category] || ICONS.audio;
    document.querySelector("[data-detail-cat]").textContent = product.category;
    document.querySelector("[data-detail-name]").textContent = product.name;
    document.querySelector("[data-detail-price]").textContent = `$${product.price}`;
    document.querySelector("[data-detail-blurb]").textContent = product.blurb;
    document.querySelector("[data-detail-specs]").innerHTML = product.specs
      .map(([k, v]) => `<li><strong>${escapeHtml(k)}</strong><span>${escapeHtml(v)}</span></li>`)
      .join("");

    const waLink = document.querySelector("[data-detail-whatsapp]");
    if (waLink) {
      const text = encodeURIComponent(`Hi! I'm interested in the ${product.name} ($${product.price}).`);
      waLink.href = `https://wa.me/10000000000?text=${text}`;
    }
  }

  /* ---------------- Page: WhatsApp ---------------- */
  function initWhatsappPage() {
    paintNav();
  }

  /* ---------------- Page: Dashboard-ish guard (not used on public pages) ---------------- */
  function requireAuthOrRedirect() {
    if (!getSession()) window.location.href = "login.html";
  }

  return {
    initLoginPage,
    initRegisterPage,
    initLandingPage,
    initProductsPage,
    initProductPage,
    initWhatsappPage,
    paintNav,
    requireAuthOrRedirect
  };
})();
