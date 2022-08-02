const CHAR_COUNT = 5;
const LINE_COUNT = 5;

const mywrld = document.getElementById("words");

for (let i = 0; i < LINE_COUNT; i++) {
  const wordDiv = document.createElement("div");
  wordDiv.className = "word";
  for (let j = 0; j < CHAR_COUNT; j++) {
    const charDiv = document.createElement("div");
    charDiv.className = "char";
    wordDiv.appendChild(charDiv);
  }

  mywrld.appendChild(wordDiv);
}

let currentChar = 0;
let currentWord = 0;
document.addEventListener("keydown", async (event) => {
  const firstWord = mywrld.children[currentWord];
  if (event.code == "Enter") {
    if (currentChar == CHAR_COUNT) {
      const mywrld = getCurrentWord();
      const results = await guess(mywrld);
      colorize(results);
      currentWord++;
      currentChar = 0;
    }
  } else if (event.code == "Backspace") {
    if (currentChar > 0) {
      currentChar--;
      firstWord.children[currentChar].innerHTML = "";
    }
  } else if (currentChar < CHAR_COUNT) {
    firstWord.children[currentChar].innerHTML = event.key;
    currentChar++;
  }
});

async function guess(word) {
  const request = fetch("/guess/" + word);
  const response = await (await request).json();
  return response;
}

function getCurrentWord() {
  var word = "";
  var wordDiv = document.getElementById("words").children[currentWord];
  for (var i = 0; i < wordDiv.children.length; i++) {
    word = word + wordDiv.children[i].innerHTML;
  }
  return word;
}

async function colorize(results) {
  const wordDiv =
    document.getElementById("words").children[currentWord].children;
  for (let i = 0; i < results.length; i++) {
    if (results[i] == 1) {
      wordDiv[i].style.backgroundColor = "green";
    } else if (results[i] == 0) {
      wordDiv[i].style.backgroundColor = "yellow";
    } else {
      wordDiv[i].style.backgroundColor = "gray";
    }
    await animateCSS(wordDiv[i], "flipInX");
  }
}

function animateCSS(element, animation, prefix = "animate__") {
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    element.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }
    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });
}
