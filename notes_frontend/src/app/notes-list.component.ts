import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="notes-list">
    <div *ngFor="let note of notes" class="note-list-item"
      [class.selected]="selectedNoteId === note.id"
      (click)="noteSelected.emit(note)">
      <div class="title">{{note.title}}</div>
      <div class="snippet">{{note.content | slice:0:70}}{{note.content.length>70?'...':''}}</div>
    </div>
    <div *ngIf="notes.length === 0" class="empty-state">
      <em>No notes found.</em>
    </div>
  </div>
  `,
  styles: [`
    .notes-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      height: 100%;
      overflow-y: auto;
      min-width: 190px;
      max-width: 320px;
      background: inherit;
      padding: 0.2rem 0;
    }
    .note-list-item {
      background: #fff;
      padding: 0.7rem 1rem;
      border-radius: 6px;
      border: 1px solid #eaeaea;
      margin-bottom: 4px;
      box-shadow: 0 0.7px 2.2px 0 rgba(25,118,210,0.02);
      font-size: 1rem;
      color: #1976d2;
      cursor: pointer;
      transition: box-shadow .18s, border-color .18s;
      display: flex;
      flex-direction: column;
    }
    .note-list-item.selected, .note-list-item:hover {
      border-color: #1976d2;
      background: #f4faff;
      box-shadow: 0 2px 10px 0 rgba(25,118,210,0.13);
    }
    .title {
      font-weight: 600;
      font-size: 1rem;
      color: #424242;
    }
    .snippet {
      color: #607d8b;
      font-size: 0.96rem;
      margin-top: 2px;
    }
    .empty-state {
      padding: 1rem;
      color: #aaa;
      text-align: center;
      font-style: italic;
      margin-top: 3rem;
    }
  `]
})
export class NotesListComponent {
  @Input() notes: any[] = [];
  @Input() selectedNoteId: string|null = null;
  @Output() noteSelected = new EventEmitter<any>();
}
