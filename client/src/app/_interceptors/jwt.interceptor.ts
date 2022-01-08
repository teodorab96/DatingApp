import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../models/User';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currUser: User | undefined=undefined;
    let currentUser:User;

    this.accountService.currentUser$.pipe(take(1)).subscribe((user:User)=> currUser = user);
    if(currUser){
      if('token' in currUser){
        currentUser = currUser;
        request = request.clone({
          setHeaders: ({
            Authorization: 'Bearer ' + currentUser.token
          })
        })
      }
      
    }


    return next.handle(request);
  }
}
