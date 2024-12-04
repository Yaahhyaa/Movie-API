const apiKey = "af9e7b3d";
const baseURL = "https://www.omdbapi.com/";

// Zufällige Begriffe für die Suche
const randomSearchTerms = ["star", "love", "night", "day", "moon", "fire", "sky", "sea", "city", "home"];

// Funktion, um Filme zu laden
async function fetchMovies(rowId, type = "movie") {
    const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
    try {
        const response = await fetch(`${baseURL}?s=${randomTerm}&type=${type}&apikey=${apiKey}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayItems(data.Search.slice(0, 4), rowId);
        } else {
            console.error("Keine Ergebnisse gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

// Funktion, um Items anzuzeigen
function displayItems(items, rowId) {
    const row = document.getElementById(rowId);
    row.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = rowId.includes("movie") ? "movie-card" : "series-card";

        const img = document.createElement("img");
        img.src = item.Poster !== "N/A" ? item.Poster : "placeholder.jpg";
        img.alt = item.Title;

        img.onclick = () => openModal(item.imdbID);

        card.appendChild(img);
        row.appendChild(card);
    });
}

// Modal öffnen
async function openModal(imdbID) {
    const response = await fetch(`${baseURL}?i=${imdbID}&apikey=${apiKey}`);
    const movie = await response.json();

    document.getElementById("modal-poster").src = movie.Poster;
    document.getElementById("modal-title").textContent = movie.Title;
    document.getElementById("modal-year").textContent = movie.Year;
    document.getElementById("modal-genre").textContent = movie.Genre;
    document.getElementById("modal-plot").textContent = movie.Plot;

    document.getElementById("movie-modal").style.display = "flex";
}

// Modal schließen
function closeModal() {
    document.getElementById("movie-modal").style.display = "none";
}

// Filme und Serien laden
document.addEventListener("DOMContentLoaded", () => {
    fetchMovies("movies-row-1", "movie");
    fetchMovies("movies-row-2", "movie");
    fetchMovies("series-row-1", "series");
    fetchMovies("series-row-2", "series");
});
