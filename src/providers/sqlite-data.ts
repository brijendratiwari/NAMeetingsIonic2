import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { AppVersion } from 'ionic-native';

/*
  Generated class for the SqliteData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/
  @Injectable()
  export class SqliteData {

  	constructor(public http: Http ,  public plt: Platform ) {
  		console.log('Hello SqliteData Provider');

      plt.ready().then((readySource) => {
        this.createPrefsTable();
      });
    }

    createPrefsTable() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          let query = "CREATE TABLE IF NOT EXISTS prefs_v2 (id INTEGER PRIMARY KEY, last_download TEXT, days_interval INTEGER)";
          db.executeSql(query, []).then(() =>{
            resolve(true);
            console.log("Prefs table succesfully created");
          }, (error) => {
            reject(error);
            console.error('Prefs table create error : ' + error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }

    getPrefs() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          let query = "SELECT * FROM prefs_v2";
          db.executeSql(query, []).then((result) =>{
            resolve(result);
          }, (error) => {
            reject(error);
            console.error('Prefs select error : ' + error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }  

    insertIntoPrefs(lastDownloadDate, numberOfDays) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          let query = "INSERT INTO prefs_v2 (id, last_download, days_interval) VALUES(?,?,?)";
          db.executeSql(query, [1, lastDownloadDate, numberOfDays]).then((resultSet) =>{
            if(resultSet.rowsAffected > 0) {
              resolve(true);
            } else {
              reject(new Error("Insert error"));
            }
          }, (error) => {
            reject(error);
            console.error('Prefs insert error : ' + error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }

    updatePrefsNoOfDays(numberOfDays) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          let query = "UPDATE prefs_v2 SET days_interval = ? WHERE id = 1";
          db.executeSql(query, [numberOfDays]).then((resultSet) =>{
            if(resultSet.rowsAffected > 0) {
              resolve(true);
            } else {
              reject(new Error("Update error"));
            }
          }, (error) => {
            reject(error);
            console.error('Prefs update error : ' + error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }

    updatePrefsDownloadData(date) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          let query = "UPDATE prefs_v2 SET last_download = ? WHERE id = 1";
          db.executeSql(query, [date]).then((resultSet) =>{
            if(resultSet.rowsAffected > 0) {
              resolve(true);
            } else {
              reject(new Error("Update error"));
            }
          }, (error) => {
            reject(error);
            console.error('Prefs update error : ' + error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }


    dropPrefTable() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          let query = "DROP TABLE prefs_v2";
          db.executeSql(query, []).then((getResult) =>{
            resolve(true);
          }, (error) => 
          {
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };

    getHelplinesCount() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();

        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = 'SELECT COUNT(*) as NoOfRows FROM helplines';
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;
            console.log("this is table count");  				   
            resolve(count);
          }, (error) => 
          {
            reject(error);
            console.log('helplines SELECT error : ' + error.message);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });

      });
    }

    getMeetingsCount() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "SELECT count(*) as NoOfRows FROM meetings";
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;  				   
            resolve(count);
          }, (error) => 
          {
            reject(error);
            console.log('meetings SELECT error : ' + error.message);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });  		 		
    }
    getFormatsCount() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("mformats.db"))
        .then(() => {
          let query = "SELECT count(*) as NoOfRows FROM formats";
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;  				   
            resolve(count);
          }, (error) => 
          {
            reject(error);
            console.log('meetings SELECT error : ' + error.message);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        }); 
      }); 				
    }


    //Favorite Meetings

    makeSureFavMeetingsDBExists() {

      debugger;
      let db = new SQLite();
      db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
      .then(() => {
        let query = "CREATE TABLE IF NOT EXISTS favoritemeetings (meetingid INTEGER,group_id TEXT,mtgTime INTEGER,mtgDay INTEGER,comName TEXT,latitude REAL, longitude REAL, wchair TEXT,closed TEXT,format1 TEXT,format2 TEXT,format3 TEXT,format4 TEXT,format5 TEXT)";
        db.executeSql(query, []).then((getResult) =>{
          console.log("favoritemeetings Table created success");
        }, (error) => {
          console.log("favoritemeetings Table creating error "+JSON.stringify(error));
        });
      }, (error) => {
        console.error('Unable to open database: ', error);
      });
    }

    addFavoriteMeeting(meetingId, committee, mtgTime, mtgDay, comName, latitute, longitude) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "INSERT INTO favoritemeetings (meetingid,group_id,mtgTime,mtgDay,comName,latitude,longitude) VALUES(?,?,?,?,?,?,?)";
          db.executeSql(query, [meetingId, committee, mtgTime, mtgDay, comName, latitute, longitude]).then((getResult) =>{
            resolve(true);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        })
        .catch(error => {
          reject(error);
          console.error('Error opening database ', error);
        }); 
      });
    }

    getFavoriteMeetings() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "CREATE TABLE IF NOT EXISTS favoritemeetings (meetingid INTEGER,group_id TEXT,mtgTime INTEGER,mtgDay INTEGER,comName TEXT,latitude REAL, longitude REAL, wchair TEXT,closed TEXT,format1 TEXT,format2 TEXT,format3 TEXT,format4 TEXT,format5 TEXT)";
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;  				   
            resolve(true);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(false);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }



    removeFavoriteMeeting(meetingId, lat2, lon2, mtgDay, mtgTime, comName) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "DELETE FROM favoritemeetings WHERE latitude = ? and longitude=? and mtgDay=? and mtgTime=? and comName=?";
          db.executeSql(query, [lat2, lon2, mtgDay, mtgTime, comName]).then((getResult) =>{
            resolve(true);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    
    removeFavoriteMeetingAndRefreshList(meetingId, lat2, lon2, mtgDay, mtgTime, comName, lat1, lon1) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "DELETE FROM favoritemeetings WHERE latitude = ? and longitude=? and mtgDay=? and mtgTime=? and comName=?";
          db.executeSql(query, [lat2, lon2, mtgDay, mtgTime, comName]).then((getResult) =>{
            let count = getResult.rows.length;  				   
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    showFavoriteMeetingsStep1(lat1, lon1) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "SELECT * FROM favoritemeetings";
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            reject(error);
            console.log('meetings SELECT error : ' + error.message);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });   
      });
    }

    showFavoriteMeetingsStep2(lat1, lon1, qry, no_of_mtgs) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "CREATE TABLE IF NOT EXISTS favoritemeetings (meetingid INTEGER,group_id TEXT,mtgTime INTEGER,mtgDay INTEGER,comName TEXT,latitude REAL, longitude REAL, wchair TEXT,closed TEXT,format1 TEXT,format2 TEXT,format3 TEXT,format4 TEXT,format5 TEXT);";
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(false);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }
    showFavoriteMeetingsStep3(lat1, lon1, qry, no_of_mtgs) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "DELETE from favoritemeetings;";
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    showFavoriteMeetingsStep4(lat1, lon1, qry, no_of_mtgs) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          db.executeSql(qry, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    
    showFavoriteMeetingsStep5(lat1, lon1, no_of_mtgs) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "SELECT m.* FROM meetings AS m CROSS JOIN favoritemeetings AS fm WHERE m.[com_name] = fm.[comName] AND m.[mtg_day] = fm.[mtgDay] AND m.[mtg_time] = fm.[mtgTime] AND SUBSTR(CAST(m.[latitude] AS REAL), 0, 7) = SUBSTR(CAST(fm.[latitude] AS REAL), 0, 7) AND SUBSTR(CAST(m.[longitude] AS REAL), 0, 7) = SUBSTR(CAST(fm.[longitude] AS REAL), 0, 7);";
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };

    deleteFromFavorites(id, lat, lon) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "SELECT * FROM meetings WHERE id = ?";
          db.executeSql(query, [id]).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };


    displayNearbyResults(lat_max, lat_min, lon_max, lon_min, dayNumber, sortBy) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          var queryStatement = "";     

          queryStatement = 'SELECT id,latitude,longitude,address,city,state,zip,country,borough,mtg_day,mtg_time,com_name,place,wchair,closed,format1,format2,format3,format4,format5 FROM meetings WHERE latitude <= ' + lat_max + ' AND latitude >= ' + lat_min + ' AND longitude <= ' + lon_max + ' AND longitude >= ' + lon_min;

          if (dayNumber != 0) {
            queryStatement = queryStatement + ' AND mtg_day = ' + dayNumber;
          }
          if (sortBy == 'date') {
            queryStatement = queryStatement + ' Order by mtg_day, mtg_time';
          }

          var dbname = 'meetings.db';
          db.executeSql(queryStatement, []).then((res)=>{
            resolve(res);
          },(err)=>{
            reject(err);
            console.log("this is query error"+err);
          })
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }



    getMeetingDetailsFromFormat() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("mformats.db"))
        .then(() => {
          let query = "SELECT abbreviation, meaning FROM formats";
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }

    getMeetingData(mtg_id) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "SELECT latitude,longitude,address,city,state,zip,country,borough,mtg_day,mtg_time,com_name,place,wchair,closed,format1,format2,format3,format4,format5,language,lang2,lang3,committee,room,directions FROM meetings WHERE id = ?";
          db.executeSql(query, [mtg_id]).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });

    };
    showFavoriteMeetingDetails(lat2, lon2, mtgDay, mtgTime, comName) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "SELECT * FROM favoritemeetings WHERE latitude = ? and longitude=? and mtgDay=? and mtgTime=? and comName=?";
          db.executeSql(query, [lat2, lon2, mtgDay, mtgTime, comName]).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }

    processInfoWindowClick(theLat, theLon) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {       

          let query = 'SELECT id,latitude,longitude,address,city,state,zip,country,borough,mtg_day,mtg_time,com_name,place,wchair,closed,format1,format2,format3,format4,format5 FROM meetings WHERE longitude LIKE "%' + theLon + '%" AND latitude LIKE "%' + theLat + '%" ORDER BY mtg_day, mtg_time';
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }

    getMeetingDayFromMeetings(theLat, theLon) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = 'SELECT mtg_day FROM meetings WHERE longitude LIKE "%' + theLon + '%" AND latitude LIKE "%' + theLat + '%" GROUP BY mtg_day';
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };

    initializeMapForMeetingsLocation(lat_max, lat_min, lon_max, lon_min) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "SELECT id,latitude,longitude,state,mtg_day,city,address,place,closed,Count(CAST(latitude AS TEXT) || CAST(longitude AS TEXT)) AS 'MtgCount' FROM meetings WHERE latitude <= " + lat_max + " AND latitude >= " + lat_min + " AND longitude <= " + lon_max + " AND longitude >= " + lon_min + " Group By (CAST(latitude AS TEXT) || CAST(longitude AS TEXT))";
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }

    getHelplineOptionsCountry(cntry) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          // var countrySelected = $(cntry).val();
          let query = "SELECT description,areacode,phone,website,statename FROM helplines WHERE countryname = ? ORDER BY statename,areacode,description";
          db.executeSql(query, [cntry]).then((getResult) =>{
            let count = getResult.rows.length;
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    getHelplineOptions(stateName, countryName) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = "SELECT description,areacode,phone,website FROM helplines WHERE statename = ? AND countryname = ? ORDER BY areacode";
          db.executeSql(query, [stateName, countryName]).then((getResult) =>{
            let count = getResult.rows.length;
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        })
        .catch(error => {
          reject(error);
          console.error('Error opening database ', error);
        }); 
      });
    };
    getCountryDetails(areaCode) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = "SELECT description,phone,website,countryname,statename FROM helplines WHERE areacode LIKE '%" + areaCode + "%' ";
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    getHelplinesDetails() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = "SELECT * FROM helplines";
          db.executeSql(query, []).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    getStateNameOfUSAFromHelplines() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = "SELECT DISTINCT statename FROM helplines WHERE countryname = ? ORDER BY statename";
          db.executeSql(query, ["USA"]).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    getStateNameOfCanadaFromHelplines() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = "SELECT DISTINCT statename FROM helplines WHERE countryname = ? ORDER BY statename";
          db.executeSql(query, ["Canada"]).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    getCountryNameFromHelplines() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = "SELECT DISTINCT countryname FROM helplines ORDER BY countryname";
          db.executeSql(query, ["Canada"]).then((getResult) =>{
            resolve(getResult);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    getDetailsFromFavoriteMeeting() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "SELECT * FROM favoritemeetings;";
          db.executeSql(query, ["Canada"]).then((getResult) =>{
            let count = getResult.rows.length;
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    }


    updatePreferencesSetOfLastDownload(dataset) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          var row = dataset.item(0);
          var numberOfDays = parseInt(row['days_interval']);
          var myDate = new Date();
          var lastDownloadDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
          myDate.setDate(myDate.getDate() + numberOfDays);
          var futureDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
          let query = "UPDATE prefs_v2 SET last_download = ? WHERE id = 1";
          db.executeSql(query, [lastDownloadDate]).then((getResult) =>{
            resolve(true);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    insertLastDownloadedPreferences(numberOfDays) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          var myDate = new Date();
          var lastDownloadDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
          myDate.setDate(myDate.getDate() + numberOfDays);
          var futureDate = (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();

          let query = "INSERT INTO prefs_v2 (id, last_download, days_interval) VALUES(?,?,?)";
          db.executeSql(query, [1, lastDownloadDate, numberOfDays]).then((getResult) =>{
            resolve(true);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    updateLastDownloadedPreferences(numberOfDays) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("prefs.db"))
        .then(() => {
          let query = "UPDATE prefs_v2 SET days_interval = ? WHERE id = 1";
          db.executeSql(query, [numberOfDays]).then((getResult) =>{
            resolve(true);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    

    getNumberOfRowFromHelpline() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("helplines.db"))
        .then(() => {
          let query = "SELECT COUNT(*) as NoOfRows FROM helplines";
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;
            console.log("this is table count");
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        }); 
      });
    };
    getNumberOfRowFromMeeting() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("meetings.db"))
        .then(() => {
          let query = "SELECT count(*) as NoOfRows FROM meetings";
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };
    getNumberOfRowFromFormate() {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("mformats.db"))
        .then(() => {
          let query = "SELECT count(*) as NoOfRows FROM formats";
          db.executeSql(query, []).then((getResult) =>{
            let count = getResult.rows.length;
            resolve(count);
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
            reject(error);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });
      });
    };

    insertDetailsIntoFavoriteMeetings(meetingid, group_id, mtgTime, mtgDay, comName, latitude, longitude, wchair, closed, format1, format2, format3, format4, format5) {
      return new Promise((resolve, reject) => {
        let db = new SQLite();
        db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
        .then(() => {
          let query = "INSERT INTO favoritemeetings (meetingid, group_id, mtgTime, mtgDay, comName, latitude, longitude, wchair, closed, format1, format2, format3, format4, format5) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          db.executeSql(query, [meetingid, group_id, mtgTime, mtgDay, comName, latitude, longitude, wchair, closed, format1, format2, format3, format4, format5]).then((getResult) =>{
            let count = getResult.rows.length;  				   
            if(count > 0) {

            }
          }, (error) => 
          {
            console.log('meetings SELECT error : ' + error.message);
          });
        }, error => {
          reject(error);
          console.error('Error opening database ', error);
        });  		
      });
    } 


    isAppUpdate() {
      var ref = this;
      debugger;

      AppVersion.getVersionNumber().then(app_version => {
        console.log("isAppUpdate", app_version);
        let appVersion = window.localStorage.getItem("app_version");
        if (appVersion == null || appVersion == "null" || appVersion == "" || appVersion != app_version) {
          window.localStorage.setItem("app_version", app_version);

          let db = new SQLite();
          db.openDatabase(this.getDbOptionsForName("favoritemeetings.db"))
          .then(() => {
            let query = "SELECT * FROM favoritemeetings;";
            db.executeSql(query, []).then((getResult) =>{

              let ds = getResult.rows;
              if (ds.length > 0) {
                for (var i = 0; i < ds.length; i++) {
                  let row = ds.item(i);

                  let meetingid = row['meetingid'];
                  let group_id = row['group_id'];
                  let mtgTime = row['mtgTime'];
                  let mtgDay = row['mtgDay'];
                  let comName = row['comName'];
                  let latitude = row['latitude'];
                  let longitude = row['longitude'];
                  let wchair = row['wchair'];
                  let closed = row['closed'];
                  let format1 = row['format1'];
                  let format2 = row['format2'];
                  let format3 = row['format3'];
                  let format4 = row['format4'];
                  let format5 = "";                 

                  let insertQuery = 'INSERT INTO favoritemeetings (meetingid, group_id, mtgTime, mtgDay, comName, latitude, longitude, wchair, closed, format1, format2, format3, format4, format5) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                  let data = [meetingid, group_id, mtgTime, mtgDay, comName, latitude, longitude, wchair, closed, format1, format2, format3, format4, format5];

                  db.executeSql(query, data).then((getResult) =>{

                  }, (error) => {
                    console.log('favoritemeetings INSERT error : ' + error.message);
                  });               

                }
              }
            }, (error) => {
              console.log('favoritemeetings SELECT error : ' + error.message);
            });
          }, error => {
            console.error('Error opening database ', error);
          }); 
        }        
      });      
    }
    
    getDbOptionsForName(name) {
      return {
        name: name,
        iosDatabaseLocation: 'Documents'
      };
    }
    
  }