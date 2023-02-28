const form = document.getElementById("form")
const searchInputEl = document.getElementById("search-input")
const moviesEl = document.getElementById("movies")
let moviesListStorage = JSON.parse(localStorage.getItem('moviesList')) || []

// Get search movie
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const searchMovie = searchInputEl.value
    const res = await fetch(`https://www.omdbapi.com/?apikey=ed1d2e58&s=${searchMovie}`)
    const data = await res.json()
    if(data.Response === 'True') {
        getMovie(data.Search)
        form.reset()
    } else {
        noMovieFound()
    }
})

// No movie found message rendered to html
function noMovieFound(){
    moviesEl.innerHTML = `<p class="no-movie-text">
        Unable to find what you’re looking
        for. Please try another search.
    </p>`
    form.reset()
}

// Get movie details and render them to html
function getMovie(movies) {
    let html = ""
    for(let movie of movies){
        fetch(`https://www.omdbapi.com/?apikey=ed1d2e58&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(data => {
                if(!data.Genre.includes("Short")){
                    html += `
                            <div class="searched-movie flex" id="searched-movie">
                            <img src ="${data.Poster}" class="movie-poster" alt="movie poster">
                                <div class="container">
                                    <div class="title-bar flex">
                                        <h3 class="movie-title">${data.Title}</h3>
                                        <i class="fa-solid fa-star"></i>
                                        <h4 class="movie-rating">${data.imdbRating}</h4>
                                    </div>
                                    <div class="detail-bar flex">
                                        <h4 class="movie-run-time">${data.Runtime}</h4>
                                        <h4 class="movie-genre">${data.Genre}</h4>
                                        <div id="container-btn-${data.imdbID}">
                                            <button class="watchlist-btn" data-id="${data.imdbID}"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
                                        </div>
                                    </div>
                                    <p class="movie-plot">${data.Plot}</p>
                                </div>
                            </div>
                            <hr>
                            `
                    }
                    moviesEl.innerHTML = `<div class="loader"></div>`

                    setTimeout(() => {
                        moviesEl.innerHTML = html
                    }, 1500)
            })
    }
}

// =================== Watchlist button toggles ================================
document.addEventListener("click",(e)=>{
    if(e.target.dataset.id){
        const containerBtn = document.getElementById(`container-btn-${e.target.dataset.id}`)
        handleClickMovie(e.target.dataset.id)
        containerBtn.innerHTML = `<button class="watchlist-btn not-allowed"><i class="fa-solid fa-circle-check"></i>Added</button>`}
})


// Click button to add movie to watchlist
function handleClickMovie(movieId){
    fetch(`https://www.omdbapi.com/?apikey=ed1d2e58&i=${movieId}`)
        .then(res=>res.json())
        .then(data=> {
            if(!moviesListStorage.find(e => e.Id === movieId)){
                moviesListStorage.unshift({
                    Id: data.imdbID,
                    title: data.Title,
                    rating: data.imdbRating,
                    runtime: data.Runtime,
                    poster: data.Poster,
                    genre: data.Genre,
                    plot: data.Plot
                })  
            } else {
                alert("This movie is already in your watchlist!")
            }
            saveToLocalStorage()
        })
}

// Store values to Local Storage
function saveToLocalStorage(){
    localStorage.setItem('moviesList', JSON.stringify(moviesListStorage))
}






