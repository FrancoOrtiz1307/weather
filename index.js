const apiKey = 'b6892cbbe47e427ba06223107231506';

const locacionInput = document.getElementById('locacion');
const btnBuscar = document.getElementById('btn-buscar');
const temperaturaLabel = document.getElementById('temperatura');
const descripcionLabel = document.getElementById('descripcion');
const iconoClima = document.getElementById('icono-clima');
const diasPronostico = document.getElementById('dias-pronostico');

btnBuscar.addEventListener('click', buscarDatosClima);

function formatearFecha(fecha) {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = new Date(fecha);
    return `${dias[date.getDay()]} ${date.getDate()}`;
}

function buscarDatosClima() {
    const locacion = locacionInput.value;
    if (!locacion) return;

    // Cambiar la URL para obtener el pronóstico de 7 días
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&lang=es&q=${encodeURIComponent(locacion)}&days=7`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar clima actual
            const { current, forecast } = data;
            temperaturaLabel.textContent = `${current.temp_c}°C`;
            descripcionLabel.textContent = current.condition.text;
            iconoClima.setAttribute('src', `https:${current.condition.icon}`);
            iconoClima.setAttribute('alt', current.condition.text);

            // Mostrar pronóstico
            diasPronostico.innerHTML = ''; // Limpiar pronósticos anteriores
            
            // Mostrar próximos 7 días (excluyendo el día actual)
            forecast.forecastday.slice(1).forEach(dia => {
                const diaElement = document.createElement('div');
                diaElement.className = 'dia-item';
                diaElement.innerHTML = `
                    <div class="fecha">${formatearFecha(dia.date)}</div>
                    <img src="https:${dia.day.condition.icon}" alt="${dia.day.condition.text}">
                    <div class="temp">${Math.round(dia.day.avgtemp_c)}°C</div>
                    <div class="desc">${dia.day.condition.text}</div>
                `;
                diasPronostico.appendChild(diaElement);
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos del clima: ', error);
            temperaturaLabel.textContent = 'Error al obtener datos';
            diasPronostico.innerHTML = '';
        });
}

// Buscar cuando se presiona Enter
locacionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarDatosClima();
    }
});