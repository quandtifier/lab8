//

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