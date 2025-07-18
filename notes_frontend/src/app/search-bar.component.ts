import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <form (submit)="doSearch($event)" class="search-bar">
    <input [(ngModel)]="search" name="s" placeholder="Search notes..." autocomplete="off"/>
    <button type="submit" [disabled]="search.trim().length === 0" title="Search">
      <svg width="20" height="20" fill="#1976d2" viewBox="0 0 20 20"><circle cx="9" cy="9" r="8" fill="none" stroke="#1976d2" stroke-width="2"/><path d="M13.5 13.5L18 18" stroke="#1976d2" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
    <button *ngIf="search.length > 0" type="button" (click)="clear()" title="Clear">&times;</button>
  </form>
  `,
  styles: [`
    .search-bar {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 8px;
      background: #f9f9f9;
      padding: 0.4rem 0.7rem;
      border-radius: 24px;
      border: 1px solid #e0e0e0;
      margin-bottom: 1rem;
    }
    .search-bar input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      background: #f9f9f9;
    }
    .search-bar button[type="submit"] {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 0.3rem;
    }
    .search-bar button[type="button"] {
      background: none;
      border: none;
      color: #ff4081;
      font-size: 1.4rem;
      cursor: pointer;
      padding: 0 0.5rem;
    }
  `]
})
export class SearchBarComponent {
  @Output() searchChanged = new EventEmitter<string>();
  @Input() search: string = '';

  doSearch(e: Event) {
    e.preventDefault();
    this.searchChanged.emit(this.search.trim());
  }

  clear() {
    this.search = '';
    this.searchChanged.emit('');
  }
}
