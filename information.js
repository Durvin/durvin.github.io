//javascript games available for play
var games = {
    agriculturegame:{
        year: 2025,
        name: "Agriculture Game",
        id: "agriculturegame",
        src: "agricultureGame/index.html",
        image: "agriculture.png",
        description:
            `
            Made as a part of my master's thesis, this game wanted to explore if people could learn more
            about agriculture via games. Agricultural activities are usually more hands-on,
            and so if learning via a game is fun and works, it could make learning a bit easier in e.g. schools.
            A lot effort went into the accuracy of the card contents and the environmental calculator working in
            the background, but the game design sadly did not get much playtesting before i had to write the actual thesis.
            `
    },
    hithackwack: {
        year: 2022,
        name: "Hit Hack Wack",
        id: "hithackwack",
        src: "hit hack wack/Xedin.html",
        image: "hithackwack.png",
        description:
            `
            Mostly coded during empty classrooms when i was a student assistent in
            Algorithms and Datastructures. It's a remake of a previous game i made during highschool,
            and had i continued, a good starting point for something more. WASD to move,
            and remember to click on the game to gain control.
            `
    },
    martianchess: {
        year: 2022,
        name: "Martian Chess",
        id: "martianchess",
        src: "martian chess/Xedin.html",
        image: "martianchess.png",
        description:
            `
            I have a friend that every so often gets an urge to make bots for games like chess.
            One game he was especially interested in, was martian chess, as it is less explored and
            is less complex to code bots in. I made this game with some OK opponent algorithms
            for him and myself to mess around with. Good fun, though the AI can cheat here by undoing your last move,
            and i don't recall why i never fixed that...
            `
    },
    isocity: {
        year: 2020,
        name: "Isocity",
        id: "isocity",
        src: "isocity/Xedin.html",
        image: "isocity.png",
        description:
            `
            My first attempt at using perlin noise for random terrain generation, back in 2020
            when i had a friend that was fascinated with it.
            At this point in time, i am not sure why i named it 'Isocity',
            when i had no plans to make it isometric. WASD to move around.
            `
    },
    science: {
        year: 2023,
        name: "Science",
        id: "science",
        src: "SCIENCE/Xedin.html",
        image: "science.png",
        description:
            `
            The basis of an simple idle-game with one idea in mind: don't let any resources become obsolete!
            The codebase for this is not pretty, but functionally speaking it was quite close to completion.
            With some (a lot) more content, it could have been a decent timekiller. Maybe someday i will
            put some work into it, as the idea is still interesting to me.
            `
    },
    snovergame: {
        year: 2023,
        name: "RPG Project",
        id: "snovergame",
        src: "snoverGame/Xedin.html",
        image: "snovergame.png",
        description:
            `
            Combining some ideas i and a friend of mine had for a longer RPG, this game snippet was made.
            It does not have a lot of content, as raw JavaScript is difficult to make an editor for
            (you cannot write to files normally), and is on of the reasons the project moved on to
            C++ eventually. There are many ideas thrown in that would fit an RPG, written with more
            sane coding than many of my earlier works. WASD to move, and the C, M, I and 1, 2, 3 are also available.
            `
    },
}