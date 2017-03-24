import { Component } from '@angular/core';
import { NavController, NavParams , Platform } from 'ionic-angular';
import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';

/*
  Generated class for the HelplineDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
  	selector: 'page-helpline-detail',
  	templateUrl: 'helpline-detail.html'
  })
  export class HelplineDetailPage {
  	optionnsArr = [];

  	constructor(public navCtrl: NavController, public navParams: NavParams, private sqliteData:SqliteData, public common:Common, public plt:Platform) {
  		let type = navParams.get('type');
  		let value = navParams.get('value');

  		if(type == 'country') {
  			this.helplineOptionsCountry(value);
  		} else if(type == 'state') {
  			this.helplineOptions(value);
  		} else if(type == 'areacode') {
  			this.optionnsArr = value;
  		}
  	}

  	ionViewDidLoad() {
  		console.log('ionViewDidLoad HelplineDetailPage');
  	}

  	helplineOptionsCountry(countrySelected) {

  		this.optionnsArr = [];

  		var stateName = "cccccc";

  		this.sqliteData.getHelplineOptionsCountry(countrySelected).then(result => {
  			var ds = result['rows'];
  			if (ds.length > 0) {
  				for (var i = 0; i < ds.length; i++) {
  					var row = ds.item(i);

  					var description = row['description'];

  					var phone = row['phone'];
  					phone = phone.trim();

  					var website = row['website'];
  					website = website.trim(website);                

  					if (stateName !== row['statename']) {
  						stateName = row['statename'];
  						var stateHeader = stateName.trim();
  						if (stateHeader == '') {
  							stateHeader = countrySelected;
  						}

  						let data = {
  							title:stateHeader,
  							type:'option-title'
  						};
  						this.optionnsArr.push(data);

  					}

  					let data = {
  						description:description,
  						phone:phone,
  						website:website,
  						type:'option-details'
  					};

  					this.optionnsArr.push(data);
  				}
  			}
  		}, error => {
  			console.error(error);
  		});
  	}

  	helplineOptions(state) {

  		this.optionnsArr = [];

  		var areaCode = "ccccccc";
  		var countryName = "";
  		var stateName = "";

  		if (state.substring(0, 5) === '[USA]') {
  			countryName = state.substring(1, 4); // Get the value "USA"
  			stateName = state.substring(6, state.length); // Get the state
  		}

  		if (state.substring(0, 8) === '[Canada]') {
  			countryName = state.substring(1, 7); // Get the value "Canada"
  			stateName = state.substring(9, state.length); // Get the province
  		}

  		this.sqliteData.getHelplineOptions(stateName, countryName).then(result => {
  			var ds = result['rows'];
  			if (ds.length > 0) {
  				for (var i = 0; i < ds.length; i++) {
  					var row = ds.item(i);

  					var description = row['description'];
  					var phoneIcon = "";
  					var webIcon = "";

  					var phone = row['phone'];
  					phone = phone.trim();
  					
  					var website = row['website'];
  					website = website.trim(website);
  					
  					if (areaCode !== row['areacode']) {
  						areaCode = row['areacode'];
  						var areaHeader = areaCode.trim();
  						if (areaHeader == '') {
  							areaHeader = stateName;
  						}
  						let data = {
  							title:areaHeader,
  							type:'option-title'
  						};
  						this.optionnsArr.push(data);
  					}
  					let data = {
  						description:description,
  						phone:phone,
  						website:website,
  						type:'option-details'
  					};

  					this.optionnsArr.push(data);
  				}
  			}
  		}, error => {
  			console.error(error);
  		});
  	}

  }
