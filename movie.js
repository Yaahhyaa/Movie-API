const apiKey = "af9e7b3d"; // Ensure this is a valid OMDB API key
const baseURL = "https://www.omdbapi.com/";

// Random search terms for initial movies
const randomSearchTerms = ["star", "love", "night", "day", "moon", "fire", "sky", "sea", "city", "home"];

// Fetch random movies or series
async function fetchRandomMoviesOrSeries(type, gridId) {
    const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
    console.log(`Fetching ${type} for random term: ${randomTerm}`);
    try {
        const response = await fetch(`${baseURL}?s=${randomTerm}&type=${type}&apikey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            displayMoviesOrSeries(data.Search, gridId); // Display results in the grid
        } else {
            document.getElementById(gridId).innerHTML = `<p>No ${type} found for "${randomTerm}".</p>`;
            console.warn(`No ${type} found.`);
        }
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        document.getElementById(gridId).innerHTML = `<p>Error loading ${type}. Please try again later.</p>`;
    }
}

// Fetch movies or series based on search input
async function searchMoviesOrSeries(query, gridId) {
    try {
        console.log(`Searching for: ${query}`);
        const response = await fetch(`${baseURL}?s=${query}&apikey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            displayMoviesOrSeries(data.Search, gridId); // Display search results in the grid
        } else {
            document.getElementById(gridId).innerHTML = `<p>No results found for "${query}".</p>`;
        }
    } catch (error) {
        console.error("Error searching movies/series:", error);
        document.getElementById(gridId).innerHTML = `<p>Error loading results. Please try again later.</p>`;
    }
}

// Display movies or series in the specified grid
function displayMoviesOrSeries(items, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = ""; // Clear previous content

    items.forEach(item => {
        const poster = item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/300x450?text=No+Image";
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${poster}" alt="${item.Title}">
            <div class="details">
                <h3>${item.Title}</h3>
                <p>${item.Year}</p>
                <button onclick="showDetails('${item.imdbID}')">Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Fetch movie/series details
async function showDetails(imdbID) {
    try {
        const response = await fetch(`${baseURL}?i=${imdbID}&apikey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === "True") {
            alert(`
                Title: ${data.Title}
                Year: ${data.Year}
                Genre: ${data.Genre}
                Director: ${data.Director}
                Plot: ${data.Plot}
            `);
        } else {
            alert("Details not available.");
        }
    } catch (error) {
        console.error("Error fetching details:", error);
        alert("Error fetching details. Please try again later.");
    }
}

// Event listener for search button
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        searchMoviesOrSeries(query, "moviesGrid");
    } else {
        alert("Please enter a search term.");
    }
});

// Initialize random movies and series on page load
window.addEventListener("load", () => {
    fetchRandomMoviesOrSeries("movie", "moviesGrid");
    fetchRandomMoviesOrSeries("series", "seriesGrid");
});
