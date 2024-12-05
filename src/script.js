// Meteor

let meteorX = -1000, meteorY = 99999;

const screenHeight = 1000;
const timerInterval = 40; //ms
const meteorSpeed = screenHeight * timerInterval / 5000; // Regra de três

const spiderMan = {
    x: 0,
    y: 0,
    z: 0,
};

const webs = [];



// Função para criar e disparar teias.
function shootWebs() {
    const web = document.createElement("div"); // Cria um novo elemento `div`.
    web.classList.add("web"); // Adiciona a classe `web` ao elemento.
    web.innerText = "WEB"; // Define o texto "WEB" no elemento.
    web.style.left = `${spiderMan.x + 220}px`; // Define a posição X inicial da teia.
    web.style.bottom = `${spiderMan.y + 260}px`; // Define a posição Y inicial da teia.
    document.body.append(web); // Adiciona a teia ao corpo do documento.
    webs.push(web); // Armazena a teia no array `webs`.
}

const restartButton = document.getElementById("restart")
document.addEventListener('click', () => {
    location.reload()
})

// Adiciona evento para capturar teclas pressionadas.
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowRight":
            spiderMan.x += 10; // Move para a direita.
            break;
        case "ArrowLeft":
            spiderMan.x -= 10; // Move para a esquerda.
            break;
        case "ArrowUp":
            spiderMan.z += 1; // Modifica a escala no eixo Z 
            break;
        case "ArrowDown":
            spiderMan.z -= 1; // Modifica a escala no eixo Z (não essencial para movimento).
            break;
        case " ": // Espaço para "pular".
            spiderMan.y += 250; // Aumenta a posição Y (salto).
            break;
        case "Enter": // Tecla Enter para disparar teias.
            shootWebs();
            break;
    }
});
const gameTimer = window.setInterval(gameLoope, timerInterval);

function didCollide(obstacle){
    const spiderRect = document.getElementById("spiderman").getBoundingClientRect()
    const obstacleRect = obstacle.getBoundingClientRect()

    return (spiderRect.left < obstacleRect.right && spiderRect.right > obstacleRect.left && spiderRect.top < obstacleRect.bottom && spiderRect.bottom > obstacleRect.top)

}

function gameLoope() {
    if (meteorY > screenHeight) {
        meteorY = 0;
        meteorX = Math.random() * gameScreenWidth;
    }
    if ( didCollide (meteorElement)){

        const endScreen = document.getElementById("endScreen")
        gameScreen.style.display = "none"
        endScreen.style.display = "block"
    }

     if ( didCollide (greenBall)){

        const endScreen = document.getElementById("endScreen")
        gameScreen.style.display = "none"
        endScreen.style.display = "block"
    } 

    meteorElement.style.left = `${meteorX}px`;
    meteorElement.style.top = `${meteorY}px`;

    const spiderManElement = document.getElementById("spiderman"); // Seleciona o elemento do Spider-Man.
    spiderManElement.style.width = "200px"
    spiderManElement.style.height = "200px"

    // Atualiza a posição do Spider-Man no DOM.
    spiderManElement.style.left = `${spiderMan.x}px`; // Atualiza a posição X.
    spiderManElement.style.bottom = `${spiderMan.y}px`; // Atualiza a posição Y.
    spiderManElement.style.transform = `scale(1-1/${spiderMan.z})`; // Aplica transformação (escala).

    // Força a posição de rolagem (se necessário).
    window.scroll(0, 0);

    // Lógica para "cair" após o pulo.
    if (spiderMan.y >= 100) {
        spiderMan.y = Math.max(100, spiderMan.y - 5); // Retorna ao solo gradualmente.
    }

    // Atualiza a posição das teias disparadas.
    for (const web of webs) {
        const posX = Number(web.style.left.replace("px", "")); // Pega a posição X da teia.
        const posY = Number(web.style.bottom.replace("px", "")); // Pega a posição Y da teia.
        web.style.left = `${posX + 10}px`; // Move a teia para frente no eixo X.
        web.style.bottom = `${posY + 1}px`; // Move a teia para cima no eixo Y.
    }

    
    // Enforce scroll position
    window.scroll(0, 0);

    meteorY += meteorSpeed;

}



// green ball position

const gameScreen = document.getElementById("game-container");

let greenBallXPosition = 350
let greenBallYPosition = 50
let greenBallXDirection = 5; 
let greenBallYDirection = 3; 

const greenBall = document.getElementById("ball-element");
greenBall.style.width = '120px';
greenBall.style.height = '120px';
greenBall.style.borderRadius = '80px';
greenBall.style.top = `${greenBallYPosition}px`;
greenBall.style.left = `${greenBallXPosition}px`;

gameScreen.appendChild(greenBall);



const gameScreenWidth = gameScreen.getBoundingClientRect().width
const gameScreenHeight = gameScreen.getBoundingClientRect().height
const greenBallWidth = parseInt(greenBall.style.width, 10); 
const greenBallHeight = parseInt(greenBall.style.height, 10); // Converte para número.

const meteorElement = document.getElementById("rock-meteor");

function intersect(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect()
    const rect2 = elem2.getBoundingClientRect()

    return (
        (rect1.right > rect2.left && rect1.left < rect2.right)
        && (rect1.bottom > rect2.top && rect1.top < rect2.bottom)
    )
}

setInterval (() => {
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

    if (intersect(greenBall, meteorElement)) {
        greenBallXDirection *= -1;
    }
}, 1000 / 60); // Executa a cada 16ms (~60 FPS).



