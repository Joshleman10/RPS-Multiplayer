$(document).ready(function () {
    //initializing firebase database
    var config = {
        apiKey: "AIzaSyC2Lb32mZ8QUfNaivxta6Haxxa_inudRkM",
        authDomain: "rps-multiplayer-5926f.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-5926f.firebaseio.com",
        projectId: "rps-multiplayer-5926f",
        storageBucket: "rps-multiplayer-5926f.appspot.com",
        messagingSenderId: "169539104669"
    };
    firebase.initializeApp(config);
    //creating variables

    var database = firebase.database();
    var playerOneWins = 0;
    var playerTwoWins = 0;
    var ties = 0;
    var playerOneSelect = "";
    var playerTwoSelect = "";
    var messageRef = database.ref("/message");
    var playerOneTurn = false;
    var playerTwoTurn = false;

    function resetStuff() {

        //resetting players turns
        playerOneTurn = false;
        playerTwoTurn = false;
        //giving back button functionality
        $(".p1buttons").removeAttr("disabled");
        $(".p2buttons").removeAttr("disabled");
        //emptying player's choices for the next round
        $("#playeronechoice").empty();
        $("#playertwochoice").empty();
    }
    //determining player 1 selections
    $(".p1buttons").on("click", function () {
        //clearing the results from the previous round
        $("#results").empty();

        playerOneSelect = $(this).val();
        //determining that player 1 took their turn
        playerOneTurn = true;
        console.log(playerOneTurn);
        //send selection to the database
        database.ref().set({
            playerOneSelect: playerOneSelect
        })
        console.log(playerOneSelect);
        //disabling the buttons after 1 click
        $(".p1buttons").attr("disabled", true);
        seeWhoWon();
    })

    //determining player 2 selection
    $(".p2buttons").on("click", function () {
        playerTwoSelect = $(this).val();
        //determining that player 2 took their turn
        playerTwoTurn = true;
        console.log(playerTwoTurn);
        //send selection to the database
        database.ref().set({
            playerTwoSelect: playerTwoSelect
        })
        console.log(playerTwoSelect);
        //disabling the buttons after 1 click
        $(".p2buttons").attr("disabled", true);
        seeWhoWon();
    })

    function seeWhoWon() {
        if (playerOneTurn === true && playerTwoTurn === true) {
            whoWon();
        }
    }

    //determining who won
    function whoWon() {
        if ((playerOneSelect === "rock" && playerTwoSelect === "scissors") ||
            (playerOneSelect === "scissors" && playerTwoSelect === "paper") ||
            (playerOneSelect === "paper" && playerTwoSelect === "rock")) {
            playerOneWins++;
            $("#playeronescore").html("Player 1 Wins: " + playerOneWins);
            $("#results").html("Player 1 Wins!")
        }
        else if (playerOneSelect === playerTwoSelect) {
            ties++;
            $("#ties").html("Ties: " + ties);
            $("#results").html("It's a tie!");
        }
        else {
            playerTwoWins++;
            $("#playertwoscore").html("Player 2 Wins: " + playerTwoWins);
            $("#results").html("Player 2 Wins!")
        }

        //appending DOM with player choices
        $("#playeronechoice").text("Player 1 Selected: " + playerOneSelect);
        $("#playertwochoice").text("Player 2 Selected: " + playerTwoSelect);

        //resetting from the previous round
        resetStuff();
    }

    //chat functionality
    function chat() {
        $('#messageInput').keypress(function (e) {
            if (e.keyCode == 13) {
                var name = $('#nameInput').val();
                var text = $('#messageInput').val();
                messageRef.push({ name: name, text: text });
                $('#messageInput').val();
            }
        });

        messageRef.on('child_added', function (snapshot) {
            var message = snapshot.val();
            console.log(message);
            document.getElementById('messageDiv').innerHTML += message.name + '--' + message.text + '<br/>';
            //attemting to limit the amount of messages...will continue work on this 
            if ($("#messageDiv").length === 10) {
                document.body.removeChild(messageDiv);
            }
        });
    }
    chat();
});