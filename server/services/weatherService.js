const axios = require('axios');

// Obté el clima actual segons coordenades
const obtenirClima = async (lat, lon) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) throw new Error("Manca la clau d'OpenWeather");

        const resposta = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ca`);

        return {
            temperatura: resposta.data.main.temp,
            sensacio: resposta.data.main.feels_like,
            descripcio: resposta.data.weather[0].description,
            estat_principal: resposta.data.weather[0].main, // E.g., 'Clouds', 'Rain', 'Clear'
            nom_ubicacio: resposta.data.name
        };
    } catch (error) {
        console.error('Error sol·licitant clima a OpenWeather:', error.message);
        // Retornem un estat neutre per evitar talls a l'aplicació
        return {
            temperatura: 22,
            sensacio: 22,
            descripcio: 'assolellat',
            estat_principal: 'Clear',
            nom_ubicacio: 'Zona desconeguda'
        };
    }
};

module.exports = { obtenirClima };
