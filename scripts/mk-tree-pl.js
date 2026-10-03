// Generuje drzewo katalogów z polskim podziałem tematycznym symboli.
//
// Nie zmienia katalogu EN/ ani nazw plików. Tworzy kopie (lub dowiązania
// symboliczne) w strukturze  <domena>/<podkategoria>/<symbol>.svg
// na podstawie scripts/data/categories-pl.csv.
//
// Użycie:
//   node scripts/mk-tree-pl.js                  # kopie do ./po-kategoriach
//   node scripts/mk-tree-pl.js --out inny/katalog
//   node scripts/mk-tree-pl.js --link           # dowiązania zamiast kopii
//   node scripts/mk-tree-pl.js --dry-run        # tylko walidacja

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const OUT = path.resolve(ROOT, option('--out', 'po-kategoriach'));
const LINK = flag('--link');
const DRY = flag('--dry-run');

const readCsv = (file) =>
  parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

const symbols = readCsv('symbol-info.csv');
// Tryb --verbs: czasowniki ułożone według klas semantycznych (verbs-pl.csv).
if (flag('--verbs')) {
  const verbOut = path.resolve(ROOT, option('--out', 'czasowniki-wg-znaczenia'));
  const verbs = readCsv('verbs-pl.csv');
  const verbErrors = [];
  const bySymbol = new Map(symbols.map((s) => [s['symbol-en'], s]));
  const verbSeen = new Set();
  const verbPlan = [];
  for (const v of verbs) {
    const name = v['symbol-en'];
    if (!bySymbol.has(name)) verbErrors.push(`symbol spoza symbol-info.csv: ${name}`);
    if (verbSeen.has(name)) verbErrors.push(`duplikat w verbs-pl.csv: ${name}`);
    verbSeen.add(name);
    const src = path.join(ROOT, 'EN', `${name}.svg`);
    if (!fs.existsSync(src)) verbErrors.push(`brak pliku: EN/${name}.svg`);
    if (!v['klasa-sciezka']) verbErrors.push(`brak klasa-sciezka: ${name}`);
    if (v['podklasa-semantyczna'] && !v['podklasa-sciezka']) verbErrors.push(`podklasa bez ścieżki: ${name}`);
    verbPlan.push({ src, dest: path.join(verbOut, v['klasa-sciezka'], v['podklasa-sciezka'] || '', `${name}.svg`) });
  }
  // Każdy czasownik wg źródła (gramatyka lub sufiks _,_to) musi mieć wiersz.
  for (const s of symbols) {
    const verbLike = ['Verb', 'VerbComplex'].includes(s.grammar) || /_,_to(_\d+)?$/.test(s['symbol-en']);
    if (verbLike && !verbSeen.has(s['symbol-en'])) verbErrors.push(`czasownik bez wiersza: ${s['symbol-en']}`);
  }
  if (verbErrors.length) {
    console.error(`BŁĘDY (${verbErrors.length}):`);
    verbErrors.slice(0, 50).forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
  const perClass = new Map();
  const perSub = new Map();
  for (const v of verbs) {
    perClass.set(v['klasa-semantyczna'], (perClass.get(v['klasa-semantyczna']) || 0) + 1);
    if (v['podklasa-semantyczna']) {
      const k = `${v['klasa-semantyczna']} / ${v['podklasa-semantyczna']}`;
      perSub.set(k, (perSub.get(k) || 0) + 1);
    }
  }
  console.log(`Czasowników: ${verbPlan.length} | klas semantycznych: ${perClass.size} | podklas: ${perSub.size}`);
  [...perClass.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${k}`));
  [...perSub.entries()].sort().forEach(([k, n]) => console.log(`        ${String(n).padStart(4)}  ${k}`));
  if (DRY) {
    console.log('Tryb --dry-run: walidacja przeszła, nic nie zapisano.');
    process.exit(0);
  }
  for (const { src, dest } of verbPlan) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest)) fs.rmSync(dest);
    if (LINK) fs.symlinkSync(path.relative(path.dirname(dest), src), dest);
    else fs.copyFileSync(src, dest);
  }
  console.log(`Zapisano ${verbPlan.length} plików w ${path.relative(process.cwd(), verbOut) || '.'} (${LINK ? 'dowiązania' : 'kopie'}).`);
  process.exit(0);
}

const categories = readCsv('categories-pl.csv');

const byId = new Map(categories.map((c) => [c['category-id'], c]));
const errors = [];

// 1. Każda kategoria ze źródła ma polski odpowiednik i zgodną nazwę EN.
const usedIds = new Set();
for (const s of symbols) {
  const c = byId.get(s['category-id']);
  if (!c) {
    errors.push(`brak mapowania dla category-id=${s['category-id']} (${s['symbol-en']})`);
    continue;
  }
  if (c['category-en'] !== s['category-en']) {
    errors.push(`niezgodna nazwa EN dla id=${c['category-id']}: "${c['category-en']}" vs "${s['category-en']}"`);
  }
  usedIds.add(s['category-id']);
}
// 2. Żadna kategoria z mapowania nie jest osierocona.
for (const c of categories) {
  if (!usedIds.has(c['category-id'])) errors.push(`osierocona kategoria w categories-pl.csv: id=${c['category-id']}`);
}

// 3. Pliki istnieją, a w katalogu docelowym nie ma kolizji nazw.
const seen = new Map();
const plan = [];
for (const s of symbols) {
  const c = byId.get(s['category-id']);
  if (!c) continue;
  const src = path.join(ROOT, 'EN', `${s['symbol-en']}.svg`);
  const dest = path.join(OUT, ...c['sciezka'].split('/'), `${s['symbol-en']}.svg`);
  if (!fs.existsSync(src)) errors.push(`brak pliku: EN/${s['symbol-en']}.svg`);
  if (seen.has(dest)) errors.push(`kolizja: ${s['symbol-en']} (${seen.get(dest)} i ${s['category-id']})`);
  seen.set(dest, s['category-id']);
  plan.push({ src, dest });
}

if (errors.length) {
  console.error(`BŁĘDY (${errors.length}):`);
  errors.slice(0, 50).forEach((e) => console.error('  - ' + e));
  process.exit(1);
}

// 4. Podsumowanie: liczba symboli w każdej domenie.
const perDomain = new Map();
for (const s of symbols) {
  const d = byId.get(s['category-id'])['domena-pl'];
  perDomain.set(d, (perDomain.get(d) || 0) + 1);
}
console.log(`Symboli: ${plan.length} | kategorii źródłowych: ${usedIds.size} | domen: ${perDomain.size}`);
[...perDomain.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([d, n]) => console.log(`  ${String(n).padStart(4)}  ${d}`));

if (DRY) {
  console.log('Tryb --dry-run: walidacja przeszła, nic nie zapisano.');
  process.exit(0);
}

for (const { src, dest } of plan) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) fs.rmSync(dest);
  if (LINK) fs.symlinkSync(path.relative(path.dirname(dest), src), dest);
  else fs.copyFileSync(src, dest);
}
console.log(`Zapisano ${plan.length} plików w ${path.relative(process.cwd(), OUT) || '.'} (${LINK ? 'dowiązania' : 'kopie'}).`);
