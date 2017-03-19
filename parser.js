var csv = require("fast-csv");
var fs = require("fs");
var EventTracker = require('./EventTracker');

// command line arguments csv from and too
var args = process.argv.slice(2);
if(args.length < 2){
  console.log("Missing arguements. Must be run with args: {Input CSV} {Output CSV}");
  process.exit(0);
}
var csvInputFile = args[0];
var csvOutputFile = args[1];

var readStream = fs.createReadStream(csvInputFile);
var writeStream = fs.createWriteStream(csvOutputFile);


var tracker = new EventTracker(writeStream);

var csvReadStream = csv({ headers: true })
  .on("data", function(data){
    tracker.trackEvent(data);
  })
  .on("end", function(){
    tracker.done();
    console.log("done");
  });
readStream.pipe(csvReadStream);
