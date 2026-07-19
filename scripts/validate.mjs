import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "index.html",
  "spacelumin.html",
  "cv.html",
  "style.css",
  "portfolio-data.js",
  "script.js",
  "favicon.svg",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "docs/CE472_ResearchPaper_NLP.pdf"
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) failures.push(`Missing required file: ${file}`);
}

const htmlFiles = ["index.html", "spacelumin.html", "cv.html"];
const htmlByFile = Object.fromEntries(
  htmlFiles.map((file) => [file, readFileSync(resolve(root, file), "utf8")])
);

for (const [file, html] of Object.entries(htmlByFile)) {
  if (!/<html\s+lang="en"/i.test(html)) failures.push(`${file}: missing English language declaration`);
  if (!/<main[\s>]/i.test(html)) failures.push(`${file}: missing main landmark`);
  if ((html.match(/<h1[\s>]/gi) || []).length !== 1) failures.push(`${file}: expected exactly one h1`);

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

const publicClaimFiles = ["index.html", "spacelumin.html", "cv.html", "portfolio-data.js"];
const blocked = (...parts) => new RegExp(parts.join(""), "i");
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
  blocked("\\bGer", "many\\b"),
  blocked("German emp", "loyer"),
  blocked("Frank", "furt"),
  blocked("Mar", "burg"),
  blocked("\\bB", "FD\\b"),
  blocked("\\bUK", "GM\\b"),
  blocked("relocation to Ger", "many"),
  blocked("moving to Ger", "many"),
  blocked("Cry", "tek"),
  /\bGPA\b/i,
  /TOEFL[^<\n]*\b68\b/i
];

for (const file of publicClaimFiles) {
  const content = readFileSync(resolve(root, file), "utf8");
  for (const claim of prohibitedClaims) {
    if (claim.test(content)) failures.push(`${file}: prohibited or outdated claim matched ${claim}`);
  }
}

JSON.parse(readFileSync(resolve(root, "site.webmanifest"), "utf8"));

if (failures.length) {
  console.error("Portfolio validation failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Portfolio validation passed: ${requiredFiles.length} files, ${htmlFiles.length} HTML documents, no prohibited public claims.`);
