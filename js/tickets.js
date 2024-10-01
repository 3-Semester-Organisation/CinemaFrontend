
// fetches all showings from the database
const getShowings = async () => {
    try {
        const res = await fetch(`http://localhost:8080/api/v1/allshowings`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const showings = await res.json();
        console.log(showings);
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
        let theatre = showing.theatre;
        let movie = showing.movie.title;
        let time = showing.startTime;    
        showingList.push({
            id: id,
            theatre: theatre,
            movie: movie,
            time: time
        })
    }

    // convert to html for use in form control
    let html = "";
    for (let showing of showingList) {
        html += `<option value="${showing.id}">Sal: ${showing.theatre} | ${showing.movie} - ${showing.time}</option>`
    }

    return html;
}

addEventListener('DOMContentLoaded', async () => {
    let showings = await getShowings();
    let html = htmlFormatter(showings);
    document.getElementById('selectBody').innerHTML = html;
})


const getBookings = async showingId => {
    try {
        const res = await fetch(`http://localhost/api/v1/bookings?showingId=${showingId}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const bookings = await res.json();
        console.log(bookings);
        return bookings;
    } catch (error) {
        console.error('Problem with fetch operation on getbookings: ', error);
    }
}

const fillTable = async showingId => {
    let bookings = await getBookings(showingId);
    let html = "";
    for (let booking of bookings) {
        html += `<tr>
        <td>${booking.customerName}</td>
        <td>${booking.customerEmail}</td>
        <td>${booking.seatBooking.rowNumber}</td>
        <td>${booking.seatBooking.seatNumber}</td>
        </tr>`
    }
    document.getElementById('tableBody').innerHTML = html;
}
