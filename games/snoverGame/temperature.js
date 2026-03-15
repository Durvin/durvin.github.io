var tContainer = {
    totalenergy: 2631500,
    solarrad: 150,
    solarabsorption: 0,
    energydissipation: 0,
    temperatureTime: 0,

    latitude: 65,
    tilt: 23.5,

    batch: 0,

    days: [],

    months: []
}

function daycalc(t){
    return (t/1440);
}

function localsolarrad(){
    //where the sun is with regards to the year and your position * where the sun is with regards to time
    var solaraltitude = (90-tContainer.latitude-(Math.cos(daycalc(tContainer.temperatureTime)*(2*Math.PI/360))*tContainer.tilt)) *
                        (-Math.cos(2*Math.PI*tContainer.temperatureTime/1440));
    if(solaraltitude < 0){
        solaraltitude = 0;
    }
    return tContainer.solarrad * solaraltitude / 90;
}

function localdissipation(){
    return 0;
}

function energytotemp(e){
    return (e/10000) - 273.15;
}

function randomgarbage(){
    tContainer.batch += Math.floor(Math.random()*3) -1;
    tContainer.batch = tContainer.batch *0.999;
    return tContainer.batch;
}

function temperatureMain(years){
    var months = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
    tContainer.months = [];
    for(var i=0; i<months.length; i++){
        tContainer.months.push({month: months[i], min: 3000000, max: 1000000});
    }
    //std::cout << "SUPREME WEATHER SIMULATION EXTREME INVOKED" << std::endl;

    var maxtemp = 1000000;
    var mintemp = 3000000;
    var absmax = 1000000;
    var absmin = 3000000;
    var absmaxday;
    var absminday;

    tContainer.temperatureTime = 0;

    for(tContainer.temperatureTime; tContainer.temperatureTime<1440*years*360; tContainer.temperatureTime++){
        var day = Math.floor(daycalc(tContainer.temperatureTime));
        tContainer.totalenergy += -0.00007*(tContainer.totalenergy-2500000) +
                                  localsolarrad() - localdissipation() + randomgarbage();

        if(tContainer.totalenergy > maxtemp){
            maxtemp = tContainer.totalenergy;
        }
        if(tContainer.totalenergy <= mintemp){
            mintemp = tContainer.totalenergy;
        }
        if(tContainer.temperatureTime % 1440 == 0){
            //std::cout << day % 30 + 1 << "-" << floor((day % 360)/30) + 1 << "-" << floor(day/360) << " - min: " << round(energytotemp(mintemp)) << "‹C, max: " << round(energytotemp(maxtemp)) << "‹C" << std::endl;
            if(maxtemp > absmax){
                absmax = maxtemp;
                absmaxday = Math.floor(daycalc(tContainer.temperatureTime));
            }
            if(mintemp < absmin){
                absmin = mintemp;
                absminday = Math.floor(daycalc(tContainer.temperatureTime));
            }

            tContainer.days.push({
                                day: day%30, month: Math.floor((day % 360)/30), year: Math.floor(day/360),
                                tMax: energytotemp(maxtemp), tMin: energytotemp(mintemp)
                                })
            
            if(tContainer.months[tContainer.days[tContainer.days.length-1].month].min > mintemp)
                tContainer.months[tContainer.days[tContainer.days.length-1].month].min = mintemp;
            
            if(tContainer.months[tContainer.days[tContainer.days.length-1].month].max < maxtemp)
                tContainer.months[tContainer.days[tContainer.days.length-1].month].max = maxtemp;
               

                                
            maxtemp = 1000000;
            mintemp = 3000000;
        }
    }

    for(var i=0; i<tContainer.months.length; i++){
        tContainer.months[i].min = energytotemp(tContainer.months[i].min);
        tContainer.months[i].max = energytotemp(tContainer.months[i].max);
    }

    //std::cout << "SUPREME WEATHER SIMULATION EXTREME HAS FINISHED EXECUTION" << std::endl;
    //std::cout << "Highest temp: " << energytotemp(absmax) << "‹C on " << absmaxday % 30 + 1 << "-" << floor((absmaxday % 360)/30) + 1 << "-" << floor(absmaxday/360) << std::endl;
    //std::cout << "Lowest temp: " << energytotemp(absmin) << "‹C on " << absminday % 30 + 1 << "-" << floor((absminday % 360)/30) + 1 << "-" << floor(absminday/360) << std::endl;
    console.log("SUPREME WORKS", "\nHighest temp: " + energytotemp(absmax), "\nLowest temp: " + energytotemp(absmin));
}