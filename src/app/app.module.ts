import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { AppInfoPage } from '../pages/app-info/app-info';
import { JustForTodayPage } from '../pages/just-for-today/just-for-today';
import { MeetingFinderPage } from '../pages/meeting-finder/meeting-finder';
import { PreferencesPage } from '../pages/preferences/preferences';
import { HelplineOptionsPage } from '../pages/helpline-options/helpline-options';
import { MeetingDetailsPage } from '../pages/meeting-details/meeting-details';
import { NAMeetingSearchPage } from '../pages/na-meeting-search/na-meeting-search';
import { NearByPage } from '../pages/near-by/near-by';
import { MapLocationsPage } from '../pages/map-locations/map-locations';
import { MyFavoritesPage } from '../pages/my-favorites/my-favorites';
import { DownloadFilePage } from '../pages/download-file/download-file';
import { NaDbErrorPage } from '../pages/na-db-error/na-db-error';
import { HelplineDetailPage } from '../pages/helpline-detail/helpline-detail';

import { Common } from '../providers/common';
import { SqliteData } from '../providers/sqlite-data';

@NgModule({
  declarations: [
    MyApp,

    HomePage,
    AppInfoPage,
    JustForTodayPage,
    MeetingFinderPage,
    PreferencesPage,
    HelplineOptionsPage,
    HelplineDetailPage,
    MeetingDetailsPage,
    NAMeetingSearchPage,
    NearByPage,
    MapLocationsPage,
    MyFavoritesPage,
    DownloadFilePage,
    NaDbErrorPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    HomePage,
    AppInfoPage,
    JustForTodayPage,
    MeetingFinderPage,
    PreferencesPage,
    HelplineOptionsPage,
    HelplineDetailPage,
    MeetingDetailsPage,
    NAMeetingSearchPage,
    NearByPage,
    MapLocationsPage,
    MyFavoritesPage,
    DownloadFilePage,
    NaDbErrorPage
  ],
  providers: [Common, SqliteData, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
