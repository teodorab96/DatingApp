import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The dating app';
  users : any; //bilo kojeg tipa

  constructor(private accountService: AccountService,private presenceService:PresenceService){}
  ngOnInit() {
     this.setCurrentUser();
  }

  setCurrentUser()
  {
    
     const storageUser = localStorage.getItem('user');
    if(typeof storageUser ==='string')
    {
      const user:User = JSON.parse(storageUser);
      if(user)
      {
        this.accountService.setCurrentUser(user);
        this.presenceService.createHubConnection(user);
      }
      
    }
  }

}
