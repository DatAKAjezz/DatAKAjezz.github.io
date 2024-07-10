//MARK: WORDS GUESSING

const words = [
    {
      word: "san hô",
      hints: [
        "Lá phổi của Trái Đất",
        "Sinh vật biển tạo thành rạn",
        "Có cấu trúc xương vôi",
        "Môi trường sống của nhiều loài cá",
        "Nhạy cảm với sự thay đổi nhiệt độ và độ pH của nước biển"
      ],
      revealsNumber: 0
    },
    {
      word: "sóng thần",
      hints: [
        "Một thảm họa thiên nhiên",
        "Thường xảy ra sau động đất dưới đáy biển",
        "Có thể cao tới hàng chục mét",
        "Gây thiệt hại lớn cho vùng ven biển",
        "Còn được gọi là tsunami"
      ],
      revealsNumber: 0
    },
    {
      word: "băng tan",
      hints: [
        "Một trong những hậu quả của hiện tượng nóng lên toàn cầu",
        "Làm mực nước biển dâng cao",
        "Ảnh hưởng đến các loài động vật sống ở vùng cực",
        "Thay đổi dòng hải lưu",
        "Có thể nhìn thấy rõ ở các sông băng và băng ở Bắc Cực"
      ],
      revealsNumber: 0
    },
    {
      word: "sao biển",
      hints: [
        "Một sinh vật sống dưới nước có khả năng chữa lành siêu việt",
        "Thường có năm cánh",
        "Có thể tái tạo các phần cơ thể bị mất",
        "Thuộc ngành da gai",
        "Di chuyển bằng chân ống"
      ],
      revealsNumber: 0
    },
    {
      word: "cá thờn bơn",
      hints: [
        "Người ta hay gọi nó là chiếc lưỡi biết bơi",
        "Có hình dạng dẹt",
        "Cả hai mắt nằm trên một bên của cơ thể",
        "Có khả năng ngụy trang tuyệt vời",
        "Thường sống ở đáy biển"
      ],
      revealsNumber: 0
    },
    {
      word: "thủy triều đỏ",
      hints: [
        "Hiện tượng tự nhiên ở biển có màu sắc đặc trưng, thường gây hại cho sinh vật biển",
        "Do sự bùng phát của tảo",
        "Có thể gây ngộ độc cho người và động vật biển",
        "Thường xảy ra ở vùng nước ấm và giàu dinh dưỡng",
        "Còn được gọi là sự nở hoa của tảo"
      ],
      revealsNumber: 0
    }
  ];

words.map((val) => {
    val.word = val.word.split(" ").join("");
});
let revealedLetters = [];

// MARK: RENDER()
function render() {
    const container = document.getElementById("wordsContainer");
    container.innerHTML = "";

    words.forEach((wordObj, wordIndex) => {
        const wordRow = document.createElement("div");
        wordRow.className = "word-row";

        const letterBoxes = document.createElement("div");
        letterBoxes.className = "letter-boxes";

        let countLetters = 0;

        for (let i = 0; i < wordObj.word.length; i++) {
            if (revealedLetters[wordIndex][i]) countLetters++;
        }

        if (countLetters === wordObj.word.length) {

            const promises = [];

            for (let i = 0; i < wordObj.word.length; i++) {
                const box = document.createElement("div");
                box.className = "letter-box";
                box.onclick = () => revealLetter(wordIndex, i);
                box.textContent = wordObj.word[i];
                box.classList.add("revealed");

                if (wordObj.revealsNumber === 0) {
                    promises.push( new Promise( res => {
                        setTimeout(() => {  
                            box.classList.add("all-revealed");
                            res();
                        }, (i + 1) * 100);
                    }))
                    promises.push( new Promise( (res) => {
                        setTimeout(() => {
                            res();
                        },850)
                    }))
                } else {
                    box.classList.add("all-revealed-normalized");
                }
                letterBoxes.appendChild(box);
            }
            Promise.all(promises).then(() => {
                if (wordObj.revealsNumber === 0) {
                    wordObj.revealsNumber++;
                    showNameModal(wordIndex);
                }
            });
        } else {
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

        revealButton.className = "reveal-btn";

        if (countLetters !== wordObj.word.length) {
            revealButton.textContent = "Hiện tất cả";
            revealButton.onclick = () => revealWord(wordIndex);
        } else {
            revealButton.textContent = "Ẩn tất cả..";
            revealButton.onclick = () => hideWord(wordIndex);
            revealButton.style.backgroundColor = "#008080";
        }

        buttons.appendChild(revealButton);

        const hintButton = document.createElement("button");
        hintButton.textContent = "Gợi ý";
        hintButton.onclick = () => showHint(wordIndex);
        buttons.appendChild(hintButton);

        wordRow.appendChild(buttons);

        container.appendChild(wordRow);
    });

    renderScoreboard();
}

function revealLetter(wordIndex, letterIndex) {
    revealedLetters[wordIndex][letterIndex] =
        !revealedLetters[wordIndex][letterIndex];
    render();
}

function revealWord(wordIndex) {
    revealedLetters[wordIndex] = revealedLetters[wordIndex].map(() => true);
    render();
}

function hideWord(wordIndex) {
    revealedLetters[wordIndex] = revealedLetters[wordIndex].map(() => false);
    words[wordIndex].revealsNumber = 0;
    render();
}

let hintIndexs = [];
hintIndexs = Array.apply(null, Array(5)).map((x , i) => { return 0; })

function showHint(wordIndex) {
    const hintContainer = document.getElementById("hintContainer");
    if (hintIndexs[wordIndex] === words[wordIndex].hints.length) hintIndexs[wordIndex] = 0;
    hintContainer.textContent = words[wordIndex].hints[hintIndexs[wordIndex]++];
    hintContainer.onclick = (e) => {
        e.target.textContent = "";
    };
}

function removeDiacritics(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}
//MARK: VOCABs

let vocabs;
let currentVocab;

fetch("vocabulary.json")
    .then((res) => res.json())
    .then((data) => {
        vocabs = data.vocabulary;
        getNewVocabulary();
    });

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
    document.getElementById("showAnswerButton").textContent = "Hide answer";
}

function hideVocab() {
    const vocabularyDisplay = document.getElementById("vocabularyDisplay");
    vocabularyDisplay.textContent = currentVocab.question;
    document.getElementById("showAnswerButton").textContent = "Show answer";
}

//MARK: Init VOCABs

function initializeVocabulary() {
    const newVocabButton = document.getElementById("newVocabButton");
    const showAnswerButton = document.getElementById("showAnswerButton");
    const vocabularyDisplay = document.getElementById("vocabularyDisplay");
    document.getElementById("showAnswerButton").textContent = "Show answer";

    newVocabButton.onclick = getNewVocabulary;
    showAnswerButton.onclick = () => {
        vocabularyDisplay.textContent === currentVocab.word
            ? hideVocab()
            : showAnswer();
    };

    console.log(vocabularyDisplay.textContent);
}

function revealWord(wordIndex) {
    revealedLetters[wordIndex] = revealedLetters[wordIndex].map(() => true);
    render();
}
//MARK: Init GAME

function initializeGame() {
    document.getElementById("addPlayerButton").addEventListener("click", () => {
        openNameModal();
        const submitButton = document.getElementById("submitName");
        const nameInput = document.getElementById("nameInput");

        function handleSubmit(e)  {
            e.preventDefault();
            const name = document.getElementById("nameInput").value.trim();
            if (name) {
                if (confirm(`Bạn có chắc muốn thêm "${name}" vào bảng xếp hạng?`)) {
                    updateScoreboard(name);
                    document.getElementById("nameModal").style.display = "none";
                }
            }
        };

        submitButton.onclick = handleSubmit;

        nameInput.onkeydown = (e) => {
            if ( e.keyCode === 13) {
                handleSubmit(e);
            }
        }

    });
    revealedLetters = words.map((wordObj) =>
        new Array(wordObj.word.length).fill(false)
    );
    render();
}


// MARK: SCOREBOARD
let scoreboard = [];

function openNameModal() {
    const modal = document.getElementById("nameModal");
    const nameInput = document.getElementById("nameInput");

    modal.style.display = "block";
    nameInput.value = "";
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function showNameModal(wordIndex) {
    return new Promise(resolve => {
        openNameModal();
        const submitButton = document.getElementById("submitName");
        const nameInput = document.getElementById("nameInput");

        function handleSubmit(e) {
            e.preventDefault();
            const name = document.getElementById("nameInput").value.trim();
            if (name) {
                if (confirm(`Bạn có chắc muốn thêm "${name}" vào bảng xếp hạng?`)) {
                    updateScoreboard(name);
                    document.getElementById("nameModal").style.display = "none";
                    resolve();
                }
            }
        };

        submitButton.onclick = handleSubmit;

        nameInput.onkeydown = (e) => {
            if (e.key === "Enter") {
                handleSubmit(e);
            }
        };

    });
}

function updateScoreboard(name) {
    const existingEntry = scoreboard.find((entry) => entry.name === name);
    if (existingEntry) {
        existingEntry.count++;
    } else {
        scoreboard.push({ name, count: 1 });
    }
    scoreboard.sort((a, b) => b.count - a.count);
    renderScoreboard();
}

function removeFromScoreboard(index) {
    scoreboard.splice(index, 1);
    renderScoreboard();
}

function renderScoreboard() {
    const scoreboardBody = document.querySelector("#scoreboard tbody");
    scoreboardBody.innerHTML = "";
    scoreboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${entry.name}</td>
        <td>${entry.count}</td>
        <button class="delete-btn" data-index="${index}">Xóa</button>
      `;
        scoreboardBody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            removeFromScoreboard(index);
        });
    });
}

window.onload = () => {
    initializeGame();
    initializeVocabulary();
};

