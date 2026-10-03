# Mulberry Symbols: polska taksonomia (wersja robocza)

Ta gałąź dodaje **polski podział tematyczny** zbioru Mulberry Symbols. Nie zmienia
żadnego symbolu ani nazwy pliku: katalog `EN/` jest identyczny z oryginałem.

## Co zostało dodane

| Plik | Zawartość |
|---|---|
| `scripts/data/categories-pl.csv` | mapowanie 117 kategorii źródłowych na polską domenę i podkategorię, ścieżkę katalogu (ASCII) oraz uwagi |
| `scripts/data/verbs-pl.csv` | szkic dla 464 czasowników: bezokolicznik PL, aspekt, klasa semantyczna, uwagi |
| `scripts/mk-tree-pl.js` | generuje drzewo `po-kategoriach/<domena>/<podkategoria>/<symbol>.svg` (lub z `--verbs`: `czasowniki-wg-znaczenia/<klasa>/`) i waliduje spójność z `symbol-info.csv` |

## Użycie

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install   # csv-parse jest już w devDependencies; pomijamy pobieranie Chromium
node scripts/mk-tree-pl.js --dry-run    # tylko walidacja
node scripts/mk-tree-pl.js              # kopie do ./po-kategoriach
node scripts/mk-tree-pl.js --link       # dowiązania symboliczne zamiast kopii
node scripts/mk-tree-pl.js --verbs      # czasowniki według klas semantycznych
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
- **Komputer w jednej domenie.** Kategorie źródłowe 36 (`Computer Icon`: interfejs i polecenia)
  i 49 (`Electrical Computer`: sprzęt i obsługa) to jeden obszar pojęciowy rozcięty na dwa;
  granica jest nieostra (klawisze i `computer_mouse_1` w 36, `computer_mouse_2` i klawiatura w 49).
  W drzewie obie są pod `komputer/`; w danych źródłowych pozostają rozdzielone.
- **Treści kulturowo specyficzne** (brytyjskie święta i stacje, angielskie kluby piłkarskie)
  są oznaczone w kolumnie `uwagi` i wymagają decyzji przy adaptacji do polskiego kontekstu.
- **Religia.** Wszystkie symbole w kategoriach `Religion *` mają tag `Christian`, a wyszukiwanie
  po nazwach nie znalazło żadnego symbolu innej religii. Nazwy nie zawierają oznaczeń wyznaniowych
  (brak duchowieństwa, świętych, sakramentów); jedynym wprost wyznaniowym jest `Puritans`.
  Treść odpowiada raczej kalendarzowi liturgicznemu i kulturze szkolnej brytyjskiej niż konkretnemu
  wyznaniu. Nie sprawdzano obrazów, tylko nazwy i tagi.
- Nazwy pozostałych symboli (poza czasownikami) nie są jeszcze przetłumaczone.

## Czasowniki (`verbs-pl.csv`)

Szkic dla wszystkich 464 pozycji czasownikowych (gramatyka `Verb` lub `VerbComplex`, albo sufiks `_,_to`).
Kolumny: bezokolicznik, aspekt, klasa semantyczna, uwagi.

- Nazwy źródłowe mają formę słownikową („X, to"), nie są odmienione. Trafienia na `-ing` i `-ed`
  to leksemy (`sing`, `bring`, `swing`) albo idiomy (`get_dressed`).
- 17 klas semantycznych to własna klasyfikacja robocza, luźno inspirowana WordNetem, nie jego
  odwzorowanie. Jedna klasa na symbol, przypisana według znaczenia, nie tematyki kategorii
  źródłowej. Największa klasa (manipulowanie przedmiotami, 58) jest w praktyce workiem na
  nieprzydzielone i wymaga podziału.
- Aspekt: 462 bezokoliczniki niedokonane, 2 dokonane (`znaleźć`, `spóźnić się na autobus`).
  Zasada cytowania i pary aspektowe pozostają do decyzji.
- Czasowniki ruchu mają pary określony/nieokreślony (iść/chodzić, biec/biegać, jechać/jeździć);
  zaznaczono je w `uwagi`.
- 66 pozycji to warianty obrazu tego samego leksemu, 15 ma znaczenie do potwierdzenia na obrazie
  (nazwy angielskie bywają wieloznaczne). Szkic powstał bez oglądania obrazów.
- Pięć czasowników w kategorii źródłowej `People Actions` (`Ludzie / Czynności`) rozchodzi się po klasach
  znaczeniowych (ruch, odpoczynek, praca).

## Licencja i atrybucja

Oryginalny zbiór: *Mulberry Symbols*, © 2018–2026 Steve Lee,
licencja [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
(zob. `LICENSE.txt`). Źródło: <https://github.com/mulberrysymbols/mulberry-symbols>.

Zmiany względem oryginału: dodano polską taksonomię kategorii i skrypt generujący
drzewo katalogów. Materiał pochodny jest udostępniany na tej samej licencji (CC BY-SA 4.0).
