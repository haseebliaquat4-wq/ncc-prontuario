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
| `giro-importa.js` | Importa dal PDF: tutti i 208 percorsi del documento con tutte le vie (pag. 17: prima la colonna di sinistra, poi quella di destra), quelli che hai già uguali nascosti, lo stesso nome con le tappe del tuo, la ricerca (nome, via, pagina) che tiene la tastiera, una riga in fondo che non riporta l'elenco in cima, Aggiungi (il nome con la pagina, il vecchio percorso e i suoi marker intatti, il nuovo senza marker, dopo un ricarico restano), Correggi le tappe con in cima quelli con OPPURE, iPad in orizzontale col tema scuro |
| `giro-ipad3.js` | iPad, fase 3: Norme con l'elenco a sinistra e l'articolo a destra (ogni voce, quiz coi tasti 1-4, girando l'iPad, ‹ torna da dove sei venuto), quiz in orizzontale con domanda e risposte affiancate e la tastiera (il perche' dell'errore), quiz in verticale compatto, Home in verticale coi riquadri grandi; Split View da 320 a 1024 punti senza niente che scorre di lato; telefono invariato |
| `giro-ipad.js` | su iPad: pagine al centro e in colonne (tutto in uno schermo in orizzontale, si ridistribuiscono ruotando), la piazza con la mappa accanto, «Scrivi le vie» con un riquadro per via per la Pencil; sul telefono niente cambia |
| `giro-pencil.js` | Disegna a memoria (Pencil lungo il percorso: tutte le tappe e nell'ordine; meta' percorso; un altro; col dito sul telefono) e Mappa muta (dieci tocchi, giudizi, riepilogo, rigioca); entrata e uscita senza Home di passaggio |
| `giro-oggi.js` | la sezione «Oggi» della home: c'e' dal primo fotogramma, 2 quiz, errori, 6 piazze e 5 percorsi solo fra quelli completati (tutti i marker), ogni riga parte e torna in home, si spunta, il giorno dopo cambia, i conteggi si uniscono fra dispositivi |
| `oggi-caso.js` | piazze e percorsi di «Oggi» su dieci giorni con l'orologio: ogni giorno a caso, mai quelli di ieri, in dieci giorni quasi tutti, sempre completati; due dispositivi lo stesso giorno scelgono gli stessi; nomi corti nella riga, la prossima per prima; Disegna a memoria conta |
| `oggi-sync.js` | «Oggi» su iPad e iPhone con un cloud finto condiviso: stesse scelte, quiz, piazze, percorsi e Disegna a memoria passano da uno all'altro tornando sull'app; due percorsi fatti insieme senza sincronizzarsi non si perdono; riaprendo l'app tutto resta salvato |
| `oggi-giorni.js` | i due quiz di «Oggi» su due giorni: risposte salvate anche se Safari si chiude di colpo a meta' quiz, il secondo quiz senza domande del primo, 2/2 si spunta, il giorno dopo 30 domande tutte nuove, niente conteggi doppi |
| `giro-indietro.js` | indietro su iPhone, ogni frame: in Safari la pagina non resta mai a meta', dopo il gesto sparisce al volo, con la freccia ‹ di Safari scorre via; nell'app sulla Home il trascinamento torna a posto; popup, carta di Cosa & Dove, testate con la (i) |
| `tariffe-domande.js` | le domande sulle tariffe senza anno hanno gli importi di luglio 2024, quelle con la delibera e l'anno restano com'erano; fatte davvero nel quiz e cercate con Cerca |
| `avvio-film.js` | i primi 3,5 secondi dell'avvio: nessuna home vecchia, nessun salto |
| `quiz-film2.js` | passaggi pagina Quiz ↔ esercizio, argomenti, popup, coach |
| `giro-quiz.js` | tutti i tasti della schermata del quiz: risposte, ‹ ›, pallini, Ascolta, ☆, ⚐, Termina, ✕, simulazione; indietro del telefono a meta' quiz: esce subito, senza «Vuoi uscire?», risposte salvate |
| `giro-topo.js` | ogni riga della pagina Topografia: entrata senza Home di passaggio, indietro che torna alla pagina; dalla mappa (Studio, Cieco, Quiz vie, Percorso a caso) anche il tasto del telefono torna alla pagina |
| `giro-piazze.js` | ogni riga della pagina Piazze, con una sosta realistica: entrata senza Home di passaggio, ritorno alla pagina |
| `giro-norme.js` | ogni riga di Norme e tariffe: entrata senza Home, ‹ dalla schermata di partenza alla pagina, passo interno articolo → indice; Tariffe pagina intera con ‹ · titolo · (i), il telefono torna alla pagina Norme, il quiz tariffe torna alle Tariffe |
| `giro-profilo.js` | pagina Statistiche (ogni tasto delle due schede, si torna sulla stessa scheda; simulazione e piano tornano alla pagina) e ogni riga del Profilo (il report settimanale torna al Profilo); le righe che cancellano solo fino alla conferma; il pannello della voce non si riapre da solo; il report della domenica esce solo sulla Home |
| `giro-mappa.js` | i tasti della mappa: ◀ ▶, Studio/Cieco/Quiz vie, Scopri, ▶ riproduci, Linea, 🔀, ✏️ Correggi, (i), ‹ |

Mappa e cloud sono simulati (`leaflet-mock.js`): la grafica vera della mappa va guardata sul telefono.
