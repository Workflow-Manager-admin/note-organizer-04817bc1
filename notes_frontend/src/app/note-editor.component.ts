import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <form *ngIf="note" class="note-editor" (submit)="saveNote($event)">
    <input
      [(ngModel)]="editNote.title"
      name="title"
      placeholder="Title"
      maxlength="60"
      required
    />
    <textarea
      [(ngModel)]="editNote.content"
      name="content"
      placeholder="Your note here..."
      required
      rows="8"
    ></textarea>
    <div class="form-row">
      <select [(ngModel)]="editNote.category_id" name="category_id">
        <option [ngValue]="null">No category</option>
        <option *ngFor="let cat of categories" [ngValue]="cat.id">{{cat.name}}</option>
      </select>
      <div>
        <button type="submit" [disabled]="!editNote.title || !editNote.content">Save</button>
        <button type="button" class="accent-btn" (click)="emitDelete()" *ngIf="note && note.id">Delete</button>
        <button type="button" (click)="emitCancel()">Cancel</button>
      </div>
    </div>
  </form>
  `,
  styles: [`
    .note-editor {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: #fff;
      border-radius: 7px;
      padding: 1rem 1.2rem;
      box-shadow: 0 2px 8px 0 rgba(25,118,210,.05);
      border: 1px solid #eaeaea;
    }
    .note-editor input, .note-editor textarea, .note-editor select {
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid #ddd;
      padding: 0.5rem;
      width: 100%;
    }
    .form-row {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      align-items: center;
    }
    .form-row select {
      flex: 1;
      max-width: 170px;
    }
    .form-row > div {
      flex-shrink: 0;
      display: flex;
      gap: 1rem;
    }
    button[type="submit"] {
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 0.4rem 1.1rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.14s;
    }
    .accent-btn {
      background: #ff4081;
      color: #fff;
    }
    button[type="button"] {
      background: none;
      border: none;
      color: #424242;
      font-size: 0.98rem;
      margin-left: 6px;
      cursor: pointer;
    }
  `]
})
export class NoteEditorComponent implements OnChanges {
  @Input() note: any|null = null;
  @Input() categories: any[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  editNote: any = {};

  ngOnChanges(): void {
    this.editNote = this.note ? { ...this.note } : { title: '', content: '', category_id: null };
  }
  saveNote(e: Event) {
    e.preventDefault();
    this.save.emit(this.editNote);
  }
  emitDelete() {
    this.delete.emit(this.note);
  }
  emitCancel() {
    this.cancel.emit();
  }
}
