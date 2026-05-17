# Pre-Push Checklist untuk LensaNusantara

## 🔒 Security Check
- [ ] File `.env.local` TIDAK ter-commit (sudah di-ignore)
- [ ] Tidak ada API keys atau secrets di dalam kode
- [ ] File `supabase.js` hanya berisi konfigurasi client (aman)

## 📝 Documentation
- [ ] README.md sudah update dengan instruksi setup
- [ ] Supabase setup instructions sudah lengkap
- [ ] Environment variables template sudah ada

## 🗃️ Files to Commit
### ✅ AMAN untuk di-push:
- `src/lib/supabase.js` - Supabase client configuration
- `supabase-setup/*.sql` - Database setup scripts
- `supabase-setup/README.md` - Setup instructions
- `.kiro/specs/` - Project specifications
- `package.json` - Dependencies (jika sudah update)

### ❌ JANGAN di-push:
- `.env.local` - Contains API keys and secrets
- `node_modules/` - Dependencies folder
- `.next/` - Build output

## 🚀 Before Push Commands
```bash
# 1. Check status
git status

# 2. Add safe files only
git add src/lib/supabase.js
git add supabase-setup/
git add .kiro/specs/
git add package.json (if updated)

# 3. Commit
git commit -m "feat: setup Supabase backend configuration

- Add Supabase client configuration
- Add database schema and RLS policies
- Add storage setup for product images
- Add sample data and utility functions
- Add comprehensive setup documentation"

# 4. Push
git push origin main
```

## 📋 Team Setup Instructions
Setelah push, team member lain perlu:
1. Clone repository
2. Copy `.env.local.example` ke `.env.local`
3. Isi environment variables dari Supabase dashboard
4. Run `npm install`
5. Ikuti instruksi di `supabase-setup/README.md`