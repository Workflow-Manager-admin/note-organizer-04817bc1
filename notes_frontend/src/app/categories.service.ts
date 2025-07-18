import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private supabase: SupabaseService) {}

  // PUBLIC_INTERFACE
  async getCategories() {
    return this.supabase.getCategories();
  }

  // PUBLIC_INTERFACE
  async addCategory(name: string) {
    return this.supabase.addCategory(name);
  }

  // PUBLIC_INTERFACE
  async deleteCategory(categoryId: string) {
    return this.supabase.deleteCategory(categoryId);
  }
}
