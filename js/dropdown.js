const onClickOutside = (element, callback) => {
  document.addEventListener('click', (e) => {
    if (!element.contains(e.target)) callback();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown').forEach((dropdown) => {
    const button = dropdown.querySelector('.dropdown-trigger');
    const selected = dropdown.querySelector('.dropdown-trigger span');
    const input = dropdown.querySelector('input');
    const list = dropdown.querySelector('.dropdown-list');
    const options = list.querySelectorAll('button');

    const close = () => dropdown.classList.remove('open');

    onClickOutside(dropdown, close);

    button.addEventListener('click', () => {
      dropdown.classList.toggle('open');
    });

    options.forEach((option) => {
      option.addEventListener('click', () => {
        const text = option.querySelector('span').innerHTML;
        selected.innerHTML = text;
        close();
        options.forEach((o) => {
          o.classList.remove('active');
          o.closest('li').classList.remove('active');
        });
        option.classList.add('active');
        option.closest('li').classList.add('active');
        input.value = option.dataset.value;
        input.dispatchEvent(new Event('change'));
      });
    });
  });
});
