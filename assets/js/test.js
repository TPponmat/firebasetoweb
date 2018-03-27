//current energy consumption update picture
function update_member_profit(status) {
    $("#member_profit").text(String(status));
}

function update_member_order(status,node) {
    $("#"+node).text(String(status));
}



$( document ).ready(function() {
    console.log("starting document!!!!");

    // Initialize Firebase
    console.log("Initialize Firebase");
    var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
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
        } else if (data.key == 'member_order') {
            update_member_order(parseInt(data.val()),'member_order');
        } else {
            console.log("need to parse this key " + data.key)
        }
    });

});