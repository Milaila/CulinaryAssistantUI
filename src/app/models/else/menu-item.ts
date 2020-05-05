export interface IMenuItem {
  visible?: () => boolean;
  click?: () => void;
  routerLink?: string;
  disabled?: boolean;
  hint?: string;
  label: string;
}
