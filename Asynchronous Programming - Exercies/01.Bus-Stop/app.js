async function getInfo() {
    const stopNameElement = document.getElementById("stopName");
    const timetableElement = document.getElementById("buses");

    const stopId = document.getElementById("stopId").value;
    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

    try {
        stopNameElement.textContent = "Loading..";
        timetableElement.replaceChildren();
        const response = await fetch(url);

        if (response.status !== 200) {
            throw new Error("Stop ID not found!");
        }
        const data = await response.json();

        stopNameElement.textContent = data.name;

        Object.entries(data.buses).forEach((bus) => {
            let [busId, time] = bus;
            const liElement = document.createElement("li");
            liElement.textContent = `Bus ${busId} arrives in ${time} minutes`;
            timetableElement.appendChild(liElement);
        });
    } catch (error) {
        stopNameElement.textContent = "Error";
    }
}
