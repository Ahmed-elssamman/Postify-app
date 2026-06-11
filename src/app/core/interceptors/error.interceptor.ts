import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toastr = inject(ToastrService);
  const errorService = inject(ErrorService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      errorService.showError();
      toastr.error('Something went wrong', 'Postify');
      return throwError(() => error);
    }),
  );
};
