import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController , Platform } from 'ionic-angular';
import { SqliteData } from './sqlite-data';
declare var window: any;

/*
  Generated class for the Common provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/
  @Injectable()
  export class Common {

  	public isNetworkAvailable = false;
    public ddlMiles:any = 5;
    public ddlWeekdays:any = 0;
    public ddlSortby:any = "dist";

    public helplinesSegOne:any = "usa";
    public helplinesSegTwo:any = "areacode";

    constructor(public sqliteData:SqliteData, public http: Http , public alertCtrl:AlertController, public plt:Platform) {
      console.log('Hello Common Provider');
    }

    presentAlert(title, message) {
      return new Promise((resolve) => {
        let alert = this.alertCtrl.create({
          title: title,
          message: message,
          buttons: [{
            text: 'Ok',
            role: 'ok',
            handler: () => {
              if(resolve) {
                resolve();
              }
            }
          }]
        });
        alert.present();
      });      
    }


    updateNextDownloadDate(callback) {
      var futureDate;
      var lastDownloadDate;

      this.sqliteData.getPrefs().then(response => {
        let dataset = response['rows'];
        var row = dataset.item(0);
        var numberOfDays = parseInt(row['days_interval']);
        var myDate = new Date();
        lastDownloadDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
        myDate.setDate(myDate.getDate() + numberOfDays);
        futureDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
        this.sqliteData.updatePrefsDownloadData(lastDownloadDate);

        if(callback) {
          callback(futureDate);
        }
      }, error => {

      });
    }

    setNextDownloadDate(days) {
      var myDate = new Date();
      var lastDownloadDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
      myDate.setDate(myDate.getDate() + days);
      var futureDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
      
      this.sqliteData.getPrefs().then(prefs => {
        if(prefs['rows'].length == 0) {
          this.sqliteData.insertIntoPrefs(lastDownloadDate, days);
        } else {
          this.sqliteData.updatePrefsNoOfDays(days);
        }
      }, error => {
        console.error("Error in prefs :", error);
      });
      return futureDate;
    }

    getNextDownloadDate(callback) {

      this.sqliteData.getPrefs().then(response => {
        var prefs = response['rows'].item(0);
        let lastDownload = prefs['last_download'];
        let numberOfDays = parseInt(prefs['days_interval']);

        var lastDownloadDate = new Date(lastDownload);
        lastDownloadDate.setDate(lastDownloadDate.getDate() + numberOfDays);

        var nextDate = (lastDownloadDate.getMonth() + 1) + "/" + lastDownloadDate.getDate() + "/" + lastDownloadDate.getFullYear();
        if(callback) {
          callback(nextDate);
        }
      }, error => {
        console.error("Error in prefs :" , error);
      });      
    }

    isTimeToDownloadFiles(callBack) {
      
      this.sqliteData.createPrefsTable().then(res => {
        if(res) {
          this.sqliteData.getPrefs().then(response => {
            let prefs = response;
            console.log(JSON.stringify(response));
            if(prefs['rows'].length  ==  0) {
              this.setNextDownloadDate(30);

              this.presentAlert("Meeting File Download", "Welcome to NA Meeting Search. Give us a moment while we install the meeting data. It is suggested that you be on a wifi network to perform this download.").then(_ => {
                if(callBack) {
                  callBack(true)
                }
              }); 
            } else {
              this.sqliteData.getHelplinesCount().then(helpLineount => {
                // If code reach here, means helplines data available.
                // Lets check meetings data
                this.sqliteData.getMeetingsCount().then(meetingsCount => {
                  // If code reach here, means meetings data available.
                  // Lets check formats data
                  this.sqliteData.getFormatsCount().then(formatsCount => {
                    // If code reach here, means all data available.
                    // Proceed with the reminder date check.
                    var prefsData = prefs['rows'].item(0);

                    var lastDownload = prefsData['last_download'];
                    var todaysDate = new Date();
                    var lastDownloadDate = new Date(lastDownload);
                    lastDownloadDate.setDate(lastDownloadDate.getDate() + prefsData['days_interval']);
                    if (todaysDate >= lastDownloadDate) {                
                      let alert = this.alertCtrl.create({
                        title: "Update Data",
                        message: "Would you like to download current meeting data now?",
                        buttons: [{
                          text: 'Ok',
                          role: 'ok',
                          handler: () => {
                            if(callBack) {
                              callBack(true);
                            }
                          }
                        },
                        {
                          text: 'Postpone',
                          role: 'postpone',
                          handler: () => {
                            if(callBack) {
                              callBack(false);
                            }
                          }
                        }]
                      });
                      alert.present();               
                    }
                  }, error => {
                    this.downloadNeeded(callBack);
                  });
                }, error => {
                  this.downloadNeeded(callBack);
                });
              }, error => {
                this.downloadNeeded(callBack);
              });
            }
          }, error => {
            console.error("Error in prefs :", error);
          }); 
        }
      });      
    }

    private downloadNeeded(callBack) {
      this.presentAlert("Meeting File Download", "The data for this application needs to be updated.  Please be sure you currently have a signal or a wifi connection.").then(_ => {
        if(callBack) {
          callBack(true)
        }
      }); 
    }

    get_lat_lon(lat1, lon1, b1, dist) {
      var lt_min = 0,
      lt_max = 0,
      ln_min = 0,
      ln_max = 0;
      for (var bear = 0; bear <= 360; bear++) {
        var latA;
        var lonA;
        var d;
        var θ;
        var R = 6372.795477598;

        latA = lat1 * (Math.PI / 180);

        lonA = lon1 * (Math.PI / 180);

        d = dist * 1.60934;

        θ = bear * (Math.PI / 180);

        d = (d / R);

        var latB = 0;
        var lonB = 0;

        latB = Math.asin(Math.sin(latA) * Math.cos(d) + Math.cos(latA) * Math.sin(d) * Math.cos(θ));
        lonB = lonA + Math.atan2(Math.sin(θ) * Math.sin(d) * Math.cos(latA), Math.cos(d) - Math.sin(latA) * Math.sin(latB));

        latB = latB * (180 / Math.PI);
        lonB = lonB * (180 / Math.PI);
        if (bear == 0) {
          lt_min = lt_max = latB;
          ln_min = ln_max = lonB;
        }
        if (latB < lt_min)
          lt_min = latB;
        if (latB > lt_max)
          lt_max = latB;
        if (lonB < ln_min)
          ln_min = lonB;
        if (lonB > ln_max)
          ln_max = lonB;
      }
      return [lt_min, lt_max, ln_min, ln_max];
    }

    sortData(arr) {
      var temp = [];
      for (var i = 0; i < arr.length; i++) {
        for (var j = i; j < arr.length; j++) {
          if (arr[i][0] > arr[j][0]) {
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
          }
        }
      }
      return arr;
    }

    getDayofWeek(dayNbr) {
      if (dayNbr != "") {
        dayNbr = parseInt(dayNbr);
      }
      var dayName = "";
      switch (dayNbr) {
        case 1:
        dayName = "Sunday";
        break;
        case 2:
        dayName = "Monday";
        break;
        case 3:
        dayName = "Tuesday";
        break;
        case 4:
        dayName = "Wednesday";
        break;
        case 5:
        dayName = "Thursday";
        break;
        case 6:
        dayName = "Friday";
        break;
        case 7:
        dayName = "Saturday";
        break;
      }
      return dayName;
    }

    convertTo12hr(timeToConvert) {
      var timeResult = "";
      var ez = "am";
      var hours = Math.floor(timeToConvert / 100);
      var minutes = String(timeToConvert - hours * 100);

      if (minutes === "0") {
        minutes = "00"
      }
      if (hours >= 12) {
        ez = "pm"
      }
      if (hours > 12) {
        hours = hours - 12;
      }

      return hours + ":" + minutes + " " + ez;
    }
    
    distancePoint(lat1, lon1, lat2, lon2) {
      var R = 6371;

      var dLat = (lat2 - lat1) * (Math.PI / 180);
      var dLon = (lon2 - lon1) * (Math.PI / 180);
      lat1 = lat1 * (Math.PI / 180);
      lat2 = lat2 * (Math.PI / 180);

      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c / 1.60934;

      return d;
    }


    requestFileSysytem() {
      var ref = this;

      if (!ref.plt.is('android')) {
        window.requestFileSystem(0, 1, gotFS, this.fail);
      } else {
        window.requestFileSystem(1, 0, gotFS, this.fail);
      }

      function gotFS(fileSystem) {
        var filesys = "/data/data/org.na.naapptest/databases";
        if (!ref.plt.is('android')) {
          filesys = "/Private Documents";
        }
        fileSystem.root.getDirectory("/Private Documents", {
          create: false,
          exclusive: false
        }, getDirSuccess, ref.fail);
      }

      function getDirSuccess(dirEntry) {

        var reader = dirEntry.createReader();
        reader.readEntries(ref.gotList, ref.fail);
      }
    }

    private fail(error) {
      console.log(error.code);
    }

    private gotList(entries) {
      var i;
      var helpDBname = "helplines.db";
      var meetDBname = "meetings.db";
      var mforDBname = "mformats.db";
      var prefDBname = "prefs.db";
      var favDBname = "favoritemeetings.db";

      for (i = 0; i < entries.length; i++) {
        if (entries[i].name === helpDBname || entries[i].name === meetDBname || entries[i].name === mforDBname || entries[i].name === prefDBname || entries[i].name === favDBname) {
          entries[i].remove(this.success, this.fail);
        }
      }
    }

    private success(entry) {
      console.log("Removal succeeded");
    }

  }
