import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DrawDialogComponent } from '../draw-dialog/draw-dialog.component';

export interface User {
  name: string;
  email?: string;
  img?: string;
  didDraw: boolean;
  drawed?: string;
  excluded?: string[];
  key?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[] = [
    {
      name: 'Mirek',
      email: 'jahjahscript@gmail.com',
      didDraw: false,
      excluded: [
        'Justyna'
      ]
    },
    {
      name: 'Justyna',
      email: 'justyna',
      didDraw: false,
      excluded: [
        'Mirek'
      ]
    },
    {
      name: 'Aneta',
      email: 'aneta',
      didDraw: false,
      excluded: [
        'Tobiasz'
      ]
    },
    {
      name: 'Tobiasz',
      email: 'tobiasz',
      didDraw: false,
      excluded: [
        'Aneta'
      ]
    },
    {
      name: 'Marta',
      email: 'marta',
      didDraw: false
    }
  ];

  currentUser: any;

  drawn: string[] = [];

  itemsRef: AngularFireList<User>;
  drawnRef: AngularFireList<string>;


  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    public db: AngularFireDatabase,
    public dialog: MatDialog

  ) {
    this.itemsRef = db.list('users');
    this.drawnRef = db.list('drawn');

    // Save Users
    // this.users.forEach(usr => this.itemsRef.push(usr));

    this.itemsRef.snapshotChanges().pipe(filter(data => data != null), map(changes =>
      changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
    )).subscribe(data => {
      this.users = data;
    });

    this.drawnRef.valueChanges().pipe(filter(data => data != null)).subscribe(data => {
      this.drawn = data;
    });
  }

  draw(): void {
    const randomNumber = Math.floor(Math.random() * this.users.length);
    if (this.currentUser.didDraw) {
      this.snackBar.open(this.translate.instant('user.didDraw'),
        this.translate.instant('notification.error'), {
        duration: 5000,
        panelClass: 'snackbar-error'
      });
    } else if (this.users[randomNumber].email === this.currentUser.email) {
      this.draw();
    } else if (this.currentUser.excluded?.find((excl: string) => excl === this.users[randomNumber].name)) {
      this.draw();
    } else if (this.drawn.find((name: string) => name === this.users[randomNumber].name)) {
      this.draw();
    } else if (!this.currentUser.didDraw) {
      this.currentUser.drawed = this.users[randomNumber].name;
      this.currentUser.didDraw = true;
      console.log("UsersService -> draw -> this.currentUser.key", this.currentUser);
      this.itemsRef.update(this.currentUser.key, this.currentUser);
      this.drawnRef.push(this.currentUser.drawed);

      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DrawDialogComponent, {
      width: '600px',
      data: { name: this.currentUser.name, drawed: this.currentUser.drawed }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
