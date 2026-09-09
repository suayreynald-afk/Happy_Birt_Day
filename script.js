/* Replace bracketed values with real details. The experience works before personalization. */
const loveStory = {
    name: "[HER_NAME]",
    secret: "happy",
    letter: [
        "Dear [HER_NAME],",
        "I keep thinking about [OUR_FIRST_MEMORY]. It is one of those moments that became more important with time.",
        "I love [THING_I_LOVE_ABOUT_YOU]. I love the way you make room for joy, even when the day has been difficult.",
        "We have come through [DIFFICULT_MOMENT_WE_OVERCAME], and I am grateful for the person we keep choosing to be together.",
        "You mean [WHAT_YOU_MEAN_TO_ME] to me. I hope this next year gives you reasons to feel as loved as you are.",
        "For our future, I want [WHAT_I_WANT_FOR_OUR_FUTURE]. More ordinary days. More laughter. More us.",
        "Love,\n[YOUR_NAME]"
    ],
    memories: [
        { title: "[MEMORY_TITLE]", date: "[OUR_FIRST_DATE]", image: "Pictures/L1.jpg", text: "[PERSONAL_MEMORY]" },
        { title: "The moment I realized...", date: "[DATE]", image: "Pictures/L2.jpg", text: "[PERSONAL_MEMORY]" },
        { title: "One of my favorite days", date: "[DATE]", image: "Pictures/L3.jpg", text: "[FAVORITE_MEMORY]" },
        { title: "Still one of my favorite smiles", date: "[DATE]", image: "Pictures/L4.jpg", text: "[PERSONAL_MEMORY]" },
        { title: "And somehow, here we are...", date: "[DATE]", image: "Pictures/L5.jpg", text: "[PERSONAL_MEMORY]" }
    ]
};

const state = { currentScreen: "opening", letterOpened: false, letterPart: 0, memoriesUnlocked: 0, giftOpened: false, secretUnlocked: false, heartCompleted: false, musicPlaying: false };
const screens = [...document.querySelectorAll(".screen")];
const music = document.querySelector("#birthdayMusic");
const musicButton = document.querySelector("#musicButton");
const progressText = document.querySelector("#progressText");
const toast = document.querySelector("#toast");
let holdTimer;
let holdStartedAt;
let toastTimer;

function $(selector) { return document.querySelector(selector); }
function personalize() { document.querySelectorAll("[data-name]").forEach((element) => { element.textContent = loveStory.name; }); }
function showScreen(screenId) {
    const nextScreen = document.querySelector(`#${screenId}`);
    if (!nextScreen) return;
    screens.forEach((screen) => { const active = screen === nextScreen; screen.classList.toggle("active", active); screen.hidden = !active; });
    state.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateProgress();
}
function updateProgress() {
    const completed = [state.letterOpened, state.memoriesUnlocked >= loveStory.memories.length, state.giftOpened, state.secretUnlocked, state.heartCompleted].filter(Boolean).length;
    progressText.textContent = `${completed} / 5`;
    document.querySelectorAll(".chapter-card").forEach((card) => {
        const complete = (card.dataset.go === "letter" && state.letterOpened) || (card.dataset.go === "memories" && state.memoriesUnlocked >= loveStory.memories.length) || (card.dataset.go === "gift" && state.giftOpened);
        card.classList.toggle("complete", complete);
        card.querySelector(".chapter-status").textContent = complete ? "Chapter complete" : "Open chapter";
    });
    $("#continueButton").classList.toggle("hidden", completed < 3);
}
function showToast(message) { toast.textContent = message; toast.classList.add("visible"); window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 4200); }
function startMusic() {
    if (!music || state.musicPlaying) return;
    music.volume = 0;
    music.play().then(() => {
        state.musicPlaying = true; musicButton.textContent = "♫"; musicButton.setAttribute("aria-label", "Turn music off"); musicButton.setAttribute("title", "Turn music off"); musicButton.setAttribute("aria-pressed", "true");
        const fade = window.setInterval(() => { music.volume = Math.min(0.55, music.volume + 0.05); if (music.volume >= 0.55) window.clearInterval(fade); }, 100);
    }).catch(() => showToast("Music is ready whenever you are. Tap the music button to start it."));
}
function toggleMusic() {
    if (!music) return;
    if (state.musicPlaying) { music.pause(); state.musicPlaying = false; musicButton.textContent = "♪"; musicButton.setAttribute("aria-label", "Turn music on"); musicButton.setAttribute("title", "Turn music on"); musicButton.setAttribute("aria-pressed", "false"); } else startMusic();
}
function begin() { startMusic(); showScreen("ready"); }
function beginHold(event) {
    event.preventDefault();
    if (state.heartCompleted || holdTimer) return;
    holdStartedAt = Date.now(); $("#holdHeart").classList.add("holding"); $("#holdInstruction").textContent = "Keep holding...";
    holdTimer = window.setInterval(() => { const percentage = Math.min(100, ((Date.now() - holdStartedAt) / 1800) * 100); $("#holdProgress").style.width = `${percentage}%`; if (percentage >= 100) finishHold(); }, 40);
}
function finishHold() {
    if (!holdTimer) return;
    window.clearInterval(holdTimer); holdTimer = null; state.heartCompleted = true; $("#holdHeart").classList.remove("holding"); $("#holdHeart").classList.add("completed"); $("#holdInstruction").textContent = "Some things are worth holding onto."; updateProgress(); window.setTimeout(() => showScreen("reveal"), 900);
}
function renderLetter() {
    const visible = loveStory.letter.slice(0, state.letterPart + 1);
    $("#letterPaper").innerHTML = visible.map((paragraph, index) => `<p class="letter-line ${index === visible.length - 1 ? "line-new" : ""}">${paragraph.replace(/\n/g, "<br>")}</p>`).join("");
    const finished = state.letterPart >= loveStory.letter.length - 1;
    $("#letterNext").innerHTML = finished ? "Letter complete <span aria-hidden=\"true\">&#10003;</span>" : "Read the next part <span aria-hidden=\"true\">&#8594;</span>";
    if (finished) state.letterOpened = true;
    updateProgress();
}
function openLetter() { showScreen("letter"); if (!state.letterOpened && state.letterPart === 0) renderLetter(); }
function renderMemory() {
    const memory = loveStory.memories[state.memoriesUnlocked];
    if (!memory) return;
    $("#memoryImage").src = memory.image; $("#memoryImage").alt = memory.title; $("#memoryTitle").textContent = memory.title; $("#memoryDate").textContent = memory.date; $("#memoryText").textContent = memory.text; $("#memoryIndex").textContent = `${String(state.memoriesUnlocked + 1).padStart(2, "0")} / ${String(loveStory.memories.length).padStart(2, "0")}`; $("#nextMemory").innerHTML = state.memoriesUnlocked === loveStory.memories.length - 1 ? "Finish the timeline <span aria-hidden=\"true\">&#8594;</span>" : "Reveal the next memory <span aria-hidden=\"true\">&#8594;</span>";
}
function openMemories() { showScreen("memories"); renderMemory(); }
function nextMemory() { if (state.memoriesUnlocked < loveStory.memories.length - 1) state.memoriesUnlocked += 1; else state.memoriesUnlocked = loveStory.memories.length; renderMemory(); updateProgress(); if (state.memoriesUnlocked >= loveStory.memories.length) showToast("Every chapter deserves a place to stay."); }
function openGift() { if (state.giftOpened) return; state.giftOpened = true; $("#giftBox").classList.add("opened"); $("#giftInstruction").textContent = "There you are. Exactly where I hoped you would look."; window.setTimeout(() => { $("#giftReveal").hidden = false; $("#giftReveal").classList.add("visible"); }, 750); updateProgress(); }
function unlockSecret() {
    const answer = $("#secretWord").value.trim().toLowerCase();
    const expected = loveStory.secret.toLowerCase();
    if (!expected.includes("[") && answer === expected) { state.secretUnlocked = true; $("#secretFeedback").textContent = "You found it. I knew you would."; updateProgress(); showToast("A hidden piece, just for you."); } else $("#secretFeedback").textContent = "Not quite. Try the word that makes us both laugh.";
}
function routeChapter(event) { const target = event.currentTarget.dataset.go; if (target === "letter") openLetter(); else if (target === "memories") openMemories(); else showScreen(target); }

document.addEventListener("DOMContentLoaded", () => {
    personalize(); updateProgress();
    $("#beginButton").addEventListener("click", begin); $("#discoverButton").addEventListener("click", () => showScreen("chapters")); $("#musicButton").addEventListener("click", toggleMusic);
    $("#holdHeart").addEventListener("pointerdown", beginHold); $("#holdHeart").addEventListener("pointerup", finishHold); $("#holdHeart").addEventListener("pointerleave", finishHold); $("#holdHeart").addEventListener("pointercancel", finishHold);
    $("#holdHeart").addEventListener("keydown", (event) => { if ((event.key === " " || event.key === "Enter") && !event.repeat) beginHold(event); });
    $("#holdHeart").addEventListener("keyup", (event) => { if (event.key === " " || event.key === "Enter") finishHold(); });
    $("#letterNext").addEventListener("click", () => { if (state.letterPart < loveStory.letter.length - 1) { state.letterPart += 1; renderLetter(); } else showScreen("chapters"); }); $("#nextMemory").addEventListener("click", nextMemory); $("#giftBox").addEventListener("click", openGift);
    $("#secretPrompt").addEventListener("click", () => { $("#secretBox").hidden = false; $("#secretPrompt").hidden = true; $("#secretWord").focus(); }); $("#unlockSecret").addEventListener("click", unlockSecret); $("#finalButton").addEventListener("click", () => showScreen("final")); $("#restartButton").addEventListener("click", () => showScreen("opening")); $("#continueButton").addEventListener("click", () => showScreen("future"));
    document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", routeChapter));
});
