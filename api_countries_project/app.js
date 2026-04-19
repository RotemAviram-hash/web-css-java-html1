const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

let countries = []; // מערך אובייקטי מדינות לאחר סידור
/**
 * יוצר קשר עם API מדינות
 * מסדר את מה שמייבאים מהסוכן
 */
async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,population,region",
    );
    const data = await res.json();
    countries = data.map((contry) => ({
      name: contry.name?.common || "-",
      capital: contry.capital?.[0] || "-",
      currency: contry.currencies
        ? Object.values(contry.currencies)[0]?.name || "-"
        : "-",
      currencySymbol: contry.currencies
        ? Object.values(contry.currencies)[0]?.symbol || ""
        : "",
      flag: contry.flags?.png || "",
      population: contry.population || "-",
      region: contry.region || "-",
    }));
    renderCards(countries);
  } catch (err) {
    console.error(err);
    cardsContainer.innerHTML = "<p>Failed to load countries.</p>";
  }
}
/**
 * הדפסה של כל המדינות שמקבל על המסך
 * @param {*} _list רשימה של המדינות
 */
function renderCards(_list) {
  cardsContainer.innerHTML = ""; //איפוס לפני כל הדפסה שלא יהיו כפילןיות
  _list.forEach((contry) => {
    const card = document.createElement("div");
    card.className = `country-card`;
    card.innerHTML = `
      <img src="${contry.flag}" alt="${contry.name}">
      <h3>${highlightText(contry.name)}</h3>
      <p>Capital: ${highlightText(contry.capital)}</p>
      <p>Currency: ${contry.currency} ${contry.currencySymbol}</p>
    `;

    //======= מראה תיאור של הכרטיס לאחר לחיצה על מדינה ==========//
    card.addEventListener("click", () => {
      modalText.innerHTML = `<h2>${contry.name}</h2>
        <p>Capital: ${contry.capital}</p>
        <p>Currency: ${contry.currency} ${contry.currencySymbol}</p>
        <p>Population: ${contry.population.toLocaleString()}</p>
        <p>Region: ${contry.region}</p>`;
      modal.classList.add("show");
    });
    cardsContainer.appendChild(card);
  });
}

/**
 * Highlight חיפוש
 * @param {*} _text הטקסט שמחפשים
 * @returns
 */
function highlightText(_text) {
  const query = searchInput.value.trim();
  if (!query) return _text;
  const regex = new RegExp(`(${query})`, "gi");
  return _text.replace(regex, "<mark>$1</mark>");
}

// חיפוש בזמן אמת
searchInput.addEventListener("input", () => {
  // מבצע סינון על פי שם המדינה או עיר הבירה שלה - פילטר
  const query = searchInput.value.toLowerCase();
  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.capital.toLowerCase().includes(query),
  );
  renderCards(filtered); // שולח את הקובץ המעודכן להדספה על המסך
});

// סגירת modal ב-click על כפתור או הרקע
closeModal.addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

getCountries();
