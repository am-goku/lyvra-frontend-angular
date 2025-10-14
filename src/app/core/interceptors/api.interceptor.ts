import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

const ApiInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const API_BASE_URL = 'http://localhost:3000';

    const apiReq = req.url.startsWith('http')
        ? req
        : req.clone({ url: `${API_BASE_URL}/${req.url}` });

    return next(apiReq)
}

export default ApiInterceptor