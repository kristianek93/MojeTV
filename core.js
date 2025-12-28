console.log("GitHub Core: Startuji...");
var fakeUA = 'Mozilla/5.0 (Linux; Tizen 2.4.0) AppleWebKit/537.3 (KHTML, like Gecko) SamsungBrowser/1.1 TV Safari/537.3';
try { Object.defineProperty(navigator, 'userAgent', { get: function() { return fakeUA; } }); } catch(e) {}

setTimeout(function() {
    console.log("Jdu na YouTube...");
    window.location.replace("https://www.youtube.com/tv");
}, 1000);
