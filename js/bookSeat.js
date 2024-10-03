export function initSeatView() {
    console.log("Init seat view!")
    console.log(calcSeatViewWidth(15));
    console.log(seatWidth);
    createSeatView()
}

const seatWidth = 20;

function calcSeatViewWidth(seatNumber) {
    let margin = 8 // mx-1
    return (seatWidth+margin) * seatNumber + 80;
}

function createScreen() {
    const screen = document.createElement("div");
    screen.id = "screen"
    screen.classList.add("text-center", "mt-2")
    return screen;
}

function createRow() {
    const row = document.createElement("div");
    row.classList.add("row", "mb-2", "mx-auto", "theatre-row", "d-flex", "justify-content-center");
    return row;
}

function createSeat() {
    const seat = document.createElement("div")
    seat.classList.add("seat", "mx-1")
    return seat
}

function createSeats(row, seats) {
    for (let i = 0; i < seats; i++) {
        row.appendChild(createSeat())
    }
    return row;
}

function createRows(fragment, rows, seats) {
    for (let i = 0; i < rows; i++) {
        let row = createRow();
        row = createSeats(row, seats)
        fragment.appendChild(row)
    }
}

function createSeatView() {
    const seatView = document.getElementById("seatView");
    let fragment = document.createDocumentFragment();
    fragment.appendChild(createScreen());
    createRows(fragment, 10, 10)
    seatView.innerHTML = "";
    seatView.appendChild(fragment);
}