import React, { useState, useRef, useEffect } from 'react';
import DocsModal from './DocsModal';
import ImgModal from './ImgModal';
import './FilesButton.css';
import clip from '../assets/clip.svg';
import docs from '../assets/document_sender.svg';
import img from '../assets/img_sender.svg';

const FilesButton = ({ chats, files, setFiles, addImageToChat, threadID }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const buttonRef = useRef(null);

  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setShowButtons(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="wrapper" ref={buttonRef}>
      <div
        className="circle-container"
        onClick={() => setShowButtons(!showButtons)}
      >
        <img src={clip} alt="SVG Icon" className="circle-svg" />
      </div>
      {showButtons && (
        <div className="button-container">
          <button onClick={() => setShowDocsModal(true)}>
            <img src={docs} alt="Docs Icon" />
          </button>
          <button onClick={() => setShowImgModal(true)}>
            <img src={img} alt="Img Icon" />
          </button>
        </div>
      )}
      {showDocsModal && <DocsModal chats={chats} files={files} threadID={threadID} setFiles={setFiles} onClose={() => setShowDocsModal(false)} />}
      {/* {showImgModal && <ImgModal onClose={() => setShowImgModal(false)} addImageToChat={addImageToChat} />} */}
    </div>
  );
};

export default FilesButton;
