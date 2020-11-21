import {Component, Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../service/auth.service';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public authService: AuthService,
    public translate: TranslateService
  ) {}

  signup(): void {
    this.authService.signup(this.email.value, this.password.value, this.dialogRef);
  }

  login(): void {
    this.authService.login(this.email.value, this.password.value, this.dialogRef);
  }

  logout(): void {
    this.authService.logout();
  }

  getErrorMessage(): string {
    if (this.email.hasError('required')) {
      return this.translate.instant('loginDialog.errors.required');
    }

    return this.email.hasError('email') ? this.translate.instant('loginDialog.errors.email') : '';
  }
}
