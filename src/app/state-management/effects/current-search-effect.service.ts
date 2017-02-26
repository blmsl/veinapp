import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CHANGE_SEARCH_FROM_ADDRESS, changeCurrentSearchFromAddress } from '../actions/current-search-action';
import { warnSearchResult } from '../actions/search-result-action';
import { SearchingStates } from '../states/search-result-state';
import { GeocodeService } from '../../geo/geo.module';

@Injectable()
export class CurrentSearchEffectService {

  @Effect() changeCurrentSearchFromGeocode$ = this.action$
    .ofType(CHANGE_SEARCH_FROM_ADDRESS)
    .map(toPayload)
    .switchMap(payload =>
      this.geocodeService.getCoords(payload.address)
    )
    .switchMap(response => {
      if (!response) {
        return Observable
          .of(warnSearchResult(SearchingStates.HasNoResults));
      }

      const change$ = Observable
        .of(changeCurrentSearchFromAddress(response));
      const hasResults$ = Observable
        .of(warnSearchResult(SearchingStates.HasResults));

      return Observable.merge(change$, hasResults$);
    });

  constructor(private action$: Actions,
              private geocodeService: GeocodeService) {
  }

}
