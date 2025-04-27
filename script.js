let outer = document.getElementById("game")
let gtop = document.createElement("div")
gtop.id = "top"

function numbers(num, e1, e2=undefined, e3=undefined) {
    if(!e3) {
        e2 = e1[1]
        e3 = e1[2]
        e1 = e1[0]
    }
    num = num.toString().split("")
    if(num.length > 2) e1.src = `images/num0${num[num.length-3]}.png`
    else e1.src = `images/num00.png`
    if(num.length > 1) e2.src = `images/num0${num[num.length-2]}.png`
    else e2.src = `images/num00.png`
    e3.src = `images/num0${num[num.length-1]}.png`
}

let minenums = []
let mines = document.createElement("div")
mines.id = "numbers"
for(let i=0; i<3; i++) {
    let num = document.createElement('img')
    num.src = "images/num00.png"
    mines.appendChild(num)
    minenums.push(num)
}
gtop.appendChild(mines)
let minecount = 25
numbers(minecount, minenums)

let face = document.createElement("img")
face.src = "images/13.png"
face.id = "face"
face.addEventListener("mousedown", () => {
    face.src = "images/17.png"
    minecount = 25
    numbers(25, minenums)
    numbers(0, timenums)
    timecounter = "waiting"
    setup()
})
face.addEventListener("mouseup", () => {
    face.src = "images/13.png"
})
gtop.appendChild(face)

//TIMER
let timenums = []
let time = document.createElement("div")
time.id = "numbers"
for(let i=0; i<3; i++) {
    let num = document.createElement('img')
    num.src = "images/num00.png"
    time.appendChild(num)
    timenums.push(num)
}
gtop.appendChild(time)
let realtime = 0
timecounter = "waiting"

outer.appendChild(gtop)

let inner = document.createElement("div")
inner.id = "inner"
outer.appendChild(inner)

function getneighbors(grid,x,y) {
    let y1 = y>0
    let y2 = y<grid.length-1
    let x1 = x > 0
    let x2 = x<grid[0].length-1
    let neighbors = 0
    if(x2) {
        if(y1) if(grid[y-1][x+1].mine) neighbors++
        if(grid[y][x+1].mine) neighbors++
        if(y2) if(grid[y+1][x+1].mine) neighbors++
    }
    if(y1) if(grid[y-1][x].mine) neighbors++
    if(y2) if(grid[y+1][x].mine) neighbors++
    if(x1) {
        if(y1) if(grid[y-1][x-1].mine) neighbors++
        if(grid[y][x-1].mine) neighbors++
        if(y2) if(grid[y+1][x-1].mine) neighbors++
    }
    return neighbors
}

function setup() {
    inner.innerHTML = ""
    let grid = []
    for(let y=0; y<16; y++) {
        let gRow = []
        let row = document.createElement("div")
        row.id = "row"
        for(let x=0; x<18; x++) {
            let tiledata = {mine: false, clicked: false, flagged: false, x: x, y:y, reveal: () => {
                    if(!face.src.includes("images/13.png")) return
                    if(grid[y][x].clicked) return
                    if(timecounter == "waiting") {
                        timecounter = setInterval(() => {
                            realtime++
                            numbers(realtime, timenums)
                        }, 1000)
                    }
                    tile.src = "images/01.png"
                    grid[y][x].clicked = true

                    let neighbors = getneighbors(grid,x,y)
                    if(neighbors == 1) tile.src = "images/02.png"
                    if(neighbors == 2) tile.src = "images/03.png"
                    if(neighbors == 3) tile.src = "images/04.png"
                    if(neighbors == 4) tile.src = "images/05.png"
                    if(neighbors == 5) tile.src = "images/06.png"
                    if(neighbors == 6) tile.src = "images/07.png"
                    if(neighbors == 7) tile.src = "images/08.png"
                    if(neighbors == 8) tile.src = "images/09.png"

                    if(neighbors == 0) {
                        let queue = []
                        let y1 = y>0
                        let y2 = y<grid.length-1
                        let x1 = x > 0
                        let x2 = x<grid[0].length-1
                        if(x2) {
                            if(y1) queue.push(grid[y-1][x+1])
                            queue.push(grid[y][x+1])
                            if(y2) queue.push(grid[y+1][x+1])
                        }
                        if(y1) queue.push(grid[y-1][x])
                        if(y2) queue.push(grid[y+1][x])
                        if(x1) {
                            if(y1) queue.push(grid[y-1][x-1])
                            queue.push(grid[y][x-1])
                            if(y2) queue.push(grid[y+1][x-1])
                        }
                        queue.forEach((neighbor) => {neighbor.reveal()})
                    }

                    if(grid[y][x].mine && minecount > 0) {
                        tile.src = "images/12.png"
                        face.src = "images/15.png"
                        clearInterval(timecounter)
                        grid.forEach((row) => {row.forEach((tile) => {tile.gameover()})})
                    }
                    if(tiledata.mine && minecount < 1) tile.src = "images/11.png"
                }, gameover: () => {
                    if(tiledata.clicked) return
                    if(tiledata.mine) tile.src = "images/12.png"
                }
            }

            let tile = document.createElement("img")
            tile.src = "images/00.png"
            tile.id = "tile"
            tile.draggable = "false"
            tile.addEventListener("click", tiledata.reveal)
            tile.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                if(!face.src.includes("images/13.png")) return
                if(!grid[y][x].clicked) {
                    if(tile.src.includes("images/10.png")) {
                        tile.src = "images/00.png"
                        grid[y][x].flagged = false
                        minecount++
                    } else if(minecount > 0) {
                        tile.src = "images/10.png"
                        grid[y][x].flagged= true
                        minecount--
                        if(minecount < 1) {
                            wegood = true
                            grid.forEach((row) => {row.forEach((tile) => {
                                if((tile.flagged && !tile.mine) || (!tile.flagged && tile.mine)) wegood = false
                            })})
                            if(wegood) {
                                clearInterval(timecounter)
                                numbers(realtime, timenums)
                                grid.forEach((row) => {row.forEach((tile) => {tile.reveal()})})
                                face.src = "images/16.png"
                            }
                        }
                    }
                }
                numbers(minecount, minenums)
              })
            row.appendChild(tile)
            gRow.push(tiledata)
        }
        inner.appendChild(row)
        grid.push(gRow)
    }

    for(let i=0; i<25; i++) {
        for(let n=0; n<20; n++) {
            let y = Math.floor(Math.random()*16)
            let x = Math.floor(Math.random()*18)
            if(grid[y][x].mine) continue
            grid[y][x].mine = true
            n = 20
        }
    }
}

setup()