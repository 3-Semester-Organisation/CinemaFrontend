const SHOWINGS_URL = "http://127.0.0.1:8080/api/v1/showings"

async function displayShowings(movie) {

    const option = makeOption("GET", movie);

    try {
        const response = await fetch(SHOWINGS_URL, option)
        checkForErrors(response); //if there are errors throw new error, which gets caught in the catch.
        const showingsList = await response.json();

        const showingsGrid = document.getElementById("showings-grid");
        const nextSevenDaysFromCurrentDate = getNextSevenDays();


        for (const showingDay in nextSevenDaysFromCurrentDate) {
            const column = document.createElement("div");
            column.classList.add("col");

            const header = document.createElement("div");
            header.classList.add("column-header text-center")
            header.innerText = showingDay.toString();
            column.appendChild(header);



            for (let i = 0; i < showingsList.length; i++) {
                const showingCard = document.createElement("a");
                showingCard.classList.add("text-decoration-none");

                let showingDate = parseJsonLocalDateTimeToDate(showingsList[i].startTime.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/));

                showingDate = showingDate.getDay();
                let showingTime = showingDate.getTime();

                if (showingDay === showingDate) {
                    showingCard.innerHTML += `
                    <div class="card showing-card">
                        <div class="card-body">
                           <h5 class="card-title">${showingsList[i].theatre.name}</h5>
                           <p class="card-text">${showingTime}</p>
                       </div>
                    </div>
                       `
                }

                showingsList.splice(i, 1); //might not work
                column.appendChild(showingCard);
            }

            showingsGrid.appendChild(column);
        }

    } catch
        (error) {
            printError(error);
        }
    }



    function makeOption(httpMethod, requestBody) {
    const option = {
            method: httpMethod.toUpperCase(),
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            }
        }

        if (requestBody) {
            option.body = JSON.stringify(requestBody);
        }

        return option;
    }





    function checkForErrors(response) {
        if (!response.ok) {
            let errorResponse = response.json();
            let error = new Error(errorResponse.message);
            error.apiError = errorResponse;
            throw error;
        }
    }



    function printError(error) {
        console.error(error.message)
    }



    function getNextSevenDays() {
        const daysArray = [];
        const currentDate = new Date();

        daysArray.push(currentDate);
        for (let i = 0; i < 6; i++) {
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDay() + i);

            daysArray.push(nextDate);
        }

        return daysArray;
    }

    function parseJsonLocalDateTimeToDate(jsonLocalDateTime) {
        if (!jsonLocalDateTime) {
            console.error("Invalid LocalDateTime format");
            return
        }

        const year = parseInt(jsonLocalDateTime[1]);
        const month = parseInt(jsonLocalDateTime[2]) - 1; // Months are 0-based
        const day = parseInt(jsonLocalDateTime[3]);
        const hours = parseInt(jsonLocalDateTime[4]);
        const minutes = parseInt(jsonLocalDateTime[5]);
        const seconds = parseInt(jsonLocalDateTime[6]);

        return new Date(year, month, day, hours, minutes, seconds);
    }