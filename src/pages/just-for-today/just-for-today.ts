import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';

/*
  Generated class for the JustForToday page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-just-for-today',
  templateUrl: 'just-for-today.html',
  providers:[Api]
})
export class JustForTodayPage {
	jftText = "";
	
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
      var ref = this;
      api.getRequestForHtmlData("http://www.jftna.org/jft/").then(response => {
        var responseTxt = response.toString().substring(response.toString().indexOf('<body>') + 6);
        responseTxt = responseTxt.substring(0, responseTxt.indexOf('</body>'));

        ref.jftText = responseTxt;

        console.log("response "+JSON.stringify(response));
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JustForTodayPage');
  }

}
