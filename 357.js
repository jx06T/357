
var Y = 9
var list = [] //玩家下棋暫存
var checkerboard = [3, 5, 7] // 電腦棋盤
var playerCheckerboard = [["O", "O", "O"], ["O", "O", "O", "O", "O"], ["O", "O", "O", "O", "O", "O", "O"]] //玩家棋盤
var back = false // 反悔
var normal = false //留最後一個
back = true
// normal = true
var map = [[], [], [], [], [], [], [], []]
var before
var after
var FirstTime = true
FirstTime = false
var difficulty = 40
var setF = document.querySelector(".setF");
var setN = document.querySelector(".setN");
var setD = document.querySelector(".setD");
//----------------------------------------------------------------------------------------

// 初始
function initial() {
    Y = 9
    document.getElementById("check").innerHTML = "check"
    var all = document.querySelectorAll("td");
    list = []
    playerCheckerboard = [["O", "O", "O"], ["O", "O", "O", "O", "O"], ["O", "O", "O", "O", "O", "O", "O"]]
    for (var i = 0; i < all.length; i++) {
        all[i].innerText = "O"
    }
    if (!FirstTime) {
        tidy()
        AI()
    }
}

// 玩家點選
function down(y, x) {
    if (playerCheckerboard[y][x] == "Ø") return
    if (Y != y && Y != 9) return
    Y = y
    var place = y * 10 + x
    place = document.querySelector("#" + CSS.escape(place));
    var xPlace = list.indexOf(x)

    if (xPlace != -1) {
        if (back && (list.indexOf(x - 1) == -1 || list.indexOf(x + 1) == -1)) {
            list.splice(xPlace, 1)
            place.innerText = "O"
            if (list.length == 0) Y = 9
        }
    } else if ((list.length == 0 || list.indexOf(x - 1) != -1 || list.indexOf(x + 1) != -1)) {
        list.push(x)
        place.innerText = "Θ"
    }
    // console.log(list)
}

//玩家下棋
function check() {
    if (list.length == 0) return
    list.sort(function (a, b) {
        return a - b;
    })
    var l = list.length
    var x = list[0]
    list.splice(0, l)
    DrawOff(x, Y, l)
    Y = 9
    tidy("player")
    AI()
}

//更新玩家棋盤 劃掉
function DrawOff(x, y, l) {
    for (var i = 0; i < l; i++) {
        playerCheckerboard[y][x + i] = "Ø"
        var place = y * 10 + x + i
        place = document.querySelector("#" + CSS.escape(place));
        place.innerText = "Ø"

    }
    // console.log(playerCheckerboard)
}

// 整理
function tidy(player) {
    checkerboard.splice(0, checkerboard.length)
    map.splice(0, map.length)
    for (var i = 0; i < 8; i++) {
        map.push([])
    }
    for (var y = 0; y < 3; y++) {
        var x = 0
        while (x < playerCheckerboard[y].length) {
            var continuous = 0
            while (playerCheckerboard[y][x] == "O" && x < playerCheckerboard[y].length) {
                x++
                continuous++
            }
            if (continuous != 0) {
                checkerboard.push(continuous)
                map[continuous].push({ "x": (x - continuous), "y": y })
            }
            while (playerCheckerboard[y][x] != "O" && x < playerCheckerboard[y].length) {
                x++
            }
        }
    }
    if (checkerboard.length == 0) {
        if (normal) {
            if (player == "AI") {
                // alert("他贏了")   
                document.getElementById("check").innerHTML = "you lose"
            } else {
                // alert("你贏了")
                document.getElementById("check").innerHTML = "you win"
            }
        } else {
            if (player == "AI") {
                // alert("他輸了")  
                document.getElementById("check").innerHTML = "you win"
            } else {
                // alert("你輸了")
                document.getElementById("check").innerHTML = "you lose"
            }
        }
    }
    console.log(map)
}

//AI
function AI() {
    checkerboard.sort(function (a, b) {
        return b - a;
    })
    if (checkerboard.length == 0) {
        tidy()
        return
    }
    if (checkerboard[1] < 2 || checkerboard.length == 1) {
        exceptionA()
    } else {
        AIa()
    }
    // console.log(before,after)
    rand = Math.floor(Math.random() * map[before].length)
    var x = map[before][rand].x
    var y = map[before][rand].y
    var l = before - after
    var s = x
    var b = before
    if (l > 3) {
        var n = AIb(l, x)
        x = n.x
        l = n.l
    }
    rand = Math.floor(Math.random() * 100)
    if (l == 0 || rand > difficulty) {
        tidy()
        var n = AIc()
        x = n.x
        l = n.l
        y = n.y
        b = n.b
        s = n.s
    }
    if (Math.random() > 0.5) {
        DrawOff(x, y, l)
    } else {
        DrawOff(2 * s + b - x - l, y, l)
    }
    tidy("AI")
}
function AIc() {
    var b = checkerboard.indexOf(1)
    if (b == 0) {
        b = 1
    } else {
        if (b == -1) {
            b = checkerboard.length + 1
        }
        var rand = Math.floor(Math.random() * (b - 1))
        b = checkerboard[rand]
    }
    console.log(checkerboard)
    rand = Math.floor(Math.random() * map[b].length)
    var s = map[b][rand].x
    var y = map[b][rand].y
    var x = s + Math.floor(Math.random() * b)
    var l = 1
    return { "x": x, "y": y, "l": l, "b": b, "s": s }
}

function AIb(l, x) {
    checkerboard.splice(0, 0, 0);
    var b = before
    var sx = x
    for (var i = 1; i < b / 2; i++) {
        checkerboard[0] = i
        checkerboard[1] = b - 1 - i
        AIa()
        if (before - after + 1 < l) {
            l = before - after + 1
            sx = i
        }
    }
    //console.log(x, l)
    return { "x": x + sx, "l": l }
}
function AIa() {
    var t = 0
    for (var i = 0; i < checkerboard.length; i++) {
        t = t ^ checkerboard[i]
    }
    var ok = []
    for (var i = 0; i < checkerboard.length; i++) {
        if ((t ^ checkerboard[i]) <= checkerboard[i]) {
            ok.push({ "before": checkerboard[i], "after": t ^ checkerboard[i] })
        }
    }

    var rand = Math.floor(Math.random() * ok.length)
    before = ok[rand].before
    after = ok[rand].after
}
// 最後
function exceptionA() {
    before = checkerboard[0]
    if (normal) {
        after = (checkerboard.length - 1) % 2
    } else {
        after = (checkerboard.length) % 2
    }

}
//輸贏
//------------------------------------------------------------------
function updateF(e) {
    if (e.target.value == "false") {
        FirstTime = false
    } else {
        FirstTime = true
    }
    initial()
}
function updateN(e) {
    if (e.target.value == "false") {
        normal = false
    } else {
        normal = true
    }
    initial()
}
function updateD(e) {
    difficulty = e.target.value * 1
    initial()
}
setF.addEventListener("change", updateF, false);
setN.addEventListener("change", updateN, false);
setD.addEventListener("change", updateD, false);