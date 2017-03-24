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
    
    helplinesSegOne :any;
    helplinesSegTwo :any;

    helplineDataUSACANADA = [];
    helplineDataCountry = [];

    areaCode;

    areaCodeErrorText = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, private sqliteData:SqliteData, public common:Common, public plt:Platform) {
      this.helplinesSegOne = common.helplinesSegOne;
      this.helplinesSegTwo = common.helplinesSegTwo;
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad HelplineOptionsPage');

      this.getHelplinesData();
    }

    getHelplinesData() {
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

    areaSearchCode() {

      var dataArr = [];

      if(!this.areaCode || this.areaCode == '') {
        this.areaCodeErrorText = "Please enter an area code.";
      } else {
        this.areaCodeErrorText = "";

        var headerRow = "";
        var noRecordFound = true;

        if (this.areaCode.length > 2) {
          this.areaCode.trim();

          this.sqliteData.getCountryDetails(this.areaCode).then(result => {
            var ds = result['rows'];
            if (ds.length > 0) {
              for (var i = 0; i < ds.length; i++) {
                var row = ds.item(i);

                var description = row['description'];


                var phone = row['phone'];
                phone = phone.trim();
                if (phone == '') {
                  phone = '---';
                } 

                var website = row['website'];
                website = website.trim();


                if (headerRow == '') {
                  headerRow = "(" + this.areaCode + ") - " + row['statename'] + "/" + row['countryname'];

                  let data = {
                    title:headerRow,
                    type:'option-title'
                  };
                  dataArr.push(data);
                }
                let data = {
                  description:description,
                  phone:phone,
                  website:website,
                  type:'option-details'
                };

                dataArr.push(data);
              }

              this.navCtrl.push(HelplineDetailPage, {'value':dataArr, 'type':'areacode'});
            } else {
              this.common.presentAlert("Not Found", "Sorry, the Area Code you entered was not found.");
            }
          }, error => {
            console.error(error);
          });
        } else {
          this.common.presentAlert("", "Please enter valid area code.");
        }
      }
    }

    helplinesSeggueChange() {
      this.common.helplinesSegOne = this.helplinesSegOne;
      this.common.helplinesSegTwo = this.helplinesSegTwo;
    }

  }
