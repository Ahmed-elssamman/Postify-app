import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toastr = inject(ToastrService);

  return next(request).pipe(
    catchError((error: unknown) => {
      toastr.error('Something went wrong', 'Postify');
      return throwError(() => error);
    }),
  );
};
