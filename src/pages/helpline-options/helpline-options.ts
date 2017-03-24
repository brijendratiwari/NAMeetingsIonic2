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
                // $('#cg_usa_states').append('<div  data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="arrow-r" data-iconpos="right" data-theme="a" data-disabled="false" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-right ui-btn-up-a" aria-disabled="false"><span class="ui-btn-inner"><span class="ui-btn-text">[USA] ' + row['statename'] + '</span><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></span><input onClick="helplineOptions(this);" type="button" value="[USA] ' + row['statename'] + '" data-iconpos="right" data-icon="arrow-r" class="btnUSAState ui-btn-hidden" data-disabled="false"></div>');
              }
            }
          }, error => {
            console.error(error);
          });

          // Fill in Canadian Provinces
          this.sqliteData.getStateNameOfUSAFromHelplines().then(result => {
            console.log("Canada Helplines "+JSON.stringify(result));
            var ds = result['rows'];
            if (ds.length > 0) {
              for (var i = 0; i < ds.length; i++) {
                var row = ds.item(i);
                // $('#cg_usa_states').append('<div id="test" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="arrow-r" data-iconpos="right" data-theme="a" data-disabled="false" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-right ui-btn-up-a" aria-disabled="false"><span class="ui-btn-inner"><span class="ui-btn-text">[Canada] ' + row['statename'] + '</span><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></span><input onClick="helplineOptions(this);" type="button" value="[Canada] ' + row['statename'] + '" data-iconpos="right" data-icon="arrow-r" class="btnUSAState ui-btn-hidden" data-disabled="false"></div>');
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
                // $('#cg_countries').append('<div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="arrow-r" data-iconpos="right" data-theme="a" data-disabled="false" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-right ui-btn-up-a" aria-disabled="false"><span class="ui-btn-inner"><span class="ui-btn-text">' + row['countryname'] + '</span><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></span><input onClick="helplineOptionsCountry(this);" type="button" value="' + row['countryname'] + '" data-iconpos="right" data-icon="arrow-r" class="btnCountry ui-btn-hidden" data-disabled="false"></div>');
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
  }
