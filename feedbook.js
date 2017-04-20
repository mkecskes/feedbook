var feeds = [
    {
        "site": "Index",
        "url": "http://index.hu/24ora/rss/"
    },{
        "site": "24.hu",
        "url": "http://24.hu/feed/"
    },{
        "site": "Magyar Idők",
        "url": "http://magyaridok.hu/feed/"
    }
];

var newsfeed = [];
var counter = 0;

window.onload = function() {
    feeds.forEach(function (feed) {
        var req  = new XMLHttpRequest();
        req.open("GET", feed.url);
        req.send();
        req.addEventListener("load", function() {
            parseFeed(this.responseText, feed);
        });
    });
}

function parseFeed(responseText, feed) {
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

    if (++counter == feeds.length) {
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
    var feedBox = document.getElementById("feeds");

    feed.forEach(function (item) {
        feedBox.innerHTML += "<div class=\"article\"><h1><a href=\"" + item.link +
            "\">" + item.title + "</a></h1><p>" + item.site + " – " + item.date +
            "</p><p>" + item.description + "</p></div>";
    });
}
