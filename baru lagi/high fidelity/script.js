// HI-FI SCRIPT - Premium SMK Version

const VALID_CREDENTIALS = {
    '151208': 'password123',
    'admin': 'admin'
};

const studentData = {
    '151208': { 
        name: 'Nish',
        nis: '11/2020/0390', 
        class: 'XII TKJ 1',
        waliKelas: 'Pak Budi Santoso',
        phone: '0812-3456-7890',
        email: 'nish@smkpgri11.sch.id',
        address: 'Jl. Raya Serpong No. 45, Tangerang Selatan'
    },
    'admin': { 
        name: 'Administrator', 
        nis: 'ADMIN001', 
        class: 'Staff',
        waliKelas: '-',
        phone: '-',
        email: 'admin@smkpgri11.sch.id',
        address: '-'
    }
};

// Content Components
const components = {
    home: (data) => `
        <div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-info">
                        <h4>Jadwal Hari Ini</h4>
                        <div class="stat-value">4</div>
                        <div class="stat-label">Mata Pelajaran</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <h4>Rata-rata Nilai</h4>
                        <div class="stat-value">85.8</div>
                        <div class="stat-label">Ranking 5/32</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user-check"></i></div>
                    <div class="stat-info">
                        <h4>Kehadiran</h4>
                        <div class="stat-value">92%</div>
                        <div class="stat-label">Hadir 78/85 hari</div>
                    </div>
                </div>
            </div>
            
            <div class="card-premium">
                <h3 style="margin-bottom: 16px;"><i class="fas fa-chalkboard-user"></i> Jadwal Hari Ini - Senin, 10 April 2024</h3>
                <table class="table-premium">
                    <thead><tr><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr></thead>
                    <tbody>
                        <tr><td>07:00 - 08:30</td><td>Matematika</td><td>Bu Siti Rahayu</td><td>Ruang 101</td></tr>
                        <tr><td>08:30 - 10:00</td><td>Pemrograman Dasar</td><td>Pak Budi Santoso</td><td>Lab 1</td></tr>
                        <tr><td>10:15 - 11:45</td><td>Basis Data</td><td>Bu Dewi Lestari</td><td>Lab 2</td></tr>
                        <tr><td>12:30 - 14:00</td><td>Bahasa Inggris</td><td>Bu Rina Marlina</td><td>Ruang 103</td></tr>
                    </tbody>
                </table>
                <button class="btn-primary" id="lihatJadwalBtn" style="margin-top: 16px;"><i class="fas fa-calendar-week"></i> Lihat Jadwal Lengkap</button>
            </div>
            
            <div class="card-premium">
                <h3 style="margin-bottom: 16px;"><i class="fas fa-bullhorn"></i> Pengumuman Terkini</h3>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="padding: 12px; background: #e8f4f8; border-radius: 10px;">
                        <strong>📝 Pendaftaran Ujian Sekolah</strong>
                        <p style="font-size: 13px; margin-top: 4px;">Pendaftaran ujian sekolah dibuka hingga 30 April 2024. Segera daftar di ruang akademik.</p>
                        <a href="#" id="peng1" style="color: var(--primary); font-size: 13px;">Selengkapnya →</a>
                    </div>
                    <div style="padding: 12px; background: #fef3c7; border-radius: 10px;">
                        <strong>🎓 Pengambilan Sertifikat Kompetensi</strong>
                        <p style="font-size: 13px; margin-top: 4px;">Sertifikat dapat diambil mulai 1-20 April 2024 di ruang akademik.</p>
                        <a href="#" id="peng2" style="color: var(--primary); font-size: 13px;">Selengkapnya →</a>
                    </div>
                    <div style="padding: 12px; background: #ffe4e4; border-radius: 10px;">
                        <strong>🌙 Libur Awal Ramadhan</strong>
                        <p style="font-size: 13px; margin-top: 4px;">Libur sekolah tanggal 11-15 Maret 2024. Masuk kembali 18 Maret 2024.</p>
                        <a href="#" id="peng3" style="color: var(--primary); font-size: 13px;">Selengkapnya →</a>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    jadwal: () => `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-calendar-alt"></i> Jadwal Pelajaran</h2>
        <div class="card-premium">
            <table class="table-premium">
                <thead>
                    <tr><th>Hari</th><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr>
                </thead>
                <tbody>
                    <tr><td rowspan="4"><strong>Senin</strong></td><td>07:00-08:30</td><td>Matematika</td><td>Bu Siti Rahayu</td><td>Ruang 101</td></tr>
                    <tr><td>08:30-10:00</td><td>Pemrograman Dasar</td><td>Pak Budi Santoso</td><td>Lab 1</td></tr>
                    <tr><td>10:15-11:45</td><td>Basis Data</td><td>Bu Dewi Lestari</td><td>Lab 2</td></tr>
                    <tr><td>12:30-14:00</td><td>Bahasa Inggris</td><td>Bu Rina Marlina</td><td>Ruang 103</td></tr>
                    
                    <tr><td rowspan="3"><strong>Selasa</strong></td><td>07:00-08:30</td><td>Pendidikan Agama</td><td>Pak Ahmad Fauzi</td><td>Ruang 102</td></tr>
                    <tr><td>08:30-10:00</td><td>PKN</td><td>Bu Mega Wati</td><td>Ruang 102</td></tr>
                    <tr><td>10:15-11:45</td><td>Produk Kreatif</td><td>Pak Eko Prasetyo</td><td>Lab 1</td></tr>
                    
                    <tr><td rowspan="3"><strong>Rabu</strong></td><td>07:00-08:30</td><td>Basis Data</td><td>Bu Dewi Lestari</td><td>Lab 2</td></tr>
                    <tr><td>08:30-10:00</td><td>Matematika</td><td>Bu Siti Rahayu</td><td>Ruang 101</td></tr>
                    <tr><td>10:15-11:45</td><td>BK</td><td>Bu Indah Permata</td><td>Ruang BK</td></tr>
                    
                    <tr><td rowspan="2"><strong>Kamis</strong></td><td>07:00-08:30</td><td>Pemrograman Dasar</td><td>Pak Budi Santoso</td><td>Lab 1</td></tr>
                    <tr><td>08:30-10:00</td><td>Olahraga</td><td>Pak Joko Susilo</td><td>Lapangan</td></tr>
                    
                    <tr><td rowspan="2"><strong>Jumat</strong></td><td>07:00-08:30</td><td>Produk Kreatif</td><td>Pak Eko Prasetyo</td><td>Lab 1</td></tr>
                    <tr><td>08:30-10:00</td><td>Bimbingan Karir</td><td>Bu Dewi</td><td>Aula</td></tr>
                </tbody>
            </table>
        </div>
    `,
    
    nilai: () => `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-star"></i> Nilai & Raport</h2>
        <div class="card-premium">
            <table class="table-premium">
                <thead>
                    <tr><th>Mata Pelajaran</th><th>Tugas</th><th>UTS</th><th>UAS</th><th>Rata-rata</th><th>Predikat</th></tr>
                </thead>
                <tbody>
                    <tr><td>Matematika</td><td>85</td><td>80</td><td>88</td><td>84.3</td><td><span class="badge-primary">B+</span></td></tr>
                    <tr><td>Pemrograman Dasar</td><td>90</td><td>88</td><td>92</td><td>90.0</td><td><span class="badge-success">A</span></td></tr>
                    <tr><td>Basis Data</td><td>78</td><td>80</td><td>85</td><td>81.0</td><td><span class="badge-primary">B</span></td></tr>
                    <tr><td>Bahasa Inggris</td><td>82</td><td>85</td><td>88</td><td>85.0</td><td><span class="badge-primary">B+</span></td></tr>
                    <tr><td>Produk Kreatif</td><td>88</td><td>86</td><td>90</td><td>88.0</td><td><span class="badge-success">A-</span></td></tr>
                    <tr><td>Pendidikan Agama</td><td>90</td><td>88</td><td>92</td><td>90.0</td><td><span class="badge-success">A</span></td></tr>
                    <tr><td>PKN</td><td>85</td><td>82</td><td>88</td><td>85.0</td><td><span class="badge-primary">B+</span></td></tr>
                </tbody>
            </table>
            
            <div style="margin-top: 24px; padding: 16px; background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-radius: var(--radius-md); color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div>
                        <strong>📊 Rata-rata Rapor:</strong> 86.2
                    </div>
                    <div>
                        <strong>🏆 Ranking Kelas:</strong> 5 / 32
                    </div>
                    <div>
                        <strong>✅ Kenaikan Kelas:</strong> Berhak
                    </div>
                </div>
                <div class="progress-bar" style="margin-top: 16px; background: rgba(255,255,255,0.3);">
                    <div class="progress-fill" style="width: 86%; background: white;"></div>
                </div>
            </div>
        </div>
    `,
    
    pelajaran: () => `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-book"></i> Daftar Mata Pelajaran</h2>
        <div class="card-premium">
            <table class="table-premium">
                <thead>
                    <tr><th>No</th><th>Kode</th><th>Mata Pelajaran</th><th>Kelompok</th><th>Jam/Minggu</th><th>Guru</th></tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>MTK-12</td><td>Matematika</td><td>Umum</td><td>4 JP</td><td>Bu Siti Rahayu</td></tr>
                    <tr><td>2</td><td>TKJ-01</td><td>Pemrograman Dasar</td><td>Kompetensi Keahlian</td><td>6 JP</td><td>Pak Budi Santoso</td></tr>
                    <tr><td>3</td><td>BD-02</td><td>Basis Data</td><td>Kompetensi Keahlian</td><td>4 JP</td><td>Bu Dewi Lestari</td></tr>
                    <tr><td>4</td><td>BIG-12</td><td>Bahasa Inggris</td><td>Umum</td><td>2 JP</td><td>Bu Rina Marlina</td></tr>
                    <tr><td>5</td><td>PKWU-01</td><td>Produk Kreatif</td><td>Kompetensi Keahlian</td><td>4 JP</td><td>Pak Eko Prasetyo</td></tr>
                    <tr><td>6</td><td>PAI-12</td><td>Pendidikan Agama</td><td>Umum</td><td>2 JP</td><td>Pak Ahmad Fauzi</td></tr>
                    <tr><td>7</td><td>PKN-12</td><td>PKN</td><td>Umum</td><td>2 JP</td><td>Bu Mega Wati</td></tr>
                    <tr><td>8</td><td>OR-12</td><td>Olahraga</td><td>Umum</td><td>2 JP</td><td>Pak Joko Susilo</td></tr>
                    <tr><td>9</td><td>BK-12</td><td>Bimbingan Konseling</td><td>Layanan</td><td>1 JP</td><td>Bu Indah Permata</td></tr>
                </tbody>
            </table>
            <p style="margin-top: 16px; font-size: 13px; color: #666;">📌 Total Jam Pelajaran per Minggu: 27 Jam Pelajaran</p>
        </div>
    `,
    
    tagihan: () => `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-receipt"></i> Informasi Tagihan</h2>
        <div class="card-premium">
            <table class="table-premium">
                <thead>
                    <tr><th>Jenis Tagihan</th><th>Periode</th><th>Nominal</th><th>Status</th><th>Jatuh Tempo</th></tr>
                </thead>
                <tbody>
                    <tr><td>SPP Bulanan</td><td>Januari 2024</td><td>Rp 150.000</td><td><span class="badge-success">Lunas</span></td><td>10/01/2024</td></tr>
                    <tr><td>SPP Bulanan</td><td>Februari 2024</td><td>Rp 150.000</td><td><span class="badge-success">Lunas</span></td><td>10/02/2024</td></tr>
                    <tr><td>SPP Bulanan</td><td>Maret 2024</td><td>Rp 150.000</td><td><span class="badge-success">Lunas</span></td><td>10/03/2024</td></tr>
                    <tr><td>SPP Bulanan</td><td>April 2024</td><td>Rp 150.000</td><td><span class="badge-warning">Belum Lunas</span></td><td>10/04/2024</td></tr>
                    <tr><td>Uang Komite</td><td>Semester Genap</td><td>Rp 100.000</td><td><span class="badge-warning">Belum Lunas</span></td><td>15/03/2024</td></tr>
                    <tr><td>Biaya Praktikum</td><td>Semester Genap</td><td>Rp 200.000</td><td><span class="badge-warning">Belum Lunas</span></td><td>20/03/2024</td></tr>
                    <tr><td>Seragam Olahraga</td><td>2024</td><td>Rp 250.000</td><td><span class="badge-success">Lunas</span></td><td>05/02/2024</td></tr>
                </tbody>
            </table>
            
            <div style="margin-top: 20px; padding: 16px; background: #fef3c7; border-radius: 10px;">
                <strong>💰 Total Tagihan Belum Dibayar:</strong> Rp 600.000<br>
                <small>(SPP April + Uang Komite + Biaya Praktikum)</small>
            </div>
            
            <button id="bayarBtn" class="btn-primary" style="margin-top: 16px;"><i class="fas fa-credit-card"></i> Bayar Sekarang</button>
            <div id="notifBayar" style="display:none; margin-top: 12px; padding: 12px; background: #d1fae5; border-radius: 8px;">
                ✅ Simulasi: Mengarahkan ke halaman pembayaran...
            </div>
        </div>
    `,
    
    profil: (data) => `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-user-graduate"></i> Profil Saya</h2>
        <div class="card-premium">
            <div style="display: flex; gap: 32px; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <img src="https://ui-avatars.com/api/?background=1e3c72&color=fff&name=${data.name.replace(' ', '+')}" style="width: 120px; height: 120px; border-radius: 50%;">
                    <h3 style="margin-top: 12px;">${data.name}</h3>
                    <p class="badge-primary" style="display: inline-block;">${data.class}</p>
                </div>
                <div style="flex: 1;">
                    <table class="table-premium">
                        <tr><td style="width: 150px;"><strong>NIS</strong></td><td>${data.nis}</td></tr>
                        <tr><td><strong>Kelas</strong></td><td>${data.class}</td></tr>
                        <tr><td><strong>Wali Kelas</strong></td><td>${data.waliKelas}</td></tr>
                        <tr><td><strong>No. Telepon</strong></td><td>${data.phone}</td></tr>
                        <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
                        <tr><td><strong>Alamat</strong></td><td>${data.address}</td></tr>
                    </table>
                </div>
            </div>
        </div>
    `
};

let currentTab = 'home';

function render(tab, userData) {
    const container = document.getElementById('dynamicContent');
    if (components[tab]) {
        container.innerHTML = components[tab](userData);
        attachEvents(tab);
        currentTab = tab;
    }
}

function attachEvents(tab) {
    if (tab === 'home') {
        const btnJadwal = document.getElementById('lihatJadwalBtn');
        if (btnJadwal) {
            btnJadwal.onclick = () => {
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                document.querySelector('.nav-item[data-tab="jadwal"]').classList.add('active');
                render('jadwal', getCurrentUserData());
            };
        }
        const p1 = document.getElementById('peng1');
        const p2 = document.getElementById('peng2');
        const p3 = document.getElementById('peng3');
        if (p1) p1.onclick = (e) => { e.preventDefault(); alert('📢 Info: Pendaftaran ujian sekolah dibuka 1-30 April 2024'); };
        if (p2) p2.onclick = (e) => { e.preventDefault(); alert('🎓 Sertifikat kompetensi dapat diambil di ruang akademik'); };
        if (p3) p3.onclick = (e) => { e.preventDefault(); alert('🌙 Libur sekolah 11-15 Maret 2024'); };
    }
    if (tab === 'tagihan') {
        const bayar = document.getElementById('bayarBtn');
        if (bayar) {
            bayar.onclick = () => {
                const notif = document.getElementById('notifBayar');
                notif.style.display = 'block';
                setTimeout(() => notif.style.display = 'none', 3000);
            };
        }
    }
}

function getCurrentUserData() {
    const currentUser = localStorage.getItem('hifi_user');
    return studentData[currentUser] || studentData['151208'];
}

function updateUI() {
    const userData = getCurrentUserData();
    document.getElementById('userNameHeader').textContent = userData.name;
    document.getElementById('userClassHeader').textContent = userData.class;
    document.getElementById('sidebarUser').innerHTML = `<i class="fas fa-user-circle"></i><span>${userData.name}</span>`;
}

// === LOGIN ===
if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', () => {
        const nis = document.getElementById('nis').value.trim();
        const password = document.getElementById('password').value;
        
        if (VALID_CREDENTIALS[nis] && VALID_CREDENTIALS[nis] === password) {
            localStorage.setItem('hifi_user', nis);
            window.location.href = 'dashboard.html';
        } else {
            alert('❌ Login Gagal!\n\nGunakan:\nNIS: 151208\nPassword: password123');
        }
    });
}

// === DASHBOARD ===
if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = localStorage.getItem('hifi_user');
    if (!currentUser) {
        window.location.href = 'index.html';
    }
    
    updateUI();
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            render(this.getAttribute('data-tab'), getCurrentUserData());
        });
    });
    
    render('home', getCurrentUserData());
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('hifi_user');
        window.location.href = 'index.html';
    });
}

// Password toggle
if (document.querySelector('.toggle-password')) {
    document.querySelector('.toggle-password').addEventListener('click', function() {
        const input = document.querySelector('#password');
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        }
    });
}