import { Component, OnInit, OnDestroy } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { IFilterModel } from 'src/app/models/server/filter-models';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-limits-search-section',
  templateUrl: './limits-search-section.component.html',
  styleUrls: ['./limits-search-section.component.scss']
})
export class LimitsSearchSectionComponent implements OnInit, OnDestroy {

  formModel: FormGroup;
  private subscriptions = new Subscription();

  constructor(
    public filterService: FiltersService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formModel = this.formBuilder.group({
      duration: this.formBuilder.group({
        min: [null, [Validators.min(0), Validators.pattern(/^[0-9]*$/)]],
        max: [null, [Validators.min(0), Validators.pattern(/^[0-9]*$/)]]
      }, { validator: this.validateRange }),
      calories: this.formBuilder.group({
        min: [null, Validators.min(0)],
        max: [null, Validators.min(0)]
      }, { validator: this.validateRange }),
      name: ['']
    });

    const duration = this.formModel.get('duration');
    const calories = this.formModel.get('calories');
    const name = this.formModel.get('name');

    this.subscriptions.add(duration.valueChanges.subscribe(value => {
      this.filterService.currFilter.maxDuration = duration.get('max').invalid ? null : value.max;
      this.filterService.currFilter.minDuration = duration.get('min').invalid ? null : value.min;
    }));

    this.subscriptions.add(name.valueChanges.subscribe(value => {
      this.filterService.currFilter.recipeTitle = value;
    }));

    this.subscriptions.add(calories.valueChanges.subscribe(value => {
      this.filterService.currFilter.maxCalories = calories.get('max').invalid ? null : value.max;
      this.filterService.currFilter.minCalories = calories.get('min').invalid ? null : value.min;
    }));

    this.subscriptions.add(this.filterService.onCurrFilterChanged$.subscribe(filter =>
      this.formModel.patchValue({
        duration: {
          min: filter?.minDuration,
          max: filter?.maxDuration
        },
        calories: {
          min: filter?.minCalories,
          max: filter?.maxCalories
        },
        name: filter?.recipeTitle
      })
    ));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  validateRange(fg: FormGroup) {
    const minCtrl = fg.get('min');
    const maxCtrl = fg.get('max');
    const minValue = +minCtrl?.value;
    const maxValue = +maxCtrl?.value;
    if (minValue && maxValue && minValue > maxValue) {
      maxCtrl?.setErrors({ invalidRange: true });
      minCtrl?.setErrors({ invalidRange: true });
      return;
    }
    if (maxCtrl?.hasError('invalidRange')) {
      maxCtrl.setErrors(null);
      maxCtrl.updateValueAndValidity();
    }
    if (minCtrl?.hasError('invalidRange')) {
      minCtrl?.setErrors(null);
      minCtrl.updateValueAndValidity();
    }
  }

  get filter(): IFilterModel {
    return this.filterService.currFilter;
  }
}
