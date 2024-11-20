document.addEventListener('DOMContentLoaded', () => {
    const faqLinks = document.querySelectorAll('.faq-link');
    const faqModal = document.getElementById('faqModal');
    const faqAnswer = document.getElementById('faqAnswer');
    const closeFaqModal = document.getElementById('closeFaqModal');
  
    faqLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        faqAnswer.textContent = link.getAttribute('data-answer');
        faqModal.style.display = 'block';
      });
    });
  
    closeFaqModal.addEventListener('click', () => {
      faqModal.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === faqModal) {
        faqModal.style.display = 'none';
      }
    });
  });
  