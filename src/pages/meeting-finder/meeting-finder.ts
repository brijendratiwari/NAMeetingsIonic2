import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HelplineOptionsPage } from '../helpline-options/helpline-options';
import { NAMeetingSearchPage } from '../na-meeting-search/na-meeting-search';

/*
  Generated class for the MeetingFinder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-meeting-finder',
  templateUrl: 'meeting-finder.html'
})
export class MeetingFinderPage {
	helplineOptionsPage = HelplineOptionsPage;
	naMeetingSearchPage = NAMeetingSearchPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingFinderPage');
  }

}
