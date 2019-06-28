// function that handles user selecting radio button
function setPlayerOne() {
    $("#playerForm input").on("change", (ev) => {
        // capture the value of radio button that has been selected
        var playerOne = $("input[type=radio][name=radio]:checked", "#playerForm").val()
        console.log(`player selected is ${playerOne}`);

        // hide player form
        $("#playerForm").addClass("displayNone");

        // add html
        $("#playerOne").html(`You are <span id="playerOneSpan" class="yellow">${playerOne}</span>`);

        // make gameInfo, gameGrid visible
        $("#gameInfo").removeClass("displayNone");
        $("#gameGrid").removeClass("displayNone");
    })
}

setPlayerOne();

function getPlayerOne() {
    // var playerOne = $("#playerOneSpan").val(); // cant use this since val is only used for selection/radio button/form elements etc

    // check if the user has selected X or O
    if (document.getElementById("playerOneSpan") != null) {
        var playerOne = document.getElementById("playerOneSpan").innerHTML;
    }

    if (playerOne) {
        return playerOne;
    }
}

// function that handles playerOne clicking inside grid cells
function clickButton() {
    $(".item").on("click", function() {
        // if playerOne clicks then add blue color to cell
        var playerOne = getPlayerOne();

        // check if playerOne is X or O
        if (playerOne === "X") {
            // this is a reference to the html DOM element that is the source of the event.
            // $(this) is a jQuery wrapper around that element that enables usage of jQuery methods.
            // color the cell blue and modify its html to be X
            $(this).addClass("blue");
            $(this).html("X");
        }

        if (playerOne === "O") {
            $(this).addClass("blue");
            $(this).html("O");
        }

        // after each grid cell click, call playGame
        // which checks if there are any winners
        // also checks whose turn it is
        // and plays computer turn
        playGame();
    })
}

clickButton();

function getRedCount() {
    return $("#gameGrid .red").length;
}

function getBlueCount() {
    return $("#gameGrid .blue").length;
}

// check if there is a winner
function checkForWinner() {
    var playerOne = getPlayerOne();
    var computer = (playerOne === "X") ? "O" : "X";

    // create winners array for blue (playerOne)
    // find elements that have id: as the # value and class: blue
    var blueWin1 = $("#one.blue, #two.blue, #three.blue").length === 3;
    var blueWin2 = $("#four.blue, #five.blue, #six.blue").length === 3
    var blueWin3 = $("#seven.blue, #eight.blue, #nine.blue").length === 3
    var blueWin4 = $("#one.blue, #four.blue, #seven.blue").length === 3
    var blueWin5 = $("#two.blue, #five.blue, #eight.blue").length === 3
    var blueWin6 = $("#three.blue, #six.blue, #nine.blue").length === 3
    var blueWin7 = $("#one.blue, #five.blue, #nine.blue").length === 3
    var blueWin8 = $("#seven.blue, #five.blue, #three.blue").length === 3
    
    // create winners array for computer
    var redWin1 = $("#one.red, #two.red, #three.red").length === 3
    var redWin2 = $("#four.red, #five.red, #six.red").length === 3
    var redWin3 = $("#seven.red, #eight.red, #nine.red").length === 3
    var redWin4 = $("#one.red, #four.red, #seven.red").length === 3
    var redWin5 = $("#two.red, #five.red, #eight.red").length === 3
    var redWin6 = $("#three.red, #six.red, #nine.red").length === 3
    var redWin7 = $("#one.red, #five.red, #nine.red").length === 3
    var redWin8 = $("#seven.red, #five.red, #three.red").length === 3

    // if either one of the above is true, we have a winner
    var blueWins = (blueWin1 || blueWin2 || blueWin3 || blueWin4 || blueWin5 || blueWin6 || blueWin7 || blueWin8);
  
    var redWins = (redWin1 || redWin2 || redWin3 || redWin4 || redWin5 || redWin6 || redWin7 || redWin8);

    // there could be a draw if all cells are either red or blue
    // and neither blue or red wins

    // get a count of blue cells
    var blueCount = getBlueCount();

    // get a count of red cells
    var redCount = getRedCount();

    var total = blueCount + redCount;

    var winner;

    if (blueWins) {
        winner = blueWins;
        console.log(`${playerOne} wins!`);   
        $("#gameResult, #congratsOrSorry").removeClass("displayNone")
        $("#gameResult").html(`<span class='yellowBig'>${playerOne} wins!</span>`);
        $("#congratsOrSorry").html("<span class='yellow'>Congratulations! You won!</span>")
        $("#gameInfo").addClass("displayNone")
        disableRemainingItems()
        return winner
    }

    if (redWins) { //red is computer
        winner = redWins
        console.log(`${computer} wins!`)
        $("#gameResult, #congratsOrSorry").removeClass("displayNone")
        $("#gameResult").html(`<span class='redBig'>${computer} wins!</span>`)
        $("#congratsOrSorry").html("<span class='red'>Sorry, you lost.</span>")
        $("#gameInfo").addClass("displayNone")
        disableRemainingItems()
        return winner
    }

    if (total === 9 && !blueWins && !redWins) {
        // draw
        winner = draw;

        // show result
        $("#gameResult, #congratsOrSorry").removeClass("displayNone");
        $("#gameResult").html(`<span class="redBig">Game is a draw.</span>`);
        $("#congratsOrSorry").html(`<span class="redBig">Game ended in a draw.</span>`)
        $("#gameInfo").addClass("displayNone");

        disableRemainingItems();
        return winner;
    } else {
        // game is still on
        console.log("game on");
    }
}

function disableRemainingItems() {
    var notBlueOrRed = document.querySelectorAll("div.item:not(.blue):not(.red)");
    $(notBlueOrRed).addClass("gray");
    $(notBlueOrRed).html("¯\\_(ツ)_/¯");
    $(notBlueOrRed).addClass("unclickable")
    return
}

function checkWhoseTurn() {
    // count number of blue and red cells
    // if more blue cells then its computer's turn

    var blueCount = getBlueCount();
    var redCount = getRedCount();

    if (blueCount > redCount) {
        // play computer turn
        // make all grid cells unclickable
        // so that player/user does not click until computer is done
        var allItems = document.querySelectorAll("div.item")
        $(allItems).addClass("unclickable");
        $("#yourTurn").removeClass('yellow blackText');
        $("#compTurn").addClass('yellow blackText');

        setTimeout(computerTakeTurn, 1000);
        return "computerTurn";
    } else {
        // playerOne's turn
        // remove "unclickable" class only for cells that are 
        // neither blue nor red
        var notBlueOrRed = document.querySelectorAll("div.item:not(.blue):not(.red)");

        // remove unclickable from only the non-red or non-blue ones
        // since we had added it during computer turn
        $(notBlueOrRed).removeClass("unclickable");
        $("#compTurn").removeClass("yellow blackText");
        $("#yourTurn").addClass("yellow blackText");
        return "playerOneTurn"; 
    }
}

function getComputer() {
    var playerOne = getPlayerOne()
    if (playerOne === "X") {
      var computer = "O"
    } else {
      var computer = "X"
    }
    return computer
}

function computerTakeTurn() {
    // get all cells that are not red nor blue
    var notBlueOrRed = document.querySelectorAll("div.item:not(.blue):not(.red)");

    // choose one random Item from the above cells
    var randomItem = notBlueOrRed[Math.floor(Math.random() * notBlueOrRed.length)];

    $(randomItem).addClass("red unclickable");

    var computerSymbol = getComputer();

    $(randomItem).html(computerSymbol);

    // continue with game
    playGame();
}

// play the game
function playGame() {
    // this is invoked when playerOne clicks on a grid cell
    // see if we have a winner
    var winner = checkForWinner();

    // if winner then reset the game
    if (winner) {
        setTimeout(reset, 3000); // call after 3 seconds
    }

    // if not winner then check whose turn it is to play
    if (!winner) {
        checkWhoseTurn();
    }
}

function hardResetOnclick() {
    $("#resetButton").on("click", function() {
        console.log("hardResetOnclick: resetting game...")
        $("#playerForm").removeClass("displayNone")
          //console.log("reset: removing displayNone from playerForm")
        // document.getElementById("playerForm").reset()
          //console.log("reset: resetting playerForm")
          //console.log("reset: replacing playerOne,gameResult,congratsOrSorry w/ empty")
        $("#playerOne, #gameResult, #congratsOrSorry").html("")
          //console.log("reset: adding class displayNone")
        $("#gameInfo, #gameGrid, #congratsOrSorry").addClass("displayNone")
          //console.log("reset: remove classes blue red gray unclickable")
        $(".item").removeClass("blue red gray unclickable")
        $(".item").html("X/O")
    })
}

hardResetOnclick()

function reset() {
    // start again
    $("#gameInfo").removeClass("displayNone");
    $("#gameResult, #congratsOrSorry").addClass("displayNone");
    $(".item").removeClass("blue red gray unclickable")
    $(".item").html("X/O")
}

playGame();
