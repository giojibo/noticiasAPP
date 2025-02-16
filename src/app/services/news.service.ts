import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, NewResponse } from '../interfaces';
import { map, Observable, of } from 'rxjs';
import { ArticleByCategoryAndPage } from '../interfaces';

const apikey = environment.apikey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(
    private http: HttpClient,
  ) { }

  private articlesByCategoryAndPages: ArticleByCategoryAndPage ={}
  private executeQuery<T> ( endpoint: string)
  {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apikey: apikey,
        country: 'us',
      }
    })
  }

  getTopheadLines(): Observable<Article[]>
  {

    return this.getArticlesByCategory('business');
    /* return this.executeQuery<NewResponse>(`/top-headlines?category=business`)
    .pipe(
      map(({articles}) => articles)
    );*/
  }

  getTopHeadLinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]>
  {

    if(loadMore)
    {
      return this.getArticlesByCategory(category);
    }

    if(this.articlesByCategoryAndPages[category])
    {
      return of(this.articlesByCategoryAndPages[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory ( category: string): Observable<Article[]>
  {
    if( Object.keys( this.articlesByCategoryAndPages ).includes(category) )
    {
      //Si ya existe
      //this.articlesByCategoryAndPages[category].page += 0;
    }
    else
    {
      //No existe
      this.articlesByCategoryAndPages[category] =
      {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPages[category].page + 1;

    return this.executeQuery<NewResponse>(`/top-headlines?category=${category}&page=${page}`)
    .pipe(
      map( ({articles}) => {

        if( articles.length === 0) return this.articlesByCategoryAndPages[category].articles;

        this.articlesByCategoryAndPages[category] = {
          page: page,
          articles: [...this.articlesByCategoryAndPages[category].articles, ...articles]
        }

        return this.articlesByCategoryAndPages[category].articles;
      })
    );
  }
}
