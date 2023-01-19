// console.log(PEXEL_API_KEY);


const Search = {
    photo(UrlSearchValue) {
        const self = this;
        
        if (UrlSearchValue) {
            $(`#search-input`).val(UrlSearchValue);
            Url.clean();
        }
        console.log('step1');
        
        $(document).ready(function () {
            console.log('step2');
            $(`#search-form`).submit(function(e){
                console.log('step3');
                e.preventDefault(); //Prevent from submitting a form when clicking on a "Submit" button
                self.clearContentContainer();
                const $searchValue = $(`#search-input`).val()
                Url.update(`search=${$searchValue}`);
                $.ajax({
                    type: "GET",
                    url: `https://api.pexels.com/v1/search/?page=1&per_page=18&query=${$searchValue}`,
                    // url: `https://api.pexels.com/v1/photos/102775`,
                    // url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$searchValue}&maxResults=18&key=AIzaSyAInRHshjJ1NB5VJUuvgI07BnfieWlWyNU`,
                    dataType: 'json',
                    headers: {'Authorization': PEXEL_API_KEY},
                    success: function(data){
                        // console.log(data);
                        data.photos.forEach(function(photo) {
                            self.createPhoto(photo).appendTo($(`#content-container`));
                        });
                    }
                });
            });
        });
        return this;
    },
    getHeaderPhoto(){
        const self = this;
        $.ajax({
            type: "GET",
            url: `https://api.pexels.com/v1/curated?orientation=landscape&page=1&per_page=15`,
            dataType: 'json',
            headers: {'Authorization': PEXEL_API_KEY},
            success: function(data){
                // console.log(JSON.stringify(data));
                const randomNumber = Math.floor(Math.random() * 16); // random number between 0 and 16
                const randomPhotoUrl = data.photos[randomNumber].src.original;
                $('header').css('background-image', `url(${randomPhotoUrl})`);
                $('header .author-name-wrap span').text(data.photos[randomNumber].photographer);
                data.photos.forEach(function(photo) {
                    self.createPhoto(photo).appendTo($(`#content-container`));
                });
            }
        });
    },
    clearContentContainer(){
        $(`#content-container`).html('');
    },
    formatNumber(n) {
        if (n >= 1e9) return +(n / 1e9).toFixed(1) + "G";
        if (n >= 1e6) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
        return n;
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

    // setActiveSelection($("#pages-nav li:first-child").addClass("active"));

    $(`#pages-nav li`).click(function(e){
        $(`#pages-nav li`).removeClass('active');
        $(this).addClass('active');
        const position = $(this).position();
        const activeWidth = ($(this).width() + 40);
        $('#selection').css({left: position.left + 'px', width: activeWidth + 'px'});
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
};

window.onload = Init;
const url = Url.load();
if(url){
    console.log('true');
    Search.photo(url);
} else {
    console.log('false');
    Search.getHeaderPhoto();
    // Search.header(Url.load());
    // Search.new(Url.load());
}
// Url.clean();
