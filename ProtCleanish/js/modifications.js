// valuetypes:
// % means a percentage reduction
// multi means a multiplier to the category
// v means a value addition
// r means replace the value (e.g. diesel --> biodiesel)
//
var modifications = [

    {
        name: "Metanhemmere i fôret",
        gameplayText: "Kuers mage lager 15% mindre metan.",
        description: "Noen stoffer hjelper med å redusere metanproduksjon, slik som Bovaer og rødalger. " +
                     "Dette kortet emulerer effekten av 3-NOP",
        source: ["production", "production"],
        category: ["melk", "storfekjøtt"],
        subcategory: ["vomogtarm", "vomogtarm"],
        value: [0.16, 0.16],
        valueType: ["%", "%"],
        active: false,
        prerequisite: [],
        image: "kortbilde2"
    },  //selvlagd
    {
        name: "Redusere matsvinn",
        gameplayText: "4% mindre utslipp fra fôr til ku og storfe",
        description: "Mugg, fordamping og annet kan påvirke lagret mat. " +
                     "Bedre verktøy og områder for lagring kan redusere dette",
        source: ["production", "production", "production", "production", "production", "production"],
        category: ["melk", "melk", "storfekjøtt", "storfekjøtt"],
        subcategory: ["innkjøp", "kraftfor", "innkjøp", "kraftfor"],
        value: [0.04, 0.04, 0.04, 0.04],
        valueType: ["%", "%", "%", "%"],
        active: false,
        prerequisite: [],
        image: "kortbilde3"
    },  //https://www.wwf.org.uk/food/waste/farms 21/4/2025
    {
        name: "Bedre fôr",
        gameplayText: "2% bedre produktivitet og 7% mindre metanproduksjon hos ku og storfe.",
        description: "Hvis grovfôret til kuer blir høstet inn ved optimale tider, " +
                     "vil det minke mengden klimagasser som til slutt kommer av det. Ved utider kan det bli matsvinn.",
        source: ["production", "production", "production", "production"],
        category: ["melk", "storfekjøtt", "melk", "storfekjøtt"],
        subcategory: ["multiplikator", "multiplikator", "vomogtarm", "vomogtarm"],
        value: [0.02, 0.02, 0.07, 0.07],
        valueType: ["v", "v", "%", "%"],
        active: false,
        prerequisite: [],
        image: "kortbilde4" 
    },  //https://unsplash.com/photos/brown-grass-and-green-trees-near-river-during-daytime-gP8xaqXO3J0 21/4/2025
    {
        name: "Sterkere avl",
        gameplayText: "Kuers mage lager 5% mindre metan",
        description: "Gjennom avlsprogram kan man få kuer som effektivt gir mindre utslipp.",
        source: ["production", "production"],
        category: ["melk", "storfekjøtt"],
        subcategory: ["multiplikator", "multiplikator"],
        value: [0.02, 0.02],
        valueType: ["v", "v"],
        active: false,
        prerequisite: [],
        image: "kortbilde5"
    },  //https://unsplash.com/photos/a-couple-of-cows-standing-on-top-of-a-grass-covered-field-aG17jOwJoHU 21/4/2025

    {
        name: "Tidlig førstekalving og mer melking",
        gameplayText: "Kuer får 2% økt produktivitet",
        description: "Tidligere og/eller flere kalver per ku, gjør at man får mer ut av kuene.",
        source: ["production", "production"],
        category: ["melk", "storfekjøtt"],
        subcategory: ["multiplikator", "multiplikator"],
        value: [0.02, 0.02],
        valueType: ["v", "v"],
        active: false,
        prerequisite: [],
        image: "kortbilde1"
    },  //https://unsplash.com/photos/brown-horse-lying-on-ground-during-daytime-mu_yKIlpHRE 21/4/2025
    {
        name: "LED-lamper i melkefjøset",
        gameplayText: "Minker strømbruken til belysning i melkefjøset med 50%",
        description: "LED-lamper bruker flere små dioder istedenfor hva andre lysarmaturer bruker. " +
                     "Dette er mye mer effektivt for å minske mengden varme som produseres istedenfor lys.",
        source: ["energy"],
        category: ["melkefjøset"],
        subcategory: ["lamperWatt"],
        value: [-125],
        valueType: ["v"],
        active: false,
        prerequisite: [],
        image: "kortbilde6"
    },  //https://www.tcpi.com/lighting-history-what-came-before-the-led-bulb/ 21/4/2025
    {
        name: "Bytt til SPF-gris",
        gameplayText: "Reduserer utslipp via kraftfôr for griser med 15%",
        description: "\"Spesifik PatogenFri\" griser er fri for noen spesifike smittestoffer, og trenger mindre fôr til vekst. " +
                     "Friske griser er mer miljøvennlige, og SPF-griser er et godt eksempel på dette.",
        source: ["production", "production"],
        category: ["svinekjøtt", "grisunger"],
        subcategory: ["kraftfor", "kraftfor"],
        value: [0.15, 0.15],
        valueType: ["%", "%"],
        active: false,
        prerequisite: [],
        image: "kortbilde18"
    },  //https://norsvin.no/friskere-gris-med-spf/ 01/5/2025
    {
        name: "Bedre griseavl",
        gameplayText: "Griser får 4% økt produktivitet",
        description: "Avlsprogram kan gi griser som har mindre utslipp og trenger mindre fôr når de vokser opp.",
        source: ["production", "production"],
        category: ["svinekjøtt", "grisunger"],
        subcategory: ["multiplikator", "multiplikator"],
        value: [0.04, 0.04],
        valueType: ["v", "v"],
        active: false,
        prerequisite: [],
        image: "kortbilde19"
    },  //https://unsplash.com/photos/a-couple-of-pigs-standing-on-top-of-a-pile-of-hay-P_eUI3d_H3c 01/5/2025
    {
        name: "Stripespredning",
        gameplayText: "5% mindre lystgassutslipp fra eng og korn.",
        description: "En stripespreder er et redskap som sprer gjødsel nærmere bakken og dermed mer effektivt. " +
                     "I tillegg kan man bruke slangetilførsel, som skader jorda mindre.",
        source: ["production", "production", "production"],
        category: ["korn", "eng", "beite"],
        subcategory: ["lystgass", "lystgass", "lystgass"],
        value: [0.05, 0.05, 0.05],
        valueType: ["%","%","%"],
        active: false,
        prerequisite: [],
        image: "kortbilde7"
    },  //https://www.nibio.no/nyheter/stripespredning-mest-effektivt 21/4/2025
    {
        name: "Spredning ved riktige forhold",
        gameplayText: "5% mindre lystgassutslipp fra eng og korn",
        description: "Når og ved hvilke forhold man sprer gjødsel, påvirker lystgasstapet. "+
                     "Gevinsten er større enn 5%, men potensielt lengre og mer lagring gjør at dette blir ebbet noe.",
        source: ["production", "production", "production"],
        category: ["korn", "eng", "beite"],
        subcategory: ["lystgass", "lystgass", "lystgass"],
        value: [0.05, 0.05, 0.05],
        valueType: ["%","%","%"],
        active: false,
        prerequisite: [],
        image: "kortbilde8"
    },  //https://www.agromiljo.no/produkter/gjodselspredere-og-vatsaing/stripespredere/modell-50/ 21/4/2025
    {
        name: "Presisjonsspredning",
        gameplayText: "5% reduksjon i lystgass fra korn, og 3% fra eng.",
        description: "Man kan tilpasse hvordan man behandler og bruker de forskjellige jordbruksstedene. " +
                     "For eksempel kan kan unngå overgjødsling på steder som ikke trenger det.",
        source: ["production", "production"],
        category: ["korn", "eng"],
        subcategory: ["lystgass", "lystgass"],
        value: [0.05, 0.03],
        valueType: ["%","%"],
        active: false,
        prerequisite: [],
        image: "kortbilde9"
    },  //selvlagd
    {
        name: "Fangvekster",
        gameplayText: "5% reduksjon i lystgass fra korn og 20kg karbonbinding per dekar.",
        description: "Det kan såås fangvekster sammens med korn for å holde jorden i bedre stand gjennom høst " +
                     "og vinter, samtidig som karbon bindes og lystgass holdes i jorda.",
        source: ["production", "production"],
        category: ["korn", "korn"],
        subcategory: ["lystgass", "karbonlagring"],
        value: [0.05, 20], //20kg virker mye, men er fortsatt mindre enn tall fra NIBIO. hmmmm. Kan man lagre så mye hvert år?
        valueType: ["%", "v"],
        active: false,
        prerequisite: [],
        image: "kortbilde21"
    },  //https://nibio.brage.unit.no/nibio-xmlui/bitstream/handle/11250/2638984/NIBIO_RAPPORT_2020_6_4.pdf?sequence=1&isAllowed=y 2/5/2025
    {
        name: "Direktesåing av korn",
        gameplayText: "2% redusert lystgassutslipp, 2kg karbonbinding og 2 liter mindre diesel per dekar korn.",
        description: "En alternativ såmetode er å kutte opp jorda med maskineri og direkte så korn.",
        source: ["production", "production", "fuel"],
        category: ["korn", "korn", "diesel"],
        subcategory: ["lystgass", "karbonlagring", "kornDekar"],
        value: [0.02, 2, -2],
        valueType: ["%", "v", "v"],
        active: false,
        prerequisite: [],
        image: "kortbilde22"
    },  //https://www.norsklandbruk.no/direktesaing-ga-lavere-co2-utslipp/s/5-152-21411 2/5/2025

    //drivstoff
    {
        name: "Økonomisk kjøring",
        gameplayText: "15% mindre dieselforbruk.",
        description: "Hvis man ivaretar kjøretøy godt og er bevisst på kjørestiler og tiltak, " +
                     "kan man spare mange liter diesel",
        source: ["fuel"],
        category: ["diesel"],
        subcategory: ["multiplikator"],
        value: [0.15],
        valueType: ["%"],
        active: false,
        prerequisite: [],
        image: "kortbilde23"
    },  //https://www.traktor.no/video-trylleformlene-for-lavt-dieselforbruk/s/23-151-108780  2/5/2025
    {
        name: "Elektrisk gjødselpumpe", //bruker statiske tall
        gameplayText: "2000L mindre dieselbruk, 7000kwh mer strømbruk",
        description: "Ved å bruke en elektrisk gjødselpumpe bruker man strøm istedenfor diesel til pumpinga. " +
                     "Ved relativt miljøvennlig strøm, kan dette spare miljøet mye.",
        source: ["fuel", "energy"],
        category: ["diesel", "annet"],
        subcategory: ["reduksjon", "mengde"],
        value: [2000, 7000],
        valueType: ["v", "v"],
        active: false,
        prerequisite: [],
        image: "kortbilde24"
    },

    //strøm
    {
        name: "Solceller på taket",
        gameplayText: "Produserer 70 000kwh med energi",
        description: "Solceller produserer energi fra solens varme. " +
                     "Effekten varierer med vær, breddegrad, panelteknologi og årstidene, og har derfor en maks effekt",
        source: ["energy"],
        category: ["fornybarEnergi"],
        subcategory: ["solceller"],
        value: [70000],
        valueType: ["v"],
        active: false,
        prerequisite: [],
        image: "kortbilde10"
    },  //https://unsplash.com/photos/a-building-with-a-glass-front-8GS8bmor8_A 22/4/2025

    {
        name: "Solcellepanelutvidelse",
        gameplayText: "Produserer 50 000kwh med energi",
        description: "Flere paneler gir mer strøm! Det er allikevel en grense på hvor mye man kan få fra kun paneler, " +
                     "siden de har svært lav effekt når det er mørkt, og kan ikke selv lagre noe ved overproduksjon.",
        source: ["energy"],
        category: ["fornybarEnergi"],
        subcategory: ["solceller"],
        value: [50000],
        valueType: ["v"],
        active: false,
        prerequisite: ["Solceller på taket"],
        image: "kortbilde20"
    },  //https://unsplash.com/photos/brown-brick-house-with-solar-panels-on-roof-9CalgkSRZb8 1/5/2025

    {
        name: "Varmegjenvinning fra melkenedkjøling",
        gameplayText: "Sparer 12 000kwh energi.",
        description: "Når man kjøler ned melka, kommer det en del varme som man kan gjenvinne energi fra.",
        source: ["energy"],
        category: ["annet"],
        subcategory: ["melkegjenvinning"],
        value: [12000],
        valueType: ["v"],
        active: false,
        prerequisite: [],
        image: "kortbilde11"
    },  //https://www.skalafabrikk.no/tanker/gardstanker 22/4/2025

    //oppvarming
    {
        name: "Fliskjel til oppvarming",
        gameplayText: "Lager strøm i en fliskjel med 70% virkningsgrad og 55% fuktighet i flisa. Oppgraderbar!",
        description: "Man kan bruke trærs grener, stammer, bark osv, til å lage varme i en kjel. " +
                     "Over tid har bedre og mer effektive kjeler blitt oppfunnet.",
        source: ["energy", "energy"],
        category: ["fliskjel", "fliskjel"],
        subcategory: ["fuktighet", "virkningsgrad"],
        value: [55, 70],
        valueType: ["r", "r"],
        active: false,
        prerequisite: [],
        image: "kortbilde15"
    },  //https://www.hemeltron.ee/no/hakkepuidukatel-dcm-universal-58-kw 29/4/2025

    {
        name: "Bedre tørket flis",
        gameplayText: "Reduserer fuktigheten i flisen til fliskjelen fra 55% til 30%",
        description: "Bedre lagringsmetoder og mer tørking før brenning, fører til tørrere ved som brenner bedre.",
        source: ["energy"],
        category: ["fliskjel"],
        subcategory: ["fuktighet"],
        value: [30],
        valueType: ["r"],
        active: false,
        prerequisite: ["Fliskjel til oppvarming"],
        image: "kortbilde16"
    },  //https://www.aftenbladet.no/meninger/debatt/i/m69d1q/toemmer-er-en-viktig-del-av-klimakampen 29/4/2025

    {
        name: "Bedre fliskjel",
        gameplayText: "Øker virkningsgraden i fliskjelen fra 70% til 90%",
        description: "Nye og langt mer effektive kjeler har blitt laget gjennom tidende. " +
                     "Denne representerer hva et moderne biovarmeanlegg kan klare.",
        source: ["energy"],
        category: ["fliskjel"],
        subcategory: ["virkningsgrad"],
        value: [90],
        valueType: ["r"],
        active: false,
        prerequisite: ["Fliskjel til oppvarming"],
        image: "kortbilde17"
        //https://etanorge.no/produkter/fliskjeler/ 29/4/2025
    },  //https://www.klikk.no/bolig/inspirasjon/gamle-ovner-til-ny-glede-2317006 --> Istockphoto. 29/4/2025




    {
        name: "Varmepumpe",
        gameplayText: "Overfører opptil 60% av oppvarming til å være strømforbruk",
        description: "Varmepumper bruker elektrisk energi til å produsere varme, ulikt elkjeler og propanvarmere. "+
                     "Utslippet varierer av hvor strømmen kommer fra, men i Norge er det svært effektivt.",
        source: ["energy", "energy"],
        category: ["melkefjøset", "grishuset"],
        subcategory: ["oppvarmingMultiplikator", "oppvarmingMultiplikator"],
        value: [0.6, 0.6],
        valueType: ["%", "%"],
        active: false,
        prerequisite: [],
        image: "kortbilde14"
    },  //https://unsplash.com/photos/a-white-air-conditioner-sitting-on-top-of-a-brick-wall-JsPkVrHMQoo 29/4/2025

    //spillmekanikker
    {
        name: "Valgmuligheter",
        gameplayText: "+2 mulige kort per runde",
        description: "Ved å bli bedre kjent med hvilke tiltak som finnes, kan man lettere velge hva som passer",
        source: ["gameplay"],
        category: [],
        subcategory: [],
        value: [],
        valueType: [],
        active: false,
        prerequisite: [],
        image: "kortbilde12"
    },  //selvlagt

    {
        name: "Subsidier",
        gameplayText: "+3 runder i spillet",
        description: "Subsidier fra staten kan hjelpe med å finansiere forbedringer på gården, slik at " +
                     "klimamål lettere kan nås.",
        source: ["gameplay"],
        category: [],
        subcategory: [],
        value: [],
        valueType: [],
        active: false,
        prerequisite: [],
        image: "kortbilde13"
    }  //selvlagt, inspirert av bilde fra FNs klimamål

];


//debug function
function enableAllModifications(){
    for(var i=0; i<modifications.length; i++){
        modifications[i].active = true;
    }
    main();
}

//helper function for finding a modification, as an array of objects is annoying to go through
//no fancy algorithm since the list is small
function findModification(name){
    for(var i=0; i<modifications.length; i++){
        if(modifications[i].name === name)
            return modifications[i];
    }

    console.log("unknown modification: ", name);
    return 0;
}