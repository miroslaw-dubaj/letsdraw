import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { filter, map, take } from 'rxjs/operators';
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
  wants?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users: User[] = [
    {
      name: 'Mirek',
      email: 'jahjahscript@gmail.com',
      didDraw: false,
      excluded: ['Justyna'],
    },
    {
      name: 'Justyna',
      email: 'justdubaj@gmail.com',
      didDraw: false,
      excluded: ['Mirek'],
    },
    {
      name: 'Aneta',
      email: 'aneta.baraniecka88@gmail.com',
      didDraw: false,
      excluded: ['Tobiasz'],
    },
    {
      name: 'Tobiasz',
      email: 'tobiasz.wilkowski@gmail.com',
      didDraw: false,
      excluded: ['Aneta'],
    },
    {
      name: 'Marta',
      email: 'marta.baraniecka@gmail.com',
      didDraw: false,
    },
    {
      name: 'Mieczysław',
      email: 'dziadzio.miecio@interia.pl',
      didDraw: false,
      excluded: ['Teresa'],
    },
    {
      name: 'Teresa',
      email: 'babcia.teresa@interia.pl',
      didDraw: false,
      excluded: ['Mieczysław'],
    },
  ];

  visibleResult: boolean = false;
  drawedWantsToGet: string;

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

    this.itemsRef
      .snapshotChanges()
      .pipe(
        filter((data) => data != null),
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        if (data.length === 0) {
          this.users.forEach((usr) => this.itemsRef.push(usr));
        }
        if (this.currentUser?.email) {
          this.currentUser = data.find(
            (user) => user.email === this.currentUser.email
          );
        }
        this.users = data;
      });

    this.drawnRef
      .valueChanges()
      .pipe(filter((data) => data != null))
      .subscribe((data) => {
        this.drawn = data;
      });
  }

  draw(): void {
    let randomNumber = Math.floor(Math.random() * this.users.length);

    if (this.currentUser.didDraw) {
      this.snackBar.open(
        this.translate.instant('user.didDraw'),
        this.translate.instant('notification.error'),
        {
          duration: 5000,
          panelClass: 'snackbar-error',
        }
      );
    } else if (this.verifyDraw(randomNumber) && !this.currentUser.didDraw) {
      this.setCurrentUserKey();
      this.currentUser.drawed = this.users[randomNumber].name;
      this.currentUser.didDraw = true;
      this.itemsRef.update(this.currentUser.key, this.currentUser);
      this.drawnRef.push(this.currentUser.drawed);

      this.openDialog();
    } else if (this.drawn.length !== this.users.length) {
      this.draw();
    } else {
      this.snackBar.open(
        'Wszyscy wylosowani',
        this.translate.instant('notification.error'),
        {
          duration: 5000,
          panelClass: 'snackbar-error',
        }
      );
    }
  }

  private verifyDraw(randomNumber): boolean {
    const userExcluded = this.currentUser.excluded?.find(
      (excl: string) => excl === this.users[randomNumber].name
    );
    const alreadyDrawn = this.drawn.find(
      (name: string) => name === this.users[randomNumber].name
    );
    const currentUserDrawn =
      this.users[randomNumber].email === this.currentUser.email;
    return userExcluded || alreadyDrawn || currentUserDrawn ? false : true;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DrawDialogComponent, {
      width: '600px',
      data: { name: this.currentUser.name, drawed: this.currentUser.drawed },
    });

    dialogRef.afterClosed().subscribe(() => this.visibleResult = true);
  }

  setCurrentUserKey() {
    this.itemsRef
      .snapshotChanges()
      .pipe(
        filter((data) => data != null),
        take(1),
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        if (this.currentUser.email) {
          this.currentUser = data.find(
            (user) => user.email === this.currentUser.email
          );
        }
      });
  }

  sendGiftIdea(text: string): void {
    this.currentUser.wants = text;
    this.itemsRef.update(this.currentUser.key, this.currentUser);
  }
}
