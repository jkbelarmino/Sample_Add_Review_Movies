document.getElementById("movie-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const rating = document.getElementById("rating").value;
    const description = document.getElementById("description").value;
    const posterInput = document.getElementById("poster");
    
    if (posterInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const posterUrl = e.target.result;

            const movieList = document.getElementById("movie-list");
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");
            movieDiv.innerHTML = `
                <img src="${posterUrl}" alt="${title} Poster">
                <div class="movie-info">
                    <h2>${title}</h2>
                    <p><strong>Year:</strong> ${year}</p>
                    <p><strong>Rating:</strong> ${rating}</p>
                    <p>${description}</p>
                </div>
            `;

            movieList.prepend(movieDiv);

            // Save movie details to local storage
            const movies = JSON.parse(localStorage.getItem("movies")) || [];
            movies.unshift({ title, year, rating, description, posterUrl });
            localStorage.setItem("movies", JSON.stringify(movies));

            // Clear the form
            document.getElementById("movie-form").reset();
        };
        reader.readAsDataURL(posterInput.files[0]);
    }
});

// Load movies from local storage on page load
window.addEventListener("load", function() {
    const movies = JSON.parse(localStorage.getItem("movies")) || [];
    const movieList = document.getElementById("movie-list");

    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");
        movieDiv.innerHTML = `
            <img src="${movie.posterUrl}" alt="${movie.title} Poster">
            <div class="movie-info">
                <h2>${movie.title}</h2>
                <p><strong>Year:</strong> ${movie.year}</p>
                <p><strong>Rating:</strong> ${movie.rating}</p>
                <p>${movie.description}</p>
            </div>
        `;

        movieList.prepend(movieDiv);
    });
});
