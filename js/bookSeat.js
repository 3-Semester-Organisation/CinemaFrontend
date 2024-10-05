export function initSeatView() {
    console.log("Init seat view!")
    console.log(calcSeatViewWidth(15));
    console.log(seatWidth);
    createSeatView();
}

const theatre_url = "http://localhost:8080/api/v1/theatre/"
const showing_url = "http://localhost:8080/api/v1/showing/"

const layoutSpace = 32;
const seatWidth = 20;

async function getSeatMap(id) {
    let seatMap
    try {
        seatMap = await fetch(`${showing_url+id}/seatmap`)
    } catch (err) {
        console.error(err)
    }
    let seatMapJson = await seatMap.json()
    console.log("## SEAT MAP:  ",seatMapJson.seatMap)
    return seatMapJson.seatMap
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

function createSeat(space = false, type, row, col) {
    const seat = document.createElement("div")
    if(space) {
        seat.classList.add("seat","ms-1","me-4")
    } else {
        seat.classList.add("seat", "mx-1")
    }
    seat.classList.add(type)
    seat.dataset.row = row;
    seat.dataset.seat = col
    return seat
}

function createSeats(row ,seats, layout) {
    let cols = layout["cols"]
    let numSeats = seats.length
    for (let i = 0; i < numSeats; i++) {
        if(cols.includes(i+1)) {
            row.appendChild(createSeat(true, seats[i]))
        } else {
            row.appendChild(createSeat(false, seats[i]))
        }
    }
    return row;
}

function createRows(seatMap, layout) {
    let layoutRows = layout.rows
    let fragment = document.createDocumentFragment()
    let numRows = seatMap.length
    for (let i = 0; i < numRows; i++) {
        let row;
        if (layoutRows.includes(i+1)) {
            row = createRow(true);
        } else {
            row = createRow();
        }

        row = createSeats(row , seatMap[i], layout)
        fragment.appendChild(row)
    }
    return fragment
}

function magic(seatMap, layout) {
    let numRows = seatMap.length
    let layoutRows = layout.rows
    let layoutCols = layout.cols
    let fragment = document.createDocumentFragment()

    for (let i = 0; i < numRows; i++) {
        let row = createRow(layoutRows.includes(i+1))
        let numSeats = seatMap[i].length
        for (let j = 0; j < numSeats; j++ ) {
            let seat = createSeat(layoutCols.includes(j+1), seatMap[i][j], i+1, j+1)
            row.appendChild(seat);
        }
        fragment.appendChild(row)
    }
    return fragment
}

async function createSeatView() {
    const seatView = document.getElementById("seatView");
    const seatGuide = document.getElementById("seat-guide");
    let fragment = document.createDocumentFragment();
    let layout = await parseLayouts();
    let seatMap = await getSeatMap(1);

    fragment.appendChild(createScreen());
    fragment.appendChild(magic(seatMap,layout));
    let spaces = layout.cols.length
    // createRows(fragment, 10, 10, layout)
    seatView.innerHTML = "";
    seatView.style.width = `${calcSeatViewWidth(10,spaces)}px`
    seatGuide.style.width = `${calcSeatViewWidth(10,spaces)}px`
    seatView.appendChild(fragment);
}