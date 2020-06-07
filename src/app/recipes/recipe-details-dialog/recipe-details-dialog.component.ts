import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-recipe-details-dialog',
  templateUrl: './recipe-details-dialog.component.html',
  styleUrls: ['./recipe-details-dialog.component.scss']
})
export class RecipeDetailsDialogComponent implements OnInit {
  recipeId: number;
  recipeTitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: number
  ) {
    this.recipeId = data ? +data : null;
  }

  ngOnInit(): void {
  }
}
