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
  github: "https://github.com/snj-studio-lab/snj-ai-production-lab"
};

const navLabels = {
  ko: [
    ["홈", ""],
    ["소개", "about/"],
    ["Lab Notes", "lab-notes/"],
    ["Templates", "templates/"],
    ["Projects", "projects/"],
    ["Contact", "contact/"]
  ],
  en: [
    ["Home", "en/"],
    ["About", "en/about/"],
    ["Lab Notes", "lab-notes/"],
    ["Templates", "templates/"],
    ["Projects", "projects/"],
    ["Contact", "contact/"]
  ]
};

const copy = {
  ko: {
    description: "AI 영상 제작의 결과물뿐 아니라 실제 제작 과정에서 무너지고 복구되는 워크플로우를 기록하는 공개 제작 실험실입니다.",
    heroEyebrow: "AI 영상 제작 공개 실험실",
    heroCopy: "AI 영상 제작의 결과물뿐 아니라 실제 제작 과정에서 무너지고 복구되는 워크플로우를 기록합니다.",
    heroSecondary: "프롬프트 실패, 레퍼런스 제어, 자막 정리, 업로드 패키징까지 1인 제작자가 겪는 시행착오를 공개 가능한 제작 지식으로 바꿉니다.",
    ctas: ["Lab Notes 보기", "Public Templates 보기", "GitHub 방문하기"],
    whatTitle: "완성본보다 과정을 기록하는 제작 노트",
    whatBody: "S&J Studio Lab은 AI 영상 제작을 단순한 프롬프트 문제가 아니라 기획, 정보, 이미지, 영상, 자막, 검수, 업로드가 연결된 제작 시스템 문제로 다룹니다.",
    projects: "현재 프로젝트",
    projectsTitle: "공개 가능한 제작 실험",
    notes: "최근 Lab Notes",
    notesTitle: "실패, 수정, 반복 가능한 제작 지식",
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
    heroEyebrow: "AI cinematic production lab",
    heroCopy: "A public creator lab documenting the workflows, failures, and production systems behind AI-assisted cinematic video.",
    heroSecondary: "S&J Studio Lab documents real AI video production attempts: what broke, what changed, and what can be reused by other creators.",
    ctas: ["Read the Lab Notes", "View Public Templates", "Visit GitHub"],
    whatTitle: "A public notebook for production process, not only finished work.",
    whatBody: "S&J Studio Lab treats AI video as a production system: planning, references, images, shots, subtitles, review, packaging, and upload decisions all have to work together.",
    projects: "Current Projects",
    projectsTitle: "Active public-facing work",
    notes: "Latest Lab Notes",
    notesTitle: "Failures, revisions, and reusable workflow knowledge",
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
      summary: "AI 제작 실패 로그, 템플릿, 공개 노트를 정리하는 제작 실험실입니다."
    },
    {
      title: "대한 타임슬립 본부 | Korea Time-Slip HQ",
      label: "AI 시네마틱 시리즈",
      summary: "대한민국 타임슬립 밀리터리 드라마 시리즈입니다."
    },
    {
      title: "GMI",
      label: "시네마틱 케이스 파일",
      summary: "글로벌 시네마틱 미스터리 / 이상현상 케이스 파일 프로젝트입니다."
    }
  ],
  en: [
    {
      title: "S&J Studio Lab",
      label: "Public Lab",
      summary: "Public notes and templates from AI production experiments."
    },
    {
      title: "Korea Time-Slip HQ",
      label: "Series Lab",
      summary: "Korean alternate-history time-slip military drama series."
    },
    {
      title: "GMI",
      label: "Case Files",
      summary: "Global cinematic anomaly case files."
    }
  ]
};

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
  const files = (await readdir(dir)).filter((file) => file.endsWith(".md"));
  const entries = [];
  for (const file of files) {
    const source = await readFile(path.join(dir, file), "utf8");
    const { data, body } = parseFrontmatter(source);
    entries.push({
      ...data,
      body,
      slug: slugFromFile(file),
      section: collection === "notes" ? "lab-notes" : "templates"
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

function langToggle(locale, depth) {
  const base = "../".repeat(depth);
  if (locale === "ko") {
    return `<div class="language-toggle" aria-label="Language"><strong>KR</strong><a href="${base}en/">EN</a></div>`;
  }
  return `<div class="language-toggle" aria-label="Language"><a href="${base}">KR</a><strong>EN</strong></div>`;
}

function pageShell({ title, description, active = "", body, depth = 0, locale = "ko" }) {
  const base = "../".repeat(depth);
  const navHtml = navLabels[locale].map(([label, href]) => {
    const activeClass = active === label || active === href ? " aria-current=\"page\"" : "";
    return `<a href="${base}${href}"${activeClass}>${label}</a>`;
  }).join("");
  return `<!doctype html>
<html lang="${locale === "ko" ? "ko" : "en"}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description || copy[locale].description)}">
    <title>${escapeHtml(title)} | ${site.title}</title>
    <link rel="stylesheet" href="${base}styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="${base}${locale === "en" ? "en/" : ""}" aria-label="S&J Studio Lab home">
        <span class="brand-mark">S&J</span>
        <span>Studio Lab</span>
      </a>
      <div class="header-actions">
        <nav class="nav" aria-label="Primary navigation">${navHtml}</nav>
        ${langToggle(locale, depth)}
      </div>
    </header>
    <main>${body}</main>
    <footer class="site-footer">
      <div>
        <strong>S&J Studio</strong>
        <span>${site.email}</span>
      </div>
      <div class="footer-links">
        <a href="${site.github}">GitHub</a>
        <a href="mailto:${site.email}">Email</a>
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

function projectCards(locale) {
  return projects[locale].map((project) => `
    <article class="project-card">
      <span>${escapeHtml(project.label)}</span>
      <h2>${escapeHtml(project.title)}</h2>
      <p>${escapeHtml(project.summary)}</p>
    </article>
  `).join("");
}

function creatorCard(locale) {
  const labels = locale === "ko"
    ? ["1년+ AI 제작 실험", "실제 채널 운영", "공개 워크플로우 노트"]
    : ["1yr+ AI production experiments", "Real channel operations", "Public workflow notes"];
  const roles = locale === "ko"
    ? ["AI 영상 제작자", "1인 스튜디오 워크플로우 설계자", "공개 제작 실험 운영자"]
    : ["AI video creator", "Solo studio workflow designer", "Public production lab operator"];
  return `
    <aside class="creator-card" aria-label="Creator identity">
      <div class="creator-card-main">
        <img src="${locale === "en" ? "../" : ""}assets/shua-avatar.png" alt="Animated profile illustration of Shua">
        <div>
          <strong>Shua / S&J Studio</strong>
          ${roles.map((role) => `<span>${escapeHtml(role)}</span>`).join("")}
        </div>
      </div>
      <div class="trust-badges">
        ${labels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}
      </div>
    </aside>
  `;
}

function homePage(locale, notes, templates) {
  const c = copy[locale];
  const depth = locale === "en" ? 1 : 0;
  const assetBase = locale === "en" ? "../" : "";
  return pageShell({
    title: locale === "ko" ? "홈" : "Home",
    active: locale === "ko" ? "홈" : "Home",
    locale,
    depth,
    body: `
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">${c.heroEyebrow}</p>
          <h1>S&J Studio Lab</h1>
          <p class="hero-subcopy">${c.heroCopy}</p>
          <p class="hero-secondary">${c.heroSecondary}</p>
          <div class="hero-actions">
            <a class="button primary" href="${withBase(depth, "lab-notes/")}">${c.ctas[0]}</a>
            <a class="button" href="${withBase(depth, "templates/")}">${c.ctas[1]}</a>
            <a class="button ghost" href="${site.github}">${c.ctas[2]}</a>
          </div>
        </div>
        ${creatorCard(locale).replaceAll('src="assets/', `src="${assetBase}assets/`)}
      </section>
      <section class="signal-band">
        <div><span>${locale === "ko" ? "Position" : "Position"}</span><strong>${locale === "ko" ? "AI 영상 제작자" : "AI video creator"}</strong></div>
        <div><span>${locale === "ko" ? "Method" : "Method"}</span><strong>${locale === "ko" ? "실패와 수정을 기록" : "Failure-led workflow notes"}</strong></div>
        <div><span>${locale === "ko" ? "Output" : "Output"}</span><strong>${locale === "ko" ? "노트, 템플릿, 영상" : "Notes, templates, films"}</strong></div>
      </section>
      <section class="band intro-grid">
        <div class="section-heading">
          <p class="eyebrow">What this is</p>
          <h2>${c.whatTitle}</h2>
        </div>
        <p>${c.whatBody}</p>
      </section>
      <section class="section">
        <div class="section-heading">
          <p class="eyebrow">${c.projects}</p>
          <h2>${c.projectsTitle}</h2>
        </div>
        <div class="project-grid compact">${projectCards(locale)}</div>
      </section>
      <section class="section split-list">
        <div class="section-heading">
          <p class="eyebrow">${c.notes}</p>
          <h2>${c.notesTitle}</h2>
          <a href="${withBase(depth, "lab-notes/")}">${c.allNotes}</a>
        </div>
        <div class="entry-list">${entryCards(notes.slice(0, 3), locale, depth)}</div>
      </section>
      <section class="section split-list">
        <div class="section-heading">
          <p class="eyebrow">${c.templates}</p>
          <h2>${c.templatesTitle}</h2>
          <a href="${withBase(depth, "templates/")}">${c.allTemplates}</a>
        </div>
        <div class="entry-list">${entryCards(templates, locale, depth)}</div>
      </section>
      <section class="creator-strip">
        <img src="${assetBase}assets/shua-avatar.png" alt="Animated profile illustration of Shua">
        <div>
          <p class="eyebrow">${c.creatorEyebrow}</p>
          <h2>${c.creatorTitle}</h2>
          <p>${c.creatorBody}</p>
          <a class="text-link" href="${withBase(depth, locale === "en" ? "en/about/" : "about/")}">${c.creatorLink}</a>
        </div>
      </section>
      <section class="contact-band">
        <p class="eyebrow">Contact</p>
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
}

export async function build() {
  const notes = await readCollection("notes");
  const templates = await readCollection("templates");
  await rm(dist, { recursive: true, force: true });
  await copyPublic();

  await writePage("", homePage("ko", notes, templates));
  await writePage("en", homePage("en", notes, templates));

  await writePage("en/about", pageShell({
    title: "About",
    active: "About",
    depth: 2,
    locale: "en",
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
    `
  }));

  await writePage("about", pageShell({
    title: "소개",
    active: "소개",
    depth: 1,
    locale: "ko",
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
    `
  }));

  await writePage("lab-notes", pageShell({
    title: "Lab Notes",
    active: "Lab Notes",
    depth: 1,
    locale: "ko",
    body: `
      <section class="page-title">
        <p class="eyebrow">Lab Notes</p>
        <h1>AI 영상 제작의 실패, 수정, 반복 가능성을 기록합니다.</h1>
        <p>마크다운 기반으로 정리되는 제작 노트입니다. 새 파일을 추가하면 목록에도 함께 반영됩니다.</p>
      </section>
      <section class="entry-list wide">${entryCards(notes, "ko", 1)}</section>
    `
  }));

  for (const note of notes) {
    await writePage(`lab-notes/${note.slug}`, pageShell({
      title: entryTitle(note, "ko"),
      active: "Lab Notes",
      depth: 2,
      locale: "ko",
      description: entrySummary(note, "ko"),
      body: `
        <article class="prose article">
          <a class="back-link" href="../">Lab Notes로 돌아가기</a>
          <div class="entry-meta">
            <span>${escapeHtml(note.category)}</span>
            <time datetime="${escapeHtml(note.date)}">${escapeHtml(note.date)}</time>
          </div>
          ${markdownToHtml(note.body)}
        </article>
      `
    }));
  }

  await writePage("templates", pageShell({
    title: "Templates",
    active: "Templates",
    depth: 1,
    locale: "ko",
    body: `
      <section class="page-title">
        <p class="eyebrow">Templates</p>
        <h1>아이디어를 실제 제작으로 넘기기 전 확인하는 공개 템플릿입니다.</h1>
        <p>AI 영상 제작의 판단 기준을 문서화하기 위한 가벼운 구조입니다.</p>
      </section>
      <section class="entry-list wide">${entryCards(templates, "ko", 1)}</section>
    `
  }));

  for (const template of templates) {
    await writePage(`templates/${template.slug}`, pageShell({
      title: entryTitle(template, "ko"),
      active: "Templates",
      depth: 2,
      locale: "ko",
      description: entrySummary(template, "ko"),
      body: `
        <article class="prose article">
          <a class="back-link" href="../">Templates로 돌아가기</a>
          <div class="entry-meta">
            <span>${escapeHtml(template.category)}</span>
            <time datetime="${escapeHtml(template.date)}">${escapeHtml(template.date)}</time>
          </div>
          ${markdownToHtml(template.body)}
        </article>
      `
    }));
  }

  await writePage("projects", pageShell({
    title: "Projects",
    active: "Projects",
    depth: 1,
    locale: "ko",
    body: `
      <section class="page-title">
        <p class="eyebrow">Projects</p>
        <h1>내부 IP를 과하게 노출하지 않고 공개 가능한 제작 신호만 정리합니다.</h1>
        <p>S&J Studio Lab이 만들고, 테스트하고, 공개 기록으로 남기는 프로젝트입니다.</p>
      </section>
      <section class="project-grid">${projectCards("ko")}</section>
    `
  }));

  await writePage("contact", pageShell({
    title: "Contact",
    active: "Contact",
    depth: 1,
    locale: "ko",
    body: `
      <section class="page-title">
        <p class="eyebrow">Contact</p>
        <h1>협업, 컨설팅, 프로젝트 소개</h1>
        <p>AI 영상 제작, 공개 템플릿, 1인 스튜디오 워크플로우와 관련된 대화를 환영합니다.</p>
      </section>
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
          <strong>공식 링크 준비 중</strong>
        </div>
      </section>
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
