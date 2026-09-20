import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookResponse} from '../../../../services/models/book-response';
import {DecimalPipe} from '@angular/common';
import {Rating} from '../rating/rating';

const DEFAULT_BOOK_COVER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlMmUyIi8+CiAgPHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjE4NCIgaGVpZ2h0PSIyODQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2JiYiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0OCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzg4OCI+Tm8gQ292ZXI8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI1NiUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iI2FhYSI+QXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';

@Component({
  imports: [Rating],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
class BookCard {
  private _book: BookResponse = {};
  private _manage = false;
  private _bookCover: string | undefined;

  get book(): BookResponse {
    return this._book;
  }

  @Input()
  set book(value: BookResponse) {
    this._book = value;
  }

  get manage(): boolean {
    return this._manage;
  }

  @Input()
  set manage(value: boolean) {
    this._manage = value;
  }

  get bookCover(): string | undefined {
    if (this._book.coverImage) {
      return 'data:image/jpeg;base64,' + this._book.coverImage;
    }
    return DEFAULT_BOOK_COVER;
  }

  @Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();

  protected onShowDetails() {
    this.details.emit(this.book);
  }

  protected onBorrow() {
    this.borrow.emit(this.book);
  }

  protected onAddToWaitingList() {
    this.addToWaitingList.emit(this.book);
  }

  protected onEdit() {
    this.edit.emit(this.book);
  }

  protected onShare() {
    this.share.emit(this.book);
  }

  protected onArchive() {
    this.archive.emit(this.book);
  }
}

export default BookCard
