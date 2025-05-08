document.getElementById('formAvisDeValeur').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const doc = new jsPDF();
    doc.text('Avis de Valeur', 10, 10);
    doc.text('Adresse: ' + document.getElementById('adresse').value, 10, 20);
    doc.text('Type de bien: ' + document.getElementById('typeBien').value, 10, 30);
    doc.text('Surface: ' + document.getElementById('surface').value, 10, 40);
    doc.text('Nombre de chambres: ' + document.getElementById('nbChambres').value, 10, 50);
    doc.text('État du bien: ' + document.getElementById('etatBien').value, 10, 60);
    doc.text('Valeur estimée basse: ' + document.getElementById('valeurBasse').value, 10, 70);
    doc.text('Valeur estimée haute: ' + document.getElementById('valeurHaute').value, 10, 80);
    doc.text('Prix moyen dans la zone: ' + document.getElementById('prixMoyenZone').value, 10, 90);
    doc.text('Description: ' + document.getElementById('description').value, 10, 100);
    doc.text('Commodités: ' + document.getElementById('commodites').value, 10, 110);
  
    doc.save('avis_de_valeur.pdf');
  });
  