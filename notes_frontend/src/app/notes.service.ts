import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class NotesService {
  constructor(private supabase: SupabaseService) {}

  // PUBLIC_INTERFACE
  async getNotes(search = '', categoryId?: string) {
    return this.supabase.getNotes(search, categoryId);
  }

  // PUBLIC_INTERFACE
  async addNote(note: { title: string; content: string; category_id?: string }) {
    return this.supabase.addNote(note);
  }

  // PUBLIC_INTERFACE
  async updateNote(noteId: string, patch: { title?: string; content?: string; category_id?: string }) {
    return this.supabase.updateNote(noteId, patch);
  }

  // PUBLIC_INTERFACE
  async deleteNote(noteId: string) {
    return this.supabase.deleteNote(noteId);
  }
}
