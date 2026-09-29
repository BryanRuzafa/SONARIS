const axios = require('axios');
const querystring = require('querystring');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Genera la URL per redirigir l'usuari a Spotify per fer login via OAuth 2.0
const generarUrlLogin = () => {
    // Demanem tots els permisos que necessitarem al llarg del projecte
    const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-read-recently-played',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-read-playback-state',
        'user-read-currently-playing',
        'user-follow-read'
    ].join(' ');

    const query = querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
    });
    return `https://accounts.spotify.com/authorize?${query}`;
};

// Canvia el codi d'autorització per tokens d'accés i de refresc
const obtenirTokens = async (code) => {
    const authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        }
    };

    try {
        const response = await axios(authOptions);
        return response.data;
    } catch (error) {
        console.error('Error obtenint tokens:', error.response ? error.response.data : error.message);
        throw new Error('No s\'han pogut obtenir els tokens de Spotify');
    }
};

// Refresca el token d'accés mitjançant el refresh_token
const refrescarToken = async (refreshToken) => {
    const authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        }
    };

    try {
        const response = await axios(authOptions);
        return response.data; // Retorna access_token
    } catch (error) {
        console.error('Error refrescant token:', error.response?.data || error.message);
        throw new Error('No s\'ha pogut refrescar el token de Spotify');
    }
};

// Obté el perfil complet de l'usuari autenticat
const obtenirPerfilUsuari = async (accessToken) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return response.data;
    } catch (error) {
        console.error('Error obtenint perfil:', error.response ? error.response.data : error.message);
        throw new Error('Error recuperant el perfil d\'usuari');
    }
};

// Obté els artistes o cançons més escoltats de l'usuari
// terminiTemporal pot ser: "short_term" (4 setm.), "medium_term" (6 mesos), "long_term" (anys)
const obtenirTopElements = async (accessToken, tipus, terminiTemporal = 'medium_term', limit = 20) => {
    // tipus pot ser "artists" o "tracks"
    try {
        const response = await axios.get(`https://api.spotify.com/v1/me/top/${tipus}`, {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { time_range: terminiTemporal, limit }
        });
        return response.data.items;
    } catch (error) {
        console.error(`Error obtenint top ${tipus}:`, error.response ? error.response.data : error.message);
        throw new Error(`Error recuperant top ${tipus}`);
    }
};

// Obté les playlists de l'usuari
const obtenirPlaylistsUsuari = async (accessToken, limit = 20) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { limit }
        });
        return response.data.items;
    } catch (error) {
        console.error('Error obtenint playlists:', error.response ? error.response.data : error.message);
        throw new Error('Error recuperant les playlists');
    }
};

// Obté TOTES les cançons d'una playlist (amb paginació automàtica)
const obtenirCanconsDePlaylists = async (accessToken, playlistId) => {
    try {
        let totsElsItems = [];
        let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        let params = { limit: 100, fields: 'items(track(id,uri,name,duration_ms,artists,album)),next' };

        while (url) {
            const response = await axios.get(url, {
                headers: { 'Authorization': 'Bearer ' + accessToken },
                params: url.includes('?') ? {} : params  // params ja inclosos a l'URL de next
            });
            totsElsItems = totsElsItems.concat(response.data.items);
            url = response.data.next || null;
            params = {}; // a partir de la 2a pàgina, 'next' ja porta els params
        }
        return totsElsItems;
    } catch (error) {
        console.error('Error obtenint cançons:', error.response ? error.response.data : error.message);
        throw new Error('Error recuperant les cançons de la playlist');
    }
};

// Elimina cançons d'una playlist (per al netejador de duplicats)
const eliminarCanconsDePlaylists = async (accessToken, playlistId, urisAEliminar) => {
    // L'API de Spotify requereix un array d'objectes amb uri i positions
    const tracks = urisAEliminar.map(uri => ({ uri }));
    try {
        const response = await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: { tracks }
        });
        return response.data;
    } catch (error) {
        console.error('Error eliminant cançons:', error.response ? error.response.data : error.message);
        throw new Error('Error eliminant les cançons duplicades');
    }
};

// Crea una nova playlist al compte de l'usuari
const crearPlaylist = async (accessToken, spotifyUserId, nom, descripcio = '') => {
    try {
        const response = await axios.post(
            `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
            { name: nom, description: descripcio, public: false },
            { headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        console.error('Error creant playlist:', error.response ? error.response.data : error.message);
        throw new Error('Error creant la playlist a Spotify');
    }
};

// Afegeix cançons a una playlist existent
const afegirCancons = async (accessToken, playlistId, uris) => {
    try {
        const response = await axios.post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            { uris },
            { headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        console.error('Error afegint cançons:', error.response ? error.response.data : error.message);
        throw new Error('Error afegint cançons a la playlist');
    }
};

// Obté les Audio Features de diverses cançons
const obtenirAudioFeatures = async (accessToken, trackIds) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/audio-features', {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { ids: trackIds.join(',') }
        });
        return response.data.audio_features;
    } catch (error) {
        console.error('Error obtenint audio features:', error.response ? error.response.data : error.message);
        throw new Error('Error recuperant audio features');
    }
};

// Cerca artistes per gènere amb un filtre de popularitat (per al Radar Underground)
const cercarArtistesUnderground = async (accessToken, genere, limitPopularitat = 30) => {
    try {
        // En gèneres massius com "reggaeton" o "pop", els top 50 artistes sempre tenen fama molt alta (>70).
        // Per trobar artistes underground, fem un desplaçament (offset) aleatori per pescar al fons.
        // BUIDAT D'ERRORS: Spotify bloqueja l'offset quan s'usa explicitament el tag genre:"...". Ho busquem naturalment.
        let offsetAleatori = Math.floor(Math.random() * 400); // Max 1000 items totals (offset + limit) a l'API

        let response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: {
                q: genere, // Sense tag genre:
                type: 'artist',
                limit: 50,
                offset: offsetAleatori
            }
        });

        let artistesItems = response.data.artists?.items || [];

        // Si l'offset era massa gran i ens hem passat dels resultats totals, provem sense offset.
        if (artistesItems.length === 0 && offsetAleatori > 0) {
            response = await axios.get('https://api.spotify.com/v1/search', {
                headers: { 'Authorization': 'Bearer ' + accessToken },
                params: {
                    q: genere,
                    type: 'artist',
                    limit: 50
                }
            });
            artistesItems = response.data.artists?.items || [];
        }

        // Filtrem localment per popularitat (l'API no permet filtrar per popularitat directament)
        const artistes = artistesItems.filter(
            artista => artista.popularity <= limitPopularitat && artista.popularity >= 1
        );
        return artistes;
    } catch (error) {
        console.error('Error cercant artistes underground:', error.response ? error.response.data : error.message);
        throw new Error('Error en la cerca d\'artistes underground');
    }
};

// Obté les cançons principals d'un artista
const obtenirCanconsDartista = async (accessToken, artistaId, mercat = 'ES') => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${artistaId}/top-tracks`, {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { market: mercat }
        });
        return response.data.tracks;
    } catch (error) {
        console.error('Error obtenint cançons d\'artista:', error.response ? error.response.data : error.message);
        throw new Error('Error recuperant les cançons de l\'artista');
    }
};

// Deixa de seguir (elimina) una playlist
const unfollowPlaylist = async (accessToken, playlistId) => {
    try {
        await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return true;
    } catch (error) {
        console.error('Error eliminant playlist:', error.response ? error.response.data : error.message);
        return false;
    }
};

// Obté les 50 últimes cançons escoltades (amb timestamps reals)
const obtenirRecentmentEscoltades = async (accessToken) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { limit: 50 }
        });
        return response.data.items; // [ { track, played_at } ]
    } catch (error) {
        console.error('Error obtenint recently played:', error.response ? error.response.data : error.message);
        return [];
    }
};

// ==========================================
// MÒDUL RADAR UNDERGROUND V2 PERSONALITZAT
// ==========================================

// Obté llistat d'artistes que l'usuari segueix a Spotify
const obtenirArtistesSeguits = async (accessToken) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/following', {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { type: 'artist', limit: 50 }
        });
        return response.data.artists.items;
    } catch (error) {
        console.error('Error obtenint artistes seguits:', error.response?.data || error.message);
        throw new Error('Error recuperant els artistes que segueixes');
    }
};

// Gèneres de Spotify (Fallback intern per evitar caigudes relacionades amb la depreciació de 'available-genre-seeds')
const SPOTIFY_GENRES_FALLBACK = [
    "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova",
    "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy",
    "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub",
    "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage",
    "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore",
    "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop",
    "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin",
    "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age",
    "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop",
    "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rain", "reggae", "reggaeton", "road-trip", "rock",
    "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska",
    "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango",
    "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"
];

// Obté la llista oficial de Gèneres de Spotify per omplir el Selector
const obtenirGeneresDisponibles = async (accessToken) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        if (response.data && response.data.genres && response.data.genres.length > 0) {
            return response.data.genres;
        }
        return SPOTIFY_GENRES_FALLBACK;
    } catch (error) {
        console.warn('L\'API de Spotify recommendations ha fallat o està depreciada, usant fallback local per als gèneres.');
        return SPOTIFY_GENRES_FALLBACK;
    }
};

// Genera recomanacions estrictes sota un nivell de popularitat manualment (per evadir la depreciació de /v1/recommendations)
const obtenirRecomanacionsUnderground = async (accessToken, seedGenres = [], seedArtists = [], targetPopularity = 30) => {
    try {
        let pistesFinals = [];

        // 1. Busquem artistes similars als favorits de l'usuari (Artistes Relacionats)
        const artistesCandidats = new Map();

        for (const artista of seedArtists) {
            const id = artista.id || artista;
            try {
                const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                });

                // Filtrem per popularitat exigida pel Radar
                response.data.artists.forEach(a => {
                    if (a.popularity <= targetPopularity + 10) { // Donem un petit marge d'acceptació
                        artistesCandidats.set(a.id, a);
                    }
                });
            } catch (e) {
                console.error(`Error desxifrant relacionats per l'artista ${id}`);
            }
        }

        // Si no hi ha prous artistes relacionats, fem cerca per gènere també
        if (artistesCandidats.size < 5 && seedGenres.length > 0) {
            for (const genere of seedGenres) {
                const exotics = await cercarArtistesUnderground(accessToken, genere, targetPopularity);
                exotics.forEach(a => artistesCandidats.set(a.id, a));
            }
        }

        // 2. Agafem 25 artistes aleatoris d'aquesta llista ultra-underground (abans 10, es quedava curt)
        const artistesDaurats = Array.from(artistesCandidats.values())
            .sort(() => 0.5 - Math.random())
            .slice(0, 25);

        // 3. Extraiem els seus millors temes per a la Playlist
        for (const artista of artistesDaurats) {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/artists/${artista.id}/top-tracks?market=ES`, {
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                });

                // Només pistes que també siguin underground
                const temesValids = response.data.tracks.filter(t => t.popularity <= targetPopularity + 15);

                // Ens quedem fins a 4 per artista en lloc de 3
                const maxTemes = Math.min(temesValids.length, 4);
                for (let i = 0; i < maxTemes; i++) {
                    pistesFinals.push(temesValids[i]);
                }
            } catch (e) {
                console.error(`Error extraient temes de ${artista.name}`);
            }
        }

        // Retornem en l'estructura que esperaven els controllers originals (ex: { tracks: [...] }) - ara donant 50 en comtes de 30 o res.
        return { tracks: pistesFinals.sort(() => 0.5 - Math.random()).slice(0, 50) };

    } catch (error) {
        console.error('Error treient recomanacions manuals:', error.response?.data || error.message);
        throw new Error('Error contactant el motor de Recomanacions Manual de Sonaris');
    }
};

module.exports = {
    generarUrlLogin,
    obtenirTokens,
    refrescarToken,
    obtenirPerfilUsuari,
    obtenirTopElements,
    obtenirPlaylistsUsuari,
    obtenirCanconsDePlaylists,
    eliminarCanconsDePlaylists,
    crearPlaylist,
    afegirCancons,
    obtenirAudioFeatures,
    cercarArtistesUnderground,
    unfollowPlaylist,
    obtenirRecentmentEscoltades,
    obtenirArtistesSeguits,
    obtenirGeneresDisponibles,
    obtenirRecomanacionsUnderground
};
