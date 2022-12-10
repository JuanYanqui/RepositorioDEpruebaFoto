import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertsService } from '@service/alerts';
import { SpinnerService } from '@service/spinners';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private SpinnerService: SpinnerService,
    private alertserv: AlertsService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.SpinnerService.showSpinner();
    return next.handle(req).pipe(
      finalize(() => {
        this.SpinnerService.hideSpinner();
      })
    );
  }
}
// return next.handle(req).pipe(
//   tap((evt) => {
//     if (evt instanceof HttpResponse) {
//       if (evt.body && evt.body.success)
//         this.alertserv.showSuccess(
//           evt.body.success.message,
//           evt.body.success.title
//         );
//     }
//   }),
//   catchError((err: any) => {
//     if (err instanceof HttpErrorResponse) {
//       try {
//         this.alertserv.showError('An error occurred', '');
//       } catch (e) {
//         this.alertserv.showError(err.message, err.name);
//       }
//     }
//     return of(err);
//   }),
//   finalize(() => {
//     this.SpinnerService.hideSpinner();
//   })
// );
