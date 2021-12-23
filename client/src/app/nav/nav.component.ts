import { Component, OnInit } from '@angular/core';
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


  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    //this.getCurrentUser();
  }

  login() {
    //login vraća tip Opservable koji ne radi ništa
    //sve dok se ne subscribe na opservable
    this.accountService.login(this.model).subscribe(response => {
      console.log(response);
      //this.loggedIn = true;
    }, error => {
      console.log(error)
    });
  }
  logout()
  {
    this.accountService.logout();
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
