import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  constructor(public usersService: UsersService, public translate: TranslateService) { }

  ngOnInit(): void {
  }

}
