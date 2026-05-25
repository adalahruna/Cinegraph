import { supabase, TABLES } from '../supabase'

export class AuthService {

  // =========================
  // 🔥 REGISTER
  // =========================
  static async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name || '',
            phone: metadata.phone || ''
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      const user = data.user

      if (!user) {
        return { user: null, error: 'User tidak terbentuk' }
      }

      // insert ke tabel users
      const { error: insertError } = await supabase
        .from(TABLES.USERS)
        .insert({
          id: user.id,
          email: user.email,
          full_name: metadata.full_name || '',
          phone: metadata.phone || '',
          role: 'user'
        })

      if (insertError) {
        console.error("Insert profile error:", insertError)
        return { user: null, error: 'Gagal simpan data user' }
      }

      return { user, error: null }

    } catch (err) {
      return { user: null, error: err.message }
    }
  }

  // =========================
  // 🔥 LOGIN (FIX TOTAL)
  // =========================
  static async signIn(email, password) {
    try {
      // 🔥 1. LOGIN DULU KE AUTH
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { user: null, profile: null, error: error.message }
      }

      if (!data || !data.user) {
        return {
          user: null,
          profile: null,
          error: 'Login gagal (user tidak ditemukan)'
        }
      }

      const user = data.user

      // 🔥 2. AMBIL PROFILE DARI TABLE USERS
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      // If profile fetch fails due to RLS or missing record, create a temporary profile
      if (profileError || !profile) {
        console.warn('Profile fetch failed during login, using user data:', profileError?.message)
        
        // Return a basic profile constructed from auth user data
        const tempProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          role: 'user',
          phone: user.user_metadata?.phone || null,
          address: null,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
        
        return {
          user,
          profile: tempProfile,
          error: null
        }
      }

      return {
        user,
        profile,
        error: null
      }

    } catch (err) {
      console.error("SIGNIN ERROR:", err)
      return { user: null, profile: null, error: err.message }
    }
  }

  // =========================
  // 🔥 LOGOUT
  // =========================
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (err) {
      return { error: err.message }
    }
  }

  // =========================
  // 🔥 GET CURRENT USER
  // =========================
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return { user: null, profile: null, error: error?.message || 'No user found' }
      }

      // Try to get profile from database
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      // If profile exists in DB, return it (even if there was an error)
      if (profile) {
        return {
          user,
          profile,
          error: null
        }
      }

      // If profile fetch fails due to RLS or missing record, create a temporary profile
      console.warn('Profile fetch failed, using user data:', profileError?.message)
      
      // Return a basic profile constructed from auth user data
      const tempProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        role: 'user',
        phone: user.user_metadata?.phone || null,
        address: null,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
      
      return {
        user,
        profile: tempProfile,
        error: null
      }

    } catch (err) {
      return { user: null, profile: null, error: err.message }
    }
  }

  // =========================
  // 🔥 GET CURRENT USER (ADMIN CHECK - NO FALLBACK)
  // =========================
  static async getCurrentUserStrict() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return { user: null, profile: null, error: error?.message || 'No user found' }
      }

      // Get profile WITHOUT fallback - we need real DB data for admin check
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError || !profile) {
        return {
          user,
          profile: null,
          error: profileError?.message || 'Profile not found in database'
        }
      }

      return {
        user,
        profile,
        error: null
      }

    } catch (err) {
      return { user: null, profile: null, error: err.message }
    }
  }
}