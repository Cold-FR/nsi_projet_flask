function selectLine(div) {
    if (div.id !== 'selected') {
        if (document.getElementById('selected')) document.getElementById('selected').id = '';
        div.id = 'selected';
        if (div.classList.contains('adding')) {
            document.getElementById('add').innerText = 'Confirmer ?';
        } else if (div.classList.contains('editing')) {
            document.getElementById('edit').innerText = 'Confirmer ?';
        } else {
            initActions();
        }
    } else {
        div.id = '';
        initActions();
    }
}

function initSelector() {
    document.querySelectorAll('.language').forEach(div => {
        div.addEventListener('click', () => selectLine(div));
    });
}

function initActions() {
    if (document.getElementById('add').innerText === 'Confirmer ?') document.getElementById('add').innerText = 'Ajouter une ligne';
    if (document.getElementById('edit').innerText === 'Confirmer ?') document.getElementById('edit').innerText = 'Modifier la sélection';
}

function fetchLanguages(data) {
    /// RESET : TTES LA LISTE / EDIT,ADD,DEL, UNIQUEMENT LIGNE AFFECTEE
    document.getElementById('languages').innerHTML = '';
    data.forEach((line, key) => {
        document.getElementById('languages').innerHTML += `<tr class="language"><td>${key}</td><td>${line.name}</td><td>${line.birth}</td><td>${line.descr}</td></tr>`;
    });
    initSelector();
    initActions();
}

async function initForm(action) {
    initActions();
    if (document.getElementById('selected') && document.getElementById('selected').classList.contains(action + 'ing')) {
        const id = document.getElementById('selected').children[0].innerText;
        const name = document.getElementById('selected').children[1].firstElementChild.value;
        const birth = document.getElementById('selected').children[2].firstElementChild.value;
        const descr = document.getElementById('selected').children[3].firstElementChild.value;
        const response = await fetch('./actions/' + action, {
            method: 'POST',
            body: JSON.stringify({
                id: parseInt(id),
                name: name,
                birth: parseInt(birth),
                descr: descr
            })
        });
        const data = await response.json();
        return fetchLanguages(data);
    }

    if (action === 'add') {
        document.getElementById('languages').innerHTML += '<tr class="language adding"><td>Indéfini</td><td><input type="text" id="name" placeholder="Nom du langage..."></td><td><input type="number" id="birth" placeholder="Date de création..." ></td><td><input type="text" id="descr" placeholder="Description du langage..."></td></tr>';
        document.getElementById('add').innerText = 'Confirmer ?';
        selectLine(document.querySelectorAll('.language')[document.querySelectorAll('.language').length - 1]);
        initSelector();
    } else if (action === 'edit') {
        if (document.getElementById('selected')) {
            document.getElementById('selected').classList.add('editing');
            const oldName = document.getElementById('selected').children[1].innerText;
            const oldBirth = document.getElementById('selected').children[2].innerText;
            const oldDescr = document.getElementById('selected').children[3].innerText;
            document.getElementById('selected').children[1].innerHTML = `<input type="text" id="name" placeholder="Nom du langage..." value="${oldName}">`;
            document.getElementById('selected').children[2].innerHTML = `<input type="number" id="birth" placeholder="Date de création..." value="${oldBirth}">`;
            document.getElementById('selected').children[3].innerHTML = `<input type="text" id="descr" placeholder="Description du langage..." value="${oldDescr}">`;
            document.getElementById('edit').innerText = 'Confirmer ?';
        }
    }

    document.querySelectorAll('#selected > td > input').forEach((div) => {
        div.addEventListener('click', e => {
            console.log('aa');
            if (div.parentElement.parentElement.id === 'selected') e.stopPropagation();
        });
    });
}

window.addEventListener('load', () => initSelector());

document.getElementById('add').addEventListener('click', () => {
    initForm('add');
});

document.getElementById('edit').addEventListener('click', () => {
    initForm('edit');
});

document.getElementById('delete').addEventListener('click', () => {
    if (document.getElementById('selected')) {
        if (document.getElementById('selected').classList.contains('adding')) {
            document.getElementById('selected').remove();
            initActions();
        } else {
            fetch('./actions/delete/' + document.getElementById('selected').firstElementChild.innerText, {
                method: 'GET'
            }).then(response => {
                return response.json();
            }).then(data => fetchLanguages(data));
        }
    }
});

document.getElementById('reset').addEventListener('click', () => {
    fetch('./actions/reset', {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((data) => fetchLanguages(data));
});