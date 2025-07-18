import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { SearchBarComponent } from './search-bar.component';
import { NotesListComponent } from './notes-list.component';
import { NoteEditorComponent } from './note-editor.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { AuthService } from './auth.service';
import { NotesService } from './notes.service';
import { CategoriesService } from './categories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root-shell',
  standalone: true,
  imports: [
    SidebarComponent,
    SearchBarComponent,
    NotesListComponent,
    NoteEditorComponent,
    LoginComponent,
    SignupComponent,
    CommonModule,
  ],
  template: `
  <div class="shell" *ngIf="!loading">
    <div *ngIf="!authUser">
      <app-login
        *ngIf="showLogin"
        (login)="doLogin($event)"
        (showSignupScreen)="showSignupScreen()"
      ></app-login>
      <app-signup
        *ngIf="!showLogin"
        (signup)="doSignup($event)"
        (showLoginScreen)="showLoginScreen()"
      ></app-signup>
    </div>
    <div *ngIf="authUser" class="main-app">
      <app-sidebar
        [categories]="categories"
        [selectedCategory]="selectedCategory"
        (selectCategory)="onCategorySelect($event)"
        (addCategory)="onAddCategory($event)"
        (deleteCategory)="onDeleteCategory($event)"
      ></app-sidebar>
      <div class="main-panel">
        <header>
          <app-search-bar
            [search]="searchTerm"
            (searchChanged)="onSearch($event)"
          ></app-search-bar>
          <button class="logout-btn" (click)="doLogout()">Logout</button>
        </header>
        <main>
          <section class="notes-list-section">
            <button class="accent-btn new-note-btn" (click)="startNewNote()">+ New Note</button>
            <app-notes-list
              [notes]="notes"
              [selectedNoteId]="selectedNote?.id"
              (noteSelected)="selectNote($event)"
            ></app-notes-list>
          </section>
          <section class="editor-section">
            <app-note-editor
              [note]="selectedNote"
              [categories]="categories"
              (save)="onSaveNote($event)"
              (delete)="onDeleteNote($event)"
              (cancel)="cancelEdit()"
              *ngIf="showEditor"
            ></app-note-editor>
            <div class="empty-info" *ngIf="!showEditor">
              <p style="font-size:1.5rem;color:#90caf9;">Choose or create a note to get started.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .shell {
      height: 100vh;
      display: flex;
      align-items: stretch;
      width: 100vw;
      background: #f8fafe;
      font-family: 'Inter', Arial, sans-serif;
    }
    .main-app {
      display: flex;
      width: 100vw;
      min-height: 100vh;
    }
    .main-panel {
      min-height: 100vh;
      flex: 1;
      margin-left: 250px;
      background: #f9fafe;
      display: flex;
      flex-direction: column;
    }
    header {
      display: flex;
      align-items: center;
      padding: 1.3rem 2.3rem 0.6rem 2.3rem;
      gap: 2rem;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }
    main {
      flex: 1;
      display: flex;
      gap: 1.4rem;
      justify-content: stretch;
      padding: 1.3rem 2.3rem 1.5rem 2.3rem;
    }
    .notes-list-section {
      max-width: 320px;
      min-width: 180px;
      flex: 0 0 280px;
      margin-right: 1rem;
      padding-top: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }
    .editor-section {
      flex: 1;
      max-width: 690px;
    }
    .empty-info {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      color: #789;
    }
    .logout-btn {
      background: #fff;
      color: #1976d2;
      border: 1px solid #1976d2;
      border-radius: 21px;
      padding: 0.32rem 0.9rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      margin-left: auto;
      transition: background 0.16s, color 0.16s;
    }
    .logout-btn:hover {
      background: #1976d2;
      color: #fff;
    }
    .accent-btn {
      background: #ff4081;
      color: #fff;
      border: none;
      border-radius: 19px;
      padding: 0.43rem 1.19rem;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 0.9rem;
      margin-top: 0.2rem;
    }
    .new-note-btn {
      background: #1976d2;
      color: #fff;
    }
    @media (max-width: 900px) {
      .main-panel {
        margin-left: 0;
        padding-left: 0;
      }
      .shell, .main-app {
        flex-direction: column;
      }
      main {
        gap: 0.3rem;
        padding-left: 0;
      }
      .notes-list-section {
        min-width: 140px;
        max-width: 180px;
      }
    }
    @media (max-width: 700px) {
      .main-panel {
        margin-left: 0;
        padding: 0.8rem;
      }
      header, main {
        padding: 0.7rem 0.3rem 0.7rem 0.7rem;
      }
      .notes-list-section {
        min-width: 0;
        max-width: 100vw;
      }
    }
  `]
})
export class AppShellComponent {
  loading = true;
  authUser: any = null;
  showLogin = true;
  notes: any[] = [];
  categories: any[] = [];
  searchTerm = '';
  selectedCategory: string|null = null;
  selectedNote: any|null = null;
  showEditor = false;
  status: string|null = null;

  constructor(
    public auth: AuthService,
    public notesService: NotesService,
    public categoriesService: CategoriesService
  ) {
    // Reference each to avoid no-unused-vars lint error
    void this.auth;
    void this.notesService;
    void this.categoriesService;
    this.init();
  }

  async init() {
    // Check session
    this.authUser = await this.auth.getUser();
    if (this.authUser) {
      await this.loadCategories();
      await this.loadNotes();
    }
    this.loading = false;
  }

  async doLogin(creds: { email: string; password: string }) {
    try {
      const { error } = await this.auth.signIn(creds.email, creds.password);
      if (error) throw error;
      this.authUser = await this.auth.getUser();
      await this.loadCategories();
      await this.loadNotes();
      this.selectedNote = null;
      this.showLogin = true;
      this.showEditor = false;
      this.status = null;
    } catch (e: any) {
      this.status = 'Login failed: ' + (e?.message || e);
    }
  }

  async doSignup(creds: { email: string; password: string }) {
    try {
      const { error } = await this.auth.signUp(creds.email, creds.password);
      if (error) throw error;
      this.status = 'Signup successful! Please check your email for confirmation and then log in.';
      this.showLoginScreen();
    } catch (e: any) {
      this.status = 'Signup failed: ' + (e?.message || e);
    }
  }

  showSignupScreen() {
    this.showLogin = false;
    this.status = null;
  }
  showLoginScreen() {
    this.showLogin = true;
    this.status = null;
  }

  async doLogout() {
    await this.auth.signOut();
    this.authUser = null;
    this.selectedNote = null;
    this.notes = [];
    this.categories = [];
    this.searchTerm = '';
    this.selectedCategory = null;
    this.showLogin = true;
    this.status = null;
  }

  async loadNotes() {
    this.notes = await this.notesService.getNotes(this.searchTerm, this.selectedCategory || undefined);
  }
  async loadCategories() {
    this.categories = await this.categoriesService.getCategories();
  }
  async onSearch(val: string) {
    this.searchTerm = val;
    await this.loadNotes();
  }
  async onCategorySelect(catId: string|null) {
    this.selectedCategory = catId;
    await this.loadNotes();
    this.selectedNote = null;
    this.showEditor = false;
  }

  async onAddCategory(name: string) {
    await this.categoriesService.addCategory(name);
    await this.loadCategories();
  }
  async onDeleteCategory(catId: string) {
    await this.categoriesService.deleteCategory(catId);
    if (this.selectedCategory === catId) this.selectedCategory = null;
    await this.loadCategories();
    await this.loadNotes();
  }

  selectNote(note: any) {
    this.selectedNote = note;
    this.showEditor = true;
  }
  startNewNote() {
    this.selectedNote = { id: null, title: '', content: '', category_id: this.selectedCategory || null };
    this.showEditor = true;
  }
  cancelEdit() {
    this.selectedNote = null;
    this.showEditor = false;
  }
  async onSaveNote(note: any) {
    if (note.id) {
      await this.notesService.updateNote(note.id, {
        ...note
      });
    } else {
      await this.notesService.addNote(note);
    }
    await this.loadNotes();
    this.selectedNote = null;
    this.showEditor = false;
  }
  async onDeleteNote(note: any) {
    if (note && note.id) {
      await this.notesService.deleteNote(note.id);
      await this.loadNotes();
      this.selectedNote = null;
      this.showEditor = false;
    }
  }
}
