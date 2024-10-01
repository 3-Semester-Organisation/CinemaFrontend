let showingList = ["movie1", "movie2", "movie3"]

const getShowings = async () => {
    try {
        const res = await fetch(`http://localhost/allshowings`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const showings = await res.json();
        console.log(showings);
        return showings;
    } catch (error) {
        
    }
}