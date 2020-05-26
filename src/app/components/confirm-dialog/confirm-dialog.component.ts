import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IConfirmData } from 'src/app/models/else/confirm-data';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  question: string;
  confirm: string;
  cancel: string;
  focusOnConfirm: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: IConfirmData
  ) {
    this.question = data?.question || 'Підтвердіть дію';
    this.confirm = data?.confirmation || 'Підтвердити';
    this.focusOnConfirm = data?.focusOnConfirm;
    this.cancel = data?.cancellation || 'Скасувати';
  }

  ngOnInit(): void {
  }

}
