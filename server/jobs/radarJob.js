const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const spotifyService = require('../services/spotifyService');

// Inicialitza el cron job per al Radar Underground
const iniciarRadarUnderground = () => {
    // Executa cada dissabte a les 2:00 AM: '0 2 * * 6'
    // Ara s'executa diàriament a les 3:00 AM ('0 3 * * *') però filtra internament pel dia escollit
    cron.schedule('0 3 * * *', async () => {
        console.log('--- Iniciant Cron Job: Radar Underground ---');

        try {
            const configuracionsActivades = await prisma.configuracioRadar.findMany({
                where: { radar_actiu: true },
                include: { usuari: true }
            });

            if (!configuracionsActivades.length) {
                console.log('Cap usuari actiu pel Radar. Dormint...');
                return;
            }

            const avui = new Date().getDay(); // 0=Diumenge, 1=Dilluns, ..., 6=Dissabte

            for (const config of configuracionsActivades) {
                // Comprovem si avui és el dia configurat per l'usuari
                if (config.dia_setmana !== avui) continue;

                const usuari = config.usuari;

                if (!usuari.refresh_token) {
                    console.log(`[Radar] Usuari ${usuari.nom} ometès (Sense Refresh Token)`);
                    continue;
                }

                let tokenAccesActiu = null;
                try {
                    // Refresquem el token d'Spotify (el darrer pot estar caducat)
                    const nousTokens = await spotifyService.refrescarToken(usuari.refresh_token);
                    tokenAccesActiu = nousTokens.access_token;

                    // Actualitzem BD
                    await prisma.usuari.update({
                        where: { id: usuari.id },
                        data: { token_acces: tokenAccesActiu }
                    });
                } catch (e) {
                    console.error(`[Radar] Error d'Auth amb ${usuari.nom}:`, e.message);
                    continue;
                }

                // Autoneteja: Ecologia de Playlists (Esborrar radars antics per no embrutar compte)
                if (config.autoneteja_activa) {
                    try {
                        const llistes = await spotifyService.obtenirPlaylistsUsuari(tokenAccesActiu, 50);
                        const radarsAntics = llistes.filter(p => p.name.startsWith('Radar Underground:'));

                        for (const p of radarsAntics) {
                            await spotifyService.unfollowPlaylist(tokenAccesActiu, p.id);
                        }
                    } catch (e) {
                        console.error(`[Radar] Problemes netejant per ${usuari.nom}:`, e.message);
                    }
                }

                // Recuperem el perfil musical de l'usuari en paral·lel per anar ràpid
                const [artistesTop, artistesSeguits] = await Promise.all([
                    spotifyService.obtenirTopElements(tokenAccesActiu, 'artists', 'short_term', 50).catch(() => []),
                    spotifyService.obtenirArtistesSeguits(tokenAccesActiu).catch(() => [])
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
                const generesFinals = llistaGeneresBase.slice(0, 2).map(g => g.trim().replace(/\s+/g, '-').toLowerCase());

                console.log(`[Radar Noctorum] Generant amb Seeds - Artistes: ${llavorsArtistes.length}, Generes: ${generesFinals.length} per Usuari: ${usuari.nom}`);

                // Demanem a la intel·ligència de Spotify que creï l'underground (limit de fama aplicat a nivell de track)
                const recomanacions = await spotifyService.obtenirRecomanacionsUnderground(
                    tokenAccesActiu,
                    generesFinals,
                    llavorsArtistes,
                    config.limit_popularitat
                );

                let totesCanconsNoves = (recomanacions.tracks || []).map(t => t.uri);

                if (totesCanconsNoves.length > 0) {
                    // Evitar duplicats
                    totesCanconsNoves = [...new Set(totesCanconsNoves)];

                    const dataActual = new Date().toLocaleDateString('ca-ES');
                    const nomPlaylist = `Radar Underground: ${dataActual} 📡`;
                    const desc = `Les teves joies ocultes de la setmana sota índex ${config.limit_popularitat}. SONARIS AI.`;

                    try {
                        const novaPlaylist = await spotifyService.crearPlaylist(tokenAccesActiu, usuari.spotify_id, nomPlaylist, desc);
                        await spotifyService.afegirCancons(tokenAccesActiu, novaPlaylist.id, totesCanconsNoves);
                        console.log(`[Radar OK] Playlist "${nomPlaylist}" creada per a ${usuari.nom}. (${totesCanconsNoves.length} pistes)`);
                    } catch (e) {
                        console.error(`[Radar] Error injectant la playlist a Spotify de ${usuari.nom}`);
                    }
                }
            }
            console.log('--- Cron Job End: Radar Underground ---');

        } catch (error) {
            console.error('Error executant el Radar Underground Central:', error.message);
        }
    });
};

module.exports = { iniciarRadarUnderground };
