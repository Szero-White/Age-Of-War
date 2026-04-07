# Age Of War

<p align="center">
  <img src="https://raw.githubusercontent.com/Szero-White/Age-Of-War/main/assets/h1.jpg" alt="Age Of War Banner" width="900"/>
</p>

<p align="center">
  <a href="#-giới-thiệu"><img alt="Intro" src="https://img.shields.io/badge/📜-Giới%20thiệu-0ea5e9"/></a>
  <a href="#-cách-chơi"><img alt="How to play" src="https://img.shields.io/badge/🎮-Cách%20chơi-06b6d4"/></a>
  <a href="#-điều-khiển"><img alt="Controls" src="https://img.shields.io/badge/🕹️-Điều%20khiển-f43f5e"/></a>
  <a href="#-điểm-thú-vị"><img alt="Highlights" src="https://img.shields.io/badge/🔥-Điểm%20thú%20vị-f97316"/></a>
  <a href="#-tính-năng"><img alt="Features" src="https://img.shields.io/badge/✨-Tính%20năng-22c55e"/></a>
  <a href="#-cấu-trúc-dự-án"><img alt="Structure" src="https://img.shields.io/badge/🧱-Cấu%20trúc%20dự%20án-a855f7"/></a>
  <a href="#-cài-đặt--chạy"><img alt="Run" src="https://img.shields.io/badge/🚀-Cài%20đặt%20%26%20Chạy-0f172a"/></a>
  <a href="#-phát-triển"><img alt="Dev" src="https://img.shields.io/badge/🛠️-Phát%20triển-64748b"/></a>
  <a href="#-đóng-góp"><img alt="Contributing" src="https://img.shields.io/badge/🤝-Đóng%20góp-ef4444"/></a>
  <a href="#-giấy-phép"><img alt="License" src="https://img.shields.io/badge/📄-Giấy%20phép-111827"/></a>
</p>

> 🎮 **Age Of War** là dự án game (web/desktop) lấy cảm hứng từ thể loại **chiến thuật đẩy đường + phòng thủ theo thời đại**.  
> 🧠 Bạn sẽ **triệu hồi quân**, **quản lý tài nguyên**, **nâng cấp thời đại**, và **phá hủy căn cứ đối thủ**.  
> ⚙️ Repo sử dụng **JavaScript + HTML/CSS** cho giao diện và có **Rust** cho phần hiệu năng/logic (tùy kiến trúc).

---

## 📜 Giới thiệu

**Age Of War** là game chiến thuật nơi bạn:

- 🏰 **Xây căn cứ** & bảo vệ lãnh thổ
- ⚔️ **Triệu hồi quân** theo từng thời đại (Stone → Medieval → Modern…)
- 🧪 **Nâng cấp công nghệ** để mở khóa unit mới mạnh hơn
- 💰 **Tối ưu tài nguyên** để “snowball” (lăn cầu tuyết) và áp đảo đối thủ
- 🌍 **Đối đầu AI hoặc PvP** (nếu có)

<p align="center">
  <img src="https://raw.githubusercontent.com/Szero-White/Age-Of-War/main/assets/h2.jpg" alt="Gameplay Screenshot" width="800"/>
</p>

> 💡 **Gợi ý:** Nếu bạn chưa có ảnh, hãy tạo thư mục `assets/` và đặt tạm các ảnh `banner.png`, `screenshot-1.png`, `screenshot-2.png`. Khi có ảnh thật chỉ cần thay đúng tên file.

---

## 🎮 Cách chơi

### 🎯 Mục tiêu
- ✅ **Chiến thắng** khi bạn **phá hủy căn cứ** (base/tower) của đối thủ.
- ❌ **Thua** nếu căn cứ của bạn bị phá trước.

### 🧠 Cốt lõi gameplay (vòng lặp chính)
1. 💰 **Kiếm tài nguyên** theo thời gian / theo cơ chế game
2. 🪖 **Triệu hồi unit** để đẩy đường
3. 🧱 **Phòng thủ căn cứ** khi bị áp sát
4. 🧪 **Nâng cấp thời đại** để mở unit & sức mạnh mới
5. 🔥 **Chọn nhịp tấn công**: all-in đúng lúc để “kết liễu”

### 🧩 Chiến thuật gợi ý (dễ hiểu mà hiệu quả)
- 🐢 **Thủ chắc đầu game**: ưu tiên unit rẻ để cầm chân, tích tài nguyên
- 🦈 **Timing lên đời**: lên đời sớm mở unit mạnh có thể “lật kèo”
- ⚖️ **Cân bằng công – thủ**: đẩy quá tay sẽ hở base, thủ quá lâu sẽ bị out-scale
- 🎯 **Tập trung mục tiêu**: ưu tiên dọn unit tuyến trước để giữ lợi thế lính

---

## 🕹️ Điều khiển

> ⚙️ Phần này bạn có thể chỉnh theo đúng game hiện tại (mình viết theo kiểu phổ biến nhất).

- 🖱️ **Chuột trái**: bấm nút/unit để **triệu hồi**
- 🧭 **Menu / HUD**: chọn **nâng cấp** / **lên đời**
- ⌨️ **Phím tắt (nếu có)**:
  - `1-5`: triệu hồi nhanh unit
  - `Q / W / E`: skill/phép (nếu game có)

> ✍️ Nếu bạn nói rõ game đang dùng phím gì, mình sẽ chỉnh lại mục này khớp 100%.

---

## 🔥 Điểm thú vị

- 🧬 **Tiến hóa theo thời đại**: cảm giác “đổi meta” liên tục, càng về sau càng cháy 🔥
- 🧠 **Dễ chơi nhưng có chiều sâu**: chọn nhịp lên đời, build đội hình, kiểm soát đường
- ⚔️ **Nhìn đã mắt**: unit đông, combat liên tục, push/pull nhịp nhanh
- 🧩 **Dễ mở rộng**: thêm unit mới, skill mới, thời đại mới, boss… cực tiện

---

## ✨ Tính năng

- 🎯 Gameplay dễ làm quen, khó thành thạo
- 🧱 Hệ thống unit/đạn/skill tách module (dễ mở rộng)
- ⚡ Tối ưu hóa hiệu năng (có Rust)
- 🎨 UI/HUD trực quan, dễ mod
- 🧩 Có thể tích hợp:
  - 🕹️ Gamepad
  - 🔊 Âm thanh/nhạc nền
  - 🌐 Multiplayer
  - 🗺️ Bản đồ nhiều màn
  - 🧠 AI nhiều độ khó (Easy/Normal/Hard)

---

## 🧱 Cấu trúc dự án

> 📦 Cấu trúc dưới đây là **đề xuất**. Nếu repo hiện tại khác, bạn chỉnh lại cho đúng là xong.

```text
Age-Of-War/
├─ assets/                 # Ảnh, icon, âm thanh
│  ├─ banner.png
│  ├─ screenshot-1.png
│  └─ screenshot-2.png
├─ src/                    # Mã nguồn chính (JS/TS)
│  ├─ core/                # Game loop, time, input
│  ├─ entities/            # Unit, projectile, building...
│  ├─ systems/             # Combat, spawn, economy...
│  └─ ui/                  # HUD, menu, overlay
├─ rust/                   # (Nếu có) Rust workspace/crate
│  └─ ...
├─ public/                 # Static files (nếu dùng bundler)
├─ index.html
├─ styles/                 # CSS
├─ scripts/                # build scripts (PowerShell/Batch)
└─ README.md
```

---

## 🚀 Cài đặt & Chạy

### 1) Clone repo

```bash
git clone https://github.com/Szero-White/Age-Of-War.git
cd Age-Of-War
```

### 2) Chạy bản Web (HTML/JS)

> Nếu dự án chỉ là HTML/JS thuần, bạn có thể chạy bằng server tĩnh.

- ✅ Cách nhanh (khuyên dùng): dùng **VS Code Live Server**
- Hoặc dùng `http-server`:

```bash
npm i -g http-server
http-server .
```

Mở trình duyệt tại địa chỉ in ra (thường là `http://localhost:8080`).

### 3) Nếu có phần Rust (tùy chọn)

> Repo có tỷ lệ Rust ~20%, có thể dùng để build module WASM hoặc binary.

Cài Rust:

```bash
rustup update
```

Nếu dự án là WASM (gợi ý):

```bash
# ví dụ (tùy dự án)
cd rust
wasm-pack build --target web
```

---

## 🛠️ Phát triển

### ✅ Quy ước commit (gợi ý)

- `feat:` thêm tính năng ✨
- `fix:` sửa lỗi 🐛
- `refactor:` cải tổ code 🧼
- `docs:` cập nhật tài liệu 📚

### 🧪 Checklist trước khi PR

- [ ] 🎮 Chạy game không lỗi console
- [ ] 🧹 Không commit file build rác / file tạm
- [ ] 🗜️ Tối ưu asset (nén ảnh)
- [ ] 📝 Cập nhật README nếu thêm tính năng lớn

---

## 🖼️ Hình ảnh minh họa

<p align="center">
  <img src="https://raw.githubusercontent.com/Szero-White/Age-Of-War/main/assets/h3.jpg" alt="Screenshot 2" width="800"/>
</p>

---

## 🎨 Icon & Asset credits (nếu dùng)

- 🛡️ Shields/badges: **shields.io**
- 🧩 Icon: bạn có thể dùng emoji hoặc icon tự thiết kế trong `assets/`

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! 🥳

1. 🍴 Fork repo
2. 🌿 Tạo branch: `git checkout -b feat/my-feature`
3. ✅ Commit: `git commit -m "feat: add my feature"`
4. ⬆️ Push: `git push origin feat/my-feature`
5. 🔁 Mở Pull Request

---

## 📄 Giấy phép

Chưa có thông tin giấy phép trong README.  
Bạn có thể thêm file `LICENSE` (MIT/Apache-2.0/GPL-3.0...) tùy mục tiêu.

---

## 📬 Liên hệ

- GitHub: https://github.com/Szero-White
