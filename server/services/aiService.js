const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Genera una curiositat musical en base als gustos (Giny Dada del Dia)
const generarDadaDelDia = async (topArtista, topGenere, modeRoast = false) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const mesActual = new Date().toLocaleString('ca-ES', { month: 'long' });

        let prompt = `Ets el "sònar" de l'aplicació SONARIS, un assistent d'analítica musical privat amb intel·ligència superior.
        Dades de l'usuari avui (${mesActual}): Top Artista: "${topArtista}", Top Gènere: "${topGenere}".

        Tasques:
        1. Genera una dada musical molt interessant, efemèride històrica d'aquest mes que connecti, o curiositat sobre l'artista/gènere.
        2. Ha de ser en CATALÀ i tenir màxim 2 frases.
        3. No facis introduccions infantils tipus "Hola" o "Aquí tens", sigues analític i sorprenent.`;

        // Prompt Engineering Dinàmic: Mode Roast
        if (modeRoast) {
            prompt += `\nINSTRUCCIÓ CRÍTICA OVERRIDE (MODE ROAST): Ets Gordon Ramsay, però jutjant música.
            Fes un judici SARCÀSTIC, PREPOTENT i MOLT DIVERTIT en català sobre el seu gust deplorable.
            Destrueix la seva autoestima musical per escoltar "${topArtista}" o el gènere "${topGenere}".
            Sigues creatiu i dolorós (exemples de to: "Molt orginal eh... Ets l'algoritme de Spotify encarnat"). Màxim 2 frases curtíssimes.`;
        } else {
            prompt += `\nINSTRUCCIÓ: To de marca SONARIS (precís, tecnològic, de descobrir).`;
        }

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error a Gemini (Dada del dia):", error.message);
        return `El nostre radar pateix bloquejos degut a l'estat atmosfèric. Detectem influència de ${topArtista || 'bons ritmes'}.`;
    }
};

// Analitza el text d'un diari i en dedueix un "Match" musical
const analitzarEmocioDiari = async (textUsuari) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analitza aquest text d'un diari personal escrit per l'usuari i determina el seu estat emocional i quin gènere musical el podria ajudar/acompanyar millor.
Text: "${textUsuari}"
Respon ÚNICAMENT amb un JSON vàlid seguint aquest esquetx, SENSE formateig Markdown:
{
  "emocio": "Positiu|Negatiu|Neutral",
  "genereRecomanat": "pop|rock|blues|ambient... (escriu-ho en format per API de Spotify)",
  "comentariBreu": "Una frase molt breu en CATALÀ, amb el to analític i proactiu de SONARIS (ex: 'Senyal emocional processat. Recomanem freqüències acústiques per equilibrar la teva jornada.')"
}`;

        const result = await model.generateContent(prompt);
        let textResposta = result.response.text().trim();

        // Extracció implacable d'estructura JSON amb regex
        const jsonMatch = textResposta.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Impossible processar el format de l'emoció.");
    } catch (error) {
        console.error("Error a Gemini (Diari):", error.message);
        return {
            emocio: "Neutral",
            genereRecomanat: "ambient",
            comentariBreu: "No hem pogut processar el senyal emocional completament. Activem la banda sonora de seguretat."
        };
    }
};

// Crear cartell de festival usant el Top 50
const crearCartellFestival = async (artistesStr) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Ets el millor i més creatiu promotor de festivals del món, estil Coachella o Tomorrowland.
He analitzat el meu compte de Spotify i aquests són els meus artistes més escoltats:
${artistesStr}

Tasques:
1. Inventa un nom ÈPIC per aquest festival de música (ex: "Neon Dreams Fest", "Echo Valley").
2. Descriu el "Tema" visual o el "vibe" d'aquest festival segons l'estil dels artistes (1 frase llarga).
3. Organitza aquests artistes en 3 Dies. Reconeix els més famosos i importants per fer-los "Headliners" (Caps de cartell). Els altres, reparteix-los lògicament.
4. Per cada dia, necessito 2 Headliners, 3 Sub-Headliners i la resta com a "Undercard" (lletra petita).

Retorna ÚNICAMENT un JSON vàlid amb l'estructura exacta que es demana a continuació. SENSE lletres extra ni format de blocs de codi de markdown com l'etiqueta json\`\`\`:
{
  "nomFestival": "Nom del Festival",
  "tema": "Descripció del vibe...",
  "dies": [
    {
      "dia": "Dia 1",
      "headliners": ["Artista Principal 1", "Artista Principal 2"],
      "subHeadliners": ["Artista 3", "Artista 4", "Artista 5"],
      "undercard": ["Artista 6", "Artista 7", "Artista 8", "Artista 9", "Artista 10..."]
    },
    ...
  ]
}`;

        const result = await model.generateContent(prompt);
        let textResposta = result.response.text().trim();

        // Extracció implacable d'estructura JSON amb regex per festivals
        const jsonMatch = textResposta.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Impossible processar el format del cartell de festival.");
    } catch (error) {
        console.error("Error a Gemini (Festival):", error.message);
        throw error;
    }
};

module.exports = {
    generarDadaDelDia,
    analitzarEmocioDiari,
    crearCartellFestival
};
