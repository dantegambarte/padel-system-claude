import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

/**
 * Directiva para hacer auto-focus en inputs
 * Uso: <input appAutofocus />
 * Uso condicional: <input [appAutofocus]="shouldFocus" />
 */
@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  @Input() appAutofocus: boolean = true;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.appAutofocus) {
      setTimeout(() => {
        this.elementRef.nativeElement.focus();
      }, 100);
    }
  }
}
