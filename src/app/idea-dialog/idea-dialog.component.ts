import {Component, Inject, OnInit} from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../service/users.service';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-idea-dialog',
  templateUrl: './idea-dialog.component.html',
  styleUrls: ['./idea-dialog.component.scss']
})
export class IdeaDialogComponent implements OnInit {

  form: FormGroup

  constructor(
    public dialogRef: MatDialogRef<IdeaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translate: TranslateService,
    public usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idea: new FormControl('')
    })
  }

  onClick(): void {
    this.usersService.sendGiftIdea(this.form.controls.idea.value)
    console.log(this.data, this.form, this.usersService.currentUser);
  }
}
