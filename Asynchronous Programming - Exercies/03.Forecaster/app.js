import { html, render } from "../node_modules/lit-html/lit-html.js";

function attachEvents() {
    document
        .getElementById("submit")
        .addEventListener("click", getWeatherForecast);

    const locationInput = document.getElementById("location");
    const forecastElement = document.getElementById("forecast");
    // const currentWeatherElement = forecastElement.children[0];
    // const upcomingWeatherElement = forecastElement.children[1];

    async function getWeatherForecast() {
        const locationCode = await getLocation(locationInput.value);
        locationInput.value = "";

        const [currentWeatherObject, upcomingWeatherObject] = await Promise.all(
            [
                getCurrentForecast(locationCode),
                getUpcomingForecast(locationCode),
            ],
        );

        const symbols = {
            Sunny: "\u2600",
            "Partly sunny": "\u26C5",
            Overcast: "\u2601",
            Rain: "\u2614",
            Degrees: "\u00B0",
        };

        // currentWeatherDiv(currentWeatherObject);
        // upcomingWeatherDiv(upcomingWeatherObject);

        const mainTemplate = (obj) => html`<div id="current">
                <div class="label">Current conditions</div>
                <div class="forecasts">
                    <span class="condition symbol"
                        >${symbols[obj.forecast.condition]}</span
                    >
                    <span class="condition">
                        <span class="forecast-data">${obj.name}</span>
                        <span class="forecast-data"
                            >${obj.forecast.low}/${obj.forecast.high}${symbols[
                                "Degrees"
                            ]}</span
                        >
                        <span class="forecast-data"
                            >${obj.forecast.condition}</span
                        >
                    </span>
                </div>
            </div>
            <div id="upcoming">
                <div class="label">Three-day forecast</div>
                ${forecastTemplate(getUpcomingForecast(upcomingWeatherObject))}
            </div>`;

        const forecastTemplate = (data) => html`
            <div class="forecast-info">
                ${data.forecast.forEach((day) => {
                    html`<span class="upcoming">
                        <span class="symbol">${symbols[day.condition]}</span>
                        <span class="forecast-data"
                            >${day.low}${symbols[
                                "Degrees"
                            ]}/${day.high}${symbols["Degrees"]}</span
                        >
                        <span class="forecast-data">${day.condition}</span>
                    </span>`;
                })}
            </div>
        `;

        render(mainTemplate(currentWeatherObject, forecastElement));

        // function currentWeatherDiv(obj) {
        //     const currentDiv = document.createElement("div");
        //     currentDiv.classList.add("forecasts");

        //     const symbolSpan = document.createElement("div");
        //     symbolSpan.textContent = symbols[obj.forecast.condition];
        //     symbolSpan.classList.add("condition");
        //     symbolSpan.classList.add("symbol");

        //     const conditionSpan = document.createElement("span");
        //     conditionSpan.classList.add("condition");

        //     const spanName = document.createElement("span");
        //     spanName.classList.add("forecast-data");
        //     spanName.textContent = obj.name;

        //     const spanDegrees = document.createElement("span");
        //     spanDegrees.classList.add("forecast-data");
        //     spanDegrees.textContent = `${obj.forecast.low}${symbols["Degrees"]}/${obj.forecast.high}${symbols["Degrees"]}`;

        //     const spanCondition = document.createElement("span");
        //     spanCondition.classList.add("forecast-data");
        //     spanCondition.textContent = obj.forecast.condition;

        //     conditionSpan.appendChild(spanName);
        //     conditionSpan.appendChild(spanDegrees);
        //     conditionSpan.appendChild(spanCondition);

        //     currentDiv.appendChild(symbolSpan);
        //     currentDiv.appendChild(conditionSpan);

        //     currentWeatherElement.appendChild(currentDiv);
        // }

        // function upcomingWeatherDiv(obj) {
        //     const upcomingDiv = document.createElement("div");
        //     upcomingDiv.classList.add("forecast-info");

        //     obj.forecast.forEach((day) => {
        //         const daySpan = document.createElement("span");
        //         daySpan.classList.add("upcoming");

        //         const spanSymbol = document.createElement("span");
        //         spanSymbol.classList.add("symbol");
        //         spanSymbol.textContent = symbols[day.condition];

        //         const spanDegrees = document.createElement("span");
        //         spanDegrees.classList.add("forecast-data");
        //         spanDegrees.textContent = `${day.low}${symbols["Degrees"]}/${day.high}${symbols["Degrees"]}`;

        //         const spanCondition = document.createElement("span");
        //         spanCondition.classList.add("forecast-data");
        //         spanCondition.textContent = day.condition;

        //         daySpan.appendChild(spanSymbol);
        //         daySpan.appendChild(spanDegrees);
        //         daySpan.appendChild(spanCondition);
        //         upcomingDiv.appendChild(daySpan);
        //     });

        //     upcomingWeatherElement.appendChild(upcomingDiv);
        // }

        forecastElement.style.display = "";
    }

    async function getLocation(locationInput) {
        const url = "http://localhost:3030/jsonstore/forecaster/locations";

        try {
            const res = await fetch(url);
            const data = await res.json();
            const locationIndex = data.findIndex(
                (l) => l.name == locationInput,
            );

            if (res.status != 200 || locationIndex == -1) {
                throw new Error("Invalid request");
            }

            return data[locationIndex].code;
        } catch (error) {
            forecastElement.style.display = "";
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("label");
            errorDiv.textContent = "ERROR";
            errorDiv.style.textAlign = "center";
            forecastElement.replaceChildren(errorDiv);
        }
    }

    async function getCurrentForecast(code) {
        const url = "http://localhost:3030/jsonstore/forecaster/today/" + code;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }
    async function getUpcomingForecast(code) {
        const url =
            "http://localhost:3030/jsonstore/forecaster/upcoming/" + code;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }
}
attachEvents();
