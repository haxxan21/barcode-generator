
<script type="text/javascript">
(() => {
    let processing = false;
    let observer;

    function checkOrder() {
        const parent = document.querySelector(".yohtmlc-order-id");
        const p = parent?.children[1];

        if (!p || processing || p.dataset.barcodeGenerated) {
            return;
        }

        const value = p.textContent.trim();

        if (!value) return;

        processing = true;

        const run = () => {
            try {
                const box = document.createElement("div");
                box.id = "dynamic-barcode";

                const svg = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                );

                box.appendChild(svg);

                JsBarcode(svg, value, {
                    format: "CODE128",
                    width: 2,
                    height: 50,
                    displayValue: true,
                    margin: 5
                });

                p.insertAdjacentElement("afterend", box);

                p.dataset.barcodeGenerated = "true";

                console.log("Barcode generated:", value);

                observer.disconnect();

            } catch (e) {
                processing = false;
                alert("Barcode error: " + e.message);
            }
        };

        if (window.JsBarcode) {
            run();
        } else {
            const s = document.createElement("script");

            s.src = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";

            s.onload = run;

            s.onerror = () => {
                processing = false;
                alert("Could not load barcode library");
            };

            document.head.appendChild(s);
        }
    }

    // Observe dynamically rendered Amazon content
    observer = new MutationObserver(checkOrder);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Also check immediately in case content already exists
    checkOrder();

})();
</script>
