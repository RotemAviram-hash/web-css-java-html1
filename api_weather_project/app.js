const majorIsraelCities = {
  // צפון
  חיפה: { lat: 32.794, lon: 34.9896 },
  עכו: { lat: 32.921, lon: 35.078 },
  טבריה: { lat: 32.7922, lon: 35.5312 },
  נהריה: { lat: 33.0059, lon: 35.0934 },
  עפולה: { lat: 32.6074, lon: 35.2892 },
  כרמיאל: { lat: 32.9199, lon: 35.2901 },
  צפת: { lat: 32.9646, lon: 35.496 },
  "קרית שמונה": { lat: 33.2073, lon: 35.5694 },

  // מרכז ושרון
  "תל אביב-יפו": { lat: 32.0853, lon: 34.7818 },
  נתניה: { lat: 32.3215, lon: 34.8532 },
  הרצליה: { lat: 32.1624, lon: 34.8446 },
  "רמת גן": { lat: 32.0684, lon: 34.8248 },
  "פתח תקווה": { lat: 32.0841, lon: 34.8878 },
  "ראשון לציון": { lat: 31.973, lon: 34.7925 },
  חולון: { lat: 32.0158, lon: 34.7874 },
  "בת ים": { lat: 32.0171, lon: 34.7455 },
  רחובות: { lat: 31.8928, lon: 34.8113 },
  מודיעין: { lat: 31.8997, lon: 35.0074 },

  // ירושלים והסביבה
  ירושלים: { lat: 31.7683, lon: 35.2137 },
  "בית שמש": { lat: 31.747, lon: 34.9881 },

  // דרום
  אשדוד: { lat: 31.8044, lon: 34.6559 },
  אשקלון: { lat: 31.6688, lon: 34.5743 },
  "באר שבע": { lat: 31.252, lon: 34.7913 },
  אילת: { lat: 29.5577, lon: 34.9519 },
  דימונה: { lat: 31.0691, lon: 35.0341 },
  שדרות: { lat: 31.5247, lon: 34.5954 },
  "כללי ישראל": { lat: 31.5, lon: 34, zoom: 7 },
};

const southWest = L.latLng(29.4, 34.2); // אזור אילת
const northEast = L.latLng(33.5, 35.9); // אזור החרמון
const bounds = L.latLngBounds(southWest, northEast);

let currentMarker;

//יצירה של המפה
const myMap = L.map("map-container", {
  maxBounds: bounds,
  maxBoundsViscosity: 0,
  minZoom: 1.4,
}).setView([31.5, 34.75], 7);

// חיבור המפה למקור נתונים גרפי (OpenStreetMap) והצגתה למשתמש
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(myMap);

// הפונקציה הזו תרוץ בכל פעם שמישהו לוחץ על המפה
myMap.on("click", function (event) {
  let lat = event.latlng.lat;
  let lon = event.latlng.lng;
  console.log(`לחצת על: Lat ${lat}, Lon ${lon}`);

  if (currentMarker) {
    myMap.removeLayer(currentMarker);
  }

  currentMarker = L.marker([lat, lon]).addTo(myMap);

  fetchWeather(lat, lon);
});

createMajorCitiesOnScreen(majorIsraelCities); //הצג הצדדי של הערים המרכזיות

/**
 * מקבל קורדינטות של מקומות ומייצר אוייקט מזג האוויר לאותו מקום
 * @param {*} _lat קו הרוחב
 * @param {*} _lon קו האורך
 */
async function fetchWeather(_lat, _lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${_lat}&longitude=${_lon}&current=temperature_2m,weather_code`;
  const res = await fetch(url);
  const data = await res.json();
  const weatherCode = data.current.weather_code;

  const weather = {
    temperature: data.current.temperature_2m,
    temperatureUnits: data.current_units.temperature_2m,
    icon: getWeatherIcone(weatherCode),
    description: getWeatherDescription(weatherCode),
  };

  editWeather(weather);
}

/**
 * משנה את הטקסט מזג האוויר המוצג על המסך למשתמש
 * @param {*} _weather אובייקט מזג האוויר
 */
function editWeather(_weather) {
  const p = document.getElementById("wether-msg");
  p.innerText = `מזג האוויר במיקום שבחרת הוא: ${_weather.temperature}${_weather.temperatureUnits} ${_weather.description}${_weather.icon}`;
}

/**
 * מביא את האייקון למזג האוויר
 * @param {*} _weatherCode קוד מזג האוויר על פי API
 * @returns האייקון שמתאים לקוד שהתקבל
 */
function getWeatherIcone(_weatherCode) {
  switch (_weatherCode) {
    case 0:
      return "☀️"; // שמיים בהירים
    case 1:
      return "🌤️"; // בהיר ברובו
    case 2:
      return "⛅"; // מעונן חלקית
    case 3:
      return "☁️"; // מעונן
    case 45:
    case 48:
      return "🌫️"; // ערפל / ערפל קופא
    case 51:
      return "🌦️"; // טפטוף קל
    case 53:
      return "🌧️"; // טפטוף בינוני
    case 55:
      return "🌧️🌧️"; // טפטוף חזק
    case 56:
    case 57:
      return "🌨️🧊"; // טפטוף קופא
    case 61:
      return "🌦️"; // גשם קל
    case 63:
      return "🌧️"; // גשם בינוני
    case 65:
      return "🌧️⛈️"; // גשם כבד
    case 66:
    case 67:
      return "🧊🌧️"; // גשם קופא
    case 71:
      return "🌨️"; // שלג קל
    case 73:
      return "❄️"; // שלג בינוני
    case 75:
      return "🏔️"; // שלג כבד
    case 77:
      return "❄️✨"; // פתיתי שלג
    case 80:
      return "🌦️"; // ממטרי גשם קלים
    case 81:
      return "🌧️"; // ממטרי גשם בינוניים
    case 82:
      return "🌊🌧️"; // ממטרי גשם עזים
    case 85:
      return "🌨️"; // ממטרי שלג קלים
    case 86:
      return "❄️🌨️"; // ממטרי שלג כבדים
    case 95:
      return "⛈️"; // סופת רעמים
    case 96:
      return "⛈️🌨️"; // סופת רעמים עם ברד קל
    case 99:
      return "⛈️🌩️"; // סופת רעמים עם ברד כבד
    default:
      return "😵‍💫"; // לכל קוד אחר שלא מופיע בטבלה
  }
}

/**
 * מביא את הטקסט למזג האוויר
 * @param {*} _weatherCode קוד מזג האוויר על פי API
 * @returns הטקסט שמתאים לקוד שהתקבל
 */
function getWeatherDescription(_weatherCode) {
  switch (_weatherCode) {
    case 0:
      return "שמיים בהירים";
    case 1:
      return "בהיר ברובו";
    case 2:
      return "מעונן חלקית";
    case 3:
      return "מעונן";
    case 45:
    case 48:
      return "ערפל";
    case 51:
      return "טפטוף קל";
    case 53:
      return "טפטוף בינוני";
    case 55:
      return "טפטוף חזק";
    case 56:
    case 57:
      return "טפטוף קופא";
    case 61:
      return "גשם קל";
    case 63:
      return "גשם בינוני";
    case 65:
      return "גשם כבד";
    case 66:
    case 67:
      return "גשם קופא";
    case 71:
      return "שלג קל";
    case 73:
      return "שלג בינוני";
    case 75:
      return "שלג כבד";
    case 77:
      return "ממטרי שלג קלים";
    case 80:
      return "ממטרי גשם קלים";
    case 81:
      return "ממטרי גשם בינוניים";
    case 82:
      return "ממטרי גשם עזים";
    case 85:
      return "ממטרי שלג קלים";
    case 86:
      return "ממטרי שלג כבדים";
    case 95:
      return "סופת רעמים";
    case 96:
      return "סופת רעמים עם ברד קל";
    case 99:
      return "סופת רעמים עם ברד כבד";
    default:
      return "אופס, נתקלנו בשגיאה. נסו שוב מאוחר יותר";
  }
}

/**
 * מדפיס על המסך את הערים ממרכזיות
 */
function createMajorCitiesOnScreen(_majorCities) {
  const MajorCities = document.getElementById("major-cities");
  Object.entries(_majorCities).forEach(([cityName, cityData]) => {
    const card = document.createElement("div");
    const button = document.createElement("button");
    card.className = `major-cities-card`;
    button.className = `major-cities-button`;

    button.innerText = cityName;

    card.appendChild(button);
    MajorCities.appendChild(card);

    button.addEventListener("click", () => {
      let zoom = cityData.zoom || 10;
      fetchWeather(cityData.lat, cityData.lon);
      myMap.setView([cityData.lat, cityData.lon], zoom);

      // וגם להוסיף נעץ
      if (!cityData.zoom) {
        if (currentMarker) myMap.removeLayer(currentMarker);
        currentMarker = L.marker([cityData.lat, cityData.lon]).addTo(myMap);
      } else {
        myMap.removeLayer(currentMarker);
      }
    });
  });
}

window.addEventListener("resize", () => {
  setTimeout(() => {
    myMap.invalidateSize();
  }, 200);
});
