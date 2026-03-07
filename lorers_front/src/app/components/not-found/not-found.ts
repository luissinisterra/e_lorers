import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css']
})
export class NotFoundComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goHome(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/events']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
