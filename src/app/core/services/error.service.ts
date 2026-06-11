import { Injectable, signal } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class ErrorService {
    hasError = signal(false);
    showError(): void {
        this.hasError.set(true);
    }
    hideError(): void {
        this.hasError.set(false);
    }
}