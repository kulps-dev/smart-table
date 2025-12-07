export function initSearching(searchInput, searchField) {
    if (searchInput && typeof searchInput.addEventListener === 'function') {
        const form = searchInput.form || searchInput.closest('form');

        if (form) {
            let t = null;
            const submitForm = () => {
                if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                } else {
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
            };

            searchInput.addEventListener('input', () => {
                clearTimeout(t);
                t = setTimeout(submitForm, 180);
            });

            //при сбросе данные по умолчанию
            const resetBtn = form.querySelector('[data-name="reset"], button[type="reset"]');
            if (resetBtn) {
                resetBtn.addEventListener('click', (event) => {
                    event.preventDefault();

                    form.querySelectorAll('input, select').forEach(el => {
                        if (el.type === 'radio' || el.type === 'checkbox') {
                            el.checked = false;
                        } else if (el.tagName.toLowerCase() === 'select') {
                            el.selectedIndex = 0;
                        } else {
                            el.value = '';
                        }
                    });

                    form.querySelectorAll('button[data-field]').forEach(btn => {
                        btn.dataset.value = 'none';
                    });

                    const firstPage = form.querySelector('input[name="page"]');
                    if (firstPage) {
                        firstPage.value = '1';
                        firstPage.checked = true;
                    }

                    submitForm();
                });
            }

            //очистка полей ввода
            const clearButtons = form.querySelectorAll('button[name="clear"]');
            clearButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();

                    const field = button.dataset.field;
                    const input = form.querySelector(`input[name="${field}"]`);
                    if (input) input.value = '';

                    submitForm();
                });
            });
        }
    }

    return (query, state, action) => {
        const value = (state.filters?.[searchField] ?? state[searchField] ?? "").trim();
        return value ? Object.assign({}, query, { search: value }) : query;
    };
}
