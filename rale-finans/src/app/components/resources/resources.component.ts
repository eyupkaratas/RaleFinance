import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatTabGroup, MatTab],
  templateUrl: './resources.component.html',
})
export default class PageNotFoundComponent {}
