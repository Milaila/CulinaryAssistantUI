export interface IMenuItem {
  visible?: () => boolean;
  click?: () => void;
  routerLink?: string;
  disabled?: boolean;
  hint?: string;
  label: string;
}

export interface IActionItem {
  visible?: () => boolean;
  click?: () => void;
  disabled?: boolean;
  hint?: string;
  label: string;
}
