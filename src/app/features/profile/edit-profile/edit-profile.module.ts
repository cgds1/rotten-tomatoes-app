import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EditProfilePage } from './edit-profile.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: EditProfilePage }]),
  ],
  declarations: [EditProfilePage],
})
export class EditProfilePageModule {}
