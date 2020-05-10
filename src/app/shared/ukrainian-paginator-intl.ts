import { MatPaginatorIntl } from '@angular/material/paginator';

export function ukrainianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.nextPageLabel = 'Наступна сторінка';
  paginatorIntl.previousPageLabel = 'Попередня сторінка';
  paginatorIntl.itemsPerPageLabel = 'Рецептів на сторінці:';
  paginatorIntl.getRangeLabel = ukrainianRangeLabel;

  return paginatorIntl;
}

const ukrainianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (!length || !pageSize) {
    return `0 з ${length}`;
  }
  length = Math.max(length, 0);

  const startIndex = page * pageSize;
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} з ${length}`;
};
