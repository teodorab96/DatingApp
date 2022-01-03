import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any ={};
 // loggedIn: boolean;


  constructor(public accountService: AccountService,private router:Router,private toastr:ToastrService) { }

  ngOnInit(): void {
    //this.getCurrentUser();
  }

  login() {
    //login vraća tip Opservable koji ne radi ništa
    //sve dok se ne subscribe na opservable
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl("/members");
      //this.loggedIn = true;
    });
  }
  logout()
  {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  
    //this.loggedIn = false;
  }
  /*
  getCurrentUser(){
    this.accountService.currentUser$.subscribe(user => {
      this.loggedIn = !!user; //dupli uzvičnici pretvraju u boolean tip podataka
    }, error => {
      console.log(error);
    })  
  }*/
}
