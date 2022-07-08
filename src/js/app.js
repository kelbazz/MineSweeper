const root = document.querySelector(".root");
const container = document.querySelector(".ms-container");

const map = [];
let mapSize, nbOfMines, nbOfFlags;

window.addEventListener("contextmenu", (e) => e.preventDefault())

function handleFlag(x, y) {
    const { tile } = map[x][y];
    if (nbOfFlags > 0 && !map[x][y].flagged && !map[x][y].shown) {
        nbOfFlags--
        tile.classList.add(`tile-flagged`);
    } else if (map[x][y].flagged) {
        nbOfFlags++
        tile.classList.remove(`tile-flagged`);
    } else return;

    document.querySelector(".ms-flags").innerText = nbOfFlags;
    map[x][y].flagged = !map[x][y].flagged;
}

function gameOver(win = false) {
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            if (map[i][j].type === "m" && !map[i][j].shown && !win) {
                if (map[i][j].flagged) handleFlag(i, j);
                handleSweep(i, j);
            }
            else if (map[i][j].type !== "m" || win) {
                map[i][j].tile.style.opacity = "0.5";
                map[i][j].tile.style.pointerEvents = "none";
            };
        }
    }
}

function handleSweep(x, y) {
    if (map[x][y].flagged) return;

    const { type, tile } = map[x][y];

    tile.classList.add(`tile-${type}`);
    map[x][y].shown = true;

    let won = true;
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            if (!map[i][j].shown && map[i][j].type !== "m") won = false;
        }
    }
    if (won) return gameOver(true);

    if (type === 0) {
        if (x + 1 < mapSize && !map[x + 1][y].shown) {
            handleSweep(x + 1, y);
        }
        if (x - 1 >= 0 && !map[x - 1][y].shown) {
            handleSweep(x - 1, y);
        }
        if (y + 1 < mapSize && !map[x][y + 1].shown) {
            handleSweep(x, y + 1);
        }
        if (y - 1 >= 0 && !map[x][y - 1].shown) {
            handleSweep(x, y - 1);
        }
        if (x - 1 >= 0 && y - 1 >= 0 && !map[x - 1][y - 1].shown) {
            handleSweep(x - 1, y - 1);
        }
        if (x + 1 < mapSize && y + 1 < mapSize && !map[x + 1][y + 1].shown) {
            handleSweep(x + 1, y + 1);
        }
        if (x + 1 < mapSize && y - 1 >= 0 && !map[x + 1][y - 1].shown) {
            handleSweep(x + 1, y - 1);
        }
        if (x - 1 >= 0 && y + 1 < mapSize && !map[x - 1][y + 1].shown) {
            handleSweep(x - 1, y + 1);
        }
    }
    if (type === "m") {
        return gameOver();
    }
}

function init() {
    map.length = 0;
    mapSize = document.querySelector(".ms-map-size").value;
    nbOfMines = mapSize <= 1 ? 0 : mapSize <= 9 ? mapSize : mapSize * 2;
    nbOfFlags = nbOfMines;
    container.innerHTML = "";

    document.querySelector(".ms-map-size").innerText = mapSize ** 2;
    document.querySelector(".ms-mines").innerText = nbOfMines;
    document.querySelector(".ms-flags").innerText = nbOfFlags;

    for (let i = 0; i < mapSize; i++) {
        const row = [];
        for (let j = 0; j < mapSize; j++) {
            row.push({ type: 0, tile: null, shown: false, flagged: false });
        }
        map.push(row);
    }


    for (let i = 0; i < nbOfMines; i++) {
        let rX = Math.floor(Math.random() * mapSize);
        let rY = Math.floor(Math.random() * mapSize);
        while (map[rX][rY].type === "m") {
            rX = Math.floor(Math.random() * mapSize);
            rY = Math.floor(Math.random() * mapSize);
        }

        map[rX][rY].type = "m";
        if (rX + 1 < mapSize && map[rX + 1][rY].type !== "m") map[rX + 1][rY].type++;
        if (rX - 1 >= 0 && map[rX - 1][rY].type !== "m") map[rX - 1][rY].type++;
        if (rY + 1 < mapSize && map[rX][rY + 1].type !== "m") map[rX][rY + 1].type++;
        if (rY - 1 >= 0 && map[rX][rY - 1].type !== "m") map[rX][rY - 1].type++;
        if (rX - 1 >= 0 && rY - 1 >= 0 && map[rX - 1][rY - 1].type !== "m") map[rX - 1][rY - 1].type++;
        if (rX + 1 < mapSize && rY + 1 < mapSize && map[rX + 1][rY + 1].type !== "m") map[rX + 1][rY + 1].type++;
        if (rX + 1 < mapSize && rY - 1 >= 0 && map[rX + 1][rY - 1].type !== "m") map[rX + 1][rY - 1].type++;
        if (rX - 1 >= 0 && rY + 1 < mapSize && map[rX - 1][rY + 1].type !== "m") map[rX - 1][rY + 1].type++;
    }



    for (let i = 0; i < mapSize; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < mapSize; j++) {
            const tile = document.createElement("div");
            map[i][j].tile = tile;
            tile.addEventListener("click", () => {
                handleSweep(i, j);
            });
            tile.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                handleFlag(i, j);
            });
            tile.classList.add("tile");
            row.appendChild(tile);
        }
        container.appendChild(row);
    }
}

init();


