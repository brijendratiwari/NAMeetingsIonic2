import { Component } from '@angular/core';
import { NavController, NavParams , Platform } from 'ionic-angular';
import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';
import { HelplineDetailPage } from '../helpline-detail/helpline-detail';

/*
  Generated class for the HelplineOptions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
    selector: 'page-helpline-options',
    templateUrl: 'helpline-options.html'
  })
  export class HelplineOptionsPage {
    helplineDetailPage = HelplineDetailPage;
    helplinesSegOne='world';

    helplineDataUSACANADA = [];
    helplineDataCountry = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private sqliteData:SqliteData, public common:Common, public plt:Platform) {}

    ionViewDidLoad() {
      console.log('ionViewDidLoad HelplineOptionsPage');

      

      this.sqliteData.getHelplinesDetails().then(res => {
        console.log("Helpline Data"+JSON.stringify(res));

        let dataset = res['rows'];
        if(dataset.length > 0) {

          // Fill in USA States
          this.sqliteData.getStateNameOfUSAFromHelplines().then(result => {
            console.log("Usa Helplines "+JSON.stringify(result));
            var ds = result['rows'];
            if (ds.length > 0) {
              for (var i = 0; i < ds.length; i++) {
                var row = ds.item(i);
                this.helplineDataUSACANADA.push("[USA] "+row['statename']);
              }
            }
          }, error => {
            console.error(error);
          });

          // Fill in Canadian Provinces
          this.sqliteData.getStateNameOfCanadaFromHelplines().then(result => {
            console.log("Canada Helplines "+JSON.stringify(result));
            var ds = result['rows'];
            if (ds.length > 0) {
              for (var i = 0; i < ds.length; i++) {
                var row = ds.item(i);
                this.helplineDataUSACANADA.push("[Canada] "+row['statename']);               
              }
            }
          }, error => {
            console.error(error);
          });

          // Fill in Countries
          this.sqliteData.getCountryNameFromHelplines().then(result => {
            console.log("Country Helplines "+JSON.stringify(result));
            var ds = result['rows'];
            if (ds.length > 0) {
              for (var i = 0; i < ds.length; i++) {
                var row = ds.item(i);
                this.helplineDataCountry.push(row['countryname']);
              }
            }
          }, error => {
            console.error(error);
          });

        } else {
          this.common.presentAlert("Update", "Please update helplines data.");
        }
      }, error => {
        console.error(error);
      });
    }

    usaWorldChange() {

    }
    
    areaSearchCode() {

    }
  }
