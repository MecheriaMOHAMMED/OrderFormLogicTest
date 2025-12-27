const form = document.getElementById('orderForm');
const phoneInput = document.getElementById('phone');
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbypQ9JzFp7ogxz42zXwKejfzuLUNApU81Tzx-RDHgVCnMGWDZcbQl-lYrHF84graJSb/exec';

const LEAD_URL = WEB_APP_URL + '?lead=1';

// Save lead once per phone per browser using localStorage
phoneInput.addEventListener('blur', async () => {
  const phone = phoneInput.value.trim();
  const isValid = /^(05|06|07)[0-9]{8}$/.test(phone);
  if (!isValid) return;

  // avoid sending the same phone again from this browser
  if (localStorage.getItem('lead_' + phone) === '1') return;

  const name = document.querySelector('input[name="name"]').value.trim();
  if (!name) return; // need at least name + phone

  const leadForm = new FormData();
  leadForm.append('name', name);
  leadForm.append('phone', phone);

  try {
    await fetch(LEAD_URL, { method: 'POST', body: leadForm });
    localStorage.setItem('lead_' + phone, '1'); // mark as sent
  } catch (e) {
    console.log(e);
  }
});

// visual feedback on phone validity
phoneInput.addEventListener('input', () => {
  const phone = phoneInput.value;
  const isValidAlgeria = /^(05|06|07)[0-9]{8}$/.test(phone);
  phoneInput.classList.toggle('phone-detected', isValidAlgeria);
});

// normal order submit
form.onsubmit = async (e) => {
  e.preventDefault();

  const orderBtn = document.getElementById('orderBtn');
  orderBtn.disabled = true;
  orderBtn.textContent = '⏳ Enregistrement...';

  try {
    const formData = new FormData(form);
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();

    document.getElementById('orderId').textContent = result.orderId;
    document.getElementById('success').style.display = 'block';
    form.style.display = 'none';

    setTimeout(() => window.location.reload(), 5000);
  } catch (error) {
    alert('❌ Erreur connexion. Réessayez.');
    orderBtn.disabled = false;
    orderBtn.textContent = '🚀 Commander Maintenant';
  }
};
