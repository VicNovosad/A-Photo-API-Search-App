const Search = {
    video(UrlSearchValue) {

        const self = this;
        $(`#mobile-menu`).click(function(e){
            $('.left-nav-col').toggleClass('mobile');
            $('.left-col-filler').toggleClass('mobile');
            if ($('.left-nav-col').hasClass('mobile')){
                console.log('mobile menu');
                // const leftWidth = $('.left-nav-col').width();
                // console.log(`left menu has width: ${leftWidth}`);
                // const rightWidth = $('#video-container').width();
                // console.log(`Video container has a width: ${rightWidth}`);
            } else {
                console.log('desktop menu');
            }
        });
        if (UrlSearchValue) {
            $(`#search-input`).val(UrlSearchValue);
            Url.clean();
        }

        $(document).ready(function () {
            $(`#search-form`).submit(function(e){
                e.preventDefault();
                self.clearVideoContainer();
                const $searchValue = $(`#search-input`).val()
                Url.update(`search=${$searchValue}`);
                $.ajax({
                    type: "GET",
                    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$searchValue}&maxResults=18&key=AIzaSyAInRHshjJ1NB5VJUuvgI07BnfieWlWyNU`,
                    // url: `https://www.googleapis.com/youtube/v3/search?part=contentDetails&part=statistics&q=${$searchValue}&maxResults=9&key=AIzaSyAInRHshjJ1NB5VJUuvgI07BnfieWlWyNU`,
        
                    dataType: 'json',
                    success: function(data){
                        // console.log(data);
                        const videoData = data.items.map(function(item){
                            // console.log(toString(item.snippet.channelId));
                            return item;
                        });
                        videoData.forEach(function(video) {
                            const $currentVideoBox = $(`<div class="video-box w-full 
                                    sm:w-1/2 md:w-1/3 lg:1/4 2xl:w-1/5 pr-4 pt-4">
                                    <div class="thumbnail-picture bg-cover group bg-no-repeat bg-center w-full h-[200px] rounded-2xl"
                                        style="background-image: url(${video.snippet.thumbnails.high.url})">
                                        <iframe class="opacity-0 group-hover:opacity-100 rounded-2xl group-hover:scale-105 transition delay-200 duration-500"
                                        width="100%" height="100%" src="https://www.youtube.com/embed/${video.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                    <div class="info-container flex justify-start pt-3">
                                        <div class="relative">
                                            <div class="channel-picture bg-no-repeat bg-cover w-[36px] h-[36px] rounded-full"
                                                style="background-image: url(https://yt3.ggpht.com/ytc/AMLnZu8lRZlr6_T78_Ur7zJsK7InUyf4UIWEGRTLIVVSmes=s68-c-k-c0x00ffffff-no-rj)">
                                            </div>
                                        </div>
                                        <div class="description-container flex flex-col pl-2 pr-4">
                                            <div class="name-line flex items-center">
                                                <h1 class="name font-bold text-lg">${video.snippet.title}</h1>
                                            </div>
                                            <div class="channel-title-wrap flex items-center">
                                                <h5 class="channel-title">${video.snippet.channelTitle}</h5>
                                                <svg class="verified w-[14px] h-[14px] ml-1" viewBox="0 0 24 24" aria-label="Verified badge" role="img" fill="#666">
                                                    <g class="style-scope yt-icon"><path d="M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M9.8,17.3l-4.2-4.1L7,11.8l2.8,2.7L17,7.4 l1.4,1.4L9.8,17.3z" class="style-scope yt-icon"></path></g>
                                                </svg>
                                            </div>
                                            <div class="veiw-wrap flex">
                                                <h5><span class="view-count">0</span> views</h5>
                                                <h5 class="ml-2"><span class="posted-time">${self.formatTime(video.snippet.publishedAt)}</span></h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>`).appendTo($(`#video-container`));
                                $.ajax({
                                    url: `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${video.snippet.channelId}&key=AIzaSyAInRHshjJ1NB5VJUuvgI07BnfieWlWyNU`,
                                    dataType: 'json',
                                    success: function(data){
                                        $currentVideoBox.find(`.channel-picture`).css("background-image", `url(${data.items[0].snippet.thumbnails.default.url})`);
                                    }
                                });
                                // console.log(video.id.videoId);
                                $.ajax({
                                    url: `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${video.id.videoId}&key=AIzaSyAInRHshjJ1NB5VJUuvgI07BnfieWlWyNU`,
                                    dataType: 'json',
                                    success: function(data){
                                        if (data.items.length > 0) {
                                            $currentVideoBox.find(`.view-count`).text(`${self.formatNumber(data.items[0].statistics.viewCount)}`);
                                        }
                                    }
                                });
                        });
                        data.items.forEach(function(item){
                        })
                    }
                });
            });
        });
        
        return this;
    },
    
    getChannelLogo(channelId){
        $.ajax({
            type: "GET",
                // url: `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}&key=AIzaSyAInRHshjJ1NB5VJUuvgI07BnfieWlWyNU`,
                url: `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=AIzaSyAInRHshjJ1NB5VJUuvgI07BnfieWlWyNU`,
            dataType: 'json',
            success: function(data){
                console.log(data.items.snippet.thumbnails.high);
                // const videoData = data.items.map(function(item){
                //     console.log(toString(item.snippet));
                //     return item.snippet;
                // });
            }
        });
    },
    clearVideoContainer(){
        $(`#video-container`).html('');
    },
    formatNumber(n) {
        if (n >= 1e9) return +(n / 1e9).toFixed(1) + "G";
        if (n >= 1e6) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
        return n;
    },
    formatTime(time) {
        var distance = Date.now() - new Date(time).getTime();
        // Time calculations for hours & minutes
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        // let time;
        if (days > 0) {
            let isCurrentYear = (new Date(time).getFullYear() === new Date().getFullYear());
            isCurrentYear ? isCurrentYear = -1 : isCurrentYear = undefined;
            time = new Date(time).toDateString().split(' ').slice(1, isCurrentYear).join(', ').replace(',','');
        } else if (hours > 0) {
            time = `${hours}h`
        } else if (minutes > 0) {
            time = `${minutes}m`
        } else time = '1 m';
        
        return time;
    }
}

const Url = {
    url: new URLSearchParams(window.location.search), //create url search parameters
    keys: {},
    load(){
        let UrlSearchValue = ''; //Default CurrentUser if Url is empty
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

Search.video(Url.load());
// Url.clean();
