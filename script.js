const app = document.getElementById("app");
const siteData = window.SITE_DATA;

if (!app || !siteData) {
  throw new Error("SITE_DATA not found.");
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderList = (items, renderItem) => items.map(renderItem).join("");
const hasItems = (items) => Array.isArray(items) && items.length > 0;
const renderImage = (image, className, sizes = "100vw", loading = "lazy") =>
  image?.src
    ? `
        <figure class="${className}">
          <img
            src="${escapeHtml(image.src)}"
            alt="${escapeHtml(image.alt || "")}"
            loading="${loading}"
            sizes="${escapeHtml(sizes)}"
          />
          ${
            image.eyebrow || image.caption
              ? `
                  <figcaption>
                    ${escapeHtml(image.eyebrow || image.caption)}
                  </figcaption>
                `
              : ""
          }
        </figure>
      `
    : "";

const renderSimpleImage = (image, className, sizes = "100vw") =>
  image?.src
    ? `
        <figure class="${className}">
          <img
            src="${escapeHtml(image.src)}"
            alt="${escapeHtml(image.alt || "")}"
            loading="lazy"
            sizes="${escapeHtml(sizes)}"
          />
        </figure>
      `
    : "";

const applyTheme = (theme = {}) => {
  const root = document.documentElement;
  const themeEntries = {
    "--bg": theme.bg,
    "--panel": theme.panel,
    "--panel-strong": theme.panelStrong,
    "--text": theme.text,
    "--muted": theme.muted,
    "--line": theme.line,
    "--accent": theme.accent,
    "--accent-strong": theme.accentStrong,
    "--shadow": theme.shadow,
  };

  Object.entries(themeEntries).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value);
    }
  });
};

const buildSite = (data) => {
  document.title = data.meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", data.meta.description);
  }

  app.innerHTML = `
    <div class="page-shell">
      <header class="hero" id="top">
        <nav class="nav">
          <a class="logo focus-logo" href="#top" aria-label="${escapeHtml(`${data.brand.mark} ${data.brand.name}`)}">
            <span class="logo-mark focus-segment">${escapeHtml(data.brand.mark)}</span>
            <span class="logo-main focus-segment">${escapeHtml(data.brand.name)}</span>
            <span class="logo-focus-frame" aria-hidden="true">
              <span class="logo-corner top-left"></span>
              <span class="logo-corner top-right"></span>
              <span class="logo-corner bottom-left"></span>
              <span class="logo-corner bottom-right"></span>
            </span>
          </a>

          <button
            class="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="nav-links"
            aria-label="Открыть меню"
          >
            <span></span>
            <span></span>
          </button>

          <div class="nav-links" id="nav-links">
            ${renderList(
              data.navigation,
              (item) =>
                `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`
            )}
          </div>
        </nav>

        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.hero.eyebrow)}</p>
            <h1 class="reveal reveal-delay-2">${escapeHtml(data.hero.title)}</h1>
            <p class="hero-text reveal reveal-delay-3">${escapeHtml(data.hero.text)}</p>

            <div class="hero-actions reveal reveal-delay-4">
              <a class="btn primary" href="${escapeHtml(data.hero.primaryAction.href)}">
                ${escapeHtml(data.hero.primaryAction.label)}
              </a>
              <a class="btn secondary" href="${escapeHtml(data.hero.secondaryAction.href)}">
                ${escapeHtml(data.hero.secondaryAction.label)}
              </a>
            </div>

            <ul class="hero-points reveal reveal-delay-5">
              ${renderList(
                data.hero.points,
                (item) => `<li>${escapeHtml(item)}</li>`
              )}
            </ul>
          </div>

          <div class="hero-card">
            ${renderImage(data.heroCard.image, "hero-visual reveal reveal-delay-1", "(max-width: 980px) 100vw, 32vw", "eager")}
            <div class="hero-badge reveal reveal-delay-2">${escapeHtml(data.heroCard.badge)}</div>
            <div class="hero-rating reveal reveal-delay-3">
              <strong>${escapeHtml(data.heroCard.rating)}</strong>
              <span>${escapeHtml(data.heroCard.ratingLabel)}</span>
            </div>

            <div class="schedule-card reveal reveal-delay-4">
              <p class="card-label">${escapeHtml(data.heroCard.cardLabel)}</p>
              <h2>${escapeHtml(data.heroCard.title)}</h2>
              <p>${escapeHtml(data.heroCard.text)}</p>
            </div>

            <div class="quote-card reveal reveal-delay-5">
              <p>${escapeHtml(data.heroCard.quote)}</p>
              <span>${escapeHtml(data.heroCard.quoteSource)}</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section class="section reveal" id="about">
          <div class="section-heading">
            <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.about.eyebrow)}</p>
            <h2 class="reveal reveal-delay-2">${escapeHtml(data.about.title)}</h2>
          </div>

          <div class="intro-layout">
            <div class="intro-text reveal reveal-delay-3">
              ${renderList(data.about.paragraphs, (item) => `<p>${escapeHtml(item)}</p>`)}
            </div>

            <div class="about-side">
              ${renderImage(data.about.image, "about-visual reveal reveal-delay-3", "(max-width: 980px) 100vw, 40vw")}

              <div class="facts-grid">
              ${renderList(
                data.about.facts,
                (item) => `
                  <article class="fact-card">
                    <span class="fact-number">${escapeHtml(item.value)}</span>
                    <p>${escapeHtml(item.text)}</p>
                  </article>
                `
              )}
              </div>
            </div>
          </div>
        </section>

        ${
          hasItems(data.gallery?.items)
            ? `
                <section class="section reveal" id="gallery">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.gallery.eyebrow)}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.gallery.title)}</h2>
                    <p class="section-lead reveal reveal-delay-3">${escapeHtml(data.gallery.text || "")}</p>
                  </div>

                  <div class="gallery-grid">
                    ${renderList(
                      data.gallery.items,
                      (item, index) => `
                        <article class="gallery-card ${item.size === "large" ? "gallery-card-large" : ""} reveal reveal-delay-${Math.min(index + 1, 5)}">
                          <figure class="gallery-media">
                            <img
                              src="${escapeHtml(item.src)}"
                              alt="${escapeHtml(item.alt || item.title || "")}"
                              loading="lazy"
                              sizes="${escapeHtml(item.size === "large" ? "(max-width: 980px) 100vw, 52vw" : "(max-width: 980px) 100vw, 24vw")}"
                            />
                          </figure>
                          <div class="gallery-copy">
                            <h3>${escapeHtml(item.title)}</h3>
                            <p>${escapeHtml(item.text)}</p>
                          </div>
                        </article>
                      `
                    )}
                  </div>
                </section>
              `
            : ""
        }

        <section class="section reveal" id="services">
          <div class="section-heading">
            <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.services.eyebrow)}</p>
            <h2 class="reveal reveal-delay-2">${escapeHtml(data.services.title)}</h2>
          </div>

          <div class="services-grid">
            ${renderList(
              data.services.items,
              (item, index) => `
                <article class="service-card ${index === data.services.accentIndex ? "accent-card" : ""}">
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.text)}</p>
                </article>
              `
            )}
          </div>
        </section>

        ${
          hasItems(data.priceHighlights)
            ? `
                <section class="section reveal" id="pricing">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.priceHighlightsEyebrow || "Цены")}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.priceHighlightsTitle || "Популярные услуги и понятный чек.")}</h2>
                  </div>

                  <div class="price-grid">
                    ${renderList(
                      data.priceHighlights,
                      (item) => `
                        <article class="price-card">
                          <div class="price-head">
                            <h3>${escapeHtml(item.title)}</h3>
                            <strong>${escapeHtml(item.price)}</strong>
                          </div>
                          <p class="price-meta">${escapeHtml(item.meta || "")}</p>
                          <p>${escapeHtml(item.text)}</p>
                        </article>
                      `
                    )}
                  </div>
                </section>
              `
            : ""
        }

        ${
          hasItems(data.team?.members)
            ? `
                <section class="section reveal" id="team">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.team.eyebrow)}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.team.title)}</h2>
                  </div>

                  <div class="team-layout">
                    ${
                      data.team.feature
                        ? `
                            <article class="team-feature reveal reveal-delay-3">
                              ${renderImage(data.team.feature, "team-feature-visual", "(max-width: 980px) 100vw, 36vw")}
                              <div class="team-feature-copy">
                                <p class="card-label">${escapeHtml(data.team.feature.label || "Команда")}</p>
                                <p>${escapeHtml(data.team.feature.text || "")}</p>
                              </div>
                            </article>
                          `
                        : ""
                    }

                    <div class="team-grid">
                    ${renderList(
                      data.team.members,
                      (item) => `
                        <article class="team-card">
                          ${renderSimpleImage(item.image, "team-member-photo", "(max-width: 980px) 100vw, 18vw")}
                          <div class="team-top">
                            <strong>${escapeHtml(item.name)}</strong>
                            <span>${escapeHtml(item.role)}</span>
                          </div>
                          <p>${escapeHtml(item.text)}</p>
                          <div class="team-rating">${escapeHtml(item.rating)}</div>
                        </article>
                      `
                    )}
                    </div>
                  </div>
                </section>
              `
            : ""
        }

        ${
          hasItems(data.offers?.items)
            ? `
                <section class="section reveal" id="offers">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.offers.eyebrow)}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.offers.title)}</h2>
                  </div>

                  <div class="offer-grid">
                    ${renderList(
                      data.offers.items,
                      (item) => `
                        <article class="offer-card">
                          <div class="price-head">
                            <h3>${escapeHtml(item.title)}</h3>
                            <strong>${escapeHtml(item.price)}</strong>
                          </div>
                          <p class="price-meta">${escapeHtml(item.meta)}</p>
                          <p>${escapeHtml(item.text)}</p>
                        </article>
                      `
                    )}
                  </div>
                </section>
              `
            : ""
        }

        ${
          hasItems(data.info?.groups)
            ? `
                <section class="section reveal" id="info">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.info.eyebrow)}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.info.title)}</h2>
                  </div>

                  <div class="info-grid">
                    ${renderList(
                      data.info.groups,
                      (group, index) => `
                        <article class="info-card reveal reveal-delay-${Math.min(index + 1, 5)}">
                          <h3>${escapeHtml(group.title)}</h3>
                          <ul class="info-list">
                            ${renderList(
                              group.items,
                              (item) => `<li>${escapeHtml(item)}</li>`
                            )}
                          </ul>
                        </article>
                      `
                    )}
                  </div>
                </section>
              `
            : ""
        }

        ${
          hasItems(data.visitFlow?.items)
            ? `
                <section class="section reveal" id="visit-flow">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.visitFlow.eyebrow)}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.visitFlow.title)}</h2>
                  </div>

                  <div class="flow-grid">
                    ${renderList(
                      data.visitFlow.items,
                      (item, index) => `
                        <article class="flow-card reveal reveal-delay-${Math.min(index + 1, 5)}">
                          <span class="flow-step">${escapeHtml(item.step)}</span>
                          <h3>${escapeHtml(item.title)}</h3>
                          <p>${escapeHtml(item.text)}</p>
                        </article>
                      `
                    )}
                  </div>
                </section>
              `
            : ""
        }

        ${
          hasItems(data.reviewHighlights?.items)
            ? `
                <section class="section reveal" id="review-highlights">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.reviewHighlights.eyebrow)}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.reviewHighlights.title)}</h2>
                  </div>

                  <div class="highlight-grid">
                    ${renderList(
                      data.reviewHighlights.items,
                      (item, index) => `
                        <article class="highlight-card reveal reveal-delay-${Math.min(index + 1, 5)}">
                          <h3>${escapeHtml(item.title)}</h3>
                          <p>${escapeHtml(item.text)}</p>
                        </article>
                      `
                    )}
                  </div>
                </section>
              `
            : ""
        }

        <section class="section reveal" id="reviews">
          <div class="section-heading">
            <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.reviews.eyebrow)}</p>
            <h2 class="reveal reveal-delay-2">${escapeHtml(data.reviews.title)}</h2>
          </div>

          <div class="review-grid">
            ${renderList(
              data.reviews.items,
              (item) => `
                <article class="review-card">
                  <div class="review-meta">
                    <strong>${escapeHtml(item.author)}</strong>
                    <span>${escapeHtml(item.meta)}</span>
                  </div>
                  <p>${escapeHtml(item.text)}</p>
                </article>
              `
            )}
          </div>
        </section>

        ${
          hasItems(data.faq?.items)
            ? `
                <section class="section reveal" id="faq">
                  <div class="section-heading">
                    <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.faq.eyebrow)}</p>
                    <h2 class="reveal reveal-delay-2">${escapeHtml(data.faq.title)}</h2>
                  </div>

                  <div class="faq-list">
                    ${renderList(
                      data.faq.items,
                      (item, index) => `
                        <details class="faq-item reveal reveal-delay-${Math.min(index + 1, 5)}">
                          <summary>
                            <span>${escapeHtml(item.question)}</span>
                          </summary>
                          <p>${escapeHtml(item.answer)}</p>
                        </details>
                      `
                    )}
                  </div>
                </section>
              `
            : ""
        }

        <section class="section reveal" id="contact">
          <div class="contact-panel">
            <div>
              <p class="eyebrow reveal reveal-delay-1">${escapeHtml(data.contact.eyebrow)}</p>
              <h2 class="reveal reveal-delay-2">${escapeHtml(data.contact.title)}</h2>
              <p class="contact-text reveal reveal-delay-3">${escapeHtml(data.contact.text)}</p>
            </div>

            <div class="contact-info reveal reveal-delay-4">
              <a class="contact-link" href="${escapeHtml(data.contact.phoneHref)}">
                ${escapeHtml(data.contact.phoneLabel)}
              </a>
              <p>${escapeHtml(data.contact.address)}</p>
              <a
                class="btn primary wide"
                href="${escapeHtml(data.contact.mapHref)}"
                target="_blank"
                rel="noreferrer"
              >
                ${escapeHtml(data.contact.mapLabel)}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>© <span id="year"></span> ${escapeHtml(data.footer)}</p>
      </footer>

      ${
        data.floatingCta
          ? `
              <div class="floating-cta reveal is-visible">
                <a class="floating-cta-copy btn-specular-panel" href="${escapeHtml(data.floatingCta.primaryHref)}">
                  <span class="specular-panel-fx" aria-hidden="true"></span>
                  <span>${escapeHtml(data.floatingCta.label)}</span>
                </a>
                <div class="floating-cta-actions">
                  <a class="btn primary btn-specular" href="${escapeHtml(data.floatingCta.primaryHref)}">
                    ${escapeHtml(data.floatingCta.primaryLabel)}
                  </a>
                  <a class="btn secondary" href="${escapeHtml(data.floatingCta.secondaryHref)}" target="_blank" rel="noreferrer">
                    ${escapeHtml(data.floatingCta.secondaryLabel)}
                  </a>
                </div>
              </div>
            `
          : ""
      }
    </div>
  `;
};

const setupMenu = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navAnchors = document.querySelectorAll(".nav-links a");

  if (!menuToggle || !navLinks) {
    return;
  }

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navAnchors.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
};

const setupReveal = () => {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || revealItems.length === 0) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const setupButtonShine = () => {
  const buttons = document.querySelectorAll(".btn, .btn-specular-panel");

  buttons.forEach((button) => {
    const setPointer = (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      button.style.setProperty("--mx", `${x}px`);
      button.style.setProperty("--my", `${y}px`);

      if (
        button.classList.contains("btn-specular") ||
        button.classList.contains("btn-specular-panel")
      ) {
        const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2);
        button.style.setProperty("--spec-angle", `${angle}rad`);

        const distanceX = Math.abs(event.clientX - (rect.left + rect.width / 2));
        const distanceY = Math.abs(event.clientY - (rect.top + rect.height / 2));
        const distance = Math.hypot(distanceX, distanceY);
        const proximity = Math.max(0, 1 - distance / 220);
        button.style.setProperty("--spec-opacity", `${0.38 + proximity * 0.62}`);
      }

      button.classList.add("is-specular");
    };

    button.addEventListener("pointermove", setPointer);
    button.addEventListener("pointerenter", setPointer);
    button.addEventListener("pointerleave", () => {
      button.classList.remove("is-specular");
      if (
        button.classList.contains("btn-specular") ||
        button.classList.contains("btn-specular-panel")
      ) {
        button.style.removeProperty("--spec-opacity");
      }
    });
  });
};

const setupSpecularPanels = () => {
  const panels = document.querySelectorAll(".btn-specular-panel");

  panels.forEach((panel) => {
    const fx = panel.querySelector(".specular-panel-fx");

    if (!fx) {
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    fx.appendChild(canvas);

    const state = {
      width: 0,
      height: 0,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      angle: 2.4,
      pointerAngle: null,
      proximity: 0,
      intensity: 0,
      idleAngle: 2.4,
      rafId: null,
      lastTime: performance.now(),
    };

    const resize = () => {
      const rect = panel.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * state.dpr));
      canvas.height = Math.max(1, Math.round(rect.height * state.dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const drawRoundedRect = (ctx, x, y, width, height, radius) => {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    };

    const render = (now) => {
      const dt = Math.min((now - state.lastTime) / 1000, 0.05);
      state.lastTime = now;
      state.idleAngle += 0.35 * dt;

      const targetAngle = state.pointerAngle ?? state.idleAngle;
      const diff = ((targetAngle - state.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      state.angle += diff * (1 - Math.exp(-dt * 7));
      state.intensity += (state.proximity - state.intensity) * (1 - Math.exp(-dt * 8));

      const ctx = context;
      const dpr = state.dpr;
      const width = state.width;
      const height = state.height;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const lineWidth = 1.25;
      const radius = 18;
      const inset = 1.5;
      const gradRadius = Math.max(width, height) * 0.9;
      const cx = width / 2;
      const cy = height / 2;
      const lightX = cx + Math.cos(state.angle) * gradRadius;
      const lightY = cy + Math.sin(state.angle) * gradRadius;

      const baseAlpha = 0.16 + state.intensity * 0.18;
      const hiAlpha = state.intensity * 0.95;

      drawRoundedRect(ctx, inset, inset, width - inset * 2, height - inset * 2, radius);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = `rgba(120, 102, 88, ${baseAlpha})`;
      ctx.stroke();

      const edgeGradient = ctx.createLinearGradient(
        cx - Math.cos(state.angle) * gradRadius,
        cy - Math.sin(state.angle) * gradRadius,
        lightX,
        lightY
      );
      edgeGradient.addColorStop(0, "rgba(255,255,255,0)");
      edgeGradient.addColorStop(0.34, `rgba(255,255,255,${hiAlpha * 0.18})`);
      edgeGradient.addColorStop(0.5, `rgba(255,255,255,${hiAlpha})`);
      edgeGradient.addColorStop(0.66, `rgba(255,255,255,${hiAlpha * 0.18})`);
      edgeGradient.addColorStop(1, "rgba(255,255,255,0)");

      drawRoundedRect(ctx, inset, inset, width - inset * 2, height - inset * 2, radius);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = edgeGradient;
      ctx.shadowColor = `rgba(255,255,255,${hiAlpha * 0.45})`;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (state.intensity > 0.02) {
        const fillGlow = ctx.createRadialGradient(cx, cy, 0, lightX, lightY, gradRadius);
        fillGlow.addColorStop(0, `rgba(255,255,255,${state.intensity * 0.02})`);
        fillGlow.addColorStop(0.5, `rgba(255,255,255,${state.intensity * 0.045})`);
        fillGlow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.save();
        drawRoundedRect(ctx, inset + 1, inset + 1, width - (inset + 1) * 2, height - (inset + 1) * 2, radius - 1);
        ctx.clip();
        ctx.fillStyle = fillGlow;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      state.rafId = window.requestAnimationFrame(render);
    };

    const updatePointer = (event) => {
      const rect = panel.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist === 0) {
        const nx = (event.clientX - cx) / (rect.width / 2);
        const ny = (cy - event.clientY) / (rect.height / 2);
        state.pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
      } else {
        state.pointerAngle = Math.atan2(cy - event.clientY, event.clientX - cx);
      }

      const t = Math.max(0, 1 - dist / 250);
      state.proximity = t * t * (3 - 2 * t);
    };

    const onPointerLeave = () => {
      state.pointerAngle = null;
      state.proximity = 0;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(panel);
    resize();

    window.addEventListener("pointermove", updatePointer);
    panel.addEventListener("pointerleave", onPointerLeave);
    state.rafId = window.requestAnimationFrame(render);
  });
};

const setupCursorGlow = () => {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let rafId = null;

  const render = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    glow.style.transform = `translate(${currentX}px, ${currentY}px)`;

    if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
      rafId = window.requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    glow.classList.add("is-visible");

    if (!rafId) {
      rafId = window.requestAnimationFrame(render);
    }
  });

  window.addEventListener("pointerdown", () => {
    glow.classList.add("is-active");
  });

  window.addEventListener("pointerup", () => {
    glow.classList.remove("is-active");
  });

  window.addEventListener("pointerleave", () => {
    glow.classList.remove("is-visible");
  });
};

const setupLogoFocus = () => {
  const logos = document.querySelectorAll(".focus-logo");

  logos.forEach((logo) => {
    const segments = Array.from(logo.querySelectorAll(".focus-segment"));
    const frame = logo.querySelector(".logo-focus-frame");

    if (!segments.length || !frame) {
      return;
    }

    let activeIndex = 0;
    let intervalId = null;

    const updateFrame = (index) => {
      const target = segments[index];
      const parentRect = logo.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      logo.style.setProperty("--logo-focus-x", `${targetRect.left - parentRect.left}px`);
      logo.style.setProperty("--logo-focus-y", `${targetRect.top - parentRect.top}px`);
      logo.style.setProperty("--logo-focus-w", `${targetRect.width}px`);
      logo.style.setProperty("--logo-focus-h", `${targetRect.height}px`);

      segments.forEach((segment, segmentIndex) => {
        segment.classList.toggle("is-focused", segmentIndex === index);
        segment.classList.toggle("is-dimmed", segmentIndex !== index);
      });
    };

    const startCycle = () => {
      intervalId = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % segments.length;
        updateFrame(activeIndex);
      }, 1900);
    };

    const stopCycle = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    segments.forEach((segment, index) => {
      segment.addEventListener("pointerenter", () => {
        stopCycle();
        activeIndex = index;
        updateFrame(activeIndex);
      });
    });

    logo.addEventListener("pointerleave", () => {
      stopCycle();
      startCycle();
    });

    window.addEventListener("resize", () => updateFrame(activeIndex));

    updateFrame(activeIndex);
    startCycle();
  });
};

applyTheme(siteData.theme);
buildSite(siteData);
setupMenu();
setupReveal();
setupButtonShine();
setupSpecularPanels();
setupLogoFocus();
setupCursorGlow();

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}
