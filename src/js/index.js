/* **************************************************
Coding in Vanilla JS
Performance fence
************************************************** */

import * as ContentData from "../modules/content.js";

// window loading
const loading = async () => {
    const bar = new ProgressBar.Line("#loading-path", {
        easing: "easeInOut",
        duration: 2800,
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
        step: (state, path, attachment) => {
            path.setText(Math.round(path.value() * 100) + " %");
        }
    });
    // Number from 0.0 to 1.0
    // bar.animate(1.0, () => {
    //     document.getElementsByTagName("main")[0].style.cssText = "display: inline;";
    //     document.querySelector("#loading, #loading-path").classList.add("loaded");
    //     floatUpObserve();
    // });

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
    const contentHTML = await data.map((item, index) => {
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
    await Promise.all(contentHTML)
        .then(() => {
            // bar ~33%
            bar.animate(0.33);
            // remove innerHTML <main><div class="wrap">
            document.querySelector("main div.wrap").innerHTML = "";
        })
        .catch((e) => {
            console.error(`Promise.all(contentHTML): ${e.name}: ${e.message}`);
        });
    // merge into <main><div class="wrap">
    const contentHTMLmerge = await contentHTML.map((item, index) => {
        // document.querySelector("main div.wrap").innerHTML += item;
        return document.querySelector("main div.wrap").insertAdjacentHTML("beforeend", item);
    });
    await Promise.all(contentHTMLmerge)
        .then(() => {
            // bar ~66%
            bar.animate(0.66);
            // enable <main>
            document.getElementsByTagName("main")[0].style.cssText = "display: inline;";
        })
        .then(() => {
            // bar ~100%
            bar.animate(1, () => {
                // hide loading screen
                document.querySelector("#loading, #loading-path").classList.add("loaded");
                floatUp();
            });
        })
        .catch((e) => {
            console.error(`Promise.all(contentHTMLmerge): ${e.name}: ${e.message}`);
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
        entries.forEach((entry, index) => {
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
    document.querySelectorAll("div.float-up").forEach((elem, index) => {
        observer.observe(elem);
    });
}

// window loaded
window.onload = () => {

    loading();

    // burger clicked - header
    document.getElementById("burger").onclick = () => {
        document.querySelectorAll("#burger, ul.navi").forEach((elem, index) => {
            elem.classList.toggle("opened");
        });
    }

    // contact clicked - footer
    document.getElementById("social").onclick = () => {
        document.querySelectorAll("#social, #social-box").forEach((elem, index) => {
            elem.classList.toggle("opened");
        });
    }
}
