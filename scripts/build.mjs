import { mkdir, readdir, readFile, rm, writeFile, copyFile, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");

const site = {
  title: "S&J Studio Lab",
  email: "snj.storylab@gmail.com",
  github: "https://github.com/snj-studio-lab/snj-ai-production-lab"
};

// [label, href, active keys]. Showcase is hidden while there is no published case.
const navLabels = {
  ko: [
    ["Channels & Works", "projects/", ["Projects"]],
    ["Showcase", "showcase/", ["Showcase"]],
    ["Studio Lab", "lab-notes/", ["Lab Notes", "Templates"]],
    ["About", "about/", ["소개"]],
    ["Contact", "contact/", ["Contact"]]
  ],
  en: [
    ["Channels & Works", "en/projects/", ["Projects"]],
    ["Showcase", "en/showcase/", ["Showcase"]],
    ["Studio Lab", "en/lab-notes/", ["Lab Notes", "Templates"]],
    ["About", "en/about/", ["About"]],
    ["Contact", "en/contact/", ["Contact"]]
  ]
};

const copy = {
  ko: {
    description: "AI 영상 제작의 결과물뿐 아니라 실제 제작 과정에서 무너지고 복구되는 워크플로우를 기록하는 공개 제작 실험실입니다.",
    homeDescription: "S&J Studio는 장르와 형식에 얽매이지 않고, 아이디어를 다양한 오리지널 콘텐츠로 기획·제작하는 1인 크리에이터 스튜디오입니다.",
    heroEyebrow: "S&J Studio",
    heroTitle: "이야기와 음악, 배움과 상상을<br>콘텐츠로 만듭니다.",
    heroCopy: "S&J Studio는 장르와 형식에 얽매이지 않고, 아이디어를 다양한 오리지널 콘텐츠로 기획·제작하는 1인 크리에이터 스튜디오입니다.",
    ctas: ["채널과 콘텐츠 보기", "Studio Lab"],
    filmsEyebrow: "Channels & Works",
    filmsTitle: "채널과 콘텐츠",
    notesEyebrow: "Inside S&J Studio",
    notesTitle: "Production Notes",
    notesBody: "완성본뿐 아니라 제작 과정에서 실제로 부딪힌 문제와 수정 과정을 공개 가능한 제작 지식으로 정리합니다.",
    templates: "공개 제작 템플릿",
    templatesTitle: "아이디어를 제작으로 넘기기 전 확인하는 구조",
    creatorEyebrow: "About the Creator",
    creatorTitle: "실패를 공개 가능한 제작 지식으로 바꾸는 1인 제작자",
    creatorBody: "20년 넘게 조직·비용·일정·문서·리스크를 다루는 실무 경험을 바탕으로, S&J Studio의 제작 과정을 하나의 운영 가능한 시스템으로 설계하고 있습니다.",
    creatorLink: "슈아 소개 보기",
    contactTitle: "협업, 컨설팅, 프로젝트 소개",
    contactBody: "AI 영상 제작, 공개 템플릿, 1인 스튜디오 워크플로우와 관련된 대화를 환영합니다.",
    allNotes: "전체 노트",
    allTemplates: "전체 템플릿"
  },
  en: {
    description: "A public creator lab documenting the workflows, failures, and production systems behind AI-assisted cinematic video.",
    homeDescription: "S&J Studio is a creator-led studio developing original content across formats and genres.",
    heroEyebrow: "S&J Studio",
    heroTitle: "Stories, music, learning and imagination —<br>made into original content.",
    heroCopy: "S&J Studio is a creator-led studio developing original content across formats and genres.",
    ctas: ["View Channels & Works", "Studio Lab"],
    filmsEyebrow: "",
    filmsTitle: "Channels & Works",
    notesEyebrow: "Inside S&J Studio",
    notesTitle: "Production Notes",
    notesBody: "Notes on the real production decisions, failures, and fixes behind the work.",
    templates: "Public Templates",
    templatesTitle: "Production checkpoints before an idea moves forward",
    creatorEyebrow: "About the Creator",
    creatorTitle: "Shua turns real production failures into public workflow knowledge.",
    creatorBody: "Drawing on more than 20 years of hands-on operational experience, I build S&J Studio's production workflow as a system that can be directed, reviewed, and improved.",
    creatorLink: "Read about Shua",
    contactTitle: "Collaboration, consulting, or project introduction",
    contactBody: "Conversations around AI-assisted video production, public templates, and solo studio workflow design are welcome.",
    allNotes: "All notes",
    allTemplates: "All templates"
  }
};

// Studio Lab panel shown under the channel catalog on Projects.
const studioLab = {
  ko: {
    title: "S&J Studio Lab",
    label: "공개 제작 실험실",
    summary: "AI 제작 실패 로그, 템플릿, 공개 노트를 정리하는 제작 실험실입니다.",
    actions: [
      { label: "Lab Notes 보기", href: "lab-notes/" },
      { label: "GitHub 보기", href: site.github, external: true }
    ]
  },
  en: {
    title: "S&J Studio Lab",
    label: "Public Lab",
    summary: "Public notes and templates from AI production experiments.",
    actions: [
      { label: "Read Lab Notes", href: "en/lab-notes/" },
      { label: "View GitHub", href: site.github, external: true }
    ]
  }
};

// Filled by build(): active channels from content/channels/ and whether Showcase appears in navigation.
const siteState = { channels: [], showShowcaseNav: false };

// Channels: one Markdown file per channel in content/channels/, named after its id.
// Required: id, title, title_en, description_ko, description_en, youtube_url, image, status.
// Optional: category_ko, category_en, home_order, show_on_home. Only status "active" is published.
async function readChannels() {
  const dir = path.join(root, "content", "channels");
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((file) => file.endsWith(".md"));
  const errors = [];
  const channels = [];
  for (const file of files) {
    const { data } = parseFrontmatter(await readFile(path.join(dir, file), "utf8"));
    const fail = (message) => errors.push(`content/channels/${file}: ${message}`);
    for (const key of ["id", "title", "title_en", "description_ko", "description_en", "youtube_url", "image", "status"]) {
      if (!data[key]) fail(`missing required field "${key}"`);
    }
    if (data.id && data.id !== slugFromFile(file)) fail(`id "${data.id}" must match the file name`);
    if (data.id === "studio") fail(`id "studio" is reserved`);
    if (data.youtube_url && !/^https?:\/\//.test(data.youtube_url)) fail(`invalid youtube_url "${data.youtube_url}"`);
    if (data.image && !existsSync(path.join(publicDir, data.image.replace(/^\//, "")))) fail(`image "${data.image}" not found under public/`);
    if (data.home_order && Number.isNaN(Number(data.home_order))) fail(`home_order must be a number`);
    if (data.show_on_home && !["true", "false"].includes(data.show_on_home)) fail(`show_on_home must be true or false`);
    channels.push(data);
  }
  if (errors.length) throw new Error(`Channel validation failed:\n${errors.join("\n")}`);
  const order = (channel) => (channel.home_order ? Number(channel.home_order) : Infinity);
  return channels
    .filter((channel) => channel.status === "active")
    .sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id));
}

function channelTitle(channel, locale) {
  return locale === "en" ? channel.title_en : channel.title;
}

function channelImageSrc(channel, depth) {
  return `${"../".repeat(depth)}${channel.image.replace(/^\//, "")}`;
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  const data = {};
  let lastKey;
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+"?([^"]*)"?\s*$/);
    if (item && lastKey) {
      // YAML-style list under a key with an empty value, e.g. tags.
      if (!Array.isArray(data[lastKey])) data[lastKey] = [];
      data[lastKey].push(item[1]);
      continue;
    }
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*"?([^"]*)"?\s*$/);
    if (pair) {
      data[pair[1]] = pair[2];
      lastKey = pair[1];
    }
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
  const navItems = navLabels[locale].filter(([label]) => label !== "Showcase" || siteState.showShowcaseNav);
  const navHtml = navItems.map(([label, href, keys]) => {
    const activeClass = keys.includes(active) ? " aria-current=\"page\"" : "";
    return `<a href="${base}${href}"${activeClass}>${label}</a>`;
  }).join("");
  const footerNavHtml = navItems.map(([label, href]) => `<a href="${base}${href}">${label}</a>`).join("");
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
  const cta = locale === "ko" ? "YouTube 채널 보기" : "View YouTube Channel";
  const rows = siteState.channels.map((channel) => {
    const category = channel[`category_${locale}`];
    return `
      <article class="property-row">
        <img class="property-media" src="${channelImageSrc(channel, depth)}" alt="${escapeHtml(channelTitle(channel, locale))}">
        <div class="property-body">
          ${category ? `<p class="card-kicker">${escapeHtml(category)}</p>` : ""}
          <h2>${escapeHtml(channelTitle(channel, locale))}</h2>
          <p>${escapeHtml(channel[`description_${locale}`])}</p>
          <div class="action-row"><a class="btn-primary" href="${escapeHtml(channel.youtube_url)}" target="_blank" rel="noreferrer">${cta}</a></div>
        </div>
      </article>`;
  }).join("");
  const lab = studioLab[locale];
  return `<section class="property-list">${rows}</section>
      <aside class="lab-panel">
        <div>
          <p class="card-kicker">${escapeHtml(lab.label)}</p>
          <h2>${escapeHtml(lab.title)}</h2>
          <p>${escapeHtml(lab.summary)}</p>
        </div>
        <div class="action-row">${lab.actions.map((action) => projectActionLink(action, depth, "btn-secondary")).join("")}</div>
      </aside>`;
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
  const youtubeLinks = siteState.channels
    .map((channel) => `<a href="${escapeHtml(channel.youtube_url)}" target="_blank" rel="noreferrer">${escapeHtml(channelTitle(channel, locale))}</a>`)
    .join("\n          ");
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
          ${youtubeLinks}
        </div>
      </section>`;
}

// Showcase: one Markdown file per case in content/showcase/, media in public/assets/showcase/.
// Required: title, date, channel, media_type, cover_image (published), summary_ko, status.
// Optional: title_en, summary_en, featured, sort_order, youtube_url, youtube_start_seconds,
// challenge_*, direction_*, result_*, prompt_excerpt_*, tags (list), alt_ko, alt_en, Markdown body.
// Allowed showcase channel values: "studio" plus every active channel id from content/channels/.
function showcaseChannelLabel(id, locale) {
  if (id === "studio") return "S&J Studio";
  const channel = siteState.channels.find((entry) => entry.id === id);
  return channel ? channelTitle(channel, locale) : undefined;
}

const showcaseCopy = {
  ko: {
    title: "제작 쇼케이스",
    intro: "S&J Studio의 실제 제작 장면과 이미지, 그리고 그 결과를 만들기 위해 선택한 제작 방향을 모았습니다.",
    empty: ["Showcase를 준비하고 있습니다.", "S&J Studio의 제작 장면과 사례를 이곳에 순차적으로 공개합니다."],
    view: "사례 보기",
    all: "전체 사례 보기",
    back: "Showcase로 돌아가기",
    youtube: "YouTube에서 보기",
    sections: [["challenge", "제작 과제"], ["direction", "연출·제작 방향"], ["result", "결과"]],
    prompt: "공개 프롬프트 발췌",
    pager: ["이전 사례", "다음 사례"]
  },
  en: {
    title: "Production Showcase",
    intro: "Selected visuals and production decisions from work made at S&J Studio.",
    empty: ["Showcase entries are being prepared.", "Selected production visuals and case studies will be published here."],
    view: "View Case",
    all: "View all cases",
    back: "Back to Showcase",
    youtube: "Watch on YouTube",
    sections: [["challenge", "Challenge"], ["direction", "Direction"], ["result", "Result"]],
    prompt: "Public Prompt Excerpt",
    pager: ["Previous case", "Next case"]
  }
};

async function readShowcase({ includeDrafts = false } = {}) {
  const dir = path.join(root, "content", "showcase");
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((file) => file.endsWith(".md"));
  const errors = [];
  const slugs = new Set();
  const items = [];
  for (const file of files) {
    const { data, body } = parseFrontmatter(await readFile(path.join(dir, file), "utf8"));
    const slug = slugFromFile(file);
    const fail = (message) => errors.push(`content/showcase/${file}: ${message}`);
    const required = ["title", "date", "channel", "media_type", "summary_ko", "status"];
    if (data.status === "published") required.push("cover_image");
    for (const key of required) {
      if (!data[key]) fail(`missing required field "${key}"`);
    }
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) fail(`file name must be a lowercase slug (a-z, 0-9, -)`);
    if (slugs.has(slug)) fail(`duplicate slug "${slug}"`);
    slugs.add(slug);
    if (data.status && !["published", "draft"].includes(data.status)) fail(`invalid status "${data.status}"`);
    if (data.channel && !showcaseChannelLabel(data.channel, "ko")) fail(`invalid channel "${data.channel}"`);
    if (data.media_type && !["image", "youtube"].includes(data.media_type)) fail(`invalid media_type "${data.media_type}"`);
    if (data.date && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(`${data.date}T00:00:00Z`)) || new Date(`${data.date}T00:00:00Z`).toISOString().slice(0, 10) !== data.date)) {
      fail(`invalid date "${data.date}" (expected YYYY-MM-DD)`);
    }
    if (data.media_type === "youtube") {
      if (!data.youtube_url) fail(`media_type "youtube" requires youtube_url`);
      else if (!/^https?:\/\//.test(data.youtube_url)) fail(`invalid youtube_url "${data.youtube_url}"`);
    }
    if (data.youtube_start_seconds && !/^\d+$/.test(data.youtube_start_seconds)) fail(`youtube_start_seconds must be a whole number`);
    if (data.sort_order && Number.isNaN(Number(data.sort_order))) fail(`sort_order must be a number`);
    if (data.cover_image && !/^https?:\/\//.test(data.cover_image) && !existsSync(path.join(publicDir, data.cover_image.replace(/^\//, "")))) {
      fail(`cover_image "${data.cover_image}" not found under public/`);
    }
    if (data.tags !== undefined && !Array.isArray(data.tags) && data.tags !== "") fail(`tags must be a list`);
    items.push({ ...data, body, slug, tags: Array.isArray(data.tags) ? data.tags : [] });
  }
  if (errors.length) throw new Error(`Showcase validation failed:\n${errors.join("\n")}`);
  return items
    .filter((item) => item.status === "published" || (includeDrafts && item.status === "draft"))
    .sort((a, b) => {
      const orderA = a.sort_order === undefined || a.sort_order === "" ? Infinity : Number(a.sort_order);
      const orderB = b.sort_order === undefined || b.sort_order === "" ? Infinity : Number(b.sort_order);
      return orderA - orderB || String(b.date).localeCompare(String(a.date));
    });
}

function showcaseHasEnglish(item) {
  return Boolean(item.title_en && item.summary_en);
}

function showcaseMediaSrc(item, depth) {
  return /^https?:\/\//.test(item.cover_image) ? item.cover_image : `${"../".repeat(depth)}${item.cover_image.replace(/^\//, "")}`;
}

function showcaseYoutubeHref(item) {
  const seconds = Number(item.youtube_start_seconds || 0);
  if (!seconds) return item.youtube_url;
  try {
    const url = new URL(item.youtube_url);
    url.searchParams.set("t", `${seconds}s`);
    return url.toString();
  } catch {
    return item.youtube_url;
  }
}

// Card link target per locale: EN detail when translated, otherwise the Korean detail.
function showcaseCards(items, locale, depth, headingLevel = "h2") {
  const base = "../".repeat(depth);
  const c = showcaseCopy[locale];
  return `<div class="showcase-grid">${items.map((item) => {
    const english = locale === "en" && showcaseHasEnglish(item);
    const href = english ? `${base}en/showcase/${item.slug}/` : `${base}showcase/${item.slug}/`;
    const title = english ? item.title_en : item.title;
    const summary = english ? item.summary_en : item.summary_ko;
    const alt = (english ? item.alt_en : item.alt_ko) || title;
    return `
        <article class="showcase-card">
          <a class="showcase-media" href="${href}" tabindex="-1" aria-hidden="true"><img src="${showcaseMediaSrc(item, depth)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"></a>
          <div class="showcase-card-body">
            <div class="showcase-card-kicker">
              <p class="card-kicker">${escapeHtml(showcaseChannelLabel(item.channel, locale))}</p>
              ${locale === "en" && !english ? `<span class="pill">Available in Korean</span>` : ""}
              ${item.status === "draft" ? `<span class="pill">Draft</span>` : ""}
            </div>
            <${headingLevel}><a href="${href}">${escapeHtml(title)}</a></${headingLevel}>
            <p>${escapeHtml(summary)}</p>
            ${item.tags.length ? `<ul class="tag-list">${item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
            <div class="showcase-card-foot">
              <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time>
              <a class="text-cta" href="${href}">${c.view} →</a>
            </div>
          </div>
        </article>`;
  }).join("")}
      </div>`;
}

function showcaseIndexBody(items, locale, depth) {
  const c = showcaseCopy[locale];
  const list = items.length
    ? showcaseCards(items, locale, depth)
    : `<section class="showcase-empty"><p><strong>${c.empty[0]}</strong></p><p>${c.empty[1]}</p></section>`;
  return `
      <section class="page-title">
        <p class="eyebrow">Showcase</p>
        <h1>${c.title}</h1>
        <p>${c.intro}</p>
      </section>
      ${list}
    `;
}

function showcaseDetailBody(item, locale, list) {
  const c = showcaseCopy[locale];
  const suffix = locale === "en" ? "_en" : "_ko";
  const title = locale === "en" ? item.title_en : item.title;
  const summary = locale === "en" ? item.summary_en : item.summary_ko;
  const alt = item[`alt${suffix}`] || title;
  const image = `<img src="${showcaseMediaSrc(item, locale === "en" ? 3 : 2)}" alt="${escapeHtml(alt)}">`;
  const media = item.media_type === "youtube"
    ? `<a class="case-media" href="${escapeHtml(showcaseYoutubeHref(item))}" target="_blank" rel="noreferrer">${image}</a>`
    : `<div class="case-media">${image}</div>`;
  const sections = c.sections
    .filter(([key]) => item[`${key}${suffix}`])
    .map(([key, label]) => `<section class="case-section"><h2>${label}</h2><p>${escapeHtml(item[`${key}${suffix}`])}</p></section>`)
    .join("");
  const prompt = item[`prompt_excerpt${suffix}`]
    ? `<section class="case-section"><h2>${c.prompt}</h2><pre class="prompt-excerpt"><code>${escapeHtml(item[`prompt_excerpt${suffix}`])}</code></pre></section>`
    : "";
  // The Markdown body is a single-language (Korean) note, so it renders on the Korean detail only.
  const bodyHtml = locale === "ko" && item.body ? `<div class="article-body case-body">${markdownToHtml(item.body)}</div>` : "";
  const index = list.findIndex((entry) => entry.slug === item.slug);
  const pagerLink = (entry, label, className) => entry
    ? `<a class="${className}" href="../${entry.slug}/"><span>${label}</span><strong>${escapeHtml(locale === "en" ? entry.title_en : entry.title)}</strong></a>`
    : "";
  const older = list[index + 1];
  const newer = index > 0 ? list[index - 1] : undefined;
  const pager = older || newer
    ? `<nav class="article-pager" aria-label="${locale === "ko" ? "사례 이동" : "Case navigation"}">${pagerLink(older, `← ${c.pager[0]}`, "pager-prev")}${pagerLink(newer, `${c.pager[1]} →`, "pager-next")}</nav>`
    : "";
  return `
        <article class="showcase-detail">
          ${item.status === "draft" ? `<div class="draft-banner"><strong>LOCAL UNPUBLISHED DRAFT</strong><span>Excluded from the public build.</span></div>` : ""}
          <a class="back-link" href="../">← ${c.back}</a>
          <div class="article-meta">
            <span>${escapeHtml(showcaseChannelLabel(item.channel, locale))}</span>
            <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time>
          </div>
          <header class="case-header">
            <h1>${escapeHtml(title)}</h1>
            <p class="article-lead">${escapeHtml(summary)}</p>
          </header>
          ${media}
          ${item.media_type === "youtube" ? `<div class="action-row case-actions"><a class="btn-primary" href="${escapeHtml(showcaseYoutubeHref(item))}" target="_blank" rel="noreferrer">${c.youtube} →</a></div>` : ""}
          <div class="case-content">
            ${sections}
            ${prompt}
            ${bodyHtml}
            ${item.tags.length ? `<ul class="tag-list">${item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
            ${pager}
          </div>
        </article>
      `;
}

// Home channel cards. Banner artwork already carries each channel title, so no title overlay.
function channelCards(locale, depth) {
  const cta = locale === "ko" ? "YouTube 채널 보기" : "View YouTube Channel";
  return siteState.channels.filter((channel) => channel.show_on_home !== "false").map((channel) => `
          <article class="channel-card">
            <img class="channel-banner" src="${channelImageSrc(channel, depth)}" alt="${escapeHtml(channelTitle(channel, locale))}">
            <div class="channel-body">
              <p>${escapeHtml(channel[`description_${locale}`])}</p>
              <a class="channel-cta" href="${escapeHtml(channel.youtube_url)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${channelTitle(channel, locale)} — ${cta}`)}">${cta}</a>
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

function homeShowcaseSection(locale, depth, showcase) {
  const featured = showcase.filter((item) => item.status === "published" && String(item.featured) === "true").slice(0, 3);
  if (!featured.length) return "";
  const c = showcaseCopy[locale];
  return `
      <section class="v2-section" id="showcase">
        <div class="v2-heading v2-heading-row">
          <div>
            <p class="v2-eyebrow">Showcase</p>
            <h2>${c.title}</h2>
          </div>
          <a class="v2-link" href="${withBase(depth, locale === "en" ? "en/showcase/" : "showcase/")}">${c.all} →</a>
        </div>
        ${showcaseCards(featured, locale, depth, "h3")}
      </section>`;
}

function homePage(locale, notes, templates, showcase = []) {
  const c = copy[locale];
  const depth = locale === "en" ? 1 : 0;
  const assetBase = locale === "en" ? "../" : "";
  const notesRoute = locale === "en" ? "en/lab-notes/" : "lab-notes/";
  const templatesRoute = locale === "en" ? "en/templates/" : "templates/";
  return pageShell({
    title: locale === "ko" ? "홈" : "Home",
    documentTitle: "S&J Studio — Channels, Works & Studio Lab",
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
          <a class="v2-button" href="#channels">${c.ctas[0]}</a>
          <a class="v2-link" href="#studio-lab">${c.ctas[1]} →</a>
        </div>
      </section>
      <section class="v2-section" id="channels">
        <div class="v2-heading">
          ${c.filmsEyebrow ? `<p class="v2-eyebrow">${c.filmsEyebrow}</p>` : ""}
          <h2>${c.filmsTitle}</h2>
        </div>
        <div class="channel-grid">${channelCards(locale, depth)}
        </div>
      </section>${homeShowcaseSection(locale, depth, showcase)}
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
  // Copies every public asset, including showcase media under public/assets/showcase/.
  await cp(path.join(publicDir, "assets"), path.join(dist, "assets"), { recursive: true });
}

export async function build({ includeDrafts = false } = {}) {
  const notes = await readCollection("notes");
  const notesEn = await readCollection("notes-en");
  const templates = await readCollection("templates");
  const templatesEn = await readCollection("templates-en");
  siteState.channels = await readChannels();
  const showcase = await readShowcase({ includeDrafts });
  siteState.showShowcaseNav = showcase.some((item) => item.status === "published");
  const drafts = includeDrafts ? await readCollection("drafts") : [];
  const draftsEn = includeDrafts ? await readCollection("drafts-en") : [];
  await rm(dist, { recursive: true, force: true });
  await copyPublic();

  await writePage("", homePage("ko", notes, templates, showcase));
  await writePage("en", homePage("en", notesEn, templates, showcase));

  const showcaseEn = showcase.filter(showcaseHasEnglish);
  await writePage("showcase", pageShell({
    title: "Showcase",
    active: "Showcase",
    depth: 1,
    locale: "ko",
    alternateHref: "../en/showcase/",
    description: showcaseCopy.ko.intro,
    body: showcaseIndexBody(showcase, "ko", 1)
  }));
  await writePage("en/showcase", pageShell({
    title: "Showcase",
    active: "Showcase",
    depth: 2,
    locale: "en",
    alternateHref: "../../showcase/",
    description: showcaseCopy.en.intro,
    body: showcaseIndexBody(showcase, "en", 2)
  }));
  for (const item of showcase) {
    const english = showcaseHasEnglish(item);
    await writePage(`showcase/${item.slug}`, pageShell({
      title: item.title,
      active: "Showcase",
      depth: 2,
      locale: "ko",
      alternateHref: english ? `../../en/showcase/${item.slug}/` : "../../en/showcase/",
      description: item.summary_ko,
      body: showcaseDetailBody(item, "ko", showcase)
    }));
    if (english) {
      await writePage(`en/showcase/${item.slug}`, pageShell({
        title: item.title_en,
        active: "Showcase",
        depth: 3,
        locale: "en",
        alternateHref: `../../../showcase/${item.slug}/`,
        description: item.summary_en,
        body: showcaseDetailBody(item, "en", showcaseEn)
      }));
    }
  }

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
          <p class="eyebrow">About · Shua / S&J Studio</p>
          <h1>A creator-led studio making cinematic stories across eras and worlds.</h1>
          <p>S&J Studio operates Korea Time-Slip HQ and SNJ ORIGINAL FILMS, handling research, story development, scene design, AI-assisted production, editing, and final review as one connected workflow.</p>
        </div>
        <img class="about-avatar" src="../../assets/shua-avatar.png" alt="Animated profile illustration of Shua">
      </section>
      <section class="prose narrow">
        <h2>From operations to production</h2>
        <p>For more than 20 years, I worked in environments shaped by operations, budgets, schedules, documentation, and risk.</p>
        <p>That experience now informs how S&J Studio approaches production: breaking complex work into controllable stages, documenting decisions, building repeatable workflows, and tracing failures back to their causes.</p>
        <h2>Why AI filmmaking</h2>
        <p>Since 2025, I have been producing AI-assisted video and operating YouTube channels directly.</p>
        <p>AI is used as a production tool for creating visual and audiovisual elements, not as the author of the work.</p>
        <p>S&J Studio remains responsible for what to make, which results to keep, how scenes are directed, and how the finished work comes together.</p>
        <h2>Studio Lab</h2>
        <p>Studio Lab does not only present finished work.</p>
        <p>It documents real production failures, fixes, decision criteria, and reusable production notes from the work behind the films.</p>
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
          <p class="eyebrow">About · Shua / S&J Studio</p>
          <h1>시대와 세계를 넘나드는 이야기를,<br>영화로 만드는 1인 크리에이터 스튜디오</h1>
          <p>S&J Studio는 대한 타임슬립 본부와 SNJ ORIGINAL FILMS를 운영하며, 기획과 조사부터 대본, 장면 설계, AI 생성 과정의 지시와 선택, 편집과 최종 검수까지 직접 수행합니다.</p>
        </div>
        <img class="about-avatar" src="../assets/shua-avatar.png" alt="슈아 애니메이션 프로필 이미지">
      </section>
      <section class="prose narrow">
        <h2>운영에서 제작으로</h2>
        <p>20년 넘게 조직, 비용, 일정, 문서와 리스크가 얽힌 실제 업무를 운영해왔습니다.</p>
        <p>그 경험은 지금 S&J Studio의 제작 방식에 그대로 이어집니다. 복잡한 제작 과정을 작은 작업 단위로 나누고, 기준을 문서화하고, 반복 가능한 흐름으로 만들고, 문제가 생기면 원인을 추적해 다시 설계하는 방식입니다.</p>
        <h2>왜 AI 영화 제작인가</h2>
        <p>2025년부터 AI 영상 제작과 YouTube 채널 운영을 직접 시작했습니다.</p>
        <p>AI는 창작의 주체가 아니라, 이미지와 영상 등 작품에 필요한 시청각 요소를 구현하는 제작 도구로 사용합니다.</p>
        <p>무엇을 만들지 결정하고, 어떤 결과를 선택할지 판단하고, 작품 전체의 방향을 통제하는 일은 S&J Studio가 직접 수행합니다.</p>
        <h2>Studio Lab</h2>
        <p>Studio Lab은 완성본만 보여주는 공간이 아닙니다.</p>
        <p>실제 제작 과정에서 생긴 실패, 수정, 판단 기준, 그리고 다시 사용할 수 있게 정리한 제작 노트를 공개합니다.</p>
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
        <p class="eyebrow">Channels & Works</p>
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
        <p class="eyebrow">Channels & Works</p>
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
