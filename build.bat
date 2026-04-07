@echo off
echo Building Rust to WebAssembly...
cd rust_src
wasm-pack build --target web
cd ..
echo Build complete! WASM module is in rust_src/pkg/
pause
