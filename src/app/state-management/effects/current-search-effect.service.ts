import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import * as search from '../actions/current-search-action';
import { GeocodeService, GeosearchingService } from '../../geo/geo.module';
import { GEO_KEY_ENTER, GEO_KEY_EXIT } from '../../geo/geosearching/geosearch';

@Injectable()
export class CurrentSearchEffectService {

  @Effect() changeCurrentSearchFromGeocode$ = this.actions$
    .ofType(search.ActionTypes.CHANGE_SEARCH_FROM_ADDRESS)
    .map(toPayload)
    .switchMap(payload =>
      this.geocodeService.getCoords(payload.address)
    )
    .switchMap(response => {
      if (!response) {
        return Observable
          .of(new search.NoResultsSearch());
      }
      // route
      const changeSearch$ = Observable
        .of(new search.ChangeCurrentCenter(response));
      const geoSearch$ = Observable
        .of(new search.DoGeoSearch(response));

      return Observable.merge(changeSearch$, geoSearch$);
    });

  @Effect() changeCurrentSearchByRadius$ = this.actions$
    .ofType(search.ActionTypes.CHANGE_SEARCH_BY_RADIUS)
    .map(toPayload)
    .switchMap(response => {
      const changeSearch$ = Observable
        .of(new search.ChangeCurrentCenter(response));
      const geoSearch$ = Observable
        .of(new search.DoGeoSearch(response));

      return Observable.merge(changeSearch$, geoSearch$);
    });

  @Effect() updateGeoSearch$ = this.actions$
    .ofType(search.ActionTypes.DO_GEO_SEARCH)
    .map(toPayload)
    .switchMap(payload => {
      return this.geosearchingService.getPlaces(payload);
    })
    .switchMap(response => {
      // TODO check if it exists a better rxjs operator option
      if (response.action === GEO_KEY_ENTER) {
        return Observable.of(new search.AddGeoPlace(response));
      }
      if (response.action === GEO_KEY_EXIT) {
        return Observable.of(new search.RemoveGeoPlace(response));
      }
    });

  constructor(private actions$: Actions,
              private geocodeService: GeocodeService,
              private geosearchingService: GeosearchingService) {
  }

}
