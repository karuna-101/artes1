# Artest - Web Digital Coloring (No Camera Needed)

Proyek ini telah diperbarui menjadi pengalaman mewarnai digital penuh di web. Tidak perlu menggunakan kamera fisik.

## 🎨 Alur Kerja:
1. **Warnai**: Gunakan palet warna untuk mewarnai karakter burung pada kanvas `line-art`.
2. **Scan**: Klik tombol **"Mulai Scan"** untuk memproses warna Anda secara digital. 
   - *Akan ada animasi laser scan di atas kanvas.*
3. **Hasil**: Selesai scan, hasil karya Anda akan muncul secara otomatis dalam bentuk objek 3D yang interaktif (menggunakan `marker 1.glb`).

## 🛠️ Persiapan:
1. Pastikan file `line art.png` dan `marker 1.glb` ada di folder `assets/`.
2. Jalankan server lokal (misal: `Live Server`).
3. Buka `index.html` di browser laptop atau HP.

## 💻 Teknologi:
- **A-Frame**: Digunakan untuk menampilkan hasil 3D tanpa AR/Kamera.
- **HTML5 Canvas**: Untuk papan mewarnai yang responsif.
- **Pure JavaScript**: Logika pewarnaan dan sinkronisasi tekstur.
