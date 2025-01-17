from flask import Flask, request, render_template, jsonify
import json

app = Flask(__name__)

languages = [
    {
        'name': 'Java',
        'birth': 1995,
        'descr': 'Java est un langage de programmation orienté objet. Une particularité de Java est que les logiciels écrits dans ce langage sont compilés vers une représentation binaire intermédiaire qui peut être exécutée dans une machine virtuelle Java (JVM) en faisant abstraction du système d\'exploitation.'
    },
    {
        'name': 'JavaScript',
        'birth': 1995,
        'descr': 'JavaScript est un langage de programmation de scripts principalement employé dans les pages web interactives et à ce titre est une partie essentielle des applications web. Avec les langages HTML et CSS, JavaScript est au cœur des langages utilisés par les développeurs web.'
    },
    {
        'name': 'C',
        'birth': 1972,
        'descr': 'C est un langage de programmation impératif généraliste, de bas niveau. Inventé au début des années 1970 pour réécrire Unix, C est devenu un des langages les plus utilisés, encore de nos jours.'
    }
]

@app.route('/', methods=['GET'])
@app.route('/index.html', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/liste', methods=['GET'])
@app.route('/liste.html', methods=['GET'])
def liste():
    return render_template('liste.html', lines = languages)

@app.route('/actions/add', methods=['POST'])
def add():
    global languages
    name = request.form.get('name')
    birth = request.form.get('birth')
    descr = request.form.get('descr')
    responseType = 'error'
    status = 'Tous les champs n\'ont pas été complété.'
    if name != '' and birth != '' and descr != '':
        languages.append({
            'name': name,
            'birth': birth,
            'descr': descr
        })
        responseType = 'success'
        status = 'La ligne a bien été ajouté.'
    return jsonify(type = responseType, status = status, index = languages.index(languages[-1]), name = name, birth = birth, descr = descr)    

@app.route('/actions/edit', methods=['POST'])
def edit():
    global languages
    index = int(request.form.get('index'))
    name = request.form.get('name')
    birth = request.form.get('birth')
    descr = request.form.get('descr')
    responseType = 'error'
    status = 'Tous les champs n\'ont pas été complété.'
    if index != '' and name != '' and birth != '' and descr != '':
        languages[index]['name'] = name
        languages[index]['birth'] = birth
        languages[index]['descr'] = descr
        responseType = 'success'
        status = 'La ligne a bien été modifié.'
    return jsonify(type = responseType, status = status, index = index, name = name, birth = birth, descr = descr)    

@app.route('/actions/delete', methods=['GET'])
def delete():
    global languages
    index = request.args.get('index')
    responseType = 'error'
    status = 'Aucune ligne n\'a été sélectionné.'
    if(index != None):
        languages.pop(int(index))
        responseType = 'success'
        status = 'La ligne a bien été supprimé.'
    return jsonify(type = responseType, status = status, response = languages)    

@app.route('/actions/reset', methods=['GET'])
def reset():
    global languages
    languages = [
    {
        'name': 'Java',
        'birth': 1995,
        'descr': 'Java est un langage de programmation orienté objet. Une particularité de Java est que les logiciels écrits dans ce langage sont compilés vers une représentation binaire intermédiaire qui peut être exécutée dans une machine virtuelle Java (JVM) en faisant abstraction du système d\'exploitation.'
    },
    {
        'name': 'JavaScript',
        'birth': 1995,
        'descr': 'JavaScript est un langage de programmation de scripts principalement employé dans les pages web interactives et à ce titre est une partie essentielle des applications web. Avec les langages HTML et CSS, JavaScript est au cœur des langages utilisés par les développeurs web.'
    },
    {
        'name': 'C',
        'birth': 1972,
        'descr': 'C est un langage de programmation impératif généraliste, de bas niveau. Inventé au début des années 1970 pour réécrire Unix, C est devenu un des langages les plus utilisés, encore de nos jours.'
    }
    ]
    return jsonify(type = 'success', status = 'La table a bien été réinitialisé.', response = languages)

@app.route('/actions/reload', methods=['GET'])
def reload():
    global languages
    return jsonify(type = 'success', status = 'La table a été rechargé.', response = languages)

app.run(host='0.0.0.0', port='5001', debug=True)