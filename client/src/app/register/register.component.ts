import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsoleReporter } from 'jasmine';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent: any;
  @Output() cancleRegister = new EventEmitter();
  model:any = {};
  constructor(private accountService:AccountService) { }

  ngOnInit(): void {
  }
  register() {
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    },error => {
      console.log(error);
    });
  }
  cancel(){
    this.cancleRegister.emit(false);
  }

}