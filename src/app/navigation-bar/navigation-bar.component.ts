import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  user: Object;
  @Input() user_id: string; 
  constructor(
  	private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}
