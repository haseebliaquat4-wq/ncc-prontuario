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
| `giro-oggi.js` | la sezione «Oggi» della home: c'e' dal primo fotogramma, piazze e percorsi solo fra quelli completati (tutti i marker), ogni riga parte e torna in home, si spunta, il giorno dopo cambia, i conteggi si uniscono fra dispositivi |
| `oggi-giorni.js` | le domande di «Oggi» su due giorni: risposte salvate anche se Safari si chiude di colpo a meta' quiz, il giorno dopo 30 domande tutte nuove, niente conteggi doppi |
| `giro-indietro.js` | indietro su iPhone, ogni frame: in Safari la pagina non resta mai a meta', dopo il gesto sparisce al volo, con la freccia ‹ di Safari scorre via; nell'app sulla Home il trascinamento torna a posto; popup, carta di Cosa & Dove, testate con la (i) |
| `tariffe-domande.js` | le domande sulle tariffe senza anno hanno gli importi di luglio 2024, quelle con la delibera e l'anno restano com'erano; fatte davvero nel quiz e cercate con Cerca |
| `avvio-film.js` | i primi 3,5 secondi dell'avvio: nessuna home vecchia, nessun salto |
| `quiz-film2.js` | passaggi pagina Quiz ↔ esercizio, argomenti, popup, coach |
| `giro-quiz.js` | tutti i tasti della schermata del quiz: risposte, ‹ ›, pallini, Ascolta, ☆, ⚐, Termina, ✕, simulazione |
| `giro-topo.js` | ogni riga della pagina Topografia: entrata senza Home di passaggio, indietro che torna alla pagina |
| `giro-piazze.js` | ogni riga della pagina Piazze, con una sosta realistica: entrata senza Home di passaggio, ritorno alla pagina |
| `giro-norme.js` | ogni riga di Norme e tariffe: entrata senza Home, ‹ dalla schermata di partenza alla pagina, passo interno articolo → indice |
| `giro-profilo.js` | pagina Statistiche (ogni tasto) e ogni riga del Profilo; le righe che cancellano solo fino alla conferma |
| `giro-mappa.js` | i tasti della mappa: ◀ ▶, Studio/Cieco/Quiz vie, Scopri, ▶ riproduci, Linea, 🔀, ✏️ Correggi, (i), ‹ |

Mappa e cloud sono simulati (`leaflet-mock.js`): la grafica vera della mappa va guardata sul telefono.
