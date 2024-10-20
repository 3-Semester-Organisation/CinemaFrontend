import { makeOption } from "./util.js";

export async function initSeatViewScript(showingId = 1, theatreId = 1) {
    console.log("Init seat view!")
    console.log("### calc: " + calcSeatViewWidth(15));
    console.log(seatWidth);
    await createSeatView(showingId, theatreId);
    setUpEvents();
    showingID = showingId;
    theatreID = theatreId;
}

const theatre_url = "http://localhost:8080/api/v1/theatre/"
const showing_url = "http://localhost:8080/api/v1/showing/"
const buy_url = "http://localhost:8080/api/v1/seatbooking"

const layoutSpace = 32;
const seatWidth = 20;

let showingID;
let theatreID;
let pickedSeats = []

async function getSeatMap(id) {
    let seatMap
    try {
        seatMap = await fetch(`${showing_url + id}/seatmap`)
    } catch (err) {
        console.error(err)
    }
    let seatMapJson = await seatMap.json()
    console.log("## SEAT MAP:  ", seatMapJson.seatMap)
    return seatMapJson.seatMap
}


async function getLayouts(theatreId) {
    try {
        let layouts = await fetch(`${theatre_url + theatreId}/layouts`)
        return await layouts.json()
    } catch (error) {
        console.log(error)
    }
    return undefined
}


async function parseLayouts(showingId) {
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

function calcSeatViewWidth(seatNumber, spaces) {
    let margin = 8 // mx-1
    console.log("#### CALCING ON GOING")
    return (seatWidth + margin) * seatNumber + 90 + (layoutSpace * spaces);
}

function createScreen() {
    const screen = document.createElement("div");
    screen.id = "screen"
    screen.classList.add("text-center", "mt-2")
    return screen;
}

function createRow(rowSpace = false) {
    const row = document.createElement("div");
    if (rowSpace) {
        row.classList.add("row", "mb-4", "mx-auto", "theatre-row", "d-flex", "justify-content-center");
    } else {
        row.classList.add("row", "mb-2", "mx-auto", "theatre-row", "d-flex", "justify-content-center");
    }
    return row;
}

function createSeat(space = false, type, row, col) {
    const seat = document.createElement("div")
    if (space) {
        seat.classList.add("seat", "ms-1", "me-4")
    } else {
        seat.classList.add("seat", "mx-1")
    }
    seat.classList.add(type)
    seat.dataset.row = row;
    seat.dataset.seat = col
    return seat
}

function magic(seatMap, layout) {
    let numRows = seatMap.length
    let layoutRows = layout.rows
    let layoutCols = layout.cols
    let fragment = document.createDocumentFragment()

    for (let i = 0; i < numRows; i++) {
        let row = createRow(layoutRows.includes(i + 1))
        let numSeats = seatMap[i].length
        for (let j = 0; j < numSeats; j++) {
            let seat = createSeat(layoutCols.includes(j + 1), seatMap[i][j], i + 1, j + 1)
            row.appendChild(seat);
        }
        fragment.appendChild(row)
    }
    return fragment
}

async function createSeatView(showingId, theatreId) {
    const seatView = document.getElementById("seatView");
    const seatGuide = document.getElementById("seat-guide");
    let fragment = document.createDocumentFragment();
    let layout = await parseLayouts(theatreId);
    let seatMap = await getSeatMap(showingId);

    fragment.appendChild(createScreen());
    fragment.appendChild(magic(seatMap, layout));
    let spaces = layout.cols.length
    seatView.innerHTML = "";
    seatView.style.width = `${calcSeatViewWidth(10, spaces)}px`
    seatGuide.style.width = `${calcSeatViewWidth(10, spaces)}px`
    seatView.appendChild(fragment);
}

function createSeatBooking(row, seat) {
    let seatBooking = {}
    seatBooking.row = row
    seatBooking.seat = seat
    return seatBooking
}

function renderPickedSeats() {
    const seatChoice = document.getElementById("seatChoice")
    let count = pickedSeats.length
    seatChoice.innerHTML = '';
    seatChoice.innerHTML = `<p> You've picked ${count} seats!</p>`
    console.log("SEDATS: ", pickedSeats)
    console.log("showingId: ", showingID)
}

function handleSeatClick(e) {
    const target = e.target;
    if (!target.classList.contains("seat")) return;
    if (target.classList.contains("occupied")) return;
    let toggle = target.classList.toggle("picked")
    let row = target.dataset.row
    let seat = target.dataset.seat
    let seatBooking = createSeatBooking(row, seat)
    if (toggle) {
        pickedSeats.push(seatBooking)
    } else {
        pickedSeats = pickedSeats
            .filter((sb) => sb.seatRowNumber !== seatBooking.seatRowNumber || sb.seatNumber !== seatBooking.seatNumber)
    }
    renderPickedSeats()
}


function createBookingRequest() {
    let seatBookingRequest = {}
    seatBookingRequest.showingId = showingID;
    seatBookingRequest.email = "default@email.dk"
    seatBookingRequest.bookedSeats = pickedSeats
    return seatBookingRequest;
}

async function buyTickets() {
    if (pickedSeats.length === 0) return;
    let request = createBookingRequest()
    let options = makeOption("POST", request)
    console.log("OPTIONS: ", options)
    try {
        await fetch(buy_url, options)
    } catch (e) {
        console.error(e)
    }
    pickedSeats = []
    renderPickedSeats()
    await initSeatViewScript(showingID,theatreID)

}


function setUpEvents() {
    const seatView = document.getElementById("seatView");
    const buyBtn = document.getElementById("BuyBtn");
    buyBtn.addEventListener("click", buyTickets)
    seatView.addEventListener("click", handleSeatClick)
}
