document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("movie-list");
    const movieForm = document.getElementById("movie-form");
    const formTitle = document.getElementById("form-title");
    const titleInput = document.getElementById("title");
    const yearInput = document.getElementById("year");
    const ratingInput = document.getElementById("rating");
    const descriptionInput = document.getElementById("description");
    const posterInput = document.getElementById("poster");
    const saveButton = document.querySelector("#movie-form button");

    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let editingIndex = null;

    function displayMovies() {
        movieList.innerHTML = "";
        movies.forEach((movie, index) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");
            movieDiv.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <p><strong>Year:</strong> ${movie.year}</p>
                    <p><strong>Rating:</strong> ${movie.rating}</p>
                    <p>${movie.description}</p>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            movieList.appendChild(movieDiv);
        });

        // Properly assign event listeners
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => editMovie(parseInt(button.dataset.index)));
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => deleteMovie(parseInt(button.dataset.index)));
        });
    }

    function editMovie(index) {
        const movie = movies[index];

        // Populate form with movie data
        titleInput.value = movie.title;
        yearInput.value = movie.year;
        ratingInput.value = movie.rating;
        descriptionInput.value = movie.description;

        editingIndex = index;
        formTitle.textContent = "Edit Movie";
        saveButton.textContent = "Save Changes";

        // Ensure poster updates correctly
        posterInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                    movies[editingIndex].poster = reader.result;
                };
                reader.readAsDataURL(file);
            }
        });

        movieForm.scrollIntoView({ behavior: "smooth" }); // Bring form into view
    }

    movieForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const year = yearInput.value.trim();
        const rating = ratingInput.value.trim();
        const description = descriptionInput.value.trim();
        const posterFile = posterInput.files[0];

        if (!title || !year || !rating || !description) return; // Prevent empty entries

        let poster = editingIndex !== null ? movies[editingIndex].poster : "";

        if (posterFile) {
            const reader = new FileReader();
            reader.onload = function () {
                poster = reader.result;
                saveMovie(title, year, rating, description, poster);
            };
            reader.readAsDataURL(posterFile);
        } else {
            saveMovie(title, year, rating, description, poster);
        }
    });

    function saveMovie(title, year, rating, description, poster) {
        if (editingIndex !== null) {
            movies[editingIndex] = { title, year, rating, description, poster };
            editingIndex = null;
        } else {
            movies.push({ title, year, rating, description, poster });
        }

        localStorage.setItem("movies", JSON.stringify(movies));
        displayMovies();
        movieForm.reset();
        formTitle.textContent = "Add a Movie"; // Reset form title
        saveButton.textContent = "Save Movie"; // Reset button text
    }

    function deleteMovie(index) {
        movies.splice(index, 1);
        localStorage.setItem("movies", JSON.stringify(movies));
        displayMovies();
    }

    displayMovies();
});
