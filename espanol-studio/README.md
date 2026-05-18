# Español B1→B2 · Programa de Estudio

App web interattiva per lo studio di spagnolo universitario (Lingua e Traduzione Spagnola 2, itinerario B1→B2).

## Struttura del progetto

```
espanol-studio/
├── index.html              # Entry point
├── README.md
├── .gitignore
│
├── css/
│   ├── reset.css           # CSS reset
│   ├── variables.css       # Design tokens (colori, font, spaziature)
│   ├── layout.css          # Header, shell, welcome screen, bottoni utility
│   ├── sidebar.css         # Pannello laterale con i giorni
│   ├── study.css           # Header del giorno, tab, spiegazione
│   ├── exercises.css       # Carte degli esercizi, quiz, feedback
│   ├── modal.css           # Modal per la chiave API
│   └── animations.css      # Keyframes
│
├── js/
│   ├── data.js             # Tutti i 23 giorni di studio (calendario)
│   ├── api.js              # Comunicazione con l'API Anthropic
│   ├── ui.js               # Rendering helpers (sidebar, view, tabs)
│   ├── exercises.js        # Rendering e correzione esercizi
│   └── app.js              # Controller principale (init, navigazione, modal)
│
└── assets/
    └── img/
        ├── logo.svg
        ├── book.svg
        ├── book-open.svg
        ├── pencil.svg
        ├── eye.svg
        ├── key.svg
        └── exam.svg
```

## Come usare l'app

### 1. Ottenere la chiave API

1. Vai su [console.anthropic.com](https://console.anthropic.com)
2. Crea un account (gratuito) o accedi
3. Vai su **API Keys** → **Create Key**
4. Copia la chiave (inizia con `sk-ant-…`)

> ⚠️ La chiave viene salvata solo nel **localStorage del tuo browser**. Non viene mai inviata a server esterni.

### 2. Avviare localmente (VS Code)

```bash
# Clona o apri la cartella in VS Code
code espanol-studio/

# Avvia con Live Server (estensione VS Code raccomandata)
# Tasto destro su index.html → "Open with Live Server"
# oppure con Python:
python3 -m http.server 8080
# poi apri http://localhost:8080
```

> ℹ️ Il file deve essere servito tramite un server HTTP (anche locale) perché i browser bloccano le richieste fetch da `file://`. Live Server funziona perfettamente.

### 3. Pubblicare su GitHub Pages

```bash
# 1. Crea un repo su github.com (es. "espanol-studio")
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/espanol-studio.git
git push -u origin main

# 2. Vai su GitHub → Settings → Pages
#    Source: Deploy from a branch → main → / (root)
#    Salva

# 3. L'app sarà disponibile su:
#    https://TUO-USERNAME.github.io/espanol-studio/
```

### 4. Usare l'app

1. Apri l'app nel browser
2. Inserisci la chiave API nel modal iniziale e clicca **Comenzar**
3. Seleziona un giorno dal pannello sinistro
4. Leggi la **Explicación** generata dall'IA
5. Passa agli **Ejercicios** e fai gli esercizi con correzione automatica
6. Clicca **✓ Día completado** per segnare il giorno come fatto

## Tipi di esercizi

| Tipo | Descrizione |
|------|-------------|
| Completar | Riempi i vuoti con la forma verbale corretta |
| Transformar | Trasforma la frase secondo l'istruzione |
| Traducir | Traduci dall'italiano allo spagnolo |
| Producción libre | Scrivi liberamente; correzione via IA |
| Quiz | Scelta multipla con spiegazione della risposta |

## Requisiti tecnici

- Browser moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Connessione internet (per Google Fonts + API Anthropic)
- Chiave API Anthropic con crediti disponibili
- **Nessun framework, nessun build step**: vanilla HTML/CSS/JS puro

## Personalizzazione

- **Aggiungere giorni**: modifica `js/data.js` e aggiungi voci a `STUDY_DAYS` e `WEEK_GROUPS`
- **Cambiare colori**: modifica le variabili CSS in `css/variables.css`
- **Cambiare il modello IA**: cambia `MODEL` in `js/api.js`
- **Modificare i prompt**: i system prompt sono in `js/exercises.js` (`EXPLANATION_SYSTEM`, `EXERCISES_SYSTEM`)

## Note sulla sicurezza

La chiave API è salvata in `localStorage` e inviata **direttamente dal browser** all'API di Anthropic. Questo è sicuro per uso personale. Per un'app condivisa con altri utenti, implementa un backend proxy che gestisce la chiave lato server.
