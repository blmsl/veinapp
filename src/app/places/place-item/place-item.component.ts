import {
  Component,
  OnInit,
  OnDestroy,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../state-management/reducers';
import * as search from '../../state-management/actions/current-search-action';
import { GeosearchResult } from '../../geo/geosearching/geosearch';

@Component({
  selector: 'app-place-item',
  templateUrl: './place-item.component.html',
  animations: [
    trigger('item', [
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('* => visible', animate('200ms ease-in'))
    ])
  ]
})
export class PlaceItemComponent implements OnInit, OnDestroy {
  state = 'visible';
  place: GeosearchResult;
  private routeParamSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.routeParamSubscription = this.activatedRoute.params
      .take(1)
      .map(param => param[ '$key' ])
      .switchMap((key: string) => {
        return this.store.select(fromRoot.places)
          .withLatestFrom(Observable.of(key));
      })
      .map((data) => data[ 0 ]
        .filter((place) => place[ '$key' ] === data[ 1 ])[ 0 ]
      )
      .subscribe((place) => {
        this.store
          .dispatch(new search.SelectedPlace({ selectedPlace: place }));
        this.place = place;
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new search.SelectedPlace({ selectedPlace: null }));
    this.routeParamSubscription.unsubscribe();
  }

  goBack() {
    this.router.navigate([ '/' ]);
  }
}
