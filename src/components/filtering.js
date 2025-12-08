export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // Обработка нажатия на кнопку очистки фильтра
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }
        // Обработка изменения фильтра (старая логика для select/input с data-filter-name)
        else if (action && action.dataset && action.dataset.filterName) {
            const filterName = action.dataset.filterName;
            const filterValue = action.value || "all";

            if (filterValue === "all") {
                // Очищаем фильтр, если выбрано "all"
                delete state.filters[filterName];
            } else {
                state.filters[filterName] = filterValue;
            }
        }

        // Сбор актуальных фильтров из всех элементов формы
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && ['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    }

    return {
        updateIndexes,
        applyFiltering
    }
}