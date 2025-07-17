// Sekcja: Nawigacja
let kategoriePlanowane = [];

function addWydatekPlanowanyRow() {
  addRow("wydatki-planowane-table", [
    { type: "text", placeholder: "Kategoria" },
    { type: "number", placeholder: "Kwota" },
    { type: "date", placeholder: "Data" },
    { type: "checkbox", placeholder: "Stałe" }
  ]);

  // Po dodaniu nowego wiersza pobierz ostatni dodany input kategorii
  const tabela = document.getElementById("wydatki-planowane-table").getElementsByTagName("tbody")[0];
  const ostatniWiersz = tabela.lastElementChild;
  if (!ostatniWiersz) return;

  const inputKategoria = ostatniWiersz.querySelector('td:nth-child(1) input');

  if (inputKategoria) {
    // Po wpisaniu kategorii dodajemy ją do listy unikalnych kategorii
    inputKategoria.addEventListener("change", () => {
      let kategoria = inputKategoria.value.trim().toLowerCase();
      if (kategoria && !kategoriePlanowane.includes(kategoria)) {
        kategoriePlanowane.push(kategoria);
        console.log("Dodano kategorię planowaną:", kategoria);
        // Tutaj możesz wywołać funkcję aktualizującą select z kategoriami w wydatkach zrealizowanych
        aktualizujKategorieZrealizowane();
      }
    });
  }
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
  zapiszDane();

  // 🔧 Naprawa widoczności notatek tylko w ich sekcji
  const listaNotatek = document.getElementById("lista-notatek");
  if (listaNotatek) {
if (id === "notatki") {
  renderujNotatki();  // <-- zmiana tutaj
} else {
  const listaNotatek = document.getElementById("lista-notatek");
  if (listaNotatek) listaNotatek.innerHTML = "";
}
  }

  // Ukryj menu na telefonie
const menu = document.getElementById("menu");
console.log("Sprawdzam menu, klasa show jest:", menu.classList.contains("show"));
if (window.innerWidth < 768 && menu.classList.contains("show")) {
  console.log("Zamykam menu…");
  menu.classList.remove("show");
  menu.style.display = 'none';
}
}
function ukryjWszystkieSekcje() {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.add("hidden");
  });
}
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}
function addRow(tableId, cols) {
  const table = document.querySelector(`#${tableId} tbody`);
  const row = document.createElement("tr");

  cols.forEach((col, index) => {
    const td = document.createElement("td");

    // Specjalna obsługa kategorii w wydatkach zrealizowanych (druga kolumna)
    const isKategoriaZrealizowane = tableId === "wydatki-zrealizowane-table" && index === 1;

    if (isKategoriaZrealizowane) {
      const select = document.createElement("select");

      // Dodaj opcje z kategorii planowanych
      kategoriePlanowane.forEach(kategoria => {
        const option = document.createElement("option");
        option.value = kategoria;
        option.textContent = kategoria.charAt(0).toUpperCase() + kategoria.slice(1);
        select.appendChild(option);
      });

      // Dodaj opcję "Inne"
      const inneOption = document.createElement("option");
      inneOption.value = "inne";
      inneOption.textContent = "Inne";
      select.appendChild(inneOption);

      // Ustaw wcześniej zapisaną wartość (jeśli istnieje)
     const wartosc = (col.value || "").trim().toLowerCase();
     console.log("Wczytana kategoria:", `"${wartosc}"`);
console.log("Dostępne kategorie:", kategoriePlanowane);

const dopasowana = kategoriePlanowane.find(kat => kat.toLowerCase() === wartosc);
select.value = dopasowana || "inne";

      select.addEventListener("change", zapiszDane);
      td.appendChild(select);
    } else {
      // Dla pozostałych kolumn twórz input
      const input = document.createElement("input");
      input.type = col.type;
      input.placeholder = col.placeholder || "";

      if (col.type === "checkbox") {
        input.checked = !!col.value;
        input.addEventListener("change", zapiszDane);
      } else {
        input.value = col.value || "";
        input.addEventListener("input", zapiszDane);
      }

      td.appendChild(input);
    }

    row.appendChild(td);
  });

  // Kolumna "Usuń"
  const deleteTd = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Usuń";
  deleteBtn.onclick = () => {
    row.remove();
    zapiszDane();
  };
  deleteTd.appendChild(deleteBtn);
  row.appendChild(deleteTd);

  table.appendChild(row);
}
function addMajatekRow() {
  addRow("majatek-table", [
    { type: "text", placeholder: "Nazwa" },
    { type: "number", placeholder: "Wartość" }
  ]);
}
function addZobowiazanieRow() {
  addRow("zobowiazania-table", [
    { type: "text", placeholder: "Nazwa" },
    { type: "number", placeholder: "Oprocentowanie" },
    { type: "number", placeholder: "Kwota" }
  ]);
}
function addPrzychodRow() {
  addRow("przychody-table", [
    { type: "text", placeholder: "Źródło" },
    { type: "number", placeholder: "Kwota" },
    { type: "date", placeholder: "Data" },
    { type: "checkbox", placeholder: "Stałe" }
  ]);
}
function aktualizujKategorieZrealizowane() {
  const tabela = document.getElementById("wydatki-zrealizowane-table").getElementsByTagName("tbody")[0];
  // Dla każdego wiersza zrealizowanych wydatków aktualizujemy select kategorii
  Array.from(tabela.rows).forEach(row => {
    const tdKategoria = row.cells[1]; // druga kolumna to kategoria
    if (!tdKategoria) return;

    // Jeśli nie jest selectem, zastąp input selectem
    let select = tdKategoria.querySelector("select");
    if (!select) {
      const input = tdKategoria.querySelector("input");
      const wartosc = input ? input.value : "";
      tdKategoria.innerHTML = ""; // czyścimy
      select = document.createElement("select");
      tdKategoria.appendChild(select);

      // ustawiamy wartość na starą, jeśli istnieje
      select.value = wartosc;
    }

    // Czyścimy opcje i dodajemy na nowo
    select.innerHTML = "";
    kategoriePlanowane.forEach(kat => {
      const option = document.createElement("option");
      option.value = kat;
      option.textContent = kat.charAt(0).toUpperCase() + kat.slice(1);
      select.appendChild(option);
    });
    // Dodajemy opcję "Inne"
    const inneOption = document.createElement("option");
    inneOption.value = "inne";
    inneOption.textContent = "Inne";
    select.appendChild(inneOption);

    // Jeśli wartość nie jest w liście kategorii, ustaw na "Inne"
    if (!kategoriePlanowane.includes(select.value)) {
      select.value = "inne";
    }
  });
}

function addWydatekZrealizowanyRow() {
  const table = document.querySelector("#wydatki-zrealizowane-table tbody");
  const row = document.createElement("tr");

  // Kolumna: Opis (tekst)
  const tdOpis = document.createElement("td");
  const inputOpis = document.createElement("input");
  inputOpis.type = "text";
  inputOpis.placeholder = "Opis";
  inputOpis.addEventListener("input", zapiszDane);
  tdOpis.appendChild(inputOpis);
  row.appendChild(tdOpis);

  // Kolumna: Kategoria (select)
  const tdKategoria = document.createElement("td");
  const selectKategoria = document.createElement("select");
  // Opcje dodamy zaraz przez aktualizujKategorieZrealizowane()
  selectKategoria.addEventListener("change", zapiszDane);
  tdKategoria.appendChild(selectKategoria);
  row.appendChild(tdKategoria);

  // Kolumna: Kwota (number)
  const tdKwota = document.createElement("td");
  const inputKwota = document.createElement("input");
  inputKwota.type = "number";
  inputKwota.placeholder = "Kwota";
  inputKwota.addEventListener("input", zapiszDane);
  tdKwota.appendChild(inputKwota);
  row.appendChild(tdKwota);

  // Kolumna: Data (date)
  const tdData = document.createElement("td");
  const inputData = document.createElement("input");
  inputData.type = "date";
  inputData.placeholder = "Data";
  inputData.addEventListener("input", zapiszDane);
  tdData.appendChild(inputData);
  row.appendChild(tdData);

  // Kolumna: Usuń
  const tdUsun = document.createElement("td");
  const btnUsun = document.createElement("button");
  btnUsun.textContent = "Usuń";
  btnUsun.onclick = () => {
    row.remove();
    zapiszDane();
  };
  tdUsun.appendChild(btnUsun);
  row.appendChild(tdUsun);

  table.appendChild(row);

  // Po dodaniu nowego wiersza uaktualniamy select z kategoriami
  aktualizujKategorieZrealizowane();
}
function aktualizujKategorieZrealizowane() {
  // Pobierz wszystkie kategorie z planowanych wydatków (unikalne, wyczyszczone)
  const kategoriePlanowane = new Set();
  document.querySelectorAll('#wydatki-planowane-table tbody tr').forEach(row => {
    const inputKat = row.children[0]?.querySelector('input');
    if (inputKat) {
      let kat = inputKat.value.trim().toLowerCase();
      if (kat) kategoriePlanowane.add(kat);
    }
  });

  // Znajdź wszystkie selecty w zrealizowanych wydatkach i odśwież ich opcje
  document.querySelectorAll('#wydatki-zrealizowane-table tbody select').forEach(select => {
    const currentValue = select.value;
    // Usuń stare opcje
    select.innerHTML = '';
    // Dodaj opcję "Inne"
    const optionInne = document.createElement('option');
    optionInne.value = 'inne';
    optionInne.textContent = 'Inne';
    select.appendChild(optionInne);
    // Dodaj opcje z planowanych
    Array.from(kategoriePlanowane).sort().forEach(kat => {
      const option = document.createElement('option');
      option.value = kat;
      option.textContent = kat.charAt(0).toUpperCase() + kat.slice(1);
      select.appendChild(option);
    });
    // Przywróć poprzednią wartość jeśli nadal jest dostępna, jeśli nie to "Inne"
    if (Array.from(select.options).some(opt => opt.value === currentValue)) {
      select.value = currentValue;
    } else {
      select.value = 'inne';
    }
  });
}

// Pobierz aktualny symbol waluty
function getCurrencySymbol() {
  const select = document.getElementById('currencySelector');
  return select ? select.value : 'zł';
}
function getCurrentMonthKey() {
  const teraz = new Date();
  const rok = teraz.getFullYear();
  const miesiac = String(teraz.getMonth() + 1).padStart(2, "0");
  return `${rok}-${miesiac}`;
}
// Obliczenia wartości netto
function obliczWartoscNetto() {
  const majatek = Array.from(document.querySelectorAll('#majatek-table tbody tr')).map(row => parseFloat(row.children[1]?.querySelector("input")?.value || 0));
  const zobowiazania = Array.from(document.querySelectorAll('#zobowiazania-table tbody tr')).map(row => parseFloat(row.children[2]?.querySelector("input")?.value || 0));
  const sumaMajatek = majatek.reduce((a, b) => a + b, 0);
  const sumaZobowiazania = zobowiazania.reduce((a, b) => a + b, 0);
  const netto = sumaMajatek - sumaZobowiazania;
  const symbol = getCurrencySymbol();
  document.getElementById("suma-majatku").textContent = sumaMajatek.toFixed(2) + " " + symbol;
  document.getElementById("suma-zobowiazan").textContent = sumaZobowiazania.toFixed(2) + " " + symbol;
  document.getElementById("wartosc-netto-wynik").textContent = netto.toFixed(2) + " " + symbol;
  if (!localStorage.getItem("pierwszaWartoscNetto")) {
    localStorage.setItem("pierwszaWartoscNetto", netto);
  }
  const pierwsza = parseFloat(localStorage.getItem("pierwszaWartoscNetto"));
  const roznica = netto - pierwsza;
  document.getElementById("pierwsza-wartosc-netto").textContent = pierwsza.toFixed(2) + " " + symbol;
  document.getElementById("roznica-wartosci-netto").textContent =
    roznica >= 0 ? `Twój majątek wzrósł o ${roznica.toFixed(2)} ${symbol}` : `Twój majątek zmalał o ${Math.abs(roznica).toFixed(2)} ${symbol}`;
  aktualizujPlanSplat();
}
// Pasek funduszu awaryjnego
function aktualizujPasekFundusz() {
  const cel = parseFloat(document.getElementById("fundusz-cel").value) || 0;
  const obecnie = parseFloat(document.getElementById("fundusz-obecnie").value) || 0;
  const procent = cel > 0 ? Math.min((obecnie / cel) * 100, 100) : 0;
  const pasek = document.querySelector("#pasek-awaryjny .postep");
  pasek.style.width = `${procent}%`;
  pasek.textContent = `${procent.toFixed(1)}%`;
}
// Pasek poduszki bezpieczeństwa
function aktualizujPoduszke() {
  const miesiace = parseInt(document.getElementById("poduszka-miesiace").value);
  const wydatki = Array.from(document.querySelectorAll("#wydatki-planowane-table tbody input[type='number']"));
  const sumaWydatkow = wydatki.reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
  const cel = miesiace * sumaWydatkow;
  document.getElementById("poduszka-cel").value = cel;
  const obecnie = parseFloat(document.getElementById("poduszka-obecnie").value) || 0;
  const procent = cel > 0 ? Math.min((obecnie / cel) * 100, 100) : 0;
  const pasek = document.querySelector("#pasek-poduszka .postep");
  pasek.style.width = `${procent}%`;
  pasek.textContent = `${procent.toFixed(1)}%`;
}
// Plan spłat
function aktualizujPlanSplat() {
  const zobowiazaniaRows = document.querySelectorAll("#zobowiazania-table tbody tr");
  const planBody = document.querySelector("#tabela-splat tbody");
  planBody.innerHTML = "";
  const symbol = getCurrencySymbol();
  const dane = Array.from(zobowiazaniaRows).map((row, index) => {
    const komorki = row.querySelectorAll("input");
    const nazwa = komorki[0]?.value || "";
    const kwota = parseFloat(komorki[2]?.value || 0);
    return { nazwa, kwota, index };
  }).filter(item => item.nazwa && item.kwota > 0);
  dane.sort((a, b) => a.kwota - b.kwota);
  let suma = 0;
  dane.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nazwa}</td>
      <td><span>${item.kwota.toFixed(2)}</span> ${symbol}</td>
      <td>
        <input type="number" min="0" placeholder="Nadpłata" id="nadplata-${item.index}" />
        <button onclick="zatwierdzNadplate(${item.index})">Zatwierdź</button>
      </td>
    `;
    planBody.appendChild(tr);
    suma += item.kwota;
  });
  document.getElementById("suma-splat").textContent = suma.toFixed(2) + " " + symbol;
}
function zatwierdzNadplate(index) {
  const nadplataInput = document.getElementById(`nadplata-${index}`);
  const nadplata = parseFloat(nadplataInput.value || 0);
  if (nadplata <= 0) return;
  const zobowiazaniaRows = document.querySelectorAll("#zobowiazania-table tbody tr");
  const row = zobowiazaniaRows[index];
  const kwotaInput = row.querySelectorAll("input")[2];
  const aktualnaKwota = parseFloat(kwotaInput.value || 0);
  const nowaKwota = Math.max(0, aktualnaKwota - nadplata);
  kwotaInput.value = nowaKwota;
  nadplataInput.value = "";
  zapiszDane();
}
// Analiza porównania wydatków
function aktualizujAnalizeWydatkow() {
  const planowane = {};
  const zrealizowane = {};
  const symbol = getCurrencySymbol();
  document.querySelectorAll("#wydatki-planowane-table tbody tr").forEach(row => {
    const kategoria = row.children[0]?.querySelector("input")?.value || "";
    const kwota = parseFloat(row.children[1]?.querySelector("input")?.value || 0);
    if (kategoria) planowane[kategoria] = (planowane[kategoria] || 0) + kwota;
  });
  document.querySelectorAll("#wydatki-zrealizowane-table tbody tr").forEach(row => {
    const kategoria = row.children[1]?.querySelector("select")?.value || "";
    const kwota = parseFloat(row.children[2]?.querySelector("input")?.value || 0);
    if (kategoria) zrealizowane[kategoria] = (zrealizowane[kategoria] || 0) + kwota;
  });
  const allCategories = new Set([...Object.keys(planowane), ...Object.keys(zrealizowane)]);
  const tbody = document.querySelector("#analiza-wydatkow-table tbody");
  tbody.innerHTML = "";
  allCategories.forEach(kategoria => {
    const plan = planowane[kategoria] || 0;
    const real = zrealizowane[kategoria] || 0;
    const roznica = plan - real;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${kategoria}</td>
      <td>${plan.toFixed(2)} ${symbol}</td>
      <td>${real.toFixed(2)} ${symbol}</td>
      <td>${roznica.toFixed(2)} ${symbol}</td>
    `;
    tbody.appendChild(row);
  });
}
// Zapis i ładowanie danych z obsługą danych stałych
function zapiszDane() {
  const dane = {
    majatek: zbierzDane("majatek-table"),
    zobowiazania: zbierzDane("zobowiazania-table"),
    przychody: zbierzDane("przychody-table"),
    wydatkiPlanowane: zbierzDane("wydatki-planowane-table"),
    wydatkiZrealizowane: zbierzDane("wydatki-zrealizowane-table"),
    planowane: zbierzDane("wydatki-planowane-table"),
    zrealizowane: zbierzDane("wydatki-zrealizowane-table"),
    fundusz: {
      cel: document.getElementById("fundusz-cel")?.value || "",
      obecnie: document.getElementById("fundusz-obecnie")?.value || ""
    },
    poduszka: {
      miesiace: document.getElementById("poduszka-miesiace")?.value || "3",
      obecnie: document.getElementById("poduszka-obecnie")?.value || ""
    },
    stale: {
      przychody: filtrujStale(zbierzDane("przychody-table")),
      planowane: filtrujStale(zbierzDane("wydatki-planowane-table")),
    }
  };
  localStorage.setItem("finanse", JSON.stringify(dane));
  obliczWartoscNetto();
  aktualizujPasekFundusz();
  aktualizujPoduszke();
  aktualizujPlanSplat();
  aktualizujAnalizeWydatkow();
}
function zbierzDane(id) {
  const rows = document.querySelectorAll(`#${id} tbody tr`);
  return Array.from(rows).map(row => {
    // Pobierz wszystkie inputy i selecty w wierszu
    return Array.from(row.querySelectorAll("input, select")).map(el => {
      if (el.type === "checkbox") {
        return el.checked;
      } else {
        return el.value;
      }
    });
  });
}

function filtrujStale(dane) {
  return dane.filter(wiersz => wiersz.includes(true)); // ostatni element == checkbox
}
function wczytajDane(id, dane) {
  if (!dane) return;
  const table = document.getElementById(id);
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  dane.forEach(wiersz => {
    const cols = wiersz.map((val, index) => {
      if (typeof val === "boolean") {
        return { type: "checkbox", placeholder: "", value: val };
      } else if (typeof val === "string" && /^\d+(\.\d+)?$/.test(val)) {
        return { type: "number", placeholder: "", value: val };
      } else if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        return { type: "date", placeholder: "", value: val };
      } else {
        // 🔧 KLUCZOWY WARUNEK: jeśli to kategoria w wydatkach zrealizowanych – użyj select
        if (id === "wydatki-zrealizowane-table" && index === 1) {
          return { type: "select", placeholder: "", value: val };
        }
        return { type: "text", placeholder: "", value: val };
      }
    });
    addRow(id, cols);
  });

  // Po dodaniu wierszy do wydatków zrealizowanych — odśwież selecty
  if (id === "wydatki-zrealizowane-table") {
    aktualizujKategorieZrealizowane();
    aktualizujAnalizeWydatkow();
  }
}
function zaladujDane() {
  const dane = JSON.parse(localStorage.getItem("finanse"));
  if (!dane) return;
  wczytajDane("majatek-table", dane.majatek);
  wczytajDane("zobowiazania-table", dane.zobowiazania);
  wczytajDane("przychody-table", dane.przychody);
  wczytajDane("wydatki-planowane-table", dane.wydatkiPlanowane);
  wczytajDane("wydatki-zrealizowane-table", dane.wydatkiZrealizowane);

  if (dane.fundusz) {
    document.getElementById("fundusz-cel").value = dane.fundusz.cel;
    document.getElementById("fundusz-obecnie").value = dane.fundusz.obecnie;
  }
  if (dane.poduszka) {
    document.getElementById("poduszka-miesiace").value = dane.poduszka.miesiace;
    document.getElementById("poduszka-obecnie").value = dane.poduszka.obecnie;
  }

  obliczWartoscNetto();
  aktualizujPasekFundusz();
  aktualizujPoduszke();
  aktualizujPlanSplat();

  // Nie dodawaj już tu aktualizacji kategorii ani analizy!
}
// Obsługa mobilna – zamykanie menu po kliknięciu
document.querySelectorAll("#menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      document.getElementById("menu").classList.add("hidden");
    }
  });
});
// Przewijanie poziome tabel na małych ekranach
function enableHorizontalScrollOnTables() {
  document.querySelectorAll("table").forEach(table => {
    const wrapper = document.createElement("div");
    wrapper.style.overflowX = "auto";
    wrapper.style.width = "100%";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}
// --- Tryb ciemny ---
// Pobierz checkbox z HTML
const darkModeToggle = document.getElementById("darkModeToggle");
function applyDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add("dark-mode");
    document.querySelector(".app-container")?.classList.add("dark-mode");
    document.querySelector(".container")?.classList.add("dark-mode");
    document.getElementById("menu")?.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
    document.querySelector(".app-container")?.classList.remove("dark-mode");
    document.querySelector(".container")?.classList.remove("dark-mode");
    document.getElementById("menu")?.classList.remove("dark-mode");
  }
  localStorage.setItem("darkModeEnabled", enabled);
}
function loadDarkMode() {
  const saved = localStorage.getItem("darkModeEnabled");
  const enabled = saved === "true";
  applyDarkMode(enabled);
  if (darkModeToggle) darkModeToggle.checked = enabled;
}
if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    applyDarkMode(darkModeToggle.checked);
  });
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker zarejestrowany:', registration.scope);
      })
      .catch(error => {
        console.error('❌ Błąd rejestracji Service Workera:', error);
      });
  });
}
// --- Waluta: obsługa wyboru i zapisu ---
const currencySelector = document.getElementById("currencySelector");
// Ustawienie domyślnej waluty lub odczyt z localStorage
function loadCurrency() {
  const savedCurrency = localStorage.getItem("selectedCurrency") || "zł";
  currencySelector.value = savedCurrency;
  updateCurrencySymbols(savedCurrency);
}
// Obsługa zmiany waluty
currencySelector.addEventListener("change", () => {
  const selectedCurrency = currencySelector.value;
  localStorage.setItem("selectedCurrency", selectedCurrency);
  updateCurrencySymbols(selectedCurrency);
  // Przelicz wartości, żeby się odświeżyły z nową walutą
  obliczWartoscNetto();
  aktualizujPlanSplat();
  aktualizujAnalizeWydatkow();
});
// Funkcja aktualizująca symbole walut w całej aplikacji
function updateCurrencySymbols(symbol) {
  const currencySpans = document.querySelectorAll(".currency-symbol");
  currencySpans.forEach(span => {
    span.textContent = symbol;
  });
}
// Uruchomienie przy starcie
loadCurrency();
// === Zarządzanie budżetem miesięcznym ===
// Zapisz wybrany dzień rozpoczęcia budżetu
function zapiszDzienBudzetu() {
  const dzien = parseInt(document.getElementById('budzet-start-day').value, 10);
  if (dzien >= 1 && dzien <= 31) {
    localStorage.setItem('budzetStartDay', dzien);
    aktualizujListeBudzetowychMiesiecy();
  }
}
// Załaduj dzień rozpoczęcia przy starcie
function zaladujDzienBudzetu() {
  const zapisany = localStorage.getItem('budzetStartDay');
  if (zapisany) {
    document.getElementById('budzet-start-day').value = zapisany;
  }
}
// Wygeneruj listę miesięcy do wyboru (np. czerwiec 2025, maj 2025...)
function aktualizujListeBudzetowychMiesiecy() {
  const select = document.getElementById('budzet-miesiac-wybor');
  select.innerHTML = '';
  const teraz = new Date();
  const miesiace = [];
  for (let i = 0; i < 12; i++) {
    const data = new Date(teraz.getFullYear(), teraz.getMonth() - i, 1);
    const miesiacNazwa = data.toLocaleString('pl-PL', { month: 'long' });
    const rok = data.getFullYear();
    const klucz = `${rok}-${String(data.getMonth() + 1).padStart(2, '0')}`; // np. 2025-06
    const opcja = document.createElement('option');
    opcja.value = klucz;
    opcja.textContent = `${miesiacNazwa} ${rok}`;
    select.appendChild(opcja);
  }
}
// Obsłuż zmianę wybranego miesiąca budżetu
function zmienMiesiacBudzetu() {
  const wybranyMiesiac = document.getElementById('budzet-miesiac-wybor').value;
  // Później tu dodamy: załadujBudzetDlaMiesiaca(wybranyMiesiac);
  console.log('Wybrano budżet dla:', wybranyMiesiac);
}
function skopiujStaleDane(tableId) {
  const table = document.querySelector(`#${tableId} tbody`);
  const rows = table.querySelectorAll("tr");
    rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    const dane = Array.from(inputs).map(i => i.type === "checkbox" ? i.checked : i.value);
    if (inputs.length >= 4 && dane[dane.length - 1] === true) {
      const noweDane = [...dane];
      // wyczyść pole daty
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "date") {
          noweDane[i] = "";
        }
      }
      const kolumny = noweDane.map(val => {
        if (typeof val === "boolean") {
          return { type: "checkbox", placeholder: "", value: val };
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          return { type: "date", placeholder: "", value: val };
        } else if (/^\d+(\.\d+)?$/.test(val)) {
          return { type: "number", placeholder: "", value: val };
        } else {
          return { type: "text", placeholder: "", value: val };
        }
      });
      addRow(tableId, kolumny);
    }
  });
}
function sprawdzNowyMiesiac() {
  const teraz = new Date();
  const dzienStartuBudzetu = 10; // tutaj ustaw swój dzień rozpoczęcia budżetu
  const dzisiaj = teraz.getDate();
  // Pobierz z localStorage ostatnią datę zapisanego budżetu
  let ostatniStartBudzetu = localStorage.getItem("ostatniStartBudzetu");
  if (ostatniStartBudzetu) {
    ostatniStartBudzetu = new Date(ostatniStartBudzetu);
  } else {
    // jeśli brak, ustaw na dzisiaj minus miesiąc (za pierwszym razem)
    ostatniStartBudzetu = new Date(teraz.getFullYear(), teraz.getMonth() - 1, dzienStartuBudzetu);
    localStorage.setItem("ostatniStartBudzetu", ostatniStartBudzetu.toISOString());
  }
  // Czy dziś jest dzień startu nowego budżetu i minął już poprzedni?
  if (dzisiaj === dzienStartuBudzetu && teraz > ostatniStartBudzetu) {
    // Zapisz aktualny budżet do historii
    zapiszDoHistorii();
      // Ustaw nową datę startu budżetu w localStorage
    const nowyStart = new Date(teraz.getFullYear(), teraz.getMonth(), dzienStartuBudzetu);
    localStorage.setItem("ostatniStartBudzetu", nowyStart.toISOString());
  // Załaduj dane stałe i wstaw je do nowego budżetu
    dodajStaleDoNowegoBudzetu();
    alert("Rozpoczęto nowy budżet miesięczny, dane stałe zostały dodane automatycznie.");
  }
}
// Funkcja zapisująca obecny budżet do historii (archiwum)
function zapiszDoHistorii() {
  const dane = JSON.parse(localStorage.getItem("finanse")) || {};
  const historia = JSON.parse(localStorage.getItem("historiaBudzetow")) || [];
  // Dodaj aktualny budżet do historii z datą
  const zapis = {
    data: new Date().toISOString(),
    budzet: dane
  };
  historia.push(zapis);
  // Zapisz z powrotem
  localStorage.setItem("historiaBudzetow", JSON.stringify(historia));
}
// Funkcja dodająca dane stałe do nowego budżetu
function dodajStaleDoNowegoBudzetu() {
  const dane = JSON.parse(localStorage.getItem("finanse")) || {};
  const przesunDateOMiesiac = (dataStr) => {
    const [rok, miesiac, dzien] = dataStr.split("-").map(Number);
    const nowaData = new Date(rok, miesiac, dzien); // automatycznie obsłuży overflow np. z 31.01 → 02.03
    return nowaData.toISOString().slice(0, 10); // YYYY-MM-DD
  };
  const kopiujZPrzesunieciem = (wiersze) => {
    return wiersze
      .filter(row => row[3] === true) // tylko stałe
      .map(row => {
        return [
          row[0],                    // nazwa
          row[1],                    // kwota
          przesunDateOMiesiac(row[2]), // data +1 miesiąc
          row[3]                     // checkbox (true)
        ];
      });
  };
  // Skopiuj dane
  const nowePrzychody = kopiujZPrzesunieciem(dane.przychody || []);
  const nowePlanowane = kopiujZPrzesunieciem(dane.wydatkiPlanowane || []);
  // Dołącz je do istniejących danych (jeśli chcesz je nadpisać, zamień na =)
  dane.przychody = [...(dane.przychody || []), ...nowePrzychody];
  dane.wydatkiPlanowane = [...(dane.wydatkiPlanowane || []), ...nowePlanowane];
  localStorage.setItem("finanse", JSON.stringify(dane));
  zaladujDane();
}
function pokazDateSystemowa() {
  const dzisiaj = new Date();
  console.log("Data systemowa to:", dzisiaj.toISOString().slice(0, 10)); // YYYY-MM-DD
}
pokazDateSystemowa(); // Uruchamia się automatycznie
function zaladujBudzetZHistorii(miesiacKey) {
  const btnWroc = document.getElementById("btnWroc");
  const historia = JSON.parse(localStorage.getItem("historiaBudzetow")) || [];
    const pasujacyBudzet = historia.find(entry => {
    const data = new Date(entry.data);
    const klucz = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    return klucz === miesiacKey;
  });
  if (!pasujacyBudzet) {
    alert("Brak danych historycznych dla wybranego miesiąca.");
    return;
  }
btnWroc.style.display = "inline-block";
  // Wczytaj dane budżetu historycznego
  const dane = pasujacyBudzet.budzet;
  wczytajDane("majatek-table", dane.majatek);
  wczytajDane("zobowiazania-table", dane.zobowiazania);
  wczytajDane("przychody-table", dane.przychody);
  wczytajDane("wydatki-planowane-table", dane.wydatkiPlanowane);
  wczytajDane("wydatki-zrealizowane-table", dane.wydatkiZrealizowane);
  // Zablokuj edytowanie danych (tryb podglądu)
  zablokujEdycje();
  obliczWartoscNetto();
  aktualizujPasekFundusz();
  aktualizujPoduszke();
  aktualizujPlanSplat();
  aktualizujAnalizeWydatkow();
}
function zablokujEdycje() {
  document.querySelectorAll("input").forEach(input => {
    input.disabled = true;
  });
  document.querySelectorAll("button").forEach(button => {
    if (button.textContent === "Usuń" || button.textContent === "Zatwierdź") {
      button.disabled = true;
    }
  });
}
function powrotDoAktualnegoBudzetu() {
  const btnWroc = document.getElementById("btnWroc");
  btnWroc.style.display = "none"; // ukryj przycisk powrotu
  odblokujEdycje();
  zaladujDane();
}
function wczytajBudzetHistoryczny() {
  const miesiacKey = document.getElementById("budzet-miesiac-wybor").value;
  zaladujBudzetZHistorii(miesiacKey);
}
function zapiszZmianyWBudzecieHistorycznym() {
  const checkbox = document.getElementById("toggleEditHistory");
if (checkbox && !checkbox.checked) {
  alert("Najpierw włącz tryb edycji.");
  return;
}
  const miesiacKey = document.getElementById("budzet-miesiac-wybor").value;
  const historia = JSON.parse(localStorage.getItem("historiaBudzetow")) || [];
  const index = historia.findIndex(entry => {
    const data = new Date(entry.data);
    const klucz = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    return klucz === miesiacKey;
  });
  if (index === -1) {
    alert("Nie znaleziono budżetu do zapisania.");
    return;
  }
  const noweDane = {
    majatek: zbierzDane("majatek-table"),
    zobowiazania: zbierzDane("zobowiazania-table"),
    przychody: zbierzDane("przychody-table"),
    wydatkiPlanowane: zbierzDane("wydatki-planowane-table"),
    wydatkiZrealizowane: zbierzDane("wydatki-zrealizowane-table"),
    fundusz: {
      cel: document.getElementById("fundusz-cel")?.value || "",
      obecnie: document.getElementById("fundusz-obecnie")?.value || ""
    },
    poduszka: {
      miesiace: document.getElementById("poduszka-miesiace")?.value || "3",
      obecnie: document.getElementById("poduszka-obecnie")?.value || ""
    }
  };
  historia[index].budzet = noweDane;
  localStorage.setItem("historiaBudzetow", JSON.stringify(historia));
  alert("Zapisano zmiany w budżecie historycznym.");
}
const btnWroc = document.getElementById("btn-wroc-do-aktualnego");
btnWroc.addEventListener("click", () => {
  // Odblokuj edycję
  odblokujEdycje();
  // Załaduj aktualne dane (z localStorage)
  zaladujDane();
  // Ukryj przycisk powrotu
  btnWroc.style.display = "none";
  alert("Powrócono do aktualnego budżetu, możesz dalej edytować dane.");
});
function odblokujEdycje() {
  document.querySelectorAll("input").forEach(input => {
    input.disabled = false;
  });
  document.querySelectorAll("button").forEach(button => {
    if (button.textContent === "Usuń" || button.textContent === "Zatwierdź") {
      button.disabled = false;
    }
  });
}
function init() {
  enableHorizontalScrollOnTables();
  zaladujDane();
  ukryjWszystkieSekcje();
  showSection("strona-glowna");
  updateCurrencySymbols(getCurrencySymbol());
  loadDarkMode();
  sprawdzNowyMiesiac();
  const toggleEdit = document.getElementById("toggleEditHistory");
  if (toggleEdit) {
    toggleEdit.addEventListener("change", () => {
      if (toggleEdit.checked) {
        odblokujEdycje();
      } else {
        zablokujEdycje();
      }
    });
  }
  zaladujDzienBudzetu();
  aktualizujListeBudzetowychMiesiecy();
  const wybor = document.getElementById('budzet-miesiac-wybor');
  const zapisanyMiesiac = localStorage.getItem('wybranyBudzetMiesiac');
  if (wybor && zapisanyMiesiac) {
    const opcjaIstnieje = Array.from(wybor.options).some(opt => opt.value === zapisanyMiesiac);
    if (opcjaIstnieje) {
      wybor.value = zapisanyMiesiac;
    }
  }
  if (wybor) {
    wybor.addEventListener('change', () => {
      const wybrany = wybor.value;
      localStorage.setItem('wybranyBudzetMiesiac', wybrany);
      console.log('Zapisano miesiąc budżetu:', wybrany);
    });
  }
}
window.addEventListener("load", init);
function toggleForm() {
  const form = document.getElementById("formularz-celu");
  form.classList.toggle("hidden");
}
function dodajCel() {
  const nazwa = document.getElementById("cel-nazwa").value.trim();
  const kwotaObecna = parseFloat(document.getElementById("cel-kwota-obecna").value);
  const kwotaDocelowa = parseFloat(document.getElementById("cel-kwota-docelowa").value);
  const termin = document.getElementById("cel-termin").value;
  const priorytet = document.getElementById("cel-priorytet").value;
  if (!nazwa || isNaN(kwotaObecna) || isNaN(kwotaDocelowa) || kwotaDocelowa === 0) {
    alert("Uzupełnij wszystkie pola i podaj poprawne kwoty.");
    return;
  }
  const cel = {
    nazwa,
    kwotaObecna,
    kwotaDocelowa,
    termin,
    priorytet
  };
  // Pobierz dotychczasowe cele, dodaj nowy i zapisz
  const cele = JSON.parse(localStorage.getItem("cele-finansowe")) || [];
  cele.push(cel);
  localStorage.setItem("cele-finansowe", JSON.stringify(cele));
  wyswietlCele();
  // Resetuj formularz
  document.getElementById("cel-nazwa").value = "";
  document.getElementById("cel-kwota-obecna").value = "";
  document.getElementById("cel-kwota-docelowa").value = "";
  document.getElementById("cel-termin").value = "";
  document.getElementById("cel-priorytet").value = "sredni";
  document.getElementById("formularz-celu").classList.add("hidden");
}
function wyswietlCele() {
  const cele = JSON.parse(localStorage.getItem("cele-finansowe")) || [];
  const tbody = document.querySelector("#celeTable tbody");
  tbody.innerHTML = "";
  cele.forEach((cel, index) => {
    const procent = Math.min(100, Math.round((cel.kwotaObecna / cel.kwotaDocelowa) * 100));
    const tr = document.createElement("tr");
    tr.classList.add(`priorytet-${cel.priorytet}`);
    tr.innerHTML = `
      <td>${cel.nazwa}</td>
      <td>${cel.kwotaObecna} / ${cel.kwotaDocelowa} <span class="currency-symbol">zł</span></td>
      <td>${cel.termin || "-"}</td>
      <td>
        <div class="pasek-postepu">
          <div class="postep" style="width: ${procent}%"></div>
        </div>
      </td>
      <td>
        <button onclick="edytujCel(${index})">✏️</button>
        <button onclick="usunCel(${index})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  wyswietlCele();
});
function edytujCel(index) {
  const cele = JSON.parse(localStorage.getItem("cele-finansowe")) || [];
  const cel = cele[index];
  // Wypełnij formularz danymi
  document.getElementById("cel-nazwa").value = cel.nazwa;
  document.getElementById("cel-kwota-obecna").value = cel.kwotaObecna;
  document.getElementById("cel-kwota-docelowa").value = cel.kwotaDocelowa;
  document.getElementById("cel-termin").value = cel.termin;
  document.getElementById("cel-priorytet").value = cel.priorytet;
  // Ustaw tryb edycji
  document.getElementById("formularz-celu").classList.remove("hidden");
  document.getElementById("dodajCelBtnGlowne").classList.add("hidden");
  document.getElementById("zapiszZmianyBtn").classList.remove("hidden");
  // Zapamiętaj, który indeks edytujemy
  document.getElementById("formularz-celu").dataset.edytowanyIndex = index;
}
function zapiszZmianyCelu() {
  const index = parseInt(document.getElementById("formularz-celu").dataset.edytowanyIndex, 10);
  const cele = JSON.parse(localStorage.getItem("cele-finansowe")) || [];
  const nazwa = document.getElementById("cel-nazwa").value.trim();
  const kwotaObecna = parseFloat(document.getElementById("cel-kwota-obecna").value);
  const kwotaDocelowa = parseFloat(document.getElementById("cel-kwota-docelowa").value);
  const termin = document.getElementById("cel-termin").value;
  const priorytet = document.getElementById("cel-priorytet").value;
  if (!nazwa || isNaN(kwotaObecna) || isNaN(kwotaDocelowa) || kwotaDocelowa === 0) {
    alert("Uzupełnij wszystkie pola i podaj poprawne kwoty.");
    return;
  }
  cele[index] = { nazwa, kwotaObecna, kwotaDocelowa, termin, priorytet };
  localStorage.setItem("cele-finansowe", JSON.stringify(cele));
  wyswietlCele();
  // Reset
  document.getElementById("cel-nazwa").value = "";
  document.getElementById("cel-kwota-obecna").value = "";
  document.getElementById("cel-kwota-docelowa").value = "";
  document.getElementById("cel-termin").value = "";
  document.getElementById("cel-priorytet").value = "sredni";
  document.getElementById("formularz-celu").classList.add("hidden");
  document.getElementById("dodajCelBtnGlowne").classList.remove("hidden");
  document.getElementById("zapiszZmianyBtn").classList.add("hidden");
}
function usunCel(index) {
  if (!confirm("Czy na pewno chcesz usunąć ten cel?")) return;
  const cele = JSON.parse(localStorage.getItem("cele-finansowe")) || [];
  cele.splice(index, 1);
  localStorage.setItem("cele-finansowe", JSON.stringify(cele));
  wyswietlCele();
}
let notatki = [];
// Wczytaj notatki z localStorage po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("notatkiLista");
  if (saved) {
    notatki = JSON.parse(saved);
    renderujNotatki();
  }
});
// Dodaj nową notatkę
document.getElementById("dodajNotatkeBtn").addEventListener("click", () => {
  const tekst = document.getElementById("nowa-notatka").value.trim();
  if (!tekst) return;
  const nowa = {
    id: Date.now(),
    tekst,
    data: new Date().toLocaleString("pl-PL")
  };
  notatki.unshift(nowa); // dodaj na początek
  zapiszNotatki();
  renderujNotatki();
  document.getElementById("nowa-notatka").value = "";
});
// Zapisz notatki do localStorage
function zapiszNotatki() {
  localStorage.setItem("notatkiLista", JSON.stringify(notatki));
}
// Renderuj wszystkie notatki
function renderujNotatki() {
  const lista = document.getElementById("lista-notatek");
  lista.innerHTML = "";
  notatki.forEach((n, index) => {
    const div = document.createElement("div");
    div.classList.add("notatka");

    const textarea = document.createElement("textarea");
    textarea.value = n.tekst;
    textarea.rows = 5;
    textarea.addEventListener("change", () => {
      notatki[index].tekst = textarea.value;
      zapiszNotatki();
    });

    const data = document.createElement("small");
    data.textContent = `Dodano: ${n.data}`;

    // Nowy przycisk usuwania
    const usunBtn = document.createElement("button");
    usunBtn.textContent = "🗑️ Usuń";
    usunBtn.style.marginLeft = "10px";
    usunBtn.addEventListener("click", () => {
      // Usuwanie notatki o indeksie index
      notatki.splice(index, 1);
      zapiszNotatki();
      renderujNotatki();
    });

    div.appendChild(textarea);
    div.appendChild(data);
    div.appendChild(usunBtn);

    lista.appendChild(div);
  });
}