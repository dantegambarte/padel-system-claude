import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Directiva para detectar clicks fuera de un elemento
 * Útil para cerrar dropdowns, modals, etc.
 * Uso: <div (appClickOutside)="closeMenu()">...</div>
 */
@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'!])
  onClick(target: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
