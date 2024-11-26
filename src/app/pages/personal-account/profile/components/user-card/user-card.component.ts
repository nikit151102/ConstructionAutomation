import { Component, Input, OnInit } from '@angular/core';
import { CurrentUserService } from '../../../../../services/current-user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit{

  @Input() currentUser:any;
  constructor(public currentUserService: CurrentUserService) { }
  
  ngOnInit(): void {
    
  }

}
