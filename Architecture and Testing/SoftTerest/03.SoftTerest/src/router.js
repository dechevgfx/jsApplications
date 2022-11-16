export function init(links) {
    const main = document.querySelector("main");
    const nav = document.querySelector("nav");
    nav.addEventListener("click", onNavigate);

    const context = {
        showSection,
        redirectTo,
        updateNav,
    };

    return context;

    function showSection(section) {
        main.replaceChildren(section);
    }

    function onNavigate(event) {
        let target = event.target;
        if (target.tagName == "IMG") {
            target = target.parentElement;
        }

        if (target.tagName == "A") {
            event.preventDefault();

            let path = new URL(target.href).pathname;
            redirectTo(path);
        }
    }

    function redirectTo(linkName, ...data) {
        const handler = links[linkName];
        if (typeof handler == "function") {
            handler(context, ...data);
        }
    }

    function updateNav() {
        const user = localStorage.getItem("user");
        if (user) {
            nav.querySelectorAll(".user").forEach(
                (element) => (element.style.display = "block"),
            );
            nav.querySelectorAll(".guest").forEach(
                (element) => (element.style.display = "none"),
            );
        } else {
            nav.querySelectorAll(".user").forEach(
                (element) => (element.style.display = "none"),
            );
            nav.querySelectorAll(".guest").forEach(
                (element) => (element.style.display = "block"),
            );
        }
    }
}
