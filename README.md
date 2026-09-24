# Giro di prova, fotogramma per fotogramma

Script per controllare il sito **a tempo reale** prima di ogni consegna: aprono l'app,
toccano i tasti uno per uno come farebbe una persona e registrano cosa si vede
ogni ~30 ms (mai schermi vuoti, vecchi o domande tagliate).
Non fanno parte dell'app: il sito non li carica mai.

## Come si lanciano
1. Dalla cartella del sito: `python3 -m http.server 8765`
2. In un altro terminale: `node test/giro-quiz.js` (serve Playwright con Chromium)

| Script | Cosa controlla |
|---|---|
| `avvio-film.js` | i primi 3,5 secondi dell'avvio: nessuna home vecchia, nessun salto |
| `quiz-film2.js` | passaggi pagina Quiz ↔ esercizio, argomenti, popup, coach |
| `giro-quiz.js` | tutti i tasti della schermata del quiz: risposte, ‹ ›, pallini, Ascolta, ☆, ⚐, Termina, ✕, simulazione |

Mappa e cloud sono simulati (`leaflet-mock.js`): la grafica vera della mappa va guardata sul telefono.
