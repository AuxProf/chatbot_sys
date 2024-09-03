import React, { useState } from 'react';
import './../Modal.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            setLoading(true);
            setError(null);
            try {
                const success = await onLogin(email); // Chama a função passada como props para definir o cookie e exibir o Chatbot
                if (!success) {
                    setError('Email incorreto. Tente novamente.');
                }
            } catch (err) {
                setError('Email incorreto. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="modal" style={{ backgroundColor: 'rgba(0, 0, 0)' }}>
            <form onSubmit={handleSubmit} className="modal_content">
                <label>Insira o seu email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="form-buttom" disabled={loading}>
                    {loading ? 'Carregando...' : 'Login'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;
