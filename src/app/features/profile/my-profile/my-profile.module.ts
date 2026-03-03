import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MyProfilePage } from './my-profile.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: MyProfilePage }]),
  ],
  declarations: [MyProfilePage],
})
export class MyProfilePageModule {}
