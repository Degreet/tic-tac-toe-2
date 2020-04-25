let gameState = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
]

const lines = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
]

const btnRestart = document.querySelector(".btn-restart")
const btnSwitchMode = document.querySelector(".switch-mode")
const cells = document.querySelectorAll(".cell")
const msg = document.querySelector(".hint")
const levelNum = document.querySelector(".level")
const main = document.querySelector(".main")

let level = Math.random()

levelNum.innerText = "Уровень сложности: " + level.toFixed(1) + ";"

let turn = "player"

msg.innerText = "Ваш ход"

function player() {
    if (turn !== "player") return;
    
    let row = this.dataset.row
    let col = this.dataset.col
    let val = gameState[row][col]
    
    if (val !== " ") {
        return;
    } else {
        gameState[row][col] = "X"
    }

    msg.innerText = "Ход врага"
    render()
    turn = "opponent"
    if (checkWinner()) return
    setTimeout(opponent, 800)
}

function opponent() {
    let row, col, val;

    let bestMove = find2of3("O") || find2of3("X")

    if (Math.random() > level) {
        bestMove = 0;
    }

    if (!bestMove) {
        do {
            row = rnd()
            col = rnd()
            val = gameState[row][col]
        } while (val !== " ");
    } else {
        row = bestMove[0]
        col = bestMove[1]
    }

    gameState[row][col] = "O"
    msg.innerText = "Ваш ход"
    render()

    if (checkWinner()) return

    turn = "player"
}

function find2of3(sign) {
    for (let i = 0; i < 8; i++) {
        const line = lines[i]
        // [[2, 0], [2, 1], [2, 2]]
        const str = gameState[line[0][0]][line[0][1]] + gameState[line[1][0]][line[1][1]] +
                    gameState[line[2][0]][line[2][1]]
        if (str == sign + sign + " " || str ==  sign + " " + sign || str == " " + sign + sign) {
            for (let j = 0; j < 3; j++) {
                if (gameState[line[j][0]][line[j][1]] == " ") {
                    return line[j]
                }
            }
        }
    }
}

function checkWinner() {
    let win = isFinished()
    if (win == "player") {
        return msg.innerText = "Вы выиграли!"
    } else if (win == "opponent") {
        return msg.innerText = "Вы проиграли!"
    } else if (win == "draw") {
        return msg.innerText = "Ничья!"
    }
}

function isFinished() {
    for (let i = 0; i < 8; i++) {
        const line = lines[i]
        const str = gameState[line[0][0]][line[0][1]] + gameState[line[1][0]][line[1][1]] +
                    gameState[line[2][0]][line[2][1]]
        if (str == "XXX") {
            return "player"
        } else if (str == "OOO") {
            return "opponent"
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j] == " ") {
                return
            }
        }
    }

    return "draw"
}

function rnd() {
    return Math.floor(Math.random() * 3)
}

for (let i = 0; i < 9; i++) {
    cells[i].onclick = player
}

function restart() {
    // document.body.style.setProperty("--color", `hsl(${Math.random() * 360}, 50%, 50%)`)

    level = Math.random()

    levelNum.innerText = "Уровень сложности: " + level.toFixed(1) + ";"

    gameState = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ]

    if (Math.random() > 0.5) {
        opponent()
    }
    turn = "player"
    msg.innerText = "Ваш ход"
    render()
}

btnRestart.onclick = restart

btnSwitchMode.onclick = function() {
    main.classList.toggle("animated")
}

function render() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.querySelector(`[data-row="${i}"][data-col="${j}"]`).innerHTML = 
                `<span>${gameState[i][j]}</span>`
        }
    }
}