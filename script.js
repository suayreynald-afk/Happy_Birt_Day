
/* ==========================================
   PAGE SWITCHING
========================================== */

function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }
}


/* ==========================================
   OPEN BUTTON
========================================== */

function openBirthday() {
    showPage("birthday");

    startTyping();
    createConfetti();
}


/* ==========================================
   TYPING EFFECT
========================================== */

let typingStarted = false;

function startTyping() {

    if (typingStarted) {
        return;
    }

    typingStarted = true;

    const text = "Happy Birthday! 🎂";
    const typingText = document.getElementById("typingText");

    let index = 0;

    function type() {

        if (index < text.length) {

            typingText.textContent += text.charAt(index);

            index++;

            setTimeout(type, 100);
        }
    }

    type();
}


/* ==========================================
   CONFETTI
========================================== */

function createConfetti() {

    const symbols = [
        "🎉",
        "✨",
        "🎊",
        "⭐",
        "💖",
        "🎈"
    ];

    for (let i = 0; i < 50; i++) {

        const confetti = document.createElement("div");

        confetti.className = "confetti";

        confetti.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        confetti.style.left =
            Math.random() * 100 + "vw";

        confetti.style.fontSize =
            (12 + Math.random() * 18) + "px";

        confetti.style.animationDuration =
            (2 + Math.random() * 3) + "s";

        document.body.appendChild(confetti);

        setTimeout(function() {
            confetti.remove();
        }, 6000);
    }
}


/* ==========================================
   GIFT BOX
========================================== */

let giftOpened = false;

function openGift() {

    const giftBox = document.getElementById("giftBox");
    const gallery = document.getElementById("gallery");
    const message = document.getElementById("giftMessage");

    if (giftOpened) {
        return;
    }

    giftOpened = true;

    giftBox.classList.add("open");

    message.textContent =
        "🎉 Surprise! These memories are for you! ❤️";

    setTimeout(function() {

        gallery.classList.remove("hidden-gallery");

        gallery.classList.add("show-gallery");

        createConfetti();

    }, 700);
}


/* ==========================================
   MUSIC
========================================== */

const music = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");

let musicPlaying = false;

function toggleMusic() {

    /*
       If you haven't added music yet,
       simply do nothing instead of showing
       an error.
    */

    if (!music || !music.querySelector("source")) {
        return;
    }

    if (musicPlaying) {

        music.pause();

        musicButton.textContent = "🔇";

        musicPlaying = false;

    } else {

        music.play()
            .then(function() {

                musicButton.textContent = "🔊";

                musicPlaying = true;

            })
            .catch(function(error) {

                console.log("Music could not start:", error);

            });
    }
}

