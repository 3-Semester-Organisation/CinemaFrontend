export function initSeatView() {
    console.log("Init seat view!")
    console.log(calcSeatViewWidth(15));
}

const seatView = document.querySelector("#seatView");
const seatWidth = 20;

function calcSeatViewWidth(seatNumber) {
    let margin = 8 // mx-1
    return (seatWidth+margin) * seatNumber + 80;
}

function createScreen() {
    const screen = document.createElement("div");
    screen.id = "screen"
    screen.classList.add("text-center mt-2")
    return screen;
}

function createSeatView() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createScreen());

}