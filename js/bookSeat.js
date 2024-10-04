export function initSeatView() {
    console.log("Init seat view!")
    console.log(calcSeatViewWidth(15));
    console.log(seatWidth);
    createSeatView()
    parseSeatBookings(1)
}

const theatre_url = "http://localhost:8080/api/v1/theatre/"
const showing_url = "http://localhost:8080/api/v1/showing/"

const layoutSpace = 32;
const seatWidth = 20;

async function getBookedSeats(showing) {
    let seats;
    try {
        seats = await fetch(`${showing_url+showing}/seatbookings`)
    } catch (err) {
        console.log(err)
    }
    seats = await seats.json()
    return seats;
}


async function parseSeatBookings(showing) {
    let parsedSeatBookings = Array(30).fill(Array(30).fill(""))
    const seatBookings = await getBookedSeats(showing);
    seatBookings.forEach((sb) => {
        let row = Number(sb.seatRowNumber);
        let seat = Number(sb.seatNumber);
        console.log(`row: ${row}, col: ${seat}`)
        parsedSeatBookings[row][seat] = "occupied"
    })
    console.log("occupied ", parsedSeatBookings)
}

async function getLayouts(theatreId) {
    try {
        let layouts = await fetch(`${theatre_url+theatreId}/layouts`)
        return await layouts.json()
    } catch (error) {
        console.log(error)
    }
    return undefined
}


async function parseLayouts() {
    const parsedLayouts = {"rows": [], "cols": []}
    const layouts = await getLayouts(1)
    console.log("layouts: ", layouts)
    layouts.forEach((l) => {
        if (l.theatreRow !== 0) {
            parsedLayouts["rows"].push(l.theatreRow)
        }
        if (l.theatreCol !== 0) {
            parsedLayouts["cols"].push(l.theatreCol)
        }
    })
    console.log(parsedLayouts)
    return parsedLayouts
}

function calcSeatViewWidth(seatNumber,spaces) {
    let margin = 8 // mx-1
    return (seatWidth+margin) * seatNumber + 80 + (layoutSpace*spaces);
}

function createScreen() {
    const screen = document.createElement("div");
    screen.id = "screen"
    screen.classList.add("text-center", "mt-2")
    return screen;
}

function createRow(rowSpace = false) {
    const row = document.createElement("div");
    if(rowSpace) {
        row.classList.add("row", "mb-4", "mx-auto", "theatre-row", "d-flex", "justify-content-center");
    } else {
        row.classList.add("row", "mb-2", "mx-auto", "theatre-row", "d-flex", "justify-content-center");
    }
    return row;
}

function createSeat(col = false) {
    const seat = document.createElement("div")
    if(col) {
        seat.classList.add("seat","ms-1","me-4")
    } else {
        seat.classList.add("seat", "mx-1")
    }
    return seat
}

function createSeats(row, seats, layout) {
    let cols = layout["cols"]
    for (let i = 0; i < seats; i++) {
        if(cols.includes(i+1)) {
            row.appendChild(createSeat(true))
        } else {
            row.appendChild(createSeat())
        }
    }
    return row;
}

function createRows(fragment, rows, seats, layout) {
    let layoutRows = layout.rows
    for (let i = 0; i < rows; i++) {
        let row;
        if (layoutRows.includes(i+1)) {
            row = createRow(true);
        } else {
            row = createRow();
        }

        row = createSeats(row, seats, layout)
        fragment.appendChild(row)
    }
}

async function createSeatView() {
    const seatView = document.getElementById("seatView");
    const seatGuide = document.getElementById("seat-guide");
    let fragment = document.createDocumentFragment();
    let layout = await parseLayouts();
    let spaces = layout.cols.length
    fragment.appendChild(createScreen());
    createRows(fragment, 10, 10, layout)
    seatView.innerHTML = "";
    seatView.style.width = `${calcSeatViewWidth(10,spaces)}px`
    seatGuide.style.width = `${calcSeatViewWidth(10,spaces)}px`
    seatView.appendChild(fragment);
}