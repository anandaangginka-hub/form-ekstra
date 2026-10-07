const $ = (id) => document.getElementById(id);
// Regex email umum: berlaku untuk semua domain (Gmail, Yahoo, Outlook, email sekolah, dll)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- Daftar ekstrakurikuler (mengisi kartu + dropdown) ---------- */
const daftarEkskul = [
  ["Jurnalistik", "📰"], ["PMR", "🩹"], ["Paskibra", "🚩"], ["Pencak Silat", "🥋"],
  ["Tari", "💃"], ["Bahasa Jepang", "🎌"], ["Bantara", "⛺"], ["Futsal", "⚽"],
  ["Voli", "🏐"], ["Drumband", "🥁"], ["Rebana", "🎶"], ["Rohis", "🕌"],
  ["Faster", "⭐"], ["Paduan Suara", "🎤"],
];
const select = $("ekskul-select");
daftarEkskul.forEach(([nama, ikon]) => {
  select.add(new Option(nama, nama));
  const b = document.createElement("button");
  b.type = "button";
  b.className = "item";
  b.dataset.nama = nama;
  b.innerHTML = `<span class="ico" aria-hidden="true">${ikon}</span>${nama}`;
  b.addEventListener("click", () => {
    select.value = nama;
    select.dispatchEvent(new Event("change"));
    $("daftar").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $("grid").appendChild(b);
});
select.addEventListener("change", () =>
  document.querySelectorAll(".item").forEach((i) => i.classList.toggle("on", i.dataset.nama === select.value)));

/* ---------- Fungsi bantu validasi ---------- */
function setStatus(inputEl, errId, pesan) {
  const field = inputEl.closest(".field");
  $(errId).textContent = pesan;
  field.classList.toggle("invalid", pesan !== "");
  field.classList.toggle("valid", pesan === "");
  return pesan === "";
}
function bindForm(fields, onSubmit) {
  const cek = (f) => setStatus(f.el, f.err, f.rule(f.el.value));
  fields.forEach((f) => {
    f.el.addEventListener(f.el.tagName === "SELECT" ? "change" : "input", () => { cek(f); if (f.after) f.after(); });
  });
  return (e) => {
    e.preventDefault();
    if (fields.map(cek).every(Boolean)) onSubmit();
  };
}
const cekKonfirmasi = (v) => (v === "" || v !== $("password").value ? "Konfirmasi password harus sama dengan password." : "");

/* ---------- Form pendaftaran ---------- */
const fDaftar = [
  { el: $("nama"), err: "err-nama", rule: (v) => (v.trim().length < 3 ? "Nama wajib diisi, minimal 3 karakter." : "") },
  { el: $("email"), err: "err-email", rule: (v) => (emailRegex.test(v.trim()) ? "" : "Format email tidak valid (contoh: nama@domain.com).") },
  {
    el: $("password"), err: "err-password",
    rule: (v) => (v.length < 8 ? "Password minimal 8 karakter." : ""),
    after: () => { updateMeter(); if ($("konfirmasi").value) setStatus($("konfirmasi"), "err-konfirmasi", cekKonfirmasi($("konfirmasi").value)); },
  },
  { el: $("konfirmasi"), err: "err-konfirmasi", rule: cekKonfirmasi },
  { el: select, err: "err-ekskul", rule: (v) => (v === "" ? "Pilih salah satu ekstrakurikuler." : "") },
];

$("formDaftar").addEventListener("submit", bindForm(fDaftar, () => {
  // Data valid: pindah ke halaman konfirmasi (password tidak ikut dikirim)
  const params = new URLSearchParams({ nama: $("nama").value.trim(), email: $("email").value.trim(), ekskul: select.value });
  $("btn-daftar").disabled = true;
  $("btn-daftar").textContent = "Mendaftarkan...";
  setTimeout(() => { window.location.href = "berhasil.html?" + params.toString(); }, 700);
}));

/* ---------- Indikator kekuatan password ---------- */
function updateMeter() {
  const v = $("password").value;
  let skor = 0;
  if (v.length >= 8) skor++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) skor++;
  if (/\d/.test(v)) skor++;
  if (/[^A-Za-z0-9]/.test(v)) skor++;
  if (!v) skor = 0;
  $("meter-bar").style.width = skor * 25 + "%";
  $("meter-bar").style.background = ["#d64545", "#d64545", "#f0b429", "#2f9e6b", "#1b7f4a"][skor];
  $("meter-text").textContent = "Kekuatan password: " + ["-", "Lemah", "Sedang", "Kuat", "Sangat kuat"][skor];
}

/* ---------- Tombol lihat/sembunyikan password ---------- */
document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = $(btn.dataset.target);
    const tampil = input.type === "password";
    input.type = tampil ? "text" : "password";
    btn.textContent = tampil ? "Sembunyi" : "Lihat";
  });
});

/* ---------- Form tanya jawab ---------- */
const fTanya = [
  { el: $("t-nama"), err: "err-t-nama", rule: (v) => (v.trim().length < 3 ? "Nama minimal 3 karakter." : "") },
  { el: $("t-email"), err: "err-t-email", rule: (v) => (emailRegex.test(v.trim()) ? "" : "Format email tidak valid.") },
  { el: $("t-topik"), err: "err-t-topik", rule: (v) => (v === "" ? "Pilih topik pertanyaan." : "") },
  { el: $("t-pesan"), err: "err-t-pesan", rule: (v) => (v.trim().length < 10 ? "Pertanyaan minimal 10 karakter." : "") },
];
$("t-pesan").addEventListener("input", (e) => ($("t-count").textContent = `${e.target.value.length} / 300`));

$("formTanya").addEventListener("submit", bindForm(fTanya, () => {
  const item = document.createElement("li");
  const judul = document.createElement("b");
  judul.textContent = `${$("t-nama").value.trim()} - ${$("t-topik").value}`;
  const isi = document.createElement("span");
  isi.textContent = $("t-pesan").value.trim(); // textContent mencegah injeksi HTML
  item.append(judul, isi);
  $("list-tanya").prepend(item);
  $("daftar-tanya").hidden = false;
  $("formTanya").reset();
  $("t-count").textContent = "0 / 300";
  $("formTanya").querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
}));