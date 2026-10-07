import {Component, computed, OnInit, signal} from '@angular/core';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';
import {BookService} from '../../../../services/services/book.service';
import {FormsModule} from '@angular/forms';
import {FeedbackRequest} from '../../../../services/models/feedback-request';
import {Rating} from '../../components/rating/rating';
import {FeedbackService} from '../../../../services/services/feedback.service';

@Component({
  imports: [FormsModule, Rating],
  selector: 'app-borrowed-book-list',
  styleUrl: './borrowed-book-list.css',
  templateUrl: './borrowed-book-list.html',
})
export class BorrowedBookList implements OnInit {

  protected borrowedBooksResponse = signal<PageResponseBorrowedBookResponse>({});
  protected selectedBook = signal<BorrowedBookResponse | undefined>(undefined);
  protected feedbackRequest: FeedbackRequest = {bookId: 0, comment: ''};
  protected showFeedback = signal<boolean>(true);
  protected feedbackNote = signal<number>(0);
  protected page = signal<number>(0);
  protected size = signal<number>(5);
  protected errorMsg = signal<string[]>([]);

  protected totalPages = computed(() => this.borrowedBooksResponse()?.totalPages ?? 0);
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
    private bookService: BookService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit() {
    this.findAllBorrowedBooks();
  }

  protected openReturnModal(book: BorrowedBookResponse) {
    this.selectedBook.set(book);
    this.feedbackRequest = {bookId: book.id as number, comment: ''};
    this.feedbackNote.set(0);
    this.showFeedback.set(true);
    this.errorMsg.set([]);
  }

  protected closeModal() {
    this.selectedBook.set(undefined);
  }

  protected toggleFeedback() {
    this.showFeedback.update(s => !s);
  }

  protected setRating(note: number) {
    this.feedbackNote.set(note);
    this.feedbackRequest.note = note;
  }

  protected returnBook() {
    this.bookService.returnBorrowedBook({
      'book-id': this.selectedBook()?.id as number
    }).then(() => {
      if (this.showFeedback() && this.feedbackNote() > 0) {
        return this.feedbackService.saveFeedback({
          body: this.feedbackRequest
        });
      }
      return Promise.resolve({} as never);
    }).then(() => {
      this.closeModal();
      this.findAllBorrowedBooks();
    }).catch(() => {
      this.errorMsg.set(['Something went wrong. Please try again.']);
    });
  }

  protected onSizeChange(size: number) {
    this.size.set(size);
    this.page.set(0);
    this.findAllBorrowedBooks();
  }

  protected goToFirstPage() {
    if (this.page() > 0) { this.page.set(0); this.findAllBorrowedBooks(); }
  }

  protected goToPreviousPage() {
    if (this.page() > 0) { this.page.update(p => p - 1); this.findAllBorrowedBooks(); }
  }

  protected goToPage(index: number) {
    if (index >= 0 && index < this.totalPages() && index !== this.page()) {
      this.page.set(index); this.findAllBorrowedBooks();
    }
  }

  protected goToNextPage() {
    if (!this.isLastPage()) { this.page.update(p => p + 1); this.findAllBorrowedBooks(); }
  }

  protected goToLastPage() {
    if (!this.isLastPage()) { this.page.set(this.totalPages() - 1); this.findAllBorrowedBooks(); }
  }

  private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page(),
      size: this.size(),
    }).then((resp) => {
      this.borrowedBooksResponse.set(resp);
    }).catch((e) => {
      console.error('Error getting borrowed books', e);
    });
  }
}
