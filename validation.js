document.querySelectorAll('form[novalidate]').forEach(function (form) {
  var fields = Array.from(form.querySelectorAll('input:not([type="checkbox"]), select, textarea'));
  var success = form.querySelector('.success-message');

  function setState(field, valid) {
    field.classList.toggle('is-valid', valid);
    field.classList.toggle('is-invalid', !valid);

    var feedback = field.parentElement.querySelector('.invalid-feedback');
    if (!feedback || valid) return;

    if (field.validity.customError) {
      feedback.textContent = field.validationMessage;
    } else if (field.validity.valueMissing && field.dataset.required) {
      feedback.textContent = field.dataset.required;
    } else if (field.dataset.invalid) {
      feedback.textContent = field.dataset.invalid;
    }
  }

  function validateField(field) {
    if (field.dataset.match) {
      var other = form.querySelector(field.dataset.match);
      field.setCustomValidity(field.value && field.value !== other.value ? 'Passwords do not match' : '');
    }

    var valid = field.checkValidity();

    if (field.type === 'radio') {
      form.querySelectorAll('input[name="' + field.name + '"]').forEach(function (radio) {
        setState(radio, valid);
      });
    } else {
      setState(field, valid);
    }
    return valid;
  }

  function isChecked(field) {
    return field.classList.contains('is-valid') || field.classList.contains('is-invalid');
  }

  function revalidateDependents(field) {
    if (!field.id) return;
    form.querySelectorAll('[data-match="#' + field.id + '"]').forEach(function (dep) {
      if (dep.value || isChecked(dep)) validateField(dep);
    });
  }

  form.addEventListener('focusout', function (e) {
    if (fields.includes(e.target)) validateField(e.target);
  });
  form.addEventListener('change', function (e) {
    if (fields.includes(e.target)) validateField(e.target);
  });
  form.addEventListener('input', function (e) {
    if (fields.includes(e.target)) {
      if (isChecked(e.target)) validateField(e.target);
      revalidateDependents(e.target);
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var allValid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });
    if (success) success.classList.toggle('d-none', !allValid);
  });

  form.addEventListener('reset', function () {
    fields.forEach(function (field) {
      field.classList.remove('is-valid', 'is-invalid');
      field.setCustomValidity('');
    });
    if (success) success.classList.add('d-none');
  });
});
