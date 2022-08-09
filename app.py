from flask import Flask, request, jsonify, send_file
from psycopg2 import connect, extras

app = Flask(__name__)

host = 'localhost'
port = 5432
dbname = 'tareas'
user = 'postgres'
password = 'Miguel123'

def get_connection():
    conn = connect(host=host, port=port, dbname=dbname, user=user, password=password)
    return conn 

@app.get('/api/tasks')
def get_tasks():
    conn = get_connection()
    # Objetos
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    
    cur.execute('SELECT * FROM todo')
    todolist = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify(todolist)

@app.post('/api/tasks')
def create_tasks():
    # Extraer el objeto json de mi petición
    new_task = request.get_json()
    typetask = new_task['typetask']
    title = new_task['title']
    description = new_task['description']
    
    conn = get_connection()
    # Para que me devuelva en pares de key and value (diccionario)
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    
    cur.execute("INSERT INTO todo (typetask, title, description) VALUES (%s, %s, %s) RETURNING *", (typetask, title, description))
    # Extraer un dato
    new_created_task = cur.fetchone()
    print(new_created_task)
    conn.commit()
    
    cur.close()
    conn.close()
    # jsonify pasar de un diccionario a json
    return jsonify(new_created_task)

@app.delete('/api/tasks/<id>')
def delete_tasks(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    
    cur.execute('DELETE FROM todo WHERE id = %s RETURNING *', (id, ))
    task = cur.fetchone()
    
    print(task)
    conn.commit()
    
    cur.close()
    conn.close()
    
    if task is None:
        return jsonify({'message': 'Task not found'}), 404
    
    return jsonify(task)

@app.put('/api/tasks/<id>')
def update_tasks(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_task = request.get_json()
    typetask = new_task['typetask']
    title = new_task['title']
    description = new_task['description']
    
    cur.execute('UPDATE todo SET typetask = %s, title = %s, description = %s WHERE id = %s RETURNING *', (typetask, title, description, id))
    update_task = cur.fetchone()
    
    conn.commit()
    
    conn.close()
    cur.close()
    
    if update_task is None:
        return jsonify({'message': 'Task not found'}), 404
    
    return jsonify(update_task)

@app.get('/api/tasks/<id>')
def get_task(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM todo WHERE id = %s', (id,))
    task = cur.fetchone()
    
    if task is None:
        return jsonify({'message': 'Task not found'}), 404
    
    return jsonify(task)

# Rutas para la interfaz web
@app.route('/')
def index():
    return send_file('static/login/index.html')

@app.get('/crud')
def crud():
    return send_file('static/crud.html')


if __name__ == '__main__':
    app.run(debug=True)