import {ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import { BookRequest } from '../../../../services/models/book-request';
import { BookService } from '../../../../services/services/book.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-manage-book',
  styleUrl: './manage-book.css',
  templateUrl: './manage-book.html',
})
export class ManageBook implements OnInit {

  errorMsg = signal<string[]>([]);
  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: ''
  };
  selectedBookCover: File | undefined;
  selectedPicture = signal<string | undefined>(undefined);
  isEditMode = signal<boolean>(false);
  private cd = inject(ChangeDetectorRef);

  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const bookId = this.activatedRoute.snapshot.params['bookId'];

    if (bookId) {
      this.isEditMode.set(true);

      this.bookService.findBookById({ 'book-id': bookId })
        .then((book) => {
          this.bookRequest = {
            id: book.id,
            title: book.title as string,
            authorName: book.authorName as string,
            isbn: book.isbn as string,
            synopsis: book.synopsis as string,
            shareable: book.shareable
          };
          if (book.coverImage) {
            this.selectedPicture.set('data:image/jpeg;base64,' + book.coverImage);
            this.cd.detectChanges();
          }
          this.cd.detectChanges();
        })
        .catch(() => {
          this.errorMsg.set(['Failed to load book details.']);
          this.cd.detectChanges();
        });
    }
  }

  async saveBook() {
    this.errorMsg.set([]);

    try {
      const bookId = await this.bookService.saveBook({ body: this.bookRequest });

      if (this.selectedBookCover) {
        await this.bookService.uploadBookCoverPicture({
          'book-id': bookId,
          body: { file: this.selectedBookCover }
        });
      }

      await this.router.navigate(['/books/my-books']);
    } catch (err: any) {
      if (err.error?.validationErrors) {
        this.errorMsg.set(err.error.validationErrors);
      } else {
        this.errorMsg.set(['Something went wrong. Please try again.']);
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedBookCover = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedPicture.set(undefined);
    this.selectedBookCover = undefined;
  }
}
