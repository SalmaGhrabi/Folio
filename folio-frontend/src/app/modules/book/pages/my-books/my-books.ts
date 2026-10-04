import {Component, computed, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookService} from '../../../../services/services/book.service';
import {Router, RouterLink} from '@angular/router';
import {BookResponse} from '../../../../services/models/book-response';
import BookCard from '../../components/book-card/book-card';
import {CommonModule} from '@angular/common';

@Component({
  imports: [
    ReactiveFormsModule, BookCard, CommonModule, FormsModule, RouterLink
  ],
  selector: 'app-my-books',
  styleUrl: './my-books.css',
  templateUrl: './my-books.html',
})
export class MyBooks implements OnInit {
  protected bookResponse = signal<PageResponseBookResponse>({});
  protected page = signal<number>(0);
  protected size = signal<number>(5);

  protected totalPages = computed(() => this.bookResponse()?.totalPages ?? 0);

  protected isLastPage = computed(() => this.page() >= this.totalPages() -1 || this.totalPages() === 0);

  protected visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 5) {
      return Array.from(Array(total)).map((_, i) => i);
    }
    let start = Math.max(0, current-2);
    let end = Math.min(current+2, total-1);

    if (current <= 2) {
      end = 4;
    } else if (current >= total - 3) {
      start = total -5;
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findAllBooksByOwner({
      page: this.page(),
      size: this.size()
    }).then(
      (books) => {
        console.log("Backend response: ", books);
        this.bookResponse.set(books);
      })
      .catch((e) => {
        console.error("Error getting book list", e);
      })
  }

  protected onSizeChange(size: number) {
    this.size.set(size);
    this.page.set(0);
    this.findAllBooks();
  }

  protected goToFirstPage() {
    if (this.page() > 0) {
      this.page.set(0);
      this.findAllBooks();
    }
  }

  protected goToPreviousPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.findAllBooks();
    }
  }

  protected goToPage(index: number) {
    if (index >= 0 && index < this.totalPages() && index !== this.page()) {
      this.page.set(index);
      this.findAllBooks();
    }
  }

  protected goToNextPage() {
    if (!this.isLastPage()) {
      this.page.update(p => p + 1);
      this.findAllBooks();
    }
  }

  protected goToLastPage() {
    if (!this.isLastPage()) {
      this.page.set(this.totalPages() - 1);
      this.findAllBooks();
    }
  }

  protected archiveBook(book: BookResponse) {

  }

  protected shareBook(book: BookResponse) {

  }

  protected editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id])
  }

  protected readonly visualViewport = visualViewport;
}
