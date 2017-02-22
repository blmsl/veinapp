import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { CovalentCoreModule } from '@covalent/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import './rxjs-extensions';

import { AppComponent } from './app.component';
import { firebaseConfig } from '../config/firebase';
import { GeoModule } from './geo/geo.module';
import { CurrentSearchReducer } from './state-management/reducers/current-search-reducer';
import { CurrentSearchEffectService } from './state-management/effects/current-search-effect.service';
import { SearchResultReducer } from './state-management/reducers/search-result-reducer';
import { GeoHeaderModule } from './geo-header/geo-header.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    CovalentCoreModule.forRoot(),
    GeoModule,
    StoreModule.provideStore({CurrentSearchReducer, SearchResultReducer}),
    EffectsModule.run(CurrentSearchEffectService),
    // TODO remove on prod
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    GeoHeaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
