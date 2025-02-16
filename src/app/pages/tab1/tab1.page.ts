import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  @ViewChild ( IonInfiniteScroll, {static: true})  infiniteScroll: IonInfiniteScroll | undefined;

  public articles: Article[] = [];

  constructor(
    private newsServices: NewsService
  ) {}

  ngOnInit()
  {
    this.newsServices.getTopheadLines()
    .subscribe( articles => this.articles.push(...articles));
  }

  loadData( event: any)
  {
    this.newsServices.getTopHeadLinesByCategory('business', true)
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
