import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login.component';
import { IonicStorageModule } from '@ionic/storage';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicStorageModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [

  ]
})
export class LoginModule { }
