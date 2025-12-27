const form = document.getElementById('orderForm');
    const phoneInput = document.getElementById('phone');
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbypQ9JzFp7ogxz42zXwKejfzuLUNApU81Tzx-RDHgVCnMGWDZcbQl-lYrHF84graJSb/exec'; // Apps Script UR

    // Auto-detect phone → Visual feedback + potential Leads save
    phoneInput.addEventListener('input', () => {
      const phone = phoneInput.value;
      const isValidAlgeria = /^(05|06|07)[0-9]{8}$/.test(phone);
      phoneInput.classList.toggle('phone-detected', isValidAlgeria);
    });

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

        // Auto-refresh after 5s
        setTimeout(() => window.location.reload(), 5000);
      } catch (error) {
        alert('❌ Erreur connexion. Réessayez.');
        orderBtn.disabled = false;
        orderBtn.textContent = '🚀 Commander Maintenant';
      }
    };