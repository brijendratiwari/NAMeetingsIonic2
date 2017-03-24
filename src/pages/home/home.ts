import { Component } from '@angular/core';

import { NavController , Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { AppInfoPage } from '../app-info/app-info';
import { JustForTodayPage } from '../just-for-today/just-for-today';
import { MeetingFinderPage } from '../meeting-finder/meeting-finder';
import { PreferencesPage } from '../preferences/preferences';
import { Network } from 'ionic-native';
import { DownloadFilePage } from '../download-file/download-file';
import { NaDbErrorPage } from '../na-db-error/na-db-error';

import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {
	appInfoPage = AppInfoPage;
	justForTodayPage = JustForTodayPage;
	meetingFinderPage = MeetingFinderPage;
	preferencesPage = PreferencesPage;
	
	disconnectSubscription;
	connectSubscription;

	constructor(public navCtrl: NavController, private common:Common, private sqliteData:SqliteData, public plt:Platform) {

		plt.ready().then((readySource) => {
			console.log('Platform ready from', readySource);

			// Check network 
			if(Network.type == "none") {
				common.isNetworkAvailable = false;
			} else {
				common.isNetworkAvailable = true;
			}

			this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
				common.isNetworkAvailable = false;
				console.log('network was disconnected :-(');
			});

			this.connectSubscription = Network.onConnect().subscribe(() => {
				common.isNetworkAvailable = true;
				console.log('network connected!'); 
			});

			if(!SQLite.openDatabase) {
				navCtrl.push(NaDbErrorPage);
			} else {
				sqliteData.makeSureFavMeetingsDBExists();
				sqliteData.isAppUpdate();
				common.requestFileSysytem();
				
				common.isTimeToDownloadFiles(function(status) {
					if(status) {
						if(common.isNetworkAvailable) {
							navCtrl.push(DownloadFilePage);
						} else {
							common.presentAlert("Connection Error", "A network connection is required in order to update data.");
						} 
					}
				});
			}
			
		});

		
	}

}
