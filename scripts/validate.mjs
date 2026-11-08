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
  /strafrechtlich verfolgt/i
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

if (!indexHtml.includes("Software, Systems &amp; Infrastructure Engineering")) {
  failures.push("index.html: missing updated main title");
}
if (!indexHtml.includes("VoidLumin")) {
  failures.push("index.html: missing VoidLumin supporting project card");
}
if (!indexHtml.includes("Dependency-free architecture · Privacy-first (No cookies or trackers).")) {
  failures.push("index.html: missing clean footer wording");
}

for (const [file, html] of [
  ["lebenslauf-systemadministration.html", cvSysDe],
  ["lebenslauf-software-qa.html", cvSwDe]
]) {
  if (!html.includes("+49 177 6763484")) failures.push(`${file}: missing phone number`);
  if (!html.includes("§ 19e AufenthG")) failures.push(`${file}: missing § 19e AufenthG residence wording`);
  if (!html.includes("§ 18b / § 18g AufenthG")) failures.push(`${file}: missing § 18b / § 18g AufenthG wording`);
  if (!html.includes("ITIL-orientierter")) failures.push(`${file}: missing ITIL-orientierter Support wording`);
  if (!html.includes("Bachelorarbeit / B.Sc. Abschlussprojekt")) {
    failures.push(`${file}: missing Bachelorarbeit / B.Sc. Abschlussprojekt wording`);
  }
  if (!html.includes("Licence Professionnelle in Allgemeiner Psychologie")) {
    failures.push(`${file}: missing updated Psychology credential wording`);
  }
  if (!html.includes("Marburg, November 2026")) {
    failures.push(`${file}: missing clean German footer sign-off`);
  }
}

if (cvSysDe.indexOf("Berufserfahrung &amp; IT-Praxis") > cvSysDe.indexOf("Software-, Datenbank- &amp; Automatisierungsprojekte")) {
  failures.push("lebenslauf-systemadministration.html: Berufserfahrung & IT-Praxis must appear before projects");
}
if (cvSwDe.indexOf("Ausgewählte Software- &amp; Engineering-Projekte") > cvSwDe.indexOf("Berufserfahrung &amp; Praxis")) {
  failures.push("lebenslauf-software-qa.html: Projects must appear before Berufserfahrung & Praxis");
}
if (!cvEn.includes("+49 177 6763484")) {
  failures.push("cv.html: missing German phone number");
}

JSON.parse(readFileSync(resolve(root, "site.webmanifest"), "utf8"));

if (failures.length) {
  console.error("Portfolio validation failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Portfolio validation passed: ${requiredFiles.length} files, ${htmlFiles.length} HTML documents (DE Version A, DE Version B & EN), Germany HR standards verified.`);
