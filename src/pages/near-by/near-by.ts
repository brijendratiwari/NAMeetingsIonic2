import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MeetingDetailsPage } from '../meeting-details/meeting-details';
import { Geolocation,GoogleMap, GoogleMapsEvent, GoogleMapsMarker, GoogleMapsLatLng } from 'ionic-native';

import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';

declare var google: any;
/*
  Generated class for the NearBy page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
    selector: 'page-near-by',
    templateUrl: 'near-by.html'
  })
  export class NearByPage {
    meetingDetails = MeetingDetailsPage;
    currentLocation:any;
    ddlMiles:any ;
    ddlWeekdays:any ;
    ddlSortby:any ;

    NEAR_BY_LAT;
    NEAR_BY_LNG;

    isFilterHide = false;

    dataToDisplay = [];

    constructor(public sqliteData:SqliteData,public navCtrl: NavController, public navParams: NavParams, public common:Common) {
      this.ddlMiles = common.ddlMiles;
      this.ddlWeekdays = common.ddlWeekdays;
      this.ddlSortby = common.ddlSortby;
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad NearByPage');
      var meetingData = this.navParams.get('meetingData');
      this.isFilterHide = this.navParams.get('from_map_locations');

      if(meetingData) {
        this.dataToDisplay = meetingData;
      } else {
        this.getCurrentLocation();
      }
    }

    getCurrentLocation(){
      var ref = this;

      //Default lat lng
      var lat = 34.1331320;
      var lng = -118.2013100;

      Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 30000
      }).then((position) => {
        ref.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log("this is current location "+ref.currentLocation);
        lat = ref.currentLocation.lat();
        lng = ref.currentLocation.lng();
        ref.nearByMeetings(lat, lng);
      },function(err) {
        ref.nearByMeetings(lat, lng);
      });
    }

    nearByMeetings(lat, lng){
      this.dataToDisplay = [];

      this.NEAR_BY_LAT = lat;
      this.NEAR_BY_LNG = lng;

      let distanceRadius = this.ddlMiles;
      let dayNumber = this.ddlWeekdays;
      let sortBy = this.ddlSortby;

      var lt_arr = this.common.get_lat_lon(lat, lng, 90, distanceRadius);

      var lon_max = lt_arr[3];
      var lon_min = lt_arr[2];
      var lat_max = lt_arr[1];
      var lat_min = lt_arr[0];

      this.sqliteData.displayNearbyResults(lat_max, lat_min, lon_max, lon_min, dayNumber, sortBy).then((res)=>{

        var ds = res['rows'];
        if (ds.length > 0) {
          var arr;
          //if(device.platform == 'Android'){
            arr = this.dataArray(ds, lat, lng);
            //}

            for (var i = 0; i < arr.length; i++) {
              var distance = arr[i][0];
              if (distance <= distanceRadius) {
                distance = Math.round(distance * Math.pow(10, 1)) / Math.pow(10, 1);
                distance = distance + ' miles';

                var recordID = arr[i][1];
                var lat2 = arr[i][2];
                var lon2 = arr[i][3];
                var address = arr[i][4];
                var city = arr[i][5];
                var state = arr[i][6];
                var zip = arr[i][7];
                var country = arr[i][8];
                var borough = arr[i][9];
                var mtgDay = arr[i][10];
                var mtgTime = arr[i][11];
                var comName = arr[i][12];
                var place = arr[i][13];
                var wchair = arr[i][14];
                var openClosed = arr[i][15];
                var format1 = arr[i][16];
                var format2 = arr[i][17];
                var format3 = arr[i][18];
                var format4 = arr[i][19];
                var format5 = arr[i][20];

                var dayTime = this.common.getDayofWeek(mtgDay) + ' ' + this.common.convertTo12hr(mtgTime);
                var cityState = city + ', ' + state;
                if (wchair == '1') {
                  wchair = true;
                } else {
                  wchair = false;
                }
                var no_smoking = true;
                if (format1 == 'SMOK' || format2 == 'SMOK' || format3 == 'SMOK' || format4 == 'SMOK' || format5 == 'SMOK') {
                  no_smoking = false;
                }

                var title = place.trim();
                if (title == '') {
                  title = address.trim();
                }

                var openORclose = 'Closed';
                if (openClosed == 0) {
                  openORclose = 'Open';
                }


                var data = {
                  recordID:recordID,
                  distance:distance,
                  dayTime:dayTime,
                  openORclose:openORclose,
                  title:title,
                  cityState:cityState,
                  no_smoking:no_smoking,
                  wchair:wchair
                };
                this.dataToDisplay.push(data);
              }
            }
          } else {
            this.common.presentAlert("Sorry", "No meetings found.\nTry a different distance setting\n or different day of the week.");
          }

        },(err)=>{
          console.error(err);
        });
    }

    dataArray(ds, lat1, lon1) {
      var arr = new Array();
      for (var i = 0; i < ds.length; i++) {
        var row = ds.item(i);
        var temp = new Array();
        /*distance*/
        temp[0] = this.common.distancePoint(lat1, lon1, row['latitude'], row['longitude']);
        /*recordID*/
        temp[1] = row['id'];
        /*lat2*/
        temp[2] = row['latitude'];
        /*lon2*/
        temp[3] = row['longitude'];
        /*address*/
        temp[4] = row['address'];
        /*city*/
        temp[5] = row['city'];
        /*state*/
        temp[6] = row['state'];
        /*zip*/
        temp[7] = row['zip'];
        /*country*/
        temp[8] = row['country'];
        /*borough*/
        temp[9] = row['borough'];
        /*mtgDay*/
        temp[10] = row['mtg_day'];
        /*mtgTime*/
        temp[11] = row['mtg_time'];
        /*comName*/
        temp[12] = row['com_name'];
        /*place*/
        temp[13] = row['place'];
        /*wchair*/
        temp[14] = row['wchair'];
        /*openClosed*/
        temp[15] = row['closed'];
        /*format1*/
        temp[16] = row['format1'];
        /*format2*/
        temp[17] = row['format2'];
        /*format3*/
        temp[18] = row['format3'];
        /*format4*/
        temp[19] = row['format4'];
        /*format5*/
        temp[20] = row['format5'];

        arr[i] = temp;
      }

      if(this.ddlSortby == 'dist') {
        arr = this.common.sortData(arr);
      }
      return arr;
    }

    changeMiles(){
      this.common.ddlMiles = this.ddlMiles;

      console.log("this is miles"+this.ddlMiles);
      this.nearByMeetings(this.NEAR_BY_LAT, this.NEAR_BY_LNG)
    }

    changeWeek(){
      this.common.ddlWeekdays = this.ddlWeekdays;

      console.log("this is week"+this.ddlWeekdays);
      this.nearByMeetings(this.NEAR_BY_LAT, this.NEAR_BY_LNG)
    }

    sortBy(){
      this.common.ddlSortby = this.ddlSortby;
      
      console.log("this is sort"+this.ddlSortby);
      this.nearByMeetings(this.NEAR_BY_LAT, this.NEAR_BY_LNG)
    }
  }
