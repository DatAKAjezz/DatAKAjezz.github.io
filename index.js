const words = [
    { word: "san ho", hint: "Lá phổi của Trái Đất" , revealsNumber : 0},
    { word: "song than", hint: "Một thảm họa thiên nhiên",revealsNumber : 0 },
    { word: "tuyet lo", hint: "Một trong những hậu quả của hiện tượng nóng lên toàn cầu", revealsNumber : 0},
    { word: "sao bien", hint: "Một sinh vật sống dưới nước có khả năng chữa lành siêu việt", revealsNumber : 0 },
    { word: "ca thon bon", hint: "Người ta hay gọi nó là chiếc lưỡi biết bơi", revealsNumber : 0 },
    { word: "thuy trieu do", hint : "Hiện tượng tự nhiên ở biển có màu sắc đặc trưng, thường gây hại cho sinh vật biển", revealsNumber : 0}
];

words.map((val) => {
    val.word = val.word.split(" ").join('');
})
let revealedLetters = [];

function initializeGame() {
    revealedLetters = words.map(wordObj => new Array(wordObj.word.length).fill(false));
    render();
}

function render() {
    const container = document.getElementById("wordsContainer");
    container.innerHTML = "";
    words.forEach((wordObj, wordIndex) => {
        const wordRow = document.createElement("div");
        wordRow.className = "word-row";

        const letterBoxes = document.createElement("div");
        letterBoxes.className = "letter-boxes";
        for (let i = 0; i < wordObj.word.length; i++) {
            const box = document.createElement("div");
            box.className = "letter-box";
            box.onclick = () => revealLetter(wordIndex, i);
            
            if (revealedLetters[wordIndex][i]) {
                box.textContent = wordObj.word[i];
                box.classList.add("revealed");
            }
            letterBoxes.appendChild(box);
        }
        wordRow.appendChild(letterBoxes);

        const buttons = document.createElement("div");
        buttons.className = "buttons";

        const revealButton = document.createElement("button");
        revealButton.textContent = "Hiện tất cả";
        revealButton.onclick = () => revealWord(wordIndex);
        buttons.appendChild(revealButton);

        const hintButton = document.createElement("button");
        hintButton.textContent = "Gợi ý";
        hintButton.onclick = () => showHint(wordIndex);
        buttons.appendChild(hintButton);

        wordRow.appendChild(buttons);
       
        container.appendChild(wordRow);
    });
}

function revealLetter(wordIndex, letterIndex) {
    revealedLetters[wordIndex][letterIndex] = !revealedLetters[wordIndex][letterIndex] ;
    render();
}

function revealWord(wordIndex) {
    revealedLetters[wordIndex] = revealedLetters[wordIndex].map(() => true);  
    render();
}

function showHint(wordIndex) {
    const hintContainer = document.getElementById("hintContainer");
    hintContainer.textContent = words[wordIndex].hint;
}

window.onload = initializeGame;