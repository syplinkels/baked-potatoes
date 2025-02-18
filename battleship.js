const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const GameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");

let telemetryWorker;

class Battleship {
    constructor() {
        this.gameController = new GameController();
    }

    static TriggerExplosion() {
// Define the frames of the animation
const animationFrames = [
    `
           |    |    |  
         )_)  )_)  )_)  
        )___))___))___)\\  
       )____)____)_____)\\\\  
    _____|____|____|____\\\\\\__  
    \\                   /  
  ~~~~~~~~~~~~~~~~~~~~~~~~~
`,
`
  . . . BOOM . . . 
  _.-^^---....,,--       
_--                  --_  
>)
|                         |  
\\._                   _./  
 \`\`\`--. . , ; .--'''       
       | |   |              
       | |  || 
       |$%&%$|  
       | ;  :|  
_____/____|___\\_____ 
~~~ (_____/    |      \\_____)~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
`,
`
    |    |    |  
  )_)  )_)  )_)  
 )___))___))___)\\  
)____)____)_____)\\\\  
_____|____|____|____\\\\\\__  
\\       BOOM!        /  
~~~~~~~~~~~~~~~~~~~~~~~~~
`,
`
    |    |  
  )_)  )_)  
 )___))___) 
)____)____)_____)\\  
_____|____|____|____\\\\\\__  
\\       BOOM!         /  
~~~~~~~~~~~~~~~~~~~~~~~~~
`,
`
    |  
  )_)  
 )___)) 
)____)____)_____)  
_____|____|____|____\\  
\\         BOOM!       /  
~~~~~~~~~~~~~~~~~~~~~~~  
`,
`
    |  
  )_)  
 )___))  
)____)____)_____)  
_____|____|____|____\\  
~~~~/\\~~~~~~~~~~~~~~~~~~\\/~~~~ 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~/\\~~~~~~~~~~~~~
   **THE ENEMY IS OBLITERATED!**  
        **TOTAL VICTORY**  
  `
];

function showAnimationFrame(frameIndex) {
    console.clear();
    console.log(animationFrames[frameIndex]);
}

function displayAnimation() {
    let currentFrame = 0;

    // Show the animation frame by frame
    const interval = setInterval(() => {
        showAnimationFrame(currentFrame);

        // If we've displayed all frames, stop the interval
        currentFrame++;
        if (currentFrame >= animationFrames.length) {
            clearInterval(interval);
        }
    }, 1500);  // Delay of 1500ms (1.5 seconds) between each frame
}

displayAnimation();
    }
  
  
    start() {
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");   

        console.log("Starting...");
        telemetryWorker.postMessage({eventName: 'ApplicationStarted', properties:  {Technology: 'Node.js'}});

        console.log(cliColor.magenta("                                     |__"));
        console.log(cliColor.magenta("                                     |\\/"));
        console.log(cliColor.magenta("                                     ---"));
        console.log(cliColor.magenta("                                     / | ["));
        console.log(cliColor.magenta("                              !      | |||"));
        console.log(cliColor.magenta("                            _/|     _/|-++'"));
        console.log(cliColor.magenta("                        +  +--|    |--|--|_ |-"));
        console.log(cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"));
        console.log(cliColor.magenta("                    +---------------___[}-_===_.'____                 /\\"));
        console.log(cliColor.magenta("                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"));
        console.log(cliColor.magenta(" __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"));
        console.log(cliColor.magenta("|                        Welcome to Battleship                         BB-61/"));
        console.log(cliColor.magenta(" \\_________________________________________________________________________|"));
        console.log();
        
        this.InitializeGame();
        this.StartGame();
    }

    StartGame() {
        console.clear();
        console.log("                  __");
        console.log("                 /  \\");
        console.log("           .-.  |    |");
        console.log("   *    _.-'  \\  \\__/");
        console.log("    \\.-'       \\");
        console.log("   /          _/");
        console.log("  |      _  /");
        console.log("  |     /_\\'");
        console.log("   \\    \\_/");
        console.log("    \"\"\"\"");
        
        do {
            console.log();
            this.DisplayGame(0);
            console.log("Player, it's your turn");
            console.log("Enter coordinates for your shot :");
            var position = Battleship.ParsePosition(readline.question());
            var isHit = this.gameController.CheckIsHit(this.enemyFleet, position, false);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: isHit}});

            if (isHit) {
                beep();

                console.log("                \\         .  ./");
                console.log("              \\      .:\";'.:..\"   /");
                console.log("                  (M^^.^~~:.'\").");
                console.log("            -   (/  .    . . \\ \\)  -");
                console.log("               ((| :. ~ ^  :. .|))");
                console.log("            -   (\\- |  \\ /  |  /)  -");
                console.log("                 -\\  \\     /  /-");
                console.log("                   \\  \\   /  /");
            }

        
    console.log(isHit ? "Yeah ! Nice hit !" : "Miss");

    if (this.IsGameOver(false)) {
        console.log("You Won!!!");
        Battleship.TriggerExplosion();  // Call the explosion animation when the game is over
    }


            // this.DisplayGame(1);
            var computerPos = this.GetRandomPosition();
            var isHit = this.gameController.CheckIsHit(this.myFleet, computerPos, true);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: isHit}});

            console.log();
            console.log(`Computer shot in ${computerPos.column}${computerPos.row} and ` + (isHit ? `has hit your ship !` : `miss`));
            if (isHit) {
                beep();

                console.log("                \\         .  ./");
                console.log("              \\      .:\";'.:..\"   /");
                console.log("                  (M^^.^~~:.'\").");
                console.log("            -   (/  .    . . \\ \\)  -");
                console.log("               ((| :. ~ ^  :. .|))");
                console.log("            -   (\\- |  \\ /  |  /)  -");
                console.log("                 -\\  \\     /  /-");
                console.log("                   \\  \\   /  /");
            }

            if (this.IsGameOver(true)) {
                console.log("You Lost :(")
            }

        }
        while (!this.IsGameOver());
    }

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        var number = parseInt(input.substring(1, 2), 10);
        return new position(letter, number);
    }

    GetRandomPosition() {
        var rows = 8;
        var lines = 8;
        var rndColumn = Math.floor((Math.random() * lines));
        var letter = letters.get(rndColumn + 1);
        var number = Math.floor((Math.random() * rows + 1));
 
        var result = new position(letter, number);
        return result;
    }

    InitializeGame() {
        this.InitializeMyFleet();
        this.InitializeEnemyFleet();
    }

    InitializeMyFleet() {
        this.myFleet = this.gameController.InitializeShips();

        console.log("Please position your fleet (Game board size is from A to H and 1 to 8) :");

        this.myFleet.forEach(function (ship) {
            console.log();
            console.log(`Please enter the positions for the ${ship.name} (size: ${ship.size})`);
            for (var i = 1; i < ship.size + 1; i++) {
                    console.log(`Enter position ${i} of ${ship.size} (i.e A3):`);
                    const position = readline.question();
                    telemetryWorker.postMessage({eventName: 'Player_PlaceShipPosition', properties:  {Position: position, Ship: ship.name, PositionInShip: i}});
                    ship.addPosition(Battleship.ParsePosition(position));
            }
        })
    }

    InitializeEnemyFleet() {
        this.enemyFleet = this.gameController.InitializeShips();

        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));
        this.enemyFleet[1].addPosition(new position(letters.E, 5));

        this.enemyFleet[2].addPosition(new position(letters.A, 3));
        this.enemyFleet[2].addPosition(new position(letters.B, 3));
        this.enemyFleet[2].addPosition(new position(letters.C, 3));

        this.enemyFleet[3].addPosition(new position(letters.F, 8));
        this.enemyFleet[3].addPosition(new position(letters.G, 8));
        this.enemyFleet[3].addPosition(new position(letters.H, 8));

        this.enemyFleet[4].addPosition(new position(letters.C, 5));
        this.enemyFleet[4].addPosition(new position(letters.C, 6));
    }

    DisplayGame(view) {
        function createBoard(fleet, ownBoard) {
            let board = Array(8).fill(null).map(() => Array(8).fill('.'));
            fleet.forEach(ship => {
                ship.positions.forEach(pos => {
                    let row = pos.row - 1;
                    let col = pos.column - 1;
                    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
                        board[row][col] = ownBoard ? 'S' : '.';
                    }
                });
            });
            return board;
        };

        function addShots(board, shots) {
            shots.forEach(shot => {
                let row = shot.position.row - 1;
                let col = shot.position.column - 1;
                board[row][col] = shot.isHit ? 'X' : 'O';
            });
            return board;
        }

        let myBoard = createBoard(this.myFleet, true);
        let enemyBoard = createBoard(this.enemyFleet, false);

        addShots(myBoard, this.gameController.myShots);
        addShots(enemyBoard, this.gameController.enemyShots);

        console.log("\nYour Board:                             Enemy Board:");
        console.log("  A B C D E F G H                      A B C D E F G H");

        for (let i = 0; i < 8; i++) {
            let row = `${i + 1} `;
            myBoard[i].forEach(cell => row += `${cell} `);
            row += `                   ${i + 1} `;
            enemyBoard[i].forEach(cell => row += `${cell} `);
            console.log(row);
        }
        console.log();
    }

    IsGameOver(isPlayer) {
        const fleet = isPlayer ? this.myFleet : this.enemyFleet;
        return fleet.every(ship => ship.isSunk());
    }
}

module.exports = Battleship;
