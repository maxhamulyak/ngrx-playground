import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import * as collection from '../actions/entity.collection.actions';
import { Entity } from '../models/entity';

@Injectable()
export class EntityCollectionEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    console.log('openDB$:');
    return this.db.open('books_app');
  });

  @Effect()
  loadCollection$: Observable<Action> = this.actions$
    .ofType(collection.LOAD)
    .switchMap(() => {
      console.log('loadCollection$');
      // orignal no { } and no return
      return this.db
        .query('books')
        .toArray()
        .map((books: Entity[]) => new collection.LoadSuccessAction(books))
        .catch(error => of(new collection.LoadFailAction(error)))
    });

  @Effect()
  addBookToCollection$: Observable<Action> = this.actions$
    .ofType(collection.ADD_BOOK)
    .map((action: collection.AddBookAction) => action.payload)
    .mergeMap(book => {
      // orignal no { } and no return
      console.log('addBookToCollection$', book);
      return this.db
        .insert('books', [book])
        .map(() => new collection.AddBookSuccessAction(book))
        .catch(() => of(new collection.AddBookFailAction(book)))
    });

  @Effect()
  removeBookFromCollection$: Observable<Action> = this.actions$
    .ofType(collection.REMOVE_BOOK)
    .map((action: collection.RemoveBookAction) => action.payload)
    .mergeMap(book => {
      // orignal no { } and no return
      console.log('removeBookFromCollection$');
      return this.db
        .executeWrite('books', 'delete', [book.id])
        .map(() => new collection.RemoveBookSuccessAction(book))
        .catch(() => of(new collection.RemoveBookFailAction(book)))
    });

  constructor(private actions$: Actions, private db: Database) {}
}
