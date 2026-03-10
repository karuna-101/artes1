# Artest - Web AR Coloring (Quiver Style) - UPDATED

Aplikasi ini telah diintegrasikan dengan aset Anda secara otomatis.

## File Terintegrasi:
1. **Line Art**: `assets/line art.png` digunakan sebagai template mewarnai pada canvas.
2. **Objek 3D**: `assets/marker 1.glb` digunakan sebagai model utama yang muncul di AR.

## Cara Menggunakan:
1. **Jalankan Server**: Gunakan VS Code `Live Server` atau `npx serve .` di folder ini.
2. **Siapkan Marker**: Buka browser dan arahkan kamera ke **Marker Hiro**.
   - Anda bisa mencari "AR.js Hiro Marker" di Google dan tunjukkan di layar HP lain atau print.
3. **Mewarnai**: Warnai gambar di panel kiri. Hasilnya akan langsung muncul di model 3D di layar tengah.

## Catatan Teknis:
- **Aset Besar**: File `line art.png` Anda cukup besar (~7MB). Browser mungkin butuh beberapa detik untuk memuatnya pertama kali.
- **Tekstur (UV Map)**: Agar pewarnaan rapi, model `marker 1.glb` harus memiliki UV Mapping yang sesuai dengan layout di `line art.png`.
- **Model Lain**: Jika ingin menggunakan `objek 1.blend`, mohon export dulu ke format `.glb` melalui Blender, lalu ganti di `index.html`.

## Cara Mengganti Marker Kustom:
Jika Anda ingin menggunakan gambar sendiri sebagai marker:
1. Pindahkan file `.patt` ke folder `assets/`.
2. Buka `index.html` dan ganti `<a-marker preset="hiro">` menjadi:
   ```html
   <a-marker type="pattern" url="assets/nama_file.patt">
   ```
