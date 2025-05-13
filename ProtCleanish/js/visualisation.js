//the criteras for drawing a particular version of an image
//the ordering is progressively "better" with stricter criterias
var canvasCriterias = {
    energyStages: [],
    dieselStages: []
};

//must be run AFTER calculator.js is loaded
function establishCanvasCriterias(){
    canvasCriterias.energyStages.push(
        calculatePowerTotal(),
        calculatePowerTotal()*0.75,
        calculatePowerTotal()*0.55,
        calculatePowerTotal()*0.35);
    
    canvasCriterias.dieselStages.push(
        getStat("diesel"),
        getStat("diesel")*0.9,
        getStat("diesel")*0.8,
        getStat("diesel")*0.7);
}

//gets the appropriate images depending on criterias, and then draws them
//many of the heaters here could go into their own functions, but since they're only used here, there is no need
function canvasDrawImages(){
    var stages = [];
    var stageNumbers = [calculatePowerTotal(), getStat("diesel")];
    var names = Object.keys(canvasCriterias);
    for(var i=0; i<stageNumbers.length; i++){
        stages.push(getBestCriteria(names[i], stageNumbers[i]))
    }


    /*                 */
    /* draw calls here */
    /*                 */

    //strømpåle (først slik at den er i bakgrunnen)
    c.drawImage(bilder["strømpåle"], drawOffsets.strømpåle[0], drawOffsets.strømpåle[1]);


    //gårdshus og solcellepanel
    c.drawImage(bilder["gårdshus"], drawOffsets.gårdshus[0], drawOffsets.gårdshus[1]);


    //strømfabrikk, strømpåler og røyk
    c.drawImage(bilder["strømboks"], drawOffsets.strømboks[0], drawOffsets.strømboks[1]);

    var røyk = "røyk" + stages[0];
    c.drawImage(bilder[røyk], drawOffsets.strømboks[0] + drawOffsets.røyk[0],
        drawOffsets.strømboks[1] + drawOffsets.røyk[1]);

    
    //solcellepaneler
    if(findModification("Solceller på taket").active)
        c.drawImage(bilder["solcellepanel"], drawOffsets.gårdshus[0] + drawOffsets.solcellepanel[0],
                                             drawOffsets.gårdshus[1] + drawOffsets.solcellepanel[1]);
    //ADD SECONDARY SOLAR PANEL HERE
    if(findModification("Solcellepanelutvidelse").active)
        c.drawImage(bilder["solcellepanel2"], drawOffsets.gårdshus[0] + drawOffsets.solcellepanel2[0],
                                              drawOffsets.gårdshus[1] + drawOffsets.solcellepanel2[1]);

    
    c.font = "16px Comic sans ms"

    //propanvarmer
    var prop = heatingSources.find((elem) => elem[0] === "propan");
    var textOffsetY = drawOffsets.propanvarmer[1] + drawOffsets.propanvarmerTekst[1];
    c.drawImage(bilder["propanvarmer"], drawOffsets.propanvarmer[0], drawOffsets.propanvarmer[1]);

    if(typeof prop !== "undefined"){
        c.drawImage(bilder["propanvarmerAktiv"], drawOffsets.propanvarmer[0] + drawOffsets.propanvarmerAktiv[0],
                                                 drawOffsets.propanvarmer[1] + drawOffsets.propanvarmerAktiv[1]);
        c.fillText(round3(prop[2]*100) + "%", drawOffsets.propanvarmer[0] + drawOffsets.propanvarmerTekst[0],
                                            textOffsetY);
    
        c.fillText(prop[1] + "kwh", drawOffsets.propanvarmer[0] + drawOffsets.propanvarmerTekst[0],
                                    textOffsetY + 20);
    
        var propanCO2 = round3(prop[1]/1000 * energySources.propan);
        c.fillText(propanCO2 + " tonn CO2", drawOffsets.propanvarmer[0] + drawOffsets.propanvarmerTekst[0],
                                            textOffsetY + 40);
    }


    //varmepumpe
    var varm = heatingSources.find((elem) => elem[0] === "varmepumpe");
    var varmOffsetX = drawOffsets.propanvarmer[0] + drawOffsets.varmepumpe[0];

    if(typeof varm !== "undefined"){
        c.drawImage(bilder["varmepumpe"], varmOffsetX,
                                          drawOffsets.varmepumpe[1]);

        c.fillText(round3(varm[2]*100) + "%", varmOffsetX + drawOffsets.varmepumpeTekst[0],
                                              textOffsetY);

        c.fillText(varm[1] + "kwh", varmOffsetX + drawOffsets.varmepumpeTekst[0],
                                    textOffsetY + 20);

        var varmepumpeCO2 = round3(varm[1]/1000 * energySources.elektrisitetNorge);
        c.fillText(varmepumpeCO2 + " tonn CO2", varmOffsetX + drawOffsets.varmepumpeTekst[0],
                                                textOffsetY + 40);
    }



    //fliskjel
    var flis = heatingSources.find((elem) => elem[0] === "fliskjel");
    var flisOffsetX = drawOffsets.propanvarmer[0] + drawOffsets.fliskjel[0];
    if(typeof varm !== "undefined")
        flisOffsetX = drawOffsets.propanvarmer[0] + drawOffsets.varmepumpe[0] + drawOffsets.fliskjel[0];

    if(typeof flis !== "undefined"){
        c.drawImage(bilder["fliskjel"], flisOffsetX,
                                        drawOffsets.fliskjel[1]);

        c.fillText(round3(flis[2]*100) + "%", flisOffsetX + drawOffsets.fliskjelTekst[0],
                                              textOffsetY);

        c.fillText(flis[1] + "kwh", flisOffsetX + drawOffsets.fliskjelTekst[0],
                                    textOffsetY + 20);

        var fliskjelCO2 = round3(flis[1]/1000 * energySources.flis);
        c.fillText(fliskjelCO2 + " tonn CO2", flisOffsetX + drawOffsets.fliskjelTekst[0],
                                              textOffsetY + 40);
    }

}

var drawOffsets = {
    solcellepanel: [185, 12],
    solcellepanel2: [56, 33],
    gårdshus: [20, 40],
    strømpåle: [415, 85],
    strømboks: [550, 80],
    røyk: [53, -67],
    propanvarmer: [840, 50],
    propanvarmerAktiv: [54, 93],
    propanvarmerTekst: [20, 200],
    varmepumpe: [170, 120],
    varmepumpeTekst: [20, 200],
    fliskjel: [150, 60],
    fliskjelTekst: [40, 200],
};

function getBestCriteria(name, number){
    var i=0;
    for(i; i<canvasCriterias[name].length; i++){
        //if the number is higher than the criteria, it does not pass
        if(number >= canvasCriterias[name][i] || i == canvasCriterias[name].length-1)
            break;
    }
    return i+1;
}