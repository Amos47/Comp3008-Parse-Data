var csv = require("fast-csv");

function isBlankPassTilesScheme(scheme){
  return ["blankPassTiles;Blank", "testpasstiles;BlankP", "unknown;BlankPassTil"].indexOf(scheme) !== -1;
}
function isImageScheme(scheme){
  return ["imagePassTiles;Image", "testpasstiles;ImageP", "unknown;ImagePasstil"].indexOf(scheme) !== -1;
}
function isTextScheme(scheme){
  return ["textrandom;az-6", "unknown;az-6"].indexOf(scheme) !== -1;
}

function EventTracker(outputStream){
  this.outputStream = csv.createWriteStream({ headers: true });
  this.outputStream.pipe(outputStream);
  this.resetData();
};

EventTracker.prototype.trackEvent = function (event) {
  if (["verifytest", "create", "register" ,"reset"].indexOf(event.mode) !== -1){
    return;
  }
  if (!this.isSameLoginEvent(event)) {
    this.resetData(event);
  }
  if (event.event === "start") {
    // console.log("here");
    // console.log("start");
    this.startTime = new Date(event.time);
  }
  else if(this.startTime && this.isPasswordSubmitEvent(event)){
    // console.log("submitted");
    this.submitTime = new Date(event.time);
    this.timeToSubmit = (this.submitTime - this.startTime)/1000.0;
  }
  else if (this.startTime && (this.isSuccessLogin(event) || this.isFailedLogin(event))) {
    // console.log("done");
    this.endTime = new Date(event.time);
    this.totalLoginTime = (this.endTime - this.startTime)/1000.0;
    this.success = this.isSuccessLogin(event);
    // output login event
    if(this.user && this.startTime && this.endTime){
      this.outputData();
      // done with this event
      this.resetData();
    }
  }
}

EventTracker.prototype.isSameLoginEvent = function (event) {
  return this.site === event.site && this.user === event.user && this.isSamePasswordScheme(event);
}

EventTracker.prototype.isSamePasswordScheme = function (event) {
  return (isBlankPassTilesScheme(this.scheme) && isBlankPassTilesScheme(event.scheme)) ||
    (isImageScheme(this.scheme) && isImageScheme(event.scheme)) ||
    (isTextScheme(this.scheme) && isTextScheme(event.scheme))
}

EventTracker.prototype.isSuccessLogin = function(event){
  return ["success", "goodLogin"].indexOf(event.event) !== -1;
}

EventTracker.prototype.isFailedLogin = function (event) {
  return ["failure", "badLogin"].indexOf(event.event) !== -1;
}

EventTracker.prototype.outputData = function () {
  var out = {
    "User": this.user,
    "Site": this.site,
    "Password Scheme": this.scheme,
    "Mode": this.mode,
    "Success": this.success,
    "Start Time": this.startTime,
    "Submit Time": this.submitTime,
    "End Time": this.endTime,
    "Time to submit (s)": this.timeToSubmit,
    "Time to login (s)": this.totalLoginTime
  };
  this.outputStream.write(out);
}

EventTracker.prototype.clearData = function () {
  this.startTime = this.endTime = this.mode = null;
}

EventTracker.prototype.isPasswordSubmitEvent = function (event) {
  return ["order inputPwd", "passwordSubmitted"].indexOf(event.event) !== -1;
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
