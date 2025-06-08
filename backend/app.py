from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # React からのリクエストを許可

# データファイルのパス
DATA_FILE = 'todos.json'

def load_todos():
    """TODOデータを読み込み"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_todos(todos):
    """TODOデータを保存"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(todos, f, ensure_ascii=False, indent=2)

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """全TODOを取得"""
    todos = load_todos()
    return jsonify(todos)

@app.route('/api/todos', methods=['POST'])
def add_todo():
    """TODO追加"""
    data = request.get_json()
    todos = load_todos()
    
    new_todo = {
        'id': len(todos) + 1,
        'text': data['text'],
        'completed': False,
        'created_at': datetime.now().isoformat()
    }
    
    todos.append(new_todo)
    save_todos(todos)
    
    return jsonify(new_todo), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """TODO更新（完了/未完了切り替え）"""
    todos = load_todos()
    
    for todo in todos:
        if todo['id'] == todo_id:
            todo['completed'] = not todo['completed']
            save_todos(todos)
            return jsonify(todo)
    
    return jsonify({'error': 'Todo not found'}), 404

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """TODO削除"""
    todos = load_todos()
    todos = [todo for todo in todos if todo['id'] != todo_id]
    save_todos(todos)
    
    return jsonify({'message': 'Todo deleted'}), 200

@app.route('/', methods=['GET'])
def home():
    """ホームページ（動作確認用）"""
    return jsonify({
        'message': 'Todo API is running!',
        'endpoints': [
            'GET /api/todos - 全TODO取得',
            'POST /api/todos - TODO追加',
            'PUT /api/todos/<id> - TODO更新',
            'DELETE /api/todos/<id> - TODO削除'
        ]
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Flask server starting...")
    print(f"📍 Running on port: {port}")
    print("📋 Endpoints: /api/todos")
    app.run(host='0.0.0.0', port=port, debug=False)
    