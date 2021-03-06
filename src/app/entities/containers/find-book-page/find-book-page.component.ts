import 'rxjs/add/operator/take';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromBooks from '../../reducers';
import * as book from '../../actions/book';
import { Entity } from '../../models/entity';

@Component({
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './find-book-page.component.html',
  styleUrls: ['./find-book-page.component.scss']
})
export class FindBookPageComponent {
  searchQuery$: Observable<string>;
  books$: Observable<Entity[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromBooks.State>) {
    console.log('{ FindBookPageComponent } constructor');
    this.searchQuery$ = store.select(fromBooks.getSearchQuery).take(1);
    this.books$ = store.select(fromBooks.getSearchResults);
    this.loading$ = store.select(fromBooks.getSearchLoading);
  }

  search(query: string) {
    this.store.dispatch(new book.SearchAction(query));
  }
}
