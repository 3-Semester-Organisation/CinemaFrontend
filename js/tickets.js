async function initTicketsView() {
    
        let showings = await getShowings();
        let html = htmlFormatter(showings);
        document.getElementById('selectBody').innerHTML = html;
        document.getElementById('selectBody').onchange = async () => {
            let showingId = document.getElementById('selectBody').value;
            fillTable(showingId);
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
    let html = "";
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
        <td>${booking.customer.name}</td>
        <td>${booking.customer.email}</td>
        </tr>`
    }
    document.getElementById('tableBody').innerHTML = html;
}
    
export { initTicketsView };