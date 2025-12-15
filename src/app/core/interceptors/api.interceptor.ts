import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

const ApiInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const apiReq = req.url.startsWith('http')
        ? req
        : req.clone({ url: `${environment.apiUrl}/${req.url}` });

    return next(apiReq);
}

export default ApiInterceptor;