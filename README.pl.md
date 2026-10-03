# Mulberry Symbols: polska taksonomia i nazwy (wersja robocza)

Ta gałąź dodaje **polski podział tematyczny i polskie nazwy** zbioru Mulberry Symbols.
Nie zmienia żadnego symbolu ani nazwy pliku: katalog `EN/` jest identyczny z oryginałem.
Wszystkie dane są **materiałem roboczym do przeglądu**, a nie ostateczną decyzją o zawartości bazy.

## Co zostało dodane

| Plik | Zawartość |
|---|---|
| `scripts/data/categories-pl.csv` | mapowanie 117 kategorii źródłowych na polską domenę i podkategorię, ścieżkę katalogu (ASCII) oraz uwagi |
| `scripts/data/verbs-pl.csv` | 464 czasowniki: bezokolicznik PL, aspekt, klasa i podklasa semantyczna, przybliżona domena WordNet, uwagi |
| `scripts/data/symbol-info-pl.csv` | wszystkie 3436 symboli z polską nazwą, kategorią, częściami mowy (EN i PL), flagami i pustą kolumną `decyzja-do-bazy` |
| `scripts/mk-tree-pl.js` | generuje drzewo `po-kategoriach/<domena>/<podkategoria>/<symbol>.svg` (lub z `--verbs`: `czasowniki-wg-znaczenia/<klasa>/<podklasa>/`) i waliduje spójność z `symbol-info.csv` |
| `.gitignore` | dopisane katalogi wyjściowe generatora |

Pliki CSV mają zakończenia linii LF.

## Użycie

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install   # csv-parse jest już w devDependencies; pomijamy pobieranie Chromium
node scripts/mk-tree-pl.js --dry-run    # tylko walidacja
node scripts/mk-tree-pl.js              # kopie do ./po-kategoriach
node scripts/mk-tree-pl.js --link       # dowiązania symboliczne zamiast kopii
node scripts/mk-tree-pl.js --verbs      # czasowniki według klas i podklas semantycznych
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
  granica jest nieostra. W drzewie obie są pod `komputer/`; w danych źródłowych pozostają rozdzielone.
- **Treści kulturowo specyficzne** (brytyjskie święta i stacje, angielskie kluby piłkarskie,
  potrawy) mają flagę `K` i wymagają decyzji przy adaptacji do polskiego kontekstu.
- **Religia.** Wszystkie symbole w kategoriach `Religion *` mają tag `Christian`; wyszukiwanie po
  nazwach nie znalazło symbolu żadnej innej religii. Występują postacie i wydarzenia biblijne
  (`Jesus`, `Mary`, `Joseph`, `Judas`, `Last_Supper`, `Crucifixion`, `Nativity`) oraz elementy
  kalendarza liturgicznego (`Advent`, `Ash_Wednesday`, `Lent`, `Palm_Sunday`, `Shrove_Tuesday_1`).
  W nazwach nie ma duchowieństwa ani sakramentów, a jedynym wprost wyznaniowym określeniem jest
  `Puritans`. Treść odpowiada brytyjskiemu kalendarzowi i kulturze szkolnej, nie jednemu wyznaniu.
  Nie sprawdzano obrazów, tylko nazwy i tagi.

## Polskie nazwy wszystkich symboli (`symbol-info-pl.csv`)

Jeden wiersz = jeden plik w `EN/`; klucz: `symbol-en` (nazwa pliku bez `.svg`). Kolumna `decyzja-do-bazy`
jest celowo pusta.

Kolumny: `symbol-id`, `symbol-en`, `symbol-pl`, `domena-pl`, `podkategoria-pl`,
`czesc-mowy-zrodlo` (z oryginalnego `symbol-info.csv`), `czesc-mowy-en`, `czesc-mowy-pl`,
`liczba-pl`, `rodzaj-formy-pl`, `wariant`, `klasa-semantyczna`, `podklasa-semantyczna`,
`domena-wordnet`, `aspekt` (te cztery ostatnie dotyczą tylko czasowników), `uwagi`, `flaga`, `decyzja-do-bazy`.

Zasady tłumaczenia:
- Czasowniki: bezokolicznik (forma słownikowa) z `verbs-pl.csv`; pozostałe nazwy w mianowniku liczby
  pojedynczej. Polecenia interfejsu (`copy`, `paste`, `print`, `save`) mają formę rozkazującą z dopiskiem
  „(polecenie)”, a działania matematyczne (`add`, `subtract`, `multiply`, `divide`) rzeczownik odczasownikowy;
  to rozróżnienie jest celowe, ale do decyzji.
- Przymiotniki są zapisane w formie podstawowej (mianownik lp. rodzaju męskiego); kolumna `rodzaj-formy-pl`
  mówi, jaką formę zapisano. Tam, gdzie to możliwe, wybrano formę neutralną rodzajowo
  (np. „w związku małżeńskim”, „na emeryturze”). Pary rodzajowe „-y/-a” czy osobne symbole to decyzja otwarta.
- Zawody (`People Profession`): zwykle `_1x` = postać męska, `_2x` = żeńska; litery `a`–`d` = odcienie skóry
  (u taksówkarzy `a`/`b` i `c`/`d` to dwie pary postaci). Wyjątek: `care_assistant_*`, gdzie `a` = postać męska, `b` = żeńska,
  a numer 1–6 koduje odcienie skóry opiekuna i podopiecznego (2 i 4: ikona wózka). Nazwy mają rodzaj zgodny z postacią.
- Alfabet: litery łacińskie bez polskich znaków diakrytycznych (`ą ć ę ł ń ó ś ź ż` nie występują w źródle).
- Tłumaczenia powstały z angielskich nazw. Obrazy wszystkich 3436 symboli zostały obejrzane
  i porównane z tłumaczeniem: czasowniki i symbole dawniej oznaczone flagą V przeze mnie, resztę (2815) w osobnym
  przeglądzie przez niezależnych recenzentów (modele AI), z weryfikacją najpoważniejszych zarzutów przeze mnie.
  Wątpliwości o niskiej pewności zostawiono bez zmian. Całość nadal wymaga przeglądu merytorycznego przez osobę znającą materiał.
  Gdy o znaczeniu zdecydował obraz, w `uwagi` jest wpis zaczynający się od „obraz:”.

Flagi w kolumnie `flaga` (można łączyć): `K` treść specyficzna kulturowo (UK) lub idiom (112); `B` nazwa handlowa (21); `E` literówka lub błąd w źródle (15);
`N` nie-państwo: terytorium, region, organizacja (90); `P` status sporny lub niepowszechnie uznawany (14);
`M` czasownik ruchu (7); `G` gramatyka w źródle niespójna z nazwą (3); `R` oznaczone w źródle jako `rated=1` (6).

### Części mowy

Źródłowa kolumna `grammar` oznacza jako `Noun` 2973 z 3436 symboli, także przymiotniki (`absent`, `hot`, `red`),
przyimki (`under_1`), przysłówki i zaimki. Kolumny `czesc-mowy-en` i `czesc-mowy-pl` są własną klasyfikacją roboczą
(reguły plus ręczne listy; ok. 820 symboli ma część mowy inną niż rzeczownik lub litera), do przeglądu. Mogą się różnić
między językami (np. `add`: verb → „dodawanie”, rzeczownik odczasownikowy).

Zasada dla fraz: jako „wyrażenie rzeczownikowe” oznaczono opisowe zestawienia (np. `clean_room`, `hat_too_big`), a
ustalone nazwy złożone („woda po goleniu”, „sok jabłkowy”) liczone są jako rzeczowniki. Kolumna `liczba-pl` oznacza
wyłącznie rzeczowniki mające w polskim tylko liczbę mnogą (pluralia tantum); lista jest częściowa.

Dziesięć symboli o angielskiej nazwie czasownikowej leży poza kategorią „Verb” i nie ma wiersza w `verbs-pl.csv`:
`add`, `subtract`, `multiply`, `divide`, `copy`, `paste`, `print`, `save`, `float`, `mend`. Dla `copy` istnieje
dodatkowo osobny symbol czasownikowy `copy_,_to`.

## Czasowniki (`verbs-pl.csv`)

464 pozycje czasownikowe (gramatyka `Verb` lub `VerbComplex`, albo sufiks `_,_to`; trzy z nich, `gravy_pour`,
`mash_potato`, `pour_cake_mixture`, mają w źródle gramatykę `Noun` i flagę `G`).

- Nazwy źródłowe mają formę słownikową („X, to"), nie są odmienione. Trafienia na `-ing` i `-ed` to leksemy
  (`sing`, `bring`, `swing`) albo idiomy (`get_dressed`).
- **Klasyfikacja jest moją własną, roboczą konstrukcją, nie wynikiem badań ani odwzorowaniem istniejącego zasobu.**
  17 klas semantycznych (kolumna `klasa-semantyczna`) i 33 podklasy w ośmiu klasach (ruch; manipulowanie przedmiotami;
  gotowanie i obróbka żywności; relacje społeczne i opieka; higiena i ubieranie się; gra, sport i wypoczynek;
  zmiana stanu; prace domowe i ogrodowe), tam gdzie klasa była zbyt różnorodna. Jedna klasa na symbol, według
  znaczenia, nie tematyki kategorii źródłowej. Największa klasa to manipulowanie przedmiotami (52), podzielona na sześć podklas.
- `domena-wordnet` to przybliżone, ręczne przyporządkowanie do jednej z 15 domen leksykograficznych czasowników
  Princeton WordNet (w danych użyto 14 z nich) (`verb.body`, `verb.change`, `verb.cognition`, `verb.communication`, `verb.competition`,
  `verb.consumption`, `verb.contact`, `verb.creation`, `verb.emotion`, `verb.motion`, `verb.perception`,
  `verb.possession`, `verb.social`, `verb.stative`, `verb.weather`); Słowosieć (plWordNet) ma analogiczny zestaw.
  Nie jest to wyszukanie w słowniku, tylko mój przydział według znaczenia i polskiego bezokolicznika; służy do
  porównań z innymi zasobami, a nie do rozstrzygnięć. Domena `weather` nie występuje.
- Aspekt: 461 bezokoliczników niedokonanych, 3 dokonane (`znaleźć`, `spóźnić się na autobus`, `oparzyć się`).
  Zasada cytowania i pary aspektowe pozostają do decyzji.
- Czasowniki ruchu mają pary określony/nieokreślony (iść/chodzić, biec/biegać, jechać/jeździć); zaznaczono je w `uwagi`.
- Obejrzano obrazy wszystkich czasowników. Nazwy angielskie bywają wieloznaczne albo mylące, więc obraz
  zmienił znaczenie m.in. w: `hang` (wisieć na drążku, nie wieszać), `shake` (trząść się), `stamp` (tupać),
  `slide` (ślizgać się, nie zjeżdżalnia), `dive` i `dive_2` (skok do wody, nie nurkowanie), `bend` (schylać się),
  `stretch` (rozciągać przedmiot), `cheat` (ściągać), `decorate` (obraz: malowanie ściany; zachowano „dekorować”), `sign` (migać),
  `talk_3` i `talk_4` (rozmawiać), `order_2` (rozkazywać). Przy `sign` interpretacja jest moja i wymaga potwierdzenia
  przez osobę znającą Makaton lub PJM, bo na obrazie nie ma długopisu ani kartki.
- Pięć czasowników w kategorii źródłowej `People Actions` rozchodzi się po klasach znaczeniowych (ruch, odpoczynek, praca).

## Licencja i atrybucja

Oryginalny zbiór: *Mulberry Symbols*, © 2018–2026 Steve Lee,
licencja [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
(zob. `LICENSE.txt`). Źródło: <https://github.com/mulberrysymbols/mulberry-symbols>.

Zmiany względem oryginału: dodano pliki `categories-pl.csv`, `verbs-pl.csv`, `symbol-info-pl.csv`, skrypt
`mk-tree-pl.js`, ten plik i wpisy w `.gitignore`. Materiał pochodny jest udostępniany na tej samej licencji
(CC BY-SA 4.0). Licencja CC nie obejmuje znaków towarowych; nie sugerujemy zatwierdzenia przez autora oryginału.
