/* **************************************************
Coding in Vanilla JS
Performance preference
************************************************** */

import * as ContentData from "../modules/content.js";
import * as PageData from "../modules/page.js";

// window loading
const loading = async () => {
    const bar = new ProgressBar.Line("#loading-path", {
        easing: "easeInOut",
        duration: 2600,
        strokeWidth: 0.2,
        color: "#1f1f1f",
        trailWidth: 0.3,
        trailColor: "#e5e5e5",
        svgStyle: { width: "100%", height: "100%" },
        text: {
            style: {
                "font-family": "\"M PLUS Rounded 1c 400\", sans-serif",
                "font-size": "1rem",
                color: "#1f1f1f",
                position: "absolute",
                top: "50%",
                left: "50%",
                padding: 0,
                margin: "-1rem 0 0 0",
                transform: "translate(-50%, -50%)",
            },
            autoStyleContainer: false
        },
        // from: { color: "#FFEA82" },
        // to: { color: "#ED6A5A" },
        step: (state, path) => {
            path.setText(Math.round(path.value() * 100) + " %");
        }
    });

    // bar ~50%
    bar.animate(0.5);
    // element of content
    const wrap = document.querySelector("main div.wrap");
    // modules of contentHTML
    const contentImage = new ContentData.Image({});
    const contentIframe = new ContentData.Iframe({});
    // json
    const response = await fetch("./data/ContentData.json")
        .catch((e) => {
            console.error(`fetch("./data/ContentData.json"): ${e.name}: ${e.message}`);
        });
    const data = await response.json()
        .catch((e) => {
            console.error(`response.json(): ${e.name}: ${e.message}`);
        });
    // format
    const contentConverter = data.map(async (item) => {
        if (item.DataType == "image") {
            contentImage.html = item;
            return contentImage.html;
        }
        else if (item.DataType == "iframe") {
            contentIframe.html = item;
            return contentIframe.html;
        } else {
            console.info(`item.DataType: ${item.DataType}: unregistered value.`);
        }
    });
    await Promise.all(contentConverter)
        .then((result) => {
            // result.forEach((item) => {
            //     wrap.insertAdjacentHTML("beforeend", item);
            // });
            // merge items into <main><div class="wrap">
            wrap.insertAdjacentHTML("beforeend", result.join(""));
            // bar ~100%
            bar.animate(1.0, () => {
                // add float-up event to content
                floatUp();
                // enable <main><div class="wrap">
                wrap.style.cssText = "display: flex;";
                // hide loading screen
                document.getElementById("loading").classList.add("loaded");
            });
        })
        .catch((e) => {
            console.error(`Promise.all(contentHTML): ${e.name}: ${e.message}`);
        });
}

// float up cards - performance
function floatUp() {
    const options = {
        root: null,
        rootMargin: "18px 0px 18px 0px",
        threshold: [0.0, 0.5, 1.0]
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            let rect = entry.target.getBoundingClientRect();
            // visible range
            if ((0 < rect.top && rect.top < window.innerHeight) ||
                (0 < rect.bottom && rect.bottom < window.innerHeight) ||
                (0 > rect.top && rect.bottom > window.innerHeight)) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    }, options);
    // add eventlistener
    document.querySelectorAll("div.float-up").forEach((elem) => {
        observer.observe(elem);
    });
}

// load page - change fname value to this.id in prod & store each file in templates
function loadPage(elem) {
    const page = new PageData.TemplPage({
        h2: elem.innerText,
        fname: "none"
    });
    page.getPage()
        .then((result) => {
            history.replaceState(null, null, elem.id);
            document.title = `wiyco | ${elem.parentElement.title}`;
            document.getElementsByTagName("main")[0].innerHTML = result;
            document.querySelector("main div.wrap").style.cssText = "display: inherit;";
        });
}

// window loaded
window.onload = () => {

    loading();

    // burger clicked - header
    document.getElementById("burger").onclick = () => {
        document.querySelectorAll("#burger, ul.navi, main").forEach((elem) => {
            elem.classList.toggle("opened");
        });
    }

    // contact clicked - footer
    document.getElementById("social").onclick = () => {
        document.querySelectorAll("#social, #social-box").forEach((elem) => {
            elem.classList.toggle("opened");
        });
    }

    // header navi-bar #id clicked
    document.querySelectorAll("#works, #skills").forEach((elem) => {
        elem.onclick = function () {
            loadPage(this);
        }
    });
}
