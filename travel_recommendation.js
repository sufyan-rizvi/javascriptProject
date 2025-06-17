function switchToSection(sectionId) {
  const sections = ["home", "aboutus", "contactus"];
  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (id === sectionId) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
}

function clearSearch() {
  const resultContainer = document.getElementById("recommendations");
  resultContainer.innerHTML = "";
  const input = document.getElementById("search-input");
  if (input) {
    input.value = "";
  }
}
async function search() {
  const text = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  if (!text) return;

  switchToSection("home");

  try {
    const res = await fetch("./travel_recommendation_api.json");
    const data = await res.json();

    const resultContainer = document.getElementById("recommendations");
    resultContainer.innerHTML = `<h1 style="width: 100%"; font-size: 18px;>Search Results for "${text.toUpperCase()}"</h1>`;

    let matches = [];

    // Search in countries & cities
    data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        if (
          city.name.toLowerCase().includes(text) ||
          city.description.toLowerCase().includes(text)
        ) {
          matches.push(city);
        }
      });
    });

    // Search in temples
    data.temples.forEach((temple) => {
      if (
        temple.name.toLowerCase().includes(text) ||
        temple.description.toLowerCase().includes(text)
      ) {
        matches.push(temple);
      }
    });

    // Search in beaches
    data.beaches.forEach((beach) => {
      if (
        beach.name.toLowerCase().includes(text) ||
        beach.description.toLowerCase().includes(text)
      ) {
        matches.push(beach);
      }
    });

    if (matches.length === 0) {
      resultContainer.innerHTML += "<p>No results found.</p>";
      return;
    }

    // Render cards
    const cardsHTML = matches
      .map(
        (item) => `
      <div style="
        border: 1px solid #ccc;
        border-radius: 10px;
        margin: 30px;
        padding: 10px;
        width: 600px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
        <img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; border-radius: 10px;" />
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `
      )
      .join("");

    resultContainer.innerHTML += `
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        ${cardsHTML}
      </div>
    `;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}
