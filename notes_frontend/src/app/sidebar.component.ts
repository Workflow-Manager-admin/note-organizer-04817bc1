import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <aside class="sidebar" [class.closed]="!open">
    <div class="sidebar-header">
      <h1>Notes</h1>
    </div>
    <button class="category-btn"
      [class.selected]="selectedCategory === null"
      (click)="selectCategory.emit(null)">
      <span>All Notes</span>
    </button>
    <div *ngFor="let category of categories">
      <button class="category-btn"
        [class.selected]="selectedCategory === category.id"
        (click)="selectCategory.emit(category.id)">
        <span>{{category.name}}</span>
        <button (click)="deleteCategory.emit(category.id); $event.stopPropagation()" title="Delete" class="delete-category">✕</button>
      </button>
    </div>
    <form (submit)="onAddCategory($event)">
      <input [(ngModel)]="newCategory" placeholder="Add category" required name="category" autocomplete="off"/>
      <button type="submit">+</button>
    </form>
  </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #fff;
      border-right: 1px solid #eee;
      padding: 1rem;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
    }
    .sidebar.closed {
      display: none;
    }
    .sidebar-header h1 {
      color: #1976d2;
      font-size: 2rem;
      margin-bottom: 2rem;
      font-weight: 700;
    }
    .category-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: none;
      border: none;
      border-radius: 6px;
      width: 100%;
      color: #424242;
      font-size: 1rem;
      padding: 0.5rem 0.75rem;
      margin-bottom: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .category-btn.selected, .category-btn:hover {
      background: #e3f2fd;
      color: #1976d2;
    }
    .sidebar form {
      display: flex;
      gap: 6px;
      margin-top: 1.5rem;
    }
    .sidebar input {
      flex: 1;
      font-size: 1rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    .sidebar button[type="submit"] {
      padding: 0 1rem;
      border-radius: 4px;
      border: none;
      background: #1976d2;
      color: #fff;
      font-size: 1.1rem;
    }
    .delete-category {
      margin-left: 8px;
      font-size: 0.8em;
      background: transparent;
      color: #ff4081;
      border: none;
      cursor: pointer;
    }
  `]
})
export class SidebarComponent {
  @Input() categories: any[] = [];
  @Input() selectedCategory: string|null = null;
  @Input() open = true;
  @Output() selectCategory = new EventEmitter<string|null>();
  @Output() addCategory = new EventEmitter<string>();
  @Output() deleteCategory = new EventEmitter<string>();

  newCategory = '';

  onAddCategory(e: Event) {
    e.preventDefault();
    if (this.newCategory.trim().length > 0) {
      this.addCategory.emit(this.newCategory!.trim());
      this.newCategory = '';
    }
  }
}
