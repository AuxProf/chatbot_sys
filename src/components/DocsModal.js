import React, { useState } from 'react';
import './Modal.css'; // Estilos das modais

const DocsModal = ({ onClose }) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [uploadFile, setUploadFile] = useState(null);
  const [activeForm, setActiveForm] = useState('list');

  const handleFileChange = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const handleAddFile = () => {
    if (uploadFile) {
      setFiles((prevFiles) => [...prevFiles, { name: uploadFile.name, file: uploadFile }]);
      setUploadFile(null);
      setActiveForm('list');
    }
  };

  const handleSelectFile = (fileName) => {
    setSelectedFiles((prevSelectedFiles) => {
      const updatedSelection = new Set(prevSelectedFiles);
      if (updatedSelection.has(fileName)) {
        updatedSelection.delete(fileName);
      } else {
        updatedSelection.add(fileName);
      }
      return updatedSelection;
    });
  };

  const handleDeleteFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
  };

  const handleUploadFiles = async () => {
    const filesToUpload = files.filter(file => selectedFiles.has(file.name));
    
    const formData = new FormData();
    filesToUpload.forEach(file => formData.append('files', file.file));

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('Files uploaded successfully');
        setActiveForm('list');
      } else {
        alert('Failed to upload files');
      }
    } catch (err) {
      alert('Error uploading files');
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
                      checked={selectedFiles.has(file.name)}
                      onChange={() => handleSelectFile(file.name)}
                    />
                    {file.name}
                    <button className="file-delete" onClick={() => handleDeleteFile(file.name)}>Delete</button>
                  </div>
                ))}
              </div>
              <button className="form-buttom" onClick={handleUploadFiles}>Atualizar Seleção</button>
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
