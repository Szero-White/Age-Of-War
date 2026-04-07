# Build & Troubleshooting Guide

## Prerequisites Check

Before building, verify everything is installed:

### Windows PowerShell / CMD
```batch
REM Check Rust
rustc --version
cargo --version

REM Check Node.js
node --version
npm --version
```

Expected output: All should show version numbers like `1.70.0`

---

## Build Process Steps

### Step 1: Install Dependencies
```bash
npm install
```

**What it does**: 
- Downloads wasm-pack from npm
- Installs any JS dependencies

**File created**:
- `node_modules/` folder
- `package-lock.json`

### Step 2: Build Rust to WASM
```bash
npm run build
```

**What it does**:
- Runs wasm-pack which:
  - Compiles Rust to WebAssembly
  - Generates JavaScript bindings
  - Creates NPM package

**Files created**:
```
rust_src/
├── target/          (Rust build artifacts)
├── pkg/             (Generated WASM package)
│   ├── age_of_war.js
│   ├── age_of_war_bg.wasm
│   └── ...
└── Cargo.lock
``````

### Step 3: Run Server
```bash
npx http-server
```

Opens local server (usually http://localhost:8000)

---

## Common Issues & Solutions

### ❌ "cargo not found"

**Symptoms**: When running `npm run build`, get `cargo: command not found`

**Fix**:
1. Install Rust: https://rustup.rs/
2. Close and reopen terminal
3. Verify: `cargo --version`

**Windows-specific**:
- After installing Rust, you may need to restart your computer
- Don't use WSL (Windows Subsystem for Linux) - it causes conflicts

---

### ❌ "wasm-pack not found"

**Symptoms**: `wasm-pack: command not found`

**Fix**:
1. Check `npm install` ran: `ls node_modules/` (should exist)
2. If missing: `npm install` again
3. Use npx: `npm run build` already uses npx, so try again

---

### ❌ "Module not found: age_of_war"

**Symptoms**: 
- Game page shows error "Cannot find module"
- Browser console has WASM import error

**Fix**:
1. Verify build completed: `ls rust_src/pkg/` (should contain `age_of_war.js`)
2. Hard refresh: `Ctrl+Shift+R`
3. Check index_rust.html is where you opened it
4. Try rebuilding: `npm run build` again

---

### ❌ Build fails with "linker error"

**Symptoms**: Build output shows linking errors

**Usual causes**:
- Old cached data in `Cargo.lock`
- Conflicting Rust versions

**Fix**:
```bash
cd rust_src
rm -r target/
rm Cargo.lock
cd ..
npm run build
```

---

### ❌ "error: attempt to add a non-zero offset to a null pointer"

**Symptoms**: Runtime error in browser console

**This is a Rust code bug**

**Fix**:
1. Check `rust_src/src/game.rs` for null/uninitialize issues
2. Look for unsafe code blocks
3. Run `cargo clippy` for warnings

---

### ❌ Game page opens but nothing renders

**Symptoms**:
- Page loads (no error)
- Canvas is empty/black
- UI buttons exist but don't work

**Debug steps**:
1. Open DevTools: `F12`
2. Check Console tab for errors
3. Check the WASM module loaded: Look for `age_of_war` in Network tab
4. Click a button and watch console

**Likely causes**:
- Canvas not initialized: Check `index_rust.html` line ~120
- Game not created: Try `wasm.create_game()` in console
- Render loop issue: Check requestAnimationFrame is called

**Test in console**:
```javascript
// If WASM loaded:
wasm.create_game();
console.log(wasm.get_wave());  // Should output: 1
```

---

### ❌ "Cannot read property 'memory' of undefined"

**Symptoms**: WASM module loading failed silently

**Causes**:
- WASM file not found at `rust_src/pkg/`
- HTTP server access issue
- File corruption

**Fix**:
1. Verify file exists: `ls rust_src/pkg/age_of_war_bg.wasm`
2. Use HTTP server (not file://)
3. Clear cache: `npm run build && Hard refresh`

---

### ❌ Very slow performance, game lags

**Symptoms**:
- FPS is low
- Many CPU-intensive operations

**Diagnosis**:
1. Open DevTools → Performance tab
2. Record while playing
3. Look for long gaps (dropped frames)

**Common causes**:
- Too many units (>100)
- Combat calculations too expensive
- JavaScript rendering inefficient

**Quick fix**:
- Reduce units count
- Decrease wave size in AI
- Profile with DevTools

---

## Advanced Debugging

### Check Rust Code Compiles
```bash
cd rust_src
cargo check
```

This validates Rust syntax without full compilation.

### See Compilation Warnings
```bash
cargo clippy
```

Shows potential bugs and improvements.

### View WASM Module Structure
```bash
# Install wasm-objdump if you want:
cargo install wasmprinter
wasmprinter rust_src/pkg/age_of_war_bg.wasm | less
```

### Test WASM Locally
```bash
cd rust_src
cargo test
```

---

## Performance Optimization

If game runs slow:

### 1. Profile in DevTools
```javascript
console.time('update');
wasm.update_game();
console.timeEnd('update');
```

### 2. Reduce draw calls
- Don't serialize all units every frame
- Only JSON.parse when needed

### 3. Optimize collision detection
- Current: O(n²) - each unit checks all others
- Future: Use spatial partitioning for large numbers

### 4. WASM module size
- Current: ~1MB
- Acceptable for gameplay, consider wasm-opt for smaller builds

---

## File Permissions Issues

### Windows: Cannot write to rust_src/

**Fix**:
```bash
icacls "rust_src" /grant:r %username%:F /t
```

---

## Network/Server Issues

### "Cannot GET /index_rust.html"

**Cause**: Server not running or wrong directory

**Fix**:
```bash
# Make sure you're in the project root
cd "d:\Học tập\Age Of War"
npx http-server
# Should show: Starting up http-server
```

### CORS errors when fetching WASM

**Cause**: Opening file:// directly instead of http://

**Fix**: Always use a server:
```bash
npx http-server
# Then open: http://localhost:8000/index_rust.html
```

---

## Getting Help

1. **Check console**: `F12` → Console tab
2. **Read error messages**: They usually tell you what's wrong
3. **Follow the guide**: QUICK_START.md has the exact steps
4. **Try the simplest fix first**: Usually "npm run build" or "Hard refresh"

---

## Verification Checklist

After building, verify:

- [ ] `rust_src/pkg/age_of_war.js` exists
- [ ] `rust_src/pkg/age_of_war_bg.wasm` exists (~900 KB)
- [ ] No console errors when opening index_rust.html
- [ ] Can click a unit button without error
- [ ] Can see units on canvas
- [ ] Game ticks (wave progresses)
- [ ] Enemy spawns units

If all ✓, you're good to go! 🎮

---

**Still stuck?** Re-read QUICK_START.md and follow each step exactly as written.

