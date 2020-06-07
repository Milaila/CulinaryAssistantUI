import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-details-dialog',
  templateUrl: './recipe-details-dialog.component.html',
  styleUrls: ['./recipe-details-dialog.component.scss']
})
export class RecipeDetailsDialogComponent implements OnInit, OnDestroy {
  recipeId: number;
  recipeTitle: string;
  subs = new Subscription();

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<RecipeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: number
  ) {
    this.recipeId = data ? +data : null;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(this.router.events.subscribe(_ => {
      this.dialogRef.close();
    }));
  }
}
