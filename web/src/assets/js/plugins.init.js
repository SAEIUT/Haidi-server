try {
    const tobii = new Tobii();
} catch (err) {
    console.error("Erreur avec Tobii:", err);
}

// Tiny SLider
if (document.getElementsByClassName('tiny-single-item').length > 0) {
    var slider = tns({
        container: '.tiny-single-item',
        items: 1,
        controls: false,
        mouseDrag: true,
        loop: true,
        rewind: true,
        autoplay: true,
        autoplayButtonOutput: false,
        autoplayTimeout: 3000,
        navPosition: "bottom",
        speed: 400,
        gutter: 0,
    });
}

// Data Counter
try {
    const counter = document.querySelectorAll('.counter-value');
    const speed = 2500;

    counter.forEach(counter_value => {
        const updateCount = () => {
            const target = +counter_value.getAttribute('data-target');
            const count = +counter_value.innerText;

            var inc = target / speed;

            if (inc < 1) {
                inc = 1;
            }

            if (count < target) {
                counter_value.innerText = (count + inc).toFixed(0);
                setTimeout(updateCount, 1);
            } else {
                counter_value.innerText = target;
            }
        };

        updateCount();
    });
} catch (err) {
    console.error("Erreur avec Data Counter:", err);
}