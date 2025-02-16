import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
//import { Share } from '@capacitor/share';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: false,
})
export class ArticleComponent  implements OnInit {
  @Input() article: Article | undefined;
  @Input() index: number = 0;

  constructor(
    private platfform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialShare: SocialSharing,
    private storageService: StorageService,

  ) { }

  ngOnInit() {}


  async onOpenMenu() {
    let articleInFavorite = false; // Definir la variable antes del if

    if (this.article) {
      articleInFavorite = this.storageService.articleInFavorite(this.article);
    } else {
      console.error("Error: article es undefined");
    }

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle(),
    };

    const normalBtns: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Remover Favorito' : 'Favorito',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite(),
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
      },
    ];

    if (this.platfform.is('capacitor')) {
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns,
    });

    await actionSheet.present();
  }


  onShareArticle()
  {
    this.socialShare.share(
      this.article?.title,
      this.article?.source.name,
      undefined,
      this.article?.url
    );
  }

  onToggleFavorite()
  {
    if (this.article)
    {
      this.storageService.saveRemoveArticle(this.article);
    }
    else
    {
      console.error("Error: article es undefined");
    }
  }

  openArticle()
  {
    if (this.platfform.is('ios') || this.platfform.is('android'))
    {
      if (this.article?.url) {  // Verificamos que la URL existe
        const browser = InAppBrowser.create(this.article.url, '_system');
        browser.show();
      } else {
        console.error('La URL no está definida');
      }
      return;
    }
    else
    {
      window.open(this.article?.url, '_blank');
    }

  }


}
