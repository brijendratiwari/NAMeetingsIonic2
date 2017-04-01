import { Component } from '@angular/core';
import { NavController, NavParams , Platform} from 'ionic-angular';
import { MapLocationsPage } from '../map-locations/map-locations';

import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';
/*
  Generated class for the MeetingDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
    selector: 'page-meeting-details',
    templateUrl: 'meeting-details.html'
  })
  export class MeetingDetailsPage {

    meetingDetails = "";
    favoritesButtonTitle = "Add to Favorites";
    latitute;
    longitude;
    address;
    addToFavDetails;
    emailDetail;

    constructor(public pltform:Platform, public navCtrl: NavController, public navParams: NavParams, public common:Common, public sqliteData:SqliteData) {
      let mtg_id = navParams.get('mtg_id');
      let mtg_distance = navParams.get('mtg_distance');

      console.log("mtg_id "+mtg_id+ "and mtg_distance "+mtg_distance);

      this.showMeetingDetails(mtg_id, mtg_distance);

    } 

    ionViewDidLoad() {
      console.log('ionViewDidLoad MeetingDetailsPage');
    }

    showMeetingDetails(mtg_id, distance) {
      let ref = this;

      var dsFormats;
      this.sqliteData.getMeetingDetailsFromFormat().then((result) => {
        dsFormats = result['rows'];
        this.sqliteData.getMeetingData(mtg_id).then((result) => {
          var ds = result['rows'];

          if(ds.length > 0) {
            var row = ds.item(0);

            var lat2 = row['latitude'];
            var lon2 = row['longitude'];
            var address = row['address'];
            var city = row['city'];
            var state = row['state'];
            var zip = row['zip'];
            var country = row['country'];
            var borough = row['borough'];
            var mtgDay = row['mtg_day'];
            var mtgTime = row['mtg_time'];
            var comName = row['com_name'];
            var place = row['place'];
            var wchair = row['wchair'];
            var openClosed = row['closed'];
            var format1 = row['format1'];
            var format2 = row['format2'];
            var format3 = row['format3'];
            var format4 = row['format4'];
            var format5 = row['format5'];
            var lang1 = row['language'];
            var lang2 = row['lang2'];
            var lang3 = row['lang3'];
            var room = row['room'];
            var direction = row['directions'];
            var committee = row['committee'];

            var title = place.trim();

            if(title == ''){
              title = '<strong>' + address.trim() + '</strong><br />';
            } else {
              title = '<strong>' + title + '</strong><br />' + address.trim() + '<br />';
            }
            title = title + city + ', ' + state + ' ' + zip

            var dayTime = this.common.getDayofWeek(mtgDay) + ' ' + this.common.convertTo12hr(mtgTime);

            var closedView = 'Closed';
            if (openClosed == 0) {
              closedView = 'Open';
            }

            var distanceView = '<div class="row clearfix"><div class="fieldLabel">Distance: </div><div class="fieldValue">' + distance + '</div></div>';

            var boroughView = '';
            if (borough != "") {
              boroughView = '<div class="row clearfix"><div class="fieldLabel">Borough: </div><div class="fieldValue">' + borough + '</div></div>';
            }


            var roomView = '';
            if(room != "")
              roomView = '<div class="row clearfix"><div class="fieldLabel">Room: </div><div class="fieldValue">'+room+'</div></div>';
            var directionView = "";
            if(direction != "")
              directionView = '<div class="row clearfix"><div class="fieldLabel">Directions: </div><div class="fieldValue">'+direction+'</div></div>';

            var allFormats = "";
            var useNSIcon = true;
            // Flag to use the non-smoking icon
            // Get the long format names
            if (format1 != "") {
              if (format1 != "NS") {
                format1 = ref.getLongFormatName(dsFormats, format1);
                allFormats += format1;
              }
              if (format1 == "SMOK") {
                useNSIcon = false;
              }
            }

            if (format2 != "") {
              if (format2 != "NS") {
                format2 = ref.getLongFormatName(dsFormats, format2);
                if (allFormats.length > 0) {
                  allFormats += "<br />" + format2;
                }
                else {
                  allFormats += format2;
                }
              }
              if (format2 == "SMOK") {
                useNSIcon = false;
              }
            }

            if (format3 != "") {
              if (format3 != "NS") {
                format3 = ref.getLongFormatName(dsFormats, format3);
                if (allFormats.length > 0) {
                  allFormats += "<br />" + format3;
                } else {
                  allFormats += format3;
                }
              }
              if (format3 == "SMOK") {
                useNSIcon = false;
              }
            }

            if (format4 != "") {
              if (format4 != "NS") {
                format4 = ref.getLongFormatName(dsFormats, format4);
                if (allFormats.length > 0) {
                  allFormats += "<br />" + format4;
                } else {
                  allFormats += format4;
                }
              }
              if (format4 == "SMOK") {
                useNSIcon = false;
              }
            }

            if (format5 != "") {
              if (format5 != "NS") {
                format5 = ref.getLongFormatName(dsFormats, format5);

                if (allFormats.length > 0) {
                  allFormats += "<br />" + format5;
                } else {
                  allFormats += format5;
                }
              }
              if (format5 == "SMOK") {
                useNSIcon = false;
              }
            }

            var allLanguages = "";
            // Build a carriage return of languages
            if (lang1 != "") {
              allLanguages += lang1;
            }

            if (lang2 != "") {
              allLanguages += ", " + lang2;
            }

            if (lang3 != "") {
              allLanguages += ", " + lang3;
            }

            if (allLanguages != "") {
              allLanguages = '<div class="row clearfix"><div class="fieldLabel">Languages: </div><div class="fieldValue">' + allLanguages + '</div></div>'
            }

            if (allFormats == "") {
              allFormats = '<div class="row clearfix"><div class="fieldLabel">Format: </div><div class="fieldValue">No format indicated</div></div>'
            } else {
              allFormats = '<div class="row clearfix"><div class="fieldLabel">Format: </div><div class="fieldValue">' + allFormats + '</div></div>'
            }

            if(wchair == '1'){
              wchair = '<img src="./assets/Wheelchair.png" />';
            } else {
              wchair = '';
            }
            var no_smoking = '';
            if(useNSIcon){
              no_smoking = '<img src="./assets/NoSmoking.png" />';
            }

            ref.meetingDetails = "<div class='row clearfix'><div class='mtgInfo'>" + title + "</div></div>"+roomView+directionView+"<div class='row clearfix'><div class='mtgDayTime'>" + dayTime + "</div><div class='mtgClosed'>" + closedView + "</div><div class='mtgIcons'>" + no_smoking + wchair + "</div></div>" + distanceView + boroughView + allLanguages + allFormats;

            ref.sqliteData.showFavoriteMeetingDetails(lat2, lon2, mtgDay, mtgTime, comName).then(result => {
              var ds = result['rows'];
              if(ds.length > 0){
                ref.favoritesButtonTitle = "Remove from Favorites";
              } else {
                ref.favoritesButtonTitle = "Add to Favorites";
              }
            }, error => {
              console.error(error);
            });
            

            ref.address = encodeURI(address + ' ' + city + ' ' + state + ' ' + zip + ' ' + country);

            lat2 = lat2.trim();
            lon2 = lon2.trim();

            ref.latitute = lat2;
            ref.longitude = lon2;
            
            ref.emailDetail = {
              location:place,
              dayStartTime:ref.common.getDayofWeek(mtgDay) + ' at ' + ref.common.convertTo12hr(mtgTime),
              address:address + '\n' + city + ', ' + state + ' ' + zip,
              lat_lng:lat2+','+lon2
            };
            

            ref.addToFavDetails = {
              meetingId:mtg_id,
              committee:committee,
              mtgTime:mtgTime,
              mtgDay:mtgDay,
              comName:comName,
              latitute:lat2,
              longitude:lon2
            };

          }

        }, (error) => {
          console.error(error);
        });
}, (error) => {
  console.error(error);
});
}

getLongFormatName(ds, shortName){
  var result = '';
  
  if(ds.length > 0){
    for (var i = 0; i < ds.length; i++) {
      var row = ds.item(i);
      if(row['abbreviation'].trim() === shortName.trim()){
        result = row['meaning'];
        break;
      }
    }
  }
  
  return result;
}

addRemoveFav(){
  let addToFavDetails = this.addToFavDetails;
  if(this.favoritesButtonTitle == "Add to Favorites") {
    this.sqliteData.addFavoriteMeeting(addToFavDetails.meetingId, addToFavDetails.committee, addToFavDetails.mtgTime,addToFavDetails. mtgDay, addToFavDetails.comName, addToFavDetails.latitute, addToFavDetails.longitude).then(result => {
      if(result) {
        this.favoritesButtonTitle = "Remove from Favorites";
      }
    }, error => {
      console.error(error);
    });
  } else if(this.favoritesButtonTitle == "Remove from Favorites") {
    this.sqliteData.removeFavoriteMeeting(addToFavDetails.meetingId, addToFavDetails.latitute, addToFavDetails.longitude,addToFavDetails. mtgDay, addToFavDetails.mtgTime, addToFavDetails.comName).then(result => {
      if(result) {
        this.favoritesButtonTitle = "Add to Favorites";
      }
    }, error => {
      console.error(error);
    });
  }
}

showMap(){
  if(this.common.isNetworkAvailable) {
  this.navCtrl.push(MapLocationsPage, {'latitute':this.latitute, 'longitude':this.longitude, 'map-type':'single'});
  } else {
    this.common.presentAlert('Connection Error', 'A network connection is required to perform this action.');
  }
}

getDirections() {
  window.open('http://maps.google.com/maps?daddr=' + this.address + '&ie=UTF8&t=h&z=16', '_system', 'location=yes');
}

emailAFriend() {
  var mapURL ='http://maps.google.com/maps?daddr='+this.emailDetail.lat_lng+'&ie=UTF8&t=h&z=16';

  mapURL = encodeURI(mapURL);

  var body_line =  encodeURI("<br />");

  var msgBody = 'Meeting: ' + this.emailDetail.dayStartTime + body_line + body_line +'Where: ' + this.emailDetail.location + body_line + this.emailDetail.address + body_line + body_line + 'Google Map Directions: ' + mapURL;

  console.log("msgBody-- ",msgBody);

  if(this.pltform.is('android')){
    window.open('mailto:?subject=Meeting Directions&body=' + msgBody, '_system');
  }else{
    window.location.href= "mailto:?subject=Meeting Directions&body="+msgBody+"";
  }
}
}
