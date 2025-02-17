class GameController {
    constructor() {
        this.myShots = [];
        this.enemyShots = [];
    }

    InitializeShips() {
        var colors = require("cli-color");
        const Ship = require("./ship.js");
        var ships = [
            new Ship("Aircraft Carrier", 5, colors.CadetBlue),
            new Ship("Battleship", 4, colors.Red),
            new Ship("Submarine", 3, colors.Chartreuse),
            new Ship("Destroyer", 3, colors.Yellow),
            new Ship("Patrol Boat", 2, colors.Orange)
        ];
        return ships;
    }

    CheckIsHit(ships, shot, isPlayerShot = true) {
        if (!shot) throw "The shooting position is not defined";
        if (!ships) throw "No ships defined";

        let isHit = false;
        ships.forEach(ship => {
            ship.positions.forEach(position => {
                if (position.row == shot.row && position.column == shot.column) {
                    isHit = true;
                }
            });
        });

        const shotRecord = { position: shot, isHit: isHit };
        if (isPlayerShot) {
            this.myShots.push(shotRecord);
        } else {
            this.enemyShots.push(shotRecord);
        }

        return isHit;
    }

    isShipValid(ship) {
        return ship.positions.length === ship.size;
    }
}

module.exports = GameController;
