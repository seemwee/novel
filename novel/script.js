// Telegram WebApp API
const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

// Элементы
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const char = document.getElementById("character");
const dialogue = document.getElementById("dialogue-text");
const choicesBox = document.getElementById("choices");

// Игровые данные
const story = {
  start: {
    text: "Ты просыпаешься в странной комнате...",
    char: "normal",
    choices: [
      { text: "Позвать кого-нибудь", next: "call" },
      { text: "Оглядеться", next: "look" }
    ]
  },
  call: {
    text: "Ты зовёшь. Входит девушка и улыбается.",
    char: "happy",
    choices: [{ text: "Поздороваться", next: "talk" }]
  },
  look: {
    text: "Ты видишь зеркало и странный свет из окна.",
    char: "angry",
    choices: [{ text: "Продолжить", next: "call" }]
  },
  talk: {
    text: "Она говорит: 'Наконец-то ты проснулся!'",
    char: "happy",
    choices: []
  }
};

let currentScene = localStorage.getItem("progress") || "start";

// ======= Управление игрой =======
function showCharacter(emotion) {
  char.src = `assets/char_${emotion}.png`;
  char.classList.add("show");
}

function changeEmotion(emotion) {
  char.style.opacity = 0;
  setTimeout(() => {
    char.src = `assets/char_${emotion}.png`;
    char.style.opacity = 1;
  }, 300);
}

function renderScene(name) {
  const scene = story[name];
  dialogue.textContent = scene.text;
  if (scene.char) changeEmotion(scene.char);
  localStorage.setItem("progress", name);

  choicesBox.innerHTML = "";
  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.onclick = () => renderScene(choice.next);
    choicesBox.appendChild(btn);
  });
}

document.getElementById("start-btn").onclick = () => {
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  showCharacter("normal");
  renderScene("start");
};

document.getElementById("continue-btn").onclick = () => {
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  showCharacter(story[currentScene].char);
  renderScene(currentScene);
};

// ======= Донат Stars =======
document.getElementById("donate-btn").onclick = () => {
  if (!tg) {
    alert("Открой игру внутри Telegram чтобы поддержать автора ⭐");
    return;
  }
  tg.openInvoice({ slug: "donate_100stars" }, (status) => {
    if (status === "paid") {
      tg.showAlert("Спасибо за поддержку! 💖");
      localStorage.setItem("donated", "true");
    } else if (status === "cancelled") {
      tg.showAlert("Вы отменили оплату.");
    }
  });
};