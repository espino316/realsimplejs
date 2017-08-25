define(
  [],
  function() {
    /** DateHelper **/
    function DateHelper() {
      this.timestamp = function() {
        return Math.floor(Date.now() / 1000); // end Math floor
      }; // end function timestamp

      this.getDateParts = function(date) {
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
    } // end function DateHelper

    return DateHelper;
  } // end function anonymous
); // end define
