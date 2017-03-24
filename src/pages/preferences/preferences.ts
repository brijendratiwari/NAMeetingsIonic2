import { Component } from '@angular/core';
import { NavController, NavParams , AlertController } from 'ionic-angular';
import { DownloadFilePage } from '../download-file/download-file';
import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';
import { AppVersion } from 'ionic-native';

/*
  Generated class for the Preferences page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
    selector: 'page-preferences',
    templateUrl: 'preferences.html'
  })
  export class PreferencesPage {
    noOfDays = 30;

    lblNextDownloadReminder;
    appVersion;

    constructor(public navCtrl: NavController, public navParams: NavParams , public alertCtrl:AlertController, public sqliteData:SqliteData, public common:Common) {
      AppVersion.getVersionNumber().then(version => {
        this.appVersion = version;
      });
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad PreferencesPage');

      this.sqliteData.getPrefs().then(result => {
        var prefsDS = result['rows'];
        for (var i = 0, item = null; i < prefsDS.length; i++) {
          item = prefsDS.item(i);
          this.noOfDays = item['days_interval'];          
        }
      }, error => {
        console.error(error);
      });

      var ref = this;
      this.common.getNextDownloadDate(function(date) {
        ref.lblNextDownloadReminder = date;
      });
    }

    ionViewDidEnter() { 
      console.log('ionViewDidEnter PreferencesPage'); 
      var ref = this;
      this.common.getNextDownloadDate(function(date) {
        ref.lblNextDownloadReminder = date;
      });
    }

    //button onclick anction
    goToFileDownloadPage() {
      if(this.common.isNetworkAvailable) {
        this.navCtrl.push(DownloadFilePage);
      } else {
        this.common.presentAlert("Connection Error", "A network connection is required in order to update data.");
      } 
    }


    setNextDownloadDate(days) {
      this.noOfDays = days;
      this.lblNextDownloadReminder = this.common.setNextDownloadDate(days);
    }    

  }
