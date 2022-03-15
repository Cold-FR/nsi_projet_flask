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
    line = json.loads(request.data.decode('utf-8'))
    languages.append({
        'name': line['name'],
        'birth': line['birth'],
        'descr': line['descr']
    })
    return jsonify(index = languages.index(languages[-1]), name = line['name'], birth = line['birth'], descr = line['descr'])

@app.route('/actions/edit', methods=['POST'])
def edit():
    line = json.loads(request.data.decode('utf-8'))
    languages[line['id']]['name'] = line['name']
    languages[line['id']]['birth'] = line['birth']
    languages[line['id']]['descr'] = line['descr']
    return jsonify(index = line['id'], name = line['name'], birth = line['birth'], descr = line['descr'])

@app.route('/actions/delete/<index>', methods=['GET'])
def delete(index):
    languages.pop(int(index))
    print(languages)
    return jsonify(languages)

@app.route('/actions/reset', methods=['GET'])
def reset():
    languages.clear()
    languages.append({
        'name': 'Java',
        'birth': 1995,
        'descr': 'Java est un langage de programmation orienté objet. Une particularité de Java est que les logiciels écrits dans ce langage sont compilés vers une représentation binaire intermédiaire qui peut être exécutée dans une machine virtuelle Java (JVM) en faisant abstraction du système d\'exploitation.'
    })
    languages.append({
        'name': 'JavaScript',
        'birth': 1995,
        'descr': 'JavaScript est un langage de programmation de scripts principalement employé dans les pages web interactives et à ce titre est une partie essentielle des applications web. Avec les langages HTML et CSS, JavaScript est au cœur des langages utilisés par les développeurs web.'
    })
    languages.append({
        'name': 'C',
        'birth': 1972,
        'descr': 'C est un langage de programmation impératif généraliste, de bas niveau. Inventé au début des années 1970 pour réécrire Unix, C est devenu un des langages les plus utilisés, encore de nos jours.'
    })
    return jsonify(languages)

app.run(host='0.0.0.0', port='5001', debug=True)