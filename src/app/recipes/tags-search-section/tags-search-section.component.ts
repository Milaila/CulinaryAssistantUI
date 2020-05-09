import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FiltersService } from 'src/app/services/filters.service';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { Observable, combineLatest, from, of } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { startWith, map, withLatestFrom, catchError, share } from 'rxjs/operators';

@Component({
  selector: 'app-tags-search-section',
  templateUrl: './tags-search-section.component.html',
  styleUrls: ['./tags-search-section.component.scss']
})
export class TagsSearchSectionComponent implements OnInit {

  availableTags$: Observable<string[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  requiredTagsCtrl = new FormControl();
  forbiddenTagsCtrl = new FormControl();
  filteredRequiredTags$: Observable<string[]>;
  filteredForbiddenTags$: Observable<string[]>;

  @ViewChild('requiredTagInput') requiredTagInput: ElementRef<HTMLInputElement>;
  @ViewChild('forbiddenTagInput') forbiddenTagInput: ElementRef<HTMLInputElement>;

  constructor(
    private filterService: FiltersService,
    private server: ServerHttpService
  ) { }

  ngOnInit(): void {
    this.availableTags$ = this.server.getTags().pipe(
      share(),
      catchError(_ => {
        alert('Error during retriving tags!');
        return of([]);
      })
    );
    this.filteredRequiredTags$ = combineLatest([this.requiredTagsCtrl.valueChanges, this.availableTags$]).pipe(
      map(([tag, tags]) => tag ? this.filterTags(tags, tag) : tags)
    );
    this.filteredForbiddenTags$ = combineLatest([this.forbiddenTagsCtrl.valueChanges, this.availableTags$]).pipe(
      map(([tag, tags]) => tag ? this.filterTags(tags, tag) : tags)
    );
  }

  addRequiredTag(event: MatChipInputEvent): void {
    const input = event.input;
    const tag = event.value?.trim().toLocaleLowerCase();

    if (tag) {
      this.filterService.selectTag(tag, true);
    }
    if (input) {
      input.value = '';
    }
    this.requiredTagsCtrl.setValue(null);
  }

  addForbiddenTag(event: MatChipInputEvent): void {
    const input = event.input;
    const tag = event.value?.trim().toLocaleLowerCase();

    if (tag) {
      this.filterService.selectTag(tag, false);
    }
    if (input) {
      input.value = '';
    }
    this.forbiddenTagsCtrl.setValue(null);
  }

  selectRequired(event: MatAutocompleteSelectedEvent): void {
    const tag = event.option?.viewValue?.toLocaleLowerCase();
    this.filterService.selectTag(tag, true);
    this.requiredTagInput.nativeElement.value = '';
    this.requiredTagsCtrl.setValue(null);
  }

  selectForbidden(event: MatAutocompleteSelectedEvent): void {
    const tag = event.option?.viewValue?.toLocaleLowerCase();
    this.filterService.selectTag(tag, false);
    this.forbiddenTagInput.nativeElement.value = '';
    this.forbiddenTagsCtrl.setValue(null);
  }

  private filterTags(tags: string[], tag: string): string[] {
    const check = new RegExp(tag?.trim(), 'i');
    return tags?.filter(t => check.test(t));
  }

  removeTag(tag: string) {
    this.filterService.removeTag(tag);
  }

  get requiredTags(): Set<string> {
    return this.filterService.requiredTags;
  }

  get forbiddenTags(): Set<string> {
    return this.filterService.forbiddenTags;
  }
}
