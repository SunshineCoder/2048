//
function showNumberWithAnimation(x,y,number) {
    var numberCell = $("#number-cell-" + x + "-" + y);
    numberCell.css({
        "background-color": getNumberBackgroundColor(number),
        "color": getNumberColor(number)
    });
    numberCell.text(cellTexts[number]);

    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getCellPosition(x,y).top,
        left: getCellPosition(x,y).left
    },50);
}

function showMoveAnimation(fromX, fromY, toX, toY) {
    var numberCell = $("#number-cell-" + fromX + "-" + fromY);
    numberCell.animate({
        top: getCellPosition(toX, toY).top,
        left: getCellPosition(toX, toY).left
    },200);
}

function showScore(score) {
    $("#score").text(score);
}