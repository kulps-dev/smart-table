import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    root.beforeElements = {};
    root.afterElements = {};

    if (before && Array.isArray(before)) {
        before.slice().reverse().forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.beforeElements[subName] = root[subName];
            root.container.prepend(root[subName].container);
        });
    }

    if (after && Array.isArray(after)) {
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.afterElements[subName] = root[subName];
            root.container.append(root[subName].container);
        });
    }

    root.container.addEventListener("change", onAction); //исправление безымянной функции

    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 100);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });


    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                const el = row.elements[key];
                if (!el) return;

                if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                    el.value = item[key]; // для input и select используем value
                } else {
                    el.textContent = item[key]; // для остальных элементов используем textContent
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };


    return {...root, render};
}
