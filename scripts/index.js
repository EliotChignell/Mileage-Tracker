const form = document.querySelector('form');
const start_radio = document.querySelector('#start');
const end_radio = document.querySelector('#end');
const stats = document.querySelector('#stats');
const clear_session = document.querySelector('#clear_session');

const defaults = {
    my_mileage: 0,
    your_mileage: 0,
    last_reading: null,
    last_reading_type: null
};

function init() {
    for (const key in defaults) {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, defaults[key]);
        }
    }

    // Checking the appropriate checkbox
    const last_reading_type = localStorage.getItem('last_reading_type');
    (last_reading_type === 'start' ? end_radio : start_radio).checked = true;

    update_stats();
}

function update_stats() {
    const last_reading = localStorage.getItem('last_reading');
    const last_reading_type = localStorage.getItem('last_reading_type');
    const my_mileage = parseFloat(localStorage.getItem('my_mileage'));
    const your_mileage = parseFloat(localStorage.getItem('your_mileage'));

    const my_percentage = ((my_mileage / (my_mileage + your_mileage || 1)) * 100).toFixed(2);
    const your_percentage = ((your_mileage / (my_mileage + your_mileage || 1)) * 100).toFixed(2);

    stats.innerHTML =
        `<p>Last Reading: ${last_reading}km (${last_reading_type} of trip)</p>` +
        `<p>My Mileage: ${my_mileage}km (${my_percentage}%)</p>` +
        `<p>Your Mileage: ${your_mileage}km (${your_percentage}%)</p>`;
}

form.addEventListener('submit', event => {
    event.preventDefault();

    let { reading, reading_type } = Object.fromEntries(new FormData(form));
    reading = parseFloat(reading);
    const my_mileage = parseFloat(localStorage.getItem('my_mileage'));
    const your_mileage = parseFloat(localStorage.getItem('your_mileage'));
    const last_reading = parseFloat(localStorage.getItem('last_reading'));
    const last_reading_type = localStorage.getItem('last_reading_type');

    if (last_reading_type !== 'null') {
        const trip_mileage = reading - last_reading;

        localStorage.setItem(
            reading_type === 'start' ? 'your_mileage' : 'my_mileage',
            (reading_type === 'start' ? your_mileage : my_mileage) + trip_mileage
        );
    }

    localStorage.setItem('last_reading', reading);
    localStorage.setItem('last_reading_type', reading_type);

    update_stats();
});

clear_session.addEventListener('click', () => {
    localStorage.clear();
    init();
});

init();
