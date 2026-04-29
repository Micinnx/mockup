// MID-FI SCRIPT - SMK VERSION (Tanpa KRS)

const VALID_CREDENTIALS = {
    '11/2020/0390': 'password123',
    'admin': 'admin'
};

const studentData = {
    '11/2020/0390': { name: 'Nish', nis: '11/2020/0390', class: 'XII TKJ 1', waliKelas: 'Pak Budi Santoso' },
    'admin': { name: 'Administrator', nis: 'ADMIN001', class: 'Staff', waliKelas: '-' }
};

const contentMap = {
    home: (studentName, studentClass, waliKelas) => `
        <h2 style="margin-bottom: 8px;">Selamat datang, ${studentName}! 👋</h2>
        <p style="margin-bottom: 4px; color: #4b5563;">Kelas: <strong>${studentClass}</strong> | Wali Kelas: ${waliKelas}</p>
        <p style="margin-bottom: 28px; color: #6b7280;">Ini adalah dashboard akademik Anda.</p>
        
        <div class="grid-3">
            <div class="card">
                <h3>📆 Jadwal Hari Ini</h3>
                <p><strong>Senin, 10 April 2024</strong></p>
                <p>🗓️ Matematika<br>08:00 - 09:30 · Ruang 101</p>
                <p>🗓️ Pemrograman Dasar<br>09:45 - 11:15 · Lab 1</p>
                <span class="badge-success">Hari aktif: 4 jam</span>
            </div>
            <div class="card">
                <h3>🏆 Rata-rata Nilai</h3>
                <div class="stat-number">85.8</div>
                <p>Ranking: <strong>5 / 32</strong></p>
                <button id="lihatNilaiBtn">📊 Lihat Detail Nilai</button>
            </div>
            <div class="card">
                <h3>📊 Statistik Kehadiran</h3>
                <p>✅ Hadir: <strong>92%</strong> (78 hari)</p>
                <p>🤒 Sakit: <strong>3%</strong> (3 hari)</p>
                <p>📝 Izin: <strong>5%</strong> (4 hari)</p>
                <div style="background:#e5e7eb; border-radius:10px; margin-top:8px;">
                    <div style="background:#1e3c72; width:92%; height:8px; border-radius:10px;"></div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h3>📢 Pengumuman Terkini</h3>
            <p><strong>📝 Pendaftaran Ujian Sekolah</strong><br>Pendaftaran ujian sekolah dibuka hingga 30 April 2024. <a href="#" id="peng1" style="color:#1e3c72;">Selengkapnya →</a></p>
            <p style="margin-top: 12px;"><strong>🎓 Pengambilan Sertifikat Kompetensi</strong><br>1-20 April 2024 di ruang akademik. <a href="#" id="peng2" style="color:#1e3c72;">Selengkapnya →</a></p>
            <p style="margin-top: 12px;"><strong>🌙 Libur Awal Ramadhan</strong><br>Libur sekolah 11-15 Maret 2024. <a href="#" id="peng3" style="color:#1e3c72;">Selengkapnya →</a></p>
        </div>
    `,
    
    jadwal: () => `
        <h2 style="margin-bottom: 20px;">📅 Jadwal Pelajaran</h2>
        <div class="card">
            <table>
                <thead>
                    <tr><th>Hari</th><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr>
                </thead>
                <tbody>
                    <tr><td rowspan="4">Senin</td><td>07:00-08:30</td><td>Matematika</td><td>Bu Siti Rahayu</td><td>Ruang 101</td></tr>
                    <tr><td>08:30-10:00</td><td>Pemrograman Dasar</td><td>Pak Budi Santoso</td><td>Lab 1</td></tr>
                    <tr><td>10:15-11:45</td><td>Basis Data</td><td>Bu Dewi Lestari</td><td>Lab 2</td></tr>
                    <tr><td>12:30-14:00</td><td>Bahasa Inggris</td><td>Bu Rina Marlina</td><td>Ruang 103</td></tr>
                    <tr><td rowspan="3">Selasa</td><td>07:00-08:30</td><td>Pendidikan Agama</td><td>Pak Ahmad Fauzi</td><td>Ruang 102</td></tr>
                    <tr><td>08:30-10:00</td><td>PKN</td><td>Bu Mega Wati</td><td>Ruang 102</td></tr>
                    <tr><td>10:15-11:45</td><td>Produk Kreatif</td><td>Pak Eko Prasetyo</td><td>Lab 1</td></tr>
                </tbody>
            </table>
            <button id="lihatJadwal">📖 Lihat Jadwal Lengkap (Senin-Jumat)</button>
            <div id="extraJadwal" class="expandable">
                <strong>📌 Jadwal Rabu - Jumat:</strong><br>
                Rabu: Basis Data (Lab 2), Matematika (101), BK (Ruang BK)<br>
                Kamis: Pemrograman Dasar (Lab 1), PAI (102), Olahraga (Lapangan)<br>
                Jumat: Produk Kreatif (Lab 1), Bimbingan Karir (Aula)
            </div>
        </div>
    `,
    
    nilai: () => `
        <h2 style="margin-bottom: 20px;">⭐ Nilai & Raport</h2>
        <div class="card">
            <table>
                <tr><th>Mata Pelajaran</th><th>Tugas</th><th>UTS</th><th>UAS</th><th>Rata-rata</th><th>Predikat</th></tr>
                <tr><td>Matematika</td><td>85</td><td>80</td><td>88</td><td>84.3</td><td>B+</td></tr>
                <tr><td>Pemrograman Dasar</td><td>90</td><td>88</td><td>92</td><td>90.0</td><td>A</td></tr>
                <tr><td>Basis Data</td><td>78</td><td>80</td><td>85</td><td>81.0</td><td>B</td></tr>
                <tr><td>Bahasa Inggris</td><td>82</td><td>85</td><td>88</td><td>85.0</td><td>B+</td></tr>
                <tr><td>Produk Kreatif</td><td>88</td><td>86</td><td>90</td><td>88.0</td><td>A-</td></tr>
                <tr><td>Pendidikan Agama</td><td>90</td><td>88</td><td>92</td><td>90.0</td><td>A</td></tr>
                <tr><td>PKN</td><td>85</td><td>82</td><td>88</td><td>85.0</td><td>B+</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #f0f9ff; border-radius: 10px;">
                <strong>📊 Ringkasan Akademik:</strong><br>
                Rata-rata Rapor: 86.2 | Rangking: 5/32 | Kenaikan Kelas: ☑️ Berhak
            </div>
        </div>
    `,
    
    pelajaran: () => `
        <h2 style="margin-bottom: 20px;">📚 Daftar Mata Pelajaran</h2>
        <div class="card">
            <table>
                <tr><th>No</th><th>Kode</th><th>Mata Pelajaran</th><th>Kelompok</th><th>Jam/Minggu</th><th>Guru</th></tr>
                <tr><td>1</td><td>MTK-12</td><td>Matematika</td><td>Umum</td><td>4 JP</td><td>Bu Siti Rahayu</td></tr>
                <tr><td>2</td><td>RPL-01</td><td>Pemrograman Dasar</td><td>Kompetensi Keahlian</td><td>6 JP</td><td>Pak Budi Santoso</td></tr>
                <tr><td>3</td><td>BD-02</td><td>Basis Data</td><td>Kompetensi Keahlian</td><td>4 JP</td><td>Bu Dewi Lestari</td></tr>
                <tr><td>4</td><td>BIG-12</td><td>Bahasa Inggris</td><td>Umum</td><td>2 JP</td><td>Bu Rina Marlina</td></tr>
                <tr><td>5</td><td>PKWU-01</td><td>Produk Kreatif</td><td>Kompetensi Keahlian</td><td>4 JP</td><td>Pak Eko Prasetyo</td></tr>
                <tr><td>6</td><td>PAI-12</td><td>Pendidikan Agama</td><td>Umum</td><td>2 JP</td><td>Pak Ahmad Fauzi</td></tr>
                <tr><td>7</td><td>PKN-12</td><td>PKN</td><td>Umum</td><td>2 JP</td><td>Bu Mega Wati</td></tr>
                <tr><td>8</td><td>OR-12</td><td>Olahraga</td><td>Umum</td><td>2 JP</td><td>Pak Joko Susilo</td></tr>
                <tr><td>9</td><td>BK-12</td><td>Bimbingan Konseling</td><td>Layanan</td><td>1 JP</td><td>Bu Indah Permata</td></tr>
            </table>
            <p style="margin-top: 16px; font-size: 13px; color: #666;">📌 Total Jam Pelajaran per Minggu: 27 Jam Pelajaran</p>
        </div>
    `,
    
    tagihan: () => `
        <h2 style="margin-bottom: 20px;">💰 Informasi Tagihan</h2>
        <div class="card">
            <table>
                <tr><th>Jenis Tagihan</th><th>Periode</th><th>Nominal</th><th>Status</th><th>Jatuh Tempo</th></tr>
                <tr><td>SPP Bulanan</td><td>Januari 2024</td><td>Rp 150.000</td><td><span class="badge-success">Lunas</span></td><td>10/01/2024</td></tr>
                <tr><td>SPP Bulanan</td><td>Februari 2024</td><td>Rp 150.000</td><td><span class="badge-success">Lunas</span></td><td>10/02/2024</td></tr>
                <tr><td>SPP Bulanan</td><td>Maret 2024</td><td>Rp 150.000</td><td><span class="badge-success">Lunas</span></td><td>10/03/2024</td></tr>
                <tr><td>SPP Bulanan</td><td>April 2024</td><td>Rp 150.000</td><td><span class="badge-warning">Belum Lunas</span></td><td>10/04/2024</td></tr>
                <tr><td>Uang Komite</td><td>Semester Genap</td><td>Rp 100.000</td><td><span class="badge-warning">Belum Lunas</span></td><td>15/03/2024</td></tr>
                <tr><td>Biaya Praktikum</td><td>Semester Genap</td><td>Rp 200.000</td><td><span class="badge-warning">Belum Lunas</span></td><td>20/03/2024</td></tr>
                <tr><td>Seragam Olahraga</td><td>2024</td><td>Rp 250.000</td><td><span class="badge-success">Lunas</span></td><td>05/02/2024</td></tr>
            </table>
            
            <div style="margin-top: 20px; padding: 16px; background: #fef3c7; border-radius: 10px;">
                <strong>💰 Total Tagihan Belum Dibayar:</strong> Rp 600.000<br>
                <small>(SPP April + Uang Komite + Biaya Praktikum)</small>
            </div>
            
            <button id="bayarBtn">💳 Bayar Sekarang</button>
            <div id="notifBayar" style="display:none; margin-top: 12px; padding: 12px; background: #d1fae5; border-radius: 8px;">
                ✅ Simulasi: Mengarahkan ke halaman pembayaran...
            </div>
        </div>
    `
};

let currentTab = 'home';

function render(tab, studentName = 'Nish', studentClass = 'XII TKJ 1', waliKelas = 'Pak Budi Santoso') {
    const container = document.getElementById('dynamicContent');
    if (tab === 'home') {
        container.innerHTML = contentMap.home(studentName, studentClass, waliKelas);
    } else if (contentMap[tab]) {
        container.innerHTML = contentMap[tab]();
    }
    attachEvents(tab);
    currentTab = tab;
}

function attachEvents(tab) {
    if (tab === 'home') {
        const nilaiBtn = document.getElementById('lihatNilaiBtn');
        if (nilaiBtn) nilaiBtn.onclick = () => render('nilai');
        const p1 = document.getElementById('peng1');
        const p2 = document.getElementById('peng2');
        const p3 = document.getElementById('peng3');
        if (p1) p1.onclick = (e) => { e.preventDefault(); alert('📢 Info: Pendaftaran ujian sekolah dibuka 1-30 April 2024'); };
        if (p2) p2.onclick = (e) => { e.preventDefault(); alert('🎓 Sertifikat kompetensi dapat diambil di ruang akademik'); };
        if (p3) p3.onclick = (e) => { e.preventDefault(); alert('🌙 Libur sekolah 11-15 Maret 2024'); };
    }
    if (tab === 'jadwal') {
        const btn = document.getElementById('lihatJadwal');
        if (btn) btn.onclick = () => {
            const extra = document.getElementById('extraJadwal');
            extra.style.display = extra.style.display === 'none' ? 'block' : 'none';
        };
    }
    if (tab === 'tagihan') {
        const bayar = document.getElementById('bayarBtn');
        if (bayar) bayar.onclick = () => {
            const notif = document.getElementById('notifBayar');
            notif.style.display = 'block';
            setTimeout(() => notif.style.display = 'none', 3000);
        };
    }
}

// === LOGIN ===
if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', () => {
        const nis = document.getElementById('nis').value.trim();
        const password = document.getElementById('password').value;
        
        if (VALID_CREDENTIALS[nis] && VALID_CREDENTIALS[nis] === password) {
            localStorage.setItem('midfi_user', nis);
            localStorage.setItem('midfi_user_name', studentData[nis]?.name || 'User');
            localStorage.setItem('midfi_user_class', studentData[nis]?.class || 'XII TKJ 1');
            localStorage.setItem('midfi_wali_kelas', studentData[nis]?.waliKelas || 'Pak Budi Santoso');
            window.location.href = 'dashboard.html';
        } else {
            alert('❌ Login Gagal!\n\nGunakan:\nNIS: 11/2020/0390\nPassword: password123');
        }
    });
}

// === DASHBOARD ===
if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = localStorage.getItem('midfi_user');
    if (!currentUser) window.location.href = 'index.html';
    
    const userName = localStorage.getItem('midfi_user_name') || 'Nish';
    const userClass = localStorage.getItem('midfi_user_class') || 'XII TKJ 1';
    const waliKelas = localStorage.getItem('midfi_wali_kelas') || 'Pak Budi Santoso';
    
    document.getElementById('userDisplay').innerHTML = `👤 ${userName}`;
    document.getElementById('sidebarUserInfo').innerHTML = `NIS: ${currentUser}<br>Kelas: ${userClass}`;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            render(this.getAttribute('data-tab'), userName, userClass, waliKelas);
        });
    });
    
    render('home', userName, userClass, waliKelas);
    
    document.getElementById('logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });
}