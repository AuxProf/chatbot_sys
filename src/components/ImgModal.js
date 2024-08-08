import React, { useState } from 'react';
import './Modal.css'; // Estilos das modais

const ImgModal = ({ onClose, addImageToChat }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Selecione uma imagem primeiro.');
      return;
    }
    setIsLoading(true);
    setError(null);

    const imageURL = URL.createObjectURL(selectedFile); // Cria a URL temporária
    addImageToChat(imageURL); // Adiciona a URL ao chat

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.success) {
          setError('Erro ao enviar imagem.');
        }
      } else {
        setError('Erro durante o envio da imagem.');
      }
    } catch (err) {
      setError('Erro durante o envio da imagem.');
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={onClose}>&times;</span>
        <form className="file-list-form" onSubmit={handleSubmit}>
          <h3>Envie uma imagem no chat</h3>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button className="form-buttom"  type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Imagem'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ImgModal;
