export interface InterviewTurn {
  id: string
  question: string
  answer?: string
  audio?: string
}

export const INTERVIEW_HOST = 'You'
export const INTERVIEW_GUEST = 'Leo-Galli'
export const INTERVIEW_AVATAR = 'https://github.com/Leo-Galli.png'

export const INTERVIEW_TURNS: InterviewTurn[] = [
  {
    id: 'intro',
    question:
      'Benvenuti a questo approfondimento tecnico. Oggi analizzeremo l\'ingegneria del progetto Aegis-Beacon. Per iniziare: chi sei e da chi è composto il team di sviluppo?',
    answer:
      'Sono Leonardo Galli, Leo-Galli su GitHub. Aegis-Beacon è un progetto personale open source sotto licenza MIT. Il nucleo lo sviluppo io; il resto è RadioLib, il core ESP32, i tester sul campo e chi apre issue e pull request.',
    audio: '/assets/interview/a1.mp3',
  },
  {
    id: 'idea',
    question: 'Qual è l\'idea di base su cui si regge il progetto Aegis-Beacon?',
    answer:
      'Un beacon di soccorso che, quando ogni rete è caduta, continua a mandare la posizione in Morse su 433 MHz. Chiunque con una radio può sentirlo. Non è un telefono. È l\'ultimo segnale che ti resta.',
    audio: '/assets/interview/a2.mp3',
  },
  {
    id: 'problem',
    question: 'Quale problema di ingegneria o operativo intendevate risolvere?',
    answer:
      'In montagna o in valanga il cellulare muore, il GPS da solo non chiama nessuno, e i sistemi proprietari costano e non parlano tra loro. Serviva un segnale che un soccorritore possa copiare con hardware comune, senza app e senza rete.',
    audio: '/assets/interview/a3.mp3',
  },
  {
    id: 'why-arch',
    question: 'Per quale motivo avete scelto di sviluppare un\'architettura di questo tipo?',
    answer:
      'ESP32 più radio SX1262, GPS opzionale, OLED e una cella 18650. Morse in CW, non un pacchetto digitale, così basta un Baofeng in AM o un SDR. Il percorso radio è peer to peer. Il WiFi serve solo al portale di configurazione.',
    audio: '/assets/interview/a4.mp3',
  },
  {
    id: 'workflow',
    question: 'Come avete organizzato il flusso di lavoro a livello di strumenti e sviluppo?',
    answer:
      'Firmware su PlatformIO e Arduino, wiki come documentazione, sito Astro per demo e builder, bridge Python per USB. Tutto vive sul repo GitHub, con issue e CI. Si misura, si rompe, si scrive, poi si riflash.',
    audio: '/assets/interview/a5.mp3',
  },
  {
    id: 'stack',
    question:
      'Entriamo nei dettagli dell\'hardware e del software. Quali tecnologie avete selezionato e con quali motivazioni tecniche?',
    answer:
      'ESP32 per deep sleep e WiFi locale, SX1262 per CW a 433 MHz, OLED SSD1309 SPI, GPS NEO-6M opzionale, NVS per la config. Morse perché è lo standard più copiabile. RadioLib, non un protocollo chiuso. BOM da 23 a 28 dollari.',
    audio: '/assets/interview/a6.mp3',
  },
  {
    id: 'hardest',
    question: 'Qual è stata la principale difficoltà tecnica riscontrata durante lo sviluppo?',
    answer:
      'Tenere i microampere in sleep, i pin input-only dell\'ESP32, un CW pulito sull\'SX1262, e far convivere GPS, OLED e radio sulla stessa cella senza far cadere il TX. Il difficile non è accendere i moduli. È spegnerli bene.',
    audio: '/assets/interview/a7.mp3',
  },
  {
    id: 'results',
    question: 'Quali sono i risultati finali di cui siete più soddisfatti?',
    answer:
      'Un oggetto da tasca, oltre 65 ore in BEACON, quattro modi, portale CONFIG, bridge seriale, firmware e wiki aperti. Un radioamatore lo capisce subito. Un soccorritore lo sente senza installare nulla.',
    audio: '/assets/interview/a8.mp3',
  },
  {
    id: 'learn',
    question: 'Cosa si impara analizzando l\'architettura di questo progetto?',
    answer:
      'Vincoli veri: potenza, duty cycle, pin, rumore, normativa. Hardware e firmware non si separano. Il protocollo più vecchio, il Morse, vince quando manca l\'infrastruttura. L\'ingegneria è il compromesso che resta in campo, non quello che sta in slide.',
    audio: '/assets/interview/a9.mp3',
  },
  {
    id: 'advice',
    question:
      'Quali consigli pratici dareste ad altri studenti o sviluppatori che desiderano realizzare un sistema simile?',
    answer:
      'Parti dal BOM e da un breadboard. Misura la corrente in sleep prima di saldare. Leggi i pin ESP32. Testa la radio con un ricevitore vero, non solo il serial. Documenta mentre rompi le cose. Poi apri il repo.',
    audio: '/assets/interview/a10.mp3',
  },
  {
    id: 'thanks',
    question: 'Grazie per questo chiaro ed esaustivo approfondimento tecnico!',
  },
]
