// Start page

const nameInput = document.getElementById("your-name");
/** Only enable the start button, if a name has been typed by the player. */
function updateFormState() {
    const name = nameInput.value.trim();
    document.getElementById("start").disabled = (name === "");
}
nameInput.addEventListener("input", updateFormState)

updateFormState();

document.getElementById("start").addEventListener("click", () => {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("game-container").style.display = "flex";

    runGame();
})

document.getElementById("instructions").addEventListener("click", () => {
    document.getElementById("help").classList.toggle("hidden");
})


// End screen

const endScreen = document.getElementById("endScreen")
const restartButton = document.getElementById("restart")
// Reload the game to start over
restartButton.addEventListener('click', () => {
    location.reload()
})


// Main game page

const timerInterval = 1000 / 60 // Executa a cada 16ms (~60 FPS).

let score = 0;
let scoreDisplay = document.getElementById("points")
function updateScore() {
    scoreDisplay.innerText = String(score);
}

// Todó os elementos
const gameScreen = document.getElementById("game-container");
const spiderManElement = document.getElementById("spiderman"); // Seleciona o elemento do Spider-Man.
const greenBall = document.getElementById("ball-element");
const meteorElement = document.getElementById("rock-meteor");
// Created when player shoots
const webs = [];

// Initially the game screen is not shown, so we cannot know it's dimensions until the game has started.
let gameScreenWidth, gameScreenHeight;
function initGameScreen() {
    gameScreenWidth = gameScreen.getBoundingClientRect().width
    gameScreenHeight = gameScreen.getBoundingClientRect().height
}

// Spider Man

const groundY = 0;
const invinciblePeriod = Math.ceil(2000 / timerInterval);
const spiderMan = {
    x: 0,
    y: groundY,
    z: 0,
    xSpeed: 0,
    ySpeed: 0,
    invincible: invinciblePeriod,
};
const gravity = 0.3;
function updateSpiderMan() {
    const spiderManWidth = spiderManElement.getBoundingClientRect().width;
    const spiderManHeight = spiderManElement.getBoundingClientRect().height;

    // Lógica para "cair" após o pulo.
    spiderMan.y = Math.max(groundY, spiderMan.y - spiderMan.ySpeed);
    spiderMan.x += spiderMan.xSpeed;
    if (spiderMan.y > gameScreenHeight - spiderManHeight) {
        spiderMan.xSpeed *= 0.5;
        spiderMan.ySpeed += 2 * gravity;
        spiderMan.y = (spiderMan.y + gameScreenHeight - spiderManHeight) / 2;
    } else if (spiderMan.y > groundY) {
        spiderMan.xSpeed *= 0.9;
        spiderMan.ySpeed += gravity;
    } else {
        spiderMan.y = groundY;
        spiderMan.xSpeed *= 0.8;
        spiderMan.ySpeed = 0;
    }

    if (spiderMan.x + spiderManWidth > gameScreenWidth) {
        spiderMan.xSpeed = -1;
        spiderMan.x = gameScreenWidth - spiderManWidth;
    } else if (spiderMan.x < 0) {
        spiderMan.xSpeed = 1;
        spiderMan.x = 0;
    }

    spiderMan.invincible = Math.max(0, spiderMan.invincible - 1);

    // Atualiza a posição do Spider-Man no DOM.
    spiderManElement.style.left = `${spiderMan.x}px`; // Atualiza a posição X.
    spiderManElement.style.bottom = `${spiderMan.y}px`; // Atualiza a posição Y.
    spiderManElement.style.transform = `scale(${Math.exp(-spiderMan.z/10)})`; // Aplica transformação (escala).
    // Flash while invincible
    spiderManElement.style.opacity = (1 + Math.cos(spiderMan.invincible / 10)) / 2
}
// Reset and be temporarily invincible
function respawnSpiderMan() {
    spiderMan.x = 0;
    spiderMan.y = groundY;
    spiderMan.invincible = invinciblePeriod;
}

// Meteor

let meteorX = -1000, meteorY = 99999, meteorSpeed;
function initMeteor() {
    meteorSpeed = gameScreenHeight * timerInterval / 5000; // Regra de três
}
function updateMeteor() {
    if (meteorY > gameScreenHeight) {
        meteorY = 0;
        meteorX = (0.1 + Math.random() * 0.8) * gameScreenWidth;
    }
    meteorY += meteorSpeed;

    meteorElement.style.left = `${meteorX}px`;
    meteorElement.style.top = `${meteorY}px`;
}

// Green ball

let greenBallXPosition = 350
let greenBallYPosition = 50
let greenBallXDirection = 5;
let greenBallYDirection = 3;
let greenBallHeight, greenBallWidth;
function initGreenBall() {
    greenBallWidth = greenBall.getBoundingClientRect().width;
    greenBallHeight = greenBall.getBoundingClientRect().height;
    greenBall.style.top = `${greenBallYPosition}px`;
    greenBall.style.left = `${greenBallXPosition}px`;
}
function updateGreenBall() {
    const repell = intersect(greenBall, meteorElement);
    const hit = !spiderMan.invincible && intersect(spiderManElement, greenBall, 10);
    if (repell === "x" || hit === "x") {
        greenBallXDirection *= -1;
        greenBallXPosition += 3 * greenBallXDirection; // Atualiza a posição no eixo X.
    } else if (repell === "y" || hit === "y") {
        greenBallYDirection *= -1;
        greenBallYPosition += 3 * greenBallYDirection; // Atualiza a posição no eixo Y.
    }

    if (hit) {
        score -= 100;
        respawnSpiderMan();
    }

    // Verifica colisão no eixo X
    if (greenBallXPosition < 0 || greenBallXPosition > gameScreenWidth - greenBallWidth) {
        greenBallXDirection *= -1; // Inverte a direção horizontal.
    }

    greenBallXPosition += 2 * greenBallXDirection; // Atualiza a posição no eixo X.
    greenBall.style.left = `${greenBallXPosition}px`; // Aplica o estilo atualizado.

    // Verifica colisão no eixo Y
    if (greenBallYPosition < 0 || greenBallYPosition > gameScreenHeight - greenBallHeight) {
        greenBallYDirection *= -1; // Inverte a direção vertical.
    }

    greenBallYPosition += 2 * greenBallYDirection; // Atualiza a posição no eixo Y.
    greenBall.style.top = `${greenBallYPosition}px`; // Aplica o estilo atualizado.
}

// Webs

// Função para criar e disparar teias.
function shootWebsLeft() {
    const web = document.createElement("div");
    web.classList.add("web");
    web.classList.add("moveLeft");
    web.innerText = "WEB";
    web.style.left = `${spiderMan.x + 20}px`;
    web.style.bottom = `${spiderMan.y + 140}px`;
    gameScreen.append(web);
    webs.push(web);
}
function shootWebsRight() {
    const web = document.createElement("div");
    web.classList.add("web");
    web.classList.add("moveRight");
    web.innerText = "WEB";
    web.style.left = `${spiderMan.x + 140}px`;
    web.style.bottom = `${spiderMan.y + 140}px`;
    gameScreen.append(web);
    webs.push(web);
}
function updateWebs() {
    // Atualiza a posição das teias disparadas.
    const toDelete = [];
    for (const web of webs) {
        const posX = Number(web.style.left.replace("px", "")); // Pega a posição X da teia.
        const posY = Number(web.style.bottom.replace("px", "")); // Pega a posição Y da teia.
        const speedX = web.classList.contains("moveRight") ? 10 : -10;
        web.style.left = `${posX + speedX}px`; // Move a teia para frente no eixo X.
        web.style.bottom = `${posY + 1}px`; // Move a teia para cima no eixo Y.

        for (const bat of bats) {
            if (intersect(web, bat.elem, 0)) {
                bat.hit();
                score += 10;
            }
        }

        if (intersect(web, spider.elem, 0)) {
            spider.hit();
            score += 25;
        }

        if (0 >  posX || posX > gameScreenWidth) {
            toDelete.push(web);
        }
    }

    // Clean up our webs
    toDelete.forEach(web => {
        gameScreen.removeChild(web)
        webs.splice(webs.indexOf(web), 1);
    });
}


// Bats

class Bat {
    /**
     * Instantiate a new Bat in the game. The element needs to already exist in the game-container, be absolute positioned and have a size defined.
     * This class describes its movement along a paraboly.
     *
     * @param {string} id Id of the dom element
     * @param {number} xFactor How far across the screen the bat flies. Negative for left to right.
     * @param {number} yFactor How far down the bat flies. From 0 to 1
     * @param {number} wait Number of iterations to wait before reappaering after having crossed the screen.
     */
    constructor(id, xFactor, yFactor, wait) {
        this.elem = document.getElementById(id);
        this.speed = 1 / 100;
        this.xFactor = xFactor;
        this.yFactor = yFactor;
        this.wait = wait / 100;
        // Wait some time before first appearence
        this.t = -this.wait / 2;
    }

    /** Bat has been hit by a web */
    hit() {
        this.t = 1;
        this.update();
    }

    /** Increment the position by one step. The bat needs 100 steps to cross the screen */
    fly() {
        if (this.t >= 1 + this.wait) {
            this.t = 0;
        } else {
          this.t += this.speed
        }
    }

    /** Update the dom element with the state of the bat */
    update() {
        this.elem.style.left = `${this.x}px`;
        this.elem.style.top = `${this.y}px`;
        this.elem.classList.toggle("hidden", this.t <= 0 || this.t >= 1)
    }

    /** Calculate horizontal screen position */
    get x() {
        return (0.5 + (0.5-this.t)*this.xFactor) * gameScreenWidth
    }
    /** Calculate vertical screen position */
    get y() {
        return -4*this.yFactor*this.t*(this.t-1) * gameScreenHeight
    }
}

// Define two bats
const bats = [
    // Bat from right to left
    new Bat("bat1", 1, 0.8, 115),
    // Bat from left to right
    new Bat("bat2", -1, 0.6, 171),
]

function updateBats() {
    // Animate all bats
    bats.forEach(bat => {
        bat.fly()
        bat.update()
    })
}

// Spiders

class Spider {
    /** Instantiate a new spider in the game. The element is added to the game-container. */
    constructor(wait) {
        this.width = 100;

        this.elem = document.createElement("img");
        this.elem.src = "img/spider.png";
        this.elem.style.position = "absolute";
        this.elem.style.width = `${this.width}px`;
        this.elem.style.height = "auto";
        gameScreen.appendChild(this.elem);

        this.speed = 1 / 160;
        this.wait = wait / 100;
        // Wait some time before first appearence
        this.t = -this.wait / 2;

        this.update();
    }

    init() {
        this.x = Math.random() * (gameScreenWidth - this.width);
    }

    /** Bat has been hit by a web */
    hit() {
        this.t = 1;
        this.update();
    }

    /** Increment the position by one step. The spider needs 160 steps between appearing and disappearing again */
    crawl() {
        if (this.t >= 1 + this.wait) {
            this.init();
            this.t = 0;
        } else {
          this.t += this.speed
        }
    }

    /** Update the dom element with the state of the bat */
    update() {
        this.elem.style.left = `${this.x}px`;
        this.elem.style.top = `${this.y}px`;
        this.elem.classList.toggle("hidden", this.t <= 0 || this.t >= 1)
    }

    /** Calculate vertical screen position */
    get y() {
        return gameScreenHeight * Math.min(0.7, 1 - 2 * Math.abs(this.t - 0.5));
    }
}

const spider = new Spider(200);

/**
 * Check if two elements intersect.
 *
 * If they intersect the function returns whether they intersect more in the x or in the y direction.
 * Otherwise return false.
 *
 * Subtract the given allowed overlap
 *
 * Can be used to detect collissions.
 */
function intersect(elem1, elem2, allowedOverlap) {
    const rect1 = elem1.getBoundingClientRect()
    const rect2 = elem2.getBoundingClientRect()

    const intersectX = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left) - allowedOverlap);
    const intersectY = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top) - allowedOverlap);
    if (intersectX > intersectY && intersectY > 0) {
        return "x";
    }
    if (intersectY >= intersectX && intersectX > 0) {
        return "y";
    }
    return false;
}

// Key handling

let rightPressed = false;
let leftPressed = false;
let paused = false;
let gameTimer;

function onKeyDown(event) {
    switch (event.key) {
        case "ArrowRight":
            rightPressed = true;
            break;
        case "ArrowLeft":
            leftPressed = true;
            break;
        case "PageUp":
            spiderMan.z += 1; // Modifica a escala no eixo Z
            break;
        case "PageDown":
            spiderMan.z -= 1; // Modifica a escala no eixo Z (não essencial para movimento).
            break;
        case " ": // Espaço para "pular".
        case "ArrowUp":
            spiderMan.y += 50; // Aumenta a posição Y (salto).
            spiderMan.ySpeed -= 5;
            break;
        case "Enter": // Tecla Enter para disparar teias.
        case "ArrowDown":
            shootWebsRight();
            shootWebsLeft();
            break;
        case "p":
            paused = !paused;
            break;
    }
}

function onKeyUp(event) {
    switch (event.key) {
        case "ArrowRight":
            rightPressed = false;
            break;
        case "ArrowLeft":
            leftPressed = false;
            break;
    }
}

/** Do actions for keys held down */
function handleHoldKeys() {
    if (rightPressed && !leftPressed) {
            spiderMan.x += 10;
            spiderMan.xSpeed += 1;
    } else if (leftPressed && !rightPressed) {
            spiderMan.x -= 10; // Move para a esquerda.
            spiderMan.xSpeed -= 1;
    }
}

function gameLoope() {
    // Força a posição de rolagem (se necessário).
    window.scroll(0, 0);

    if (paused) {
        return;
    }

    if (!spiderMan.invincible && intersect(spiderManElement, meteorElement, 30) || score <= -1000) {
        gameScreen.style.display = "none"
        endScreen.style.display = "block"
    }

    handleHoldKeys();

    updateMeteor();
    updateSpiderMan();
    updateBats();
    spider.crawl()
    spider.update();
    updateWebs();
    updateGreenBall();
    updateScore();
}

function runGame() {
    // Elements is visible now
    initGameScreen();
    initMeteor();
    initGreenBall();
    spider.init();

    window.setInterval(gameLoope, timerInterval);

    // Adiciona evento para capturar teclas pressionadas.
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
}