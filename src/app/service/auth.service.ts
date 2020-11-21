import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { User, UsersService } from './users.service';
import { filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<any>;
  email = '';
  currentUser: User | undefined;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private usersService: UsersService
    ) {
    this.user = firebaseAuth.authState;
    this.user.pipe(filter(data => data != null)).subscribe(data => {
      this.email = data.email;
      this.currentUser = this.getCurrentUser();
    });
  }

  signup(email: string, password: string, dialogRef: MatDialogRef<LoginDialogComponent>): void {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.snackBar.open(this.translate.instant('user.created') + ' ' + value.user?.email,
        this.translate.instant('notification.success') , {
          duration: 5000,
          panelClass: 'snackbar-success'
        });
        dialogRef.close();
      })
      .catch(err => {
        this.snackBar.open(err.message, this.translate.instant('notification.error'), {
          duration: 5000,
          panelClass: 'snackbar-error'
        });
      });
  }

  login(email: string, password: string, dialogRef: MatDialogRef<LoginDialogComponent>): void {
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.snackBar.open(this.translate.instant('user.logged'),
        this.translate.instant('notification.success'), {
          duration: 5000,
          panelClass: 'snackbar-success'
        });
        dialogRef.close();
      })
      .catch(err => {
        this.snackBar.open(err.message, this.translate.instant('notification.error'), {
          duration: 5000,
          panelClass: 'snackbar-error'
        });
      });
  }

  logout(): void {
    this.firebaseAuth.signOut();
  }

  getCurrentUser(): User | undefined {
    const usr =  this.usersService.users.find(user => user.email === this.email);
    if (usr) {
      this.usersService.currentUser = usr;
    }
    return usr;
  }
}