import { Component , NgZone } from '@angular/core';
import { NavController, NavParams , Platform } from 'ionic-angular';
import { Transfer , Network } from 'ionic-native';
import { Common } from '../../providers/common';

declare var window: any;
/*


  Generated class for the DownloadFile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
  	selector: 'page-download-file',
  	templateUrl: 'download-file.html'
  })

  export class DownloadFilePage {

    DATADIR;
    helplines_count = 1;
    meeting_count = 1;
    mformats_count = 1;

    isDownloading = false;

    loadingStatusOfMeetingFile;
    loadingStatusOfFormatsFile;
    loadingStatusOfHelplineFile;

    constructor(private zone: NgZone, public navCtrl: NavController, public navParams: NavParams,  public plt: Platform , public common:Common) {}

    ionViewDidLoad() {
      this.downloadDBs();
    }

    
    downloadDBs() {
      if(this.common.isNetworkAvailable) {
        this.downloadAllFiles();
      } else {
        this.common.presentAlert("Connection Error", "A network connection is required in order to update data.");
      }     
    }

    downloadAllFiles() {
      var ref = this;

      if(!ref.isDownloading && ref.plt.is('android') || !ref.plt.is('android')) {
        debugger;
        window.requestFileSystem(1, 0, function (fileSystem) {
          var dpath = "";
          if (ref.plt.is('android')) {
            dpath = "/data/data/org.na.naapptest/databases";
          }

          fileSystem.root.getDirectory(dpath, {
            create: true,
            exclusive: false
          }, function(dir) {
            ref.DATADIR = dir;
            ref.downloadHelplinesFile(ref);
          },
          function(e) {
            ref.common.presentAlert("", "Get directory failed: " + e.message);
          });
        }, 
        function(e) {
          ref.common.presentAlert("", "File system access failed: " + e.message);
        });
      }
    }

    downloadHelplinesFile(ref) {
      ref.helplines_count++;

      ref.downloadFile(ref, "http://portaltools.na.org/portaltools/helplines.sql?time=" + ref.helplines_count, "helplines.db", 
        function(progress) {
          ref.zone.run(() => {
            ref.loadingStatusOfHelplineFile = progress;
          });
        }, function(complete) {
          ref.downloadMeetingsFile(ref);
        }, function(error) {

        });
    }

    downloadMeetingsFile(ref) {
      ref.meeting_count++;

      ref.downloadFile(ref, "http://portaltools.na.org/portaltools/meetings.sql?time=" + ref.meeting_count, "meetings.db", 
        function(progress) {
          ref.zone.run(() => {
            ref.loadingStatusOfMeetingFile = progress;
          });
        }, function(complete) {
          ref.downloadFormatsFile(ref);
        }, function(error) {

        });   
    }

    downloadFormatsFile(ref) {
      ref.mformats_count++;

      ref.downloadFile(ref, "http://portaltools.na.org/portaltools/mformats.sql?time=" + ref.mformats_count, "mformats.db", 
        function(progress) {
          ref.zone.run(() => {
            ref.loadingStatusOfFormatsFile = progress;
          });
        }, function(complete) {
          ref.fileDownloadSuccess(ref);
        }, function(error) {

        });
    }

    downloadFile(ref, url, fileName, onProgress, onComplete, onError) {

      ref.isDownloading = true;

      const fileTransfer = new Transfer();

      var dbname = "/"+fileName;
      var dlPath = ref.DATADIR.nativeURL + dbname;

      fileTransfer.onProgress(function(progressEvent) {
        if (progressEvent.lengthComputable) {
          if(onProgress) {
            var loaded = progressEvent.loaded;
            if (ref.plt.is('android')) {
              loaded = loaded / 2;
            }
            var prec = (loaded / progressEvent.total) * 100;

            onProgress(Math.floor(prec));
          }
        } 
      });

      fileTransfer.download(url, dlPath).then((entry) => {
        ref.isDownloading = false;
        if(onComplete) {
          onComplete(entry);
        }
      }, (error) => {
        if(onError) {
          onError(error);
        }
        ref.isDownloading = false;
        ref.common.presentAlert("Download Error", "The data download was not completed successfully. Make sure you have a strong connection to the internet and then use the Preferences page to try the download again.");
      });
    }


    fileDownloadSuccess(ref) {
      ref.isDownloading = false;
      ref.common.updateNextDownloadDate();      
      ref.common.presentAlert('Download Complete','Data has been successfully update');
      setTimeout(function() {
        ref.navCtrl.pop();
      }, 2000);
    }
    

  }
