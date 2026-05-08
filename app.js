(() => {
    let gradientType = 'linear';
    const preview = document.getElementById('preview');
    const directionSelect = document.getElementById('direction');
    const directionGroup = document.getElementById('direction-group');
    const colorStopsDiv = document.getElementById('color-stops');
    const cssOutput = document.getElementById('css-output');

    document.querySelectorAll('[data-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('btn-active'));
            btn.classList.add('btn-active');
            gradientType = btn.dataset.type;
            directionGroup.style.display = gradientType === 'linear' ? '' : 'none';
            updateGradient();
        });
    });

    function getStops() {
        const stops = [];
        colorStopsDiv.querySelectorAll('.color-stop').forEach(el => {
            stops.push({
                color: el.querySelector('.stop-color').value,
                position: parseInt(el.querySelector('.stop-position').value)
            });
        });
        return stops;
    }

    function updateGradient() {
        const stops = getStops();
        const stopsCSS = stops.map(s => s.color + ' ' + s.position + '%').join(', ');
        let gradient;
        if (gradientType === 'linear') {
            gradient = 'linear-gradient(' + directionSelect.value + ', ' + stopsCSS + ')';
        } else {
            gradient = 'radial-gradient(circle, ' + stopsCSS + ')';
        }
        preview.style.background = gradient;
        cssOutput.value = 'background: ' + gradient + ';';
    }

    function addColorStop(color, position) {
        const count = colorStopsDiv.querySelectorAll('.color-stop').length + 1;
        const div = document.createElement('div');
        div.className = 'color-stop';
        div.innerHTML =
            '<label>Color ' + count + '</label>' +
            '<input type="color" class="stop-color" value="' + color + '">' +
            '<input type="number" class="stop-position" value="' + position + '" min="0" max="100">' +
            '<span class="unit">%</span>' +
            '<button class="btn-remove" title="Remove">&times;</button>';

        div.querySelector('.stop-color').addEventListener('input', updateGradient);
        div.querySelector('.stop-position').addEventListener('input', updateGradient);
        div.querySelector('.btn-remove').addEventListener('click', () => {
            if (colorStopsDiv.querySelectorAll('.color-stop').length > 2) {
                div.remove();
                updateGradient();
            }
        });

        colorStopsDiv.appendChild(div);
        updateGradient();
    }

    document.getElementById('btn-add-stop').addEventListener('click', () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        addColorStop(randomColor, 50);
    });

    document.getElementById('btn-random').addEventListener('click', () => {
        const stops = colorStopsDiv.querySelectorAll('.color-stop');
        stops.forEach(el => {
            el.querySelector('.stop-color').value = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        });
        updateGradient();
    });

    document.getElementById('btn-copy').addEventListener('click', () => {
        navigator.clipboard.writeText(cssOutput.value);
    });

    directionSelect.addEventListener('change', updateGradient);

    colorStopsDiv.querySelectorAll('.stop-color').forEach(el => el.addEventListener('input', updateGradient));
    colorStopsDiv.querySelectorAll('.stop-position').forEach(el => el.addEventListener('input', updateGradient));

    updateGradient();
})();
