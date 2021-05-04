import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../shared/login.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public users: [];
  public administradores: [];
  public especialistas: [];

  public _id: string;
  public name: string;
  public lastname: string;
  public cel: string;
  public country: string;
  public email: string;
  public typeuser: string = "";

  public isUsuariosSelected = false;
  public isEspecialistasSelected = false;
  public isPacientesSelected = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private LoginService: LoginService,
    private storage: Storage) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.folder == "Usuarios") {
      this.isUsuariosSelected = true;
      this.isEspecialistasSelected = false;
      this.isPacientesSelected = false;
    } else if (this.folder == "Especialistas") {
      this.isUsuariosSelected = false;
      this.isEspecialistasSelected = true;
      this.isPacientesSelected = false;
    } else if (this.folder == "Pacientes") {
      this.isUsuariosSelected = false;
      this.isEspecialistasSelected = false;
      this.isPacientesSelected = true;
    }

    this.storage.get('_id').then((val) => {
      this._id = val;
      console.log(val);

    });


    this.storage.get('name').then((val) => {
      this.name = val;
    });

    this.storage.get('lastname').then((val) => {
      this.lastname = val;
    });

    this.storage.get('cel').then((val) => {
      this.cel = val;
    });

    this.storage.get('email').then((val) => {
      this.email = val;
    });

    this.storage.get('country').then((val) => {
      this.country = val;
    });

    this.storage.get('typeuser').then((val) => {
      this.typeuser = val;
    });

    // Cargar lista con todos los usuarios
    this.LoginService.obtenerUsuarios().subscribe((result: any) => {

      this.users = result.usuarios;

      let self = this;
      self.administradores = [];
      self.especialistas = [];

      //Recorrer lista de todos los usuarios para separar en listas independientes a administradores y especialistas
      for (let i = 0; i < this.users.length; i++) {
        // // Separar lista de administradores
        if (this.users[i]['typeuser'] == 1) {
          self.administradores.push(this.users[i]);
        }

        // Separar lista de especialistas
        if (this.users[i]['typeuser'] == 2) {
          this.especialistas.push(this.users[i]);
        }

      }

    }, (error) => {
      console.log(JSON.stringify(error));
    }
    );

  }

  //Borrar usuario del datatable
  deleteUser(row) {

    this.storage.get('_id').then((val) => {
      if (val == row['_id']) {
        this.alertMsg("ERROR", "No puede borrar el usuario con el que inició sesión.");

      } else {

        this.LoginService.eliminarUsuarioPorId(row['_id']).subscribe((result: any) => {

          this.alertMsg("OK", "El usuario se ha eliminado con éxito.");

          this.ngOnInit();

        }, (error) => {
          this.alertMsg("ERROR", error.error.message);
        });

      }
    });

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

  async editUser(row) {

    const alert = await this.alertController.create({
      cssClass: 'alert-input',
      header: "Editar usuario",
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: row['name'],
          placeholder: 'Nombre(s)'
        },
        {
          name: 'lastname',
          type: 'text',
          value: row['lastname'],
          placeholder: 'Apellido(s)'
        },
        {
          name: 'cel',
          type: 'number',
          value: row['cel'],
          placeholder: 'Celular'
        },
        {
          name: 'country',
          type: 'text',
          value: row['country'],
          placeholder: "País"
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          handler: (alertData) => {

            this.LoginService.cambiarName(
              {
                name: alertData.name,
                lastname: alertData.lastname
              }, row['_id']
            ).subscribe((result: any) => {

              this.storage.set('name', alertData.name);
              this.storage.set('lastname', alertData.lastname);
              this.name = alertData.name;
              this.lastname = alertData.lastname;

              console.log(result);

            }, (error) => {
              console.log(JSON.stringify(error));
            }
            );

            //Cambiar pais
            this.LoginService.cambiarCountry(
              {
                country: alertData.country
              }, this._id
            ).subscribe((result: any) => {

              this.storage.set('country', alertData.country);
              this.country = alertData.country;
              console.log(result);

            }, (error) => {
              console.log(JSON.stringify(error));
            }
            );

            //Cambiar celular
            this.LoginService.cambiarCel(
              {
                cel: alertData.cel
              }, this._id
            ).subscribe((result: any) => {

              this.storage.set('cel', alertData.cel);
              this.cel = alertData.cel;
              console.log(result);

            }, (error) => {
              console.log(JSON.stringify(error));
            }
            );

            this.ngOnInit();

          }
        }
      ],

    });

    await alert.present();

  }

  changeTypeUser(row) {

    // Obtener tipo de usuario para determinar si debe ser especialista o adminsitrador
    this.LoginService.obtenerUsuarioPorId(row['_id']).subscribe((result: any) => {

      if (result['usuario']['typeuser'] == 1) {
        this.storage.get('_id').then((val) => {
          if (val == row['_id']) {
            this.alertMsg("ERROR", "No puede cambiar el tipo de usuario del usuario con el que inició sesión.")
          } else {
            // Cambiar el tipo de usuario
            this.LoginService.cambiarTypeUser(row['_id'], {
              typeuser: 2
            }).subscribe((result: any) => {

              this.alertMsg("OK", "Se ha cambiado el tipo de usuario");
              this.ngOnInit();

            });

          }

        }, (error) => {
          console.log(JSON.stringify(error));
        }
        );

      } else {

        this.storage.get('_id').then((val) => {
          if (val == row['_id']) {
            this.alertMsg("ERROR", "No puede cambiar el tipo de usuario del usuario con el que inició sesión.")
          } else {

            // Cambiar el tipo de usuario
            this.LoginService.cambiarTypeUser(row['_id'], {
              typeuser: 1
            }).subscribe((result: any) => {

              this.alertMsg("OK", "Se ha cambiado el tipo de usuario");
              this.ngOnInit();
            });
          }

        }, (error) => {
          console.log(JSON.stringify(error));
        }
        );
      }

    }, (error) => {
      console.log(JSON.stringify(error));
    }
    );


  }
}
