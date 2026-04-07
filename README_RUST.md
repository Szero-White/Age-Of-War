# Age of War 3 - Rust + WebAssembly Version

Chuyển đổi trò chơi Age of War 3 từ JavaScript sang Rust + WebAssembly, cho hiệu năng tốt hơn!

## 📋 Yêu Cầu

- **Node.js** & **npm** (để cài đặt wasm-pack)
- **Rust** (cài từ https://rustup.rs/)
- wasm-pack (sẽ được cài tự động)

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### 1. Cài Đặt Rust (nếu chưa có)
```bash
# Windows PowerShell / CMD
# Tải từ https://rustup.rs/ hoặc chạy:
# curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

rustc --version  # Kiểm tra Rust đã cài
cargo --version  # Kiểm tra Cargo đã cài
```

### 2. Cài Đặt wasm-pack
```bash
npm install
```

### 3. Build Rust to WebAssembly
```bash
npm run build
# Hoặc trên Windows, chạy: build.bat
```

Lệnh này sẽ:
- Biên dịch Rust code sang WebAssembly
- Tạo JavaScript bindings
- Output sẽ ở thư mục `rust_src/pkg/`

### 4. Chạy Game

**Option A: File đơn giản (không cần server)**
- Mở file `index_rust.html` trực tiếp trong trình duyệt

**Option B: Local server (nên dùng)**
```bash
# Nếu có Python
python -m http.server 8000
# Rồi mở http://localhost:8000/index_rust.html

# Nếu có Node.js (http-server)
npx http-server
```

## 🎮 Cách Chơi

- **Nút Lính/Thủ Cung/Hiệp Sĩ/Pháp Sư**: Huấn luyện quân
- **Nâng Cấp Era**: Nâng lên kỷ nguyên mới (tăng sức mạnh)
- **⏸ Tạm Dừng**: Dừng trò chơi
- **🔄 Chơi Lại**: Reset game
- **⏩ Tốc Độ**: Tăng tốc độ chơi

**Mục tiêu**: Phá huỷ lâu đài địch trước khi lâu đài bạn bị phá huỷ!

## 📁 Cấu Trúc Dự Án

```
Age Of War/
├── index_rust.html          # HTML chính (dùng WASM)
├── style.css                # CSS styling
├── package.json             # Dependencies
├── build.bat                # Script build cho Windows
│
└── rust_src/                # Mã Rust
    ├── Cargo.toml           # Rust dependencies
    └── src/
        ├── lib.rs           # WASM bindings chính
        ├── game.rs          # Game logic
        ├── unit.rs          # Unit definitions
        ├── era.rs           # Era system
        └── ai.rs            # Enemy AI
```

## 🛠️ Phát Triển

### Thay Đổi Mã Rust
1. Chỉnh sửa file trong `rust_src/src/`
2. Chạy `npm run build` để biên dịch lại
3. Reload trang trong trình duyệt

### Cấu Trúc Module Rust

- **game.rs**: 
  - `Game` struct: Quản lý trạng thái toàn bộ game
  - `update()`: Logic cập nhật game mỗi frame
  - `spawn_player_unit()`: Tạo quân cho người chơi
  - `upgrade_player_era()`: Nâng cấp kỷ nguyên

- **unit.rs**:
  - `Unit` struct: Đại diện một quân
  - `UnitType` enum: 4 loại quân
  - Combat logic cho từng unit

- **ai.rs**:
  - Enemy AI decision making
  - `decide_unit_to_build()`: Quyết định quân AI sẽ tạo

- **era.rs**:
  - Era definitions (5 kỷ nguyên)
  - Stats scaling dựa trên era

## 🔗 WebAssembly Bindings

Key functions exported to JavaScript:
- `create_game()` - Khởi tạo game
- `update_game()` - Cập nhật một frame
- `spawn_player_unit(type)` - Huấn luyện quân
- `upgrade_player_era()` - Nâng cấp era
- `toggle_pause()` - Tạm dừng/tiếp tục
- `get_player_health()` - Lấy HP của lâu đài người chơi
- `get_units_json()` - Lấy JSON của tất cả units (để vẽ)
- ... và nhiều hàm getter khác

## ⚡ Lợi Ích Rust + WASM

- **Tốc độ cao hơn**: Rust biên dịch sang native WebAssembly
- **Type-safe**: Tránh lỗi runtime phổ biến
- **Memory efficient**: Kiản soát bộ nhớ tốt hơn JavaScript
- **Scalable**: Dễ thêm tính năng phức tạp

## 🐛 Troubleshooting

### Lỗi: "Cannot find module age_of_war.js"
→ Chạy `npm run build` trước

### Lỗi: "wasm-pack not found"
→ Chạy `npm install` để cài dependency

### Trò chơi chạy chậm
→ Kiểm tra browser DevTools Console (F12) có error không

### Không thấy units trên canvas
→ Check rằng `get_units_json()` trả về data đúng (mở DevTools console)

## 📝 Ghi Chú

- Phiên bản này là **80% hoàn thành** - có thể cần tinh chỉnh rendering
- Combat system đã được port từ JavaScript sang Rust
- AI decision making hoạt động nhưng có thể tối ưu hơn
- Hiệu ứng âm thanh chưa được thêm vào

## 🔄 So Sánh JS vs Rust

| Tính Năng | JS Version | Rust Version |
|-----------|-----------|--------------|
| Performance | ✅ Ổn | ✅✅ Tốt hơn |
| Type Safety | ⚠️ Yếu | ✅ Mạnh |
| Bundle Size | ✅ Nhỏ | ⚠️ ~1MB (WASM) |
| Development | ✅ Nhanh | ⚠️ Chậm hơn (phải compile) |

---

**Chúc bạn chơi game vui vẻ! 🎮**
