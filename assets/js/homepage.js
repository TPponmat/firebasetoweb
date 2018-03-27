//current energy consumption update picture
var img_grid = 0;
var img_solar = 0 ;
var img_ev = 0;
var G = 0;
var S = 0;
var E = 0;
var Emer_status = 0;
//Mode update picture
var M = 0;
var img_mode = 0;
//weather update picture
var W = 0;
var img_weather = 0;
var MODE = 'COMFORT'; //'COMFORT'
var MODE_baht = 50; //50
var MODE_status = 'estimated cost'; //'estimated cost'
var MODE_unit ='฿/hr'; //'฿/hr'
var MODE_pic = "COMFORT"; //"COMFORT"

var grid_activePower = 0;
var solar_activePower = 0;
var load_activePower = 0;
var cumulative = {};
var predictpv = {};
var realpv = {};

function update_member(MODE_status) {
    $("#member").text(String(MODE_status));
}

$( document ).ready(function() {
    console.log("starting document!!!!");

    // Initialize Firebase
    console.log("Initialize Firebase");
    var config = {
        apiKey: "AIzaSyBLn70sg-p9fzsDxRWy59xMxPYe6Ll-ge4",
        authDomain: "peapythontraining.firebaseapp.com",
        databaseURL: "https://peapythontraining.firebaseio.com",
        projectId: "peapythontraining",
        storageBucket: "peapythontraining.appspot.com",
        messagingSenderId: "379229483000"
    };
    firebase.initializeApp(config);

    // const rootRef = firebase.database().ref('/hiveac7ba18fe1c0/');
    // var daily_gridimportbillRef = rootRef.child('5PMCP250883398').child('grid_activePower');
    //
    // console.log(daily_gridimportbillRef);

    var ref = firebase.database().ref();
    var x;

    ref.on("value", function(snapshot) {
        console.log(snapshot.val().test);
        x = snapshot.val().test;
    }, function (error) {
        console.log("Error: " + error.code);
    });

    total_load_activePower = 0;
    grid_activePower = 0;
    solar_activePower = 0;
    battery_activePower = 0;
    battery_percentage = 0;
    building1_activePower = 0;
    building2_activePower = 0;

    var homeRef = firebase.database().ref("test");

    homeRef.on("child_changed", function(data) {
        console.log(data.key);
        console.log(data.val());
        if(data.key == "1PV221445K1200100") {
            total_load_activePower  = data.val().load_activePower;
            grid_activePower = data.val().grid_activePower;
            solar_activePower = data.val().inverter_activePower;
            battery_activePower = data.val().battery_activePower;
            battery_percentage = data.val().battery_percentage;
            update_LOAD_kw(parseInt(total_load_activePower));
            update_GRID_kw(parseInt(grid_activePower));
            update_SOLAR_kw(parseInt(solar_activePower));
            update_BATTERY_kw(parseInt(battery_activePower));
            update_BATTERY_percentage(parseInt(battery_percentage));
            img_grid = parseInt(grid_activePower);
            img_solar = parseInt(solar_activePower);
            update_ENERGY_pic(img_grid, img_solar, img_ev);

        } else if (data.key == '5PMCP124930529') {
            building1_activePower = data.val().grid_activePower;
        } else if (data.key == '5PMCP270121594') {
            building2_activePower = data.val().grid_activePower;

        } else if (data.key == 'node1') {
            update_member(parseInt(data.val()));
        } else {
            console.log("need to parse this key " + data.key)
        }
    });

    //charts-grid
    $(window).load(function(){
        $('.charts-grid').on('show.bs.modal', function (event) {
            setTimeout(function(){
                Highcharts.chart('area-grid', {
                    chart: {
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function () {
                                // set up the updating of the chart each second
                                var series = this.series[0],
                                    series2 = this.series[1],
                                    series3 = this.series[2];
                                series4 = this.series[3];
                                series5 = this.series[4];
                                series6 = this.series[5];
                                setInterval(function () {
                                    var d = new Date();
                                    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                                    var x = (new Date(utc + (3600000*0))).getTime(); // current time
                                    series.addPoint([x, total_load_activePower], true, true);
                                    series2.addPoint([x, grid_activePower], true, true);
                                    series3.addPoint([x, solar_activePower], true, true);
                                    series4.addPoint([x, battery_activePower], true, true);
                                    series5.addPoint([x, building1_activePower], true, true);
                                    series6.addPoint([x, building2_activePower], true, true);
                                }, 1000);
                            }
                        }
                    },
                    title: {
                        text: 'Current Power Generation and Consumption',
                        x: -20 //center
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },
                    yAxis: {
                        title: {
                            text: 'Real Power (W)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        //enabled: false
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderwidth: 0
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'Total Load',
                        data: (function () {
                            // generate an array of random data
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -120; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }, {
                        name: 'Grid',
                        data: (function () {
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -120; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }, {
                        name: 'Solar',
                        data: (function () {
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -120; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    },
                        {
                            name: 'Battery',
                            data: (function () {
                                var d = new Date();
                                var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                                var data = [],
                                    time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                    i;
                                //TODO get data from database for Grid data
                                for (i = -120; i <= 0; i += 1) {
                                    data.push({
                                        x: time + i * 1,
                                        y: 0
                                    });
                                }
                                return data;
                            }())
                        },
                        {
                            name: 'Load Admin Building',
                            data: (function () {
                                var d = new Date();
                                var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                                var data = [],
                                    time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                    i;
                                //TODO get data from database for Grid data
                                for (i = -120; i <= 0; i += 1) {
                                    data.push({
                                        x: time + i * 1,
                                        y: 0
                                    });
                                }
                                return data;
                            }())
                        },
                        {
                            name: 'Load Science Building',
                            data: (function () {
                                var d = new Date();
                                var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                                var data = [],
                                    time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                    i;
                                //TODO get data from database for Grid data
                                for (i = -120; i <= 0; i += 1) {
                                    data.push({
                                        x: time + i * 1,
                                        y: 0
                                    });
                                }
                                return data;
                            }())
                        },
                    ]
                });
                // Smooth Loading
                $('.js-loading').addClass('hidden');
            },1000);
        });
    });

    //charts-solar
    $(window).load(function(){
        $('.charts-solar').on('show.bs.modal', function (event) {
            setTimeout(function(){
                Highcharts.chart('area-solar', {
                    chart: {
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function () {
                                // set up the updating of the chart each second
                                var series = this.series[0],
                                    series2 = this.series[1],
                                    series3 = this.series[2];
                                setInterval(function () {
                                    var d = new Date();
                                    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                                    var x = (new Date(utc + (3600000*0))).getTime(); // current time
                                    series.addPoint([x, load_activePower], true, true);
                                    series2.addPoint([x, grid_activePower], true, true);
                                    series3.addPoint([x, solar_activePower], true, true);
                                }, 1000);
                            }
                        }
                    },
                    title: {
                        text: 'Current Power Generation and Consumption',
                        x: -20 //center
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },
                    yAxis: {
                        title: {
                            text: 'Real Power (W)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        //enabled: false
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderwidth: 0
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'Load',
                        data: (function () {
                            // generate an array of random data
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -60; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }, {
                        name: 'Grid',
                        data: (function () {
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -60; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }, {
                        name: 'Solar',
                        data: (function () {
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -60; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }]
                });
                // Smooth Loading
                $('.js-loading').addClass('hidden');
            },1000);
        });
    });

    //charts-load
    $(window).load(function(){
        $('.charts-load').on('show.bs.modal', function (event) {
            setTimeout(function(){
                Highcharts.chart('area-load', {
                    chart: {
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function () {
                                // set up the updating of the chart each second
                                var series = this.series[0],
                                    series2 = this.series[1],
                                    series3 = this.series[2];
                                setInterval(function () {
                                    var d = new Date();
                                    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                                    var x = (new Date(utc + (3600000*0))).getTime(); // current time
                                    series.addPoint([x, load_activePower], true, true);
                                    series2.addPoint([x, grid_activePower], true, true);
                                    series3.addPoint([x, solar_activePower], true, true);
                                }, 1000);
                            }
                        }
                    },
                    title: {
                        text: 'Current Power Generation and Consumption',
                        x: -20 //center
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },
                    yAxis: {
                        title: {
                            text: 'Real Power (W)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        //enabled: false
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderwidth: 0
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'Load',
                        data: (function () {
                            // generate an array of random data
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -60; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }, {
                        name: 'Grid',
                        data: (function () {
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -60; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }, {
                        name: 'Solar',
                        data: (function () {
                            var d = new Date();
                            var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
                            var data = [],
                                time = (new Date(utc + (3600000*0))).getTime(), // current time,
                                i;
                            //TODO get data from database for Grid data
                            for (i = -60; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }]
                });
                // Smooth Loading
                $('.js-loading').addClass('hidden');
            },1000);
        });
    });

    //charts-battery

    //charts-annual
    $(window).load(function(){
        $('.charts-annual').on('show.bs.modal', function (event) {
            setTimeout(function(){
                var seriesOptions = [],
                    seriesCounter = 0,
                    names = ['consumption', 'generation'];

                /**
                 * Create the chart when all data is loaded
                 * @returns {undefined}
                 */
                function createChart() {
                    Highcharts.stockChart('charts-annual', {

                        rangeSelector: {
                            selected: 4
                        },

                        yAxis: {
                            labels: {
                                formatter: function () {
                                    return this.value;
                                }
                            },
                            plotLines: [{
                                value: 0,
                                width: 2,
                                color: 'silver'
                            }]
                        },

                        plotOptions: {
                            series: {
                                //compare: 'percent',
                                showInNavigator: true
                            }
                        },

                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                            valueDecimals: 2,
                            split: true
                        },

                        series: seriesOptions
                    });
                }


                $.each(names, function (i, name) {

                    if (name == 'consumption') {
                        var data = cumulative['consumption'];
                    } else if (name == 'generation') {
                        var data = cumulative['generation'];
                    }

                    seriesOptions[i] = {
                        name: name,
                        data: data
                    };

                    // As we're loading the data asynchronously, we don't know what order it will arrive. So
                    // we keep a counter and create the chart when all the data is loaded.
                    seriesCounter += 1;

                    if (seriesCounter === names.length) {
                        createChart();
                    }

                });
                // Smooth Loading
                $('.js-loading').addClass('hidden');
            },1000);
        });
    });

    $(window).load(function(){
        $('.charts-annualpv').on('show.bs.modal', function (event) {
            setTimeout(function(){
                var seriesOptions2 = [],
                    seriesCounter = 0,
                    names = ['dc_predict', 'realpv'];

                /**
                 * Create the chart when all data is loaded
                 * @returns {undefined}
                 */
                function createChart() {

                    Highcharts.chart('charts-annualpv', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'PV Estimate & PV Generation'
                        },
                        subtitle: {
                            text: 'Source: <a href="http://thebulletin.metapress.com/content/c4120650912x74k7/fulltext.pdf">' +
                            'http://pvwatts.nrel.gov</a>'
                        },
                        xAxis: {
                            allowDecimals: false,
                            type: 'datetime',
                            title: {
                                text: 'Time'
                            },
                        },
                        yAxis: {
                            title: {
                                text: 'Power(W)'
                            },
                            labels: {
                                formatter: function () {
                                    return this.value / 1000 + 'k';
                                }
                            }
                        },
                        tooltip: {
                            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
                        },
                        plotOptions: {
                            area: {
                                pointStart: 1940,
                                marker: {
                                    enabled: false,
                                    symbol: 'circle',
                                    radius: 2,
                                    states: {
                                        hover: {
                                            enabled: true
                                        }
                                    }
                                }
                            }
                        },
                        series: seriesOptions2
                    });
                }

                $.each(names, function (i, name) {

                    if (name == 'dc_predict') {
                        var data = predictpv['dc_predict'];

                    }




                    else if (name == 'realpv') {
                        var data = predictpv['realpv'];
                    }
                    seriesOptions2[i] = {
                        name: name,
                        data: data
                    };

                    // As we're loading the data asynchronously, we don't know what order it will arrive. So
                    // we keep a counter and create the chart when all the data is loaded.
                    seriesCounter += 1;

                    if (seriesCounter === names.length) {
                        createChart();
                    }

                });
                // Smooth Loading
                $('.js-loading').addClass('hidden');
            },1000);
        });
    });

    //var nick_re = /^[A-Za-z0-9_ ]*[A-Za-z0-9 ][A-Za-z0-9_ ]{5,10}$/;
    var nick_re = /^[A-Za-z0-9_]{6,15}$/;

    $('body').on('click',"button[id^='hplus-']", function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get its current value
        var zone_id = this.id;
        zone_id = zone_id.split("-");
        zone_id = zone_id[1];
        var currentVal = parseFloat($("#heat_sp-"+zone_id).text());
        // If is not undefined
        if (!isNaN(currentVal) && currentVal < 95) {
            // Increment
            $("#heat_sp-"+zone_id).text(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $("#heat_sp-"+zone_id).text(95);
        }
    });

    // This button will decrement the heat value till 0
    $('body').on('click',"button[id^='hminus-']", function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get its current value
        var zone_id = this.id;
        zone_id = zone_id.split("-");
        zone_id = zone_id[1];
        var currentVal = parseFloat($("#heat_sp-"+zone_id).text());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 35) {
            // Decrement one
            $("#heat_sp-"+zone_id).text(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $("#heat_sp-"+zone_id).text(35);
        }
    });

    $('body').on('click',"button[id^='cplus-']", function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get its current value
        var zone_id = this.id;
        zone_id = zone_id.split("-");
        zone_id = zone_id[1];
        var currentVal = parseFloat($("#cool_sp-"+zone_id).text());
        // If is not undefined
        if (!isNaN(currentVal) && currentVal < 95) {
            // Increment
            $("#cool_sp-"+zone_id).text(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $("#cool_sp-"+zone_id).text(95);
        }
    });

    // This button will decrement the heat value till 0
    $('body').on('click',"button[id^='cminus-']", function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get its current value
        var zone_id = this.id;
        zone_id = zone_id.split("-");
        zone_id = zone_id[1];
        var currentVal = parseFloat($("#cool_sp-"+zone_id).text());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 35) {
            // Decrement one
            $("#cool_sp-"+zone_id).text(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $("#cool_sp-"+zone_id).text(35);
        }
    });

    $("#add_new_zone_submit").click(function (evt) {
        evt.preventDefault();
        values = $("#add_new_zone").val();
        if (!nick_re.test(values)) {
            document.getElementById("newzoneerror").innerHTML = "Nickname can only contain letters and numbers and a space. Please try again.";
            document.getElementById(values).value = "";
        } else {
            $.ajax({
                url: '/add_new_zone/',
                type: 'POST',
                data: values,
                success: function (data) {
                    if (data == "invalid") {
                        document.getElementById("newzoneerror").innerHTML = "Your nickname was not accepted by BEMOSS. Please try again.";
                    } else {
                        location.reload();
                        $('.bottom-right').notify({
                            message: { text: 'A new zone was added.' },
                            type: 'blackgloss',
                            fadeOut: { enabled: true, delay: 5000 }
                        }).show();
                    }
                },
                error: function (data) {
                    $('.bottom-right').notify({
                        message: { text: 'Oh snap! Try submitting again. ' },
                        type: 'blackgloss',
                        fadeOut: { enabled: true, delay: 5000 }
                    }).show();
                }
            });
        }
    });

    $(".save_changes_zn").click(function (evt) {
        evt.preventDefault();
        values = this.id.split('-');
        zone_id = values[1];
        values = values[1] + "_znickname";
        var value_er = values;
        znickname = $("#" + values).val();
        var error_id = "zonenickname_" + zone_id;
        if (!nick_re.test(znickname)) {
            document.getElementById(error_id).innerHTML = "Nickname error. Please try again.";
            document.getElementById(values).value = "";
        } else {
            values = {
                "id": zone_id,
                "nickname": znickname
            };
            var jsonText = JSON.stringify(values);
            $.ajax({
                url: '/save_zone_nickname_change/',
                type: 'POST',
                data: jsonText,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (data) {
                    if (data == "invalid") {
                        document.getElementById(error_id).innerHTML = "Nickname error. Please try again.";
                        document.getElementById(value_er).value = "";
                    } else {
                        //$('#zoned_device_listing').load(' #zoned_device_listing'/*, function(){$(this).children().unwrap()}*/);
                        //$('#zoned_device_listing').html(data);
                        req_value_modal = data.zone_id + "_znick";
                        var newtest = document.getElementById(req_value_modal);
                        newtest.innerHTML = znickname.charAt(0).toUpperCase() + znickname.slice(1);
                        $('.bottom-right').notify({
                            message: { text: 'Heads up! The zone nickname change was successful.' },
                            type: 'blackgloss',
                            fadeOut: { enabled: true, delay: 5000 }
                        }).show();
                        // $("#" + req_val_stats).dialog("close");
                        // window.opener.location.reload(true);
                    }

                },
                error: function (data) {
                    $('.bottom-right').notify({
                        message: { text: 'Oh snap! Try submitting again. ' },
                        type: 'blackgloss',
                        fadeOut: { enabled: true, delay: 5000 }
                    }).show();
                }
            });
        }
    });

    $('body').on('click',"button[id^='gs-']", function (e) {
        e.preventDefault();
        var zone_id = this.id;
        zone_id = zone_id.split("-");
        zone_id = zone_id[1];
        var heat_setpoint = "heat_sp-" + zone_id;
        var cool_setpoint = "cool_sp-" + zone_id;
        var illumination = "illumination-" +  zone_id;
        heat_setpoint = $("#"+heat_setpoint).text();
        cool_setpoint = $("#"+cool_setpoint).text();
        illumination = $("#"+illumination).text();

        var values = {
            "zone_id": zone_id,
            "heat_setpoint": heat_setpoint,
            "cool_setpoint": cool_setpoint,
            "illumination": illumination
        };
        var jsonText = JSON.stringify(values);
        console.log(jsonText);
        $.ajax({
            url : '/change_global_settings/',
            type: 'POST',
            data: jsonText,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success : function(data) {
                //window.location.reload(true);
                $('.bottom-right').notify({
                    message: { text: 'Your changes were updated in the system.' },
                    type: 'blackgloss',
                    fadeOut: { enabled: true, delay: 5000 }
                }).show();
            },
            error: function(data) {
                $('.bottom-right').notify({
                    message: { text: 'The changes could not be updated at the moment. Try again later.' },
                    type: 'blackgloss',
                    fadeOut: { enabled: true, delay: 5000 }
                }).show();
            }
        });

    });

    $("#select_comfort_mode" ).click(function() {
        console.log("comfort mode selected");
        var values = {};
        values['event'] = 'comfort';
        values['status'] = 'enable';
        var jsonText = JSON.stringify(values);

        $.ajax({
            url : '/select_comfort_mode/',
            type: 'GET',
            // data: jsonText,
            // contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success : function(data) {
                //window.location.reload(true);
                console.log("select_comfort_mode success");
                update_MODE("COMFORT");
                document.getElementById("MODE_status").innerHTML = "estimated cost";
                update_MODE_baht(5.8*7);
                update_MODE_pic("COMFORT");
                MODE = "COMFORT";
                MODE_status = "estimated cost";
                MODE_baht = 5.8*7;
                MODE_unit = "฿/hr";
                MODE_pic = "COMFORT";
                // $('#MODE_pic').attr('src', '../static/images/Mode/comfort_mode.png');
                // img_mode = _message.home_mode;
                // console.log("Mode = "+ img_mode);

                // $('.bottom-right').notify({
                //     message: { text: 'Your changes were updated in the system.' },
                //     type: 'blackgloss',
                //  fadeOut: { enabled: true, delay: 5000 }
                //   }).show();
            },
            error: function(data) {
                console.error("select_comfort_mode error");
                // $('.bottom-right').notify({
                // 	    message: { text: 'The changes could not be updated at the moment. Try again later.' },
                // 	    type: 'blackgloss',
                //    fadeOut: { enabled: true, delay: 5000 }
                // 	}).show();
            }
        });
        var delay = 500;
        setTimeout(function() {
            $('#Comfort_Modal').modal('show');
        },delay);
    });

    $("#select_eco_mode" ).click(function() {
        console.log("eco mode selected");
        var values = {};
        values['event'] = 'eco';
        values['status'] = 'enable';
        var jsonText = JSON.stringify(values);
        $.ajax({
            url : '/select_eco_mode/',
            type: 'GET',
            // data: jsonText,
            // contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success : function(data) {
                console.log("select_eco_mode success");
                document.getElementById("MODE").innerHTML = "ECO";
                update_MODE("ECO");
                document.getElementById("MODE_status").innerHTML = "estimated cost";
                update_MODE_baht(5.8*4);
                update_MODE_pic("ECO");
                MODE = "ECO";
                MODE_status = "estimated cost";
                MODE_baht = 5.8*4;
                MODE_unit = "฿/hr";
                MODE_pic = "ECO";
                // window.location.reload(true);
                // $('.bottom-right').notify({
                //     message: { text: 'Your changes were updated in the system.' },
                //     type: 'blackgloss',
                //    fadeOut: { enabled: true, delay: 5000 }
                //   }).show();
            },
            error: function(data) {
                console.log("select_eco_mode error");
                // $('.bottom-right').notify({
                // 	    message: { text: 'The changes could not be updated at the moment. Try again later.' },
                // 	    type: 'blackgloss',
                //    fadeOut: { enabled: true, delay: 5000 }
                // 	}).show();
            }
        });
        var delay = 500;
        setTimeout(function() {
            $('#Eco_Modal').modal('show');
        },delay);
    });

    $("#agree_dr" ).click(function() {
        console.log("agree_dr selected");
        var values = {};
        values['event'] = 'dr';
        values['status'] = 'enable';
        var jsonText = JSON.stringify(values);
        $.ajax({
            url : '/agree_dr/',
            type: 'GET',
            // data: jsonText,
            // contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success : function(data) {
                //window.location.reload(true);
                console.log("DR mode success");
                document.getElementById("MODE").innerHTML = "DR";
                update_MODE("DR");
                document.getElementById("MODE_status").innerHTML = "rebate";
                update_MODE_baht(6);
                document.getElementById("MODE_unit").innerHTML = "฿/kWh";
                update_MODE_pic("DR");
                MODE = "DR";
                MODE_status = "rebate";
                MODE_baht = 6;
                MODE_unit = "฿/kWh";
                MODE_pic = "DR";

                $('.bottom-right').notify({
                    message: { text: 'Your changes were updated in the system.' },
                    type: 'blackgloss',
                    fadeOut: { enabled: true, delay: 5000 }
                }).show();
            },
            error: function(data) {
                $('.bottom-right').notify({
                    message: { text: 'The changes could not be updated at the moment. Try again later.' },
                    type: 'blackgloss',
                    fadeOut: { enabled: true, delay: 5000 }
                }).show();
            }
        });
        var delay = 500;
        setTimeout(function() {
            $('#Agree_DR').modal('show');
        },delay);
    });

    $("#disagree_dr" ).click(function() {
        console.log("disagree_dr selected");
        var values = {};
        values['event'] = 'dr';
        values['status'] = 'disable';
        var jsonText = JSON.stringify(values);
        $.ajax({
            url : '/disagree_dr/',
            type: 'GET',
            // data: jsonText,
            // contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success : function(data) {
                //window.location.reload(true);
                $('.bottom-right').notify({
                    message: { text: 'Your changes were updated in the system.' },
                    type: 'blackgloss',
                    fadeOut: { enabled: true, delay: 5000 }
                }).show();
            },
            error: function(data) {
                $('.bottom-right').notify({
                    message: { text: 'The changes could not be updated at the moment. Try again later.' },
                    type: 'blackgloss',
                    fadeOut: { enabled: true, delay: 5000 }
                }).show();
            }
        });
        var delay = 500;
        setTimeout(function() {
            $('#DisAgree_DR').modal('show');
        },delay);
    });

});