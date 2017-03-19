var csv = require("fast-csv");

function EventTracker(outputStream){
  this.outputStream = csv.createWriteStream({ headers: true });
  this.outputStream.pipe(outputStream);
  this.resetData();
};

EventTracker.prototype.trackEvent = function (event) {
  if (["verifytest", "create", "register"].indexOf(event.mode) !== -1){
    return;
  }
  if (this.isSameLoginEvent(event)) {
    this.resetData(event);
  }
  if (event.event === "start") {
    // console.log("here");
    this.startTime = new Date(event.time);
  }
  else if(this.startTime && event.event === "passwordSubmitted"){
    this.submitTime = new Date(event.time);
    this.timeToSubmit = (this.submitTime - this.startTime)/1000.0;
  }
  else if (this.startTime && ["success", "failure"].indexOf(event.event) !== -1) {
    this.endTime = new Date(event.time);
    this.totalLoginTime = (this.endTime - this.startTime)/1000.0;
    this.success = event.event === "success";
    // output login event
    if(this.user && this.startTime && this.endTime){
      this.outputData();
      // done with this event
      this.resetData();
    }
  }
}

EventTracker.prototype.isSameLoginEvent = function (event) {
  return this.site !== event.site || this.user !== event.user || this.isSamePasswordScheme(event);
}

EventTracker.prototype.isSamePasswordScheme = function (event) {
  return this.scheme.split(';')[1] !== event.scheme.split(';')[1];
}

EventTracker.prototype.outputData = function () {
  this.outputStream.write({
    "User": this.user,
    "Site": this.site,
    "Passowrd Scheme": this.scheme,
    "Mode": this.mode,
    "Start Time": this.startTime,
    "Submit Time": this.submitTime,
    "End Time": this.endTime,
    "Time to submit (s)": this.timeToSubmit,
    "Time to login (s)": this.totalLoginTime
  });
}

EventTracker.prototype.clearData = function () {
  this.startTime = this.endTime = this.mode = null;
}

EventTracker.prototype.resetData = function (event) {
  event = event || {};
  this.startTime = null;
  this.endTime = null;
  this.submitTime = null;
  this.totalLoginTime = null;
  this.timeToSubmit = null;
  this.success = null;
  this.site = event.site;
  this.scheme = event.scheme;
  this.mode = event.mode;
  this.user = event.user;
}

EventTracker.prototype.done = function () {
  this.outputStream.end();
}

module.exports = EventTracker;
