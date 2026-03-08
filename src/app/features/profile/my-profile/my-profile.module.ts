import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MyProfilePage } from './my-profile.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: MyProfilePage },
      {
        path: 'edit',
        loadChildren: () =>
          import('../edit-profile/edit-profile.module').then(
            (m) => m.EditProfilePageModule
          ),
      },
    ]),
  ],
  declarations: [MyProfilePage],
})
export class MyProfilePageModule {}
