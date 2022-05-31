class BasicData {
    constructor(props) {
        this.href = props.href;
        this.src = props.src;
        this.title = props.title;
        this.h3span = props.h3span;
    }
    /**
     * @param {string} props
     */
    set html(props) {
        this.href = props.href;
        this.src = props.src;
        this.title = props.title;
        this.h3span = props.h3span;
    }
}

// <img>
const Image = class extends BasicData {
    set html(props) {
        super.html = props;
    }
    get html() {
        return `<div class="item float-up">\
                <a href="${this.href}" target="_blank" rel="noopener noreferrer">\
                <img class="thumb" src="${this.src}" alt="${this.title}">\
                <h3><span>${this.h3span}</span></h3>\
                </a>\
                </div>`;
    }
}

// <iframe>
const Iframe = class extends BasicData {
    constructor(props) {
        super(props);
        this.allow = props.allow || [];
        this.options = props.options || {};
    }
    set html(props) {
        super.html = props;
        this.allow = props.allow || [];
        this.options = props.options || {};
    }
    get html() {
        return `<div class="item float-up">\
                <a href="${this.href}" target="_blank" rel="noopener noreferrer">\
                <div class="thumb">\
                <iframe class="${this.options.class}" src="${this.src}" title="${this.title}" \
                frameborder="0" allow="${this.allow.join(";")}" allowfullscreen></iframe>\
                </div>\
                <h3><span>${this.h3span}</span></h3>\
                </a>\
                </div>`;
    }
}

export { Image, Iframe }
