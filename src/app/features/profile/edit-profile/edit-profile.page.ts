import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage implements OnInit {
  form!: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navController: NavController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser;
    this.form = this.fb.group({
      name: [user?.name ?? '', [Validators.required, Validators.minLength(2)]],
      email: [{ value: user?.email ?? '', disabled: true }],
    });
  }

  get nameControl() {
    return this.form.get('name')!;
  }

  cancel() {
    this.navController.back();
  }

  async save() {
    if (this.form.invalid || this.saving) return;

    this.saving = true;
    try {
      const user = this.authService.currentUser!;
      await this.authService.updateProfile({
        name: this.form.get('name')!.value,
        email: user.email,
      });

      const toast = await this.toastController.create({
        message: 'Perfil actualizado',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();

      this.navController.back();
    } catch {
      const toast = await this.toastController.create({
        message: 'Error al actualizar el perfil',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.saving = false;
    }
  }
}
