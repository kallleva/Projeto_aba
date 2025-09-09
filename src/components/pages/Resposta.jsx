import React, { useState } from 'react';
import styles from './Resposta.module.css';

const Resposta = ({ perguntaId }) => {
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setValor(e.target.value);
    if (e.target.value.trim() === '') {
      setError('Este campo é obrigatório');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valor.trim() === '') {
      setError('Este campo é obrigatório');
    } else {
      // Handle the submission logic here
      console.log(`Resposta para a pergunta ${perguntaId}: ${valor}`);
      setValor('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.respostaForm}>
      <label htmlFor={`resposta-${perguntaId}`}>Resposta:</label>
      <input
        type="text"
        id={`resposta-${perguntaId}`}
        value={valor}
        onChange={handleChange}
        className={styles.input}
      />
      {error && <span className={styles.error}>{error}</span>}
      <button type="submit" className={styles.submitButton}>Enviar</button>
    </form>
  );
};

export default Resposta;