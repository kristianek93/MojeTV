console.log("GitHub Core: Startuji TizenTube Custom (Premium Edition)...");

// --- 1. KONFIGURACE USER AGENTA (Aby to vypadalo jako moderní TV) ---
var fakeUA = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebKit/537.3 (KHTML, like Gecko) SamsungBrowser/2.1 TV Safari/537.3';
try {
    Object.defineProperty(navigator, 'userAgent', { get: function() { return fakeUA; } });
} catch(e) {}

// --- 2. CSS FIX PRO ČTVERCOVÁ VIDEA A ROZLOŽENÍ ---
function injectCSS() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        /* Donutit video, aby se vešlo do obrazovky a neořezávalo se (fix pro čtvercová videa) */
        video {
            object-fit: contain !important;
        }
        .html5-video-player {
            background-color: #000 !important;
        }
        /* Skrytí scrollbarů, kdyby náhodou */
        body { overflow: hidden !important; }
    `;
    document.head.appendChild(style);
    console.log("CSS Fix aplikován.");
}

// --- 3. HACK PRO BĚH NA POZADÍ (PREMIUM FEATURE) ---
// YouTube se snaží video stopnout, když zjistí "visibilityState === hidden".
// My mu budeme tvrdit, že je pořád "visible".
function enableBackgroundPlay() {
    try {
        // Zablokujeme událost, která hlásí změnu viditelnosti
        document.addEventListener('visibilitychange', function(e) {
            e.stopImmediatePropagation();
        }, true);
        
        // Přepíšeme vlastnost 'hidden' a 'visibilityState' v dokumentu
        Object.defineProperty(document, 'hidden', { get: function() { return false; } });
        Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; } });
        
        // Pro jistotu zablokujeme i webkit verzi
        Object.defineProperty(document, 'webkitHidden', { get: function() { return false; } });
        Object.defineProperty(document, 'webkitVisibilityState', { get: function() { return 'visible'; } });
        
        console.log("Background Play Hack: Aktivní 🎵");
    } catch(e) {
        console.log("Chyba Background Hacku: " + e.message);
    }
}

// --- 4. SPUŠTĚNÍ ---
setTimeout(function() {
    // Pokud ještě nejsme na YouTube, přesměrujeme
    if (window.location.host.indexOf("youtube.com") === -1) {
        console.log("Jdu na YouTube...");
        window.location.replace("https://www.youtube.com/tv");
    } else {
        // Pokud už jsme na YouTube (načetla se stránka), aplikujeme fixy
        console.log("Injektuji vylepšení...");
        injectCSS();
        enableBackgroundPlay();
        
        // Občas YouTube přepíše CSS po načtení videa, takže to tam budeme cpát opakovaně
        setInterval(injectCSS, 5000);
    }
}, 1000);
