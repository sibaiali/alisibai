import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "index.html",
  "spacelumin.html",
  "smartpark.html",
  "lebenslauf.html",
  "lebenslauf-systemadministration.html",
  "lebenslauf-software-qa.html",
  "cv.html",
  "cv-de.html",
  "cv.css",
  "style.css",
  "script.js",
  "favicon.svg",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "vercel.json"
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) failures.push(`Missing required file: ${file}`);
}

const htmlFiles = [
  "index.html",
  "spacelumin.html",
  "lebenslauf.html",
  "lebenslauf-systemadministration.html",
  "lebenslauf-software-qa.html",
  "cv.html"
];
const htmlByFile = Object.fromEntries(
  htmlFiles.map((file) => [file, readFileSync(resolve(root, file), "utf8")])
);

const deFiles = new Set([
  "lebenslauf.html",
  "lebenslauf-systemadministration.html",
  "lebenslauf-software-qa.html"
]);

for (const [file, html] of Object.entries(htmlByFile)) {
  const expectedLang = deFiles.has(file) ? "de" : "en";
  if (!new RegExp(`<html\\s+lang="${expectedLang}"`, "i").test(html)) {
    failures.push(`${file}: missing ${expectedLang} language declaration`);
  }
  if (!/<main[\s>]/i.test(html)) failures.push(`${file}: missing main landmark`);
  if ((html.match(/<h1[\s>]/gi) || []).length !== 1) failures.push(`${file}: expected exactly one h1`);
  if (!/<meta\s+name="tdm-reservation"\s+content="1"/i.test(html)) {
    failures.push(`${file}: missing EU TDM reservation meta tag`);
  }

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
  /CE472/i,
  /Behavioral NLP Testing/i,
  /nationwide/i,
  /bundesweit/i,
  /41\/41/i,
  /strafrechtlich verfolgt/i,
  /regulärer Wechsel/i,
  /Pflege von Benutzerkonten im Active Directory/i,
  /Zuverlässigkeit im Schichtalltag/i,
  /3 IT &amp; engineering stations/i
];

for (const [file, content] of Object.entries(htmlByFile)) {
  for (const claim of prohibitedClaims) {
    if (claim.test(content)) failures.push(`${file}: prohibited or outdated claim matched ${claim}`);
  }
}

const indexHtml = htmlByFile["index.html"];
const cvSysDe = htmlByFile["lebenslauf-systemadministration.html"];
const cvSwDe = htmlByFile["lebenslauf-software-qa.html"];
const cvEn = htmlByFile["cv.html"];

if (!indexHtml.includes("Software, Systems &amp; QA Automation")) {
  failures.push("index.html: missing updated main title");
}
if (!indexHtml.includes("BFD permit; change to a skilled-worker permit upon job offer")) {
  failures.push("index.html: missing updated Residence wording in Recruiter brief");
}
if (!indexHtml.includes("Windows &amp; Linux (administration foundations)")) {
  failures.push("index.html: missing updated SYS pillar wording");
}
if (!indexHtml.includes("© 2026 Ali Sibai · Marburg, Hessen, Germany · No cookies, no trackers.")) {
  failures.push("index.html: missing clean footer wording");
}

for (const [file, html] of [
  ["lebenslauf-systemadministration.html", cvSysDe],
  ["lebenslauf-software-qa.html", cvSwDe],
  ["cv.html", cvEn]
]) {
  if (!/<meta\s+name="robots"\s+content="noindex,\s*nofollow"/i.test(html)) {
    failures.push(`${file}: missing noindex, nofollow meta tag`);
  }
  if (!html.includes("Intermediate SQL (2024)")) {
    failures.push(`${file}: missing Intermediate SQL (2024) certificate`);
  }
}

for (const [file, html] of [
  ["lebenslauf-systemadministration.html", cvSysDe],
  ["lebenslauf-software-qa.html", cvSwDe]
]) {
  if (!html.includes("Bewerbung als ")) failures.push(`${file}: missing 'Bewerbung als' role prefix`);
  if (!html.includes("Frühjahr/Sommer 2026 (Projektpraktikum)")) failures.push(`${file}: missing CBI date wording`);
  if (!html.includes("Sommer 2025 (Intensiv-Praxisprojekt)")) failures.push(`${file}: missing Hilton date wording`);
  if (!html.includes("HMAC-SHA256-Datenschutz-Tokens")) failures.push(`${file}: missing original SmartPark token wording`);
  if (!html.includes("Programmiersprachen:")) failures.push(`${file}: missing Programmiersprachen label`);
  if (html.indexOf("CBI (Compagnie Bureautique et Informatique)") > html.indexOf("DoubleTree by Hilton")) {
    failures.push(`${file}: CBI must appear before DoubleTree by Hilton`);
  }
  if (html.indexOf("DoubleTree by Hilton") > html.indexOf("Universitätsklinikum Gießen und Marburg (UKGM)")) {
    failures.push(`${file}: DoubleTree by Hilton must appear before UKGM BFD`);
  }
}

JSON.parse(readFileSync(resolve(root, "site.webmanifest"), "utf8"));

if (failures.length) {
  console.error("Portfolio validation failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Portfolio validation passed: ${requiredFiles.length} files, ${htmlFiles.length} HTML documents (DE Version A, DE Version B & EN), strict German HR audit verified.`);
