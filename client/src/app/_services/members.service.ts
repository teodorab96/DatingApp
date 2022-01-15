import { HttpClient, HttpParams } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginationResult } from '../models/pagination';
import { User } from '../models/User';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl= environment.apiUrl;
  members:Member[] = [];
  memberCatche = new Map();
  user: User;
  userParams:UserParams;

  constructor(private http:HttpClient,private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
   }

   getUserParams():UserParams {
     return this.userParams;
   }
   setUserParams(params:UserParams){
     this.userParams = params;
   }

   resteUserParams() {
     this.userParams = new UserParams(this.user);
     return this.userParams; 
   }

  getMembers(userParams: UserParams){
    var response = this.memberCatche.get(Object.values(userParams).join('-'));
    if(response) return of(response);
    
    let params = this.getPaginationHeaders(userParams.pageNumber,userParams.pageSize);
    params = params.append('minAge',userParams.minAge.toString());
    params = params.append('maxAge',userParams.maxAge.toString());
    params = params.append('gender',userParams.gender);
    params = params.append('orderBy',userParams.orderBy)

    return this.getPaginatedResult<Member[]>(this.baseUrl+'users',params).pipe(
      map((response => {
        this.memberCatche.set(Object.values(userParams).join('-'),response);
        return response;
      }))
    );
  }

  getMember(username:string){
    const member = [...this.memberCatche.values()]
    //pozivamo reduce funkciju na za svaki elemenat elem iz niza
    //zatim dodajemo vrijednosti elemenata na niy arr koji je prazan ( [] )
    .reduce((arr,elem) => arr.concat(elem.result),[])
    //pronalazi prve element iz niza koji zadavoljava uslov 
    .find((member:Member) => member.username === username);

    if(member) { return of(member)}

    console.log(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username);
  }
  updateMember(member: Member) {
    return this.http.put(this.baseUrl+'users',member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
  setMainPhoto(photoId:number) {
      return this.http.put(this.baseUrl+ 'users/set-main-photo/'+photoId,{});
  }
  deletePhoto(photoId:number)
  {
    return this.http.delete(this.baseUrl + 'users/delete-photo/'+photoId);
  }



  private getPaginatedResult<T>(url:string,params:HttpParams) {
    const paginatedResult: PaginationResult<T> = new PaginationResult<T>();

    return this.http.get<T>(url,{ observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber:number,pageSize:number) {
    let params= new HttpParams();
      params=params.append('pageNumber',pageNumber.toString()); 
      params= params.append('pageSize',pageSize.toString()); 

      return params;
  }



}
