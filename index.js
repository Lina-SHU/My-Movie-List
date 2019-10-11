(function () {

  //   write your code here
  //variable
  const dataPanel = document.getElementById('data-panel')
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const ITEM_PER_PAGE = 12
  let paginationData = []

  const pagination = document.getElementById('pagination')
  const changeLayout = document.getElementById('changeIcons')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  localStorage.setItem('showType', 'Card')
  localStorage.setItem('page', '1')

  axios.get(INDEX_URL) // change here
    .then((response) => {
      data.push(...response.data.results)
      displayCardList(data)
      getTotalPages(data)
      getPageData(1, data)
    }).catch((err) => console.log(err))

  //Listener  
  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  //changeLayout
  changeLayout.addEventListener('click', event => {
    const pagenow = localStorage.getItem('page')
    if (event.target.matches('.barsTheme')) {
      localStorage.setItem('showType', 'List')
      getTotalPages(data)
      getPageData(pagenow, data)
    } else if (event.target.matches('.thTheme')) {
      localStorage.setItem('showType', 'Card')
      getTotalPages(data)
      getPageData(pagenow, data)
    }
  })

  // listen to search form submit event
  searchForm.addEventListener('submit', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    //displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      const pageNumber = event.target.dataset.page
      localStorage.setItem('page', pageNumber)
      const pagenow = localStorage.getItem('page')
      getPageData(pagenow)
    }
  })

  //functions
  //show card mode
  function displayCardList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>

          <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function displayWordList(data) {
    let listContent = ''
    data.forEach(function (item, index) {
      listContent += `
        <div class="container">
          <div class="row">
            <div class="col-9">
              <h6>${item.title}</h6>
            </div>

            <!-- "More" button -->
            <div class="col-3">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>  
        `
    })
    dataPanel.innerHTML = listContent
  }


  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  //add movie to favorite
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      console.log(list)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  //get total pages
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }


  function getPageData(pageNum, data) {
    const list = localStorage.getItem('showType')
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    if (list == "Card") {
      displayCardList(pageData)
    } else if (list == "List") {
      displayWordList(pageData)
    }

  }
})()

