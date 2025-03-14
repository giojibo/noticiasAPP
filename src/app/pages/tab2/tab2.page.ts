import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit{

  @ViewChild ( IonInfiniteScroll, {static: true})  infiniteScroll: IonInfiniteScroll | undefined;

  public categories: string[] = ['business', 'entertainment','general','health','science','sports','technology'];
  public selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  constructor(
    private newsServices: NewsService,
  ) {}

  segmentChanged(event: Event)
  {
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsServices.getTopHeadLinesByCategory(this.selectedCategory)
    .subscribe( articles => {
      this.articles = [...articles]
    })
  }

  ngOnInit(): void {
    console.log(this.infiniteScroll);
    this.newsServices.getTopHeadLinesByCategory(this.selectedCategory)
    .subscribe( articles => {
      this.articles = [...articles]
    })
  }

  loadData( event: any)
  {
    this.newsServices.getTopHeadLinesByCategory(this.selectedCategory, true)
    .subscribe( articles => {

      if( articles.length === this.articles.length)
      {
        this.infiniteScroll!.disabled = true;
        return ;
      }

      this.articles = articles;
      this.infiniteScroll?.complete();
    })
    console.log(this.infiniteScroll);
  }

}
