const $ = (id) => document.getElementById(id);
const p = new URLSearchParams(location.search);
const nama = p.get("nama"), email = p.get("email"), ekskul = p.get("ekskul");

if (nama && ekskul) {
  $("teks").textContent = `Selamat, ${nama}! Kamu sudah resmi terdaftar di ekstrakurikuler ${ekskul}.`;
  $("r-nama").textContent = nama;
  $("r-email").textContent = email || "-";
  $("r-ekskul").textContent = ekskul;
  $("r-tanggal").textContent = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  $("ringkas").hidden = false;

  const warna = ["#6558d3", "#ffb59a", "#7fd1ae", "#f7d774", "#b7a6f5", "#ff9dc4"];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("i");
    c.style.left = Math.random() * 100 + "%";
    c.style.background = warna[i % warna.length];
    c.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    c.style.animationDelay = Math.random() * 0.8 + "s";
    $("confetti").appendChild(c);
  }
} else {
  $("judul").textContent = "Belum ada data pendaftaran";
  $("teks").textContent = "Silakan isi formulir pendaftaran terlebih dahulu.";
  document.querySelector(".check").hidden = true;
}