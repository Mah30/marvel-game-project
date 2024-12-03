
const startButton = document.getElementById('start-button');
const background = document.getElementById('background-game');
//const spiderMan = document.getElementById('');

startButton.addEventListener('click', () => {
    startButton.style.display = "none"

    background.style.display = "block"
    //spiderMan.style.display = "block"

    console.log("Start game!");
});