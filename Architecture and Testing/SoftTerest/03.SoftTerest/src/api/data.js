import { get, post, del } from "./api.js";

const endpoints = {
    ideas: "/data/ideas?select=_id%2Ctitle%2Cimg&sortBy=_createdOn%20desc",
    create: "/data/ideas",
    ideaById: "/data/ideas",
};

export async function getAllIdeas() {
    return get(endpoints.ideas);
}

export async function createIdea(ideaData) {
    return post(endpoints.create, ideaData);
}

export async function singleIdea(id) {
    return get(endpoints.ideaById + "/" + id);
}

export async function deleteIdea(id) {
    return del(endpoints.ideaById + "/" + id);
}
