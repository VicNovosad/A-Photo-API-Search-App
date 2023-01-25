// console.log(PEXEL_API_KEY);

let page = 1;
let pagesLoaded = 0;
let lastRun = Date.now();
// let message = true;
let pageNavigator = "Home";
let isMobile = false;
let mobileRunFlag = false;
let desktopRunFlag = false;
const thirdContentColumn = $("#content-container .content-column")[2];
const secondContentColumn = $("#content-container .content-column")[1];
const firstContentColumn = $("#content-container .content-column")[0];

const Search = {
    trends : ["mountains", "city", "country", "iceberg", "sky", "flowers","travel","house","business",
                        "winter","water","beach","nature","coffee","dog","texture",
                        "car","technology","landscape","money","office","forest","space","dark"],
    // content(UrlSearchValue,type) {
    //     const self = this;
    //     if (UrlSearchValue) {
    //         $(`#search-input`).val(UrlSearchValue);
    //         Url.clean();
    //         self.clearContentContainer();
    //         self.search(`https://api.pexels.com/v1/search/?page=1&per_page=18&query=${UrlSearchValue}`);
    //     }
    //     $(document).ready(function () {
    //         $(`#search-form`).submit(function(e){
    //             console.log('step3');
    //             e.preventDefault(); //Prevent from submitting a form when clicking on a "Submit" button
    //             self.clearContentContainer();
    //             const $searchValue = $(`#search-input`).val()
    //             Url.update(`search=${$searchValue}`);
    //             self.search(`https://api.pexels.com/v1/search/?page=1&per_page=18&query=${$searchValue}`);
    //         });
    //     });
    //     return this;
    // },
    load(query) {
        const self = this;
        if (query) {
            $(`#search-input`).val(query);
            Url.clean();
            self.clearContentContainer();
            if (pageNavigator === "Videos"){
                // self.search( Video API query)
                console.log('Video API query');
            } else {
                self.search('Photos', query);
            }
        }
        $(document).ready(function () {
            $(`#search-form`).submit(function(e){
                e.preventDefault(); //Prevent from submitting a form when clicking on a "Submit" button
                self.clearContentContainer();
                query = $(`#search-input`).val()
                Url.update(`search=${query}`);
                console.log(`search form value: ${query}`);
                if (pageNavigator === "Videos"){
                    console.log('Video API query');
                    self.search('Videos', query);
                } else {
                    // self.search(`https://api.pexels.com/v1/search/?page=1&per_page=18&query=${$searchValue}`);
                    self.search('Photos', query);
                }
            });
        });
        return this;
    },
    // loadNextPage(type, query) {
    //     // if (Date.now() - lastRun < 1500) {
    //     //     if (message) {
    //     //         console.log("Please wait before running the function again.");
    //     //         message = false;
    //     //     }
    //     //     return;
    //     // }
    //     // lastRun = Date.now();
    //     // message = true;
    //     // console.log(`run loading page number ${page}` );
        
    //     if (type == 'trending'){
    //         // Search.getRandomTrending();
    //     } else if (type === 'Photos') {
    //         // Search.load(); 
    //         // this.search('Photos', query);
    //     } else if (type === 'Videos') {

    //     } else {
    //         console.log('Unknown type: ' + type);
    //     }
    // },
    // getRandomTrending(){
    //     if (pageNavigator === "Videos"){
    //         // this.search(` Video API query`);
    //         console.log('Video API query');
    //     } else {
    //         this.search('trending');
    //         // this.search(`https://api.pexels.com/v1/curated?page=${page}&per_page=18`, 'trending');
    //         // self.search(query, 'trending');
    //     }
    // },
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
                $('header').css('background-image', `url(${data.photos[0].src.original}?auto=compress&cs=tinysrgb&fit=crop&h=500&w=1400&dpr=1)`);
                $('header .author-name-wrap a').text(data.photos[0].photographer);
                $('header .author-name-wrap a').attr("href", data.photos[0].photographer_url);
            }
        });
    },
    clearContentContainer(){
        $(`#content-container .content-column`).html('');
        page = 1;
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
    search(type, query){
        console.log(`loading page number: ${page}`);
        let searchURL;
        if (type === 'Photos') {
            console.log('type: ' + type);
            searchURL = `https://api.pexels.com/v1/search/?page=${page++}&per_page=18&query=${query}`;
        } else if (type === 'Videos') {
            console.log('type: ' + type);
            // Video query
            searchURL = `https://api.pexels.com/videos/search?page=${page++}&per_page=18&query=${query}`;
        } else if (type === 'trending') {
            if (pageNavigator === "Videos") {
                console.log('type: ' + type + ' pageNavigator: ' + pageNavigator);
                // Video query
                searchURL = `https://api.pexels.com/videos/popular?page=${page++}&per_page=18`;
                // searchURL = `https://api.pexels.com/v1/curated?page=${page++}&per_page=18`;
            } else {
                console.log('type: ' + type);
                searchURL = `https://api.pexels.com/v1/curated?page=${page++}&per_page=18`;
            }
        } else {
            console.log('unknown type: ' + type);
        } 
        // ++page;
        console.log(searchURL);
        // searchURL =  `https://api.pexels.com/v1/photos/102775`; // search by photo ID
        const self = this;
        $.ajax({
            type: "GET",
            url: searchURL,
            dataType: 'json',
            headers: {'Authorization': PEXEL_API_KEY},
            success: function(data){
                // console.log(data);
                // console.log(JSON.stringify(data));
                // console.log(data.photos.length);
                const photos = data.photos
                photos.forEach(function(photo, index) {
                    const $photo = self.createPhoto(photo)
                        .css('background-color', `${photo.avg_color}`);
                    if (index > (data.photos.length / 3 * 2 - 1).toFixed()) {
                        if (isMobile) {
                            if (index > (data.photos.length / 3 * 2.5 - 1).toFixed()) {
                                $photo.addClass('col-3').appendTo($(secondContentColumn))
                                    .css('background-color', `red`);
                            } else {
                                $photo.addClass('col-3').appendTo($(firstContentColumn))
                                    .css('background-color', `red`);
                            }
                        } else {
                            $photo.addClass('col-3').appendTo($(thirdContentColumn))
                            .css('background-color', `red`);
                        }
                    } else if (index > (data.photos.length / 3 - 1).toFixed()) {
                        $photo.appendTo($(secondContentColumn));
                    } else {
                        if (index > (data.photos.length / 3 - 2).toFixed()) {
                            $photo.addClass('observing').css('background-color','blue');
                            
                            //add observer to the last photo in the column
                            self.observeMediaContainer($photo, type, query);
                        }
                        $photo.appendTo($(firstContentColumn));
                    }
                });
                pagesLoaded++;
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
                <div class="photo media">
                    <a target="_blank" href="${photo.src.original}">
                        <img src="${photo.src.original}" alt="${photo.photographer}" loading="lazy">
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
    },
    createVideo(video){
        const $currentVideo = this.createPhoto(video);
        $currentVideo.children('a').append($(`
            <video preload="none" loop="" class="VideoTag_video__i0yT6" playsinline="">
                <source src="https://player.vimeo.com/external/528975212.sd.mp4?s=ee194a10a7b57e6d3fc71a65d4ffd611a851cfbe&amp;profile_id=165&amp;oauth2_token_id=57447761" type="video/mp4">
            </video>
        `))
        return $currentPhoto;
    },
    observeMediaContainer($trigger, type, query){
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // entry.target.classList.toggle('show', entry.isIntersecting);
                console.log('media on page: ' + entry.isIntersecting);
                if (entry.isIntersecting) {
                    if (type === 'trending' || type === 'Photos' || type === 'Videos') {
                        console.log(`${type} +++`);
                        this.search(type, query);
                    } else {
                        console.log('unknown type: ' + type);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, 
        {
            threshold: 1,
        });
        observer.observe($trigger[0]);
    },
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
    },
};

function playVideoOnHover(){
    $(document).ready(function(){
        $(".video").hover(function() {
                $('video', this)[0].play();
            }, function() {
                $('video', this)[0].pause();
            }
        );
    });
};

function Init(){
    const self = this;
    
    //set random trending words
    const randomIndices = Search.getRandomIndexes();
    $(`#trending-bar li`).each(function(index, element) {
        $(this).find('a').attr("href", `/?search=${Search.trends[randomIndices[index]]}`);
        $(this).find('span.trend').text(`${Search.trends[randomIndices[index]]}`);
    });

    //add page navigation
    $(`#pages-nav li`).click(function(e){
        $(`#pages-nav li`).removeClass('active');
        $(this).addClass('active');
        pageNavigator = $(this).text();
        console.log(pageNavigator);
        Url.clean();
        Search.clearContentContainer();
        Search.search('trending');
        // const position = $(this).position();
        // const activeWidth = ($(this).width() + 40);
        // $('#selection').css({left: position.left + 'px', width: activeWidth + 'px'});
    });
    
    //add "Trending/New" dropdown button(menu)
    $(`#content-container-header button`).click(function(e){
        $('#sort-by-dropdown-menu').toggleClass('hidden');
    });
    
    $(`#content-container-header .sort-parm`).click(function(e){
        $('#content-container-header #sort-by-dropdown-menu svg').addClass('hidden');
        $(this).children('svg').removeClass('hidden');
        const sortBy = $(this).data("sort");
        $('#sort-by-btn h2').text(sortBy);
    });

    //Video play on hover
    playVideoOnHover();
    
    //Load random Header Photo
    Search.getHeaderPhoto();

    // Check searchURL and load Images 
    if (Url.load()){
        console.log(pageNavigator);
        Search.load(Url.load());
    } else {
        Search.search('trending');
    }
    
    //Observe window width and if it less than 900px move photos
    //from 3rd col to 1-st and 2-nd and back if more than 900px
    const columnObserver = new ResizeObserver((entries) => {
        isMobile = entries[0].contentRect.width < 900;
        if (pagesLoaded > 0){
            if (isMobile) {
                if (mobileRunFlag) {
                    return;
                }
                // $(thirdContentColumn).css('border', '1px solid red');
                console.log("smaller")
                $(thirdContentColumn).children('.media').each(function(index){
                    if (index < $(thirdContentColumn).children('.media').length / 2) {
                        $(this).appendTo(firstContentColumn);
                    } else {
                        $(this).appendTo(secondContentColumn);
                    }
                });
                if ($(thirdContentColumn).children('.media').length === 0){
                    // $(thirdContentColumn).hide();
                    $("#content-container").css('grid-template-columns','1fr 1fr')
                }
                // console.log($(firstContentColumn).children('.media').length)
                // console.log($(secondContentColumn).children('.media').length)
                mobileRunFlag = true;
                desktopRunFlag = false;
            } else {
                if (desktopRunFlag) {
                    return;
                }
                console.log("bigger")
                $(firstContentColumn).children('.col-3').appendTo(thirdContentColumn);
                $(secondContentColumn).children('.col-3').appendTo(thirdContentColumn);
                $("#content-container").css('grid-template-columns','1fr 1fr 1fr');
                // console.log($(firstContentColumn).children('.media').length)
                // console.log($(secondContentColumn).children('.media').length)
                desktopRunFlag = true;
                mobileRunFlag = false;
            }
        }
    });
    columnObserver.observe(document.body);
};

window.onload = Init;
