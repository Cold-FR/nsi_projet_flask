let selected = null;

function selectLine(div) {
    if (div.id !== 'selected') {
        if (document.getElementById('selected')) document.getElementById('selected').id = '';
        div.id = 'selected';
        selected = document.getElementById('selected');
        if (div.classList.contains('adding')) {
            document.getElementById('add').innerText = 'Confirmer ?';
        } else if (div.classList.contains('editing')) {
            document.getElementById('edit').innerText = 'Confirmer ?';
        } else {
            initActions();
        }
    } else {
        div.id = '';
        selected = null;
        initActions();
    }
}

function initSelector() {
    document.querySelectorAll('.language').forEach(div => {
        div.addEventListener('click', (e) => {
            selectLine(div, e);
            e.stopPropagation();
        });
    });
}

function initActions() {
    if (document.getElementById('add').innerText === 'Confirmer ?') document.getElementById('add').innerText = 'Ajouter une ligne';
    if (document.getElementById('edit').innerText === 'Confirmer ?') document.getElementById('edit').innerText = 'Modifier la sélection';
}

function displayAlert(type, status) {
    const alert = document.getElementById('alert');
    const title = type === 'success' ? 'Succès' : type === 'warning' ? 'Avertissement' : 'Erreur';
    const alertBox = document.createElement('div');

    alertBox.innerHTML = `<div class="alert-close"><i class="fas fa-times"></i></div><div class="alert-title">${title}</div><div class="alert-text">${status}</div><div class="alert-timeout"></div>`;
    alertBox.setAttribute('class', 'alert-box ' + type);
    alert.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.animation = 'none';
    }, 300);

    let alertTimeOut = setTimeout(() => {
        alertBox.style.animation = 'display-alert .3s reverse forwards';
        setTimeout(() => {
            alertBox.remove();
        }, 300);
    }, 5000);

    alertBox.children[0].addEventListener('click', (e) => {
        e.stopPropagation();
        alertBox.style.animation = 'display-alert .3s reverse forwards';
        setTimeout(() => {
            clearTimeout(alertTimeOut);
            alertBox.remove();
        }, 300);
    });
}

function fetchLanguages(data, addOrEdit = false, remove = false) {
    document.querySelectorAll('.warning').forEach(div => {
        div.style.animation = 'display-alert .3s reverse forwards';
        setTimeout(() => {
            div.remove();
        }, 300);
    });
    if (data && data.type) {
        displayAlert(data.type, data.status);
        if (data.type === 'success') {
            if (addOrEdit) {
                if (selected.classList.contains('editing')) selected.classList.remove('editing');
                if (selected.classList.contains('adding')) selected.classList.remove('adding');
                selected.innerHTML = `<td class="index">${data.index}</td><td>${data.name}</td><td>${data.birth}</td><td>${data.descr}</td>`;
            } else if (remove) {
                selected.remove();
                document.querySelectorAll('.index').forEach((div, key) => {
                    div.innerText = key;
                });
            } else if (!addOrEdit && !remove) {
                document.getElementById('languages').innerHTML = '';
                data.response.forEach((line, key) => {
                    document.getElementById('languages').innerHTML += `<tr class="language"><td class="index">${key}</td><td>${line.name}</td><td>${line.birth}</td><td>${line.descr}</td></tr>`;
                });
                initSelector();
            }
        }
    } else {
        displayAlert('error', 'Il y a eu un problème avec le serveur.');
    }
    initActions();
}

function initForm(action) {
    initActions();
    if (selected !== null && selected.classList.contains(action + 'ing')) {
        const selectedChildren = selected.children;
        let dataActions = new FormData();
        dataActions.append('index', selectedChildren[0].innerText);
        dataActions.append('name', selectedChildren[1].firstElementChild.value);
        dataActions.append('birth', selectedChildren[2].firstElementChild.value);
        dataActions.append('descr', selectedChildren[3].firstElementChild.value);
        displayAlert('warning', 'La requête est en cours...');
        fetch('./actions/' + action, {
            method: 'POST',
            body: dataActions
        }).then((response) => {
            if (!response.ok) return displayAlert('error', 'Il y a eu un problème avec le serveur.');
            return response.json();
        }).then((data) => {
            return fetchLanguages(data, true);
        }).catch((error) => {
            console.error(error);
            return displayAlert('error', 'Il y a eu un problème avec le serveur.');
        });
    } else {
        if (action === 'add') {
            document.getElementById('languages').innerHTML += '<tr class="language adding"><td>Indéfini</td><td><input type="text" id="name" placeholder="Nom du langage..."></td><td><input max="' + new Date().getFullYear() + '" min="1944" type="number" id="birth" placeholder="Date de création..." ></td><td><input type="text" id="descr" placeholder="Description du langage..."></td></tr>';
            document.getElementById('add').innerText = 'Confirmer ?';
            selectLine(document.querySelectorAll('.language')[document.querySelectorAll('.language').length - 1]);
            initSelector();
        } else if (action === 'edit') {
            if (selected !== null && !selected.classList.contains('adding')) {
                const selectedChildren = selected.children;
                selected.classList.add('editing');
                const oldName = selectedChildren[1].innerText;
                const oldBirth = selectedChildren[2].innerText;
                const oldDescr = selectedChildren[3].innerText;
                selectedChildren[1].innerHTML = `<input type="text" id="name" placeholder="Nom du langage..." value="${oldName}">`;
                selectedChildren[2].innerHTML = `<input max="${new Date().getFullYear()}" min="1944" type="number" id="birth" placeholder="Date de création..." value="${oldBirth}">`;
                selectedChildren[3].innerHTML = `<input type="text" id="descr" placeholder="Description du langage..." value="${oldDescr}">`;
                document.getElementById('edit').innerText = 'Confirmer ?';
            }
        }
    }

    document.querySelectorAll('#selected > td > input').forEach((div) => {
        div.addEventListener('click', e => {
            if (div.parentElement.parentElement.id === 'selected') e.stopPropagation();
        });
    });
}

window.addEventListener('load', () => initSelector());

document.getElementById('add').addEventListener('click', (e) => {
    e.stopPropagation();
    initForm('add');
});

document.getElementById('edit').addEventListener('click', (e) => {
    e.stopPropagation();
    initForm('edit');
});

document.getElementById('delete').addEventListener('click', (e) => {
    e.stopPropagation();
    if (selected !== null) {
        if (selected.classList.contains('adding')) {
            selected.remove();
            initActions();
        } else {
            displayAlert('warning', 'La requête est en cours...');
            fetch('./actions/delete?index=' + selected.firstElementChild.innerText, {
                method: 'GET'
            }).then(response => {
                if (!response.ok) return displayAlert('error', 'Il y a eu un problème avec le serveur.');
                return response.json();
            }).then(data => fetchLanguages(data, false, true)).catch((error) => {
                console.error(error);
                return displayAlert('error', 'Il y a eu un problème avec le serveur.');
            });
        }
    }
});

document.getElementById('reset').addEventListener('click', (e) => {
    e.stopPropagation();
    displayAlert('warning', 'La requête est en cours...');
    fetch('./actions/reset', {
        method: 'GET'
    }).then((response) => {
        if (!response.ok) return displayAlert('error', 'Il y a eu un problème avec le serveur.');
        return response.json();
    }).then((data) => fetchLanguages(data)).catch((error) => {
        console.error(error);
        return displayAlert('error', 'Il y a eu un problème avec le serveur.');
    });
});

document.documentElement.addEventListener('click', (e) => {
    if (!selected) return;
    selected.id = '';
    selected = null;
    initActions();
});

document.getElementById('reload').addEventListener('click', (e) => {
    e.stopPropagation();
    displayAlert('warning', 'La requête est en cours...');
    fetch('./actions/reload', {
        method: 'GET'
    }).then((response) => {
        if (!response.ok) return displayAlert('error', 'Il y a eu un problème avec le serveur.');
        return response.json();
    }).then((data) => fetchLanguages(data)).catch((error) => {
        console.error(error);
        return displayAlert('error', 'Il y a eu un problème avec le serveur.');
    });
});