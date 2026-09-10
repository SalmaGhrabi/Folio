import {Component, OnInit, signal} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {Router} from '@angular/router';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';

@Component({
  imports: [],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList implements OnInit {

  protected bookResponse = signal<PageResponseBookResponse>({});
  private page = 0;
  private size = 5;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findAllBooks({
      page: this.page,
      size: this.size
    }).then(
     (books) => {
       console.log("Backend response: ", books);
       this.bookResponse.set(books);
     })
    .catch((e) => {
      console.error("Error getting book list", e);
    })
  }
}
