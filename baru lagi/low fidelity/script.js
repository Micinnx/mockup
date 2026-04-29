// Valid credentials
const VALID_CREDENTIALS = {
    '11/2020/0390': 'password123',
    'admin': 'admin'
};

// Student data
const studentData = {
    '11/2020/0390': { name: 'Nish', nis: '11/2020/0390', class: 'XII TKJ 1' },
    'admin': { name: 'Administrator', nis: 'ADMIN001', class: 'Staff' }
};

// Dashboard content
const dataContent = {
    home: (studentName, studentClass) => `
        <h3>Selamat datang, ${studentName}!</h3>
        <p>Kelas: ${studentClass}</p>
        <p>Ini adalah dashboard akademik Anda. Silakan pilih menu di samping.</p>
        <div class="lofi-grid">
            <div class="lofi-card">
                <strong>📆 Jadwal Hari Ini</strong><br>
                Senin, 10 April 2024<br>
                Matematika<br>
                08:00 - 10:00 · Ruang 101
            </div>
            <div class="lofi-card">
                <strong>🏆 Rata-rata Nilai</strong><br>
                <span style="font-size:32px;">85.5</span><br>
                <button id="lihatNilaiBtn">Lihat Nilai</button>
            </div>
            <div class="lofi-card">
                <strong>📊 Absensi</strong><br>
                Hadir: 92%<br>
                Sakit: 3% | Izin: 5%
            </div>
        </div>
        <div class="lofi-card">
            <strong>📢 Pengumuman</strong><br><br>
            <strong>Pendaftaran Ujian Sekolah</strong><br>
            Pendaftaran ujian sekolah dibuka hingga 30 April 2024.<br>
            <a href="#" id="peng1">Selengkapnya →</a><br><br>
            <strong>Pengambilan Sertifikat Kompetensi</strong><br>
            1 April 2024, segera ambil di ruang akademik.<br>
            <a href="#" id="peng2">Selengkapnya →</a><br><br>
            <strong>Libur Awal Ramadhan</strong><br>
            Libur sekolah tanggal 11-15 Maret 2024.<br>
            <a href="#" id="peng3">Selengkapnya →</a>
        </div>
    `,
    jadwal: `
        <h3>📖 Jadwal Pelajaran</h3>
        <table class="lofi-table">
            <tr><th>Hari</th><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr>
            <tr><td rowspan="2">Senin</td><td>07:00-08:30</td><td>Matematika</td><td>Bu Siti</td><td>Ruang 101</td></tr>
            <tr><td>08:30-10:00</td><td>Pemrograman Dasar</td><td>Pak Budi</td><td>Lab 1</td></tr>
            <tr><td rowspan="2">Selasa</td><td>07:00-08:30</td><td>Basis Data</td><td>Bu Dewi</td><td>Lab 2</td></tr>
            <tr><td>08:30-10:00</td><td>Pendidikan Agama</td><td>Pak Ahmad</td><td>Ruang 102</td></tr>
            <tr><td rowspan="2">Rabu</td><td>07:00-08:30</td><td>Bahasa Inggris</td><td>Bu Rina</td><td>Ruang 103</td></tr>
            <tr><td>08:30-10:00</td><td>Produk Kreatif</td><td>Pak Eko</td><td>Lab 1</td></tr>
        </table>
        <button id="lihatJadwal">Lihat Jadwal Lengkap</button>
        <div id="extraJadwal" style="display:none; margin-top:12px; border:1px solid #000; padding:8px;">
            ✨ Jadwal tambahan: Kamis (PKN), Jumat (Olahraga & BK)
        </div>
    `,
    nilai: `
        <h3>📊 Nilai Akademik</h3>
        <table class="lofi-table">
            <tr><th>Mata Pelajaran</th><th>Nilai Tugas</th><th>Nilai UTS</th><th>Nilai UAS</th><th>Rata-rata</th><th>Grade</th></tr>
            <tr><td>Matematika</td><td>85</td><td>80</td><td>90</td><td>85</td><td>B+</td></tr>
            <tr><td>Pemrograman Dasar</td><td>90</td><td>88</td><td>92</td><td>90</td><td>A</td></tr>
            <tr><td>Basis Data</td><td>78</td><td>80</td><td>85</td><td>81</td><td>B</td></tr>
            <tr><td>Bahasa Inggris</td><td>82</td><td>85</td><td>88</td><td>85</td><td>B+</td></tr>
            <tr><td>Produk Kreatif</td><td>88</td><td>86</td><td>90</td><td>88</td><td>A-</td></tr>
        </table>
        <p style="margin-top:12px;"><strong>Rata-rata Rapor:</strong> 85.8 | <strong>Ranking:</strong> 5/32</p>
    `,
    pelajaran: `
        <h3>📚 Mata Pelajaran Semester Genap</h3>
        <table class="lofi-table">
            <tr><th>No</th><th>Kode Mapel</th><th>Mata Pelajaran</th><th>Jumlah Jam</th><th>Guru Pengajar</th></tr>
            <tr><td>1</td><td>MTK-12</td><td>Matematika</td><td>4 JP</td><td>Bu Siti Rahayu</td></tr>
            <tr><td>2</td><td>RPL-01</td><td>Pemrograman Dasar</td><td>6 JP</td><td>Pak Budi Santoso</td></tr>
            <tr><td>3</td><td>BD-02</td><td>Basis Data</td><td>4 JP</td><td>Bu Dewi Lestari</td></tr>
            <tr><td>4</td><td>BIG-12</td><td>Bahasa Inggris</td><td>2 JP</td><td>Bu Rina Marlina</td></tr>
            <tr><td>5</td><td>PKWU-01</td><td>Produk Kreatif</td><td>4 JP</td><td>Pak Eko Prasetyo</td></tr>
            <tr><td>6</td><td>PAI-12</td><td>Pendidikan Agama</td><td>2 JP</td><td>Pak Ahmad Fauzi</td></tr>
            <tr><td>7</td><td>PKN-12</td><td>PKN</td><td>2 JP</td><td>Bu Mega Wati</td></tr>
            <tr><td>8</td><td>OR-12</td><td>Olahraga</td><td>2 JP</td><td>Pak Joko Susilo</td></tr>
        </table>
    `,
    tagihan: `
        <h3>💰 Tagihan Sekolah</h3>
        <table class="lofi-table">
            <tr><th>Jenis</th><th>Periode</th><th>Nominal</th><th>Status</th><th>Jatuh Tempo</th></tr>
            <tr><td>SPP</td><td>Januari 2024</td><td>Rp 150.000</td><td>Lunas</td><td>10/01/2024</td></tr>
            <tr><td>SPP</td><td>Februari 2024</td><td>Rp 150.000</td><td>Lunas</td><td>10/02/2024</td></tr>
            <tr><td>SPP</td><td>Maret 2024</td><td>Rp 150.000</td><td>Lunas</td><td>10/03/2024</td></tr>
            <tr><td>SPP</td><td>April 2024</td><td>Rp 150.000</td><td>Belum Lunas</td><td>10/04/2024</td></tr>
            <tr><td>Uang Komite</td><td>Semester Genap</td><td>Rp 100.000</td><td>Belum Lunas</td><td>15/03/2024</td></tr>
            <tr><td>Praktikum</td><td>Semester Genap</td><td>Rp 200.000</td><td>Belum Lunas</td><td>20/03/2024</td></tr>
            <tr><td>Seragam Olahraga</td><td>2024</td><td>Rp 250.000</td><td>Lunas</td><td>05/02/2024</td></tr>
        </table>
        <button id="bayarBtn">💳 Bayar Sekarang</button>
        <div id="notifBayar" style="display:none; margin-top:12px; border:1px solid #000; padding:8px;">
            ✅ Simulasi: Redirect ke halaman pembayaran
        </div>
    `
};

function loadContent(tab, studentName = 'Nish', studentClass = 'XII TKJ 1') {
    const container = document.getElementById('dynamicContent');
    if (tab === 'home') {
        container.innerHTML = dataContent.home(studentName, studentClass);
    } else if (dataContent[tab]) {
        container.innerHTML = dataContent[tab];
    } else {
        container.innerHTML = '<div class="lofi-card">Konten tidak tersedia</div>';
    }
    
    // Attach events
    if (tab === 'home') {
        const nilaiBtn = document.getElementById('lihatNilaiBtn');
        if (nilaiBtn) nilaiBtn.onclick = () => loadContent('nilai');
        const p1 = document.getElementById('peng1');
        const p2 = document.getElementById('peng2');
        const p3 = document.getElementById('peng3');
        if (p1) p1.onclick = (e) => { e.preventDefault(); alert('Info: Pendaftaran ujian sekolah dibuka!'); };
        if (p2) p2.onclick = (e) => { e.preventDefault(); alert('Sertifikat diambil di ruang akademik'); };
        if (p3) p3.onclick = (e) => { e.preventDefault(); alert('Libur sekolah 11-15 Maret 2024'); };
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

// === LOGIN LOGIC ===
if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', () => {
        const nis = document.getElementById('nis').value.trim();
        const password = document.getElementById('password').value;
        
        if (VALID_CREDENTIALS[nis] && VALID_CREDENTIALS[nis] === password) {
            localStorage.setItem('lofi_user', nis);
            localStorage.setItem('lofi_user_name', studentData[nis]?.name || 'User');
            localStorage.setItem('lofi_user_class', studentData[nis]?.class || 'XII TKJ 1');
            window.location.href = 'dashboard.html';
        } else {
            alert('❌ Login Gagal!\n\nGunakan:\nNIS: 11/2020/0390\nPassword: password123\n\nAtau\nNIS: admin\nPassword: admin');
        }
    });
}

// === DASHBOARD LOGIC ===
if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = localStorage.getItem('lofi_user');
    if (!currentUser) {
        window.location.href = 'index.html';
    }
    
    const userName = localStorage.getItem('lofi_user_name') || 'Nish';
    const userClass = localStorage.getItem('lofi_user_class') || 'XII TKJ 1';
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `${userName} | ${currentUser} | Kelas: ${userClass} | <a href="#" id="logout">Logout</a>`;
    }
    
    // Menu navigation
    document.querySelectorAll('.lofi-menu').forEach(menu => {
        menu.addEventListener('click', () => {
            const tab = menu.getAttribute('data-tab');
            loadContent(tab, userName, userClass);
        });
    });
    
    loadContent('home', userName, userClass);
    
    // Logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lofi_user');
            localStorage.removeItem('lofi_user_name');
            localStorage.removeItem('lofi_user_class');
            window.location.href = 'index.html';
        });
    }
}