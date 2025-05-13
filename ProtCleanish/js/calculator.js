var farmCategories = ["melk", "storfekjøtt", "grisunger", "svinekjøtt", "sauekjøtt", "kyllingkjøtt", "egg", "korn", "eng", "beite"];

var farmNumbers = {
    kornDekar: 250,
    kgkornPerDekar: 500,
    engDekar: 750,
    kgengPerDekar: 930,
    beiteDekar: 50,
    kgbeitePerDekar: 630,
    årskyr: 50,
    årspurk: 50,
    slaktegris: 1500,
    avventendeGrisunger: 36
}

var baseNumbers = {
    melk: {
        vomogtarm: 0.384,
        gjødsel: 0.217,
        kraftfor: 0.116,
        innkjøp: 0.037,
        egetFor: 0.144,
        multiplikator: 1
    },
    storfekjøtt: {
        vomogtarm: 7.4,
        gjødsel: 5.4,
        kraftfor: 2.0,
        innkjøp: 0.4,
        egetFor: 5.2,
        multiplikator: 1
    },
    grisunger: {
        vomogtarm: 2.71,
        gjødsel: 3.86,
        kraftfor: 44.87,
        innkjøp: 0.73,
        egetFor: 0.0,
        multiplikator: 1
    },
    svinekjøtt: {
        vomogtarm: 0.117,
        gjødsel: 0.166,
        kraftfor: 1.931,
        innkjøp: 0.031,
        egetFor: 0.0,
        multiplikator: 1
    },
    sauekjøtt: {
        vomogtarm: 10.1,
        gjødsel: 2.1,
        kraftfor: 0.85,
        innkjøp: 1.5,
        egetFor: 5.8,
        multiplikator: 1
    },
    kyllingkjøtt: {
        vomogtarm: 0.0,
        gjødsel: 0.3,
        kraftfor: 1.4,
        innkjøp: 0.0,
        egetFor: 0.0,
        multiplikator: 1
    },
    egg: {
        vomogtarm: 0.0,
        gjødsel: 0.4,
        kraftfor: 1.9,
        innkjøp: 0.0,
        egetFor: 0.0,
        multiplikator: 1
    },
    korn: { //antas 500kg per dekar
        lystgass: 0.379,
        karbontap: 0,
        diesel: 0,
        karbonlagring: 0, //per dekar
        multiplikator: 1
    },
    eng: { //antas 930kg tørrstoff (TS) per dekar
        lystgass: 0.345,
        karbontap: 0,
        diesel: 0,
        karbonlagring: 0,
        multiplikator: 1
    },
    beite: { //antas 630kg tørrstoff (TS) per dekar
        lystgass: 0.299,
        karbontap: 0,
        diesel: 0,
        karbonlagring: 0,
        multiplikator: 1
    },

}

var baseAggregateNumbers = {
    melk: 0.898,
    storfekjøtt: 20.4,
    grisunger: 52.17,
    svinekjøtt: 2.245,
    sauekjøtt: 20.35,
    kyllingkjøtt: 2.055,
    egg: 2.349,
    korn: 0.379,
    eng: 0.345,
    beite: 0.299
};

//per kg co2 equivalent per kwh
//per liter for diesel and propan
var energyCategories = ["elektrisitet", "biodiesel", "diesel", "propan", "skogflis", "halm"];
var energySources = {
    //CO2 ekvivalenter
    elektrisitetNorge: 0.019,
    elektrisitetEuropa: 0.231,
    biodiesel: 0.47, //brukes ikke grunnet mye usikkerhet
    diesel: 2.66,
    propan: 0.23,
    flis: 0.007,

    //ikke CO2 ekvivalenter
    varmepumpe: 3 //virkningsgrad x betyr at 1 watt gir x watt varme.
}
var energy = {
    melkefjøset: {
        ku: 1475, //fratatt lampebruk
        kuOppvarming: 700,
        lamper: 35, //!! statisk tall
        lamperWatt: 250,
        lamperBruk: 3000, //timer i året
        oppvarmingMultiplikator: 1
    },
    belysning: {
        startmengde: 10,
        perku: 0.5,
        wattpære: 250,
        timerperår: 3000,
        kilowatt: 1000
    },
    grishuset: {
        årspurk: 800,
        årspurkOppvarming: 700,
        grisunge: 0,
        slaktegris: 30,
        slaktegrisOppvarming: 30,
        oppvarmingMultiplikator: 1
    },
    korn: {
        perDekar: 20
    },
    fornybarEnergi:{
        solceller: 0
    },
    annet: {
        mengde: 0,
        melkegjenvinning: 0
    },
    fliskjel: {
        fuktighet: 0, //%
        mengde: 100, //Lm^3 flis
        produksjon: 750, //kwh / Lm^3
        virkningsgrad: 0, // hvor mye varme som blir bevart i prosessen
        utslipp: 0
    }
}
var fuel = {
    diesel: {
        engDekar: 13.1,
        kornDekar: 8.1,
        multiplikator: 1,
        reduksjon: 0,
        type: "diesel"
    },
    strøm: {
        type: "elektrisitetNorge"
    },
    oppvarming: {
        type: "propan"
    }
}

var heatingSources = [];

var customEnergy;
var customFuel;

var customNumbers = baseNumbers;

function getStat(stat){
    return aggregateNumbers[stat];
}

//i tonn CO2 ekvivalenter
function utslippPerKu(){
    var tall = 0;
    //det antas at melkeproduksjon bruker 8650 kg EKM per årsku, slik planteinfo.no/klimaspill.php bruker
    tall += 8650 * aggregateNumbers.melk / 1000;
    tall += 157.4 * aggregateNumbers.storfekjøtt / 1000;
    return tall;
}

function totalEmissions(){
    var total = 0;

    total += utslippPerKu() * farmNumbers.årskyr;
    //total += aggregateNumbers.dieselUtslipp;
    //total += aggregateNumbers.strømUtslipp;
    //total += aggregateNumbers.oppvarmingUtslipp;

    var rounded = Math.round(total*1000) / 1000;

    aggregateNumbers.total = rounded;
    console.log(rounded);
}

function createCustomNumbers(){
    //deepclone the base numbers
    customNumbers = structuredClone(baseNumbers);
    customEnergy = structuredClone(energy);
    customFuel = structuredClone(fuel);

    var mod;
    var from;
    var custom;
    //go through all active modifications
    for(var i=0; i<modifications.length; i++){
        if(modifications[i].active){
            mod = modifications[i];

            //perform all the changes the modification brings about, based on BASE value, not multiplicative ones
            //this means a 13% and a 27% reduction would total 40%, not ~36,5%
            for(var j=0; j<mod.category.length; j++){
                //production (animals and farms)
                if(mod.source[j] === "production"){
                    from = baseNumbers;
                    custom = customNumbers;
                }
                
                //energy sources, like lights
                else if(mod.source[j] === "energy"){
                    from = energy;
                    custom = customEnergy;
                }

                //diesel
                else if(mod.source[j] === "fuel"){
                    from = fuel;
                    custom = customFuel;
                }

                //the actual number changes
                if(mod.valueType[j] === "%")
                    custom[mod.category[j]][mod.subcategory[j]] -=
                        from[mod.category[j]][mod.subcategory[j]]*mod.value[j];
                
                else if(mod.valueType[j] === "multi")
                    custom[mod.category[j]].multiplikator += mod.value[j];

                else if(mod.valueType[j] === "v")
                    custom[mod.category[j]][mod.subcategory[j]] += mod.value[j];

                else if(mod.valueType[j] === "r"){
                    custom[mod.category[j]][mod.subcategory[j]] = mod.value[j];
                }

            }
        }
    }
}

function getTSEmissions(){
    var totalArea = farmNumbers.beiteDekar + farmNumbers.engDekar;
    var totalEng = farmNumbers.engDekar * aggregateNumbers.eng;
    var totalBeite = farmNumbers.beiteDekar * aggregateNumbers.beite;
    var perkgTS = (totalEng + totalBeite) / totalArea;

    //avrunding til nærmeste tusendel
    var rounded = Math.round(perkgTS*1000) / 1000;

    return rounded;
}

var aggregateNumbers = {
    melk: 0.898,
    storfekjøtt: 20.4,
    grisunger: 52.17,
    svinekjøtt: 2.245,
    sauekjøtt: 20.35,
    kyllingkjøtt: 2.055,
    egg: 2.349,
    korn: 0.379,
    eng: 0.345,
    beite: 0.299,
};

function calculatePowerTotal(){
    var strøm = 0;
    strøm += farmNumbers.årskyr * customEnergy.melkefjøset.ku;
    strøm += customEnergy.melkefjøset.lamper *
             customEnergy.melkefjøset.lamperWatt *
             customEnergy.melkefjøset.lamperBruk / 1000;
    strøm += farmNumbers.årspurk * customEnergy.grishuset.årspurk;
    strøm += farmNumbers.slaktegris * customEnergy.grishuset.slaktegris;
    strøm += farmNumbers.kornDekar * customEnergy.korn.perDekar;
    strøm += customEnergy.annet.mengde;
    strøm -= customEnergy.fornybarEnergi.solceller;
    strøm -= customEnergy.annet.melkegjenvinning;

    //finn effekten av varmepumpe som trengs
    if(customEnergy.melkefjøset.oppvarmingMultiplikator !== 1){
        strøm += varmepumpekrav / energySources.varmepumpe;
    }

    return strøm;
}

var oppvarmingUtenTiltak = 0;
var varmepumpekrav = oppvarmingUtenTiltak * 0.6;
//Finner oppvarmingskravet til gården
function calculateHeatingTotal(){
    heatingSources = [];
    var oppvarming = 0;

    oppvarming += farmNumbers.årskyr *
                  customEnergy.melkefjøset.kuOppvarming;
    oppvarming += farmNumbers.årspurk *
                  customEnergy.grishuset.årspurkOppvarming;
    oppvarming += farmNumbers.slaktegris *
                  customEnergy.grishuset.slaktegrisOppvarming;

    oppvarmingUtenTiltak = oppvarming;
    varmepumpekrav = oppvarmingUtenTiltak * 0.6;
    
    var flis = fliskjelCalculation();
    oppvarming -= flis;
    if(flis > 0)
        heatingSources.push(["fliskjel", flis, flis/oppvarmingUtenTiltak]);

    
    var varmepumpepotensiale = oppvarmingUtenTiltak * (1 - customEnergy.melkefjøset.oppvarmingMultiplikator);
    if(varmepumpepotensiale >= oppvarming){
        varmepumpekrav = oppvarming;
        oppvarming = 0;
        heatingSources.push(["varmepumpe", varmepumpekrav, varmepumpekrav/oppvarmingUtenTiltak]);
    }
    else{
        varmepumpekrav = varmepumpepotensiale;
        oppvarming -= varmepumpepotensiale;
        if(varmepumpepotensiale > 0)
            heatingSources.push(["varmepumpe", varmepumpepotensiale, varmepumpepotensiale/oppvarmingUtenTiltak]);
    }


    //resten av oppvarminga kommer av propan
    if(oppvarming > 0)
        heatingSources.push(["propan", oppvarming, oppvarming/oppvarmingUtenTiltak]);

    return oppvarming;
}

function calculateDiesel(){
    var diesel = 0;
    diesel += farmNumbers.engDekar * customFuel.diesel.engDekar;
    diesel += farmNumbers.kornDekar * customFuel.diesel.kornDekar;

    diesel *= customFuel.diesel.multiplikator;
    diesel -= customFuel.diesel.reduksjon;

    return diesel;
}

function calculateDieselEmission(){
    var emissions = 0;
    var fuelEmission = energySources[customFuel.diesel.type];
    emissions += fuelEmission * aggregateNumbers.diesel;
    return round3(emissions/1000);
}

function calculateHeatingEmission(){
    var base = aggregateNumbers.oppvarming * energySources[fuel.oppvarming.type]/1000;
    base += fliskjelCalculation()*energySources.flis/1000;

    return round3(base);
}

function calculatePowerEmission(){
    return round3(aggregateNumbers.strøm * energySources[fuel.strøm.type]/1000);
}

var calcRoundDifference = {};
var previousAggregateNumbers = aggregateNumbers;
var previousActivatedModification;


function findCalcRoundDifference(){
    var stuff = Object.keys(aggregateNumbers);
    calcRoundDifference = {};
    for(var i=0; i<stuff.length; i++){
        if(aggregateNumbers[stuff[i]] !== previousAggregateNumbers[stuff[i]]){
            calcRoundDifference[stuff[i]] = [aggregateNumbers[stuff[i]], previousAggregateNumbers[stuff[i]]];
        }
    }
}

//rounds to the nearest number with 3 decimal spaces
//if the number is HUGE, this can increase inaccuracy
function round3(val){
    return Math.round((val + Number.EPSILON) * 1000) / 1000;
}

function createAggregateNumbers(){
    for(var i=0; i<farmCategories.length; i++){
        aggregateNumbers[farmCategories[i]] = 0;
        var subcategories = Object.keys(customNumbers[farmCategories[i]]);
        
        //add all the base numbers
        for(var j=0; j<subcategories.length-1; j++){

            //add the effect of storing carbon in the ground, if applicable
            if(subcategories[j] === "karbonlagring"){
                var realDifference = carbonStorageValue(farmCategories[i]);

                aggregateNumbers[farmCategories[i]] -= realDifference;
                continue;
            }

            aggregateNumbers[farmCategories[i]] += customNumbers[farmCategories[i]][subcategories[j]];
        }

        //add multipliers
        aggregateNumbers[farmCategories[i]] /= customNumbers[farmCategories[i]].multiplikator;

        //fix odd roundings due to floating point operations
        aggregateNumbers[farmCategories[i]] = round3(aggregateNumbers[farmCategories[i]]);
    }

    aggregateNumbers["oppvarming"] = calculateHeatingTotal();
    //må komme etter oppvarming grunnet varmepumpelogikk i calculatePowerTotal
    aggregateNumbers["strøm"] = calculatePowerTotal();

    aggregateNumbers["strømutslipp"] = calculatePowerEmission();
    aggregateNumbers["oppvarmingutslipp"] = calculateHeatingEmission();

    //add fuel
    aggregateNumbers["diesel"] = calculateDiesel();
    aggregateNumbers["dieselutslipp"] = calculateDieselEmission();

    aggregateNumbers["ts"] = getTSEmissions();

    //emissions


    findCalcRoundDifference();
    previousAggregateNumbers = structuredClone(aggregateNumbers);
}

function carbonStorageValue(category){
    var totalCO2 = farmNumbers[category+"Dekar"] *
    farmNumbers["kg"+[category]+"PerDekar"] *
    baseAggregateNumbers[category];

    var carbonCapture = farmNumbers[category+"Dekar"] *
            customNumbers[category].karbonlagring *
            (11/3);

    var ratio = (totalCO2-carbonCapture)/totalCO2;

    var realDifference = (baseAggregateNumbers[category] -
            baseAggregateNumbers[category] * ratio)

    return realDifference;
}

function fliskjelCalculation(){
    var baseproduksjon = customEnergy.fliskjel.produksjon * customEnergy.fliskjel.mengde;
    var fuktighetstap = 2.0062 * customEnergy.fliskjel.fuktighet * customEnergy.fliskjel.mengde;

    var total = (baseproduksjon * customEnergy.fliskjel.virkningsgrad / 100) - fuktighetstap;

    return Math.round(total);
}