import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NearByPage } from '../near-by/near-by';
import { MapLocationsPage } from '../map-locations/map-locations';
import { MyFavoritesPage } from '../my-favorites/my-favorites';
import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';
import { Geolocation } from 'ionic-native';
declare var google: any;
/* 
  Generated class for the NAMeetingSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
    selector: 'page-na-meeting-search',
    templateUrl: 'na-meeting-search.html'
  })
  export class NAMeetingSearchPage {
    nearByPage = NearByPage;
    mapLocationsPage = MapLocationsPage;

    constructor(public navCtrl: NavController, public navParams: NavParams, private common:Common, public sqliteData:SqliteData) {}

    ionViewDidLoad() {
      console.log('ionViewDidLoad NAMeetingSearchPage');
    }

    openMapLocationsPage() {
      if(this.common.isNetworkAvailable) {
        this.navCtrl.push(MapLocationsPage, {'map-type':'multiple'});
      } else {
        this.common.presentAlert('Connection Error', 'A network connection is required to perform this action.');
      }
    }

    myFavoritesMeetings() {
      var ref = this;

      //Default lat lng
      var lat = 34.1331320;
      var lng = -118.2013100;

      Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 30000
      }).then((position) => {
        var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        lat = currentLocation.lat();
        lng = currentLocation.lng();
        ref.openFavoriteMeetings(lat, lng);
      },function(err) {
        ref.openFavoriteMeetings(lat, lng);
        this.latitude = lat;
        this.longitude = lng;
        alert('We were unable to determine your location, please turn on your GPS/Location services');
      });

    }
    openFavoriteMeetings(lat1, lon1) {
      this.sqliteData.showFavoriteMeetingsStep1(lat1, lon1).then(result => {
        var ds = result['rows'];
        if (ds.length == 0) {
          this.common.presentAlert('Information', 'You don\'t have any favorite meetings.');
        } else {
          this.navCtrl.push(MyFavoritesPage, {'lat':lat1, 'lng':lon1});
        }
      }, error => {
        this.common.presentAlert('Information', 'You don\'t have any favorite meetings.');
      });
    }
  }
