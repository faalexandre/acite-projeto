(() => {
 const urls = new Set();
 const database = new Promise(resolve => {
  if (!window.indexedDB) return resolve(null);
  const request = indexedDB.open('acite-author-covers', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('covers', { keyPath: 'id' });
  request.onsuccess = () => resolve(request.result);
  request.onerror = request.onblocked = () => resolve(null);
 });
 const loaded = database.then(db => db ? new Promise(resolve => {
  const request = db.transaction('covers').objectStore('covers').getAll();
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => resolve([]);
 }) : []);
 document.querySelectorAll('.timeline-card').forEach(async profile => {
  const author = 'investigacao-' + profile.id;
  const name = profile.querySelector('.author-name').textContent.trim();
  const grid = profile.querySelector('[data-works-grid]');
  const status = profile.querySelector('[data-works-status]');
  const covers = (await loaded).filter(cover => cover.author === author).slice(0, 2);
  for (let index = 0; index < 2; index++) {
   let cover = covers[index] || { id: author + '-slot-' + index, author };
   const card = document.createElement('div');
   card.className = 'work-cover-card';
   card.innerHTML = '<button class="investigation-cover" type="button"><i class="fa-solid fa-image" aria-hidden="true"></i></button><input type="file" accept="image/*" hidden>';
   const button = card.querySelector('button');
   const input = card.querySelector('input');
   button.setAttribute('aria-label', `Alterar capa ${index + 1} de ${name}`);
   button.title = 'Clique para adicionar ou alterar a capa';
   let currentUrl;
   function show(blob) {
    if (currentUrl) { URL.revokeObjectURL(currentUrl); urls.delete(currentUrl); }
    currentUrl = URL.createObjectURL(blob);
    urls.add(currentUrl);
    const image = document.createElement('img');
    image.src = currentUrl;
    image.alt = cover.title || `Capa da obra de ${name}`;
    button.replaceChildren(image);
   }
   if (cover.blob instanceof Blob) show(cover.blob);
   button.addEventListener('click', () => input.click());
   input.addEventListener('change', async () => {
    const file = input.files[0];
    input.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { status.textContent = 'Selecione um ficheiro de imagem.'; return; }
    cover = { ...cover, blob: file, name: file.name };
    show(file);
    button.disabled = true;
    try {
     const db = await database;
     if (!db) throw new Error('Armazenamento indisponível');
     await new Promise((resolve, reject) => {
      const tx = db.transaction('covers', 'readwrite');
      tx.objectStore('covers').put(cover);
      tx.oncomplete = resolve;
      tx.onerror = tx.onabort = () => reject(tx.error);
     });
     status.textContent = 'Capa guardada neste navegador.';
    } catch { status.textContent = 'Capa alterada apenas nesta sessão. Não foi possível guardar.'; }
    finally { button.disabled = false; }
   });
   grid.append(card);
  }
 });
 window.addEventListener('beforeunload', () => urls.forEach(url => URL.revokeObjectURL(url)));
})();
;

      const publicationImageInputs = [
        ...document.querySelectorAll(".publication-image-input"),
      ];
      const publicationImageUrls = new Map();
      const publicationImageDatabase = new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
          reject(
            new Error(
              "Este navegador não disponibiliza armazenamento IndexedDB.",
            ),
          );
          return;
        }
        const request = window.indexedDB.open("acite-faculty-photos", 1);
        request.addEventListener("upgradeneeded", () => {
          if (!request.result.objectStoreNames.contains("photos")) {
            request.result.createObjectStore("photos", { keyPath: "id" });
          }
        });
        request.addEventListener("success", () => resolve(request.result));
        request.addEventListener("error", () =>
          reject(
            request.error ||
              new Error(
                "Não foi possível abrir o armazenamento de fotografias.",
              ),
          ),
        );
        request.addEventListener("blocked", () =>
          reject(
            new Error(
              "O armazenamento está bloqueado por outra página ACITE aberta. Feche-a e tente novamente.",
            ),
          ),
        );
      });

      function imageArea(input) {
        return input.closest(".author-photo-area, .work-photo-area");
      }

      function setImageStatus(input, message, state = "") {
        const area = imageArea(input);
        const status = input
          .closest(".image-column")
          .querySelector(".image-status");
        const action = area.querySelector(".publication-image-action");
        status.textContent = message;
        status.dataset.state = state;
        status.hidden = !message;
        action.textContent =
          input.dataset.imageKind === "author"
            ? "Adicionar foto"
            : "Adicionar obra";
        action.hidden = state === "success";
      }

      function showPublicationImage(input, blob) {
        const area = imageArea(input);
        const previousUrl = publicationImageUrls.get(input);
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        const objectUrl = URL.createObjectURL(blob);
        publicationImageUrls.set(input, objectUrl);
        let image = area.querySelector("img");
        if (!image) {
          image = document.createElement("img");
          area.prepend(image);
        }
        image.src = objectUrl;
        image.alt =
          input.dataset.imageKind === "author"
            ? input
                .getAttribute("aria-label")
                .replace("Selecionar foto de ", "")
                .replace("Selecionar foto do autor da ", "Autor da ")
            : `Imagem da obra: ${input.closest(".timeline-card").querySelector("h3").textContent}`;
        area.classList.add("has-photo");
        area.tabIndex = 0;
        area.setAttribute("role", "button");
        area.setAttribute(
          "aria-label",
          input.dataset.imageKind === "author"
            ? `Selecionar outra foto de ${image.alt}`
            : `Selecionar outra imagem da obra ${input.closest(".timeline-card").querySelector("h3").textContent}`,
        );
      }

      publicationImageInputs.forEach((input) => {
        const area = imageArea(input);
        area.addEventListener("click", (event) => {
          if (area.classList.contains("has-photo") && event.target !== input)
            input.click();
        });
        area.addEventListener("keydown", (event) => {
          if (
            !area.classList.contains("has-photo") ||
            !["Enter", " "].includes(event.key)
          )
            return;
          event.preventDefault();
          input.click();
        });
        input.addEventListener("change", async () => {
          const file = input.files && input.files[0];
          if (!file) return;
          if (!file.type.startsWith("image/")) {
            input.value = "";
            setImageStatus(input, "Selecione um ficheiro de imagem.", "error");
            return;
          }
          setImageStatus(input, "A guardar imagem…");
          try {
            const database = await publicationImageDatabase;
            await new Promise((resolve, reject) => {
              const transaction = database.transaction("photos", "readwrite");
              transaction.objectStore("photos").put({
                id: input.dataset.photoId,
                blob: file,
                name: file.name,
                type: file.type,
                updatedAt: new Date().toISOString(),
              });
              transaction.addEventListener("complete", resolve, { once: true });
              transaction.addEventListener(
                "error",
                () =>
                  reject(
                    transaction.error ||
                      new Error("Não foi possível guardar a imagem."),
                  ),
                { once: true },
              );
              transaction.addEventListener(
                "abort",
                () =>
                  reject(
                    transaction.error ||
                      new Error("O armazenamento da imagem foi cancelado."),
                  ),
                { once: true },
              );
            });
            showPublicationImage(input, file);
            setImageStatus(input, "", "success");
          } catch (error) {
            console.error(
              "Não foi possível guardar a imagem da obra publicada.",
              error,
            );
            setImageStatus(
              input,
              `Não foi possível guardar a imagem: ${error.message}`,
              "error",
            );
          }
        });
      });

      publicationImageDatabase
        .then(
          (database) =>
            new Promise((resolve, reject) => {
              const transaction = database.transaction("photos", "readonly");
              const request = transaction.objectStore("photos").getAll();
              let photos;
              request.addEventListener("success", () => {
                photos = request.result;
              });
              request.addEventListener("error", () =>
                reject(
                  request.error ||
                    new Error("Não foi possível ler as imagens guardadas."),
                ),
              );
              transaction.addEventListener("complete", () => resolve(photos));
              transaction.addEventListener("error", () =>
                reject(
                  transaction.error ||
                    new Error("Erro ao ler as imagens guardadas."),
                ),
              );
            }),
        )
        .then((photos) => {
          photos.forEach((photo) => {
            const input = publicationImageInputs.find(
              (candidate) => candidate.dataset.photoId === photo.id,
            );
            if (!input || !(photo.blob instanceof Blob)) return;
            showPublicationImage(input, photo.blob);
            setImageStatus(input, "", "success");
          });
        })
        .catch((error) => {
          console.error(
            "Não foi possível carregar as imagens das obras publicadas.",
            error,
          );
          publicationImageInputs.forEach((input) =>
            setImageStatus(
              input,
              `Armazenamento indisponível: ${error.message}`,
              "error",
            ),
          );
        });
