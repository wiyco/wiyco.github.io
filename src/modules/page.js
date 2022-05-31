class TemplPage {
    constructor(props) {
        this.h2 = props.h2;
        this.fname = props.fname;
    }
    async getPage() {
        const response = await fetch(`./src/templates/${this.fname}.html`)
            .catch((e) => {
                console.error(`fetch("./src/templates/${this.fname}.html"): ${e.name}: ${e.message}`);
            });
        const data = await response.text()
            .catch((e) => {
                console.error(`response.text(): ${e.name}: ${e.message}`);
            });
        return `<h2>${this.h2.toUpperCase()}</h2>\
                <div class="wrap">${data}</div>`;
    }
}

export { TemplPage }
