documentWidth = window.screen.availWidth;//屏幕宽度
gridContainerWidth = 0.92 * documentWidth;//大格子宽度
cellSideLength = 0.18 * documentWidth;//小格子的边长
cellSpace = 0.04 * documentWidth;//小格子之间的间距


//Model数据源
function getModelByType() {
    $(".ul_types :radio").each(function (key,value) {
        //console.log("key:" + key + " value:" + value);
        //console.log($(value).attr("checked"));
        if ($(value).attr("checked")=="checked") {
            var type = $(value).parent().text();
            switch (type) {
                case "咨询类":
                    cellTexts = { 2: "实习生", 4: "话务员", 8: "初级咨询", 16: "中级咨询", 32: "高级咨询", 64: "金牌咨询", 128: "主任", 256: "校长", 512: "大区主任", 1024: "大区校长", 2048: "总监", 4096: "CEO" };
                    break;
                case "开发类":
                    cellTexts = { 2: "小白", 4: "菜鸟", 8: "实习生", 16: "初级开发", 32: "中级开发", 64: "高级开发", 128: "特级开发", 256: "初级架构", 512: "中级架构", 1024: "高级架构", 2048: "总监", 4096: "CEO" };
                    break;
                case "测试类":
                    cellTexts = { 2: "实习生", 4: "初级测试", 8: "中级测试", 16: "高级测试", 32: "初级架构", 64: "中级架构", 128: "高级架构", 256: "特级架构", 512: "高级经理", 1024: "总监", 2048: "CEO", 4096: "总裁" };
                    break;                
                default:
                    cellTexts = { 2: "实习生", 4: "话务员", 8: "初级咨询", 16: "中级咨询", 32: "高级咨询", 64: "金牌咨询", 128: "主任", 256: "校长", 512: "大区主任", 1024: "大区校长", 2048: "总监", 4096: "CEO" };
            }
        }        
    });
    
}

//设置UI-Cell的Top，Left坐标
function getCellPosition(i, j) {
    var topAndLeft = { "left": 0, "top": 0 };
    topAndLeft.left = j * cellSideLength + (j + 1) * cellSpace;
    topAndLeft.top = i * cellSideLength + (i + 1) * cellSpace;
    return topAndLeft;
}

//获取数字背景颜色
function getNumberBackgroundColor(number) {
    switch (number) {
        case 2: return "#eee4da"; break;
        case 4: return "#ede0c8"; break;
        case 8: return "#ede0c8"; break;
        case 16: return "#ede0c8"; break;
        case 32: return "#ede0c8"; break;
        case 64: return "#ede0c8"; break;
        case 128: return "#ede0c8"; break;
        case 256: return "#ede0c8"; break;
        case 512: return "#eee4da"; break;
        case 1024: return "#ede0c8"; break;
        case 2048: return "#ede0c8"; break;
        case 4096: return "#ede0c8"; break;
        case 8192: return "#ede0c8"; break;
        case 16384: return "#ede0c8"; break;
        case 32768: return "#ede0c8"; break;
        default: return "red"; break;
    }
    return "#000";
}

function getNumberColor(number) {
    if (number<=4) {
        return "#776e65";
    } else if (number>4&&number<512) {
        return "black";
    }
    return "green";
}

//判断当前是否存在空的格子 
function noSpace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4;j++){
            if (board[i][j]==0) {
                return false;
            } 
        }
    }
    return true;
}

function noMove(board) {
    if (canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board)) {
        return false;
    }
    return true;
}

function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4;j++){
            if (board[i][j]!=0) {
                if((board[i][j-1]==0)||(board[i][j-1]==board[i][j])){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board) {
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if ((board[i-1][j] == 0) || (board[i-1][j] == board[i][j])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] != 0) {
                if ((board[i][j + 1] == 0) || (board[i][j + 1] == board[i][j])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if ((board[i+1][j] == 0) || (board[i+1][j] == board[i][j])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockToLeftRight(row, col1, col2, board){
    for (var i = col1+1; i < col2; i++) {
        if(board[row][i]!=0){
            return false;
        }
    }
    return true;
}
function noBlockToUpDown(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) {
            return false;
        }
    }
    return true;
}