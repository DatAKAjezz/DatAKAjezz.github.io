
//MARK: WORDS GUESSING
const words = [
    { word: "san hô", hint: "Lá phổi của Trái Đất" , revealsNumber : 0},
    { word: "sóng thần", hint: "Một thảm họa thiên nhiên",revealsNumber : 0 },
    // { word: "cá mập", hint: "Một loài cái không gầy"},
    { word: "băng tan", hint: "Một trong những hậu quả của hiện tượng nóng lên toàn cầu", revealsNumber : 0},
    { word: "sao biển", hint: "Một sinh vật sống dưới nước có khả năng chữa lành siêu việt", revealsNumber : 0 },
    { word: "cá thờn bơn", hint: "Người ta hay gọi nó là chiếc lưỡi biết bơi", revealsNumber : 0 },
    { word: "thủy triều đỏ", hint : "Hiện tượng tự nhiên ở biển có màu sắc đặc trưng, thường gây hại cho sinh vật biển", revealsNumber : 0}
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

        //render
        const letterBoxes = document.createElement("div");
        letterBoxes.className = "letter-boxes";

        let countLetters = 0

        for (let i = 0; i < wordObj.word.length; i++){
            if (revealedLetters[wordIndex][i]) countLetters++;
        }

        if (countLetters === wordObj.word.length){
            for (let i = 0; i < wordObj.word.length; i++) {
                const box = document.createElement("div");
                box.className = "letter-box";
                box.onclick = () => revealLetter(wordIndex, i);
                box.textContent = wordObj.word[i];
                box.classList.add("revealed");

                if (wordObj.revealsNumber === 0){
                    setTimeout(() => {
                        box.classList.add("all-revealed");
                    },(i + 1) *  100)
                }else{
                    box.classList.add("all-revealed-normalized")
                }
                letterBoxes.appendChild(box);
            }
            wordObj.revealsNumber++;
        }else{ 
            let tmpString = removeDiacritics(wordObj.word);    
            for (let i = 0; i < wordObj.word.length; i++) {
                const box = document.createElement("div");
                box.className = "letter-box";
                box.onclick = () => revealLetter(wordIndex, i);
                
                if (revealedLetters[wordIndex][i]) {
                    box.textContent = tmpString[i];
                    box.classList.add("revealed");
                }
                letterBoxes.appendChild(box);
            }
        }

        wordRow.appendChild(letterBoxes);

        const buttons = document.createElement("div");
        buttons.className = "buttons";

        const revealButton = document.createElement("button");

        if (countLetters !== wordObj.word.length){
            revealButton.textContent = "Hiện tất cả";
            revealButton.onclick = () => revealWord(wordIndex);

        }else{      
            revealButton.textContent = "Ẩn tất cả..";
            revealButton.onclick = () => hideWord(wordIndex);
            revealButton.style.backgroundColor = "#008080"
        }

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

function hideWord(wordIndex) {
    revealedLetters[wordIndex] = revealedLetters[wordIndex].map(() => false);  
    render();
}

function showHint(wordIndex) {
    const hintContainer = document.getElementById("hintContainer");
    hintContainer.textContent = words[wordIndex].hint;
    hintContainer.onclick = (e) => {
        e.target.textContent = "";
    }
}

function removeDiacritics(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

//MARK: VOCABs

let vocabs;
let currentVocab;

fetch('vocabulary.json')
    .then(res => res.json())
    .then((data) => {
        vocabs = data.vocabulary;
        getNewVocabulary(); 
    })

let Index = 0;
function getNewVocabulary() {
    currentVocab = vocabs[Index++];
    const vocabularyDisplay = document.getElementById("vocabularyDisplay");
    vocabularyDisplay.textContent = currentVocab.question;
}

function showAnswer() {
    if (currentVocab) {
        const vocabularyDisplay = document.getElementById("vocabularyDisplay");
        vocabularyDisplay.textContent = currentVocab.word;
    }
}

function initializeVocabulary() {
    const newVocabButton = document.getElementById("newVocabButton");
    const showAnswerButton = document.getElementById("showAnswerButton");
    
    newVocabButton.onclick = getNewVocabulary;
    showAnswerButton.onclick = showAnswer;
}

window.onload = () => {
    initializeGame();
    initializeVocabulary();
};

