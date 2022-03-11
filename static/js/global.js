function lineSelector() {
    document.querySelectorAll('.language').forEach(div => {
        div.addEventListener('click', (e) => {
            if (div.id !== 'selected') {
                if (document.getElementById('selected')) document.getElementById('selected').id = '';
                div.id = 'selected';
                if (div.classList.contains('adding')) {
                    document.getElementById('add').innerText = 'Confirmer ?';
                } else {
                    document.getElementById('add').innerText = 'Ajouter une ligne';
                }
            } else {
                div.id = '';
                document.getElementById('add').innerText = 'Ajouter une ligne';
            }
        });
    });
}

window.onload = lineSelector();

document.getElementById('add').addEventListener('click', () => {
    if (document.getElementById('selected') && document.getElementById('selected').classList.contains('adding')) {
        const name = document.getElementById('selected').firstElementChild.firstElementChild.value;
        const birth = document.getElementById('selected').children[1].firstElementChild.value;
        const descr = document.getElementById('selected').lastElementChild.firstElementChild.value;
        fetch('./actions/add', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                birth: parseInt(birth),
                descr: descr
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            document.getElementById('add').innerText = 'Ajouter une ligne';
            document.getElementById('selected').classList.remove('adding');
            document.getElementById('selected').innerHTML = `<td>${data.name}</td><td>${data.birth}</td><td>${data.descr}</td>`;
        });
    } else {
        document.getElementById('languages').innerHTML += '<tr class="language adding"><td><input type="text" id="name" placeholder="Nom du langage..."></td><td><input placeholder="Date de création..." type="number" id="birth"></td><td><input placeholder="Description du langage..." type="text" id="descr"></td></tr>';
        lineSelector();
        if (document.getElementById('selected')) document.getElementById('selected').id = '';
        document.querySelectorAll('.language')[document.querySelectorAll('.language').length - 1].id = 'selected';
        document.getElementById('add').innerText = 'Confirmer ?';
        document.querySelectorAll('input').forEach((div) => {
            div.addEventListener('click', e => e.stopPropagation());
        });
    }
});

document.getElementById('edit').addEventListener('click', () => {

});

document.getElementById('delete').addEventListener('click', () => {
    if (document.getElementById('selected')) {
        if (document.getElementById('selected').classList.contains('adding')) document.getElementById('add').innerText = 'Ajouter une ligne';
        document.getElementById('selected').remove();
        document.getElementById('add').innerText = 'Ajouter une ligne';
        fetch('./actions/delete?=' /* ID/POSITION DU DICT DANS LA LISTE */, {
            method: 'GET'
        }).then(response => {
            return response.json();
        }).then(data => {

        });
    }
});

document.getElementById('reset').addEventListener('click', () => {
    fetch('./actions/reset', {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById('languages').innerHTML = '';
        data.forEach(line => {
            document.getElementById('languages').innerHTML += `<tr class="language"><td>${line.name}</td><td>${line.birth}</td><td>${line.descr}</td></tr>`;
        });
        lineSelector();
        document.getElementById('add').innerText = 'Ajouter une ligne';
    });
});