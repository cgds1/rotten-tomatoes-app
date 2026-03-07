import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  standalone: false,
})
export class CommentFormComponent implements OnInit {
  @Input() movieId!: string;
  @Input() existingComment?: Comment;

  form!: FormGroup;
  isSubmitting = false;

  get isEditMode(): boolean {
    return !!this.existingComment;
  }

  get charCount(): number {
    return this.form?.get('content')?.value?.length || 0;
  }

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      score: [this.existingComment?.score || 0, [Validators.required, Validators.min(1), Validators.max(10)]],
      content: [
        this.existingComment?.content || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(2000)],
      ],
    });
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const data = this.form.value;

    this.modalCtrl.dismiss(
      {
        score: data.score,
        content: data.content,
        commentId: this.existingComment?.id,
      },
      this.isEditMode ? 'edit' : 'create',
    );
  }
}
