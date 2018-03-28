//current energy consumption update picture
function update_member_profit(status) {
    $("#member_profit").text(String(status));
}

function update_member_order(status,node) {
    $("#"+node).text(String(status));
}

function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture : imageUrl
    });
}


$( document ).ready(function() {
    console.log("starting document!!!!");

    // Initialize Firebase

    $(function ($) {
        $("#firebasebutton").click(function (evt) {
            console.log("firebasebutton was clicked")
            writeUserData("12", Math.floor(Math.random() * 11), Math.floor(Math.random() * 15), 'https://img00.deviantart.net/6204/i/2012/167/f/6/immage_with_poetry_0001_by_jhonjjaguar-d53p82x.jpg')

        })
    });




    console.log("Initialize Firebase");
    var config = {
        apiKey: "AIzaSyDbwz3Nhbc47UwxZoF9_2Sy3x1ouPmWmJE",
        authDomain: "updatetable-ce5d8.firebaseapp.com",
        databaseURL: "https://updatetable-ce5d8.firebaseio.com",
        projectId: "updatetable-ce5d8",
        storageBucket: "updatetable-ce5d8.appspot.com",
        messagingSenderId: "1073280316561"
    };
    firebase.initializeApp(config);

    // var ref = firebase.database().ref();
    //
    // ref.on("value", function(snapshot) {
    //     console.log(snapshot.val().test);
    //     x = snapshot.val().test;
    // }, function (error) {
    //     console.log("Error: " + error.code);
    // });

    total_load_activePower = 0;

    var member_profitRef = firebase.database().ref("member");

    //"child_changed" mean if change data

    member_profitRef.on("child_changed", function(data) {
        console.log(data.key);
        console.log(data.val());
        if(data.key == "member_profit") {
            update_member_profit(parseInt(data.val()));
            writeUserData("12", "teerapong", "teerapong.pon@gmail.com", 'https://img00.deviantart.net/6204/i/2012/167/f/6/immage_with_poetry_0001_by_jhonjjaguar-d53p82x.jpg')
        } else if (data.key == 'member_order') {
            update_member_order(parseInt(data.val()),'member_order');
            writeUserData("12", "teerapong", "teerapong.pon@gmail.com", 'https://img00.deviantart.net/6204/i/2012/167/f/6/immage_with_poetry_0001_by_jhonjjaguar-d53p82x.jpg')
        } else {
            console.log("need to parse this key " + data.key)
            writeUserData("12", "teerapong", "teerapong.pon@gmail.com", 'https://img00.deviantart.net/6204/i/2012/167/f/6/immage_with_poetry_0001_by_jhonjjaguar-d53p82x.jpg')
        }
    });

});