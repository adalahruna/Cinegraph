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
      console.log("USER LOGIN:", user)

      // 🔥 2. AMBIL PROFILE DARI TABLE USERS
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      console.log("PROFILE:", profile)
      console.log("PROFILE ERROR:", profileError)

      if (profileError || !profile) {
        return {
          user,
          profile: null,
          error: 'Gagal ambil profile'
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

      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      return {
        user,
        profile,
        error: profileError?.message || null
      }

    } catch (err) {
      return { user: null, profile: null, error: err.message }
    }
  }
}