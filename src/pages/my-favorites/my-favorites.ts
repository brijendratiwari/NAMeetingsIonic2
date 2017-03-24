import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';
import { MeetingDetailsPage } from '../meeting-details/meeting-details';


/*
  Generated class for the MyFavorites page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
  	selector: 'page-my-favorites',
  	templateUrl: 'my-favorites.html'
  })
  export class MyFavoritesPage {
    dataToDisplay = [];
    meetingDetails = MeetingDetailsPage;
    latitude:any;
    longitude:any;

    constructor(public navCtrl: NavController, public navParams: NavParams,  public common:Common, public sqliteData:SqliteData) {}

    ionViewDidLoad() {
      console.log('ionViewDidLoad MyFavoritesPage');

      this.latitude = this.navParams.get('lat');
      this.longitude = this.navParams.get('lng');

      this.showFavoriteMeetingsStep();
    }


    showFavoriteMeetingsStep() {
      let lat1 = this.latitude;
      let lon1 = this.longitude;

      this.dataToDisplay = [];
      var qry = "";
      this.sqliteData.showFavoriteMeetingsStep1(lat1, lon1).then(result => {
        var ds = result['rows'];
        if (ds.length > 0) {
          for (var i = 0; i < ds.length; i++) {
            var row = ds.item(i);
            var comName = row['comName'];
            if (qry == "") {
              qry = qry + "INSERT INTO favoritemeetings (meetingid,group_id,mtgTime,mtgDay,comName,latitude,longitude) VALUES (" + row["meetingid"] + "," + row["group_id"] + "," + row["mtgTime"] + "," + row["mtgDay"] + ",\"" + comName + "\"," + row["latitude"] + "," + row["longitude"] + ")";
            } else {
              qry = qry + ", (" + row["meetingid"] + "," + row["group_id"] + "," + row["mtgTime"] + "," + row["mtgDay"] + ",\"" + comName + "\"," + row["latitude"] + "," + row["longitude"] + ")";
            }
          }
          this.sqliteData.showFavoriteMeetingsStep2(lat1, lon1, qry, ds.length).then(resultStep2=>{
            var step2 = resultStep2['rows'];
            this.sqliteData.showFavoriteMeetingsStep3(lat1, lon1, qry, ds.length).then(resultStep3=>{
              var step3 = resultStep3['rows'];
              this.sqliteData.showFavoriteMeetingsStep4(lat1, lon1, qry, ds.length).then(resultstep4=>{
                var step4 = resultstep4['rows'];
                this.sqliteData.showFavoriteMeetingsStep5(lat1, lon1, ds.length).then(resultstep5=>{
                  var ds = resultstep5['rows'];

                  if (ds.length > 0) {
                    for (var i = 0; i < ds.length; i++) {
                      var row = ds.item(i);
                      var tempdistance = this.common.distancePoint(lat1, lon1, row['latitude'], row['longitude']);

                      tempdistance = Math.round(tempdistance * Math.pow(10, 1)) / Math.pow(10, 1);
                      var distance = tempdistance + ' miles';

                      var recordID = row['id'];
                      var lat2 = row['latitude'];
                      var lon2 = row['longitude'];
                      var address = row['address'];
                      var city = row['city'];
                      var state = row['state'];
                      var zip = row['zip'];
                      var country = row['country'];
                      // var borough = row['borough'];
                      var mtgDay = row['mtg_day'];
                      var mtgTime = row['mtg_time'];
                      // var comName = row['com_name'];
                      var place = row['place'];
                      var wchair = row['wchair'];
                      var openClosed = row['closed'];
                      var format1 = row['format1'];
                      var format2 = row['format2'];
                      var format3 = row['format3'];
                      var format4 = row['format4'];
                      var format5 = row['format5'];

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
                    if(this.dataToDisplay.length == 0){
                        this.navCtrl.pop();
                    }
                  }

                },error=>{
                  console.log(error);
                });
              },error=>{
                console.log(error);
              });
            },error=>{
              console.log(error);
            });
          },error=>{
            console.log(error);
          });
        } else {
          this.common.presentAlert('Information', 'You don\'t have any favorite meetings.');
        }
      }, error => {
        console.error(error);
      });
}



deleteFav(data){
  this.sqliteData.deleteFromFavorites(data.recordID,this.latitude,this.longitude).then(result=>{
    console.log(result);
    var ds = result['rows'];
    if (ds.length > 0) {
      var row = ds.item(0);
      this.sqliteData.removeFavoriteMeetingAndRefreshList(row['id'], row['latitude'], row['longitude'], row['mtg_day'], row['mtg_time'], row['com_name'], this.latitude, this.longitude).then(results=>{
        console.log(results);
        this.showFavoriteMeetingsStep();
      },error =>{
        console.log(error);
      });
    }
  },error=>{
    console.log(error);
  });
}

}
