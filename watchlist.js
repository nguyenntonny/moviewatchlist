const watchlistEl = document.getElementById("watchlist")
let moviesListStorage = []

// Render movies to Watchlist
function render(){
    if (localStorage.getItem('moviesList')) {
        moviesListStorage = JSON.parse(localStorage.getItem('moviesList'))
        renderWatchlist()
    }else{
        renderNoMovies()
    }
}

// Click to remove movie from watchlist
document.addEventListener("click", (e) =>{
    if(e.target.dataset.delete){
        handleClickDeleteMovie(e.target.dataset.delete)
    }
})

function handleClickDeleteMovie(movieId){
    const index = moviesListStorage.findIndex(element => element.id === movieId)
    moviesListStorage.splice(index,1)
    saveToLocalStorage()
    if(JSON.parse(localStorage.getItem('moviesList')).length === 0){
        localStorage.removeItem('moviesList')
    }
    document.getElementById("watchlist").classList.add("center")
    render()
}

// Store values to Local Storage
function saveToLocalStorage(){
    localStorage.setItem('moviesList', JSON.stringify(moviesListStorage))
}

// Render no movies HTML
function renderNoMovies(){
    watchlistEl.innerHTML = `
                <h2 class="no-movie-text">Your watchlist is looking a little empty...</h2>
                <a href="index.html" class="add-movies"><i class="fa-solid fa-circle-plus"></i> Let’s add some movies!</a>
                `
}

// Render Watchlist HTML
function renderWatchlist() {
    let html = ""
    moviesListStorage.forEach(movie =>{
        html += `
            <div class="searched-movie flex" id="searched-movie">
            <img src ="${movie.poster}" class="movie-poster" alt="movie poster">
                <div class="container">
                    <div class="title-bar flex">
                        <h3 class="movie-title">${movie.title}</h3>
                        <i class="fa-solid fa-star"></i>
                        <h4 class="movie-rating">${movie.rating}</h4>
                    </div>
                    <div class="detail-bar flex">
                        <h4 class="movie-run-time">${movie.runtime}</h4>
                        <h4 class="movie-genre">${movie.genre}</h4>
                        <button class="watchlist-btn" data-delete="${movie.Id}"><i class="fa-solid fa-circle-minus"></i>Remove</button>
                    </div>
                    <p class="movie-plot">${movie.plot}</p>
                </div>
            </div>
            <hr>
            `
    })
    
    watchlistEl.innerHTML = `<div class="loader"></div>`

    setTimeout(() => {
        watchlistEl.innerHTML = html
        document.getElementById("watchlist").classList.remove("center")
    }, 800)
   
}

render()