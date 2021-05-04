import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PasswordValidator } from './passwordvalidator';
import { toastController } from '@ionic/core';
import { LoginService } from "../../shared/login.service";
import { LoaderService } from '../../shared/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  isHiddenPass = true;
  isHiddenConfirmPass = true;

  formlogin: FormGroup;
  errors: string = '';

  validations_form: FormGroup;
  matching_passwords_group: FormGroup;

  constructor(private router: Router, public formBuilder: FormBuilder, private loginService: LoginService,
    private ionLoader: LoaderService) {

  }

  ngOnInit() {

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      country: new FormControl('', Validators.compose([
        // Validators.required
      ])),
      cel: new FormControl('', Validators.compose([
        // Validators.required
      ])),
      matching_passwords: this.matching_passwords_group
    });
  }

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch.' }
    ]
  };

  goLogin() {
    this.router.navigate(['/login'])
  }

  signUp(values) {
    this.ionLoader.showLoader();

    console.log("values: " + JSON.stringify(values));

    //Subscribir promesa
    this.loginService.registrar(
      {
        name: values.name,
        lastname: values.lastname,
        email: values.email,
        country: values.country,
        cel: values.cel,
        password: values.matching_passwords.password,
      }
    ).subscribe((result: any) => {

      this.ionLoader.hideLoader();
      this.openToastOk("Bienvenid@ " + values.name + ", por favor, inicia sesión.")
      this.router.navigate(['/login']);

    }, (error) => {
      this.ionLoader.hideLoader();
      this.openToastCancel(error.error.message);
    });

  }

  openToastCancel = async (msg) => {
    const toast = await toastController.create({
      color: 'dark',
      duration: 2000,
      message: msg,
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.ionLoader.hideLoader();

        }
      }]
    });

    toast.present();

  }

  openToastOk = async (msg) => {
    const toast = await toastController.create({
      color: 'dark',
      duration: 3500,
      message: msg,
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.router.navigate(['/login'])
        }
      }]
    });

    toast.present();

  }
  
  changeHidden() {
    if (this.isHiddenPass) {
      this.isHiddenPass = false;
    } else {
      this.isHiddenPass = true;
    }
  }
  
  changeConfirmHidden() {
    if (this.isHiddenConfirmPass) {
      this.isHiddenConfirmPass = false;
    } else {
      this.isHiddenConfirmPass = true;
    }
  }
}
