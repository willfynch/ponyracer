import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pr-birth-year-input',
  imports: [],
  templateUrl: './birth-year-input.component.html',
  styleUrl: './birth-year-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BirthYearInputComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => BirthYearInputComponent), multi: true }
  ]
})
export class BirthYearInputComponent implements ControlValueAccessor {
  value = signal<null | number>(null);
  year = computed(() => this.computeYear());
  inputId = input<string>();
  readonly disabled = signal<boolean>(false);

  onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  computeYear() {
    const firstTwoDigitsOfTheCurrentYear = Math.floor(new Date().getFullYear() / 100);
    const lastTwoDigitsOfTheCurrentYear = new Date().getFullYear() % 100;
    const value = this.value();

    if (value === null) return null;
    else if (value < 0 || value > 100) {
      return value;
    } else if (value > lastTwoDigitsOfTheCurrentYear) {
      return (firstTwoDigitsOfTheCurrentYear - 1) * 100 + value;
    } else {
      return firstTwoDigitsOfTheCurrentYear * 100 + value;
    }
  }

  onBirthYearChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (isNaN(value)) {
      this.value.set(null);
    } else {
      this.value.set(value);
    }
    this.onChange(this.year());
  }

  writeValue(date: number | null): void {
    this.value.set(date);
  }
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  validate(): null | { invalidYear: boolean } {
    const year = this.year();
    const currentYear = new Date().getFullYear();

    if (year === null) {
      return null;
    }
    if (year < 1900 || year > currentYear) {
      return {
        invalidYear: true
      };
    }
    return null;
  }
}
