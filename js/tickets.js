async function initTicketsView() {
    
        let showings = await getShowings();
        let html = htmlFormatter(showings);
        document.getElementById('selectBody').innerHTML = html;
        document.getElementById('selectBody').onchange = async () => {
            let showingId = document.getElementById('selectBody').value;
            let bookings = await getBookings(showingId);
            let bookingId = bookings[0].id;
            let seatBookings = await getSeatBookings(bookingId);
            fillTable(bookings, seatBookings);
        }
    
    console.log('Tickets view initialized');
}


// fetches all showings from the database
const getShowings = async () => {
    try {
        const res = await fetch(`http://localhost:8080/api/v1/allshowings`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const showings = await res.json();
        return showings;
    } catch (error) {
        console.error('Problem with fetch operation on getShowings: ', error);
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
        
        // Extract hours and minutes in 24-hour format
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

    // convert to html for use in form control
    let html = `<option value="" selected disabled>Select a showing</option>`; // sets initial value to disabled
    for (let showing of showingList) {
        html += `<option value="${showing.id}">${showing.theatre} | ${showing.movie} - ${showing.time}</option>`
    }

    return html;
}


const getBookings = async showingId => {
    try {
        const res = await fetch(`http://localhost:8080/api/v1/bookings?showingId=${showingId}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const bookings = await res.json();
        return bookings;
    } catch (error) {
        console.error('Problem with fetch operation on getbookings: ', error);
    }
}

const getSeatBookings = async bookingId => {
    try {
        const res = await fetch(`http://localhost:8080/api/v1/seatbookings?bookingId=${bookingId}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const seatBookings = await res.json();
        return seatBookings;
    } catch (error) {
        console.error('Problem with fetch operation on getSeatBookings: ', error);
    }
}

// gonna have to look this over again.. it works tho
const fillTable = async (bookingList, seatBookingList) => {
    const bookings = bookingList;
    const seatBookings = seatBookingList;
    console.log('Bookings: ', bookings);
    console.log('Seat bookings: ', seatBookings);

    // Create a map of seat bookings by booking ID
    const seatBookingMap = new Map();
    for (let seatBooking of seatBookings) {
        if (!seatBookingMap.has(seatBooking.booking.id)) {
            seatBookingMap.set(seatBooking.booking.id, []);
        }
        seatBookingMap.get(seatBooking.booking.id).push(seatBooking);
        console.log(seatBookingMap);
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