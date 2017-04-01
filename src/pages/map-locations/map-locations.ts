import { Component,ElementRef,ViewChild } from '@angular/core';
import { NavController, NavParams , Platform } from 'ionic-angular';
import { Geolocation, GoogleMap, GoogleMapsEvent, GoogleMapsMarker, GoogleMapsLatLng } from 'ionic-native';
import { Common } from '../../providers/common';
import { SqliteData } from '../../providers/sqlite-data';
import { MeetingDetailsPage } from '../meeting-details/meeting-details';
import { NearByPage } from '../near-by/near-by';

declare var google: any;
/*
  Generated class for the MapLocations page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  @Component({
  	selector: 'page-map-locations',
  	templateUrl: 'map-locations.html'
  })
  export class MapLocationsPage {
    mapLocation:string="all";
    @ViewChild('mapCanvas') mapElement: ElementRef;
    map;
    mapEle;
    latLng
    directionsRenderer

    maptype;

    single_marker;

    SOURCE_LAT;
    SOURCE_LNG;
    CENTER_LAT;
    CENTER_LNG;
    CURRENT_ZOOM;

    infowindow:any;

    markersArr = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public common:Common,  public sqliteData:SqliteData, public plt: Platform) {
      this.infowindow = new google.maps.InfoWindow({
        disableAutoPan: true,
        maxWidth: 200
      });
    }

    ionViewDidLoad() {

      this.plt.ready().then((readySource) => {
        this.maptype = this.navParams.get('map-type');

        if(this.maptype == 'single') {
          let latitute = parseFloat(this.navParams.get('latitute'));
          let longitude = parseFloat(this.navParams.get('longitude'));

          let latLng = new GoogleMapsLatLng(latitute, longitude);
          var single_mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };


          this.map = new google.maps.Map(this.mapElement.nativeElement, single_mapOptions);
          var ref = this;
          setTimeout(function(){
            let latitute = parseFloat(ref.navParams.get('latitute'));
            let longitude = parseFloat(ref.navParams.get('longitude'));

            let marker_latlong = new GoogleMapsLatLng(latitute, longitude);
            if(ref.single_marker != null) {
              ref.single_marker.setMap(null);
            }
            ref.single_marker = new google.maps.Marker({
              position: marker_latlong,
              map: ref.map,
            });
            ref.map.setCenter(marker_latlong);
          }, 2000);
        } else if(this.maptype == 'multiple') {
                let ref = this;

          var lat = 34.235920;
          var lng = -118.563659;

          Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            maximumAge: 3000,
            timeout: 30000
          }).then((position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            ref.launchMap(lat, lng, ref);
          },function(err) {
            ref.launchMap(lat, lng, ref);
          });
        }

      });

    }

    launchMap(lat, lng, ref) {

      this.SOURCE_LAT = lat;
      this.SOURCE_LNG = lng;

      this.CENTER_LAT = this.SOURCE_LAT;
      this.CENTER_LNG = this.SOURCE_LNG;

      this.CURRENT_ZOOM = 11;

      let myLatlng = new GoogleMapsLatLng(lat, lng);

      var mapOptions = {
        center: myLatlng,
        zoom: this.CURRENT_ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: myLatlng,
        zoom: this.CURRENT_ZOOM,
        disableDefaultUI: true,
        streetViewControl: false
      });


      google.maps.event.addListener(this.map, 'center_changed', function() {
        ref.infowindow.close();
        ref.CENTER_LAT = ref.map.getCenter().lat();
        ref.CENTER_LNG = ref.map.getCenter().lng()
        ref.initializeMap(ref.CENTER_LAT, ref.CENTER_LNG);
      });

      setTimeout(function() {
        ref.initializeMap(ref.CENTER_LAT, ref.CENTER_LNG);
      }, 2000);

    }

    initializeMap(srcLat, srcLon) {
      var currentLatDelta = 0.09222;

      // Add markers here.
      var queryStatement = '';

      var maxDistance = 69 * currentLatDelta;

      var lon_max = this.calRange(srcLat, srcLon, 90, maxDistance);
      var lon_min = this.calRange(srcLat, srcLon, -90, maxDistance);
      var lat_max = this.calRange(srcLat, srcLon, 0, maxDistance);
      var lat_min = this.calRange(srcLat, srcLon, -180, maxDistance);

      this.sqliteData.initializeMapForMeetingsLocation(lat_max, lat_min, lon_max, lon_min).then(result => {
        var ds = result['rows'];
        if (ds.length > 0) {
          for (var i = 0; i < ds.length; i++) {
            var row = ds.item(i);

            var meetingDay = this.common.getDayofWeek(row['mtg_day']).substring(0, 3);
            var recId = row['id'];
            var lat = row['latitude'];
            var lon = row['longitude'];
            var place = row['place'];
            var address = row['address'];
            var city = row['city'];
            var state = row['state'];
            var openClosed = row['closed'];
            var mtg_count = row['MtgCount'];

            var t = "";
            t = place;
            if (t == "") {
              t = address;
            }

            var desc = address;
            if (desc == "") {
              desc = city + ' ' + state;
            } else {
              desc = desc + '<br />' + city + ' ' + state;
            }

            lat = parseFloat(lat.trim());
            lon = parseFloat(lon.trim());

            if (this.mapLocation == 'one') {
              if (mtg_count == 1) {
                this.placeMarker(this.map, lat, lon, t, desc, mtg_count, meetingDay);
              }
            } else if (this.mapLocation == 'many') {
              if (mtg_count > 1) {
                this.placeMarker(this.map, lat, lon, t, desc, mtg_count, meetingDay);
              }
            } else {
              this.placeMarker(this.map, lat, lon, t, desc, mtg_count, meetingDay);
            }
          }
        }
      }, error => {
        console.error(error);
      });
    }

    placeMarker(mapObj, lat, lon, title, desc, mtg_count, meetingDay) {
      var markerImage = "./assets/NAMarkerSingle32.png";
      if (mtg_count > 1) {
        markerImage = "./assets/NAMarkerMultiple32.png";
      }

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: mapObj,
        title: title,
        icon: markerImage,
        desc: desc,
        lat: lat,
        lon: lon,
        meetingDay: meetingDay
      });

      this.markersArr.push(marker);

      let ref = this;

      google.maps.event.addListener(marker, 'click', function() {
        var meetingDay = this.meetingDay;
        var icon = marker.getIcon();
        if (icon == "./assets/NAMarkerMultiple32.png") {
          var lat = "" + marker.getPosition().lat();
          var lon = "" + marker.getPosition().lng();
          var theLat = "" + 0;
          var theLon = "" + 0;
          if (lat != "0" && lon != "0") {
            theLat = lat.substring(0, lat.indexOf('.') + 5);
            theLon = lon.substring(0, lon.indexOf('.') + 5);
          }

          var meetingDay1 = "";

          ref.sqliteData.getMeetingDayFromMeetings(theLat, theLon).then(result => {
            var ds1 = result['rows'];

            for (var i = 0; i < ds1.length; i++) {
              var row1 = ds1.item(i);
              meetingDay1 += ref.common.getDayofWeek(row1['mtg_day']).substring(0, 3) + ' ';
            }
            ref.setInfoWindowContent(marker, meetingDay1, mapObj);
          }, error => {

          });
          meetingDay = meetingDay1;
        } else {
          ref.setInfoWindowContent(marker, meetingDay, mapObj);
        }

      });
    }

    

    changeMapLocation(){
      for(let marker of this.markersArr) {
        marker.setMap(null);
      }
      this.initializeMap(this.CENTER_LAT, this.CENTER_LNG);
    }

    calRange(lat1, lon1, bear, dist) {
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

      if (bear == 90 || bear == -90)
        return lonB * (180 / Math.PI);
      else
        return latB * (180 / Math.PI);

    }

    processInfoWindowClick(lat, lon, ref) {
      lat = lat.toString();
      lon = lon.toString();

      var theLat = lat.substring(0, lat.indexOf('.') + 5);
      var theLon = lon.substring(0, lon.indexOf('.') + 5);

      ref.sqliteData.processInfoWindowClick(theLat, theLon).then(result => {
        var ds = result['rows']
        if (ds.length == 1) {
          var row = ds.item(0);
          var tempdistance = ref.common.distancePoint(ref.SOURCE_LAT, ref.SOURCE_LNG, row['latitude'], row['longitude']);
          tempdistance = Math.round(tempdistance * Math.pow(10, 1)) / Math.pow(10, 1);
          let distance = tempdistance + ' miles';

          ref.navCtrl.push(MeetingDetailsPage,{'mtg_id':row['id'], 'mtg_distance':distance});
        } else if (ds.length > 1) {

          var dataToDisplay = [];

          for (var i = 0; i < ds.length; i++) {
            var row = ds.item(i);

            var tempdistance = ref.common.distancePoint(ref.SOURCE_LAT, ref.SOURCE_LNG, row['latitude'], row['longitude']);
            tempdistance = Math.round(tempdistance * Math.pow(10, 1)) / Math.pow(10, 1);
            let distance = tempdistance + ' miles';

            var recordID = row['id'];
            var lat2 = row['latitude'];
            var lon2 = row['longitude'];
            var address = row['address'];
            var city = row['city'];
            var state = row['state'];
            var zip = row['zip'];
            var country = row['country'];
            var borough = row['borough'];
            var mtgDay = row['mtg_day'];
            var mtgTime = row['mtg_time'];
            var comName = row['com_name'];
            var place = row['place'];
            var wchair = row['wchair'];
            var openClosed = row['closed'];
            var format1 = row['format1'];
            var format2 = row['format2'];
            var format3 = row['format3'];
            var format4 = row['format4'];
            var format5 = row['format5'];

            var dayTime = ref.common.getDayofWeek(mtgDay) + ' ' + ref.common.convertTo12hr(mtgTime);
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
            dataToDisplay.push(data);
          }
          ref.navCtrl.push(NearByPage, {'meetingData':dataToDisplay, 'from_map_locations':true});

        }
      }, error => {
        console.error(error);
      });

    }

    setInfoWindowContent(markerr, day_string, map_obj) {
      var ref = this;
      var contentString = '<div id="processInfoWindowId" class="info_window"> ' +
      '<h3>' + markerr.title + '</h3>' +
      '<p>' + markerr.desc +
      '<br/><temp>' + day_string + '</temp></p>' +
      '<p><a href="javascript:void(0);">View Details</a></p>' +
      '</div>';
      ref.infowindow.setContent(contentString);
      ref.infowindow.open(map_obj, markerr);

      document.getElementById("processInfoWindowId").addEventListener("click", function(){
        ref.processInfoWindowClick(markerr.lat, markerr.lon, ref);
      });
    }
  }
