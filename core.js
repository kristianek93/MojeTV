console.log("GitHub Core: Načítám TizenTube Logic...");

// 1. ZMĚNA IDENTITY (Moderní TV)
var fakeUA = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebKit/537.3 (KHTML, like Gecko) SamsungBrowser/2.1 TV Safari/537.3';
try {
    Object.defineProperty(navigator, 'userAgent', { get: function() { return fakeUA; } });
} catch(e) {}

// 2. FUNKCE PRO BĚH NA POZADÍ (Klíčová část!)
function setupBackgroundPlay() {
    try {
        // Povolíme naslouchání na tlačítko Zpět (Return)
        if (window.tizen && tizen.tv && tizen.tv.inputdevice) {
            tizen.tv.inputdevice.registerKey('Return');
        }

        // Hack proti zastavení videa při minimalizaci
        document.addEventListener("visibilitychange", function(e) {
            e.stopImmediatePropagation();
        }, true);
        Object.defineProperty(document, 'hidden', { get: function() { return false; } });
        Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; } });

        console.log("✅ Background Play: Povoleno");
    } catch (e) {
        console.log("❌ Chyba Background Play: " + e.message);
    }
}

// 3. OBSLUHA TLAČÍTEK (Aby se aplikace nezavřela, ale jen skryla)
document.addEventListener('keydown', function(e) {
    // Kód 10009 je tlačítko "Return" (Zpět)
    if (e.keyCode === 10009) {
        // Pokud jsme na hlavní stránce YouTube nebo přehráváme video...
        // ...nechceme aplikaci zavřít, ale SKRÝT.
        
        // Zde je logika: Pokud už není kam jít "zpět" v historii prohlížeče,
        // normálně by se appka zavřela. My ji místo toho schováme.
        if (window.location.href.indexOf("youtube.com") > -1) {
             // Zkusíme zjistit, jestli uživatel nechce jen zavřít menu
             // (Tohle je zjednodušené, TizenTube to má složitější, ale toto by mělo stačit pro Premium)
             try {
                 e.preventDefault(); // Zrušíme "Zavření aplikace"
                 console.log("Minimalizuji aplikaci (Hudba by měla hrát dál)...");
                 tizen.application.getCurrentApplication().hide(); // SKRYTÍ
             } catch (err) {
                 console.log("Chyba při skrývání: " + err.message);
             }
        }
    }
});

// 4. FIX POMĚRU STRAN (Square Video)
function fixAspectRatio() {
    var style = document.createElement('style');
    style.innerHTML = `
        video { object-fit: contain !important; }
        .video-stream { object-fit: contain !important; }
        .html5-video-player { background-color: #000 !important; }
    `;
    document.head.appendChild(style);
}

// 5. START APLIKACE
setTimeout(function() {
    if (window.location.host.indexOf("youtube.com") === -1) {
        window.location.replace("https://www.youtube.com/tv");
    } else {
        setupBackgroundPlay();
        fixAspectRatio();
        // Opakovaný fix, protože YouTube ty styly občas přepíše
        setInterval(fixAspectRatio, 3000);
    }
}, 1000);
