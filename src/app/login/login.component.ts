import { Component, OnInit } from '@angular/core';
import { User } from "../models/user";
import { LoginService } from "../shared/login.service";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../shared/loader.service';
import { AppComponent } from '../app.component';
import { last } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  user: User;

  isHiddenPass = true;

  ip: string = "";
  email: string = "";
  _id: string = "";
  name: string = "";
  lastname: string = "";
  cel: string = "";
  country: string = "";
  typeuser: string = "";
  token: string = "";

  constructor(private appComponent: AppComponent,
    private loginService: LoginService,
    public alertController: AlertController,
    private platform: Platform,
    private router: Router,
    private ionLoader: LoaderService,
    private storage: Storage) {

    this.user = new User();
  }

  ngOnInit() {
    this.user = new User();

  }


  changeHidden() {
    if (this.isHiddenPass) {
      this.isHiddenPass = false;
    } else {
      this.isHiddenPass = true;
    }
  }

  signup() {
    this.router.navigate(['/signup'])
  }


  submit() {
    // Perform the login
    if (!this.user.email || !this.user.pass) {
      this.alert("Debe ingresar un correo y una contraseña");
      return;
    }
    this.ionLoader.showLoader();

    this.user.email = this.user.email.replace(/\s/g, '');

    //Subscribir promesa
    this.loginService.autenticar(
      {
        email: this.user.email,
        password: this.user.pass
      }
    ).subscribe((result: any) => {

      this.email = result.user.email;
      this._id = result.user._id;
      this.name = result.user.name;
      this.lastname = result.user.lastname;
      this.cel = result.user.cel;
      this.country = result.user.country;
      this.typeuser = result.user.typeuser;
      this.token = result.token.accessToken;

      //Declarar variables de entorno
      this.storage.set('_id', this._id);
      this.storage.set('email', this.email);
      this.storage.set('name', this.name);
      this.storage.set('lastname', this.lastname);
      this.storage.set('cel', this.cel);
      this.storage.set('country', this.country);
      this.storage.set('typeuser', this.typeuser);
      this.storage.set('token', result.token.accessToken);

      // Inicializar variables para mostrar en el side menu
      this.appComponent.email = result.user.email;
      this.appComponent.name = result.user.name;
      this.appComponent.lastname = result.user.lastname;

      this.router.navigate(['/folder/Usuarios']);
      this.ionLoader.hideLoader();

    }, (error) => {
      this.alert(error.error.message);
      this.ionLoader.hideLoader();
    }

    );

    this.ionLoader.hideLoader();
  }

  async alert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


  async alertMsg(title, msg) {

    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: title,
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
          }
        },
        {
          text: 'Cancel'
        }]
    });

    await alert.present();
  }
}
