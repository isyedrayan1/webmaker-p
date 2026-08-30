import {
  DEFAULT_CLINIC_DATA,
  THEME_PALETTES,
  type BookingSectionData,
  type ButtonActionConfig,
  type DoctorsSectionData,
  type FooterSectionData,
  type HeroSectionData,
  type HoursSectionData,
  type LandingPageData,
  type NavbarSectionData,
  type ReviewsSectionData,
  type ServicesSectionData,
  type StatsSectionData,
  type WhyUsSectionData,
} from "./builder-types";

function escapeHtml(text?: string | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ICONS = {
  hospital: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/><rect width="20" height="20" x="2" y="2" rx="4"/></svg>`,
  phone: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  stethoscope: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  star: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  alert: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  mapPin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  sparkle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  activity: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>`,
};

export function resolveButtonProps(
  buttonId: string,
  defaultLabel: string,
  defaultTarget: string,
  defaultVariant: "btn-primary" | "btn-accent" | "btn-outline",
  site?: LandingPageData | null
) {
  const config = site?.buttonConfigs?.[buttonId];
  if (!config) {
    const legacyHref = site?.buttonLinks?.[buttonId] || defaultTarget;
    return {
      label: defaultLabel,
      href: legacyHref,
      targetAttr: legacyHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : "",
      variantClass: defaultVariant,
    };
  }

  let href = defaultTarget;
  if (config.actionType === "section") {
    href = config.target.startsWith("#") ? config.target : `#${config.target}`;
  } else if (config.actionType === "url") {
    href =
      config.target.startsWith("http") || config.target.startsWith("/")
        ? config.target
        : `https://${config.target}`;
  } else if (config.actionType === "phone") {
    href = `tel:${config.target.replace(/[^0-9+]/g, "")}`;
  } else if (config.actionType === "email") {
    href = `mailto:${config.target.trim()}`;
  }

  const targetAttr = config.openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : "";
  const variantClass = config.variant || defaultVariant;
  const label = config.label || defaultLabel;

  return { label, href, targetAttr, variantClass };
}

function renderHero(
  hero: Partial<HeroSectionData>,
  editAttr: string,
  site?: LandingPageData | null
): string {
  const primaryBtn = resolveButtonProps(
    "hero.primaryCta",
    hero.primaryCta || "Schedule a Consultation",
    "#booking",
    "btn-primary",
    site
  );
  const secondaryBtn = resolveButtonProps(
    "hero.secondaryCta",
    hero.secondaryCta || "Explore Specialties",
    "#services",
    "btn-outline",
    site
  );
  const cardBtn = resolveButtonProps(
    "hero.cardCta",
    "Schedule Visit Today",
    "#booking",
    "btn-accent",
    site
  );

  return `
  <!-- HERO SECTION -->
  <section id="hero" style="background: linear-gradient(180deg, var(--bg-light) 0%, rgba(255,255,255,0.7) 100%); border-bottom: 1px solid var(--border-light);">
    <div class="container">
      <div class="grid-hero">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background-color: rgba(0,0,0,0.04); border: 1px solid var(--border-light); font-size: 0.75rem; font-weight: 600; color: var(--primary); margin-bottom: 1.5rem;">
            ${ICONS.shield} <span ${editAttr} data-field="hero.badge">${escapeHtml(hero.badge || "Trusted Community Healthcare")}</span>
          </div>
          <h1 class="font-serif section-title" style="margin-bottom: 1.25rem;" ${editAttr} data-field="hero.headline">
            ${escapeHtml(hero.headline || "Comprehensive Care Close to Home.")}
          </h1>
          <p class="section-desc" style="margin-bottom: 2rem;" ${editAttr} data-field="hero.subheadline">
            ${escapeHtml(hero.subheadline || "Compassionate, high-precision medical care backed by board-certified specialists.")}
          </p>
          <div class="hero-cta-group" style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
            <a href="${primaryBtn.href}" ${primaryBtn.targetAttr} data-btn-id="hero.primaryCta" class="btn ${primaryBtn.variantClass}" style="padding: 0.9rem 2rem; font-size: 1rem;" ${editAttr} data-field="hero.primaryCta">${escapeHtml(primaryBtn.label)}</a>
            <a href="${secondaryBtn.href}" ${secondaryBtn.targetAttr} data-btn-id="hero.secondaryCta" class="btn ${secondaryBtn.variantClass}" style="padding: 0.9rem 1.75rem;" ${editAttr} data-field="hero.secondaryCta">${escapeHtml(secondaryBtn.label)}</a>
          </div>
          <p style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono); display: flex; align-items: center; gap: 0.4rem;">
            ${ICONS.check} <span ${editAttr} data-field="hero.trustSnippet">${escapeHtml(hero.trustSnippet || "Accepting all major insurance providers · Same-day walk-ins welcome")}</span>
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid var(--border-light); border-radius: 2rem; padding: 2.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.05); text-align: center;">
          <div style="width: 70px; height: 70px; aspect-ratio: 1/1; background: rgba(0,0,0,0.04); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; color: var(--primary);">
            ${ICONS.stethoscope}
          </div>
          <h3 class="font-serif" style="font-size: 2rem; margin-bottom: 0.5rem;">Care When You Need It</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Same-day urgent appointments, direct specialist consultations, and rapid testing.</p>
          <a href="${cardBtn.href}" ${cardBtn.targetAttr} data-btn-id="hero.cardCta" class="btn ${cardBtn.variantClass}" style="width: 100%;">${escapeHtml(cardBtn.label)}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function renderStats(stats: Partial<StatsSectionData>, editAttr: string): string {
  return `
  <!-- STATS COUNTER -->
  <section id="stats" style="background-color: #ffffff; border-bottom: 1px solid var(--border-light); padding: 3.5rem 0;">
    <div class="container">
      <div class="grid-stats">
        ${(stats.items || [
          { id: "1", value: "22+", label: "Years of Service", subtext: "Serving local families" },
          { id: "2", value: "48", label: "Specialist Physicians", subtext: "Board-certified doctors" },
          { id: "3", value: "99.4%", label: "Patient Satisfaction", subtext: "Verified surveys" },
          { id: "4", value: "140K+", label: "Patients Treated", subtext: "Comprehensive care" },
        ])
          .map(
            (item, index) => `
        <div style="text-align: center; padding: 0.5rem;">
          <div class="font-serif" style="font-size: 2.75rem; color: var(--primary); font-weight: bold; line-height: 1;" ${editAttr} data-field="stats.items.${index}.value">${escapeHtml(item.value)}</div>
          <div style="font-weight: 700; font-size: 0.95rem; margin-top: 0.5rem;" ${editAttr} data-field="stats.items.${index}.label">${escapeHtml(item.label)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;" ${editAttr} data-field="stats.items.${index}.subtext">${escapeHtml(item.subtext)}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function renderWhyUs(whyUs: Partial<WhyUsSectionData>, editAttr: string): string {
  return `
  <!-- WHY CHOOSE US -->
  <section id="why-us">
    <div class="container">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span class="section-eyebrow" ${editAttr} data-field="whyUs.eyebrow">${escapeHtml(whyUs.eyebrow || "Why Choose Us")}</span>
        <h2 class="section-title" style="margin: 0.5rem auto 0 auto;" ${editAttr} data-field="whyUs.headline">${escapeHtml(whyUs.headline || "Patient-First Medicine with Clear, Transparent Care.")}</h2>
        <p class="section-desc" style="margin: 1rem auto 0 auto;" ${editAttr} data-field="whyUs.description">${escapeHtml(whyUs.description || "We combine medical expertise with warmth and personal attention.")}</p>
      </div>

      <div class="grid-whyus">
        ${(whyUs.pillars || [
          { id: "1", title: "Board-Certified Specialists", description: "Dedicated to evidence-based treatment plans." },
          { id: "2", title: "Zero Long Waiting Times", description: "Streamlined check-in so you receive care promptly." },
          { id: "3", title: "Advanced On-Site Lab", description: "Rapid testing and imaging results delivered within visit." },
        ])
          .map(
            (pillar, index) => `
        <div class="card">
          <div class="icon-box" style="margin-bottom: 1.25rem;">
            ${ICONS.shield}
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;" ${editAttr} data-field="whyUs.pillars.${index}.title">${escapeHtml(pillar.title)}</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;" ${editAttr} data-field="whyUs.pillars.${index}.description">${escapeHtml(pillar.description)}</p>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function renderServices(services: Partial<ServicesSectionData>, editAttr: string): string {
  return `
  <!-- SERVICES GRID -->
  <section id="services" style="background-color: #ffffff; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
    <div class="container">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span class="section-eyebrow" ${editAttr} data-field="services.eyebrow">${escapeHtml(services.eyebrow || "Clinical Departments")}</span>
        <h2 class="section-title" style="margin: 0.5rem auto 0 auto;" ${editAttr} data-field="services.headline">${escapeHtml(services.headline || "Specialized Medical Services Under One Roof.")}</h2>
        <p class="section-desc" style="margin: 1rem auto 0 auto;" ${editAttr} data-field="services.description">${escapeHtml(services.description || "From preventive family wellness to specialized interventions.")}</p>
      </div>

      <div class="grid-services">
        ${(services.services || [
          { id: "1", name: "Primary & Family Medicine", badge: "All Ages", description: "Routine physicals, vaccinations, and chronic care management.", highlights: ["Screenings", "Immunizations"] },
          { id: "2", name: "Cardiovascular Care", badge: "Specialized", description: "Cardiac diagnostics, echocardiograms, and hypertension management.", highlights: ["ECG", "Echocardiogram"] },
          { id: "3", name: "Orthopedics & Rehab", badge: "Rapid Recovery", description: "Joint preservation, fracture care, and physical rehabilitation.", highlights: ["Rehab", "Therapy"] },
        ])
          .map(
            (srv, index) => `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <div class="icon-box">${ICONS.activity}</div>
              <span style="font-size: 0.7rem; font-family: var(--font-mono); text-transform: uppercase; background: var(--bg-light); padding: 0.25rem 0.6rem; border-radius: 9999px; font-weight: 600;" ${editAttr} data-field="services.services.${index}.badge">${escapeHtml(srv.badge)}</span>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;" ${editAttr} data-field="services.services.${index}.name">${escapeHtml(srv.name)}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;" ${editAttr} data-field="services.services.${index}.description">${escapeHtml(srv.description)}</p>
          </div>
          <div style="border-top: 1px solid var(--border-light); padding-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${(srv.highlights || [])
              .map((h) => `<span style="font-size: 0.75rem; background: var(--bg-light); padding: 0.2rem 0.5rem; border-radius: 6px; color: var(--text-muted); display: inline-flex; align-items: center; gap: 0.25rem;">${ICONS.check} ${escapeHtml(h)}</span>`)
              .join("")}
          </div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function renderDoctors(doctors: Partial<DoctorsSectionData>, editAttr: string): string {
  return `
  <!-- DOCTOR ROSTER -->
  <section id="doctors">
    <div class="container">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span class="section-eyebrow" ${editAttr} data-field="doctors.eyebrow">${escapeHtml(doctors.eyebrow || "Medical Leadership")}</span>
        <h2 class="section-title" style="margin: 0.5rem auto 0 auto;" ${editAttr} data-field="doctors.headline">${escapeHtml(doctors.headline || "Meet Our Dedicated Specialists.")}</h2>
        <p class="section-desc" style="margin: 1rem auto 0 auto;" ${editAttr} data-field="doctors.description">${escapeHtml(doctors.description || "Experienced physicians who treat you with warmth and respect.")}</p>
      </div>

      <div class="grid-doctors">
        ${(doctors.doctors || [
          { id: "1", name: "Dr. Eleanor Vance, MD", role: "Chief of Cardiology", credentials: "Harvard Medical · FACC", experience: "16+ Years Experience" },
          { id: "2", name: "Dr. Marcus Thorne, MD", role: "Lead Orthopedic Surgeon", credentials: "Johns Hopkins · FAAOS", experience: "14+ Years Experience" },
          { id: "3", name: "Dr. Maya Patel, MD", role: "Director of Pediatrics", credentials: "Stanford Medicine · FAAP", experience: "12+ Years Experience" },
        ])
          .map(
            (doc, index) => `
        <div class="card" style="text-align: center;">
          <div class="card-doctor-avatar">
            ${escapeHtml((doc.name || "D").replace("Dr. ", "").slice(0, 1))}
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700;" ${editAttr} data-field="doctors.doctors.${index}.name">${escapeHtml(doc.name)}</h3>
          <p style="color: var(--primary); font-weight: 600; font-size: 0.85rem; margin-top: 0.25rem;" ${editAttr} data-field="doctors.doctors.${index}.role">${escapeHtml(doc.role)}</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;" ${editAttr} data-field="doctors.doctors.${index}.credentials">${escapeHtml(doc.credentials)}</p>
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-light); font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted);">
            ${escapeHtml(doc.experience)}
          </div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function renderReviews(reviews: Partial<ReviewsSectionData>, editAttr: string): string {
  return `
  <!-- PATIENT REVIEWS -->
  <section id="reviews" style="background-color: #ffffff; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
    <div class="container">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span class="section-eyebrow" ${editAttr} data-field="reviews.eyebrow">${escapeHtml(reviews.eyebrow || "Patient Feedback")}</span>
        <h2 class="section-title" style="margin: 0.5rem auto 0 auto;" ${editAttr} data-field="reviews.headline">${escapeHtml(reviews.headline || "Real Stories from Patients We've Cared For.")}</h2>
        <div style="margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 700; color: var(--primary);">
          <span>${ICONS.star} ${ICONS.star} ${ICONS.star} ${ICONS.star} ${ICONS.star}</span>
          <span ${editAttr} data-field="reviews.ratingAverage">${escapeHtml(reviews.ratingAverage || "4.9")}</span>
          <span>/ 5.0 (</span><span ${editAttr} data-field="reviews.totalReviews">${escapeHtml(reviews.totalReviews || "1,200+")}</span> <span>Verified Reviews)</span>
        </div>
      </div>

      <div class="grid-reviews">
        ${(reviews.reviews || [
          { id: "1", quote: "Dr. Vance took time to explain everything clearly. Exceptional clinic experience.", patientName: "Robert C.", treatment: "Cardiology Patient" },
          { id: "2", quote: "Our whole family visits here. The staff is gentle and thorough.", patientName: "Sarah M.", treatment: "Family Medicine" },
          { id: "3", quote: "Had me back on my feet in 8 weeks after a sports injury. Modern and clean facility.", patientName: "David L.", treatment: "Orthopedics" },
        ])
          .map(
            (rev, index) => `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; gap: 2px; margin-bottom: 0.75rem;">${ICONS.star} ${ICONS.star} ${ICONS.star} ${ICONS.star} ${ICONS.star}</div>
            <p style="font-style: italic; color: var(--text-dark); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;" ${editAttr} data-field="reviews.reviews.${index}.quote">"${escapeHtml(rev.quote)}"</p>
          </div>
          <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
            <strong ${editAttr} data-field="reviews.reviews.${index}.patientName">${escapeHtml(rev.patientName)}</strong>
            <span ${editAttr} data-field="reviews.reviews.${index}.treatment">${escapeHtml(rev.treatment)}</span>
          </div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function renderHours(hours: Partial<HoursSectionData>, editAttr: string): string {
  return `
  <!-- HOURS & EMERGENCY -->
  <section id="hours">
    <div class="container">
      <div class="grid-hours">
        <div>
          <span class="section-eyebrow" ${editAttr} data-field="hours.eyebrow">${escapeHtml(hours.eyebrow || "Clinic Schedule")}</span>
          <h2 class="section-title" ${editAttr} data-field="hours.headline">${escapeHtml(hours.headline || "Operating Hours & Emergency Triage.")}</h2>
          <p class="section-desc" ${editAttr} data-field="hours.description">${escapeHtml(hours.description || "Convenient morning, evening, and weekend hours.")}</p>

          <div style="margin-top: 2rem; background: rgba(0,0,0,0.03); border-left: 4px solid var(--primary); padding: 1.25rem; border-radius: 0.5rem;">
            <p style="font-weight: 700; color: var(--text-dark); display: flex; align-items: center; gap: 0.4rem;">${ICONS.alert} 24/7 Emergency Assistance</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;" ${editAttr} data-field="hours.emergencyNotice">${escapeHtml(hours.emergencyNotice || "Urgent care & triage available 24/7.")}</p>
            <a href="tel:${hours.emergencyHotline || "+1 (800) 427-2673"}" style="display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 0.5rem; font-weight: bold; color: var(--primary); text-decoration: none;">${ICONS.phone} Hotline: <span ${editAttr} data-field="hours.emergencyHotline">${escapeHtml(hours.emergencyHotline || "+1 (800) 427-2673")}</span></a>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem;">Regular Operating Hours</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${(hours.schedule || [
              { day: "Monday – Friday", hours: "7:30 AM – 7:00 PM" },
              { day: "Saturday", hours: "8:30 AM – 4:00 PM" },
              { day: "Sunday", hours: "9:00 AM – 2:00 PM (Urgent Care)" },
            ])
              .map(
                (item, index) => `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-light); padding-bottom: 0.5rem; font-size: 0.9rem;">
              <span style="font-weight: 600;" ${editAttr} data-field="hours.schedule.${index}.day">${escapeHtml(item.day)}</span>
              <span style="color: var(--text-muted); font-family: var(--font-mono);" ${editAttr} data-field="hours.schedule.${index}.hours">${escapeHtml(item.hours)}</span>
            </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderBooking(
  booking: Partial<BookingSectionData>,
  editAttr: string,
  site?: LandingPageData | null
): string {
  const submitBtn = resolveButtonProps(
    "booking.submit",
    "Submit Request",
    "#",
    "btn-primary",
    site
  );

  return `
  <!-- BOOKING & CONTACT FORM -->
  <section id="booking" style="background-color: #ffffff; border-top: 1px solid var(--border-light);">
    <div class="container">
      <div class="grid-booking">
        <div>
          <span class="section-eyebrow" ${editAttr} data-field="booking.eyebrow">${escapeHtml(booking.eyebrow || "Get in Touch")}</span>
          <h2 class="section-title" ${editAttr} data-field="booking.headline">${escapeHtml(booking.headline || "Schedule Your Appointment Today.")}</h2>
          <p class="section-desc" ${editAttr} data-field="booking.description">${escapeHtml(booking.description || "Fill out the form below or call us directly.")}</p>

          <div style="margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div class="icon-box">${ICONS.mapPin}</div>
              <div>
                <strong>Clinic Address</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted);"><span ${editAttr} data-field="booking.address">${escapeHtml(booking.address || "742 Evergreen Parkway")}</span>, <span ${editAttr} data-field="booking.cityState">${escapeHtml(booking.cityState || "Seattle, WA")}</span></p>
              </div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div class="icon-box">${ICONS.phone}</div>
              <div>
                <strong>Direct Phone</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted);" ${editAttr} data-field="booking.phone">${escapeHtml(booking.phone || "+1 (206) 555-0198")}</p>
              </div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div class="icon-box">${ICONS.mail}</div>
              <div>
                <strong>Email Inquiries</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted);" ${editAttr} data-field="booking.email">${escapeHtml(booking.email || "care@clinic.org")}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="background-color: var(--bg-light);">
          <h3 class="font-serif" style="font-size: 1.75rem; margin-bottom: 1.25rem;" ${editAttr} data-field="booking.formTitle">${escapeHtml(booking.formTitle || "Request an Appointment")}</h3>
          <form id="appointmentForm" onsubmit="event.preventDefault(); alert('Thank you! Your appointment request has been received.'); this.reset();">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">Patient Full Name</label>
              <input required type="text" placeholder="e.g. Jane Doe" style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-light); font-family: inherit; font-size: 0.9rem;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">Phone Number</label>
                <input required type="tel" placeholder="(555) 000-0000" style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-light); font-family: inherit; font-size: 0.9rem;">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">Preferred Date</label>
                <input required type="date" style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-light); font-family: inherit; font-size: 0.9rem;">
              </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">Department / Specialty</label>
              <select style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-light); font-family: inherit; font-size: 0.9rem; background: #fff;">
                ${(booking.departments || ["Cardiology", "Primary Care", "Pediatrics", "Orthopedics"]).map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("")}
              </select>
            </div>
            <button type="submit" data-btn-id="booking.submit" class="btn ${submitBtn.variantClass}" style="width: 100%; padding: 0.85rem;">${escapeHtml(submitBtn.label)}</button>
          </form>
        </div>
      </div>
    </div>
  </section>`;
}

function renderFooter(footer: Partial<FooterSectionData>, editAttr: string, defaultName: string): string {
  return `
  <!-- FOOTER -->
  <footer id="footer" style="background-color: var(--bg-dark); color: #ffffff; padding: 4rem 0 2rem 0;">
    <div class="container">
      <div class="grid-footer">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;" ${editAttr} data-field="footer.hospitalName">${escapeHtml(footer.hospitalName || defaultName)}</h3>
          <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.6;" ${editAttr} data-field="footer.description">${escapeHtml(footer.description || "Dedicated community healthcare providing patient-first medical excellence.")}</p>
          <p style="margin-top: 1rem; font-size: 0.75rem; color: var(--accent); font-family: var(--font-mono); display: flex; align-items: center; gap: 0.35rem;">${ICONS.check} <span ${editAttr} data-field="footer.accreditationBadge">${escapeHtml(footer.accreditationBadge || "JCAHO Accredited · State Certified")}</span></p>
        </div>
        <div>
          <h4 style="font-size: 0.9rem; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 1rem; color: rgba(255,255,255,0.5);">Quick Links</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${(footer.quickLinks || [
              { label: "Specialties", href: "#services" },
              { label: "Physicians", href: "#doctors" },
              { label: "Patient Reviews", href: "#reviews" },
              { label: "Clinic Hours", href: "#hours" },
              { label: "Appointment Booking", href: "#booking" },
            ])
              .map((link) => `<a href="${link.href}" style="color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.85rem;">${escapeHtml(link.label)}</a>`)
              .join("")}
          </div>
        </div>
        <div>
          <h4 style="font-size: 0.9rem; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 1rem; color: rgba(255,255,255,0.5);">Direct Contact</h4>
          <p style="font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">${ICONS.mapPin} <span ${editAttr} data-field="footer.address">${escapeHtml(footer.address || "742 Evergreen Parkway, Seattle, WA")}</span></p>
          <p style="font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">${ICONS.phone} <span ${editAttr} data-field="footer.phone">${escapeHtml(footer.phone || "+1 (206) 555-0198")}</span></p>
          <p style="font-size: 0.85rem; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 0.4rem;">${ICONS.mail} <span ${editAttr} data-field="footer.email">${escapeHtml(footer.email || "care@clinic.org")}</span></p>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; display: flex; flex-direction: column; gap: 1rem; font-size: 0.75rem; color: rgba(255,255,255,0.5);">
        <p ${editAttr} data-field="footer.medicalDisclaimer">${escapeHtml(footer.medicalDisclaimer || "Medical Disclaimer: The medical information on this site is provided as an information resource only.")}</p>
        <p ${editAttr} data-field="footer.copyrightText">${escapeHtml(footer.copyrightText || `© 2026 ${defaultName}. All rights reserved.`)}</p>
      </div>
    </div>
  </footer>`;
}

export function compileLandingPageToHtml(
  site?: LandingPageData | null,
  isEditable = false
): string {
  const safeSite = site || DEFAULT_CLINIC_DATA;
  const theme = THEME_PALETTES[safeSite.theme] || THEME_PALETTES.emerald;

  const sectionsList =
    Array.isArray(safeSite.sections) && safeSite.sections.length > 0
      ? safeSite.sections
      : DEFAULT_CLINIC_DATA.sections;

  // Filter and sort active sections strictly according to user order
  const activeSections = [...sectionsList]
    .filter((s) => s && s.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const navbarBlock = activeSections.find((s) => s.type === "navbar");
  const navbar = (navbarBlock?.data || {}) as Partial<NavbarSectionData>;
  const heroBlock = activeSections.find((s) => s.type === "hero");
  const hero = (heroBlock?.data || {}) as Partial<HeroSectionData>;
  const footerBlock = activeSections.find((s) => s.type === "footer");
  const footer = (footerBlock?.data || {}) as Partial<FooterSectionData>;

  const editAttr = isEditable ? 'contenteditable="true" spellcheck="false"' : "";

  const navbarBtn = resolveButtonProps(
    "navbar.cta",
    navbar.ctaText || "Book Appointment",
    "#booking",
    "btn-primary",
    safeSite
  );

  // Dynamic Section Renderers Map
  const sectionRenderers: Record<string, (data: unknown) => string> = {
    hero: (data) => renderHero((data || {}) as Partial<HeroSectionData>, editAttr, safeSite),
    stats: (data) => renderStats((data || {}) as Partial<StatsSectionData>, editAttr),
    why_us: (data) => renderWhyUs((data || {}) as Partial<WhyUsSectionData>, editAttr),
    services: (data) => renderServices((data || {}) as Partial<ServicesSectionData>, editAttr),
    doctors: (data) => renderDoctors((data || {}) as Partial<DoctorsSectionData>, editAttr),
    reviews: (data) => renderReviews((data || {}) as Partial<ReviewsSectionData>, editAttr),
    hours: (data) => renderHours((data || {}) as Partial<HoursSectionData>, editAttr),
    booking: (data) => renderBooking((data || {}) as Partial<BookingSectionData>, editAttr, safeSite),
  };

  // Render all active body sections in their exact user-specified order
  const bodyContent = activeSections
    .filter((sec) => sec.type !== "navbar" && sec.type !== "footer")
    .map((sec) => {
      const fn = sectionRenderers[sec.type];
      return fn ? fn(sec.data) : "";
    })
    .join("\n");

  const pageTitle = safeSite.seo?.title || `${safeSite.name || "Care Clinic"} | Healthcare Excellence`;
  const pageDescription = safeSite.seo?.description || hero.subheadline || safeSite.name || "Medical Center";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title id="pageTitleTag">${escapeHtml(pageTitle)}</title>
  <meta name="description" id="pageMetaDescTag" content="${escapeHtml(pageDescription)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${theme.primary};
      --primary-hover: ${theme.primaryHover};
      --accent: ${theme.accent};
      --bg-light: ${theme.bgLight};
      --bg-dark: ${theme.bgDark};
      --border-light: ${theme.borderLight};
      --text-dark: ${theme.textDark};
      --text-muted: ${theme.textMuted};
      --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-serif: 'Instrument Serif', Georgia, serif;
      --font-mono: 'DM Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-family: var(--font-sans); color: var(--text-dark); background-color: var(--bg-light); line-height: 1.6; scroll-behavior: smooth; }
    body { min-height: 100vh; overflow-x: hidden; }

    .font-serif { font-family: var(--font-serif); }
    .font-mono { font-family: var(--font-mono); }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.875rem; border-radius: 9999px; text-decoration: none; transition: background-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease; cursor: pointer; border: none; }
    .btn-primary { background-color: var(--primary) !important; color: #ffffff !important; }
    .btn-primary:hover { background-color: var(--primary-hover) !important; }
    .btn-accent { background-color: var(--accent) !important; color: var(--text-dark) !important; }
    .btn-accent:hover { opacity: 0.92; }
    .btn-outline { border: 1px solid var(--border-light) !important; background-color: transparent !important; color: var(--text-dark) !important; }
    .btn-outline:hover { background-color: rgba(0,0,0,0.03) !important; }

    /* Grain Overlay */
    .grain::after {
      content: "";
      pointer-events: none;
      position: fixed;
      inset: 0;
      opacity: .03;
      z-index: 99;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
    }

    /* Top Emergency Bar */
    .topbar { background-color: var(--primary); color: rgba(255,255,255,0.9); font-size: 0.75rem; padding: 0.5rem 0; min-height: 34px; }

    /* Navbar & Seamless Dropdown Menu */
    .navbar { position: sticky; top: 0; z-index: 50; background-color: rgba(255,255,255,0.98); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-light); }
    .navbar-inner { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; }
    .navbar-brand { display: flex; align-items: center; gap: 0.75rem; user-select: none; min-width: 0; }
    .brand-logo { width: 38px; height: 38px; aspect-ratio: 1/1; background-color: var(--primary); color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; flex-shrink: 0; }
    .brand-title { font-weight: 700; font-size: 1.15rem; color: var(--text-dark); display: block; line-height: 1.2; }
    .brand-tagline { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-family: var(--font-mono); display: block; }
    .nav-link { color: var(--text-muted); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.15s; }
    .nav-link:hover { color: var(--primary); }

    /* Simple, Clean Dropdown Accordion */
    .mobile-dropdown {
      display: none;
      background-color: #ffffff;
      border-top: 1px solid var(--border-light);
      box-shadow: 0 12px 24px rgba(0,0,0,0.06);
    }
    .mobile-dropdown.open {
      display: block;
      animation: menuFadeIn 0.18s ease-out;
    }
    @keyframes menuFadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .mobile-nav-item {
      display: block;
      padding: 0.75rem 0;
      color: var(--text-dark);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      border-bottom: 1px dashed var(--border-light);
    }
    .mobile-nav-item:hover { color: var(--primary); }

    /* Sections */
    section { padding: 5rem 0; }
    .section-eyebrow { font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--primary); font-weight: 600; }
    .section-title { font-family: var(--font-serif); font-size: 2.85rem; line-height: 1.12; margin-top: 0.5rem; color: var(--text-dark); }
    .section-desc { color: var(--text-muted); max-width: 650px; margin-top: 0.75rem; font-size: 1.05rem; }

    /* Desktop Grids (Zero Layout Shift) */
    .grid-hero { display: grid; grid-template-columns: 1.3fr 0.9fr; gap: 3.5rem; align-items: center; }
    .grid-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .grid-whyus { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .grid-services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; }
    .grid-doctors { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .grid-reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .grid-hours { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: center; }
    .grid-booking { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    .grid-footer { display: grid; grid-template-columns: 1.5fr 1fr 1.2fr; gap: 3rem; margin-bottom: 3rem; }

    /* Cards */
    .card { background-color: #ffffff; border: 1px solid var(--border-light); border-radius: 1.25rem; padding: 2rem; }
    .card-doctor-avatar { width: 80px; height: 80px; aspect-ratio: 1/1; border-radius: 50%; background-color: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-family: var(--font-serif); margin: 0 auto 1.25rem auto; flex-shrink: 0; }
    .icon-box { width: 44px; height: 44px; aspect-ratio: 1/1; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background-color: var(--bg-light); border: 1px solid var(--border-light); color: var(--primary); flex-shrink: 0; }

    .mobile-menu-btn { display: none; }

    /* Tablet (768px - 1023px) */
    @media (max-width: 1023px) {
      .grid-hero { grid-template-columns: 1fr; gap: 2.5rem; }
      .grid-stats { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
      .grid-whyus { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
      .grid-services { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
      .grid-doctors { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
      .grid-reviews { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
      .grid-hours { grid-template-columns: 1fr; gap: 2rem; }
      .grid-booking { grid-template-columns: 1fr; gap: 2rem; }
      .grid-footer { grid-template-columns: 1fr 1fr; gap: 2rem; }
      .section-title { font-size: 2.4rem; }
    }

    /* Mobile (< 768px) */
    @media (max-width: 767px) {
      .desktop-nav { display: none !important; }
      .navbar-inner { padding: 0.65rem 0; }
      .navbar-brand { max-width: calc(100% - 46px); }
      .brand-logo { width: 32px; height: 32px; font-size: 1rem; border-radius: 8px; }
      .brand-title { font-size: 0.98rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
      .brand-tagline { font-size: 0.62rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-dark); width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; }
      .mobile-menu-btn:hover { background-color: rgba(0,0,0,0.05); }

      .topbar { padding: 0.35rem 0; font-size: 0.7rem; }
      .topbar .container { flex-direction: row; justify-content: space-between; align-items: center; }

      section { padding: 3.5rem 0; }
      .section-title { font-size: 2.1rem; }
      
      .grid-hero { grid-template-columns: 1fr; }
      .grid-stats { grid-template-columns: 1fr 1fr; gap: 1rem; }
      .grid-whyus { grid-template-columns: 1fr; gap: 1.25rem; }
      .grid-services { grid-template-columns: 1fr; gap: 1.25rem; }
      .grid-doctors { grid-template-columns: 1fr; gap: 1.25rem; }
      .grid-reviews { grid-template-columns: 1fr; gap: 1.25rem; }
      .grid-hours { grid-template-columns: 1fr; gap: 1.5rem; }
      .grid-booking { grid-template-columns: 1fr; gap: 2rem; }
      .grid-footer { grid-template-columns: 1fr; gap: 2rem; }

      .btn { width: 100%; }
      .hero-cta-group { flex-direction: column; width: 100%; }
      .hero-cta-group .btn { width: 100%; }
    }

    ${
      isEditable
        ? `
      /* Studio Editor Subtle Focus Ring */
      [contenteditable="true"] {
        outline: 1px dashed rgba(40, 84, 89, 0.25);
        outline-offset: 2px;
        transition: outline 0.15s ease, background-color 0.15s ease;
        border-radius: 3px;
      }
      [contenteditable="true"]:hover {
        outline: 1px solid var(--primary);
        background-color: rgba(40, 84, 89, 0.04);
      }
      [contenteditable="true"]:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
        border-radius: 4px;
        background-color: rgba(40, 84, 89, 0.08);
      }
    `
        : ""
    }
  </style>
</head>
<body class="grain">

  ${
    navbarBlock
      ? `
  <!-- TOP BAR -->
  <div class="topbar">
    <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
      <span style="display: inline-flex; align-items: center; gap: 0.4rem;">${ICONS.hospital} <strong>Emergency Triage Open 24/7</strong></span>
      ${navbar.emergencyPhone ? `<a href="tel:${navbar.emergencyPhone}" style="color: #ffffff; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">${ICONS.phone} Hotline: <span ${editAttr} data-field="navbar.emergencyPhone">${escapeHtml(navbar.emergencyPhone)}</span></a>` : ""}
    </div>
  </div>

  <!-- NAVBAR -->
  <header class="navbar">
    <div class="container">
      <div class="navbar-inner">
        <!-- Clinic Brand: Non-navigating element -->
        <div class="navbar-brand">
          <div class="brand-logo">+</div>
          <div style="min-width: 0;">
            <span class="brand-title" ${editAttr} data-field="navbar.hospitalName">${escapeHtml(navbar.hospitalName || safeSite.name)}</span>
            <span class="brand-tagline" ${editAttr} data-field="navbar.tagline">${escapeHtml(navbar.tagline || "Medical Center")}</span>
          </div>
        </div>

        <!-- Desktop Nav -->
        <nav class="desktop-nav" style="display: flex; align-items: center; gap: 1.75rem;">
          ${(navbar.links || [])
            .map((link) => `<a href="${link.href}" class="nav-link">${escapeHtml(link.label)}</a>`)
            .join("")}
          <a href="${navbarBtn.href}" ${navbarBtn.targetAttr} data-btn-id="navbar.cta" class="btn ${navbarBtn.variantClass}" ${editAttr} data-field="navbar.ctaText">${escapeHtml(navbarBtn.label)}</a>
        </nav>

        <!-- Clean Toggle Button -->
        <button class="mobile-menu-btn" onclick="toggleDropdownMenu()" aria-label="Toggle navigation menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="6" x2="20" y2="6"/><line x1="4" x2="20" y1="12" x2="20" y2="12"/><line x1="4" x2="20" y1="18" x2="20" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Clean Simple Slide-Down Dropdown -->
    <div id="mobileDropdown" class="mobile-dropdown">
      <div class="container" style="padding: 1rem 1.5rem 1.5rem 1.5rem;">
        ${(navbar.links || [])
          .map((link) => `<a href="${link.href}" class="mobile-nav-item" onclick="toggleDropdownMenu(false)">${escapeHtml(link.label)}</a>`)
          .join("")}
        <a href="${navbarBtn.href}" ${navbarBtn.targetAttr} data-btn-id="navbar.cta" class="btn ${navbarBtn.variantClass}" onclick="toggleDropdownMenu(false)" style="margin-top: 1rem; width: 100%;">${escapeHtml(navbarBtn.label)}</a>
      </div>
    </div>
  </header>`
      : ""
  }

  <!-- DYNAMIC BODY SECTIONS IN EXACT SORTED ORDER -->
  ${bodyContent}

  <!-- FOOTER -->
  ${footerBlock ? renderFooter(footer, editAttr, safeSite.name) : ""}

  <script>
    // Always start at top of page on render
    try { window.scrollTo(0, 0); } catch(e) {}

    function toggleDropdownMenu(forceState) {
      var dropdown = document.getElementById('mobileDropdown');
      if (!dropdown) return;
      if (typeof forceState === 'boolean') {
        if (forceState) dropdown.classList.add('open');
        else dropdown.classList.remove('open');
      } else {
        dropdown.classList.toggle('open');
      }
    }

    // Intercept clicks inside the iframe
    document.addEventListener('click', function(e) {
      var target = e.target;

      ${
        isEditable
          ? `
        // In Edit Mode: Clicking any button selects it in the Studio Action Inspector!
        var btnOrLink = target.closest('.btn') || target.closest('a');
        if (btnOrLink) {
          e.preventDefault();
          var btnId = btnOrLink.getAttribute('data-btn-id') || btnOrLink.getAttribute('data-field') || 'button';
          var href = btnOrLink.getAttribute('href') || '#booking';
          var label = btnOrLink.innerText.trim();
          var field = btnOrLink.getAttribute('data-field') || '';

          window.parent.postMessage({
            type: 'CANVAS_BUTTON_SELECT',
            buttonId: btnId,
            href: href,
            label: label,
            field: field
          }, '*');
          return;
        }

        // If clicking inside an editable element, definitely prevent link navigation
        if (target.hasAttribute('contenteditable') || target.closest('[contenteditable="true"]')) {
          var anchor = target.closest('a');
          if (anchor) e.preventDefault();
          return;
        }
      `
          : `
        // In Preview Mode: Real navigation and smooth anchor scrolling
        var anchor = target.closest('a');
        if (anchor) {
          var href = anchor.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            if (href.length > 1) {
              var el = document.querySelector(href);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
            return;
          }
          if (!href || href === '#' || !href.startsWith('tel:') && !href.startsWith('mailto:')) {
            // allow normal link navigation in preview if external
          }
        }
      `
      }
    }, true);

    // Support live DOM updates without full iframe reloads
    window.addEventListener('message', function(e) {
      if (!e.data) return;

      if (e.data.type === 'SCROLL_TO_SECTION') {
        var secId = e.data.sectionId;
        var targetId = secId.replace('sec-', '');
        var el = document.getElementById(targetId) || document.getElementById(secId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (e.data.type === 'UPDATE_SEO') {
        if (e.data.title) {
          document.title = e.data.title;
          var tTag = document.getElementById('pageTitleTag');
          if (tTag) tTag.innerText = e.data.title;
        }
        if (e.data.description) {
          var mTag = document.getElementById('pageMetaDescTag');
          if (mTag) mTag.setAttribute('content', e.data.description);
        }
      }

      if (e.data.type === 'UPDATE_BUTTON') {
        var btn = document.querySelector('[data-btn-id="' + e.data.buttonId + '"]');
        if (btn) {
          if (e.data.label !== undefined && e.data.label !== null) {
            btn.innerText = e.data.label;
          }
          if (e.data.href !== undefined && e.data.href !== null) {
            btn.setAttribute('href', e.data.href);
          }
          if (e.data.variant) {
            btn.classList.remove('btn-primary', 'btn-accent', 'btn-outline');
            btn.classList.add(e.data.variant);
          }
          if (e.data.openInNewTab !== undefined) {
            if (e.data.openInNewTab) {
              btn.setAttribute('target', '_blank');
              btn.setAttribute('rel', 'noopener noreferrer');
            } else {
              btn.removeAttribute('target');
              btn.removeAttribute('rel');
            }
          }
        }
      }
    });

    ${
      isEditable
        ? `
      // Listen for text edits and sync with parent on blur to prevent reload loops
      document.addEventListener('blur', function(e) {
        var target = e.target;
        if (target && target.hasAttribute('data-field')) {
          var field = target.getAttribute('data-field');
          var value = target.innerText.trim();
          window.parent.postMessage({
            type: 'CANVAS_TEXT_CHANGE',
            field: field,
            value: value
          }, '*');
        }
      }, true);

      // Handle Enter key and global Undo/Redo inside iframe
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          var target = e.target;
          if (target && target.hasAttribute('data-field')) {
            e.preventDefault();
            target.blur();
          }
        }

        // Forward Ctrl+Z / Ctrl+Y to Studio History Engine when not inside text edit
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          var isTextNode = e.target && (e.target.hasAttribute('contenteditable') || e.target.closest('[contenteditable="true"]'));
          if (!isTextNode) {
            e.preventDefault();
            if (!e.shiftKey) {
              window.parent.postMessage({ type: 'CANVAS_SHORTCUT_UNDO' }, '*');
            } else {
              window.parent.postMessage({ type: 'CANVAS_SHORTCUT_REDO' }, '*');
            }
          }
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          var isTextNode = e.target && (e.target.hasAttribute('contenteditable') || e.target.closest('[contenteditable="true"]'));
          if (!isTextNode) {
            e.preventDefault();
            window.parent.postMessage({ type: 'CANVAS_SHORTCUT_REDO' }, '*');
          }
        }
      });
    `
        : ""
    }
  </script>

</body>
</html>`;
}
