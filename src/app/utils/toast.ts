import {Injectable, inject} from '@angular/core';
import {MessageService} from 'primeng/api';

type ToastType = 'success' | 'error' | 'info' | 'warn';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  message(severity: ToastType, summary: string, detail?: string) {
    this.messageService.add({severity, summary, detail});
  }
}
