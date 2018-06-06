/**
 * 
#################
#SOLUTION SCRIPT
#################

# IoT Education in Research
# TCSS499 Research Group
# University of Washington, Tacoma
# Lab 8 Smart Dock Static web page using NodeJS


# Program Spec
# Connects with mysql dock_db then displays a selected tuple on a webpage 
# served by NodeJS on the RPi


# Program UI
# In  a web browser navigate to localhost:8080
# or from another device on the LAN you may use <your_pi_IP>:8080
# the html rendered will display the tuple selected from the query below
 */

var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs = require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "dock_admin",
  password: "tcss499",
  database: "dock_db"
});


// Select a row in the JOIN of water_level and meteor_data
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT *" +
           " FROM water_level, meteor_data" +
           " WHERE wl_id=met_id AND meteor_data.air_temp= (SELECT MAX(air_temp) FROM meteor_data)", 
    function (err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        RowDataPacket = result[i];
        console.log(RowDataPacket);
      }

    });


  //create a server object and send it data row from the db to render:
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<h1>Smart Dock Prototype</h1>" + "<h3>Date Time:</h3>  " + String(RowDataPacket.dtg)); //write a response to the client
    res.write("<br/><h3>Water Level: </h3>" + String(RowDataPacket.water_level) +
               " ft<br/><h3>Winspeed: </h3>" + String(RowDataPacket.windspeed) +
               " mph<br/><h3>Wind Direction: </h3>" + String(RowDataPacket.direction) +
               " degrees<br/><h3>Wind Gust: </h3>" + String(RowDataPacket.gust) +
               " mph<br/><h3>Air Temperature: </h3>" + String(RowDataPacket.air_temp) +
               " degrees F<br/><h3>Barometric Pressure: </h3>" + String(RowDataPacket.baro) + " mbar");
    res.end(); //end the response
 
  }).listen(8080); //the server object listens on port 8080

});