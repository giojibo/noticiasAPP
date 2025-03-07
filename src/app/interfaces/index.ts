export interface NewResponse
{
  status:       string;
  totalResults: number;
  articles:     Article[];
}

export interface Article {
  source: Source;
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt: string;
  content?: string | null; // Permite que content sea string o null
}

export interface Source {
  id?: string | null | undefined; // id puede ser string, null o undefined
  name: string;
}

export interface ArticleByCategoryAndPage
{
  [key: string] :
    {
      page: number,
      articles: Article[],
    }

}
