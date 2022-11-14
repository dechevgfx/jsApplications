import { html, render } from "../node_modules/lit-html/lit-html.js";

document.getElementById("btnLoadTowns").addEventListener("click", getTowns);
const listTemplate = (data) => html`
    <ul>
        ${data.map((town) => html`<li>${town}</li>`)}
    </ul>
`;
function getTowns(e) {
    e.preventDefault();
    const townsInput = document.getElementById("towns").value;
    if (townsInput !== "") {
        const root = document.getElementById("root");
        const towns = townsInput.split(", ");

        const ul = document.createElement("ul");

        const result = listTemplate(towns);

        render(result, root);

        townsInput.value = "";
    }
}
