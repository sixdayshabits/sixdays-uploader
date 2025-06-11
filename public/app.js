async function fetchFolders() {
    const res = await fetch("/?list=1", {
      headers: {
        "Authorization": "Basic " + btoa("sixdayshabits:sixdaysupload")
      }
    });
    const folders = await res.json();
  
    const select = document.getElementById("folderSelect");
    select.innerHTML = '<option value="">(root)</option>';
    folders.forEach(folder => {
      const opt = document.createElement("option");
      opt.value = folder;
      opt.textContent = folder;
      select.appendChild(opt);
    });
  }
  
  document.getElementById("createFolderBtn").addEventListener("click", async () => {
    const name = document.getElementById("newFolderName").value.trim();
    if (!name) return alert("Nama folder tidak boleh kosong");
  
    const res = await fetch("/?create-folder=" + encodeURIComponent(name), {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa("sixdayshabits:sixdaysupload")
      }
    });
  
    const msg = await res.text();
    alert(msg);
    await fetchFolders(); // refresh list
  });
  
  document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const folder = document.getElementById("folderSelect").value;
    if (folder) formData.append("folder", folder);
  
    const res = await fetch("/", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": "Basic " + btoa("sixdayshabits:sixdaysupload")
      }
    });
  
    const text = await res.text();
    document.getElementById("result").innerText = text;
  });
  
  fetchFolders();
  