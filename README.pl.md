# Mulberry Symbols: polska taksonomia (wersja robocza)

Ta gałąź dodaje **polski podział tematyczny** zbioru Mulberry Symbols. Nie zmienia
żadnego symbolu ani nazwy pliku: katalog `EN/` jest identyczny z oryginałem.

## Co zostało dodane

| Plik | Zawartość |
|---|---|
| `scripts/data/categories-pl.csv` | mapowanie 117 kategorii źródłowych na polską domenę i podkategorię, ścieżkę katalogu (ASCII) oraz uwagi |
| `scripts/mk-tree-pl.js` | generuje drzewo `po-kategoriach/<domena>/<podkategoria>/<symbol>.svg` i waliduje spójność z `symbol-info.csv` |

## Użycie

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install   # csv-parse jest już w devDependencies; pomijamy pobieranie Chromium
node scripts/mk-tree-pl.js --dry-run    # tylko walidacja
node scripts/mk-tree-pl.js              # kopie do ./po-kategoriach
node scripts/mk-tree-pl.js --link       # dowiązania symboliczne zamiast kopii
```

Skrypt przerywa pracę z błędem, jeśli któraś kategoria nie ma mapowania, brakuje pliku
SVG albo dwa symbole trafiłyby do jednej ścieżki pod tą samą nazwą.

## Decyzje i znane ograniczenia

- **Dwie kategorie źródłowe są scalone w drzewie:** `Food Vegetables and salad` (3 symbole)
  i `Food Vegetables and salads` (55) to ta sama kategoria z literówką w źródle.
  W `symbol-info.csv` pozostają rozdzielone.
- **Domena wynika z pierwszego członu nazwy kategorii** (`Food Fruit` → Jedzenie / Owoce).
  Źródło nie ma pola „domena"; to konwencja odtworzona z nazw.
- **Kategoria `Verb` jest zbudowana według części mowy**, nie tematu, więc w drzewie
  czasowniki są rozdzielone: część w `czasowniki/`, część w podkategoriach tematycznych
  (np. `jedzenie/czynnosci-kuchenne`). Tak jest też w danych źródłowych.
- **Treści kulturowo specyficzne** (brytyjskie święta i stacje, angielskie kluby piłkarskie,
  chrześcijaństwo jako jedyna religia) są oznaczone w kolumnie `uwagi` i wymagają
  decyzji przy adaptacji do polskiego kontekstu.
- Nazwy symboli (`symbol-pl`) nie są jeszcze przetłumaczone. To kolejny etap.

## Licencja i atrybucja

Oryginalny zbiór: *Mulberry Symbols*, © 2018–2026 Steve Lee,
licencja [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
(zob. `LICENSE.txt`). Źródło: <https://github.com/mulberrysymbols/mulberry-symbols>.

Zmiany względem oryginału: dodano polską taksonomię kategorii i skrypt generujący
drzewo katalogów. Materiał pochodny jest udostępniany na tej samej licencji (CC BY-SA 4.0).
