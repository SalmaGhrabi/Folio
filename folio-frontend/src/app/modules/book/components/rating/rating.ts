import {Component, Input} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-rating',
  styleUrl: './rating.css',
  templateUrl: './rating.html',
})
export class Rating {

  @Input() rating: number=0;
  maxRating: number=5;

  get fullStars(): number {
    return Math.floor(this.rating);
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 != 0;
  }

  get emptyStars():number {
    return this.maxRating - Math.ceil(this.rating);
  }
}
