import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private _session: Session|null = null;

  constructor() {
    // PUBLIC_INTERFACE
    // Use environment variables for Supabase config (must be set in build env)
    this.supabase = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
    this.supabase.auth.getSession().then(({ data }) => this._session = data.session);
    this.supabase.auth.onAuthStateChange((_event, sess) => {
      this._session = sess;
    });
  }

  // PUBLIC_INTERFACE
  async signUp(email: string, password: string) {
    /**
     * Registers a new user with email and password.
     */
    const { error, data } = await this.supabase.auth.signUp({ email, password });
    return { error, data };
  }

  // PUBLIC_INTERFACE
  async signIn(email: string, password: string) {
    /**
     * Logs in a user with email and password.
     */
    const { error, data } = await this.supabase.auth.signInWithPassword({ email, password });
    return { error, data };
  }

  // PUBLIC_INTERFACE
  async signOut() {
    /**
     * Logs out the current user.
     */
    return await this.supabase.auth.signOut();
  }

  // PUBLIC_INTERFACE
  get session() {
    /**
     * Returns the current authentication session object, or null.
     */
    return this._session;
  }

  // PUBLIC_INTERFACE
  async getUser(): Promise<User|null> {
    /**
     * Returns the currently authenticated user, or null.
     */
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  // PUBLIC_INTERFACE
  async getCategories() {
    /**
     * Fetch categories for the current user.
     */
    const user = await this.getUser();
    if (!user) return [];
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async addCategory(name: string) {
    /**
     * Adds a new category for the user.
     */
    const user = await this.getUser();
    if (!user) throw new Error('Not signed in');
    const { data, error } = await this.supabase
      .from('categories')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async deleteCategory(categoryId: string) {
    /**
     * Deletes a category by ID (if owned by user).
     */
    const user = await this.getUser();
    if (!user) throw new Error('Not signed in');
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', user.id);
    if (error) throw error;
  }

  // PUBLIC_INTERFACE
  async getNotes(search: string = '', categoryId?: string) {
    /**
     * Get notes for current user, with optional search and category filter.
     */
    const user = await this.getUser();
    if (!user) return [];
    let query = this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (search && search.length > 0) {
      query = query.or(
        `title.ilike.%${search}%,content.ilike.%${search}%`
      );
    }
    query = query.order('updated_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async addNote(note: { title: string; content: string; category_id?: string }) {
    /**
     * Creates a new note for the user.
     */
    const user = await this.getUser();
    if (!user) throw new Error('Not signed in');
    const { data, error } = await this.supabase
      .from('notes')
      .insert([{
        ...note,
        user_id: user.id,
        updated_at: (new Date()).toISOString()
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async updateNote(noteId: string, patch: { title?: string; content?: string; category_id?: string }) {
    /**
     * Updates an existing note for the user.
     */
    const user = await this.getUser();
    if (!user) throw new Error('Not signed in');
    const { data, error } = await this.supabase
      .from('notes')
      .update({
        ...patch,
        updated_at: (new Date()).toISOString()
      })
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async deleteNote(noteId: string) {
    /**
     * Deletes a note by ID (if owned by user).
     */
    const user = await this.getUser();
    if (!user) throw new Error('Not signed in');
    const { error } = await this.supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);
    if (error) throw error;
  }
}

