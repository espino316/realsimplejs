RS.DateHelper = function() {
  var self = this;

  self.timestamp = function() {
    return Math.floor(Date.now() / 1000); // end Math floor
  }; // end function timestamp

  self.getDateParts = function(date) {
    var dateObj = new Date();
    if (typeof date != "undefined") {
      dateObj = new Date(date);
    }

    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hour = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();
    var seconds = dateObj.getUTCSeconds();
    month = "00" + month;
    month = String(month).right(2);
    day = "00" + day;
    day = String(day).right(2);
    hour = "00" + hour;
    hour = String(hour).right(2);
    minutes = "00" + minutes;
    minutes = String(minutes).right(2);
    seconds = "00" + seconds;
    seconds = String(seconds).right(2);
    var newTime = hour + ":" + minutes + ":" + seconds;
    var newDate = year + "/" + month + "/" + day;

    var dateParts = {};
    dateParts.year = year;
    dateParts.month = month;
    dateParts.day = day;
    dateParts.hour = hour;
    dateParts.date = newDate;
    dateParts.minutes = minutes;
    dateParts.seconds = seconds;
    dateParts.time = newTime;
    return dateParts;
  };

  self.diff = function(date1, date2){
    var diff = date2 - date1;
    var seconds = parseFloat((diff / 1000).toFixed(2));
    var minutes = parseFloat((seconds / 60).toFixed(2));
    var hours = parseFloat((minutes / 60).toFixed(2));
    var days = parseFloat((hours / 24).toFixed(2));
    var months = parseFloat((days / 30.4167).toFixed(2));
    var years = parseFloat((months / 12).toFixed(2));
    return {
      second: seconds,
      minute: minutes,
      hour: hours,
      day: days,
      month: months,
      year: years
    }; // end object return
  } // end dateDiffPeriods

  self.now = function() {
    return new Date().getTime();
  };
} // end function DateHelper
