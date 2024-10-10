import {checkForHttpErrors, makeAuthOption} from "./util.js";

async function initTicketsView() {
    await loadShowings();
    await updateTable();
    console.log('Tickets view initialized');
}

const loadShowings = async () => {
    let showings = await getShowings();
    let showingHtml = htmlFormatter(showings);
    document.getElementById('selectBody').innerHTML = showingHtml; // set the select options
}

const updateTable = async () => {
    document.getElementById('selectBody').onchange = async () => { // when a showing is selected
        document.getElementById('tableBody').innerHTML = ''; // clear the table
        let showingId = document.getElementById('selectBody').value; // get the showing id

        const token = localStorage.getItem("jwtToken");
        const getOption = makeAuthOption("GET", null, token);
        let bookings = await getBookings(showingId, getOption); // get the bookings for showing

        if (!bookings || bookings.length === 0) {
            document.getElementById('errorContainer').innerHTML = '<p>No bookings found.</p>';
            return;
        }
        errorContainer.innerHTML = ''; // clear any previous errors
        
        let bookingId = bookings[0].id; // get the booking id
        let seatBookings = await getSeatBookings(bookingId, getOption); // get the seat bookings for booking
        fillTable(bookings, seatBookings); // fill the table with the bookings and seat bookings
    }
}

// takes a json object of all showings, and converts it to a list of objects
const htmlFormatter = json => {
    let showingList = [];

    for (let showing of json) {
        let id = showing.id;
        let theatre = showing.theatre.name;
        let movie = showing.movie.title;
        let time = new Date(showing.startTime);
        
        // Extract hours and minutes to 24-hour format
        let hours = time.getHours().toString().padStart(2, '0');
        let minutes = time.getMinutes().toString().padStart(2, '0');
        let formattedTime = `${hours}:${minutes}`;

        showingList.push({
            id: id,
            theatre: theatre,
            movie: movie,
            time: formattedTime
        })
    }

    // convert to html for use in form
    // sets initial value to disabled
    let html = `<option value="" selected disabled>Select a showing</option>`; 
    for (let showing of showingList) {
        html += `<option value="${showing.id}">${showing.theatre} | ${showing.movie} - ${showing.time}</option>`
    }

    return html;
}

// fetches all showings from the database
const getShowings = async () => {
    try {
        const res = await fetch(`http://localhost:8080/api/v1/showings/all`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const showings = await res.json();
        return showings;
    } catch (error) {
        console.error('Problem with fetch operation on getShowings: ', error);
    }
}

// fetches all bookings for a specific showing
const getBookings = async (showingId, token) => {

    try {
        const res = await fetch(`http://localhost:8080/api/v1/bookings?showingId=${showingId}`, token);
        checkForHttpErrors(res)
        let bookings = await res.json();

        if (!bookings || bookings.length === 0) {
            return [];
        }

        return bookings;

    } catch (error) {
        console.error('Problem with fetch operation on getbookings: ', error);
        return [];
    }
}

// fetches all seat bookings for a specific booking
const getSeatBookings = async (bookingId, token) => {

    try {
        const res = await fetch(`http://localhost:8080/api/v1/seatbooking?bookingId=${bookingId}`, token);
        checkForHttpErrors(res);
        return await res.json();

    } catch (error) {
        console.error('Problem with fetch operation on getSeatBookings: ', error);
    }
}

// gonna have to look this over again.. it works tho
const fillTable = async (bookingList, seatBookingList) => {
    const bookings = bookingList;
    const seatBookings = seatBookingList;

    if (!bookings || bookings.length === 0) {
        document.getElementById('errorContainer').innerHTML = '<p>No bookings found</p>';
        return;
    }

    // Create a map of seat bookings by booking ID
    const seatBookingMap = new Map();
    for (let seatBooking of seatBookings) {
        if (!seatBookingMap.has(seatBooking.id)) {
            seatBookingMap.set(seatBooking.id, []);
        }
        seatBookingMap.get(seatBooking.id).push(seatBooking);
    }

    let html = "";
    for (let booking of bookings) {
        const seatBookingList = seatBookingMap.get(booking.id) || [];
        for (let seatBooking of seatBookingList) {
            html += `<tr>
            <td>${booking.customer.name}</td>
            <td>${booking.customer.email}</td>
            <td>${seatBooking.seatRowNumber}</td>
            <td>${seatBooking.seatNumber}</td>
            </tr>`;
        }
    }
    document.getElementById('tableBody').innerHTML = html;
}
    
export { initTicketsView };