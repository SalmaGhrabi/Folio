import {Component, computed, OnInit, signal} from '@angular/core';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {BookService} from '../../../../services/services/book.service';
import {Rating} from '../../components/rating/rating';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';

@Component({
  imports: [
    Rating,
    ReactiveFormsModule,
    FormsModule
  ],
  selector: 'app-return-books',
  styleUrl: './return-books.css',
  templateUrl: './return-books.html',
})
export class ReturnBooks implements OnInit {
  protected returnedBooksResponse= signal<PageResponseBorrowedBookResponse>({});
  protected page = signal<number>(0);
  protected size = signal<number>(5);
  protected message = signal<string>('');
  protected level = signal<'success' | 'error'>('success');

  protected totalPages = computed(() => this.returnedBooksResponse()?.totalPages ?? 0);
  protected isLastPage = computed(() => this.page() >= this.totalPages() - 1 || this.totalPages() === 0);

  protected visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 5) return Array.from(Array(total)).map((_, i) => i);
    let start = Math.max(0, current - 2);
    let end = Math.min(current + 2, total - 1);
    if (current <= 2) end = 4;
    else if (current >= total - 3) start = total - 5;
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  constructor(
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page(),
      size: this.size(),
    }).then((resp) => {
      this.returnedBooksResponse.set(resp);
    }).catch((e) => {
      console.error('Error getting borrowed books', e);
    });
  }

  protected onSizeChange(size: number) {
    this.size.set(size);
    this.page.set(0);
    this.findAllReturnedBooks();
  }

  protected goToFirstPage() {
    if (this.page() > 0) { this.page.set(0); this.findAllReturnedBooks(); }
  }

  protected goToPreviousPage() {
    if (this.page() > 0) { this.page.update(p => p - 1); this.findAllReturnedBooks(); }
  }

  protected goToPage(index: number) {
    if (index >= 0 && index < this.totalPages() && index !== this.page()) {
      this.page.set(index); this.findAllReturnedBooks();
    }
  }

  protected goToNextPage() {
    if (!this.isLastPage()) { this.page.update(p => p + 1); this.findAllReturnedBooks(); }
  }

  protected goToLastPage() {
    if (!this.isLastPage()) { this.page.set(this.totalPages() - 1); this.findAllReturnedBooks(); }
  }

  protected approveBookReturn(book: BorrowedBookResponse) {
    if (!book.returned){
      this.level.set('error');
      this.message.set('The book is not returned yet');
      return;
    }
    this.bookService.approveReturnBorrowedBook({
      'book-id': book.id as number
    }).then(() => {
      this.level.set('success');
      this.message.set('Book return approved');
      this.findAllReturnedBooks()
    });
  }
}
