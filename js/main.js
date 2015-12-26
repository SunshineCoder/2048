var board = [];//承载16宫格数据的二维数组。
var isAddCells = [];//用于记录每个格子是否已经碰撞叠加的二维数组。
var score = 0;
/*私人定制*/
var cellTexts = {};

//触控坐标
var startx = 0,
    starty = 0,
    endx = 0,
    endy = 0;


$(function () {
    prepareForMobile();
    newGame();
});

function prepareForMobile() {
    //判断屏幕展示
    if (documentWidth>500) {
        gridContainerWidth = 500;//大格子宽度
        cellSideLength =100;//小格子的边长
        cellSpace = 20;//小格子之间的间距
    }

    $(".grid-container").css({
        "width": (gridContainerWidth - 2 * cellSpace) + "px",
        "height": (gridContainerWidth - 2 * cellSpace)+"px",
        "padding": cellSpace,
        "border-radius":0.02*gridContainerWidth
    });
    $(".grid-cell").css({
        "width": cellSideLength + "px",
        "height": cellSideLength + "px",
        "border-radius": 0.02 * cellSideLength + "px"
    });
}

function newGame() {
    //初始化数字格
    init();
    //在随机两个格子生成数字
    createOneNumber();
    createOneNumber();
}

function init() {
    getModelByType();
    score = 0;
    showScore(score);
   
    //初始化背景单元格
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4;j++){
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css(
                {
                    "top": getCellPosition(i, j).top,
                    "left": getCellPosition(i, j).left
                });
            //console.log(getCellPosition(i, j).top, getCellPosition(i, j).left);
        }
    }

    //初始化二维数组
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        isAddCells[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            isAddCells[i][j] = false;
        }
    }

    //更新数组数据，反映到view
    updateBoardView();
}

function updateBoardView(){
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4;j++){
            $(".grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $("#number-cell-" + i + "-" + j);
            if (board[i][j] === 0) {
                theNumberCell.css({
                    "width": "0px",
                    "height": "0px",
                    "top": getCellPosition(i, j).top+cellSideLength/2,
                    "left": getCellPosition(i, j).left + cellSideLength / 2
                });
            } else {
                theNumberCell.css({
                    "width": cellSideLength,
                    "height": cellSideLength,
                    "top": getCellPosition(i, j).top,
                    "left": getCellPosition(i, j).left,
                    "background-color": getNumberBackgroundColor(board[i][j]),
                    "color":getNumberColor(board[i][j])
                });
                theNumberCell.text(cellTexts[board[i][j]]);
            }
            isAddCells[i][j] = false;
        }
    }
    $(".number-cell").css({
        "line-height":cellSideLength+"px",
        "font-size":0.2*cellSideLength+"px"    
    });
}

function createOneNumber() {
    if (noSpace(board)) {
        return false;
    }
    //随机一个位置
    var radomX, radomY;
    var XY = [];//用于存放所有空格为0的坐标组，e.g[[0,1],[x,y]]
    /*
    此处可以进行优化，因为如果一直没有找到响应的随机数刚好对应0空格的话，将一直循环下去
    */
    //do {
    //      radomX= parseInt(Math.floor(Math.random() * 4));
    //      radomY = parseInt(Math.floor(Math.random() * 4));
    //      if (board[radomX][radomY]===0) {
    //          break;
    //      }
    //} while (true);
    
    //优化方案
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4;j++){
            if (board[i][j]==0) {
                XY.push([i, j]);
            }
        }
    }
    var xyIndex = parseInt(Math.floor(Math.random() * (XY.length - 1)));//在所有为空的格子数组中随机取出来一组下标；
    radomX = XY[xyIndex][0];
    radomY = XY[xyIndex][1];

    //随机一个数字：2、4
    var radomNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[radomX][radomY] = radomNumber;
    showNumberWithAnimation(radomX,radomY,radomNumber);
}

$(".ul_types").click(function () {
    getModelByType();
});

//响应游戏事件，键盘操作
$(document).keydown(function (e) {
    switch(e.keyCode){
        case 37://left
            e.preventDefault();
            if (moveLeft()) {
                setTimeout("createOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 38://up
            e.preventDefault();
            if (moveUp()) {
                setTimeout("createOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 39://right
            e.preventDefault();
            if (moveRight()) {
                setTimeout("createOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 40://down
            e.preventDefault();
            if (moveDown()) {
                setTimeout("createOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        default:
            break;
    }
});

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4;j++){
            if (board[i][j]!=0) {
                for (var k = 0; k < j;k++){
                    if (board[i][k] == 0 && noBlockToLeftRight(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockToLeftRight(i, k, j, board)&&!isAddCells[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);                        
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //update score
                        score += board[i][k];
                        showScore(score);

                        //update isAdded
                        isAddCells[i][k] = true;
                        continue;
                    }                   
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    //moveUp
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockToUpDown(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockToUpDown(j, k, i, board)&&!isAddCells[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //update score
                        score += board[k][j];
                        showScore(score);

                        isAddCells[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    //moveRight
    for (var i = 0; i < 4; i++) {
        for (var j =2; j >=0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k >j; k--) {
                    if (board[i][k] == 0 && noBlockToLeftRight(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockToLeftRight(i, j, k, board)&&!isAddCells[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //update score
                        score += board[i][k];
                        showScore(score);

                        isAddCells[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    //moveDown
    for (var i = 2; i >=0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 3; k >i; k--) {
                    if (board[k][j] == 0 && noBlockToUpDown(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockToUpDown(j, i, k, board)&&!isAddCells[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //update score
                        score += board[k][j];
                        showScore(score);

                        isAddCells[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

//给document增加触控的监听事件
document.addEventListener("touchstart", function (e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
});

document.addEventListener("touchmove", function (e) {
    e.preventDefault();
});

document.addEventListener("touchend", function (e) {
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;

    var deltax = endx - startx,
        deltay = endy - starty;

    /*
        bug细节优化，由于除了滑动，点击一下屏幕也会触发touchend事件，所以呢，要进行一下处理
    */
    if (Math.abs(deltax) < 0.2 * documentWidth && Math.abs(deltay) < 0.2 * documentWidth) {
        return;
    }

    //在web平面坐标系中，Y轴正方向是向下的，要注意
    //x方向
    if (Math.abs(deltax)>=Math.abs(deltay)) {
        //向右
        if (deltax > 0) {
            if (moveRight()) {
                setTimeout("createOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        } else {//向左
            if (moveLeft()) {
                setTimeout("createOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
    } else {//y方向
        //向下
        if (deltay>0) {
            if (moveDown()) {
                setTimeout("createOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
        //向上
        if (moveUp()) {
            setTimeout("createOneNumber()", 210);
            setTimeout("isGameOver()", 300);
        }
    }

});



//判断是否游戏结束了
function isGameOver() {
    if (noSpace(board)&&noMove(board)) {
        gameOver();
    } 
}



function gameOver(){
    alert("Game Over");
}
