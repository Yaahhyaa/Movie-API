const apiKey = "af9e7b3d";
const baseURL = "https://www.omdbapi.com/";

// Zufällige Begriffe für die Suche
const randomSearchTerms = ["star", "love", "night", "day", "moon", "fire", "sky", "sea", "city", "home"];

// Funktion, um Filme oder Serien zu laden
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

// Funktion, um Items (Filme/Serien) anzuzeigen
function displayItems(items, rowId) {
    const row = document.getElementById(rowId);
    row.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = rowId.includes("movie") ? "movie-card" : "series-card";
        card.setAttribute("data-title", item.Title); // Titel für das Hover hinzufügen

        const img = document.createElement("img");
        img.src = item.Poster !== "N/A" ? item.Poster : "placeholder.jpg";
        img.alt = item.Title;

        img.onclick = () => openModal(item.imdbID);

        card.appendChild(img);
        row.appendChild(card);
    });
}

// Funktion, um nach Filmen und Serien zu suchen
async function searchItems() {
    const searchTerm = document.getElementById("search-input").value.trim();

    const moviesSection = document.getElementById("search-results-movies");
    const seriesSection = document.getElementById("search-results-series");

    if (searchTerm === "") {
        // Wenn kein Suchbegriff eingegeben wurde, die empfohlenen Filme und Serien anzeigen
        fetchMovies("movies-row-1", "movie");
        fetchMovies("series-row-1", "series");

        // Verstecke die Suchergebnisse und zeige die empfohlenen Filme/Serien an
        moviesSection.style.display = "none";
        seriesSection.style.display = "none";
        return;
    }

    try {
        // Filme suchen
        const movieResponse = await fetch(`${baseURL}?s=${searchTerm}&type=movie&apikey=${apiKey}`);
        const movieData = await movieResponse.json();

        // Serien suchen
        const seriesResponse = await fetch(`${baseURL}?s=${searchTerm}&type=series&apikey=${apiKey}`);
        const seriesData = await seriesResponse.json();

        // Ergebnisse anzeigen
        if (movieData.Response === "True") {
            displayItems(movieData.Search, "movies-row-1");
            moviesSection.style.display = "block"; // Sektion anzeigen
        } else {
            document.getElementById("movies-row-1").innerHTML = "<p>Keine Filme gefunden.</p>";
            moviesSection.style.display = "block"; // Sektion trotzdem anzeigen, mit Nachricht
        }

        if (seriesData.Response === "True") {
            displayItems(seriesData.Search, "series-row-1");
            seriesSection.style.display = "block"; // Sektion anzeigen
        } else {
            document.getElementById("series-row-1").innerHTML = "<p>Keine Serien gefunden.</p>";
            seriesSection.style.display = "block"; // Sektion trotzdem anzeigen, mit Nachricht
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Suchergebnisse:", error);
    }
}

// Modal öffnen und Details anzeigen
async function openModal(imdbID) {
    try {
        const response = await fetch(`${baseURL}?i=${imdbID}&apikey=${apiKey}`);
        const movie = await response.json();

        document.getElementById("modal-poster").src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";
        document.getElementById("modal-title").textContent = movie.Title;
        document.getElementById("modal-year").textContent = movie.Year;
        document.getElementById("modal-genre").textContent = movie.Genre;
        document.getElementById("modal-plot").textContent = movie.Plot;

        document.getElementById("movie-modal").style.display = "flex";
    } catch (error) {
        console.error("Fehler beim Abrufen der Filmdetails:", error);
    }
}

// Modal schließen
function closeModal() {
    document.getElementById("movie-modal").style.display = "none";
}

// Funktion für den Reset-Button
function resetRandomMoviesAndSeries() {
    // Leert die Suchleiste und versteckt die Suchergebnisse
    document.getElementById("search-input").value = "";
    document.getElementById("search-results-movies").style.display = "none";
    document.getElementById("search-results-series").style.display = "none";

    // Lädt neue zufällige Filme und Serien
    fetchMovies("movies-row-2", "movie");
    fetchMovies("series-row-2", "series");
}

// Event-Listener für den Such-Button
document.getElementById("search-button").addEventListener("click", searchItems);

// Event-Listener für den Reset-Button
document.getElementById("reset-button").addEventListener("click", resetRandomMoviesAndSeries);

// Optional: Suche auch starten, wenn Enter gedrückt wird
document.getElementById("search-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchItems();
    }
});

// Empfohlene Filme und Serien beim Laden der Seite anzeigen
document.addEventListener("DOMContentLoaded", () => {
    fetchMovies("movies-row-2", "movie");
    fetchMovies("series-row-2", "series");
});
