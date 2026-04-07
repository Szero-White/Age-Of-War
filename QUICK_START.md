# 🎮 Age of War - Rust WASM Quick Start

## ⚡ 30 Giây Setup

### Windows
```batch
setup_and_run.bat
```

### macOS / Linux
```bash
npm install && npm run build && npx http-server
```

Rồi mở: **http://localhost:8000/index_rust.html**

---

## 📖 Bước Chi Tiết

1. **Cài Đặt Rust** (nếu chưa)
   - Download: https://rustup.rs/
   - Chạy installer

2. **Cài Đặt Dependencies**
   ```bash
   npm install
   ```

3. **Build Wasm**
   ```bash
   npm run build
   # File output: rust_src/pkg/
   ```

4. **Chạy Game**
   - Cách 1: Mở `index_rust.html` trực tiếp (chỉ Chrome/Firefox)
   - Cách 2: Chạy local server
     ```bash
     npx http-server
     # Mở http://localhost:8000/index_rust.html
     ```

---

## 🎯 Chế Độ Chơi

- **Click nút**→ Huấn luyện quân
- **Nâng Cấp Era** → Tăng sức mạnh all units
- **Tạm Dừng** → Dừng game
- **Tốc Độ** → x2 speed

**Thắng**: Phá huỷ lâu đài địch  
**Thua**: Lâu đài bạn bị phá huỷ

---

## 🛠️ Phát Triển

### Thay Đổi Game Logic
1. Sửa file trong `rust_src/src/`
2. Chạy `npm run build`
3. Refresh trình duyệt (Ctrl+R)

### Key Files
- **game.rs** - Game mechanics & AI
- **unit.rs** - Unit stats & combat
- **era.rs** - Era definitions
- **index_rust.html** - Frontend

---

## 🆘 Sự Cố

| Vấn Đề | Giải Pháp |
|--------|---------|
| WASM module not found | Chạy `npm run build` |
| Game chậy | Reload page, check Console (F12) |
| Không thấy units | Mở DevTools Console, kiểm tra error |
| Build error | Đảm bảo Rust & Node.js đã cài |

---

## 📊 Lợi ích Rust + WASM

| | JavaScript | Rust + WASM |
|---------|------------|-----------|
| Tốc độ | Bình thường | **3-10x nhanh hơn** |
| Type Safety | Yếu ⚠️ | Mạnh ✅ |
| Bundle | ~50KB | ~1MB (nhưng trao đổi hợp lý) |

---

## 📚 Tài Liệu Đầy Đủ

Xem `README_RUST.md` để hiểu rõ hơn về:
- Cấu trúc Rust modules
- Chi tiết WASM bindings
- Hướng phát triển advanced

---

**Happy gaming! 🚀**

