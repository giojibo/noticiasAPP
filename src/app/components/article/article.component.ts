import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { ActionSheetButton, ActionSheetController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: false,
})
export class ArticleComponent implements OnInit {
  @Input() article: Article | undefined;
  @Input() index: number = 0;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService
  ) { }

  ngOnInit() {}

  async onOpenMenu() {
    if (!this.article) {
      console.error("Error: article es undefined");
      return;
    }

    const articleInFavorite = this.storageService.articleInFavorite(this.article);

    const buttons: ActionSheetButton[] = [
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

    // Verificar si la API Web Share está disponible o si es una plataforma nativa
    if (navigator.share !== undefined || Capacitor.isNativePlatform()) {
      buttons.unshift({
        text: 'Compartir',
        icon: 'share-outline',
        handler: () => this.onShareArticle(),
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons,
    });

    await actionSheet.present();
  }

  async onShareArticle() {
    if (!this.article?.url) {
      console.error('Error: no hay URL para compartir.');
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: this.article.title || 'Artículo',
          text: this.article.description || '',
          url: this.article.url,
          dialogTitle: 'Compartir artículo',
        });
      } else if (navigator.share) {
        await navigator.share({
          title: this.article.title || 'Artículo',
          text: this.article.description || '',
          url: this.article.url,
        });
      } else {
        alert('Tu navegador no admite compartir contenido.');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }

  onToggleFavorite() {
    if (!this.article) {
      console.error("Error: article es undefined");
      return;
    }
    this.storageService.saveRemoveArticle(this.article);
  }

  async openArticle() {
    if (!this.article?.url) {
      console.error('La URL no está definida');
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url: this.article.url });
      } else {
        window.open(this.article.url, '_blank');
      }
    } catch (error) {
      console.error('Error al abrir el artículo:', error);
    }
  }
}
