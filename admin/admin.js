
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import {
      getAuth, onAuthStateChanged, signOut
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import {
      getFirestore, doc, setDoc, getDoc, deleteDoc,
      collection, getDocs
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyCi_hDVGY1Mxu2XkHc9lU2e2dvQxNn93mE",
      authDomain: "ai-apps-4e725.firebaseapp.com",
      projectId: "ai-apps-4e725",
      storageBucket: "ai-apps-4e725.appspot.com",
      messagingSenderId: "893169320014",
      appId: "1:893169320014:web:bef13994bb20c349b3031f"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Silakan login terlebih dahulu.");
        window.location.href = "/";
        return;
      }
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || !userSnap.data().isAdmin) {
        alert("Akses ditolak. Kamu bukan admin.");
        await signOut(auth);
        window.location.href = "/";
      }
    });

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "/";
    });

    const produkRef = collection(db, "produk");

    const form = document.getElementById("produk-form");
    const list = document.getElementById("produk-list");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const slug = form.slug.value.trim();
      const data = {
        nama: form.nama.value.trim(),
        harga: parseInt(form.harga.value),
        gambar: form.gambar.value.trim(),
        link: form.link.value.trim(),
        deskripsi: form.deskripsi.value.trim(),
        tags: form.tags.value.split(",").map(t => t.trim().toLowerCase())
      };
      await setDoc(doc(db, "produk", slug), data);
      form.reset();
      loadProduk();
    });

    async function loadProduk() {
      list.innerHTML = "";
      const snapshot = await getDocs(produkRef);
      snapshot.forEach(doc => {
        const p = doc.data();
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
          <div class="card text-bg-secondary h-100">
            <img src="${p.gambar || 'https://via.placeholder.com/150'}" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">${p.nama}</h5>
              <p class="card-text">${p.deskripsi || ""}</p>
              <p class="card-text"><strong>Rp${p.harga?.toLocaleString()}</strong></p>
              <p><small>Tags: ${p.tags?.join(", ")}</small></p>
              <a href="${p.link}" target="_blank" class="btn btn-success btn-sm">Beli</a>
              <button class="btn btn-danger btn-sm float-end" onclick="hapusProduk('${doc.id}')">🗑️</button>
            </div>
          </div>
        `;
        list.appendChild(col);
      });
    }

    window.hapusProduk = async (id) => {
      if (confirm("Yakin hapus produk?")) {
        await deleteDoc(doc(db, "produk", id));
        loadProduk();
      }
    };

    loadProduk();