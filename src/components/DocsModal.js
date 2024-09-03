import React, { useState, useEffect } from 'react';
import './Modal.css'; // Estilos das modais
import trash from '../assets/trash.svg';
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
    if (uploadFile) {
      try {
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("purpose", "fine-tune");

        const gpt = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}key`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_API_TOKEN}`,
          }
        });

        if (!gpt.ok) {
          throw new Error(`Failed to upload file: ${gpt.statusText}`);
        }

        const gpt_data = await gpt.json();

        const file_insert = await fetch("https://api.openai.com/v1/files", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${gpt_data.key}`,
          },
          body: formData,
        });

        if (!file_insert.ok) {
          throw new Error(`Failed to upload file: ${file_insert.statusText}`);
        }

        const file = await file_insert.json();

        const user_id = Cookies.get('user_email_id');

        const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}file`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_API_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: uploadFile.name,
            user_id: user_id,
            file_id: file.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to upload file: ${response.statusText}`);
        }

        setFiles((prevFiles) => [...prevFiles, { name: uploadFile.name, file: uploadFile, file_id: file.id }]);
        setUploadFile(null);
        setActiveForm('list');

      } catch (error) {
        console.error("Error uploading file:", error);
      }
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
                      <img src={trash} />
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
              <input type="file" onChange={handleFileChange} />
              <button className="form-buttom" onClick={handleAddFile}>Enviar Arquivo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsModal;
