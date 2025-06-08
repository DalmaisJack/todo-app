import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  // TODOを取得
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // TODO追加
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        text: newTodo
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // TODO完了切り替え
  const toggleTodo = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`);
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // TODO削除
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const completedCount = todos.filter(t => t && t.completed === true).length;
  const totalCount = todos.length;

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 My Todo App</h1>
        
        {/* TODO追加フォーム */}
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            追加
          </button>
        </form>

        {/* TODOリスト */}
        <div className="todo-list">
          {loading ? (
            <p>読み込み中...</p>
          ) : todos.length === 0 ? (
            <p>タスクがありません</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <span 
                  onClick={() => toggleTodo(todo.id)}
                  className="todo-text"
                >
                  {todo.completed ? '✅' : '⭕'} {todo.text}
                </span>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* 統計 */}
        <div className="stats">
          <p>
            完了: {completedCount} / 総数: {totalCount}
          </p>
          <p style={{fontSize: '14px', marginTop: '5px'}}>
            未完了: {totalCount - completedCount}
          </p>
        </div>

        <footer style={{marginTop: '40px', fontSize: '14px', opacity: '0.7'}}>
          <p>Made with ❤️ using React & Python</p>
        </footer>
      </header>
    </div>
  );
}

export default App;