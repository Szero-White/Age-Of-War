# Age of War - Rust + WebAssembly Edition

## 📖 Documentation Index

Choose what you want to do:

### 🚀 I want to play the game
→ **[QUICK_START.md](QUICK_START.md)** (2 minutes)
- Windows: Run `setup_and_run.bat`
- macOS/Linux: `npm install && npm run build && npx http-server`

### 👨‍💻 I want to understand the code
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** (20 minutes)
- Module breakdown
- Game loop flow
- WASM interface documentation
- Common modifications guide

### 📚 I want the full guide
→ **[README_RUST.md](README_RUST.md)** (30 minutes)
- Installation details
- Game mechanics explanation
- Build artifacts description
- Troubleshooting

### 🔄 I want to know what changed
→ **[CONVERSION.md](CONVERSION.md)** (10 minutes)
- JavaScript → Rust migration
- Feature parity checklist
- Performance comparison
- File structure overview

---

## 🎮 Quick Commands

```bash
# Setup
npm install

# Build Rust to WebAssembly
npm run build

# Run local server
npx http-server

# Open game
# → http://localhost:8000/index_rust.html
```

Or just run one of these:
- **Windows**: `setup_and_run.bat`
- **PowerShell**: `setup_and_run.ps1`

---

## 📁 Project Structure

```
Age Of War/
├── index_rust.html          ← Play here (after build)
├── style.css                ← Styling
│
├── rust_src/                ← Rust source code
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs           (WASM interface)
│       ├── game.rs          (Game logic)
│       ├── unit.rs          (Units & combat)
│       ├── era.rs           (Era system)
│       └── ai.rs            (Enemy AI)
│
├── 📚 Documentation
│   ├── QUICK_START.md       ← Start here!
│   ├── README_RUST.md       (Complete guide)
│   ├── ARCHITECTURE.md      (For developers)
│   ├── CONVERSION.md        (Migration details)
│   └── INDEX.md             (This file)
│
└── 🛠️ Setup Scripts
    ├── package.json
    ├── build.bat
    ├── setup_and_run.bat
    └── setup_and_run.ps1
```

---

## ⚡ What You Need

- **Rust**: https://rustup.rs/
- **Node.js**: https://nodejs.org/
- **Browser**: Chrome, Firefox, Safari, or Edge (recent version)

---

## 🎯 Get Started Now

1. **Choose your guide**: Pick one above based on what you want to do
2. **Run the setup**: Use `setup_and_run.bat` or follow QUICK_START.md
3. **Enjoy!** 🎮

---

## ❓ Common Questions

**Q: What's this Rust/WASM thing?**  
A: Your JavaScript game is now written in Rust and compiled to WebAssembly for better performance!

**Q: Do I need to know Rust?**  
A: No! Just read the docs. But if you want to modify the game, ARCHITECTURE.md helps.

**Q: Is it faster than the original?**  
A: Yes, Rust compiles to optimized WebAssembly - typically 3-10x faster for game logic.

**Q: Can I go back to JavaScript?**  
A: Yes! The original JavaScript files are still in this folder (script.js, index.html).

**Q: Need help?**  
A: Check the troubleshooting section in README_RUST.md or QUICK_START.md!

---

**Ready?** → Start with [QUICK_START.md](QUICK_START.md)! 🚀

