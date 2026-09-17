/* norme-data.js — Regolamento del servizio taxi, artt. 38-61
   Sintesi del corso per il Ruolo Conducenti della Provincia di Milano.
   Serve alla sezione Norme: schede di studio, numeri da ricordare, quiz.
   sez  = articoli con i punti chiave
   num  = i numeri secchi (quelli che l'esame chiede a memoria)
   cls  = le quattro classi di sospensione
   quiz = [domanda, [opzioni], indiceGiusto, articolo] */
window.__NORME__={
fonte:"Regolamento servizio taxi — bacino aeroportuale di Milano",
sez:[
{id:"n38",art:"38-39",t:"Contrassegni del turno e fuori servizio",p:[
"Ogni auto porta DUE contrassegni del turno identici per informazione, dimensioni e posizione, stabiliti dalla Giunta regionale.",
"Il grande, 15×15 cm, sta sul LUNOTTO in alto a DESTRA rispetto alla direzione di marcia.",
"Il piccolo, 10×10 cm, sta sul PARABREZZA in alto al CENTRO.",
"Sei fuori servizio se: non sei in turno, l'auto è guasta, il tassametro non funziona, sei in ferie o riposo, la licenza è sospesa.",
"Fuori servizio: esponi la scritta ben visibile e non puoi fare corse."]},
{id:"n40",art:"40-44",t:"Obblighi, rifiuti e divieti",p:[
"Devi tenere il veicolo pulito ed efficiente e avere un abbigliamento decoroso.",
"A inizio corsa: accertati della destinazione e AZIONA il tassametro.",
"A fine corsa: funzione «cassa», rilascia la ricevuta, azzera il tassametro.",
"È OBBLIGATORIO trasportare passeggeri, bagagli e cani accompagnatori per non vedenti.",
"PUOI rifiutare: persone in stato di ebbrezza o sotto stupefacenti, minori non accompagnati, animali non compatibili, giustificati motivi di sicurezza.",
"VIETATO: prenotazioni in forme non autorizzate, estranei a bordo senza consenso, mangiare durante la guida, canottiere, pantaloni corti, ciabatte, tute da ginnastica, occultare tassametro o segni distintivi."]},
{id:"n45",art:"45-47",t:"Come acquisisci il servizio e i reclami",p:[
"In turno la corsa parte da: posteggio, transito (solo se non ci sono posteggi vicini), telefono o nuove tecnologie, centrali Radiotaxi.",
"Negli AEROPORTI solo posteggio o sistemi dedicati: niente transito.",
"La sosta di attesa su richiesta dura al massimo 60 minuti, con cauzione anticipata.",
"I reclami vanno alla Commissione tecnica disciplinare o al Comune entro 90 GIORNI dall'evento."]},
{id:"n49",art:"49-53",t:"Vigilanza, ritiro e richiamo",p:[
"La vigilanza è della POLIZIA LOCALE dei Comuni del bacino.",
"Ritiro immediato di licenza e contrassegni (macchina e turno) per violazioni gravi contestate sul momento: contrassegni contraffatti, guida di persona non iscritta al ruolo, tassametro non aggiornato, sigilli alterati.",
"Ritiro cautelativo dal Comune per motivi di idoneità psicofisica o provvedimenti penali restrittivi.",
"Nei casi meno gravi si procede con il richiamo formale."]},
{id:"n55",art:"55-56",t:"Sospensione e le quattro classi",p:[
"Il Comune sospende la licenza fino a un MASSIMO di 90 giorni, seguendo la Commissione tecnica disciplinare.",
"Recidiva e inottemperanza aggravano la sanzione.",
"Le violazioni sono divise in quattro classi di gravità crescente."]},
{id:"n57",art:"57",t:"Decadenza della licenza",p:[
"Servizio svolto da chi non ha i requisiti, o mancanza dei requisiti soggettivi.",
"Sospensioni che nell'ultimo QUINQUENNIO superano complessivamente 90 giorni.",
"Oppure cinque sospensioni per mancata ottemperanza alle classi 3 e 4.",
"Manomissione fraudolenta del tassametro per alterarne funzionamento o calcolo.",
"Mancata regolarizzazione nei termini dopo diffida o provvedimento."]},
{id:"n60",art:"60-61",t:"Commissione tecnica disciplinare e Conferenza",p:[
"Commissione tecnica disciplinare: dirigente del servizio taxi (presidente), un rappresentante della Motorizzazione Civile di Milano, un rappresentante delle Associazioni dei consumatori, tre esperti fra i dipendenti dei Comuni negli organi di vigilanza.",
"Fa l'istruttoria dei procedimenti disciplinari.",
"Conferenza del servizio taxi del bacino aeroportuale: organismo CONSULTIVO istituito con decreto della Giunta regionale."]}
],
num:[
{v:"15×15 cm",d:"contrassegno grande — lunotto, in alto a destra"},
{v:"10×10 cm",d:"contrassegno piccolo — parabrezza, in alto al centro"},
{v:"2",d:"i contrassegni del turno su ogni auto"},
{v:"60 minuti",d:"sosta di attesa massima su richiesta, con cauzione"},
{v:"90 giorni",d:"termine per presentare reclamo dall'evento"},
{v:"90 giorni",d:"durata massima della sospensione della licenza"},
{v:"5 anni",d:"il quinquennio che porta a decadenza se le sospensioni superano 90 giorni"},
{v:"5",d:"sospensioni per inottemperanza classi 3 e 4 che portano a decadenza"},
{v:"3",d:"esperti nella Commissione tecnica disciplinare"}
],
cls:[
{n:1,g:"da 1 a 3 giorni",ex:["terza inottemperanza a richiami","manca il segnale luminoso «TAXI»","mancata esposizione delle targhe","inottemperanza a visite straordinarie"]},
{n:2,g:"da 3 a 7 giorni",ex:["terza inottemperanza della stessa fattispecie in 5 anni","inosservanza del turno di servizio","allungamento del percorso","trasporto di persone estranee"]},
{n:3,g:"da 7 a 30 giorni",ex:["abusi sull'affidamento a sostituti alla guida o collaboratori familiari","occultamento del tassametro o dei contrassegni","uso non autorizzato di taxi di scorta"]},
{n:4,g:"da 30 a 90 giorni",ex:["rifiuto del servizio a portatori di handicap","veicolo destinato a utenza non indifferenziata","falsificazione di turni, targhe o contrassegni","tassametro non omologato o privo di sigilli","manomissione o rimozione non autorizzata del tassametro","applicazione di tariffe non dovute"]}
]
,
quiz:[["Di che dimensioni è il contrassegno del turno di maggiori dimensioni?", ["15×15 cm", "10×10 cm", "20×20 cm"], 0, "38"], ["Dove va posizionato il contrassegno da 15×15 cm?", ["Sul lunotto, in alto a destra", "Sul parabrezza, in alto al centro", "Sulla portiera lato guida"], 0, "38"], ["Dove va il contrassegno da 10×10 cm?", ["Sul parabrezza, in alto al centro", "Sul lunotto, in alto a destra", "Sul cruscotto"], 0, "38"], ["Quanti contrassegni del turno deve avere ogni autovettura?", ["Due, identici", "Uno solo", "Tre, uno per finestrino"], 0, "38"], ["Chi definisce informazione, dimensioni e posizione dei contrassegni?", ["La Giunta regionale", "Il singolo Comune", "La Motorizzazione Civile"], 0, "38"], ["Quale di questi NON rende il taxi fuori servizio?", ["Avere l'auto piena di bagagli", "Il tassametro guasto", "La licenza sospesa"], 0, "39"], ["Un taxi fuori servizio può fare corse?", ["No, e deve esporre la scritta ben visibile", "Sì, ma solo su prenotazione", "Sì, se il cliente accetta"], 0, "39"], ["Quando va azionato il tassametro?", ["All'inizio della corsa", "Solo se il cliente lo chiede", "A metà percorso"], 0, "41"], ["Cosa devi fare al termine della corsa?", ["Azionare «cassa», rilasciare ricevuta, azzerare il tassametro", "Solo azzerare il tassametro", "Solo rilasciare la ricevuta"], 0, "41"], ["Il trasporto dei cani accompagnatori per non vedenti è:", ["Obbligatorio", "A discrezione del conducente", "Consentito solo con museruola e sovrapprezzo"], 0, "42"], ["A chi PUOI rifiutare la corsa?", ["A un minore non accompagnato", "A un portatore di handicap", "A chi paga in contanti"], 0, "43"], ["Rifiutare il servizio a un portatore di handicap in che classe ricade?", ["Classe 4", "Classe 1", "Classe 2"], 0, "56"], ["Quale di questi capi è VIETATO alla guida?", ["La canottiera", "La camicia a maniche corte", "Il maglione"], 0, "44"], ["È consentito consumare cibo durante la guida?", ["No, è espressamente vietato", "Sì, se il taxi è fermo nel traffico", "Sì, se non ci sono passeggeri"], 0, "44"], ["Negli aeroporti come si acquisisce il servizio?", ["Solo tramite posteggio o sistemi dedicati", "Anche in transito", "Solo tramite Radiotaxi"], 0, "45"], ["Quando puoi acquisire la corsa in transito?", ["Solo se non ci sono posteggi nelle vicinanze", "Sempre", "Mai"], 0, "45"], ["Quanto dura al massimo la sosta di attesa su richiesta?", ["60 minuti", "30 minuti", "120 minuti"], 0, "46"], ["La sosta di attesa richiede:", ["Una cauzione anticipata dall'utente", "Il pagamento a fine sosta", "Nessun anticipo"], 0, "46"], ["Entro quanto tempo va presentato un reclamo?", ["90 giorni dall'evento", "30 giorni dall'evento", "6 mesi dall'evento"], 0, "47"], ["A chi è affidata la vigilanza sul servizio?", ["Alla Polizia Locale dei Comuni del bacino", "Alla Guardia di Finanza", "Alla Motorizzazione Civile"], 0, "49"], ["Con contrassegni contraffatti contestati sul momento, l'organo accertatore:", ["Ritira subito licenza e contrassegni", "Fa solo un richiamo", "Applica una multa e basta"], 0, "51"], ["Il ritiro cautelativo è disposto per:", ["Motivi di idoneità psicofisica o provvedimenti penali restrittivi", "Ritardo nel pagamento della licenza", "Troppe corse rifiutate"], 0, "52"], ["Nei casi di minore gravità si procede con:", ["Il richiamo formale", "La decadenza", "La sospensione di 90 giorni"], 0, "53"], ["Qual è la durata massima della sospensione della licenza?", ["90 giorni", "30 giorni", "180 giorni"], 0, "55"], ["Quanto dura la sospensione di Classe 1?", ["Da 1 a 3 giorni", "Da 3 a 7 giorni", "Da 7 a 30 giorni"], 0, "56"], ["Quanto dura la sospensione di Classe 2?", ["Da 3 a 7 giorni", "Da 1 a 3 giorni", "Da 30 a 90 giorni"], 0, "56"], ["Quanto dura la sospensione di Classe 3?", ["Da 7 a 30 giorni", "Da 3 a 7 giorni", "Da 30 a 90 giorni"], 0, "56"], ["Quanto dura la sospensione di Classe 4?", ["Da 30 a 90 giorni", "Da 7 a 30 giorni", "Da 1 a 3 giorni"], 0, "56"], ["L'allungamento del percorso in che classe ricade?", ["Classe 2", "Classe 1", "Classe 4"], 0, "56"], ["L'occultamento del tassametro in che classe ricade?", ["Classe 3", "Classe 1", "Classe 4"], 0, "56"], ["Il tassametro privo di sigilli in che classe ricade?", ["Classe 4", "Classe 2", "Classe 3"], 0, "56"], ["La mancanza del segnale luminoso «TAXI» in che classe ricade?", ["Classe 1", "Classe 3", "Classe 4"], 0, "56"], ["Applicare tariffe non dovute in che classe ricade?", ["Classe 4", "Classe 2", "Classe 1"], 0, "56"], ["Quante sospensioni per inottemperanza alle classi 3 e 4 portano a decadenza?", ["Cinque", "Tre", "Dieci"], 0, "57"], ["Nell'ultimo quinquennio la decadenza scatta se le sospensioni superano:", ["90 giorni complessivi", "30 giorni complessivi", "un anno"], 0, "57"], ["La manomissione fraudolenta del tassametro comporta:", ["La decadenza della licenza", "Una sospensione di 3 giorni", "Un richiamo"], 0, "57"], ["Chi presiede la Commissione tecnica disciplinare?", ["Un dirigente competente alla gestione del servizio taxi", "Il sindaco", "Un rappresentante dei consumatori"], 0, "60"], ["Quanti esperti siedono nella Commissione tecnica disciplinare?", ["Tre", "Uno", "Cinque"], 0, "60"], ["Chi NON fa parte della Commissione tecnica disciplinare?", ["Un rappresentante delle centrali Radiotaxi", "Un rappresentante della Motorizzazione Civile", "Un rappresentante delle Associazioni dei consumatori"], 0, "60"], ["La Conferenza del servizio taxi del bacino aeroportuale è:", ["Un organismo consultivo", "Un organo giudicante", "Un ufficio comunale"], 0, "61"], ["La Conferenza è istituita con:", ["Decreto della Giunta regionale", "Delibera del Comune", "Legge dello Stato"], 0, "61"]]
};
