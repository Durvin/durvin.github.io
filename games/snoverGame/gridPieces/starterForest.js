var stuff = [
    //#region starterhouse
    //the house itself
    new Wall(2274, 1201, 1, 3, "caveWall"),
    new Wall(2274, 1205, 1, 3, "caveWall"),
    new Wall(2274, 1200, 7, 1, "caveWall"),
    new Wall(2280, 1201, 1, 7, "caveWall"),
    new Wall(2275, 1207, 5, 1, "caveWall"),
    new Floor(2275, 1201, 5, 6, "woodenFloor", 0.5),
    new Floor(2274, 1204, 1, 1, "woodenFloor"),
    new Door(2274, 1204, 1, 1, "caveDoorRed", "caveDoorRedOpen", false, null, audios.doorOpen, audios.doorClose),

    new NPC(
        2275, 1206, "anmao", "Andres Martinez",
        new DialogueTree(
            ["Hello, i'm DOg, which is with an O and not a 0", "my stats in this game,\nwhich has quite the name,\nare better than yours!", audios.pop],
            ["play in the sky", "play in the sky.", "play in the sky..", "play in the sky...", audios.dog]
    )),
    new NPC(
        2275, 1201, "redMao", "Mandres Artinez",
        new DialogueTree(
            ["Hello, i'm Mandres, and i couldn't help but notice...", "that you talked to DOg?!?!", ">:(", audios.ghostdog2],
            ["becomeAir", audios.ghostdog]
    ), {health: 1000, atk: 10, def: 10}),

    //dirt road to forest
    new Floor(2267, 1204, 7, 1, "dirtroadH", 0.4),
    new Floor(2266, 1204, 1, 1, "dirtroad1", 0.4),
    new Floor(2266, 1180, 1, 24, "dirtroadV", 0.4),

    //#endregion

    //#region forest1
    //lots of trees
    new Tree(2260, 1200, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2264, 1200, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2262, 1200, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2265, 1199, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2262, 1197, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2270, 1197, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2264, 1196, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2264, 1196, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2265, 1196, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2261, 1195, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2265, 1194, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2267, 1194, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2269, 1193, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2264, 1193, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2262, 1192, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2271, 1192, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2260, 1192, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2265, 1190, 1, 2, "treeTemperate1", false, "maple"),
    new Tree(2269, 1190, 1, 2, "treeTemperate1", false, "maple"),

    //#endregion forest1
];

mapInfo.tacks.push(new mapTack(2270, 1200, "Starter forest", bilder.mapStar))

for(var i=0; i<stuff.length; i++){
    tree.insert(stuff[i]);
}

//spawners.push(null)
//tree.insert(null)
