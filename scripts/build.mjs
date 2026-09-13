import { mkdir, readdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");

const site = {
  title: "S&J Studio Lab",
  email: "snj.storylab@gmail.com",
  github: "https://github.com/snj-studio-lab/snj-ai-production-lab",
  koreaTimeslip: "https://www.youtube.com/@KR_Timeslip",
  snjOriginalFilms: "https://www.youtube.com/@SNJOriginalFilms"
};

// [label, href, active keys]
const navLabels = {
  ko: [
    ["Films & Channels", "projects/", ["Projects"]],
    ["Studio Lab", "lab-notes/", ["Lab Notes", "Templates"]],
    ["About", "about/", ["소개"]],
    ["Contact", "contact/", ["Contact"]]
  ],
  en: [
    ["Films & Channels", "en/projects/", ["Projects"]],
    ["Studio Lab", "en/lab-notes/", ["Lab Notes", "Templates"]],
    ["About", "en/about/", ["About"]],
    ["Contact", "en/contact/", ["Contact"]]
  ]
};

const copy = {
  ko: {
    description: "AI 영상 제작의 결과물뿐 아니라 실제 제작 과정에서 무너지고 복구되는 워크플로우를 기록하는 공개 제작 실험실입니다.",
    homeDescription: "대한 타임슬립 본부와 SNJ ORIGINAL FILMS의 오리지널 시네마틱 작품과, 그 제작 과정을 기록하는 S&J Studio의 Studio Lab.",
    heroEyebrow: "S&J Studio",
    heroTitle: "시대와 세계를 넘나드는 이야기를,<br>영화로 만듭니다.",
    heroCopy: "대한 타임슬립 본부와 SNJ ORIGINAL FILMS의 오리지널 시네마틱 작품, 그리고 그 제작 과정을 기록하는 Studio Lab.",
    ctas: ["작품과 채널 보기", "Studio Lab"],
    filmsEyebrow: "Films & Channels",
    filmsTitle: "작품과 채널",
    notesEyebrow: "Inside S&J Studio",
    notesTitle: "Production Notes",
    notesBody: "완성본뿐 아니라 제작 과정에서 실제로 부딪힌 문제와 수정 과정을 공개 가능한 제작 지식으로 정리합니다.",
    templates: "공개 제작 템플릿",
    templatesTitle: "아이디어를 제작으로 넘기기 전 확인하는 구조",
    creatorEyebrow: "About the Creator",
    creatorTitle: "실패를 공개 가능한 제작 지식으로 바꾸는 1인 제작자",
    creatorBody: "Shua는 S&J Studio를 운영하며 AI 영상 제작 워크플로우를 실험하고 기록합니다. 20년 넘게 조직, 비용, 일정, 문서, 리스크를 다루는 실무 현장에서 일한 경험은 제작 과정을 시스템으로 바라보는 기반이 되었습니다.",
    creatorLink: "슈아 소개 보기",
    contactTitle: "협업, 컨설팅, 프로젝트 소개",
    contactBody: "AI 영상 제작, 공개 템플릿, 1인 스튜디오 워크플로우와 관련된 대화를 환영합니다.",
    allNotes: "전체 노트",
    allTemplates: "전체 템플릿"
  },
  en: {
    description: "A public creator lab documenting the workflows, failures, and production systems behind AI-assisted cinematic video.",
    homeDescription: "Original cinematic works from Korea Time-Slip HQ and SNJ ORIGINAL FILMS, with production notes from S&J Studio's Studio Lab.",
    heroEyebrow: "S&J Studio",
    heroTitle: "Stories across eras and worlds, made cinematic.",
    heroCopy: "Original cinematic works from Korea Time-Slip HQ and SNJ ORIGINAL FILMS, with production notes from Studio Lab.",
    ctas: ["View Films & Channels", "Studio Lab"],
    filmsEyebrow: "",
    filmsTitle: "Films & Channels",
    notesEyebrow: "Inside S&J Studio",
    notesTitle: "Production Notes",
    notesBody: "Notes on the real production decisions, failures, and fixes behind the work.",
    templates: "Public Templates",
    templatesTitle: "Production checkpoints before an idea moves forward",
    creatorEyebrow: "About the Creator",
    creatorTitle: "Shua turns real production failures into public workflow knowledge.",
    creatorBody: "A solo AI video creator and studio workflow designer building practical systems through real channel experiments.",
    creatorLink: "Read about Shua",
    contactTitle: "Collaboration, consulting, or project introduction",
    contactBody: "Conversations around AI-assisted video production, public templates, and solo studio workflow design are welcome.",
    allNotes: "All notes",
    allTemplates: "All templates"
  }
};

const projects = {
  ko: [
    {
      title: "S&J Studio Lab",
      label: "공개 제작 실험실",
      summary: "AI 제작 실패 로그, 템플릿, 공개 노트를 정리하는 제작 실험실입니다.",
      actions: [
        { label: "Lab Notes 보기", href: "lab-notes/" },
        { label: "GitHub 보기", href: site.github, external: true }
      ]
    },
    {
      title: "대한 타임슬립 본부 | Korea Time-Slip HQ",
      image: "assets/korea-timeslip-channel-banner.webp",
      label: "대표 작업 / 공개 채널",
      summary: "과거·현재·미래를 넘나드는 오리지널 타임슬립 액션 시리즈입니다.",
      actions: [
        { label: "YouTube 채널 보기", href: site.koreaTimeslip, external: true }
      ]
    },
    {
      title: "SNJ ORIGINAL FILMS",
      image: "assets/snj-original-films-channel-banner.webp",
      label: "오리지널 시네마틱 필름",
      summary: "SF · 판타지 · 액션을 넘나드는 오리지널 시네마틱 필름",
      actions: [
        { label: "YouTube 채널 보기", href: site.snjOriginalFilms, external: true }
      ]
    }
  ],
  en: [
    {
      title: "S&J Studio Lab",
      label: "Public Lab",
      summary: "Public notes and templates from AI production experiments.",
      actions: [
        { label: "Read Lab Notes", href: "en/lab-notes/" },
        { label: "View GitHub", href: site.github, external: true }
      ]
    },
    {
      title: "Korea Time-Slip HQ",
      image: "assets/korea-timeslip-channel-banner.webp",
      label: "Published Channel",
      summary: "Original cinematic time-slip action across the past, present, and future.",
      actions: [
        { label: "View YouTube Channel", href: site.koreaTimeslip, external: true }
      ]
    },
    {
      title: "SNJ ORIGINAL FILMS",
      image: "assets/snj-original-films-channel-banner.webp",
      label: "Original Cinematic Films",
      summary: "Original cinematic films across science fiction, fantasy, and action.",
      actions: [
        { label: "View YouTube Channel", href: site.snjOriginalFilms, external: true }
      ]
    }
  ]
};

// Home Films & Channels. Banner artwork already carries each channel title.
const channels = [
  {
    name: "대한 타임슬립 본부 | Korea Time-Slip HQ",
    image: "assets/korea-timeslip-channel-banner.webp",
    href: site.koreaTimeslip,
    summary: {
      ko: "과거·현재·미래를 넘나드는 오리지널 타임슬립 액션",
      en: "Original cinematic time-slip action across the past, present, and future."
    }
  },
  {
    name: "SNJ ORIGINAL FILMS",
    image: "assets/snj-original-films-channel-banner.webp",
    href: site.snjOriginalFilms,
    summary: {
      ko: "SF · 판타지 · 액션을 넘나드는 오리지널 시네마틱 필름",
      en: "Original cinematic films across science fiction, fantasy, and action."
    }
  }
];

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*"?([^"]*)"?\s*$/);
    if (pair) data[pair[1]] = pair[2];
  }
  return { data, body: match[2].trim() };
}

function slugFromFile(file) {
  return file.replace(/\.md$/, "");
}

async function readCollection(collection) {
  const dir = path.join(root, "content", collection);
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((file) => file.endsWith(".md"));
  const entries = [];
  for (const file of files) {
    const source = await readFile(path.join(dir, file), "utf8");
    const { data, body } = parseFrontmatter(source);
    entries.push({
      ...data,
      body,
      slug: slugFromFile(file),
      section: collection === "notes"
        ? "lab-notes"
        : collection === "notes-en"
          ? "en/lab-notes"
        : collection === "drafts"
          ? "drafts"
          : collection === "drafts-en"
            ? "en/drafts"
            : collection === "templates-en"
              ? "en/templates"
              : "templates"
    });
  }
  return entries.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function entryTitle(entry, locale) {
  return entry[`title_${locale}`] || entry.title || entry.title_en || entry.title_ko || entry.slug;
}

function entrySummary(entry, locale) {
  return entry[`summary_${locale}`] || entry.summary || entry.summary_en || entry.summary_ko || "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = [];
  let inCode = false;
  let code = [];

  const closeParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (list.length) {
      html.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      list = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        closeParagraph();
        closeList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }
    if (!line.trim()) {
      closeParagraph();
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      closeParagraph();
      list.push(bullet[1]);
      continue;
    }
    paragraph.push(line.trim());
  }

  closeParagraph();
  closeList();
  return html.join("\n");
}

function withBase(depth, route) {
  return `${"../".repeat(depth)}${route}`;
}

function langToggle(locale, depth, alternateHref) {
  const base = "../".repeat(depth);
  if (locale === "ko") {
    return `<div class="language-toggle" aria-label="Language"><strong>KR</strong><a href="${alternateHref || `${base}en/`}">EN</a></div>`;
  }
  return `<div class="language-toggle" aria-label="Language"><a href="${alternateHref || base}">KR</a><strong>EN</strong></div>`;
}

function pageShell({ title, documentTitle, description, active = "", body, depth = 0, locale = "ko", alternateHref, bodyClass }) {
  const base = "../".repeat(depth);
  const navHtml = navLabels[locale].map(([label, href, keys]) => {
    const activeClass = keys.includes(active) ? " aria-current=\"page\"" : "";
    return `<a href="${base}${href}"${activeClass}>${label}</a>`;
  }).join("");
  const footerNavHtml = navLabels[locale].map(([label, href]) => `<a href="${base}${href}">${label}</a>`).join("");
  return `<!doctype html>
<html lang="${locale === "ko" ? "ko" : "en"}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description || copy[locale].description)}">
    <title>${documentTitle ? escapeHtml(documentTitle) : `${escapeHtml(title)} | ${site.title}`}</title>
    <link rel="stylesheet" href="${base}styles.css">
  </head>
  <body${bodyClass ? ` class="${bodyClass}"` : ""}>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${base}${locale === "en" ? "en/" : ""}" aria-label="S&J Studio home">
          <img class="brand-mark" src="${base}assets/sj-studio-emblem.png" alt="" width="36" height="36">
          <span class="brand-text">
            <strong>S&J Studio</strong>
            <small>Studio Lab</small>
          </span>
        </a>
        <div class="header-actions">
          <nav class="nav" id="primary-nav" aria-label="Primary navigation">${navHtml}</nav>
          ${langToggle(locale, depth, alternateHref)}
          <button class="menu-toggle" type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="Menu"><span></span></button>
        </div>
      </div>
    </header>
    <script>
      document.querySelector(".menu-toggle").addEventListener("click", (event) => {
        const open = event.currentTarget.getAttribute("aria-expanded") !== "true";
        event.currentTarget.setAttribute("aria-expanded", String(open));
        document.querySelector(".site-header").classList.toggle("menu-open", open);
      });
    </script>
    <main>${body}</main>
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="${base}assets/sj-studio-emblem.png" alt="" width="28" height="28">
          <span><strong>S&J Studio</strong> · Studio Lab</span>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation">${footerNavHtml}</nav>
        <div class="footer-meta">
          <a href="mailto:${site.email}">${site.email}</a>
          <a href="${site.github}">GitHub</a>
          <span>© ${new Date().getFullYear()} S&J Studio</span>
        </div>
      </div>
    </footer>
  </body>
</html>`;
}

function entryCards(entries, locale, depth = 0) {
  const base = "../".repeat(depth);
  return entries.map((entry) => `
    <article class="entry-card">
      <div class="entry-meta">
        <span>${escapeHtml(entry.category || "Note")}</span>
        <time datetime="${escapeHtml(entry.date || "")}">${escapeHtml(entry.date || "")}</time>
      </div>
      <h3><a href="${base}${entry.section}/${entry.slug}/">${escapeHtml(entryTitle(entry, locale))}</a></h3>
      <p>${escapeHtml(entrySummary(entry, locale))}</p>
    </article>
  `).join("");
}

function projectActionLink(action, depth, className) {
  const href = action.external ? action.href : withBase(depth, action.href);
  const target = action.external ? ' target="_blank" rel="noreferrer"' : "";
  return `<a class="${className}" href="${escapeHtml(href)}"${target}>${escapeHtml(action.label)}</a>`;
}

// Projects catalog: channel rows with their real banners, then the Studio Lab panel.
function projectCatalog(locale, depth) {
  const base = "../".repeat(depth);
  const rows = projects[locale].filter((project) => project.image).map((project) => `
      <article class="property-row">
        <img class="property-media" src="${base}${project.image}" alt="${escapeHtml(project.title)}" width="1672" height="941">
        <div class="property-body">
          <p class="card-kicker">${escapeHtml(project.label)}</p>
          <h2>${escapeHtml(project.title)}</h2>
          <p>${escapeHtml(project.summary)}</p>
          <div class="action-row">${project.actions.map((action) => projectActionLink(action, depth, "btn-primary")).join("")}</div>
        </div>
      </article>`).join("");
  const panels = projects[locale].filter((project) => !project.image).map((project) => `
      <aside class="lab-panel">
        <div>
          <p class="card-kicker">${escapeHtml(project.label)}</p>
          <h2>${escapeHtml(project.title)}</h2>
          <p>${escapeHtml(project.summary)}</p>
        </div>
        <div class="action-row">${project.actions.map((action) => projectActionLink(action, depth, "btn-secondary")).join("")}</div>
      </aside>`).join("");
  return `<section class="property-list">${rows}</section>${panels}`;
}

// Lab Notes index: newest note featured, the rest as an editorial archive.
function journalIndex(entries, locale, depth) {
  if (!entries.length) return "";
  const base = "../".repeat(depth);
  const href = (entry) => `${base}${entry.section}/${entry.slug}/`;
  const [latest, ...rest] = entries;
  const labels = locale === "ko"
    ? { latest: "최신 노트", read: "노트 읽기", all: copy.ko.allNotes }
    : { latest: "Latest note", read: "Read note", all: copy.en.allNotes };
  const rows = rest.map((entry) => `
        <article class="archive-row">
          <div class="archive-meta">
            <span>${escapeHtml(entry.category || "Note")}</span>
            <time datetime="${escapeHtml(entry.date || "")}">${escapeHtml(entry.date || "")}</time>
          </div>
          <div>
            <h3><a href="${href(entry)}">${escapeHtml(entryTitle(entry, locale))}</a></h3>
            <p>${escapeHtml(entrySummary(entry, locale))}</p>
          </div>
        </article>`).join("");
  return `
      <section class="featured-note">
        <p class="card-kicker">${labels.latest} · ${escapeHtml(latest.category || "Note")}</p>
        <h2><a href="${href(latest)}">${escapeHtml(entryTitle(latest, locale))}</a></h2>
        <p>${escapeHtml(entrySummary(latest, locale))}</p>
        <div class="featured-foot">
          <time datetime="${escapeHtml(latest.date || "")}">${escapeHtml(latest.date || "")}</time>
          <a class="text-cta" href="${href(latest)}">${labels.read} →</a>
        </div>
      </section>
      ${rows ? `<section class="archive">
        <h2 class="archive-title">${labels.all}</h2>
        <div class="archive-list">${rows}
        </div>
      </section>` : ""}`;
}

// Templates index: studio resource cards.
function resourceCards(entries, locale, depth, koreanOnlySlugs = []) {
  const base = "../".repeat(depth);
  const openLabel = locale === "ko" ? "템플릿 열기" : "Open template";
  return `<section class="resource-grid">${entries.map((entry) => {
    const href = `${base}${entry.section}/${entry.slug}/`;
    const koreanOnly = koreanOnlySlugs.includes(entry.slug);
    return `
      <article class="resource-card">
        <div class="resource-head">
          <p class="card-kicker">${escapeHtml(entry.category || "Template")}</p>
          ${koreanOnly ? `<span class="pill">Available in Korean</span>` : ""}
        </div>
        <h2><a href="${href}">${escapeHtml(entryTitle(entry, locale))}</a></h2>
        <p>${escapeHtml(entrySummary(entry, locale))}</p>
        <div class="resource-foot">
          <time datetime="${escapeHtml(entry.date || "")}">${escapeHtml(entry.date || "")}</time>
          <a class="btn-secondary" href="${href}">${openLabel} →</a>
        </div>
      </article>`;
  }).join("")}
    </section>`;
}

// Long-form article for notes and templates. The Markdown body normally opens with its own H1.
function articlePage({ entry, locale, backLabel, list = [] }) {
  const html = markdownToHtml(entry.body);
  const hasTitle = html.startsWith("<h1>");
  const breakAt = html.indexOf("\n");
  const titleHtml = hasTitle ? (breakAt === -1 ? html : html.slice(0, breakAt)) : `<h1>${escapeHtml(entryTitle(entry, locale))}</h1>`;
  const bodyHtml = hasTitle ? (breakAt === -1 ? "" : html.slice(breakAt + 1)) : html;
  const summary = entrySummary(entry, locale);
  const index = list.findIndex((item) => item.slug === entry.slug);
  const older = index >= 0 ? list[index + 1] : undefined;
  const newer = index > 0 ? list[index - 1] : undefined;
  const pagerLabels = locale === "ko" ? ["이전 노트", "다음 노트"] : ["Previous note", "Next note"];
  const pagerLink = (item, label, className) => item
    ? `<a class="${className}" href="../${item.slug}/"><span>${label}</span><strong>${escapeHtml(entryTitle(item, locale))}</strong></a>`
    : "";
  const pager = older || newer
    ? `<nav class="article-pager" aria-label="${locale === "ko" ? "노트 이동" : "Note navigation"}">${pagerLink(older, `← ${pagerLabels[0]}`, "pager-prev")}${pagerLink(newer, `${pagerLabels[1]} →`, "pager-next")}</nav>`
    : "";
  return `
        <article class="article">
          <a class="back-link" href="../">← ${backLabel}</a>
          <div class="article-meta">
            <span>${escapeHtml(entry.category || "")}</span>
            <time datetime="${escapeHtml(entry.date || "")}">${escapeHtml(entry.date || "")}</time>
          </div>
          <header class="article-header">
            ${titleHtml}
            ${summary ? `<p class="article-lead">${escapeHtml(summary)}</p>` : ""}
          </header>
          <div class="article-body">
            ${bodyHtml}
          </div>
          ${pager}
        </article>
      `;
}

function contactCards(locale) {
  const labels = locale === "ko" ? ["공식 링크 준비 중"] : ["Official link coming soon"];
  return `
      <section class="contact-panel">
        <div>
          <span>Studio</span>
          <strong>S&J Studio</strong>
        </div>
        <div>
          <span>Email</span>
          <a href="mailto:${site.email}">${site.email}</a>
        </div>
        <div>
          <span>GitHub</span>
          <a href="${site.github}">${site.github}</a>
        </div>
        <div>
          <span>YouTube</span>
          <strong>${labels[0]}</strong>
        </div>
      </section>`;
}

function channelCards(locale, depth) {
  const base = "../".repeat(depth);
  const cta = locale === "ko" ? "YouTube 채널 보기" : "View YouTube Channel";
  return channels.map((channel) => `
          <article class="channel-card">
            <img class="channel-banner" src="${base}${channel.image}" alt="${escapeHtml(channel.name)}" width="1672" height="941">
            <div class="channel-body">
              <p>${escapeHtml(channel.summary[locale])}</p>
              <a class="channel-cta" href="${escapeHtml(channel.href)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${channel.name} — ${cta}`)}">${cta}</a>
            </div>
          </article>`).join("");
}

function noteRows(entries, locale, depth) {
  const base = "../".repeat(depth);
  return entries.map((entry) => `
          <article class="note-row">
            <div class="note-meta">
              <span>${escapeHtml(entry.category || "Note")}</span>
              <time datetime="${escapeHtml(entry.date || "")}">${escapeHtml(entry.date || "")}</time>
            </div>
            <h3><a href="${base}${entry.section}/${entry.slug}/">${escapeHtml(entryTitle(entry, locale))}</a></h3>
            <p>${escapeHtml(entrySummary(entry, locale))}</p>
          </article>`).join("");
}

function resourceRows(entries, locale, depth) {
  const base = "../".repeat(depth);
  return entries.map((entry) => `
          <a class="resource-row" href="${base}${entry.section}/${entry.slug}/">
            <strong>${escapeHtml(entryTitle(entry, locale))}</strong>
            <span>${escapeHtml(entrySummary(entry, locale))}</span>
          </a>`).join("");
}

function homePage(locale, notes, templates) {
  const c = copy[locale];
  const depth = locale === "en" ? 1 : 0;
  const assetBase = locale === "en" ? "../" : "";
  const notesRoute = locale === "en" ? "en/lab-notes/" : "lab-notes/";
  const templatesRoute = locale === "en" ? "en/templates/" : "templates/";
  return pageShell({
    title: locale === "ko" ? "홈" : "Home",
    documentTitle: "S&J Studio — Films, Channels & Studio Lab",
    description: c.homeDescription,
    active: locale === "ko" ? "홈" : "Home",
    bodyClass: "home-v2",
    locale,
    depth,
    body: `
      <section class="v2-hero">
        <p class="v2-eyebrow">${c.heroEyebrow}</p>
        <h1>${c.heroTitle}</h1>
        <p class="v2-lead">${c.heroCopy}</p>
        <div class="v2-actions">
          <a class="v2-button" href="#films">${c.ctas[0]}</a>
          <a class="v2-link" href="#studio-lab">${c.ctas[1]} →</a>
        </div>
      </section>
      <section class="v2-section" id="films">
        <div class="v2-heading">
          ${c.filmsEyebrow ? `<p class="v2-eyebrow">${c.filmsEyebrow}</p>` : ""}
          <h2>${c.filmsTitle}</h2>
        </div>
        <div class="channel-grid">${channelCards(locale, depth)}
        </div>
      </section>
      <section class="v2-section v2-notes" id="studio-lab">
        <div class="v2-notes-intro">
          <p class="v2-eyebrow">${c.notesEyebrow}</p>
          <h2>${c.notesTitle}</h2>
          <p>${c.notesBody}</p>
          <a class="v2-link" href="${withBase(depth, notesRoute)}">${c.allNotes} →</a>
        </div>
        <div class="note-list">${noteRows(notes.slice(0, 3), locale, depth)}
        </div>
      </section>
      <section class="v2-section v2-resources">
        <div class="v2-heading v2-heading-row">
          <div>
            <p class="v2-eyebrow">${c.templates}</p>
            <h2>${c.templatesTitle}</h2>
          </div>
          <a class="v2-link" href="${withBase(depth, templatesRoute)}">${c.allTemplates} →</a>
        </div>
        <div class="resource-list">${resourceRows(templates.slice(0, 3), locale, depth)}
        </div>
      </section>
      <section class="v2-section v2-creator">
        <img src="${assetBase}assets/shua-avatar.png" alt="Animated profile illustration of Shua" width="96" height="96">
        <div>
          <p class="v2-eyebrow">${c.creatorEyebrow}</p>
          <h2>${c.creatorTitle}</h2>
          <p>${c.creatorBody}</p>
          <a class="v2-link" href="${withBase(depth, locale === "en" ? "en/about/" : "about/")}">${c.creatorLink} →</a>
        </div>
      </section>
      <section class="v2-section v2-contact">
        <p class="v2-eyebrow">Contact</p>
        <h2>${c.contactTitle}</h2>
        <p>${c.contactBody}</p>
        <a href="mailto:${site.email}">${site.email}</a>
      </section>
    `
  });
}

async function writePage(route, html) {
  const dir = path.join(dist, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

async function copyPublic() {
  await mkdir(dist, { recursive: true });
  await writeFile(path.join(dist, ".nojekyll"), "", "utf8");
  await copyFile(path.join(publicDir, "styles.css"), path.join(dist, "styles.css"));
  await mkdir(path.join(dist, "assets"), { recursive: true });
  await copyFile(path.join(publicDir, "assets", "shua-avatar.png"), path.join(dist, "assets", "shua-avatar.png"));
  for (const asset of ["sj-studio-emblem.png", "korea-timeslip-channel-banner.webp", "snj-original-films-channel-banner.webp"]) {
    await copyFile(path.join(publicDir, "assets", asset), path.join(dist, "assets", asset));
  }
}

export async function build({ includeDrafts = false } = {}) {
  const notes = await readCollection("notes");
  const notesEn = await readCollection("notes-en");
  const templates = await readCollection("templates");
  const templatesEn = await readCollection("templates-en");
  const drafts = includeDrafts ? await readCollection("drafts") : [];
  const draftsEn = includeDrafts ? await readCollection("drafts-en") : [];
  await rm(dist, { recursive: true, force: true });
  await copyPublic();

  await writePage("", homePage("ko", notes, templates));
  await writePage("en", homePage("en", notesEn, templates));

  const aboutContact = (locale) => `
      <section class="about-contact">
        <p class="eyebrow">Contact</p>
        <h2>${copy[locale].contactTitle}</h2>
        <p>${copy[locale].contactBody}</p>
        ${contactCards(locale)}
      </section>`;

  await writePage("en/about", pageShell({
    title: "About",
    active: "About",
    depth: 2,
    locale: "en",
    alternateHref: "../../about/",
    body: `
      <section class="page-title two-column">
        <div>
          <p class="eyebrow">About</p>
          <h1>AI video workflows, documented from a production operations perspective.</h1>
          <p>S&J Studio Lab is a public production notebook and personal brand homepage operated by Shua / S&J Studio.</p>
        </div>
        <img class="about-avatar" src="../../assets/shua-avatar.png" alt="Animated profile illustration of Shua">
      </section>
      <section class="prose narrow">
        <h2>Why production systems matter</h2>
        <p>Shua has worked for over 20 years in practical business operations involving organizations, cost, schedules, documentation, and risk. That background shapes how S&J Studio Lab approaches AI video: not only as creative output, but as a production system that connects planning, documentation, review, cost, and repeatability.</p>
        <p>Since 2025, the lab has been documenting hands-on experiments in AI video production, YouTube channel operations, image and video generation research, subtitle cleanup, and upload packaging.</p>
        <p>The site records not only finished work, but also the failures, revision criteria, and production notes gathered during real production attempts.</p>
        <h2>What gets documented</h2>
        <ul>
          <li>AI-assisted video production workflows</li>
          <li>Production failures and revision criteria</li>
          <li>Templates for solo studio operations</li>
          <li>Public notes from project experiments</li>
        </ul>
      </section>
      ${aboutContact("en")}
    `
  }));

  await writePage("about", pageShell({
    title: "소개",
    active: "소개",
    depth: 1,
    locale: "ko",
    alternateHref: "../en/about/",
    body: `
      <section class="page-title two-column">
        <div>
          <p class="eyebrow">About</p>
          <h1>AI 영상 워크플로우를 제작 운영의 관점에서 기록합니다.</h1>
          <p>S&J Studio Lab은 Shua / S&J Studio가 운영하는 공개 제작 노트이자 개인 브랜드 홈페이지입니다.</p>
        </div>
        <img class="about-avatar" src="../assets/shua-avatar.png" alt="슈아 애니메이션 프로필 이미지">
      </section>
      <section class="prose narrow">
        <h2>제작을 시스템으로 바라보는 이유</h2>
        <p>Shua는 20년 넘게 조직, 비용, 일정, 문서, 리스크를 다루는 실무 현장에서 일해 왔습니다. 그 경험은 AI 영상 제작을 단순한 창작이 아니라 기획, 문서화, 검수, 비용, 반복 가능성이 연결된 제작 운영의 문제로 바라보는 기반이 되었습니다.</p>
        <p>2025년부터는 AI 영상 제작, 유튜브 채널 운영, 이미지와 영상 생성 연구, 자막 정리, 업로드 패키징을 직접 실험하며 1인 제작자가 마주하는 실패와 수정 과정을 기록하고 있습니다.</p>
        <p>이곳에는 완성된 결과물만이 아니라 실제 제작 과정에서 얻은 실패, 수정 기준, 제작 노트를 함께 기록합니다.</p>
        <h2>기록하는 것</h2>
        <ul>
          <li>AI 영상 제작 워크플로우</li>
          <li>제작 실패와 수정 기준</li>
          <li>1인 스튜디오 운영을 위한 템플릿</li>
          <li>공개 가능한 프로젝트 실험 노트</li>
        </ul>
      </section>
      ${aboutContact("ko")}
    `
  }));

  await writePage("lab-notes", pageShell({
    title: "Lab Notes",
    active: "Lab Notes",
    depth: 1,
    locale: "ko",
    alternateHref: "../en/lab-notes/",
    body: `
      <section class="page-title">
        <p class="eyebrow">Studio Lab · Lab Notes</p>
        <h1>AI 영상 제작의 실패, 수정, 반복 가능성을 기록합니다.</h1>
        <p>실제 제작 과정에서 얻은 실패와 수정 기준을 정리한 공개 노트입니다.</p>
      </section>
      ${journalIndex(notes, "ko", 1)}
    `
  }));

  for (const note of notes) {
    const hasEnglishVersion = notesEn.some((entry) => entry.slug === note.slug);
    await writePage(`lab-notes/${note.slug}`, pageShell({
      title: entryTitle(note, "ko"),
      active: "Lab Notes",
      depth: 2,
      locale: "ko",
      alternateHref: hasEnglishVersion ? `../../en/lab-notes/${note.slug}/` : "../../en/lab-notes/",
      description: entrySummary(note, "ko"),
      body: articlePage({ entry: note, locale: "ko", backLabel: "Lab Notes로 돌아가기", list: notes })
    }));
  }

  await writePage("en/lab-notes", pageShell({
    title: "Lab Notes",
    active: "Lab Notes",
    depth: 2,
    locale: "en",
    alternateHref: "../../lab-notes/",
    body: `
      <section class="page-title">
        <p class="eyebrow">Studio Lab · Lab Notes</p>
        <h1>Failures, revisions, and repeatable knowledge from AI video production.</h1>
        <p>Public notes derived from real production attempts and edited for safe reuse.</p>
      </section>
      ${journalIndex(notesEn, "en", 2)}
    `
  }));

  for (const note of notesEn) {
    const hasKoreanVersion = notes.some((entry) => entry.slug === note.slug);
    await writePage(`en/lab-notes/${note.slug}`, pageShell({
      title: entryTitle(note, "en"),
      active: "Lab Notes",
      depth: 3,
      locale: "en",
      alternateHref: hasKoreanVersion ? `../../../lab-notes/${note.slug}/` : "../../../lab-notes/",
      description: entrySummary(note, "en"),
      body: articlePage({ entry: note, locale: "en", backLabel: "Back to Lab Notes", list: notesEn })
    }));
  }

  if (includeDrafts) {
    await writePage("drafts", pageShell({
      title: "Local Draft Preview",
      depth: 1,
      locale: "ko",
      alternateHref: "../en/drafts/",
      body: `
        <section class="page-title">
          <p class="eyebrow">Local Preview Only</p>
          <h1>미게시 공개 초안</h1>
          <p>이 페이지와 아래 문서는 로컬 검토용이며 공개 빌드에는 포함되지 않습니다.</p>
        </section>
        <section class="entry-list wide">${entryCards(drafts, "ko", 1)}</section>
      `
    }));

    for (const draft of drafts) {
      await writePage(`drafts/${draft.slug}`, pageShell({
        title: entryTitle(draft, "ko"),
        depth: 2,
        locale: "ko",
        alternateHref: `../../en/drafts/${draft.slug}/`,
        description: entrySummary(draft, "ko"),
        body: `
          <article class="prose article">
            <div class="draft-banner">
              <strong>LOCAL UNPUBLISHED DRAFT</strong>
              <span>사용자 검토 전에는 공개 빌드에 포함되지 않습니다.</span>
            </div>
            <a class="back-link" href="../">미게시 초안 목록으로 돌아가기</a>
            <div class="entry-meta">
              <span>${escapeHtml(draft.category || "Draft")}</span>
              <time datetime="${escapeHtml(draft.date || "")}">${escapeHtml(draft.date || "")}</time>
            </div>
            ${markdownToHtml(draft.body)}
          </article>
        `
      }));
    }

    await writePage("en/drafts", pageShell({
      title: "Local Draft Preview",
      depth: 2,
      locale: "en",
      alternateHref: "../../drafts/",
      body: `
        <section class="page-title">
          <p class="eyebrow">Local Preview Only</p>
          <h1>Unpublished Article Drafts</h1>
          <p>This index and the articles below are available for local review only. They are excluded from the public build.</p>
        </section>
        <section class="entry-list wide">${entryCards(draftsEn, "en", 2)}</section>
      `
    }));

    for (const draft of draftsEn) {
      await writePage(`en/drafts/${draft.slug}`, pageShell({
        title: entryTitle(draft, "en"),
        depth: 3,
        locale: "en",
        alternateHref: `../../../drafts/${draft.slug}/`,
        description: entrySummary(draft, "en"),
        body: `
          <article class="prose article">
            <div class="draft-banner">
              <strong>LOCAL UNPUBLISHED DRAFT</strong>
              <span>This article is excluded from the public build until editorial approval.</span>
            </div>
            <a class="back-link" href="../">Back to unpublished drafts</a>
            <div class="entry-meta">
              <span>${escapeHtml(draft.category || "Draft")}</span>
              <time datetime="${escapeHtml(draft.date || "")}">${escapeHtml(draft.date || "")}</time>
            </div>
            ${markdownToHtml(draft.body)}
          </article>
        `
      }));
    }
  }

  await writePage("templates", pageShell({
    title: "Templates",
    active: "Templates",
    depth: 1,
    locale: "ko",
    body: `
      <section class="page-title">
        <p class="eyebrow">Studio Lab · Templates</p>
        <h1>아이디어를 실제 제작으로 넘기기 전 확인하는 공개 템플릿입니다.</h1>
        <p>AI 영상 제작의 판단 기준을 문서화하기 위한 가벼운 구조입니다.</p>
      </section>
      ${resourceCards(templates, "ko", 1)}
    `,
    alternateHref: "../en/templates/"
  }));

  for (const template of templates) {
    const hasEnglishVersion = templatesEn.some((entry) => entry.slug === template.slug);
    await writePage(`templates/${template.slug}`, pageShell({
      title: entryTitle(template, "ko"),
      active: "Templates",
      depth: 2,
      locale: "ko",
      alternateHref: hasEnglishVersion ? `../../en/templates/${template.slug}/` : "../../en/templates/",
      description: entrySummary(template, "ko"),
      body: articlePage({ entry: template, locale: "ko", backLabel: "Templates로 돌아가기" })
    }));
  }

  const koreanOnlyTemplates = templates.filter((template) => !templatesEn.some((entry) => entry.slug === template.slug));

  await writePage("en/templates", pageShell({
    title: "Templates",
    active: "Templates",
    depth: 2,
    locale: "en",
    alternateHref: "../../templates/",
    body: `
      <section class="page-title">
        <p class="eyebrow">Studio Lab · Templates</p>
        <h1>Public Templates</h1>
        <p>Reusable production templates published by S&J Studio Lab. English versions are added when available.</p>
      </section>
      ${resourceCards([...templatesEn, ...koreanOnlyTemplates], "en", 2, koreanOnlyTemplates.map((template) => template.slug))}
    `
  }));

  for (const template of templatesEn) {
    const hasKoreanVersion = templates.some((entry) => entry.slug === template.slug);
    await writePage(`en/templates/${template.slug}`, pageShell({
      title: entryTitle(template, "en"),
      active: "Templates",
      depth: 3,
      locale: "en",
      alternateHref: hasKoreanVersion ? `../../../templates/${template.slug}/` : "../../../templates/",
      description: entrySummary(template, "en"),
      body: articlePage({ entry: template, locale: "en", backLabel: "Back to Templates" })
    }));
  }

  await writePage("projects", pageShell({
    title: "Projects",
    active: "Projects",
    depth: 1,
    locale: "ko",
    alternateHref: "../en/projects/",
    body: `
      <section class="page-title">
        <p class="eyebrow">Films & Channels</p>
        <h1>S&J Studio의 작품과 운영 채널을 소개합니다.</h1>
        <p>역사 시네마틱부터 오리지널 필름까지, 현재 공개 중인 작품과 채널을 한곳에서 만나보세요.</p>
      </section>
      ${projectCatalog("ko", 1)}
    `
  }));

  await writePage("en/projects", pageShell({
    title: "Projects",
    active: "Projects",
    depth: 2,
    locale: "en",
    alternateHref: "../../projects/",
    body: `
      <section class="page-title">
        <p class="eyebrow">Films & Channels</p>
        <h1>Explore S&J Studio's films and channels, from cinematic history to original screen stories.</h1>
      </section>
      ${projectCatalog("en", 2)}
    `
  }));

  await writePage("contact", pageShell({
    title: "Contact",
    active: "Contact",
    depth: 1,
    locale: "ko",
    alternateHref: "../en/contact/",
    body: `
      <section class="page-title">
        <p class="eyebrow">Contact</p>
        <h1>협업, 컨설팅, 프로젝트 소개</h1>
        <p>AI 영상 제작, 공개 템플릿, 1인 스튜디오 워크플로우와 관련된 대화를 환영합니다.</p>
      </section>
      ${contactCards("ko")}
    `
  }));

  await writePage("en/contact", pageShell({
    title: "Contact",
    active: "Contact",
    depth: 2,
    locale: "en",
    alternateHref: "../../contact/",
    body: `
      <section class="page-title">
        <p class="eyebrow">Contact</p>
        <h1>Collaboration, consulting, and project inquiries</h1>
        <p>${copy.en.contactBody}</p>
      </section>
      ${contactCards("en")}
    `
  }));

  console.log(`Built ${dist}`);
}

if (!existsSync(path.join(publicDir, "assets", "shua-avatar.png"))) {
  throw new Error("Missing public/assets/shua-avatar.png");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await build();
}
