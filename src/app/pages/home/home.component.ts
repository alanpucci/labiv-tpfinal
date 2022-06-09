import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userData:User=new User();
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userData = this.auth.getUserData();
  }

}
