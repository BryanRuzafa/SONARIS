<div align="center">

<img src="https://img.shields.io/badge/SONARIS-v1.0.0-1ED760?style=for-the-badge&labelColor=0a0a0a" alt="SONARIS"/>

# 🎵 SONARIS

### La interacció definitiva per a Spotify

*Navega la profunditat oceànica del teu codi genètic musical.*

<br/>

[![Vue.js](https://img.shields.io/badge/Vue.js_3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Spotify](https://img.shields.io/badge/Spotify_API-1ED760?style=flat-square&logo=spotify&logoColor=white)](https://developer.spotify.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

> **Projecte Final de Cicle Formatiu de Grau Superior — Desenvolupament d'Aplicacions Web (DAW)**  
> Curs 2025–2026 · Bryan Ruzafa Gonçalves

</div>

---

## 📋 Taula de Continguts

- [Descripció General](#-descripció-general)
- [Funcionalitats](#-funcionalitats)
- [Arquitectura](#-arquitectura)
- [Stack Tecnològic](#-stack-tecnològic)
- [Base de Dades](#-base-de-dades)
- [API REST](#-api-rest)
- [WebSockets](#-websockets)
- [Requisits Previs](#-requisits-previs)
- [Instal·lació i Desplegament](#-installació-i-desplegament)
- [Variables d'Entorn](#-variables-dentorn)
- [Estructura del Projecte](#-estructura-del-projecte)
- [Captures de Pantalla](#-captures-de-pantalla)
- [Autor](#-autor)

---

## 🌊 Descripció General

**SONARIS** és una aplicació web full-stack que connecta amb el compte de Spotify de l'usuari per oferir una experiència musical avançada i personalitzada. Combina estadístiques profundes, intel·ligència artificial, funcionalitats socials en temps real i eines de gestió de playlists en una sola plataforma.

L'autenticació es fa via **OAuth 2.0 de Spotify**, sense necessitat de registre. Totes les dades provenen directament de l'API de Spotify i s'enriqueixen amb IA (Google Gemini) i altres APIs externes (Ticketmaster, OpenWeather).

---

## ✨ Funcionalitats

### 🏠 1. Centre de Comandament (Dashboard)
El tauler principal unifica tota la informació musical de l'usuari:

- **Dada del Dia amb IA**: Cada cop que l'usuari accedeix, la IA (Gemini) analitza el seu historial i genera una dada estadística única, sorprenent i personalitzada sobre els seus hàbits musicals. Inclou un **mode Roast** que analitza amb humor els gustos de l'usuari.
- **Top Artistes i Cançons**: Visualització dels artistes i cançons més escoltades en 3 períodes: última setmana, últim mes i tots els temps.
- **Activitat Recent**: Les darreres cançons escoltades a Spotify en temps real.
- **Perfil Musical**: Anàlisi de gèneres, diversitat, característiques d'àudio (energia, ball, positivitat) i molt més.

### 🎭 2. Diari Emocional (IA)
Mòdul d'intel·ligència artificial emocional:

- L'usuari escriu com se sent avui en text lliure.
- La IA de **Gemini** analitza el sentiment del text (positiu, negatiu, neutral).
- Basant-se en l'anàlisi emocional i l'historial musical de l'usuari a Spotify, la IA suggereix la **cançó perfecta** per a aquell moment.
- Totes les entrades es guarden a la base de dades per analitzar l'evolució emocional al llarg del temps.

### 🎸 3. Radar Underground (Cron Job Autònom)
Sistema autònom de descoberta musical:

- L'usuari configura els seus gèneres preferits i un llindar de popularitat (0-100).
- Un **Cron Job** (node-cron) s'executa automàticament cada divendres a mitjanit.
- Cerca artistes desconeguts i emergents a Spotify que coincideixen amb els gustos de l'usuari.
- Crea automàticament una playlist nova a Spotify de l'usuari titulada `SONARIS Radar Underground — [Data]`.
- L'usuari pot activar l'**auto-neteja**, que elimina la playlist anterior cada setmana per evitar acumulació.
- Es pot executar manualment en qualsevol moment des del dashboard.

### 🎵 4. Gestor de Playlists
Eina de gestió completa de playlists:

- Visualitza totes les playlists de l'usuari amb portades, nombre de cançons i descripció.
- Crea, edita i organitza playlists directament des del panell.
- Integrat amb el netejador de duplicades per a una gestió òptima.

### 🧹 5. Netejador de Duplicades
Manté la biblioteca musical neta:

- Analitza qualsevol playlist i detecta cançons duplicades.
- Mostra un resum clar dels duplicats trobats.
- Elimina automàticament els duplicats amb un sol clic.
- Utilitza l'API de Spotify per modificar les playlists directament.

### 🃏 6. Tinder Musical (Temps Real — WebSockets)
Funcionalitat social multijugador:

- Un usuari crea una **sala privada** amb un codi de 6 caràcters.
- Un altre usuari introdueix el codi per unir-se.
- El sistema mostra cançons aleatòries a ambdós usuaris simultàniament (via WebSockets).
- Cada usuari vota "Like" o "Skip" per a cada cançó.
- El servidor detecta els **"Matches"** (cançons que tots dos usuaris han triat) i els mostra en temps real.
- Basat en **Socket.io** per a la comunicació bidireccional instantània.

### 🎪 7. Creador de Cartells de Festival
Funcionalitat generativa i visual:

- Basant-se en els artistes top de l'usuari, genera un **cartell de festival personalitzat**.
- El cartell inclou el nom, imatge i popularitat de cada artista.
- Es pot descarregar com a imatge amb **html2canvas**.

### 🎤 8. Radar de Concerts (Ticketmaster)
Descobreix concerts propers:

- L'usuari introdueix una localitat i selecciona un artista dels seus favorits.
- El sistema consulta l'API de **Ticketmaster** per trobar concerts propers.
- Mostra informació detallada: nom del recinte, data, lloc i link de compra d'entrades.

### 🤖 9. Xat amb IA Musical (Gemini)
Assistent intel·ligent musical:

- Xat integrat amb **Google Gemini** que té accés al context musical de l'usuari.
- Coneix els artistes favorits, gèneres i hàbits d'escolta de l'usuari.
- Respon preguntes sobre música, fa recomanacions personalitzades, analitza cançons i crea llistes.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Vue.js 3 SPA                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │   │
│  │  │  Home.vue│  │Login.vue │  │Dashboard │  │Callback│  │   │
│  │  │          │  │          │  │  .vue    │  │ .vue   │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘  │   │
│  │                                                          │   │
│  │  Pinia Store · Vue Router · Tailwind CSS · Socket.io     │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬────────────────────────┬─────────────────┘
                       │ HTTP (REST)            │ WebSocket
                       ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Node.js + Express 5)                │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │ authRoutes  │  │dashboard    │  │  socketHandler.js    │   │
│  │             │  │Routes       │  │  (Tinder Musical)    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────────────────────┘   │
│         │                │                                       │
│  ┌──────▼──────┐  ┌──────▼───────────────────────────────┐    │
│  │authController│  │         dashboardController           │    │
│  │             │  │  + contextController (IA)             │    │
│  └──────┬──────┘  └──────────────────┬────────────────────┘    │
│         │                            │                           │
│  ┌──────▼────────────────────────────▼────────────────┐        │
│  │                    Services Layer                    │        │
│  │  spotifyService · aiService · ticketmasterService   │        │
│  └──────────────────────────────────┬──────────────────┘        │
│                                     │                            │
│  ┌──────────────────────────────────▼──────────────────┐        │
│  │              Prisma ORM (MySQL)                      │        │
│  │   Usuari · EntradaDiari · ConfiguracioRadar ·        │        │
│  │   SalaJoc · ParticipantSala                          │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │          Cron Job: Radar Underground (node-cron)      │        │
│  │          Execució: Divendres 00:00                    │        │
│  └──────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                       │
         ┌─────────────┼────────────────────┐
         ▼             ▼                    ▼
   Spotify API    Google Gemini       Ticketmaster API
   (OAuth 2.0)   (AI / Gemini)       (Concerts)
```

### Flux d'Autenticació OAuth 2.0

```
Usuari → [Clic "Accedir amb Spotify"]
       → Backend /api/auth/login
       → Redirecció a accounts.spotify.com/authorize
       → L'usuari accepta permisos
       → Spotify → /api/auth/callback/spotify (amb codi)
       → Backend intercanvia codi per tokens (access + refresh)
       → Es guarda l'usuari i tokens a MySQL via Prisma
       → Redirecció al Frontend amb token de sessió
       → Frontend guarda token a localStorage
       → Totes les peticions posteriors inclouen el token
```

---

## 🛠️ Stack Tecnològic

### Frontend
| Tecnologia | Versió | Ús |
|---|---|---|
| **Vue.js** | 3.5 | Framework SPA reactiu |
| **Vite** | 7.3 | Bundler i servidor de dev |
| **Vue Router** | 5.0 | Navegació SPA |
| **Pinia** | 3.0 | Gestió d'estat global |
| **Tailwind CSS** | 3.4 | Estils utilitaris |
| **Chart.js** | 4.5 | Gràfics i visualitzacions |
| **Vue-chartjs** | 5.3 | Integració Chart.js + Vue |
| **Socket.io-client** | 4.8 | WebSockets (Tinder Musical) |
| **html2canvas** | 1.4 | Exportació de cartells |

### Backend
| Tecnologia | Versió | Ús |
|---|---|---|
| **Node.js** | ≥18 | Entorn d'execució |
| **Express** | 5.2 | Framework HTTP |
| **Prisma** | 5.10 | ORM per a MySQL |
| **MySQL** | 8.0+ | Base de dades relacional |
| **Socket.io** | 4.8 | WebSockets bidireccionals |
| **node-cron** | 4.2 | Tasques automàtiques programades |
| **axios** | 1.13 | Client HTTP per a APIs externes |
| **dotenv** | 16.4 | Gestió de variables d'entorn |
| **cookie-parser** | 1.4 | Gestió de cookies de sessió |
| **cors** | 2.8 | Política CORS |
| **nodemon** | 3.1 | Hot-reload en desenvolupament |

### APIs Externes
| API | Ús |
|---|---|
| **Spotify Web API** | Dades musicals, playlists, autenticació OAuth |
| **Google Gemini AI** | Diari emocional, Dada del Dia, Xat musical |
| **Ticketmaster Discovery API** | Radar de concerts i esdeveniments |

---

## 🗄️ Base de Dades

SONARIS utilitza **MySQL** com a base de dades relacional, gestionada via **Prisma ORM**.

### Diagrama Entitat-Relació

```
┌─────────────────┐        ┌──────────────────────┐
│    Usuari       │        │    EntradaDiari       │
├─────────────────┤        ├──────────────────────┤
│ id (PK)         │◄──────┤ id (PK)              │
│ nom             │  1:N  │ usuari_id (FK)        │
│ cognoms         │        │ text_entrada          │
│ correu (unique) │        │ estat_anim            │
│ spotify_id      │        │ canco_suggerida       │
│ foto_perfil     │        │ caratula_url          │
│ token_acces     │        │ data_entrada          │
│ refresh_token   │        └──────────────────────┘
│ data_registre   │
│ data_actualitzacio│       ┌──────────────────────┐
└──────┬──────────┘        │  ConfiguracioRadar   │
       │                   ├──────────────────────┤
       │ 1:1               │ id (PK)              │
       └──────────────────►│ usuari_id (FK/unique)│
       │                   │ generes_preferits    │
       │                   │ limit_popularitat    │
       │                   │ radar_actiu          │
       │                   │ autoneteja_activa    │
       │                   │ dia_setmana          │
       │                   └──────────────────────┘
       │
       │ N:M (via ParticipantSala)
       ▼
┌─────────────────┐        ┌──────────────────────┐
│  ParticipantSala│        │    SalaJoc           │
├─────────────────┤        ├──────────────────────┤
│ id (PK)         │◄──────┤ id (PK)              │
│ usuari_id (FK)  │  N:1  │ codi_sala (unique)   │
│ sala_id (FK)    │        │ tipus (tinder)        │
│ puntuacio       │        │ estat                │
└─────────────────┘        │ data_creacio         │
                           └──────────────────────┘
```

---

## 📡 API REST

Base URL: `http://localhost:3000`

### Autenticació
| Mètode | Endpoint | Descripció |
|---|---|---|
| `GET` | `/api/auth/login` | Inicia el flux OAuth 2.0 amb Spotify |
| `GET` | `/api/auth/callback/spotify` | Callback d'OAuth — intercanvia codi per tokens |

### Dashboard
| Mètode | Endpoint | Descripció |
|---|---|---|
| `GET` | `/api/dashboard/dades` | Dades principals del dashboard (top artistes, gèneres, etc.) |
| `GET` | `/api/dashboard/dada-del-dia` | Genera la Dada del Dia amb IA (inclou Roast Mode) |
| `GET` | `/api/dashboard/top/:tipus` | Top artistes o cançons (`artists`/`tracks`) per termini temporal |
| `GET` | `/api/dashboard/activitat` | Activitat recent — darreres cançons escoltades |
| `GET` | `/api/dashboard/festival` | Genera el cartell de festival personalitzat |

### Playlists
| Mètode | Endpoint | Descripció |
|---|---|---|
| `GET` | `/api/dashboard/playlists` | Llista totes les playlists de l'usuari |
| `GET` | `/api/dashboard/playlists/:id/duplicats` | Analitza duplicats d'una playlist |
| `POST` | `/api/dashboard/playlists/:id/netejar` | Elimina els duplicats d'una playlist |

### Tinder Musical
| Mètode | Endpoint | Descripció |
|---|---|---|
| `GET` | `/api/dashboard/tinder-tracks` | Obté cançons aleatòries per al Tinder Musical |

### Concerts
| Mètode | Endpoint | Descripció |
|---|---|---|
| `POST` | `/api/dashboard/concerts` | Cerca concerts via Ticketmaster API |

### Radar Underground
| Mètode | Endpoint | Descripció |
|---|---|---|
| `GET` | `/api/dashboard/radar/generes` | Llista de gèneres disponibles a Spotify |
| `GET` | `/api/dashboard/radar/config` | Obté la configuració actual del radar |
| `PUT` | `/api/dashboard/radar/config` | Actualitza la configuració del radar |
| `POST` | `/api/dashboard/radar/executar` | Executa el radar manualment |

### Intel·ligència Artificial
| Mètode | Endpoint | Descripció |
|---|---|---|
| `POST` | `/api/dashboard/diari` | Processa una entrada del Diari Emocional |
| `POST` | `/api/dashboard/soundtrack` | Genera un soundtrack per a un context donat |

---

## 🔌 WebSockets

El mòdul de **Tinder Musical** utilitza Socket.io per a la comunicació en temps real.

### Esdeveniments (Emetre → Servidor)
| Esdeveniment | Payload | Descripció |
|---|---|---|
| `crear_sala` | `{ usuari }` | Crea una sala nova i retorna el codi |
| `unir_sala` | `{ codi, usuari }` | S'uneix a una sala existent |
| `votar` | `{ sala_id, track_id, vot }` | Envia el vot per una cançó (like/skip) |

### Esdeveniments (Servidor → Client)
| Esdeveniment | Payload | Descripció |
|---|---|---|
| `sala_creada` | `{ codi_sala }` | Confirmació de creació amb codi |
| `usuari_unit` | `{ usuaris }` | Notifica que un nou usuari s'ha unit |
| `nova_canco` | `{ track }` | Envia una nova cançó per votar |
| `match!` | `{ track }` | Notifica un match entre els dos usuaris |
| `error` | `{ missatge }` | Missatge d'error |

---

## 📦 Requisits Previs

Assegura't de tenir instal·lat:

- **Node.js** v18 o superior → [nodejs.org](https://nodejs.org)
- **MySQL** 8.0+ o **XAMPP** → [apachefriends.org](https://www.apachefriends.org)
- **npm** v9+ (ve inclòs amb Node.js)
- Un compte de **Spotify** i una app creada a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Una clau d'API de **Google Gemini** → [ai.google.dev](https://ai.google.dev)
- *(Opcional)* Una clau d'API de **Ticketmaster** → [developer.ticketmaster.com](https://developer.ticketmaster.com)

---

## 🚀 Instal·lació i Desplegament

### 1. Clona el repositori

```bash
git clone https://github.com/BryanRuzafa/SONARIS.git
cd SONARIS
```

### 2. Configura la Base de Dades

Assegura't que MySQL estigui en marxa i crea la base de dades:

```sql
CREATE DATABASE IF NOT EXISTS sonaris_db;
```

> Amb XAMPP: obre el Control Panel, inicia MySQL, i accedeix a `http://localhost/phpmyadmin` per crear la BD.

### 3. Configura el Backend

```bash
cd server
npm install
```

Crea el fitxer `.env` a la carpeta `server/`:

```env
PORT=3000
DATABASE_URL="mysql://root:@localhost:3306/sonaris_db"

# Spotify
SPOTIFY_CLIENT_ID=el_teu_client_id
SPOTIFY_CLIENT_SECRET=el_teu_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback/spotify

# Google Gemini IA
GEMINI_API_KEY=la_teva_api_key

# Ticketmaster (opcional)
TICKETMASTER_API_KEY=la_teva_api_key
```

Executa les migracions de Prisma per crear les taules:

```bash
npx prisma migrate deploy
```

Inicia el servidor:

```bash
npm run dev      # Desenvolupament (amb nodemon)
npm start        # Producció
```

El servidor estarà disponible a: `http://localhost:3000`

### 4. Configura el Frontend

```bash
cd ../client
npm install
npm run dev
```

El client estarà disponible a: `http://localhost:5173`

### 5. Configura Spotify Developer

Al [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):

1. Crea una nova aplicació
2. Afegeix `http://127.0.0.1:3000/api/auth/callback/spotify` com a **Redirect URI**
3. Copia el **Client ID** i **Client Secret** al fitxer `.env`

---

## 🔐 Variables d'Entorn

| Variable | Descripció | Obligatòria |
|---|---|---|
| `PORT` | Port del servidor backend | No (default: 3000) |
| `DATABASE_URL` | URL de connexió MySQL (format Prisma) | ✅ Sí |
| `SPOTIFY_CLIENT_ID` | ID de l'app a Spotify Developer | ✅ Sí |
| `SPOTIFY_CLIENT_SECRET` | Secret de l'app a Spotify Developer | ✅ Sí |
| `SPOTIFY_REDIRECT_URI` | URI de callback d'OAuth | ✅ Sí |
| `GEMINI_API_KEY` | Clau d'API de Google Gemini | ✅ Sí |
| `TICKETMASTER_API_KEY` | Clau d'API de Ticketmaster | No |
| `OPENWEATHER_API_KEY` | Clau d'API d'OpenWeather | No |

---

## 📁 Estructura del Projecte

```
SONARIS/
│
├── 📄 README.md
│
├── 📁 client/                    # Frontend Vue.js
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── main.js               # Punt d'entrada Vue
│       ├── App.vue               # Component arrel
│       ├── style.css             # Estils globals
│       ├── router/
│       │   └── index.js          # Definició de rutes SPA
│       ├── stores/
│       │   └── auth.js           # Store Pinia d'autenticació
│       ├── services/             # Capa de comunicació amb API
│       └── views/
│           ├── Home.vue          # Landing page
│           ├── Login.vue         # Pàgina d'inici de sessió
│           ├── Callback.vue      # Gestió del callback OAuth
│           └── Dashboard.vue     # Dashboard principal (totes les funcionalitats)
│
└── 📁 server/                    # Backend Node.js
    ├── index.js                  # Punt d'entrada — Express + Socket.io
    ├── package.json
    ├── .env                      # Variables d'entorn (NO al repositori)
    │
    ├── prisma/
    │   ├── schema.prisma         # Esquema de la base de dades
    │   └── migrations/           # Historial de migracions SQL
    │
    ├── routes/
    │   ├── authRoutes.js         # Rutes d'autenticació OAuth
    │   └── dashboardRoutes.js    # Totes les rutes de l'API
    │
    ├── controllers/
    │   ├── authController.js     # Lògica OAuth Spotify
    │   ├── dashboardController.js # Lògica de totes les funcionalitats
    │   └── contextController.js  # Lògica d'IA (Diari + Soundtrack)
    │
    ├── services/
    │   ├── spotifyService.js     # Totes les crides a Spotify API
    │   ├── aiService.js          # Integració Google Gemini
    │   ├── ticketmasterService.js # Integració Ticketmaster API
    │   └── weatherService.js     # Integració OpenWeather API
    │
    ├── sockets/
    │   └── socketHandler.js      # Lògica WebSockets (Tinder Musical)
    │
    └── jobs/
        └── radarJob.js           # Cron Job del Radar Underground
```

---

## 🔄 Flux de Treball Complet

```
1. L'usuari accedeix a http://localhost:5173
2. Clica "Accedir amb Spotify" → Redirecció OAuth
3. Accepta els permisos a Spotify
4. Callback → El backend guarda l'usuari i tokens a MySQL
5. Redirecció al Dashboard amb sessió activa
6. El Dashboard carrega:
   ├── Dades del perfil de Spotify
   ├── Top artistes i cançons (3 períodes)
   ├── Dada del Dia generada per Gemini IA
   ├── Activitat recent
   └── Accés a tots els mòduls
```

---

## 📸 Captures de Pantalla

| Pàgina | Descripció |
|---|---|
| **Landing Page** | Hero animat amb sound bars, bento grid de features i mockup del dashboard |
| **Login** | Layout split amb branding i card d'accés Spotify |
| **Dashboard** | Panell central amb totes les estadístiques i mòduls |

---

## 👤 Autor

**Bryan Ruzafa Gonçalves**

- 🎓 Cicle Formatiu de Grau Superior — DAW (Desenvolupament d'Aplicacions Web)
- 🏫 Curs 2025-2026
- 📧 [bryannrg10@gmail.com](mailto:bryannrg10@gmail.com)
- 🐙 [github.com/BryanRuzafa](https://github.com/BryanRuzafa)

---

<div align="center">

**SONARIS** — Projecte Final DAW 2025/26

*Fet amb ❤️ i molta música*

[![Spotify](https://img.shields.io/badge/Connecta_amb_Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)](http://localhost:5173)

</div>
