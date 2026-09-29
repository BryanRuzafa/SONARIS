const spotifyService = require('../services/spotifyService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Redirigeix l'usuari a la pàgina de login de Spotify
const login = (req, res) => {
    const url = spotifyService.generarUrlLogin();
    res.redirect(url);
};

// Gestiona el retorn de Spotify després que l'usuari accepti els permisos
const callback = async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
        return res.redirect('/?error=access_denied');
    }

    try {
        // 1. Obtenim els tokens (access_token i refresh_token)
        const dataTokens = await spotifyService.obtenirTokens(code);
        const { access_token, refresh_token } = dataTokens;

        // 2. Obtenim les dades de l'usuari de Spotify
        const dadesUsuariSpotify = await spotifyService.obtenirPerfilUsuari(access_token);

        // 3. Guardem o actualitzem l'usuari a la nostra base de dades (Upsert)
        const usuari = await prisma.usuari.upsert({
            where: { spotify_id: dadesUsuariSpotify.id },
            update: {
                nom: dadesUsuariSpotify.display_name,
                foto_perfil: dadesUsuariSpotify.images?.[0]?.url || null,
                data_actualitzacio: new Date(),
                token_acces: access_token,
                refresh_token: refresh_token,
            },
            create: {
                spotify_id: dadesUsuariSpotify.id,
                nom: dadesUsuariSpotify.display_name,
                correu: dadesUsuariSpotify.email,
                foto_perfil: dadesUsuariSpotify.images?.[0]?.url || null,
                token_acces: access_token,
                refresh_token: refresh_token,
            },
        });

        // 4. Redirigim al frontend amb el token (en un cas real, millor usar cookies segures o JWT)
        // Per simplificar el TR, passarem el token per URL al frontend
        res.redirect(`http://localhost:5173/callback?access_token=${access_token}&refresh_token=${refresh_token}&user_id=${usuari.id}`);

    } catch (error) {
        console.error(error);
        res.redirect('/?error=server_error');
    }
};

module.exports = {
    login,
    callback
};
