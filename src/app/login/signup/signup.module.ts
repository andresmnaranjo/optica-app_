import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SignupComponent } from './signup.component';

import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: SignupComponent
  }
];

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)

  ], providers: [
    FormControl
  ]
})
export class SignupModule { }
