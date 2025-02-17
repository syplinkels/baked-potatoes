class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
    }

    addPosition(position) {
        this.positions.push({ ...position, isHit: false });
    }

    hitPosition(position) {
        const pos = this.positions.find(pos => pos.row === position.row && pos.column === position.column);
        if (pos) {
            pos.isHit = true;
        }
    }

    isSunk() {
        return this.positions.every(pos => pos.isHit);
    }
}

module.exports = Ship;
