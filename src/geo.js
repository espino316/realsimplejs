/*
::Geo.js::
This script manages GeoPosition
Dependencies
  Google maps api
  Dialog
  Local
*/

/*	Class for Geo Position */
/*
This contains the structure data
*/
RS.GeoPosition = function() {
  var dlg = new Dialog();
  var local = new RS.Local();

  this.Lat = 0;
  this.Lng = 0;
  this.LatLng = null;
  this.Geocode = [];
  this.StreetNumber = "";
  this.Route = "";
  this.SubLocality = "";
  this.City = "";
  this.State = "";
  this.Country = "";
  this.PostalCode = "";
  this.Address = "";
} // end class GeoPosition

RS.Geo = function() {
  var fn = null;
  this.onError = function(error) {
    dlg.showAlert("Hubo problemas obteniendo la posicion");
  };

  this.onSuccessGetPosition = function(position) {
    local.remove("currentGeoPosition");
    var geoPos = new RS.GeoPosition();

    geoPos.Lat = parseFloat(position.coords.latitude);
    geoPos.Lng = parseFloat(position.coords.longitude);
    geoPos.LatLng = new google.maps.LatLng(geoPos.Lat, geoPos.Lng);

    this.coder = new google.maps.Geocoder();
    this.coder.geocode(
      {
        latLng: geoPos.LatLng
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var arrAddress = results[0].address_components;
            var i = 0;
            for (i = 0; i < arrAddress.length; i++) {
              switch (arrAddress[i].types[0]) {
                case "street_number":
                  geoPos.StreetNumber = arrAddress[i].long_name;
                  break;
                case "route":
                  geoPos.Route = arrAddress[i].long_name;
                  break;
                case "sublocality_level_1":
                  geoPos.SubLocality = arrAddress[i].long_name;
                  break;
                case "locality":
                  geoPos.City = arrAddress[i].long_name;
                  break;
                case "administrative_area_level_1":
                  geoPos.State = arrAddress[i].long_name;
                  break;
                case "country":
                  geoPos.Country = arrAddress[i].long_name;
                  break;
                case "postal_code":
                  geoPos.PostalCode = arrAddress[i].long_name;
                  break;
              }
            }

            geoPos.Address = geoPos.Route +
              ", " +
              geoPos.StreetNumber +
              ", " +
              geoPos.SubLocality +
              ", " +
              geoPos.City +
              ", " +
              geoPos.State +
              ", " +
              geoPos.Country;

            local.set("currentGeoPosition", JSON.stringify(geoPos));

            fn(geoPos);
          } else {
            dlg.showAlert("No results found", "Error", "Ok");
          }
        } else {
          dlg.showAlert("Geocoder failed due to: " + status, "Error", "Ok");
        }
      }
    );
  };

  this.getPositionAddress = function(callBack) {
    fn = callBack;
    //var options = { maximumAge: 0, timeout: 10000, enableHighAccuracy:true };
    navigator.geolocation.getCurrentPosition(
      this.onSuccessGetPosition,
      this.onError
    );
  };
} // end class Geo
