const aiService = require('../services/aiService');
const spotifyService = require('../services/spotifyService');
const weatherService = require('../services/weatherService');
// Importem Prisma, suposant que està generat
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mòdul Diari Emocional: Desenvolupa l'anàlisi i recomana una cançó, i guarda l'entrada a la BD
const processarDiariEmocional = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    const { textUsuari, spotifyUserId } = req.body;

    if (!tokenAcces || !textUsuari) return res.status(400).json({ error: 'Falten camps necessaris' });

    try {
        // 1. Enviem el text a Gemini
        const analisi = await aiService.analitzarEmocioDiari(textUsuari);

        // 2. Busquem una cançó a Spotify basada en el gènere recomanat
        const cercaParams = new URLSearchParams({
            q: `genre:${analisi.genereRecomanat || 'pop'}`,
            type: 'track',
            limit: 5,
            market: 'ES'
        });

        const respostaSpotify = await fetch(`https://api.spotify.com/v1/search?${cercaParams.toString()}`, {
            headers: { 'Authorization': `Bearer ${tokenAcces}` }
        });

        const dadesFets = await respostaSpotify.json();
        const pistesBones = dadesFets.tracks?.items || [];
        const cançoTriada = pistesBones.length > 0 ? pistesBones[Math.floor(Math.random() * pistesBones.length)] : null;

        let resposta = {
            ...analisi,
            canco: cançoTriada ? {
                nom: cançoTriada.name,
                artista: cançoTriada.artists[0].name,
                imatge: cançoTriada.album.images[0]?.url,
                uri: cançoTriada.uri
            } : null
        };

        // 3. (CRUD) Guardem a la base de dades l'entrada del diari (si la BD ho permet, capturem errors suaus)
        try {
            // Primer cal comprovar si l'usuari existeix o bé ometre-ho segons ID (simplificat)
            // A efectes pràctics d'una maqueta, es simularà si no tenim BD robusta configurada
            if (spotifyUserId && prisma.usuari) {
                const usuariBd = await prisma.usuari.findUnique({ where: { spotify_id: spotifyUserId } });
                if (usuariBd) {
                    await prisma.entradaDiari.create({
                        data: {
                            usuari_id: usuariBd.id,
                            text_entrada: textUsuari,
                            estat_anim: analisi.emocio,
                            canco_suggerida: resposta.canco?.uri || null,
                            caratula_url: resposta.canco?.imatge || null
                        }
                    });
                }
            }
        } catch (dbError) {
            console.warn("Avís: L'entrada no s'ha guardat a BD per problemes de connexió.", dbError.message);
        }

        res.json(resposta);
    } catch (error) {
        console.error("Error processant diari:", error);
        res.status(500).json({ error: "No s'ha pogut processar el senyal emocional." });
    }
};

// Mòdul SoundTrack Adaptatiu: Genera recomanacions via BPM Dinàmic segons Clima, Hora i "Vibe"
const generarSoundtrack = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    const { lat, lon, vibe_manual } = req.body;

    if (!tokenAcces || !lat || !lon) return res.status(400).json({ error: 'Ubicació no proveïda' });

    try {
        // Obtenim clima i hora
        const clima = await weatherService.obtenirClima(lat, lon);
        const horaFormatejada = new Date();
        const horaActual = horaFormatejada.getHours();

        // Càlcul de BPM Dinàmic i Energia
        let targetBpm = 120;
        let targetEnergy = 0.6;
        let seedGenres = ['pop', 'indie']; // Llavors de gènere de fons

        // Segons el Clima
        const estatClima = clima.meteo.estat_principal;
        if (estatClima === 'Rain' || estatClima === 'Drizzle') {
            targetBpm = 80; targetEnergy = 0.3; seedGenres = ['acoustic', 'rain'];
        } else if (estatClima === 'Clouds' || estatClima === 'Snow') {
            targetBpm = 100; targetEnergy = 0.5; seedGenres = ['chill', 'ambient'];
        } else if (estatClima === 'Clear' && clima.meteo.temperatura > 25) {
            targetBpm = 130; targetEnergy = 0.8; seedGenres = ['summer', 'dance'];
        }

        // Segons l'Hora (Nit vs Dia)
        let contextHora = 'Dia';
        if (horaActual >= 22 || horaActual < 6) {
            contextHora = 'Nit';
            targetBpm = Math.max(60, targetBpm - 30); // Mode Relax
            targetEnergy = Math.max(0.1, targetEnergy - 0.4);
            seedGenres = ['sleep', 'lo-fi'];
        } else if (horaActual >= 6 && horaActual < 11) {
            contextHora = 'Matí';
            targetBpm = targetBpm + 10; // Extra per despertar-se
            targetEnergy += 0.2;
        }

        // Ajustament manual del "Vibe"
        if (vibe_manual) {
            if (vibe_manual === 'energia') { targetBpm += 40; targetEnergy = 0.9; }
            if (vibe_manual === 'trist') { targetBpm = 70; targetEnergy = 0.2; seedGenres = ['sad', 'piano']; }
            if (vibe_manual === 'local') { seedGenres = ['spanish', 'flamenco', 'latin']; } // Hardcodejat a Espanya temporalment
        }

        // Recuperem el Top Artista com a llavor addicional (Seed) hiper-personalitzada
        let seedArtists = '';
        try {
            const top = await spotifyService.obtenirTopElements(tokenAcces, 'artists', 'short_term', 1);
            if (top.length > 0) seedArtists = top[0].id;
        } catch (e) {
            console.warn('Avís: No s\'ha pogut aconseguir seed d\'artista, prosseguim amb gèneres base.');
        }

        // Crida a Spotify Recommendations
        const paramsSpotify = new URLSearchParams({
            limit: 15,
            market: 'ES',
            seed_genres: seedGenres.slice(0, 2).join(','), // Spotify accepta max 5 llavors en total
            target_tempo: targetBpm,
            target_energy: targetEnergy.toFixed(2)
        });

        if (seedArtists) paramsSpotify.append('seed_artists', seedArtists);

        const respostaSpotify = await fetch(`https://api.spotify.com/v1/recommendations?${paramsSpotify.toString()}`, {
            headers: { 'Authorization': `Bearer ${tokenAcces}` }
        });

        const dadesFets = await respostaSpotify.json();

        res.json({
            meteo: clima,
            context: contextHora,
            bpmObjectiu: targetBpm,
            cancons: dadesFets.tracks || []
        });

    } catch (error) {
        console.error("Error al servidor (Soundtrack):", error.message);
        res.status(500).json({ error: "No s'ha pogut compilar la llista de reproducció adaptativa." });
    }
};

module.exports = {
    processarDiariEmocional,
    generarSoundtrack
};
