const questions = {
    1: [
    { type: "choice",
    question: "Kāds veids Tev vislabāk palīdz saprast jaunu tēmu?",
    options: ["Lasīt un pierakstīt", "Klausīties skaidrojumu", "Skatīties prezentāciju", "Praktiski darīt/risināt uzdevumus", "Apspriest ar citiem"] },
    { type: "choice", 
    question: "Kad Tev visvieglāk mācīties?",
    options: ["No rīta", "Pēcpusdienā", "Vakarā"] },
    ],
    15: [
    { type: "choice",
    question: "Kas tev visvairāk palīdz koncentrēties mācību laikā?",
    options: ["Klusums", "Mūzika", "Darbs kopā ar draugiem", "Īsi pārtraukumi", "Skaidrs plāns"] },
    { type: "text", question: "Kuri priekšmeti tev ir visinteresantākie? (Var ierakstīt vairākus)" },
    ],
    3: [
    { type: "text", question: "Ar ko tu labprāt nodarbojies ārpus skolas?" },
    { type: "text", question: "Vai tev ir mērķis vai sapnis, kura dēļ ir svarīgi labi mācīties?" },
    ],
    4: [
    { type: "choice",
    question: "Ko tu, pirmkārt, parasti dari, ja nesaproti tēmu no pirmās reizes?",
    options: ["Pārlasu/pārskatu vēlreiz", "Jautāju skolotājam", "Meklēju informāciju internetā", "Apspriežu ar klasesbiedriem", "Vienkārši eju tālāk"] },
    { type: "choice",
    question: "Kā tu jūties par grupu darbu klasē?",
    options: ["Man patīk strādāt kopā ar citiem", "Es labāk strādāju viens/viena", "Tas atkarīgs no tēmas un grupas"] },
    ],
    5: [
    { type: "choice",
    question: "Kas tev visvairāk palīdz neatlikt mājasdarbus?",
    options: ["Termiņa tuvošanās", "Interese par tēmu", "Vecāku atbalsts", "Laika plānošana", "Mūzika/motivācija"] },
    { type: "choice",
    question: "Kā tev visērtāk saņemt skolotāja komentārus?",
    options: ["Mutiski", "Rakstiski (piemēram, piezīmes vai e-vidē)", "Klases diskusijā", "Individuālā sarunā"] },
    ],
    6: [
    {type: "info", 
    content: "Mans Ziemassvētku plāns: 1) ēst. 2) priecāties. 3) atkārtot 1. punktu. ŠODIEN NAV AKTIVITĀTES!"}
    ],
    7: [
    {type: "info",
    content: "Sakiet ko gribiet, bet brīnumi sākas tur, kur sākas brīvdienas. ŠODIEN NAV AKTIVITĀTES!"
    }
    ],
    8: [
    {type: "info",
    content: `[ŠAHA PĒTNIEKU TAKA]
    Tavs uzdevums ir matēt pretinieka karali pēc viena gājiena (Tu spēlē kā baltie).
    Bet visas šaha figūras pazaudējušās skolas telpās! Atradi tās un, sekojot noradījumiem, novieto uz šaha dēļa tā, lai varētu izdarīt matu.
    Šajā aktivitātē Tev ir iespēja tikt pie papildus balvām! Skaties e-klases e-pastā par papildu informāciju!`
    }
    ],
    9: [
    {type: "choice",
    question: "Kas tev ir svarīgāk atgriezeniskajā saitē?",
    options: ["Zināt, ko es izdarīju pareizi", "Saprast, ko varu uzlabot", "Saņemt ieteikumus nākamajiem uzdevumiem"]
    },
    {type: "text", question: "Kā tu jūties, ja saņem zemu vērtējumu?"}
    ],
    10: [
    {type: "text", question: "Kas tev traucē mācīties tā, kā tu vēlētos?"},
    {type: "text", question: "Kura stunda tev visvairāk palikusi atmiņā kā interesanta? Kāpēc?"}
    ],
    11: [
    {type: "text", question: "Ko tu vēlētos mainīt tajā, kā notiek stundas?"},
    {type: "text", question: "Apraksti sevi trīs vārdos kā skolēnu."}
    ],
    16: [
    {type: "text", question: "Kas, tavuprāt, tev visvairāk palīdz mācīties?"},
    {type: "text", question: "Ko tu gribētu, lai skolotājs par tevi zina?"}
    ],
    13: [
    {type: "info", content: "Manā mājā ir divu veidu cilvēki: tie, kas dāvanu papīru tin skaisti, un tie, kas vienkārši cer, ka tas turēsies ar lenti. ŠODIEN NAV AKTIVITĀTES!"}
    ],
    14: [
    {type: "info", content: "Priecīgus Ziemassvētkus! Счастливого Рождества! Merry Christmas! Frohe Weihnachten! Joyeux Noël! ¡Feliz Navidad! Wesołych Świąt! ŠODIEN NAV AKTIVITĀTES!"}
    ],
    2: [
    {type: "info", content: "[ZIEMAS MISIJA: FOTO AR...] Jāuztaisa 3 mazi foto (var selfijus vai vienkārši priekšmetus), kuros redzams kaut kas saistīts ar ziemu vai Ziemassvētkiem. Piemēram, foto ar sniegavīru, foto ar egli, foto ar karstu kakao krūzi utt. Foto jāiesūta matemātikas skolotājam. Šajā aktivitātē ir iespēja tikt pie papildus balvām!"}
    ],
    12: [
    {type: "info", content: "[MAZĀ DĀVANIŅA SKOLAI] Tavs uzdevums ir sarūpēt nelielu “dāvaniņu” skolai - izgriezt papīra sniegpārslas vai citas ziemīgas figūriņas un palīdzēt izrotāt skolas logus. Kad esi pabeidzis, parādi savu veikumu matemātikas skolotājam, lai viņš varētu to pievienot pie kopīgās dekorācijas. Šajā aktivitātē Tev ir iespēja tikt pie papildus balvām!"}
    ],
    17: [
    {type: "info", content: "[ZIEMASSVĒTKU VIKTORĪNA] Pārbaudi savas zināšanas par Ziemassvētkiem un to tradīcijām, atbildot uz viktorīnas jautājumiem! Visā skolā ir pieejami QR kodi ar jautājumiem. Atrodi visus kodus, atbildi uz jautājumiem. Šajā aktivitātē ir iespēja tikt pie papildus balvām!"}
    ],
    18: [
    {type: "info", content: "Šī ir pēdējā aktivitāte! Paldies, ka piedalījies! Neaizmirsi iztērēt savas iegūtās punktus, jo pēc plkst. 15.00. tīmekļa vietne vairs nedarbosies!"}
    ]
};