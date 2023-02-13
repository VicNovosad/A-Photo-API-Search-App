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
    load(query) {
        const self = this;
        // console.log(!!query);
        
        if ($('header').css('background-image') === 'none' && pageNavigator !== "Videos") {
            // Load random Header Photo
            Search.getHeaderPhoto();
        } 
        if (query) {
            $(`#search-input`).val(query);
            Url.clean();
            self.clearContentContainer();
            if (pageNavigator === "Videos"){
                // console.log('Video query');
                self.search('Videos', query);
            } else {
                self.search('Photos', query);
            }
        } else {
            self.search('trending');
        }
        return this;
    },
    addSearchFormListener(){
        const self = this;
        $(document).ready(function () {
            $(`#search-form`).submit(function(e){
                e.preventDefault(); //Prevent from submitting a form when clicking on a "Submit" button
                self.clearContentContainer();
                query = $(`#search-input`).val()
                Url.update(`search=${query}`);
                // console.log(`search form value: ${query}`);
                if (pageNavigator === "Videos"){
                    // console.log('Video query');
                    self.search('Videos', query);
                } else {
                    // self.search(`https://api.pexels.com/v1/search/?page=1&per_page=18&query=${$searchValue}`);
                    self.search('Photos', query);
                }
            });
        });
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
                $('header').css('background-image', `url(${data.photos[0].src.landscape})`);
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
        // console.log(`loading page number: ${page}`);
        let searchURL;
        if (type === 'Photos') {
            // console.log('type: ' + type);
            searchURL = `https://api.pexels.com/v1/search/?page=${page++}&per_page=18&query=${query}`;
        } else if (type === 'Videos') {
            // console.log('type: ' + type);
            // Video query
            searchURL = `https://api.pexels.com/videos/search?page=${page++}&per_page=18&query=${query}`;
        } else if (type === 'trending') {
            if (pageNavigator === "Videos") {
                // console.log('type: ' + type + ' pageNavigator: ' + pageNavigator);
                // Video query
                searchURL = `https://api.pexels.com/videos/popular?page=${page++}&per_page=18`;
                // searchURL = `https://api.pexels.com/v1/curated?page=${page++}&per_page=18`;
            } else {
                // console.log('type: ' + type);
                searchURL = `https://api.pexels.com/v1/curated?page=${page++}&per_page=18`;
            }
        } else {
            console.log('unknown type: ' + type);
        } 
        // ++page;
        // console.log(searchURL);
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
                let media = data.photos;
                let isForVideo = false;
                let bgColor = "#eee";
                if (pageNavigator === "Videos") {
                    media = data.videos
                    isForVideo = true;
                }   
                media.forEach(function(mediaSrc, index) {
                    if (pageNavigator !== "Videos") {
                        bgColor = mediaSrc.avg_color;
                    }
                    const $imageBox = self.createImgBox(mediaSrc, isForVideo)
                        .css('background-color', `${bgColor}`);
                    if (index > (media.length / 3 * 2 - 1).toFixed()) {
                        if (isMobile) {
                            if (index > (media.length / 3 * 2.5 - 1).toFixed()) {
                                $imageBox.addClass('col-3').appendTo($(secondContentColumn))
                                    // .css('background-color', `red`);
                            } else {
                                $imageBox.addClass('col-3').appendTo($(firstContentColumn))
                                    // .css('background-color', `red`);
                            }
                        } else {
                            $imageBox.addClass('col-3').appendTo($(thirdContentColumn))
                            // .css('background-color', `red`);
                        }
                    } else if (index > (media.length / 3 - 1).toFixed()) {
                        $imageBox.appendTo($(secondContentColumn));
                    } else {
                        if (index > (media.length / 3 - 2).toFixed()) {
                            $imageBox.addClass('observing')
                            // .css('background-color','blue');
                            //add observer to the last photo in the column
                            self.observeMediaContainer($imageBox, type, query);
                        }
                        $imageBox.appendTo($(firstContentColumn));
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
    createImgBox(imageSrc, isForVideo){
        const href = isForVideo ? imageSrc.video_files[0].link : imageSrc.src.original;
        const photoSrc = isForVideo ? imageSrc.image : imageSrc.src.large;
        const author = isForVideo ? imageSrc.user.name : imageSrc.photographer;
        const authorURL = isForVideo ? imageSrc.user.url : imageSrc.photographer_url;
        const download = isForVideo ? 
              `https://www.pexels.com/video/${imageSrc.id}/download/`
            : `${imageSrc.src.original}?cs=srgb&amp;dl=pexels-anait-film-12276028.jpg&amp;fm=jpg`;
        const mediaClass = isForVideo ? 'video' : 'photo';
        
        const $currentImgBox = $(`
            <div class="${mediaClass} media">
                <a target="_blank" href="${href}">
                    <img src="${photoSrc}" alt="${author}" loading="lazy">
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
                    <a target="_blank" class="author_name flex items-center" href="${authorURL}">
                    <!-- <div class="author_img"></div> -->
                    ${author}</a>
                </div>
                <a download="" title="Download" href="${download}">
                    <div class="icon file_download">
                        <svg viewBox="0 0 24 24">
                            <use xlink:href="lib.svg#file_download-icon"></use>
                        </svg>
                    </div>
                </a>
            </div>
            `);
            if (isForVideo) {
                $currentVideo = $(`<video preload="none" loop="" class="" playsinline="">
                    <source src="${href}" type="video/mp4">
                </video>`);
                $(`<div class="icon video-icon">
                        <svg class="" viewBox="0 0 28.248 22.598">
                            <use xlink:href="lib.svg#VideoIcon"></use>
                        </svg>
                    </div>`).insertAfter($currentImgBox.children('.icon.favorite'));
                $currentVideo.appendTo($currentImgBox.children('a')[0]);
                $currentVideo.hover(function() {
                        const video = $(this)[0];
                        videoPlay(video);
                        $(this).closest('.video').children('.video-icon').css('opacity', '0');
                    }, function() {
                        const video = $(this)[0];
                        videoPause(video);
                        $(this).closest('.video').children('.video-icon').css('opacity', '100%');
                    }
                );
            }
        return $currentImgBox;
    },
    observeMediaContainer($trigger, type, query){
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // entry.target.classList.toggle('show', entry.isIntersecting);
                // console.log('media on page: ' + entry.isIntersecting);
                if (entry.isIntersecting) {
                    if (type === 'trending' || type === 'Photos' || type === 'Videos') {
                        // console.log(`${type} +++`);
                        this.search(type, query);
                    } else {
                        console.log('unknown type: ' + type);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, 
        {
            rootMargin: "50%"
            // threshold: 1,
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

function videoPlay(video){
    var isPlaying = video.currentTime > 0 && !video.paused && !video.ended 
                    && video.readyState > video.HAVE_CURRENT_DATA;
    if (!isPlaying) {
        video.play();
        video.muted = true;
    }
    return this;
}

function videoPause(video){
    var isPlaying = video.currentTime > 0 && !video.paused && !video.ended 
        && video.readyState > video.HAVE_CURRENT_DATA;
    if (isPlaying) {
        video.pause();
    }
    return this;
}

function setRandomTrendingWords(){
    const randomIndices = Search.getRandomIndexes();
    $(`#trending-bar li.trend-wrap`).each(function(index, element) {
        // $(this).find('a').attr("href", `/?search=${Search.trends[randomIndices[index]]}`);
        const randomTrend = Search.trends[randomIndices[index]];
        // console.log(randomTrend);
        $(this).find('span.trend').text(`${randomTrend}`);
        $(this).click(function(e){
            // console.log($(this).find('span.trend').text());
            Search.load($(this).find('span.trend').text());
            // $('#sort-by-dropdown-menu').toggleClass('hidden');
        });
    });
}

function addPageNavigation(){
    $(`#pages-nav li`).click(function(e){
        $(`#pages-nav li`).removeClass('active');
        $(this).addClass('active');
        pageNavigator = $(this).text();
        const video = $('#HeroHeader_video')[0];
        if (pageNavigator === 'Videos') {
            $(video).show();
            videoPlay(video);
        } else {
            videoPause(video);
            $(video).hide();
        }
        // console.log(pageNavigator);
        Url.clean();
        Search.clearContentContainer();
        if ($(`#search-input`).val()){
            // console.log('Search Input Value: ' + !!$(`#search-input`).val());
            Search.load($(`#search-input`).val());
        } else if (Url.load()){
            // console.log('Search Bar Value: ' + !!Url.load());
            Search.load(Url.load());
        } else {
            Search.search('trending');
        }
        // const position = $(this).position();
        // const activeWidth = ($(this).width() + 40);
        // $('#selection').css({left: position.left + 'px', width: activeWidth + 'px'});
    });
};

function addTrendingButton(){
    $(`#content-container-header button`).click(function(e){
        $('#sort-by-dropdown-menu').toggleClass('hidden');
    });
    
    $(`#content-container-header .sort-parm`).click(function(e){
        $('#content-container-header #sort-by-dropdown-menu svg').addClass('hidden');
        $(this).children('svg').removeClass('hidden');
        const sortBy = $(this).data("sort");
        $('#sort-by-btn h2').text(sortBy);
    });
}

function mediaWidthObserver(){
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
                // console.log("smaller")
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
                // console.log("bigger")
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
}

//Video play on hover
// function playVideoOnHover(){
//     $(document).ready(function(){
//         $(".video").hover(function() {
//                 $('video', this)[0].play();
//             }, function() {
//                 $('video', this)[0].pause();
//             }
//         );
//     });
// };

function Init(){
    setRandomTrendingWords();
    addPageNavigation();
    
    //add "Trending/New" dropdown button(menu)
    addTrendingButton();

    Search.addSearchFormListener();
    
    // Check searchURL and load Images 
    Search.load(Url.load());
    
    mediaWidthObserver();
};

window.onload = Init;
