import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public name = '';
  public lastname = '';
  public email = '';

  public appPages = [
    { title: 'Usuarios', url: '/folder/Usuarios', icon: 'person' },
    { title: 'Especialistas', url: '/folder/Especialistas', icon: 'medkit' },
    // { title: 'Pacientes', url: '/folder/Pacientes', icon: 'person-circle' },
  ];

  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private storage: Storage,
    public alertController: AlertController,
    private router: Router
  ) {


  }

  ngOnInit() {

    this.platform.ready().then(() => {

      // Limpiar variables globales antes de iniciar aplicación
      this.storage.clear();

      this.storage.get('name').then((val) => {
        this.name = val;
      });

      this.storage.get('lastname').then((val) => {
        this.lastname = val;
      });

      this.storage.get('email').then((val) => {
        this.email = val;
      });

    });
  }

  
  async alertLogout(title, msg) {

    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: title,
      message: msg,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          handler: (alertData) => {
            this.platform.ready().then(() => {

              this.router.navigate(['login']);

              this.storage.clear(); //LIMPIAR VARIABLES DE ENTORNO
            });

            this.ngOnInit();

          }
        }
      ]
    });

    await alert.present();


  }
}