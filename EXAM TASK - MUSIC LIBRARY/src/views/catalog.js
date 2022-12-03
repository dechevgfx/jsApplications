import { getAll } from "../api/data.js";
import { html } from "../lib.js";

const catalogTemplate = (pets) => html`
    <section id="dashboard">
        <h2>Albums</h2>
        <ul class="card-wrapper">
            ${pets.length == 0
                ? html`<h2>There are no albums added yet.</h2>`
                : pets.map(petCardTemplate)}
        </ul>
    </section>
`;

const petCardTemplate = (pet) => html`<li class="card">
    <img src="${pet.imageUrl}" alt="travis" />
    <p>
        <strong>Singer/Band: </strong><span class="singer">${pet.singer}</span>
    </p>
    <p><strong>Album name: </strong><span class="album">${pet.album}</span></p>
    <p><strong>Sales:</strong><span class="sales">${pet.sales}</span></p>
    <a class="details-btn" href="/catalog/${pet._id}">Details</a>
</li>`;
export async function showCatalog(ctx) {
    const pets = await getAll();
    ctx.render(catalogTemplate(pets));
}
