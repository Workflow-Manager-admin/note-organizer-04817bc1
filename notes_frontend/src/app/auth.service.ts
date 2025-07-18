import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  // PUBLIC_INTERFACE
  async signUp(email: string, password: string) {
    return this.supabase.signUp(email, password);
  }

  // PUBLIC_INTERFACE
  async signIn(email: string, password: string) {
    return this.supabase.signIn(email, password);
  }

  // PUBLIC_INTERFACE
  async signOut() {
    return this.supabase.signOut();
  }

  // PUBLIC_INTERFACE
  get session() {
    return this.supabase.session;
  }

  // PUBLIC_INTERFACE
  async getUser() {
    return this.supabase.getUser();
  }
}
