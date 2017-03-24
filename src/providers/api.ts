import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the Api provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/
  @Injectable()
  export class Api {

  	constructor(public http: Http) {
  		console.log('Hello Api Provider');
  	}

  	getRequest(url) {
  		var ref = this;

  		return new Promise((resolve, reject) => {
  			this.http.get(url)
  			.timeout(20000, new Error('Request Timeout'))
  			.map(res => res.json())
  			.subscribe(data => {
  				resolve(data);
  			},
  			error => {
  				console.log("Error "+JSON.stringify(error));
  				reject(error);
  			});
  		});
  	}

    getRequestForHtmlData(url) {
      var ref = this;

      return new Promise((resolve, reject) => {
        this.http.get(url)
        .timeout(20000, new Error('Request Timeout'))
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        },
        error => {
          console.log("Error "+JSON.stringify(error));
          reject(error);
        });
      });
    }
  }
