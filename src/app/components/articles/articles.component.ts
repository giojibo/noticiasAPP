import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: false,
})
export class ArticlesComponent  implements OnInit {
  @Input() articles: Article[] = [];
  constructor() { }

  ngOnInit() {}

}
