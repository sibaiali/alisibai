import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "index.html",
  "spacelumin.html",
  "cv.html",
  "cv-de.html",
  "style.css",
  "portfolio-data.js",
  "script.js",
  "favicon.svg",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "LICENSE",
  "COPYRIGHT.md",
  "vercel.json",
  ".well-known/tdmrep.json",
  ".well-known/security.txt"
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) failures.push(`Missing required file: ${file}`);
}

const htmlFiles = ["index.html", "spacelumin.html", "cv.html", "cv-de.html"];
const htmlByFile = Object.fromEntries(
  htmlFiles.map((file) => [file, readFileSync(resolve(root, file), "utf8")])
);

for (const [file, html] of Object.entries(htmlByFile)) {
  const expectedLang = file === "cv-de.html" ? "de" : "en";
  if (!new RegExp(`<html\\s+lang="${expectedLang}"`, "i").test(html)) {
    failures.push(`${file}: missing ${expectedLang} language declaration`);
  }
  if (!/<main[\s>]/i.test(html)) failures.push(`${file}: missing main landmark`);
  if ((html.match(/<h1[\s>]/gi) || []).length !== 1) failures.push(`${file}: expected exactly one h1`);
  if (!/<meta\s+name="copyright"/i.test(html)) failures.push(`${file}: missing copyright meta tag`);
  if (!/<meta\s+name="tdm-reservation"\s+content="1"/i.test(html)) failures.push(`${file}: missing EU TDM reservation meta tag`);

  const ids = new Set(Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]));
  const duplicateIds = Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1])
    .filter((id, index, all) => all.indexOf(id) !== index);
  if (duplicateIds.length) failures.push(`${file}: duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);

  const attributes = Array.from(html.matchAll(/\s(?:href|src)="([^"]+)"/g), (match) => match[1]);
  for (const target of attributes) {
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(target)) continue;
    if (target.startsWith("#")) {
      if (!ids.has(target.slice(1))) failures.push(`${file}: missing fragment target ${target}`);
      continue;
    }

    const [path, fragment] = target.split("#");
    if (path && !existsSync(resolve(root, path.replace(/^\//, "")))) {
      failures.push(`${file}: missing local target ${path}`);
    }
    if (fragment && htmlByFile[path] && !new RegExp(`\\sid=["']${fragment}["']`).test(htmlByFile[path])) {
      failures.push(`${file}: missing cross-page fragment ${target}`);
    }
  }
}

const publicClaimFiles = ["index.html", "spacelumin.html", "cv.html", "cv-de.html", "portfolio-data.js"];
const prohibitedClaims = [
  /senior computer engineering student/i,
  /expected graduation/i,
  /next mistake/i,
  /proprietary algorithm/i,
  /T[ÜU]B[İI]TAK/i,
  /60 FPS on mobile/i,
  /AES-256/i,
  /KVKK compliance/i,
  /looking for an internship/i,
  /Based in Istanbul/i,
  /Psychology Intern/i,
  /unresolved/i,
  /unreachable/i,
  /CE472/i,
  /Behavioral NLP Testing/i,
  /nationwide/i,
  /bundesweit/i
];

for (const file of publicClaimFiles) {
  const content = readFileSync(resolve(root, file), "utf8");
  for (const claim of prohibitedClaims) {
    if (claim.test(content)) failures.push(`${file}: prohibited or outdated claim matched ${claim}`);
  }
}

const indexHtml = htmlByFile["index.html"];
const caseStudyHtml = htmlByFile["spacelumin.html"];
const cvHtml = htmlByFile["cv.html"];
const cvDeHtml = htmlByFile["cv-de.html"];
const countOccurrences = (content, text) => content.split(text).length - 1;
const recruiterBrief = indexHtml.match(/<aside class="brief-panel"[\s\S]*?<\/aside>/i)?.[0] ?? "";
const footer = indexHtml.match(/<footer class="site-footer"[\s\S]*?<\/footer>/i)?.[0] ?? "";

if (countOccurrences(recruiterBrief, "Open to opportunities") !== 1) {
  failures.push("index.html: recruiter brief must contain Open to opportunities exactly once");
}
if (!/<dt>Location<\/dt>[\s\S]*?<dd>Marburg \/ Frankfurt Area, DE<\/dd>/i.test(recruiterBrief)) {
  failures.push("index.html: recruiter brief is missing the Germany location");
}
if (!/<dt>Primary focus<\/dt>[\s\S]*?<dd>Software &amp; Web Engineering<\/dd>/i.test(recruiterBrief)) {
  failures.push("index.html: recruiter brief is missing the primary-focus wording");
}
if (countOccurrences(footer, "<p>Marburg / Frankfurt Rhine-Main, Germany</p>") !== 1) {
  failures.push("index.html: footer must contain the Germany location line exactly once");
}

const contributionSentence = "I designed and implemented the gameplay systems, telemetry pipeline, Markov prediction model, runtime overlay, leakage-safe evaluation system, deterministic tests, and supporting PWA tooling.";
for (const [file, html] of [["index.html", indexHtml], ["spacelumin.html", caseStudyHtml]]) {
  if (!html.includes(contributionSentence)) failures.push(`${file}: missing approved SpaceLumin contribution sentence`);
  if (!html.includes("16/16 evaluator tests")) failures.push(`${file}: missing evaluator-test evidence title`);
  if (!html.includes("Deterministic coverage of event resolution, deduplication, model isolation, and exception-safe instrumentation.")) {
    failures.push(`${file}: missing evaluator-test coverage wording`);
  }
}

for (const [file, html] of [["index.html", indexHtml], ["cv.html", cvHtml]]) {
  if (!html.includes("Marburg / Frankfurt Rhine-Main, Germany")) {
    failures.push(`${file}: missing Germany location`);
  }
  if (!html.includes("HTML, CSS, JavaScript, SQL")) {
    failures.push(`${file}: missing DoubleTree by Hilton technical stack`);
  }
  if (!html.includes("Bundesfreiwilligendienst")) {
    failures.push(`${file}: missing BFD experience in Germany`);
  }
  if (!html.includes("Daily workplace use in Germany")) {
    failures.push(`${file}: missing daily German workplace proficiency wording`);
  }
}

if (!cvDeHtml.includes("Marburg / Raum Frankfurt Rhein-Main, Deutschland")) {
  failures.push("cv-de.html: missing German location line");
}
if (!cvDeHtml.includes("Bundesfreiwilligendienst (BFD) im Gesundheitswesen")) {
  failures.push("cv-de.html: missing BFD entry");
}
if (/[—–]/.test(cvDeHtml)) {
  failures.push("cv-de.html: contains prohibited em dash (—) or en dash (–)");
}
for (const color of ["#FFFFFF", "#F8FAFC", "#0F2C59", "#1E3A8A", "#0284C7", "#1F2937", "#4B5563", "#E2E8F0"]) {
  if (!cvDeHtml.includes(color)) {
    failures.push(`cv-de.html: missing required corporate color token ${color}`);
  }
}

JSON.parse(readFileSync(resolve(root, "site.webmanifest"), "utf8"));

if (failures.length) {
  console.error("Portfolio validation failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Portfolio validation passed: ${requiredFiles.length} files, ${htmlFiles.length} HTML documents (EN & DE), Germany market positioning verified.`);
