import React, { useState, useEffect } from 'react';
import './Modal.css';
import trashIco from '../assets/trash.svg';
import Cookies from 'js-cookie';

const DocsModal = ({ chats, files, setFiles, onClose, threadID }) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [uploadFile, setUploadFile] = useState(null);
  const [activeForm, setActiveForm] = useState('list');

  useEffect(() => {
    // Verifica se chats não está vazio
    if (chats && chats.length > 0) {
      // Encontra o chat com o thread_id correspondente ao threadID
      const currentChat = chats.find(chat => chat.thread_id === threadID);

      if (currentChat && currentChat.files) {
        // Define os arquivos inicialmente selecionados
        const initialSelectedFiles = new Set(currentChat.files.filter(fileId => fileId != null));
        setSelectedFiles(initialSelectedFiles);
      }
    }
  }, [chats, threadID]);


  const handleFileChange = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const handleAddFile = async () => {
    if (!uploadFile) { alert("Selecione um conteudo para o envio"); return;}
    if (uploadFile.size > 524287790) { alert("O arquivo não pode ser maior que 500mb"); return;}
    try {        
      const formData = new FormData();
      const user_id = Cookies.get('user_email_id');
      formData.append("file", uploadFile);
      const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}file/${user_id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.REACT_APP_API_TOKEN}` },
        body: formData,
      });
      if (!response.ok) { alert("Erro ao enviar arquivo"); return; }
      const result = await response.json();
      alert("Conteúdo enviado");
      setFiles((prevFiles) => [...prevFiles, { name: result.name, file: uploadFile, file_id: result.file_id }]);
      setUploadFile(null);
      setActiveForm('list');
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    
  };

  const handleSelectFile = (fileId) => {
    setSelectedFiles((prevSelectedFiles) => {
      const updatedSelection = new Set(prevSelectedFiles);
      if (updatedSelection.has(fileId)) {
        updatedSelection.delete(fileId);
      } else {
        updatedSelection.add(fileId);
      }
      return updatedSelection;
    });
  };

  const handleDeleteFile = async (fileId) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.file_id !== fileId));

    try {
      await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}file/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
    } catch (err) {
      alert('Error delete file');
    }
  };

  const handleUpdateFiles = async () => {
    // Mapeia os arquivos para um formato adequado para atualização
    const filesToUpdate = files.map(file => ({
      file_id: file.file_id,
      check: selectedFiles.has(file.file_id)
    }));

    try {
      // Realiza a requisição para atualizar os arquivos
      let response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}file/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: filesToUpdate,
          thread_id: threadID
        }),
        mode: 'cors'
      });

      if (response.ok) {
        const currentChat = chats.find(chat => chat.thread_id === threadID);
        if (currentChat) {
          const selectedFileIds = filesToUpdate
            .filter(file => file.check === true)
            .map(file => file.file_id);

          currentChat.files = selectedFileIds;

          const initialSelectedFiles = new Set(selectedFileIds);
          setSelectedFiles(initialSelectedFiles);
        }
      } else {
        alert('Failed to update files');
      }
    } catch (err) {
      alert('Error updating files');
    }
  };

  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="nav-buttons">
          <button className={activeForm === 'list' ? 'active' : ''} onClick={() => setActiveForm('list')}>
            Lista de arquivos
          </button>
          <button className={activeForm === 'upload' ? 'active' : ''} onClick={() => setActiveForm('upload')}>
            Enviar arquivo
          </button>
        </div>
        <div>
          {activeForm === 'list' && (
            <div className="file-list-form">
              <h3>Arquivos para esse chat</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <input
                      type="checkbox"
                      className="file-checkbox"
                      checked={selectedFiles.has(file.file_id)}
                      onChange={() => handleSelectFile(file.file_id)}
                    />
                    {file.name}
                    <button className="file-delete" onClick={() => handleDeleteFile(file.file_id)}>
                      <img src={trashIco} alt="Excluir arquivo" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="form-buttom" onClick={handleUpdateFiles}>Atualizar Seleção</button>
            </div>
          )}

          {activeForm === 'upload' && (
            <div className="upload-form">
              <h3>Enviar novo arquivo</h3>
              <input type="file" onChange={handleFileChange} accept=".txt, .docx, .xlsx, .pdf, .pptx" />
              <button className="form-buttom" onClick={handleAddFile}>Enviar Arquivo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsModal;
