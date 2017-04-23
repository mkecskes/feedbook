window.onload = function() {
    var feedList = loadFeedList();
    getFeeds(feedList);
    listFeeds(feedList);

    addFeedBtn.onclick = function() {
        feedList = addFeed(feedList);
    };

    reloadFeedsBtn.onclick = function() {
        getFeeds(feedList);
    }
}

function showSpinner() {
    spinnerOverlay.style.display = "block";
}

function hideSpinner() {
    spinnerOverlay.style.display = "none";
}

function getFeeds(feedList) {
    if (feedList.length > 0) {
        showSpinner();
        var counter = [0], newsfeed = [];
        feedList.forEach(function (feed) {
            var req  = new XMLHttpRequest();
            req.open("GET", feed.url);
            req.send();
            req.addEventListener("load", function() {
                parseFeed(this.responseText, feed, newsfeed, counter, feedList.length);
            });
            req.addEventListener("error", function() {
                alert("An error occured. " );
                hideSpinner();
            });
        });
    }
}

function listFeeds(feedList) {
    feedUl.innerHTML = "";
    for (var i = 0; i < feedList.length; i++) {
        var li = document.createElement("li");
        li.textContent = feedList[i].site + " ";
        var btn = document.createElement("button");
        btn.textContent = "Remove";
        btn.onclick = function(i) {
            return function() {
                removeFeed(feedList, i);
            }
        }(i);
        li.appendChild(btn);
        feedUl.appendChild(li);
    };
}

function addFeed(feedList) {
    feedList.push({
        "site": site.value,
        "url": url.value
    });
    site.value = "";
    url.value = "";
    saveFeedList(feedList);
    getFeeds(feedList);
    listFeeds(feedList);
    return feedList;
}

function removeFeed(feedList, i) {
    feedList.splice(i, 1);
    saveFeedList(feedList);
    getFeeds(feedList);
    listFeeds(feedList);
    return feedList;
}

function loadFeedList() {
    if (localStorage.feedList) {
        var feedList = JSON.parse(localStorage.feedList);
    } else {
        var feedList = [];
    }
    return feedList;
}

function saveFeedList(feedList) {
    localStorage.feedList = JSON.stringify(feedList);
}

function parseFeed(responseText, feed, newsfeed, counter, totalFeeds) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(responseText,"text/xml");
    var items = xmlDoc.getElementsByTagName("item");
    for (var i = 0; i < items.length; i++) {
        newsfeed.push({
            "site": feed.site,
            "title": items[i].getElementsByTagName("title")[0].textContent,
            "link": items[i].getElementsByTagName("link")[0].textContent,
            "date": new Date(items[i].getElementsByTagName("pubDate")[0].textContent),
            "description": items[i].getElementsByTagName("description")[0].textContent
        });
    }

    if (++counter[0] == totalFeeds) {
        hideSpinner();
        newsfeed = sortFeed(newsfeed);
        showFeed(newsfeed);
    }
}

function sortFeed(feed) {
    feed.sort(function (a, b){
        return b.date - a.date;
    });
    return feed;
}

function showFeed(feed) {
    feedbox.innerHTML = "";
    feed.forEach(function (item) {
        feedbox.innerHTML += "<div class=\"article\"><h1><a href=\"" + item.link +
            "\">" + item.title + "</a></h1><p>" + item.site + " – " + item.date +
            "</p><p>" + item.description + "</p></div>";
    });
}
