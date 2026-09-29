const validadorPuntuacio = {}; // Aquí guardarem l'estat local de les partides del Trivial
const salesTinder = {}; // Estat de les sales del Tinder musical

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`📡 Usuari connectat al Sònar: ${socket.id}`);

        // --- Lògica general de Sales ---
        socket.on('unirSala', ({ codiSala, usuari, tipus }) => {
            socket.join(codiSala);
            console.log(`${usuari} s'ha unit a la sala ${codiSala} [Tipus: ${tipus}]`);

            if (tipus === 'tinder') {
                if (!salesTinder[codiSala]) {
                    salesTinder[codiSala] = {
                        usuaris: [],
                        matches: [],
                        votsActuals: {} // estat concurrent de la cançó activa
                    };
                }
                if (!salesTinder[codiSala].usuaris.includes(usuari)) {
                    salesTinder[codiSala].usuaris.push(usuari);
                }

                // Notifica a la resta de participants
                socket.to(codiSala).emit('nouParticipant', { usuari, missatge: `${usuari} acaba d'entrar.` });
                io.to(codiSala).emit('usuarisSala', salesTinder[codiSala].usuaris);
            }
        });

        // --- Mòdul: Tinder Musical Sincronitzat ---

        // 1. Feedback en temps real (Visualitzar si l'altre dubta al Frontend)
        socket.on('tinderDubta', ({ codiSala, usuari, estat }) => {
            // estat pot ser 'esquerra', 'dreta' o null (centre)
            socket.to(codiSala).emit('amicDubtant', { usuari, estat });
        });

        // 2. Començar la llista de manera sincronitzada (Càlcul de Ping en ms)
        socket.on('tinderIniciSincronitzat', ({ codiSala, cancoId }) => {
            // El servidor mana executar la pròxima cançó en el futur exacte per compensar latència de xarxa
            const tempsActualSrv = Date.now();
            const delayCompensacio = 2000; // 2 segons de buffer per xarxa i càrrega WebAudio
            const playTimestamp = tempsActualSrv + delayCompensacio;

            // L'estat es neteja per la nova cançó
            if (salesTinder[codiSala]) salesTinder[codiSala].votsActuals = {};

            io.to(codiSala).emit('playAudioSync', {
                cancoId,
                playTimestamp,
                serverTimeAtEmit: tempsActualSrv
            });
        });

        // 3. Control concurrent de Vots (Bloquejos de UI i Matches)
        socket.on('tinderSwipe', ({ codiSala, usuari, uriCanco, direccio }) => {
            console.log(`🎯 Tinder [${codiSala}]: ${usuari} swipe ${direccio} -> ${uriCanco}`);

            if (!salesTinder[codiSala]) return;

            // Registrem vot al magatzem temporal
            salesTinder[codiSala].votsActuals[usuari] = direccio;

            // Bloquejar la UI de l'usuari que acaba de votar (s'activa via socket)
            socket.emit('tinderBloqueigUI', { esperant: true });

            // Comprovació si tothom de la sala ha emès vot (Sincrònia Total)
            const usuarisTotals = salesTinder[codiSala].usuaris.length;
            const votsRegistrats = Object.keys(salesTinder[codiSala].votsActuals).length;

            if (usuarisTotals > 0 && votsRegistrats === usuarisTotals) {
                // Tothom ha votat! Comptem
                let esMatch = true;
                for (let usu of salesTinder[codiSala].usuaris) {
                    if (salesTinder[codiSala].votsActuals[usu] !== 'dreta') {
                        esMatch = false;
                        break;
                    }
                }

                if (esMatch && usuarisTotals > 1) { // Només és Match si hi ha minim 2 persones (1 solitari no té gràcia)
                    console.log(`🔥 MATCH a la sala ${codiSala} per ${uriCanco}!`);
                    salesTinder[codiSala].matches.push(uriCanco);
                    io.to(codiSala).emit('tinderMatch', { uriCanco });
                }

                // Desbloquejarem tothom que avancin d'UI i demanin pròxima cançó
                setTimeout(() => {
                    io.to(codiSala).emit('tinderResolucio', {
                        uriCanco,
                        esMatch,
                        missatge: "Tothom ha decidit. Es passa a la següent cançó."
                    });
                }, 1000); // 1s d'espera per veure l'animació al mòbil
            }
        });

        // --- Mòdul: Trivial Musical ---
        socket.on('trivialResposta', ({ codiSala, usuari, respostaCorrecta }) => {
            if (respostaCorrecta) {
                if (!validadorPuntuacio[codiSala]) validadorPuntuacio[codiSala] = {};
                validadorPuntuacio[codiSala][usuari] = (validadorPuntuacio[codiSala][usuari] || 0) + 10;

                io.to(codiSala).emit('trivialActualitzacio', {
                    tauler: validadorPuntuacio[codiSala],
                    ultimGuanyador: usuari,
                    missatge: `Punt per a ${usuari}!`
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Usuari desconnectat: ${socket.id}`);
        });
    });
};
