import { html, render } from "../node_modules/lit-html/lit-html.js";

window.onload = solve();

function solve() {
    document.querySelector("#searchBtn").addEventListener("click", onClick);
    const body = document.querySelector("body > table > tbody");
    let word = null;

    const template = (data) => html`
        <tr class=${search(data) ? "select" : ""}>
            <td>${data.firstName} ${data.lastName}</td>
            <td>${data.email}</td>
            <td>${data.course}</td>
        </tr>
    `;
    update();

    // on click search is activated actually
    function onClick() {
        word = document.getElementById("searchField").value;
        document.getElementById("searchField").value = ""; // clear

        update();
    }

    function search(el) {
        let searches = Object.values(el).map((e) => e.toLowerCase());
        for (let data of searches) {
            if (word && data.includes(word.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    async function update() {
        let data = await getData();
        render(Object.values(data).map(template), body);
    }

    async function getData() {
        let response = await fetch(`http://localhost:3030/jsonstore/advanced/table`);
        return await response.json();
    }
}
