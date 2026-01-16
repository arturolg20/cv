async function loadCV(jsonPath) {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error("No se pudo cargar el JSON: " + jsonPath);
    return res.json();
}

function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);

    Object.entries(attrs).forEach(([k, v]) => {
        node.setAttribute(k, v);
    });

    children.forEach(c => {
        node.appendChild(
            typeof c === "string"
                ? document.createTextNode(c)
                : c
        );
    });

    return node;
}


function renderCV(data) {
    // Meta (para SEO/preview)
    document.title = data.meta?.title ?? "CV";
    const desc = document.querySelector('meta[name="description"]');
    if (desc && data.meta?.description) desc.setAttribute("content", data.meta.description);

    const root = document.querySelector("#cv");
    root.innerHTML = "";

    root.appendChild(el("header", { class: "header" }, [
        el("h1", {}, [data.profile.name]),
        el("p", { class: "headline" }, [data.profile.headline]),
        el("p", { class: "meta" }, [data.profile.location]),
        el("p", { class: "links" }, [
            `${data.profile.email} · `,
            el("a", { href: data.profile.linkedin, target: "_blank", rel: "noopener" }, ["LinkedIn"]),
            " · ",
            el("a", { href: data.profile.github, target: "_blank", rel: "noopener" }, ["GitHub"])
        ])
    ]));

    root.appendChild(el("section", { class: "section" }, [
        el("h2", {}, ["Resumen"]),
        el("p", {}, [data.profile.summary])
    ]));

    root.appendChild(el("section", { class: "section" }, [
        el("h2", {}, ["Skills"]),
        el("ul", { class: "chips" }, data.skills.map(s => el("li", {}, [s])))
    ]));

    root.appendChild(el("section", { class: "section" }, [
        el("h2", {}, ["Experiencia"]),
        ...data.experience.map(job =>
            el("article", { class: "item" }, [
                el("h3", {}, [`${job.role} — ${job.company}`]),
                el("p", { class: "period" }, [job.period]),
                el("ul", {}, job.bullets.map(b => el("li", {}, [b])))
            ])
        )
    ]));

    root.appendChild(el("section", { class: "section" }, [
        el("h2", {}, ["Formación"]),
        ...data.education.map(ed =>
            el("article", { class: "item" }, [
                el("h3", {}, [ed.title]),
                el("p", { class: "period" }, [`${ed.org} · ${ed.period}`])
            ])
        )
    ]));

    if (data.languages && data.languages.length) {
        root.appendChild(el("section", { class: "section" }, [
            el("h2", {}, ["Idiomas"]),
            el("ul", { class: "languages" }, data.languages.map(l =>
                el("li", {}, [
                    el("span", { class: "lang-name" }, [l.name]),
                    el("span", { class: "lang-level" }, [l.level])
                ])
            ))
        ]));
    }

}

// En cada página pondremos un data-json="..."
(async () => {
    const app = document.querySelector("[data-json]");
    const path = app.getAttribute("data-json");
    const data = await loadCV(path);
    renderCV(data);
})();
