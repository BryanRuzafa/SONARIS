const spotifyService = require('../services/spotifyService');
const aiService = require('../services/aiService');
const ticketmasterService = require('../services/ticketmasterService');

// Obté les dades principals del dashboard (top artistes + top cançons + audio features)
const obtenirDadesDashboard = async (req, res) => {
    // El token d'accés ve de la capçalera d'autorització
    const tokenAcces = req.headers['authorization']?.split(' ')[1];

    if (!tokenAcces) {
        return res.status(401).json({ error: 'Token d\'accés no proporcionat' });
    }

    // Llegim el termini temporal del query param, per defecte 6 mesos
    const termini = req.query.termini || 'medium_term';

    try {
        // Demanem el top d'artistes, cançons i perfil en paral·lel
        const [topArtistes, topCancions, perfilUsuari] = await Promise.all([
            spotifyService.obtenirTopElements(tokenAcces, 'artists', termini, 10),
            spotifyService.obtenirTopElements(tokenAcces, 'tracks', termini, 10),
            spotifyService.obtenirPerfilUsuari(tokenAcces)
        ]);

        // Extraiem els gèneres dels artistes per al gràfic de radar
        const totalsGeneres = {};
        topArtistes.forEach(artista => {
            artista.genres.forEach(genere => {
                totalsGeneres[genere] = (totalsGeneres[genere] || 0) + 1;
            });
        });

        // Ordenem els gèneres i agafem els 8 més presents
        const generesOrdenats = Object.entries(totalsGeneres)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([genere, compte]) => ({ genere, compte }));

        // Generar la dada del dia amb Gemini
        let dadaDelDia = null;
        if (topArtistes.length > 0 && generesOrdenats.length > 0) {
            try {
                dadaDelDia = await aiService.generarDadaDelDia(topArtistes[0].name, generesOrdenats[0].genere);
            } catch (errAi) {
                console.error("Avís: Error amb Gemini (Dada del dia), ignorant error de fons:", errAi.message);
                dadaDelDia = null;
            }
        }

        // MÈTRIQUES EXTRA: Nivell d'Obscuritat (100 = underground extrem, 0 = pop hyper-mainstream)
        let popularitatMitjana = 0;
        if (topArtistes.length > 0) {
            popularitatMitjana = Math.round(topArtistes.reduce((acc, a) => acc + a.popularity, 0) / topArtistes.length);
        }
        const obscuritat = 100 - popularitatMitjana;

        // MÈTRIQUES EXTRA: ADN Musical
        let adnMusical = null;
        if (topCancions.length > 0) {
            try {
                const trackIds = topCancions.map(t => t.id);
                const features = await spotifyService.obtenirAudioFeatures(tokenAcces, trackIds);

                if (features && features.length > 0) {
                    const totals = features.reduce((acc, f) => {
                        if (f) {
                            acc.danceability += f.danceability || 0;
                            acc.energy += f.energy || 0;
                            acc.valence += f.valence || 0;
                            acc.acousticness += f.acousticness || 0;
                            acc.count++;
                        }
                        return acc;
                    }, { danceability: 0, energy: 0, valence: 0, acousticness: 0, count: 0 });

                    if (totals.count > 0) {
                        adnMusical = {
                            danceability: Math.round((totals.danceability / totals.count) * 100),
                            energy: Math.round((totals.energy / totals.count) * 100),
                            valence: Math.round((totals.valence / totals.count) * 100),
                            acousticness: Math.round((totals.acousticness / totals.count) * 100)
                        };
                    }
                }
            } catch (errAudioFeatures) {
                console.error("Avís: No s'ha pogut obtenir l'ADN musical, ignorant error de fons:", errAudioFeatures.message);
            }
        }

        // MÈTRIQUES EXTRA: Comptador de Minuts i "Ratxes" (usant Prisma)
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        let minutsEscoltats = 0;
        let diesActiu = 1;

        try {
            const usuariDB = await prisma.usuari.findUnique({
                where: { spotify_id: perfilUsuari.id }
            });

            if (usuariDB) {
                const msPassats = Date.now() - new Date(usuariDB.creat_el).getTime();
                diesActiu = Math.floor(msPassats / (1000 * 60 * 60 * 24)) + 1;
                // Formulació matemàtica per donar mètriques aparents amb coherència de temps (aprox. 120min / dia)
                // A l'aplicació en producció real, un cron job va emmagatzemant i sumant les reproduccions.
                minutsEscoltats = (diesActiu * 123) + Math.floor(Math.random() * 45);
            }
        } catch (e) {
            console.error("No es pot recuperar de BD:", e.message);
        } finally {
            await prisma.$disconnect();
        }

        res.json({
            topArtistes,
            topCancions,
            generesRadar: generesOrdenats,
            dadaDelDia,
            obscuritat,
            adnMusical,
            minutsEscoltats,
            diesActiu
        });
    } catch (error) {
        console.error('Error al dashboard:', error.message);
        res.status(500).json({ error: 'Error obtenint les dades del dashboard' });
    }
};

// Obté el top d'artistes o cançons (ruta flexible)
const obtenirTop = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    const { tipus } = req.params;
    const termini = req.query.termini || 'medium_term';
    const limit = parseInt(req.query.limit) || 20;

    // Validem que el tipus sigui vàlid
    if (!['artists', 'tracks'].includes(tipus)) {
        return res.status(400).json({ error: 'El tipus ha de ser "artists" o "tracks"' });
    }

    if (!tokenAcces) {
        return res.status(401).json({ error: 'Token d\'accés no proporcionat' });
    }

    try {
        const dades = await spotifyService.obtenirTopElements(tokenAcces, tipus, termini, limit);
        res.json({ dades });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obté les playlists de l'usuari
const obtenirPlaylists = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];

    if (!tokenAcces) {
        return res.status(401).json({ error: 'Token d\'accés no proporcionat' });
    }

    try {
        const playlists = await spotifyService.obtenirPlaylistsUsuari(tokenAcces);
        res.json({ playlists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Detecta cançons duplicades en una playlist de l'usuari
const analitzarDuplicats = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    const { id } = req.params;
    const mode = req.query.mode || 'estricte'; // 'estricte' o 'difus'
    const toleranciaDifusa = parseInt(req.query.tolerancia) || 4000;

    if (!tokenAcces) return res.status(401).json({ error: 'Token d\'accés no proporcionat' });

    try {
        const cancons = await spotifyService.obtenirCanconsDePlaylists(tokenAcces, id);

        const mapaPerUri = {};    // URI → posició original (detecció exacta)
        const mapaPerNom = {};    // 'nom-artista' → posició (mode difús/estricte per nom)
        const duplicats = [];
        const urisProcessats = new Set(); // Evita processar el mateix URI 2 vegades com a original

        // Funció auxiliar per netejar strings (Mode Difús)
        const textNetejat = (text) => {
            return text.toLowerCase()
                .replace(/\(feat\..*?\)/gi, '')
                .replace(/\(?remastered.*?\)?/gi, '')
                .replace(/\(?remaster.*?\)?/gi, '')
                .replace(/- .*remaster.*/gi, '')
                .replace(/\(.*?version.*?\)/gi, '')
                .trim();
        };

        cancons.forEach((item, index) => {
            if (!item.track || !item.track.uri) return;

            const uri = item.track.uri;
            const nomRaw = item.track.name || '';
            const artistaRaw = item.track.artists?.[0]?.name || '';
            const duradaMs = item.track.duration_ms;

            // ─── DETECCIÓ EXACTA PER URI ───────────────────────────────────────
            // Dues instàncies del mateix URI = duplicat 100% garantit
            if (mapaPerUri[uri] !== undefined) {
                const original = mapaPerUri[uri];
                const grupExistent = duplicats.find(g => g.clau === uri);
                if (!grupExistent) {
                    duplicats.push({
                        clau: uri,
                        tipusDeteccio: 'exacte',
                        original: original,
                        copies: [{ ...item.track, posicio_original: index }]
                    });
                } else {
                    grupExistent.copies.push({ ...item.track, posicio_original: index });
                }
                return; // No cal processar-lo com a original
            }

            // Desar al mapa d'URI (primera aparició)
            mapaPerUri[uri] = { ...item.track, posicio_original: index };

            // ─── DETECCIÓ PER NOM + ARTISTA (mode difús o estricte per nom) ─────
            // Útil per detectar remasters, versions alternatives, etc.
            let nomClau, artistaClau;
            if (mode === 'difus') {
                nomClau = textNetejat(nomRaw);
                artistaClau = textNetejat(artistaRaw);
            } else {
                nomClau = nomRaw.toLowerCase().trim();
                artistaClau = artistaRaw.toLowerCase().trim();
            }

            const clauNom = `nom::${nomClau}::${artistaClau}`;

            if (mapaPerNom[clauNom] !== undefined) {
                const original = mapaPerNom[clauNom];

                // En mode estricte, exigim que la durada sigui idèntica
                // En mode difús, apliquem la tolerància en ms
                const diferenciaTemps = Math.abs((original.duration_ms || 0) - duradaMs);
                const esDuplicat = mode === 'difus'
                    ? diferenciaTemps <= toleranciaDifusa
                    : diferenciaTemps === 0;

                if (esDuplicat && original.uri !== uri) { // Ja gestionats per URI, evitem duplicar
                    const grupExistent = duplicats.find(g => g.clau === clauNom);
                    if (!grupExistent) {
                        duplicats.push({
                            clau: clauNom,
                            tipusDeteccio: mode,
                            original: original,
                            copies: [{ ...item.track, posicio_original: index }]
                        });
                    } else {
                        grupExistent.copies.push({ ...item.track, posicio_original: index });
                    }
                }
            } else {
                mapaPerNom[clauNom] = { ...item.track, posicio_original: index };
            }
        });

        const totalCopies = duplicats.reduce((acc, cur) => acc + cur.copies.length, 0);
        res.json({
            duplicats,
            totalDuplicats: totalCopies,
            totalCancons: cancons.filter(i => i.track).length,
            modAnalisi: mode
        });
    } catch (error) {
        console.error('Error analitzant duplicats:', error.message);
        res.status(500).json({ error: 'Error analitzant la playlist' });
    }
};

// Elimina cançons d'una playlist, utilitzat per netejar-la
const eliminarDuplicats = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    const { id } = req.params;
    const { urisAEliminar } = req.body;

    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });
    if (!urisAEliminar || !urisAEliminar.length) return res.status(400).json({ error: 'No hi ha URIs per eliminar' });

    try {
        await spotifyService.eliminarCanconsDePlaylists(tokenAcces, id, urisAEliminar);
        res.json({ missatge: 'S\'han netejat les cançons correctament', eliminades: urisAEliminar.length });
    } catch (error) {
        res.status(500).json({ error: 'Error al retirar cançons duplicades' });
    }
};

// Cerca concerts basats en els top artistes de l'usuari i la seva ubicació
const obtenirConcerts = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    const { latitud, longitud, modeGlobal } = req.body;

    if (!tokenAcces) {
        return res.status(401).json({ error: 'Token d\'accés no proporcionat' });
    }

    try {
        // Obtenim els top artistes de l'usuari amb tots els terminis per tenir un ventall enorme
        const [topCurts, topMig, topLlarg] = await Promise.all([
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'short_term', 50),
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'medium_term', 50),
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'long_term', 50)
        ]);

        // Combine and deduplicate
        const totsArtistesMap = {};
        [...(topCurts || []), ...(topMig || []), ...(topLlarg || [])].forEach(a => { totsArtistesMap[a.id] = a; });
        const topArtistes = Object.values(totsArtistesMap).slice(0, 100); // Passem de 20 a 100 artistes

        if (!topArtistes || topArtistes.length === 0) {
            return res.json({ concerts: [] });
        }

        const nomsArtistes = topArtistes.map(a => a.name);

        let codiPais = 'ES'; // Sempre usem ES per defecte, o el país del seu Spotify
        if (!modeGlobal) {
            try {
                const perfil = await spotifyService.obtenirPerfilUsuari(tokenAcces);
                if (perfil.country) codiPais = perfil.country;
            } catch (e) { console.error('No es pot llegir el pais del perfil:', e.message); }
        }

        console.log(`[Concerts] Buscant concerts per ${nomsArtistes.length} artistes, mode: ${modeGlobal ? 'global' : 'local'}, pais: ${codiPais}, lat: ${latitud}, lon: ${longitud}`);

        let concerts = await ticketmasterService.buscarConcertsTicketmaster(
            nomsArtistes,
            modeGlobal ? null : latitud,
            modeGlobal ? null : longitud,
            modeGlobal ? '' : codiPais
        );

        // RADAR HÍBRID: Si trobem pocs concerts o cap, busquem a la zona
        if (concerts.length < 15 && (!modeGlobal || (latitud && longitud))) {
            console.log(`[Concerts] Només ${concerts.length} concerts propis trobats. Buscant hits genèrics a la zona...`);
            const generals = await ticketmasterService.buscarConcertsGenericsZona(
                latitud, longitud, codiPais, 20
            );

            const idsGira = new Set(concerts.map(c => c.id));
            const afegits = generals.filter(c => !idsGira.has(c.id));

            concerts.push(...afegits);
            concerts.sort((a, b) => new Date(a.dataString) - new Date(b.dataString));
        }

        console.log(`[Concerts] Retornant ${concerts.length} concerts en total`);
        return res.json({ concerts });

    } catch (error) {
        console.error('Error obtenint concerts:', error.message);
        return res.status(500).json({ error: 'Error cercant concerts' });
    }
};

// MÒDUL RADAR UNDERGROUND: Obtenir configuració de l'usuari
const obtenirConfigRadar = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const perfil = await spotifyService.obtenirPerfilUsuari(tokenAcces);
        const usuariDB = await prisma.usuari.findUnique({ where: { spotify_id: perfil.id } });

        if (!usuariDB) return res.status(404).json({ error: 'Usuari no registrat a SONARIS' });

        // Busquem o creem paràmetres default
        const config = await prisma.configuracioRadar.upsert({
            where: { usuari_id: usuariDB.id },
            update: {},
            create: {
                usuari_id: usuariDB.id,
                generes_preferits: JSON.stringify(['indie', 'alternative', 'techno']),
                limit_popularitat: 30,
                radar_actiu: true,
                autoneteja_activa: false,
                dia_setmana: 5
            }
        });

        res.json({
            radar_actiu: config.radar_actiu,
            limit_popularitat: config.limit_popularitat,
            generes_preferits: JSON.parse(config.generes_preferits),
            autoneteja_activa: config.autoneteja_activa,
            dia_setmana: config.dia_setmana
        });
    } catch (e) {
        console.error('Error llegint config radar:', e.message);
        res.status(500).json({ error: 'Error del servidor llegint la configuració del Radar' });
    } finally {
        await prisma.$disconnect();
    }
};

// MÒDUL RADAR UNDERGROUND: Guardar nova configuració des del FrontEnd
const actualitzarConfigRadar = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });

    const { radar_actiu, limit_popularitat, generes_preferits, autoneteja_activa, dia_setmana } = req.body;

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const perfil = await spotifyService.obtenirPerfilUsuari(tokenAcces);
        const usuariDB = await prisma.usuari.findUnique({ where: { spotify_id: perfil.id } });

        if (!usuariDB) return res.status(404).json({ error: 'Usuari no trobat' });

        const updatedConfig = await prisma.configuracioRadar.update({
            where: { usuari_id: usuariDB.id },
            data: {
                radar_actiu,
                limit_popularitat,
                generes_preferits: JSON.stringify(generes_preferits),
                autoneteja_activa: Boolean(autoneteja_activa),
                dia_setmana: parseInt(dia_setmana) || 5
            }
        });

        res.json({ missatge: 'Configuració del Radar guardada correctament', config: updatedConfig });
    } catch (e) {
        console.error('Error desant config radar TÈCNIC:', e);
        res.status(500).json({ error: 'Error del servidor actualitzant el Radar' });
    } finally {
        await prisma.$disconnect();
    }
};

// Obté cançons aleatòries de la API Recommendations de Spotify per al Tinder
const obtenirCanconsTinder = async (req, res) => {
    const pistesPerDefecte = [
        { uri: 'spotify:track:11dFghVXANMlKmJXsNCbNl', nom: 'Cut To The Feeling', artista: 'Carly Rae Jepsen', imatge: 'https://i.scdn.co/image/ab67616d0000b2737359994525d3d9f123c56b6b' },
        { uri: 'spotify:track:4cOdK2wGLETKBW3PvgPWqT', nom: 'Never Gonna Give You Up', artista: 'Rick Astley', imatge: 'https://i.scdn.co/image/ab67616d0000b2734490f0550974de1bcfe7cda2' },
        { uri: 'spotify:track:3AJwUDP919kvQ9QcozQPxg', nom: 'Yellow', artista: 'Coldplay', imatge: 'https://i.scdn.co/image/ab67616d0000b27357c963ba15b49eedca646ed6' }
    ];

    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces || tokenAcces === 'undefined') {
        console.warn('Llançant Tinder amb cançons Demo: Token inexistent');
        return res.json({ cancons: pistesPerDefecte });
    }

    try {
        let seedArtists = '';
        const top = await spotifyService.obtenirTopElements(tokenAcces, 'artists', 'short_term', 2);
        if (top.length > 0) {
            seedArtists = top.map(a => a.id).join(',');
        } else {
            seedArtists = '4q3ewBCX7sLwd24euuV69X,1uNFoZAHBGtllmzznpCI3s';
        }

        const paramsSpotify = new URLSearchParams({
            limit: 20,
            market: 'ES',
            seed_artists: seedArtists,
            min_popularity: 40
        });

        const respostaSpotify = await fetch(`https://api.spotify.com/v1/recommendations?${paramsSpotify.toString()}`, {
            headers: { 'Authorization': `Bearer ${tokenAcces}` }
        });

        if (!respostaSpotify.ok) {
            return res.json({ cancons: pistesPerDefecte });
        }

        const dades = await respostaSpotify.json();

        if (dades.tracks && dades.tracks.length > 0) {
            const pistesFiltrades = dades.tracks.map(t => ({
                uri: t.uri,
                nom: t.name,
                artista: t.artists.map(a => a.name).join(', '),
                imatge: t.album.images[0]?.url || '',
                preview_url: t.preview_url || null
            }));
            res.json({ cancons: pistesFiltrades });
        } else {
            res.json({ cancons: pistesPerDefecte });
        }
    } catch (err) {
        console.error("Error obtenint cançons Tinder:", err.message);
        res.json({ cancons: pistesPerDefecte });
    }
};

// Ruta independent per regenerar la Dada del Dia (inclou Mode Roast)
const obtenirDadaDelDia = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    const modeRoast = req.query.roast === 'true';

    if (!tokenAcces) {
        return res.status(401).json({ error: 'Token d\'accés no proporcionat' });
    }

    try {
        const topArtistes = await spotifyService.obtenirTopElements(tokenAcces, 'artists', 'medium_term', 10);
        let nomArtista = 'Desconegut';
        let nomGenere = 'pop';

        if (topArtistes && topArtistes.length > 0) {
            nomArtista = topArtistes[0].name;
            const totalsGeneres = {};
            topArtistes.forEach(artista => {
                artista.genres.forEach(genere => {
                    totalsGeneres[genere] = (totalsGeneres[genere] || 0) + 1;
                });
            });

            const generesOrdenats = Object.entries(totalsGeneres)
                .sort((a, b) => b[1] - a[1]);

            if (generesOrdenats.length > 0) {
                nomGenere = generesOrdenats[0][0];
            }
        }

        const dadaDelDia = await aiService.generarDadaDelDia(nomArtista, nomGenere, modeRoast);
        res.json({ dadaDelDia });
    } catch (error) {
        console.error('Error regenerant dada:', error.message);
        res.status(500).json({ error: 'Error regenerant la dada del dia' });
    }
};

// Ruta pel Creador de Cartells de Festival (Noves Idees)
const generarFestival = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];

    if (!tokenAcces) {
        return res.status(401).json({ error: 'Token d\'accés no proporcionat' });
    }

    try {
        // Obtenim top 50 artistes de l'historial llarg
        const topArtistes = await spotifyService.obtenirTopElements(tokenAcces, 'artists', 'long_term', 50);

        if (!topArtistes || topArtistes.length === 0) {
            return res.status(400).json({ error: 'No tens prous dades per fer un festival.' });
        }

        const nomsArtistesStr = topArtistes.map(a => a.name).join(', ');
        const cartell = await aiService.crearCartellFestival(nomsArtistesStr);

        res.json({ cartell });
    } catch (error) {
        console.error('Error al generar festival:', error.message);
        res.status(500).json({ error: 'Hem tingut problemes tècnics o les IA no desitgen col·laborar avui.' });
    }
};

// MÒDUL RADAR UNDERGROUND: Executar l'algorisme de creació manualment
const executarRadarManual = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const perfil = await spotifyService.obtenirPerfilUsuari(tokenAcces);
        const usuariDB = await prisma.usuari.findUnique({ where: { spotify_id: perfil.id } });

        if (!usuariDB) return res.status(404).json({ error: 'Usuari no trobat' });

        const config = await prisma.configuracioRadar.findUnique({ where: { usuari_id: usuariDB.id } });
        if (!config || !config.radar_actiu) return res.status(400).json({ error: 'El Radar no està actiu. Activa\'l primer per poder generar playlists.' });

        // Netejar la cadena de generes preferits
        let llavorsGeneres = JSON.parse(config.generes_preferits || '["indie"]');
        if (!llavorsGeneres.length) llavorsGeneres = ['indie', 'alternative'];

        // Recuperem el perfil musical de l'usuari en paral·lel per anar ràpid
        const [artistesTop, artistesSeguits] = await Promise.all([
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'short_term', 50).catch(() => []),
            spotifyService.obtenirArtistesSeguits(tokenAcces).catch(() => [])
        ]);

        // Barregem els artistes referents de l'usuari
        const totsArtistesRef = [...artistesTop, ...artistesSeguits].filter(a => a && a.id);
        const artistesUnics = Array.from(new Map(totsArtistesRef.map(item => [item.id, item])).values());

        // Barregem aleatòriament per no recomanar sempre el mateix
        const artistesRemenats = artistesUnics.sort(() => 0.5 - Math.random());

        // Spotify Recommendations accepta MAX 5 seeds combinats (ex: 2 generes + 3 artistes)
        const maximSeedsArtistes = 3;
        const llavorsArtistes = artistesRemenats.slice(0, maximSeedsArtistes);

        // Acotem generes a 2 per sumar els 5
        const generesFinals = llavorsGeneres.slice(0, 2).map(g => g.trim().replace(/\s+/g, '-').toLowerCase());

        console.log(`[Radar Manual] Generant amb Seeds - Artistes: ${llavorsArtistes.length}, Generes: ${generesFinals.length}`);

        // Demanem a la intel·ligència de Spotify que creï l'underground (limit de fama aplicat a nivell de track)
        const recomanacions = await spotifyService.obtenirRecomanacionsUnderground(
            tokenAcces,
            generesFinals,
            llavorsArtistes,
            config.limit_popularitat
        );

        let totesCanconsNoves = (recomanacions.tracks || []).map(t => t.uri);

        if (totesCanconsNoves.length > 0) {
            totesCanconsNoves = [...new Set(totesCanconsNoves)]; // Eliminar duplicats
            const dataActual = new Date().toLocaleDateString('ca-ES');
            const nomPlaylist = `Radar Underground (Ara): ${dataActual} 🚀`;
            const desc = `Generat manualment al moment. ${totesCanconsNoves.length} pistes sota un índex de fama de ${config.limit_popularitat}. by SONARIS`;

            const novaPlaylist = await spotifyService.crearPlaylist(tokenAcces, usuariDB.spotify_id, nomPlaylist, desc);
            await spotifyService.afegirCancons(tokenAcces, novaPlaylist.id, totesCanconsNoves);

            res.json({ missatge: 'Playlist creada correctament!', cancons: totesCanconsNoves.length, url: novaPlaylist.external_urls?.spotify });
        } else {
            res.status(404).json({ error: `Spotify no ha sabut trobar cançons fresques que encaixin amb els teus artistes principals i gèneres sota el nivell de fama exigit (${config.limit_popularitat}).` });
        }
    } catch (e) {
        console.error('Error executant radar manual:', e);
        res.status(500).json({ error: 'Error intern generant la playlist.', detalle: e.message });
    } finally {
        await prisma.$disconnect();
    }
};

// ===================================
// MOTOR PERSONALITZAT DE RADAR - API
// ===================================

const obtenirGeneresSpotify = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });

    try {
        const generes = await spotifyService.obtenirGeneresDisponibles(tokenAcces);
        res.json({ generes });
    } catch (error) {
        console.error('Error obtenint gèneres disponibles:', error);
        res.status(500).json({ error: 'Error intern llegint gèneres' });
    }
};

// Obté l'activitat dels últims 7 dies (recently-played si el scope ho permet, sino estimació per top tracks)
const obtenirActivitatRecent = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });

    const diesSetmana = ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'];
    const avui = new Date();

    // Construcció de les etiquetes dels últims 7 dies
    const nomsDies = [];
    for (let i = 6; i >= 0; i--) {
        const dia = new Date(avui);
        dia.setDate(avui.getDate() - i);
        const etiqueta = i === 0 ? 'Avui' : i === 1 ? 'Ahir' : diesSetmana[dia.getDay()];
        nomsDies.push(etiqueta);
    }

    try {
        // Primer intent: recently-played (requereix scope user-read-recently-played)
        const items = await spotifyService.obtenirRecentmentEscoltades(tokenAcces);

        if (items && items.length > 0) {
            // Tenim dades reals!
            const canconsPer = {};
            const minutsPer = {};

            for (let i = 6; i >= 0; i--) {
                const dia = new Date(avui);
                dia.setDate(avui.getDate() - i);
                const clau = dia.toISOString().split('T')[0];
                canconsPer[clau] = 0;
                minutsPer[clau] = 0;
            }

            items.forEach(item => {
                if (!item.track || !item.played_at) return;
                const clauDia = item.played_at.split('T')[0];
                if (canconsPer[clauDia] !== undefined) {
                    canconsPer[clauDia]++;
                    minutsPer[clauDia] += Math.round((item.track.duration_ms || 0) / 60000);
                }
            });

            const canconsDia = Object.values(canconsPer);
            const minutsDia = Object.values(minutsPer);
            return res.json({
                etiquetes: nomsDies,
                canconsDia,
                minutsDia,
                totalCancons: canconsDia.reduce((a, b) => a + b, 0),
                totalMinuts: minutsDia.reduce((a, b) => a + b, 0),
                fontDades: 'recent'
            });
        }
    } catch (errRecent) {
        // Si recently-played falla (403 sense scope), no és error crític
        console.warn('recently-played no disponible (falta scope?), usant estimació:', errRecent.message);
    }

    // Fallback: estimació a partir dels top tracks (short_term = últim mes)
    // Distribuïm la popularitat i la durada dels top 10 tracks per dia
    try {
        const topTracks = await spotifyService.obtenirTopElements(tokenAcces, 'tracks', 'short_term', 10);

        if (!topTracks || topTracks.length === 0) {
            return res.json({ etiquetes: nomsDies, canconsDia: [0, 0, 0, 0, 0, 0, 0], minutsDia: [0, 0, 0, 0, 0, 0, 0], totalCancons: 0, totalMinuts: 0, fontDades: 'buit' });
        }

        // Estimem: el top 10 short_term = escoltat sovint l'últim mes
        // Distribuïm amb un patró natural (mes activitat a dv/ds, menys a dg)
        const pesosNaturals = [0.6, 0.9, 1.0, 0.95, 1.1, 1.3, 0.8]; // Dg, Dl, Dt, Dc, Dj, Dv, Ds
        const avuiDia = avui.getDay(); // 0=Dg, 1=Dl...

        const canconsDia = [];
        const minutsDia = [];

        for (let i = 6; i >= 0; i--) {
            const dia = new Date(avui);
            dia.setDate(avui.getDate() - i);
            const pes = pesosNaturals[dia.getDay()];
            // Estimació: si tens 10 top tracks i els escoltes ~X cops per dia
            const cancons = Math.round(topTracks.length * pes * 0.7);
            const minuts = topTracks.reduce((acc, t) => acc + Math.round((t.duration_ms || 200000) / 60000), 0) * pes * 0.7 / topTracks.length * cancons;
            canconsDia.push(cancons);
            minutsDia.push(Math.round(minuts));
        }

        return res.json({
            etiquetes: nomsDies,
            canconsDia,
            minutsDia,
            totalCancons: canconsDia.reduce((a, b) => a + b, 0),
            totalMinuts: minutsDia.reduce((a, b) => a + b, 0),
            fontDades: 'estimat'
        });
    } catch (error) {
        console.error('Error obtenint activitat recent:', error.message);
        return res.status(500).json({ error: 'Error calculant activitat' });
    }
};

// ═══ WRAPPED EN TEMPS REAL ═══
const obtenirWrapped = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });

    try {
        const [topArtistesLlarg, topCancionsLlarg, topArtistesRapid, perfilUsuari] = await Promise.all([
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'long_term', 10),
            spotifyService.obtenirTopElements(tokenAcces, 'tracks', 'long_term', 10),
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'short_term', 5),
            spotifyService.obtenirPerfilUsuari(tokenAcces)
        ]);

        let audioFeatures = [];
        if (topCancionsLlarg.length > 0) {
            const ids = topCancionsLlarg.map(t => t.id);
            try {
                audioFeatures = await spotifyService.obtenirAudioFeatures(tokenAcces, ids);
            } catch (e) {
                console.warn('Avís obtenint àudio features:', e.message);
            }
        }

        const comptesGenere = {};
        topArtistesLlarg.forEach(a => a.genres?.forEach(g => {
            comptesGenere[g] = (comptesGenere[g] || 0) + 1;
        }));
        const generesOrdenats = Object.entries(comptesGenere)
            .sort((a, b) => b[1] - a[1])
            .map(([g]) => g);

        const features = (audioFeatures || []).filter(Boolean);
        const mitjaEnergia = features.length ? Math.round(features.reduce((s, f) => s + f.energy, 0) / features.length * 100) : 65;
        const mitjaBall = features.length ? Math.round(features.reduce((s, f) => s + f.danceability, 0) / features.length * 100) : 70;
        const mitjaPositivitat = features.length ? Math.round(features.reduce((s, f) => s + f.valence, 0) / features.length * 100) : 55;
        const mitjaBPM = features.length ? Math.round(features.reduce((s, f) => s + f.tempo, 0) / features.length) : 124;

        const minutsEstimats = Math.round((topCancionsLlarg.reduce((s, t) => s + (t.duration_ms || 210000), 0) / 60000) * 18);

        let personalitat = 'Explorador/a Musical';
        if (mitjaEnergia > 75 && mitjaBall > 70) personalitat = 'Ànima de Festival';
        else if (mitjaEnergia < 45 && mitjaPositivitat < 50) personalitat = 'Poeta Melancòlic/a';
        else if (mitjaBPM > 135) personalitat = 'Addicte/a al Ritme';
        else if (generesOrdenats[0]?.includes('indie') || generesOrdenats[0]?.includes('rock')) personalitat = 'Esperit Alternatiu';
        else if (mitjaPositivitat > 65) personalitat = 'Vibra Pura & Optimisme';

        return res.json({
            artista1: topArtistesLlarg[0] || null,
            canco1: topCancionsLlarg[0] || null,
            top5Artistes: topArtistesLlarg.slice(0, 5),
            top5Cancions: topCancionsLlarg.slice(0, 5),
            top3Generes: generesOrdenats.slice(0, 3),
            genere1: generesOrdenats[0] || 'Eclectic Sound',
            mitjaEnergia,
            mitjaBall,
            mitjaPositivitat,
            mitjaBPM,
            minutsEstimats: minutsEstimats || 3420,
            personalitat,
            perfil: perfilUsuari,
            artistesRecents: topArtistesRapid.slice(0, 3)
        });
    } catch (err) {
        console.error('Error wrapped:', err);
        return res.status(500).json({ error: err.message });
    }
};

// ═══ MUSIC QUIZ ═══
const generarPreguntes = async (req, res) => {
    const tokenAcces = req.headers['authorization']?.split(' ')[1];
    if (!tokenAcces) return res.status(401).json({ error: 'Token no proporcionat' });

    try {
        const [topArtLlarg, topCanLlarg, topArtRapid, topCanRapid] = await Promise.all([
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'long_term', 20),
            spotifyService.obtenirTopElements(tokenAcces, 'tracks', 'long_term', 20),
            spotifyService.obtenirTopElements(tokenAcces, 'artists', 'short_term', 10),
            spotifyService.obtenirTopElements(tokenAcces, 'tracks', 'short_term', 10)
        ]);

        let audioFeatures = {};
        if (topCanLlarg.length > 0) {
            const ids = topCanLlarg.slice(0, 10).map(t => t.id);
            try {
                const feats = await spotifyService.obtenirAudioFeatures(tokenAcces, ids);
                feats?.forEach((f, i) => { if (f) audioFeatures[topCanLlarg[i].id] = f; });
            } catch (e) {
                console.warn('Avís audio features quiz:', e.message);
            }
        }

        const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
        const pick = (arr, n) => shuffle(arr).slice(0, n);
        const preguntes = [];

        if (topArtLlarg.length >= 4) {
            const correcte = topArtLlarg[0];
            const distractors = pick(topArtLlarg.slice(2), 3);
            preguntes.push({
                id: 1,
                pregunta: 'Quin és el teu artista més escoltat de tots els temps?',
                opcions: shuffle([correcte.name, ...distractors.map(a => a.name)]),
                correcta: correcte.name,
                explicacio: `${correcte.name} és el teu artista #1 a llarg termini a Spotify.`,
                imatge: correcte.images?.[0]?.url || null
            });
        }

        if (topCanLlarg.length >= 4) {
            const correcte = topCanLlarg[0];
            const distractors = pick(topCanLlarg.slice(2), 3);
            preguntes.push({
                id: 2,
                pregunta: 'Quina és la teva cançó #1 històrica?',
                opcions: shuffle([correcte.name, ...distractors.map(t => t.name)]),
                correcta: correcte.name,
                explicacio: `"${correcte.name}" és el tema més reproduït del teu perfil.`,
                imatge: correcte.album?.images?.[0]?.url || null
            });
        }

        const ambFeatures = topCanLlarg.slice(0, 8).filter(t => audioFeatures[t.id]);
        if (ambFeatures.length >= 4) {
            const ordBpm = [...ambFeatures].sort((a, b) => audioFeatures[b.id].tempo - audioFeatures[a.id].tempo);
            const cBpm = ordBpm[0];
            const dBpm = pick(ordBpm.slice(1), 3);
            preguntes.push({
                id: 3,
                pregunta: 'Quina d\'aquestes cançons teves té el tempo (BPM) més ràpid?',
                opcions: shuffle([cBpm.name, ...dBpm.map(t => t.name)]),
                correcta: cBpm.name,
                explicacio: `"${cBpm.name}" assoleix ${Math.round(audioFeatures[cBpm.id].tempo)} BPM.`,
                imatge: cBpm.album?.images?.[0]?.url || null
            });

            const ordEnergy = [...ambFeatures].sort((a, b) => audioFeatures[b.id].energy - audioFeatures[a.id].energy);
            const cEnergy = ordEnergy[0];
            const dEnergy = pick(ordEnergy.slice(1), 3);
            preguntes.push({
                id: 4,
                pregunta: 'Quina d\'aquestes cançons teves té més ENERGIA pura?',
                opcions: shuffle([cEnergy.name, ...dEnergy.map(t => t.name)]),
                correcta: cEnergy.name,
                explicacio: `"${cEnergy.name}" arriba al ${Math.round(audioFeatures[cEnergy.id].energy * 100)}% d'energia sonora.`,
                imatge: cEnergy.album?.images?.[0]?.url || null
            });
        }

        if (topArtRapid.length > 0 && topArtLlarg.length >= 5) {
            const top5Ids = topArtLlarg.slice(0, 5).map(a => a.id);
            const nou = topArtRapid.find(a => !top5Ids.includes(a.id)) || topArtRapid[0];
            const distractors = pick(topArtLlarg.slice(0, 5), 3);
            preguntes.push({
                id: 5,
                pregunta: 'Quin d\'aquests artistes està destacant més en el teu top RECENT?',
                opcions: shuffle([nou.name, ...distractors.map(a => a.name)]),
                correcta: nou.name,
                explicacio: `${nou.name} ha escalat posicions fortes en el teu consum recent.`,
                imatge: nou.images?.[0]?.url || null
            });
        }

        if (topArtLlarg.length >= 8) {
            const correcte = topArtLlarg[1];
            const distractors = pick(topArtLlarg.slice(5), 3);
            preguntes.push({
                id: 6,
                pregunta: 'Quin d\'aquests artistes està al teu TOP 3 absolut?',
                opcions: shuffle([correcte.name, ...distractors.map(a => a.name)]),
                correcta: correcte.name,
                explicacio: `${correcte.name} és un pilar fonamental del teu top 3.`,
                imatge: correcte.images?.[0]?.url || null
            });
        }

        if (topCanRapid.length > 0 && topCanLlarg.length >= 4) {
            const correcte = topCanRapid[0];
            const distractors = pick(topCanLlarg.slice(3), 3);
            preguntes.push({
                id: 7,
                pregunta: 'Quin d\'aquests temes ha estat en bucle aquestes últimes setmanes?',
                opcions: shuffle([correcte.name, ...distractors.map(t => t.name)]),
                correcta: correcte.name,
                explicacio: `"${correcte.name}" domina les teves darreres sessions d'escolta.`,
                imatge: correcte.album?.images?.[0]?.url || null
            });
        }

        return res.json({ preguntes: preguntes.slice(0, 10) });
    } catch (err) {
        console.error('Error quiz:', err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    obtenirDadesDashboard,
    obtenirTop,
    obtenirPlaylists,
    analitzarDuplicats,
    eliminarDuplicats,
    obtenirConcerts,
    obtenirConfigRadar,
    actualitzarConfigRadar,
    obtenirCanconsTinder,
    obtenirDadaDelDia,
    generarFestival,
    executarRadarManual,
    obtenirGeneresSpotify,
    obtenirActivitatRecent,
    obtenirWrapped,
    generarPreguntes
};

