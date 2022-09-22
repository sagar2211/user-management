import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Injectable()
export class I1 implements HttpInterceptor {
    constructor(private userService : UserService,
        private router : Router){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.userService.user) {
            return next.handle(req);
        }
        const authHeader = `Bearer ${this.userService.user.token}`;
        const authReq = req.clone({
            headers: req.headers.set(
                'Authorization',
               authHeader
            )
        });
        
        return next.handle(authReq);
    }
}
