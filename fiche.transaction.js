const id = new URLSearchParams(window.location.search).get("id");
const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
const transaction = transactions[id] || { vendeurs: [], acheteurs: [], comments: [], docs: [] };

const commentsList = document.getElementById("commentsList");
const docsList = document.getElementById("docsList");

function saveTransaction() {
  transaction.bien = document.getElementById("bien").value;
  transaction.prix = parseFloat(document.getElementById("prix").value) || 0;
  transaction.honoraires = parseFloat(document.getElementById("honoraires").value) || 0;
  transaction.conditions = document.getElementById("conditions").value;
  transaction.statut = document.getElementById("statut").value;
  transaction.date_offre = document.getElementById("date_offre").value;
  transaction.date_compromis = document.getElementById("date_compromis").value;
  transaction.date_acte = document.getElementById("date_acte").value;

  transaction.vendeurs = collectPeople("vendeur");
  transaction.acheteurs = collectPeople("acheteur");

  transactions[id] = transaction;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  alert("Transaction enregistrée !");
  window.location.href = "transactions.html";
}

function addPerson(role) {
  const container = document.getElementById(role + "s");
  const index = container.children.length;
  const html = `
    <div class="column person-card" id="${role}_${index}">
      <label>Nom</label><input type="text" id="${role}_nom_${index}" />
      <label>Prénom</label><input type="text" id="${role}_prenom_${index}" />
      <label>Date de naissance</label><input type="date" id="${role}_naissance_${index}" />
      <label>Lieu de naissance</label><input type="text" id="${role}_lieu_${index}" />
      <label>Adresse postale</label><input type="text" id="${role}_adresse_${index}" />
      <label>Profession</label><input type="text" id="${role}_profession_${index}" />
      <label>Téléphone</label><input type="text" id="${role}_tel_${index}" />
      <label>Email</label><input type="email" id="${role}_mail_${index}" />
      <button class="remove-btn" onclick="removePerson('${role}', ${index})">🗑️ Supprimer</button>
    </div>`;
  container.insertAdjacentHTML("beforeend", html);
}

function collectPeople(role) {
  const result = [];
  let i = 0;
  while (document.getElementById(`${role}_nom_${i}`)) {
    result.push({
      nom: document.getElementById(`${role}_nom_${i}`).value,
      prenom: document.getElementById(`${role}_prenom_${i}`).value,
      naissance: document.getElementById(`${role}_naissance_${i}`).value,
      lieu: document.getElementById(`${role}_lieu_${i}`).value,
      adresse: document.getElementById(`${role}_adresse_${i}`).value,
      profession: document.getElementById(`${role}_profession_${i}`).value,
      tel: document.getElementById(`${role}_tel_${i}`).value,
      mail: document.getElementById(`${role}_mail_${i}`).value
    });
    i++;
  }
  return result;
}

function removePerson(role, index) {
  const container = document.getElementById(role + "s");
  const data = collectPeople(role);
  data.splice(index, 1);
  container.innerHTML = "";
  data.forEach((person, i) => {
    addPerson(role);
    document.getElementById(`${role}_nom_${i}`).value = person.nom;
    document.getElementById(`${role}_prenom_${i}`).value = person.prenom;
    document.getElementById(`${role}_naissance_${i}`).value = person.naissance;
    document.getElementById(`${role}_lieu_${i}`).value = person.lieu;
    document.getElementById(`${role}_adresse_${i}`).value = person.adresse;
    document.getElementById(`${role}_profession_${i}`).value = person.profession;
    document.getElementById(`${role}_tel_${i}`).value = person.tel;
    document.getElementById(`${role}_mail_${i}`).value = person.mail;
  });
}

function renderPeople() {
  (transaction.vendeurs || []).forEach((p, i) => {
    addPerson("vendeur");
    Object.keys(p).forEach(key => {
      document.getElementById(`vendeur_${key}_${i}`).value = p[key];
    });
  });
  (transaction.acheteurs || []).forEach((p, i) => {
    addPerson("acheteur");
    Object.keys(p).forEach(key => {
      document.getElementById(`acheteur_${key}_${i}`).value = p[key];
    });
  });
}

function renderForm() {
  if (transaction.bien) document.getElementById("bien").value = transaction.bien;
  if (transaction.prix) document.getElementById("prix").value = transaction.prix;
  if (transaction.honoraires) document.getElementById("honoraires").value = transaction.honoraires;
  if (transaction.conditions) document.getElementById("conditions").value = transaction.conditions;
  if (transaction.statut) document.getElementById("statut").value = transaction.statut;
  if (transaction.date_offre) document.getElementById("date_offre").value = transaction.date_offre;
  if (transaction.date_compromis) document.getElementById("date_compromis").value = transaction.date_compromis;
  if (transaction.date_acte) document.getElementById("date_acte").value = transaction.date_acte;
}

function renderTimeline() {
  const dateOffre = new Date(transaction.date_offre);
  const dateCompromis = new Date(transaction.date_compromis);
  const dateActe = new Date(transaction.date_acte);
  const j10 = new Date(dateCompromis); j10.setDate(j10.getDate() + 10);
  const j60 = new Date(dateCompromis); j60.setDate(j60.getDate() + 60);
  const j120 = new Date(dateCompromis); j120.setDate(j120.getDate() + 120);
  const now = new Date();
  const steps = [
    { id: "offre", date: dateOffre },
    { id: "compromis", date: dateCompromis },
    { id: "retractation", date: j10 },
    { id: "pret", date: j60 },
    { id: "permis", date: j120 },
    { id: "acte", date: dateActe }
  ];
  steps.forEach(step => {
    const el = document.getElementById("step_" + step.id);
    const label = document.getElementById("timeline_" + step.id);
    if (isNaN(step.date)) {
      label.textContent = "-";
      el.classList.remove("active");
    } else {
      label.textContent = step.date.toLocaleDateString("fr-FR");
      if (now >= step.date) el.classList.add("active");
    }
  });
}

function addComment() {
  const input = document.getElementById("newComment");
  const comment = input.value.trim();
  if (!comment) return;
  transaction.comments.push(comment);
  input.value = "";
  updateLocalStorage();
  renderComments();
}

function renderComments() {
  commentsList.innerHTML = "";
  (transaction.comments || []).forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    commentsList.appendChild(li);
  });
}

function addDoc() {
  const input = document.getElementById("doc_link");
  const link = input.value.trim();
  if (!link) return;
  transaction.docs.push(link);
  input.value = "";
  updateLocalStorage();
  renderDocs();
}

function renderDocs() {
  docsList.innerHTML = "";
  (transaction.docs || []).forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${d}" target="_blank">${d}</a>`;
    docsList.appendChild(li);
  });
}

function updateLocalStorage() {
  transactions[id] = transaction;
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialisation
window.onload = () => {
  renderForm();
  renderPeople();
  renderTimeline();
  renderComments();
  renderDocs();
};
