console.log("GitHub Core: Startuji TizenTube Mode...");

// 1. Změna identity (Tváříme se jako moderní TV, aby fungovalo přihlášení a novinky)
// Pokud by to zlobilo, můžeme zkusit jiné UA
var fakeUA = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebKit/537.3 (KHTML, like Gecko) SamsungBrowser/2.1 TV Safari/537.3';

try {
    Object.defineProperty(navigator, 'userAgent', {
        get: function() { return fakeUA; }
    });
} catch(e) {
    console.log("Nepodařilo se změnit UserAgent: " + e.message);
}

// 2. Funkce pro automatické klikání na "Přeskočit reklamu" (AdSkip)
function autoSkipAds() {
    setInterval(function() {
        try {
            // Hledáme tlačítko "Přeskočit"
            var skipBtn = document.querySelector('.ytp-ad-skip-button');
            if (skipBtn) {
                console.log("Reklama detekována -> Klikám Skip");
                skipBtn.click();
            }
            
            // Hledáme tlačítko "Přeskočit" (moderní verze)
            var skipBtnModern = document.querySelector('.ytp-ad-skip-button-modern');
            if (skipBtnModern) {
                skipBtnModern.click();
            }

            // Pokud je tam overlay reklama (baner dole), zavřeme ho
            var overlayClose = document.querySelector('.ytp-ad-overlay-close-button');
            if (overlayClose) {
                overlayClose.click();
            }

        } catch (e) {
            // Ignorujeme chyby, jen to zkoušíme dál
        }
    }, 1000); // Kontrola každou sekundu
}

// 3. Spuštění
setTimeout(function() {
    console.log("Jdu na YouTube...");
    
    // Spustíme hlídače reklam
    autoSkipAds();

    // Pokud už jsme na YouTube, jen reloadneme, jinak přesměrujeme
    if (window.location.href.indexOf("youtube.com") > -1) {
        // Už jsme tam, nic neděláme, jen injectujeme skripty
    } else {
        window.location.replace("https://www.youtube.com/tv");
    }
}, 1000);
