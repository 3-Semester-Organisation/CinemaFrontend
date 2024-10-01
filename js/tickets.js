let showingList = ["movie1", "movie2", "movie3"]

const getShowingsTest = list => {
    return showingList
}

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
const formFormatter = json => {

    let showingList = [];

    for (let showing of json) {
        let theatre = showing.theatre;
        let movie = showing.movie.title;
        let time = showing.startTime;    
        showingList.push({
            theatre: theatre,
            movie: movie,
            time: time
        })
    }

    // convert to html for use in form control
    let html = "";
    for (let showing of showingList) {
        html += `<option value="${showing.theatre}">${showing.movie} - ${showing.time}</option>`
    }

    return html;
}

addEventListener('DOMContentLoaded', async () => {
    let showings = await getShowings();
    let html = formFormatter(showings);
    document.getElementById('selectBody').innerHTML = html;
})


const getBookings = async showingId => {
    try {
        const res = await fetch(`http://localhost/api/v1/bookings?showingId=${showingId}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const showings = await res.json();
        console.log(showings);
        return showings;
    } catch (error) {
        console.error('Problem with fetch operation on getbookings: ', error);
    }
}