// console.log(PEXEL_API_KEY);


const Search = {
    trends : ["mountains", "city", "country", "iceberg", "sky", "flowers","travel","house","business",
                        "winter","water","beach","nature","coffee","dog","texture",
                        "car","technology","landscape","money","office","forest","space","dark"],
    photo(UrlSearchValue) {
        const self = this;
        
        if (UrlSearchValue) {
            $(`#search-input`).val(UrlSearchValue);
            Url.clean();
            self.clearContentContainer();
            self.search(`https://api.pexels.com/v1/search/?page=1&per_page=18&query=${UrlSearchValue}`);
        }
        $(document).ready(function () {
            $(`#search-form`).submit(function(e){
                console.log('step3');
                e.preventDefault(); //Prevent from submitting a form when clicking on a "Submit" button
                self.clearContentContainer();
                const $searchValue = $(`#search-input`).val()
                Url.update(`search=${$searchValue}`);
                self.search(`https://api.pexels.com/v1/search/?page=1&per_page=18&query=${$searchValue}`);
            });
        });
        return this;
    },
    getHeaderPhoto(){
        const self = this;
        const searchURL = `https://api.pexels.com/v1/search/?page=${self.randomNumber(1,3800)}&per_page=1&orientation=landscape&query=${this.trends[this.randomNumber(0,this.trends.length-1)]}`;
        $.ajax({
            type: "GET",
            url: searchURL,
            dataType: 'json',
            headers: {'Authorization': PEXEL_API_KEY},
            success: function(data){
                // console.log(JSON.stringify(data));
                $('header').css('background-image', `url(${data.photos[0].src.original})`);
                $('header .author-name-wrap a').text(data.photos[0].photographer);
                $('header .author-name-wrap a').attr("href", data.photos[0].photographer_url);
            }
        });
    },
    getRandomTrendingPhotos(){
        this.search(`https://api.pexels.com/v1/curated?page=1&per_page=18`);
    },
    clearContentContainer(){
        $(`#content-container`).html('');
    },
    randomNumber(min, max){
        min = Math.ceil(min);
        max = Math.floor(max + 1);
        return Math.floor(Math.random() * (max - min) + min); // max and min is inclusive
    },
    formatNumber(n) {
        if (n >= 1e9) return +(n / 1e9).toFixed(1) + "G";
        if (n >= 1e6) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
        return n;
    },
    search(searchURL){
        // searchURL =  `https://api.pexels.com/v1/photos/102775`; // search by photo ID
        const self = this;
        $.ajax({
            type: "GET",
            url: searchURL,
            dataType: 'json',
            headers: {'Authorization': PEXEL_API_KEY},
            success: function(data){
                // console.log(data);
                data.photos.forEach(function(photo) {
                    self.createPhoto(photo).appendTo($(`#content-container`));
                });
            }
        });
    },
    getRandomIndexes(){
        const randomIndices = [];
        while (randomIndices.length < 5) {
            const randomIndex = this.randomNumber(0, this.trends.length-1);
            // console.log(randomIndex);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
            }
        }
        return randomIndices;
    },
    createPhoto(photo){
        const $currentPhoto = $(`
                <div class="photo">
                    <a target="_blank" href="${photo.src.original}">
                        <img src="${photo.src.original}" alt="${photo.photographer}">
                    </a>
                    <div class="icon favorite">
                        <svg class="" viewBox="0 0 24 24">
                            <use xlink:href="lib.svg#favorite-icon"></use>
                        </svg>
                    </div>
                    <div class="icon collection">
                        <svg viewBox="0 0 24 24">
                            <use xlink:href="lib.svg#collection-icon"></use>
                        </svg>
                    </div>
                    <div class="author_info-wrap">
                        <a target="_blank" class="author_name flex items-center" href="${photo.photographer_url}">
                        <!-- <div class="author_img"></div> -->
                        ${photo.photographer}</a>
                    </div>
                    <a download="" title="Download" href="${photo.src.original}?cs=srgb&amp;dl=pexels-anait-film-12276028.jpg&amp;fm=jpg">
                        <div class="icon file_download">
                            <svg viewBox="0 0 24 24">
                                <use xlink:href="lib.svg#file_download-icon"></use>
                            </svg>
                        </div>
                    </a>
                </div>
                `);
        return $currentPhoto;
    }
}

const Url = {
    url: new URLSearchParams(window.location.search), //create url search parameters
    keys: {},
    load(){
        let UrlSearchValue = ''; //Default if Url is empty
        const loadUrlQueries = [...this.url.entries()]; // clone URLEntries
        // console.log(`${this.url}`);
        // history.replaceState(null, null, "?"); //clean previous history
        for (const [key, value] of loadUrlQueries) {
            this.keys[`${key}`] = value; // add key to keys object
            if (key === 'search') {
                UrlSearchValue = value;
            }
        }
        // console.log(this.keys);
        return UrlSearchValue;
    },
    clean(){
        history.replaceState(null, null, "?"); //clean previous history
        return this;
    },
    update(param){
        history.replaceState(null, null, "?" + param); //refresh URLSearchParams
        return this;
    }
};

function Init(){
    const self = this;
    // setActiveSelection($("#pages-nav li:first-child").addClass("active"));
    
    const randomIndices = Search.getRandomIndexes();
    $(`#trending-bar li`).each(function(index, element) {
        $(this).find('a').attr("href", `/?search=${Search.trends[randomIndices[index]]}`);
        $(this).find('span.trend').text(`${Search.trends[randomIndices[index]]}`);
    });

    $(`#pages-nav li`).click(function(e){
        $(`#pages-nav li`).removeClass('active');
        $(this).addClass('active');
        // const position = $(this).position();
        // const activeWidth = ($(this).width() + 40);
        // $('#selection').css({left: position.left + 'px', width: activeWidth + 'px'});
    });
    
    $(`#content-container-header`).click(function(e){
        $('#sort-by-dropdown-menu').toggleClass('hidden');
    });
    
    $(`#content-container-header .sort-parm`).click(function(e){
        $('#content-container-header #sort-by-dropdown-menu svg').addClass('hidden');
        $(this).children('svg').removeClass('hidden');
        const sortBy = $(this).data("sort");
        $('#sort-by-btn h2').text(sortBy);
    });

    //Video play on hover
    $(document).ready(function(){
        $(".video").hover(function() {
                console.log(this);
                $('video', this)[0].play();
                // $(this).find("video")[0].play();
            }, 
            function() {
                $('video', this)[0].pause();
                // $(this).find("video")[0].pause();
                // $(this).find("video")[0].currentTime = 0;
            }
        );
    });
    
    Search.getHeaderPhoto();
    if (Url.load()){
        Search.photo(Url.load());
    } else {
        Search.getRandomTrendingPhotos();
    }
};

window.onload = Init;
