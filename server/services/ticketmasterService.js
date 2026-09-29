const axios = require('axios');

// Ticketmaster demana una API KEY. L'afegirem a les variables d'entorn.
// Pots aconseguir una clau de desenvolupament a https://developer.ticketmaster.com/
const apiKey = process.env.TICKETMASTER_API_KEY || 'ZZrZ9lHhEaZzBf0B6V8e0hB5P8mO7lQw'; // Clau Demo pública (rate-limited) com a fallback

// Troba els concerts d'una llista d'artistes donada la ubicació
const buscarConcertsTicketmaster = async (nomsArtistes, latitud, longitud, codiPais = 'ES') => {
    try {
        const ara = new Date().toISOString().split('T')[0]; // Data avui per filtrar passats
        const totsElsConcerts = [];

        // Ticketmaster API gratuïta: Màxim 5 request/segon
        // Cerques en lots petits amb pauses per evitar 429
        const lotsMida = 2; // 2 requests simultanis
        let processats = 0;

        for (let i = 0; i < nomsArtistes.length; i += lotsMida) {
            const lot = nomsArtistes.slice(i, i + lotsMida);
            processats += lot.length;
            console.log(`[Ticketmaster] Batch ${processats}/${nomsArtistes.length}...`);

            const promeses = lot.map(async (artista) => {
                const params = {
                    apikey: apiKey,
                    keyword: artista,
                    segmentId: 'KZFzniwnSyZfZ7v7nJ', // Music
                    size: 3,
                    sort: 'date,asc',
                    startDateTime: `${ara}T00:00:00Z` // Només futurs
                };

                if (latitud && longitud) {
                    params.latlong = `${latitud},${longitud}`;
                    params.radius = 300;
                    params.unit = 'km';
                } else {
                    params.countryCode = codiPais;
                }

                try {
                    const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
                    const resposta = await axios.get(url, { params, timeout: 8000 });

                    if (resposta.data && resposta.data._embedded && resposta.data._embedded.events) {
                        return resposta.data._embedded.events.map(e => {
                            const recinte = e._embedded && e._embedded.venues && e._embedded.venues[0] ? e._embedded.venues[0] : {};
                            return {
                                id: e.id,
                                artista: artista,
                                nom: e.name,
                                url: e.url,
                                imatge: e.images?.find(img => img.ratio === '16_9' && img.width > 500)?.url || e.images?.[0]?.url,
                                dataString: e.dates?.start?.dateTime || e.dates?.start?.localDate,
                                ubicacio: {
                                    venue: recinte.name || 'Lloc per determinar',
                                    ciutat: recinte.city?.name || '',
                                    pais: recinte.country?.name || '',
                                    lat: recinte.location?.latitude,
                                    lon: recinte.location?.longitude
                                }
                            };
                        });
                    }
                    return [];
                } catch (errHttp) {
                    const status = errHttp.response?.status;
                    if (status === 401) throw new Error('Ticketmaster: API Key invàlida');
                    if (status === 429) console.warn(`Ticketmaster: Rate limit per '${artista}'`);
                    else console.error(`Ticketmaster HTTP error '${artista}':`, errHttp.message);
                    return [];
                }
            });

            const resultatsLot = await Promise.all(promeses);
            totsElsConcerts.push(...resultatsLot.flat());

            // Pausa forçada de 450ms per cada 2 requests (garanteix < 5 req / segon)
            if (i + lotsMida < nomsArtistes.length) {
                await new Promise(resolve => setTimeout(resolve, 450));
            }
        }

        // Eliminar duplicats per ID i ordenar per data
        const vistos = new Set();
        const únics = totsElsConcerts.filter(c => {
            if (!c || vistos.has(c.id)) return false;
            vistos.add(c.id);
            return true;
        });

        return únics.sort((a, b) => new Date(a.dataString) - new Date(b.dataString));

    } catch (error) {
        console.error('Error general de Ticketmaster Service:', error.message);
        return [];
    }
};

const buscarConcertsGenericsZona = async (latitud, longitud, codiPais = 'ES', limit = 20) => {
    try {
        const ara = new Date().toISOString().split('T')[0];
        const params = {
            apikey: apiKey,
            segmentId: 'KZFzniwnSyZfZ7v7nJ', // Music
            size: limit,
            sort: 'date,asc',
            startDateTime: `${ara}T00:00:00Z`
        };

        if (latitud && longitud) {
            params.latlong = `${latitud},${longitud}`;
            params.radius = 100; // 100km al voltant
            params.unit = 'km';
        } else {
            params.countryCode = codiPais;
        }

        const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
        const resposta = await axios.get(url, { params, timeout: 8000 });

        if (resposta.data && resposta.data._embedded && resposta.data._embedded.events) {
            return resposta.data._embedded.events.map(e => {
                const recinte = e._embedded?.venues?.[0] || {};
                const artistaNom = e._embedded?.attractions?.[0]?.name || 'Concert / Festival';
                return {
                    id: e.id,
                    artista: artistaNom,
                    nom: e.name,
                    url: e.url,
                    imatge: e.images?.find(img => img.ratio === '16_9' && img.width > 500)?.url || e.images?.[0]?.url,
                    dataString: e.dates?.start?.dateTime || e.dates?.start?.localDate,
                    ubicacio: {
                        venue: recinte.name || 'Lloc per determinar',
                        ciutat: recinte.city?.name || '',
                        pais: recinte.country?.name || '',
                        lat: recinte.location?.latitude,
                        lon: recinte.location?.longitude
                    },
                    esGeneric: true
                };
            });
        }
        return [];
    } catch (error) {
        console.error('Error buscarConcertsGenerics:', error.message);
        return [];
    }
};

module.exports = {
    buscarConcertsTicketmaster,
    buscarConcertsGenericsZona
};

