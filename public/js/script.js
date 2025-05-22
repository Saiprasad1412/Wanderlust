   // Bootstrap Form Validation Script
   (function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})();

  document.querySelectorAll('.btn-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.alert').remove();
    });
  });

function scrollContainer(id, direction) {
  const container = document.getElementById(id);
  const scrollAmount = 500;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
}
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

const shuffledListings = shuffleArray(allListings); // Replace allListings with your DB query

res.render("listings/listing", { allListings: shuffledListings });

