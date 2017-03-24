import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NearByPage } from '../near-by/near-by';
import { MapLocationsPage } from '../map-locations/map-locations';
import { MyFavoritesPage } from '../my-favorites/my-favorites';
import { Common } from '../../providers/common';

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
    myFavoritesPage = MyFavoritesPage;

    constructor(public navCtrl: NavController, public navParams: NavParams, private common:Common) {}

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
  }
