import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-draw-dialog',
  templateUrl: './draw-dialog.component.html',
  styleUrls: ['./draw-dialog.component.scss']
})
export class DrawDialogComponent implements OnInit {

  rollingDices = true;

  constructor(
    public dialogRef: MatDialogRef<DrawDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.rollingDices = false, 5000);
  }
}
