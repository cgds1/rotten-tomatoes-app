import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommentFormComponent } from './comment-form.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SharedModule],
  declarations: [CommentFormComponent],
})
export class CommentFormModule {}
