const BASE_URL = 'https://smksti-pgri-11-serpong-production.up.railway.app';

function getToken() { return localStorage.getItem('token'); }
function getUser() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }
function isLoggedIn() { return !!getToken() && !!getUser(); }
function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = 'index.html'; }

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}`, ...(options.headers || {}) }
    });
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, message: 'Koneksi gagal' };
  }
}

const components = {
  home: async (user) => {
    const res = await apiFetch('/api/dashboard');
    const d = res.success ? res.data : {};
    const jadwalHtml = d.jadwal_hari_ini?.length
      ? d.jadwal_hari_ini.map(j => `<tr><td>${j.jam||'-'}</td><td>${j.mata_pelajaran||'-'}</td><td>${j.guru||'-'}</td><td>${j.ruang||'-'}</td></tr>`).join('')
      : '<tr><td colspan="4" style="text-align:center;color:#888;">Tidak ada jadwal hari ini</td></tr>';
    const today = new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    return `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h4>Jadwal Hari Ini</h4><div class="stat-value">${d.stats?.jadwal_hari_ini??'-'}</div><div class="stat-label">Mata Pelajaran</div></div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-chart-line"></i></div><div class="stat-info"><h4>Rata-rata Nilai</h4><div class="stat-value">${d.stats?.rata_rata_nilai??'-'}</div><div class="stat-label">Nilai Akademik</div></div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-user-check"></i></div><div class="stat-info"><h4>Kehadiran</h4><div class="stat-value">${d.stats?.kehadiran_persen!=null?d.stats.kehadiran_persen+'%':'-'}</div><div class="stat-label">Persentase Hadir</div></div></div>
      </div>
      <div class="card-premium">
        <h3 style="margin-bottom:16px;"><i class="fas fa-chalkboard-user"></i> Jadwal Hari Ini - ${today}</h3>
        <table class="table-premium"><thead><tr><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr></thead><tbody>${jadwalHtml}</tbody></table>
        <button class="btn-primary" id="lihatJadwalBtn" style="margin-top:16px;"><i class="fas fa-calendar-week"></i> Lihat Jadwal Lengkap</button>
      </div>`;
  },

  jadwal: async (user) => {
    const res = await apiFetch('/api/schedules');
    const allSchedules = res.success ? res.data : [];
    const schedules = allSchedules.filter(s => s.Class?.name === user.class_name);
    const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    let rows = '';
    if (!schedules.length) {
      rows = '<tr><td colspan="5" style="text-align:center;color:#888;">Belum ada jadwal</td></tr>';
    } else {
      const grouped = {};
      schedules.forEach(s => { const day = s.day||'Lainnya'; if (!grouped[day]) grouped[day]=[]; grouped[day].push(s); });
      days.forEach(day => {
        if (grouped[day]) grouped[day].forEach((s,i) => {
          rows += `<tr>${i===0?`<td rowspan="${grouped[day].length}"><strong>${day}</strong></td>`:''}<td>${s.start_time||'-'}-${s.end_time||'-'}</td><td>${s.Subject?.name||'-'}</td><td>${s.teacher?.name||'-'}</td><td>${s.room||'-'}</td></tr>`;
        });
      });
    }
    return `<h2 style="margin-bottom:20px;"><i class="fas fa-calendar-alt"></i> Jadwal Pelajaran</h2>
      <div class="card-premium"><table class="table-premium"><thead><tr><th>Hari</th><th>Jam</th><th>Mata Pelajaran</th><th>Guru</th><th>Ruang</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  },

  nilai: async (user) => {
    const res = await apiFetch(`/api/exam-results/student/${user.id}`);
    const results = res.success ? res.data : [];
    let rows = '', total = 0;
    if (!results.length) {
      rows = '<tr><td colspan="7" style="text-align:center;color:#888;">Belum ada nilai</td></tr>';
    } else {
      results.forEach(r => {
        const avg = r.rata_rata;
        if (typeof avg === 'number') total += avg;
        const grade = r.predikat || '-';
        const badgeClass = grade==='A'?'badge-success':grade.startsWith('B')?'badge-primary':'badge-warning';
        const sourceLabel = r.source === 'assessment'
          ? '<span style="font-size:9px;background:#d1fae5;color:#065f46;padding:2px 6px;border-radius:10px;margin-left:4px">Guru</span>'
          : '<span style="font-size:9px;background:#f1f5f9;color:#64748b;padding:2px 6px;border-radius:10px;margin-left:4px">Seed</span>';
        rows += `<tr>
          <td>${r.mata_pelajaran||'-'}${sourceLabel}</td>
          <td style="text-align:center">${r.tugas??'-'}</td>
          <td style="text-align:center">${r.uts??'-'}</td>
          <td style="text-align:center">${r.uas??'-'}</td>
          <td style="text-align:center"><strong>${avg??'-'}</strong></td>
          <td style="text-align:center"><span class="${badgeClass}">${grade}</span></td>
        </tr>`;
      });
    }
    const rataRata = results.length > 0 ? (total/results.length).toFixed(1) : '-';
    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-star"></i> Nilai & Raport</h2>
      <div class="card-premium">
        <p style="font-size:12px;color:#64748b;margin-bottom:12px;"><i class="fas fa-info-circle"></i> Nilai berlabel <strong>Guru</strong> adalah nilai yang diinput langsung oleh guru.</p>
        <table class="table-premium">
          <thead><tr><th>Mata Pelajaran</th><th>Tugas (30%)</th><th>UTS (30%)</th><th>UAS (40%)</th><th>Final</th><th>Predikat</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:24px;padding:16px;background:linear-gradient(135deg,var(--primary),var(--primary-light));border-radius:var(--radius-md);color:white;display:flex;justify-content:space-between;flex-wrap:wrap;">
          <div><strong>📊 Rata-rata Rapor:</strong> ${rataRata}</div>
          <div><strong>✅ Kenaikan Kelas:</strong> ${rataRata >= 70 ? 'Berhak' : 'Perlu Evaluasi'}</div>
        </div>
      </div>`;
  },

  materi: async (user) => {
    const res = await apiFetch(`/api/materials?class_name=${encodeURIComponent(user.class_name)}`);
    const list = res.success ? res.data : [];
    let rows = '';
    if (!list.length) {
      rows = '<tr><td colspan="4" style="text-align:center;color:#888;">Belum ada materi</td></tr>';
    } else {
      list.forEach(m => {
        rows += `<tr>
          <td><strong>${m.title}</strong>${m.description?`<br><small style="color:#64748b">${m.description}</small>`:''}</td>
          <td>${m.Subject?.name||'-'}</td>
          <td>${m.teacher?.name||'-'}</td>
          <td>${m.file_url?`<a href="${m.file_url}" target="_blank" style="color:#1d4ed8;text-decoration:none"><i class="fas fa-external-link-alt"></i> Buka</a>`:'-'}</td>
        </tr>`;
      });
    }
    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-book-open"></i> Materi Pelajaran</h2>
      <div class="card-premium">
        <table class="table-premium">
          <thead><tr><th>Judul Materi</th><th>Mata Pelajaran</th><th>Guru</th><th>File</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  tugas: async (user) => {
    const res = await apiFetch(`/api/assignments?class_name=${encodeURIComponent(user.class_name)}`);
    const list = res.success ? res.data : [];
    const subRes = await apiFetch(`/api/submissions/my`);
    const mySubmissions = subRes.success ? subRes.data : [];
    const submittedMap = {};
    mySubmissions.forEach(s => { submittedMap[s.assignment_id] = s; });

    let rows = '';
    if (!list.length) {
      rows = '<tr><td colspan="5" style="text-align:center;color:#888;">Belum ada tugas</td></tr>';
    } else {
      list.forEach(t => {
        const submitted = submittedMap[t.id];
        const statusBadge = submitted
          ? `<span style="background:#d1fae5;color:#065f46;padding:3px 8px;border-radius:10px;font-size:11px">✅ Dikumpulkan</span>`
          : `<span style="background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:10px;font-size:11px">⏳ Belum</span>`;
        const deadline = t.deadline ? new Date(t.deadline).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : 'Tidak ada';
        rows += `<tr>
          <td><strong>${t.title}</strong>${t.description?`<br><small style="color:#64748b">${t.description.substring(0,80)}</small>`:''}</td>
          <td>${t.Subject?.name||'-'}</td>
          <td>${deadline}</td>
          <td>${statusBadge}${submitted?.score!=null?`<br><small>Nilai: <strong>${submitted.score}</strong></small>`:''}</td>
          <td>${!submitted
            ? `<button onclick="submitTugas(${t.id})" style="background:#1e3c72;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer"><i class="fas fa-upload"></i> Kumpulkan</button>`
            : `<button onclick="submitTugas(${t.id})" style="background:#64748b;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer"><i class="fas fa-edit"></i> Perbarui</button>`
          }</td>
        </tr>`;
      });
    }
    return `
      <h2 style="margin-bottom:20px;"><i class="fas fa-clipboard-list"></i> Tugas</h2>
      <div class="card-premium">
        <table class="table-premium">
          <thead><tr><th>Judul Tugas</th><th>Mata Pelajaran</th><th>Deadline</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div id="modal-submit" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:none;align-items:center;justify-content:center;">
        <div style="background:#fff;border-radius:12px;padding:24px;width:90%;max-width:480px;">
          <h3 style="margin-bottom:16px">Kumpulkan Tugas</h3>
          <input type="hidden" id="submit-assignment-id">
          <div style="margin-bottom:12px">
            <label style="font-size:11px;font-weight:500;color:#64748b;display:block;margin-bottom:4px">LINK FILE / URL (Google Drive, dll)</label>
            <input type="text" id="submit-file-url" placeholder="https://drive.google.com/..." style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px">
          </div>
          <div style="margin-bottom:16px">
            <label style="font-size:11px;font-weight:500;color:#64748b;display:block;margin-bottom:4px">CATATAN (opsional)</label>
            <textarea id="submit-notes" rows="3" placeholder="Catatan untuk guru..." style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;resize:vertical"></textarea>
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button onclick="tutupModal()" style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer;font-size:12px">Batal</button>
            <button onclick="kirimTugas()" style="padding:8px 16px;background:#1e3c72;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px"><i class="fas fa-paper-plane"></i> Kirim</button>
          </div>
        </div>
      </div>`;
  },

  pelajaran: async (user) => {
    const res = await apiFetch('/api/subjects');
    const subjects = res.success ? res.data : [];
    let rows = '', totalJam = 0;
    if (!subjects.length) {
      rows = '<tr><td colspan="6" style="text-align:center;color:#888;">Belum ada mata pelajaran</td></tr>';
    } else {
      subjects.forEach((s,i) => {
        totalJam += s.hours_per_week||0;
        rows += `<tr><td>${i+1}</td><td>${s.code||'-'}</td><td>${s.name}</td><td>${s.group||'-'}</td><td>${s.hours_per_week||'-'} JP</td><td>${s.teacher_name||'-'}</td></tr>`;
      });
    }
    return `<h2 style="margin-bottom:20px;"><i class="fas fa-book"></i> Daftar Mata Pelajaran</h2>
      <div class="card-premium"><table class="table-premium"><thead><tr><th>No</th><th>Kode</th><th>Mata Pelajaran</th><th>Kelompok</th><th>Jam/Minggu</th><th>Guru</th></tr></thead><tbody>${rows}</tbody></table>
      <p style="margin-top:16px;font-size:13px;color:#666;">📌 Total Jam Pelajaran per Minggu: ${totalJam} JP</p></div>`;
  },

  tagihan: async (user) => {
    const res = await apiFetch(`/api/invoices/student/${user.id}`);
    const invoices = res.success ? res.data : [];
    let rows = '', totalBelum = 0, belumList = [];
    if (!invoices.length) {
      rows = '<tr><td colspan="5" style="text-align:center;color:#888;">Belum ada tagihan</td></tr>';
    } else {
      invoices.forEach(inv => {
        const lunas = inv.status==='paid'||inv.status==='lunas';
        const nominal = parseInt(inv.amount||inv.nominal||0);
        if (!lunas) { totalBelum+=nominal; belumList.push(inv.type||inv.jenis||'Tagihan'); }
        rows += `<tr><td>${inv.type||inv.jenis||'-'}</td><td>${inv.period||inv.periode||'-'}</td><td>Rp ${nominal.toLocaleString('id-ID')}</td><td><span class="${lunas?'badge-success':'badge-warning'}">${lunas?'Lunas':'Belum Lunas'}</span></td><td>${inv.due_date?new Date(inv.due_date).toLocaleDateString('id-ID'):'-'}</td></tr>`;
      });
    }
    return `<h2 style="margin-bottom:20px;"><i class="fas fa-receipt"></i> Informasi Tagihan</h2>
      <div class="card-premium"><table class="table-premium"><thead><tr><th>Jenis Tagihan</th><th>Periode</th><th>Nominal</th><th>Status</th><th>Jatuh Tempo</th></tr></thead><tbody>${rows}</tbody></table>
      ${totalBelum>0?`<div style="margin-top:20px;padding:16px;background:#fef3c7;border-radius:10px;"><strong>💰 Total Belum Dibayar:</strong> Rp ${totalBelum.toLocaleString('id-ID')}</div>`:`<div style="margin-top:20px;padding:16px;background:#d1fae5;border-radius:10px;"><strong>✅ Semua tagihan sudah lunas!</strong></div>`}</div>`;
  },

  profil: async (user) => {
    return `<h2 style="margin-bottom:20px;"><i class="fas fa-user-graduate"></i> Profil Saya</h2>
      <div class="card-premium"><div style="display:flex;gap:32px;flex-wrap:wrap;">
        <div style="text-align:center;"><img src="https://ui-avatars.com/api/?background=1e3c72&color=fff&name=${encodeURIComponent(user.name)}" style="width:120px;height:120px;border-radius:50%;"><h3 style="margin-top:12px;">${user.name}</h3><p class="badge-primary" style="display:inline-block;">${user.class_name||'-'}</p></div>
        <div style="flex:1;"><table class="table-premium"><tr><td><strong>NIS</strong></td><td>${user.nis}</td></tr><tr><td><strong>Kelas</strong></td><td>${user.class_name||'-'}</td></tr><tr><td><strong>Wali Kelas</strong></td><td>${user.wali_kelas||'-'}</td></tr><tr><td><strong>No. Telepon</strong></td><td>${user.phone||'-'}</td></tr><tr><td><strong>Email</strong></td><td>${user.email||'-'}</td></tr><tr><td><strong>Alamat</strong></td><td>${user.address||'-'}</td></tr></table></div>
      </div></div>`;
  }
};

// ── Submit Tugas Functions ─────────────────────────────────────
function submitTugas(assignmentId) {
  document.getElementById('submit-assignment-id').value = assignmentId;
  document.getElementById('submit-file-url').value = '';
  document.getElementById('submit-notes').value = '';
  document.getElementById('modal-submit').style.display = 'flex';
}

function tutupModal() {
  document.getElementById('modal-submit').style.display = 'none';
}

async function kirimTugas() {
  const assignmentId = document.getElementById('submit-assignment-id').value;
  const fileUrl = document.getElementById('submit-file-url').value.trim();
  const notes = document.getElementById('submit-notes').value.trim();
  if (!fileUrl && !notes) { alert('Isi link file atau catatan terlebih dahulu'); return; }
  try {
    const res = await apiFetch('/api/submissions', {
      method: 'POST',
      body: JSON.stringify({ assignment_id: parseInt(assignmentId), file_url: fileUrl||null, notes: notes||null })
    });
    if (res.success) {
      alert('Tugas berhasil dikumpulkan!');
      tutupModal();
      render('tugas', getUser());
    } else {
      alert('Gagal: ' + res.message);
    }
  } catch(e) { alert('Error: ' + e.message); }
}

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
    container.innerHTML = '<div style="padding:20px;color:red;">Gagal memuat data.</div>';
    console.error(err);
  }
  currentTab = tab;
}

function attachEvents(tab) {
  if (tab === 'home') {
    document.getElementById('lihatJadwalBtn')?.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector('.nav-item[data-tab="jadwal"]')?.classList.add('active');
      render('jadwal', getUser());
    });
  }
}

function updateUI() {
  const user = getUser();
  if (!user) return;
  const el = id => document.getElementById(id);
  if (el('userNameHeader'))  el('userNameHeader').textContent  = user.name;
  if (el('userClassHeader')) el('userClassHeader').textContent = user.class_name||user.role;
  if (el('sidebarUser'))     el('sidebarUser').innerHTML = `<i class="fas fa-user-circle"></i><span>${user.name}</span>`;
  const profileHeader = el('userProfileHeader');
  if (profileHeader) {
    profileHeader.style.cursor = 'pointer';
    profileHeader.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector('.nav-item[data-tab="profil"]')?.classList.add('active');
      render('profil', getUser());
    });
  }
}

// ── LOGIN ─────────────────────────────────────────────────────
if (document.getElementById('loginBtn')) {
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const nis = document.getElementById('nis').value.trim();
    const password = document.getElementById('password').value;
    if (!nis || !password) { alert('NIS dan password wajib diisi'); return; }
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Masuk...';
    const res = await apiFetch('/api/auth/login', { method:'POST', body:JSON.stringify({nis,password}) });
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role==='admin') window.location.href='admin-dashboard.html';
      else if (role==='teacher') window.location.href='guru-dashboard.html';
      else window.location.href='dashboard.html';
    } else {
      alert('❌ '+(res.message||'NIS atau password salah'));
      btn.disabled=false;
      btn.innerHTML='<i class="fas fa-sign-in-alt"></i> Masuk';
    }
  });
}

async function loadNotifications() {
  const res = await apiFetch('/api/notifications');
  if (!res.success) return;
  const { total, notifications } = res.data;
  const badge = document.getElementById('notifBadge');
  const count = document.getElementById('notifCount');
  if (badge) badge.textContent = total>9?'9+':total;
  if (count) count.textContent = `${total} notifikasi`;
  const list = document.getElementById('notifList');
  if (!list) return;
  if (!notifications.length) {
    list.innerHTML = '<div class="notif-empty"><i class="fas fa-check-circle"></i> Tidak ada notifikasi baru</div>';
    return;
  }
  list.innerHTML = notifications.map(n => `
    <div class="notif-item" data-tab="${n.tab}">
      <div class="notif-item-icon" style="background:${n.color}"><i class="fas ${n.icon}"></i></div>
      <div class="notif-item-content"><div class="notif-item-title">${n.title}</div><div class="notif-item-msg">${n.message}</div></div>
    </div>`).join('');
  list.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
      render(tab, getUser());
      document.getElementById('notifDropdown')?.classList.remove('show');
    });
  });
}

function initNotifToggle() {
  const bell = document.getElementById('notifBell');
  const dropdown = document.getElementById('notifDropdown');
  if (!bell||!dropdown) return;
  bell.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('show'); });
  document.addEventListener('click', (e) => { if (!bell.contains(e.target)) dropdown.classList.remove('show'); });
}

function initSearch() {
  const input = document.getElementById('searchInput');
  const dropdown = document.getElementById('searchDropdown');
  if (!input||!dropdown) return;
  let timeout = null;
  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(timeout);
    if (q.length < 2) { dropdown.classList.remove('show'); return; }
    dropdown.classList.add('show');
    dropdown.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Mencari...</div>';
    timeout = setTimeout(async () => {
      const res = await apiFetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.success||!res.data.length) { dropdown.innerHTML=`<div class="search-empty">Tidak ada hasil</div>`; return; }
      const grouped = {};
      res.data.forEach(item => { if (!grouped[item.type]) grouped[item.type]=[]; grouped[item.type].push(item); });
      const typeLabel = { pelajaran:'Mata Pelajaran', jadwal:'Jadwal', tagihan:'Tagihan', nilai:'Nilai', pengumuman:'Pengumuman' };
      let html = '';
      Object.keys(grouped).forEach(type => {
        html += `<div class="search-category">${typeLabel[type]||type}</div>`;
        grouped[type].forEach(item => { html += `<div class="search-item" data-tab="${item.tab}"><div class="search-item-icon" style="background:${item.color}"><i class="fas ${item.icon}"></i></div><div class="search-item-content"><div class="search-item-title">${item.title}</div><div class="search-item-subtitle">${item.subtitle}</div></div></div>`; });
      });
      dropdown.innerHTML = html;
      dropdown.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
          const tab = item.getAttribute('data-tab');
          document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
          document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
          render(tab, getUser());
          dropdown.classList.remove('show');
          input.value='';
        });
      });
    }, 400);
  });
  document.addEventListener('click', (e) => { if (!input.closest('.header-search').contains(e.target)) dropdown.classList.remove('show'); });
  input.addEventListener('keydown', (e) => { if (e.key==='Escape') { dropdown.classList.remove('show'); input.value=''; } });
}

if (window.location.pathname.includes('dashboard.html')) {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  } else {
    updateUI();
    render('home', getUser());
    loadNotifications();
    initNotifToggle();
    initSearch();
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        render(this.getAttribute('data-tab'), getUser());
      });
    });
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
  }
}

if (document.querySelector('.toggle-password')) {
  document.querySelector('.toggle-password').addEventListener('click', function() {
    const input = document.querySelector('#password');
    if (input.type==='password') { input.type='text'; this.classList.remove('fa-eye-slash'); this.classList.add('fa-eye'); }
    else { input.type='password'; this.classList.remove('fa-eye'); this.classList.add('fa-eye-slash'); }
  });
}