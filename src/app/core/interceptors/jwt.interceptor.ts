import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";


const JwtInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);

    const TOKEN_KEY: string | null = localStorage.getItem('accessToken');

    if (TOKEN_KEY) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${TOKEN_KEY}`,
            },
        });

        // Handle the request and catch errors
        return next(clonedReq).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    // Handle unauthorized error (e.g., token expired)
                    console.error('Unauthorized request - token may be expired');
                    // Optionally: Trigger token refresh or redirect to login
                    authService.logout();
                    
                }
                return throwError(() => error);
            })
        )
    }

    return next(req);
}

export default JwtInterceptor