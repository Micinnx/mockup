// ============================================================
// SMKS-TI PGRI 11 SERPONG - Frontend Script (API Integrated)
// ============================================================

const BASE_URL = 'https://smksti-pgri-11-serpong-production.up.railway.app';

// ── Auth Helpers ─────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

function isLoggedIn() {
  return !!getToken() && !!getUser();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ── API Fetch Helper ──────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...(options.headers || {})
      }
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, message: 'Koneksi gagal' };
  }
}

// ── Content Components ────────────────────────────────────────
const components = {

  home: async (user) => {
    const res = await apiFetch('/api/dashboard');
    const d = res.success ? res.data : {};
    const jadwalHtml = d.todaySchedule && d.todaySchedule.length > 0
      ? d.todaySchedule.map(j => `
          <tr>
            <td>${j.start_time || '-'} - ${j.end_time || '-'}</td>
            <td>${j.subject_name || j.Subject?.name || '-'}</td>
            <td>${j.teacher_name || '-'}</td>
            <td>${j.room || '-'}</td>
          </tr>`).join('')
      : '<tr><td colspan="4" style="text-align:center;color:#888;">Tidak ada jadwal hari ini</td></tr>';

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
          <div class="stat-info">
            <h4>Jadwal Hari Ini</h4>
            <div class="stat-value">${d.todaySchedule?.length ?? '-'}</div>
            <div class="stat-label">Mata Pelajaran</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
          <div class="stat-info">
            <h4>Rata-rata Nilai</h4>
            <div class="stat-value">${d.averageGrade ?? '-'}</div>
            <div class="stat-label">Nilai Akademik</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-user-check"></i></div>
          <div class="stat-info">
            <h4>Kehadiran</h4>
            <div class="stat-value">${d.attendancePercentage != null ? d.attendancePercentage + '%' : '-'}</div>
            <div class="stat-label">Persentase Hadir</div>
          </div>
        </div>
      </div>

      <div class="card-premium">
        <h3 style="margin-bottom:16px;"><i class="fas fa-chalkboard-user"></i> Jadwal Hari Ini - ${today}</h3>
        <table class="table-premium">
          <thead><tr><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr></thead>
          <tbody>${jadwalHtml}</tbody>
        </table>
        <button class="btn-primary" id="lihatJadwalBtn" style="margin-top:16px;">
          <i class="fas fa-calendar-week"></i> Lihat Jadwal Lengkap
        </button>
      </div>

      <div class="card-premium">
        <h3 style="margin-bottom:16px;"><i class="fas fa-bullhorn"></i> Pengumuman Terkini</h3>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div style="padding:12px;background:#e8f4f8;border-radius:10px;">
            <strong>📋 Pendaftaran Ujian Sekolah</strong>
            <p style="font-size:13px;margin-top:4px;">Pendaftaran ujian sekolah dibuka hingga 30 April 2024.</p>
          </div>
          <div style="padding:12px;background:#fef3c7;border-radius:10px;">
            <strong>🎓 Pengambilan Sertifikat Kompetensi</strong>
            <p style="font-size:13px;margin-top:4px;">Sertifikat dapat diambil mulai 1-20 April 2024.</p>
          </div>
        </div>
      </div>`;
  },

  jadwal: async (user) => {
    const res = await apiFetch('/api/schedules');
    const schedules = res.success ? res.data : [];

    const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    let rows = '';

    if (schedules.length === 0) {
      rows = '<tr><td colspan="5" style="text-align:center;color:#888;">Belum ada jadwal</td></tr>';
    } else {
      const grouped = {};
      schedules.forEach(s => {
        const day = s.day || 'Lainnya';
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(s);
      });

      days.forEach(day => {
        if (grouped[day]) {
          grouped[day].forEach((s, i) => {
            rows += `<tr>
              ${i === 0 ? `<td rowspan="${grouped[day].length}"><strong>${day}</strong></td>` : ''}
              <td>${s.start_time || '-'}-${s.end_time || '-'}</td>
              <td>${s.subject_name || s.Subject?.name || '-'}</td>
              <td>${s.teacher_name || '-'}</td>
              <td>${s.room || '-'}</td>
            </tr>`;
          });
        }
      });
    }

    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-calendar-alt"></i> Jadwal Pelajaran</h2>
      <div class="card-premium">
        <table class="table-premium">
          <thead><tr><th>Hari</th><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  nilai: async (user) => {
    const res = await apiFetch(`/api/exam-results/student/${user.id}`);
    const results = res.success ? res.data : [];

    let rows = '';
    let total = 0;

    if (results.length === 0) {
      rows = '<tr><td colspan="6" style="text-align:center;color:#888;">Belum ada nilai</td></tr>';
    } else {
      results.forEach(r => {
        const avg = r.rata_rata
        if (typeof avg === 'number') total += avg;
        const grade = r.predikat;
        const badgeClass = grade === 'A' ? 'badge-success' : grade.startsWith('B') ? 'badge-primary' : 'badge-warning';
        rows += `<tr>
          <td>${r.mata_pelajaran || '-'}</td>
          <td>${r.tugas ?? '-'}</td>
          <td>${r.uts ?? '-'}</td>
          <td>${r.uas ?? '-'}</td>
          <td>${avg}</td>
          <td><span class="${badgeClass}">${grade}</span></td>
        </tr>`;
      });
    }

    const rataRata = results.length > 0 ? (total / results.length).toFixed(1) : '-';

    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-star"></i> Nilai & Raport</h2>
      <div class="card-premium">
        <table class="table-premium">
          <thead><tr><th>Mata Pelajaran</th><th>Tugas</th><th>UTS</th><th>UAS</th><th>Rata-rata</th><th>Predikat</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:24px;padding:16px;background:linear-gradient(135deg,var(--primary),var(--primary-light));border-radius:var(--radius-md);color:white;display:flex;justify-content:space-between;flex-wrap:wrap;">
          <div><strong>📊 Rata-rata Rapor:</strong> ${rataRata}</div>
          <div><strong>✅ Kenaikan Kelas:</strong> ${rataRata >= 70 ? 'Berhak' : 'Perlu Evaluasi'}</div>
        </div>
      </div>`;
  },

  pelajaran: async (user) => {
    const res = await apiFetch('/api/subjects');
    const subjects = res.success ? res.data : [];

    let rows = '';
    let totalJam = 0;

    if (subjects.length === 0) {
      rows = '<tr><td colspan="6" style="text-align:center;color:#888;">Belum ada mata pelajaran</td></tr>';
    } else {
      subjects.forEach((s, i) => {
        totalJam += s.hours_per_week || 0;
        rows += `<tr>
          <td>${i + 1}</td>
          <td>${s.code || '-'}</td>
          <td>${s.name}</td>
          <td>${s.group || '-'}</td>
          <td>${s.hours_per_week || '-'} JP</td>
          <td>${s.teacher_name || '-'}</td>
        </tr>`;
      });
    }

    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-book"></i> Daftar Mata Pelajaran</h2>
      <div class="card-premium">
        <table class="table-premium">
          <thead><tr><th>No</th><th>Kode</th><th>Mata Pelajaran</th><th>Kelompok</th><th>Jam/Minggu</th><th>Guru</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:16px;font-size:13px;color:#666;">📌 Total Jam Pelajaran per Minggu: ${totalJam} Jam Pelajaran</p>
      </div>`;
  },

  tagihan: async (user) => {
    const res = await apiFetch(`/api/invoices/student/${user.id}`);
    const invoices = res.success ? res.data : [];

    let rows = '';
    let totalBelum = 0;
    let belumList = [];

    if (invoices.length === 0) {
      rows = '<tr><td colspan="5" style="text-align:center;color:#888;">Belum ada tagihan</td></tr>';
    } else {
      invoices.forEach(inv => {
        const lunas = inv.status === 'paid' || inv.status === 'lunas';
        const badgeClass = lunas ? 'badge-success' : 'badge-warning';
        const statusText = lunas ? 'Lunas' : 'Belum Lunas';
        const nominal = parseInt(inv.amount || inv.nominal || 0);
        if (!lunas) {
          totalBelum += nominal;
          belumList.push(inv.type || inv.jenis || 'Tagihan');
        }
        const nominalFmt = 'Rp ' + nominal.toLocaleString('id-ID');
        const dueDate = inv.due_date ? new Date(inv.due_date).toLocaleDateString('id-ID') : '-';
        rows += `<tr>
          <td>${inv.type || inv.jenis || '-'}</td>
          <td>${inv.period || inv.periode || '-'}</td>
          <td>${nominalFmt}</td>
          <td><span class="${badgeClass}">${statusText}</span></td>
          <td>${dueDate}</td>
        </tr>`;
      });
    }

    const totalFmt = 'Rp ' + totalBelum.toLocaleString('id-ID');

    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-receipt"></i> Informasi Tagihan</h2>
      <div class="card-premium">
        <table class="table-premium">
          <thead><tr><th>Jenis Tagihan</th><th>Periode</th><th>Nominal</th><th>Status</th><th>Jatuh Tempo</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${totalBelum > 0 ? `
        <div style="margin-top:20px;padding:16px;background:#fef3c7;border-radius:10px;">
          <strong>💰 Total Tagihan Belum Dibayar:</strong> ${totalFmt}<br>
          <small>(${belumList.join(' + ')})</small>
        </div>
        <button class="btn-primary" id="bayarBtn" style="margin-top:16px;">
          <i class="fas fa-credit-card"></i> Bayar Sekarang
        </button>
        <div id="notifBayar" style="display:none;margin-top:12px;padding:12px;background:#d1fae5;border-radius:8px;">
          ✅ Simulasi: Mengarahkan ke halaman pembayaran...
        </div>` : `
        <div style="margin-top:20px;padding:16px;background:#d1fae5;border-radius:10px;">
          <strong>✅ Semua tagihan sudah lunas!</strong>
        </div>`}
      </div>`;
  },

  profil: async (user) => {
    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-user-graduate"></i> Profil Saya</h2>
      <div class="card-premium">
        <div style="display:flex;gap:32px;flex-wrap:wrap;">
          <div style="text-align:center;">
            <img src="https://ui-avatars.com/api/?background=1e3c72&color=fff&name=${encodeURIComponent(user.name)}" 
                 style="width:120px;height:120px;border-radius:50%;margin-bottom:12px;">
            <h3 style="margin-top:12px;">${user.name}</h3>
            <p class="badge-primary" style="display:inline-block;">${user.class_name || '-'}</p>
          </div>
          <div style="flex:1;">
            <table class="table-premium">
              <tr><td style="width:150px;"><strong>NIS</strong></td><td>${user.nis}</td></tr>
              <tr><td><strong>Kelas</strong></td><td>${user.class_name || '-'}</td></tr>
              <tr><td><strong>Wali Kelas</strong></td><td>${user.wali_kelas || '-'}</td></tr>
              <tr><td><strong>No. Telepon</strong></td><td>${user.phone || '-'}</td></tr>
              <tr><td><strong>Email</strong></td><td>${user.email || '-'}</td></tr>
              <tr><td><strong>Alamat</strong></td><td>${user.address || '-'}</td></tr>
            </table>
          </div>
        </div>
      </div>`;
  }
};

// ── Render Engine ─────────────────────────────────────────────
let currentTab = 'home';

async function render(tab, user) {
  const container = document.getElementById('dynamicContent');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Memuat data...</div>';
  try {
    container.innerHTML = await components[tab](user);
    attachEvents(tab);
  } catch (err) {
    container.innerHTML = '<div style="padding:20px;color:red;">Gagal memuat data. Coba refresh halaman.</div>';
    console.error(err);
  }
  currentTab = tab;
}

function attachEvents(tab) {
  if (tab === 'home') {
    const btn = document.getElementById('lihatJadwalBtn');
    if (btn) btn.onclick = () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector('.nav-item[data-tab="jadwal"]')?.classList.add('active');
      render('jadwal', getUser());
    };
  }
  if (tab === 'tagihan') {
    const bayar = document.getElementById('bayarBtn');
    if (bayar) bayar.onclick = () => {
      const notif = document.getElementById('notifBayar');
      if (notif) { notif.style.display = 'block'; setTimeout(() => notif.style.display = 'none', 3000); }
    };
  }
}

// ── UI Update ─────────────────────────────────────────────────
function updateUI() {
  const user = getUser();
  if (!user) return;
  const el = id => document.getElementById(id);
  if (el('userNameHeader'))  el('userNameHeader').textContent  = user.name;
  if (el('userClassHeader')) el('userClassHeader').textContent = user.class_name || user.role;
  if (el('sidebarUser'))     el('sidebarUser').innerHTML = `<i class="fas fa-user-circle"></i><span>${user.name}</span>`;
}

// ── LOGIN PAGE ────────────────────────────────────────────────
if (document.getElementById('loginBtn')) {
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const nis      = document.getElementById('nis').value.trim();
    const password = document.getElementById('password').value;

    if (!nis || !password) { alert('NIS dan password wajib diisi'); return; }

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Masuk...';

    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ nis, password })
    });

    if (res.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert('❌ ' + (res.message || 'NIS atau password salah'));
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
    }
  });
}

// ── DASHBOARD PAGE ────────────────────────────────────────────
if (window.location.pathname.includes('dashboard.html')) {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  } else {
    updateUI();
    render('home', getUser());

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        render(this.getAttribute('data-tab'), getUser());
      });
    });

    document.getElementById('logoutBtn')?.addEventListener('click', logout);
  }
}

// ── Password Toggle ───────────────────────────────────────────
if (document.querySelector('.toggle-password')) {
  document.querySelector('.toggle-password').addEventListener('click', function () {
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
