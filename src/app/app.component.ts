import { Component, OnInit } from '@angular/core';

import {MatDialog} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IdeaDialogComponent } from './idea-dialog/idea-dialog.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { AuthService } from './service/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public translate: TranslateService
    ) {
      translate.setDefaultLang('en');
      translate.use('pl');
    }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (!user) {
        this.openDialog();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '300px',
      disableClose: true,
      autoFocus: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  openIdea(): void {
    const dialogRef = this.dialog.open(IdeaDialogComponent, {
      width: '300px',
      disableClose: true,
      autoFocus: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }


}
