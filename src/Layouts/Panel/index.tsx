import React, { useState, useEffect, Fragment } from "react";
import { FaUndo, FaRedo, FaBold, FaUnderline, FaStrikethrough, FaListOl, FaListUl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaRulerHorizontal, FaIndent, FaOutdent, FaPalette, FaPen, FaEye, FaFilePdf, FaHeart, FaFileImage } from "react-icons/fa";
import { IoMdGrid, IoMdColorPalette } from "react-icons/io";
import { Link } from "react-router-dom";
import html2canvas from 'html2canvas';
import ReactToPdf from 'react-to-pdf';
import './panel.scss';

export default ({ changePreview, preview }) => {
  const [foreColor, setForeColor] = useState('#000');
  const [_init, setLoad] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('resume.pdf');
  const [imgFileName, setImgFileName] = useState('resume.png');
  const [newPdfFileName, setNewPdfFileName] = useState('');

  const Format = (command, value) => {
    document.execCommand(command, false, value);
  };

  useEffect(() => {
    setLoad(true);
  }, []);

  let targetRef = document.body.querySelector('#resume');

  useEffect(() => {
    targetRef = document.body.querySelector('#resume');

    console.clear();
  }, [_init, preview, targetRef]);

  const exportImage = () => {
    const newFileName = prompt('Enter the image file name', imgFileName);
    if (newFileName) {
      html2canvas(targetRef).then(canvas => {
        const img = canvas.toDataURL('image/png');
        const download = document.createElement('a');
        download.href = img;
        download.download = newFileName;
        download.click();
      });
      setImgFileName(newFileName);
    }
  };

  const handlePdfFileNameChange = (e) => {
    setNewPdfFileName(e.target.value);
  };

  const handleDownloadPdf = () => {
    const finalPdfFileName = newPdfFileName || pdfFileName;
    setPdfFileName(finalPdfFileName);

    setTimeout(() => {
      const pdfDownloadLink = document.createElement('a');
      pdfDownloadLink.href = '#';
      pdfDownloadLink.download = finalPdfFileName;
      pdfDownloadLink.click();
    }, 100);
  };

  return (
    <div className="options-panel">
      <Link to='/'>
        <h1 className="logo">
          <p>Resume</p>
          <p>Craftr</p>
        </h1>
      </Link>

      <ul id="options">
        <li className="option">
          <Link to='/templates'>
            <span>
              <IoMdGrid />{" "}
            </span>
            <span className="text"> Templates</span>
          </Link>
        </li>

        {typeof preview !== 'undefined' && (
          <Fragment>
            <li className="option">
              <span className="text">Tools</span>
              <div className="tools">
                <button className="button" onClick={() => Format('undo')}><FaUndo /></button>
                <button className="button" onClick={() => Format('redo')}><FaRedo /></button>
                <button className="button" onClick={() => Format('bold')}><FaBold /></button>
                <button className="button" onClick={() => Format('underline')}><FaUnderline /></button>
                <button className="button" onClick={() => Format('strikeThrough')}><FaStrikethrough /></button>
                <button className="button" onClick={() => Format('insertOrderedList')}><FaListOl /></button>
                <button className="button" onClick={() => Format('insertUnorderedList')}><FaListUl /></button>
                <button className="button" onClick={() => Format('justifyLeft')}><FaAlignLeft /></button>
                <button className="button" onClick={() => Format('justifyCenter')}><FaAlignCenter /></button>
                <button className="button" onClick={() => Format('justifyRight')}><FaAlignRight /></button>
                <button className="button" onClick={() => Format('InsertHorizontalRule')}><FaRulerHorizontal /></button>
                <button className="button" onClick={() => Format('indent')}><FaIndent /></button>
                <button className="button" onClick={() => Format('outdent')}><FaOutdent /></button>
                <button className="button fore-color-tool" style={{ backgroundColor: foreColor }}>
                  <input
                    type="color"
                    onChange={(e) => {
                      setForeColor(e.target.value);
                      Format('foreColor', e.target.value);
                    }}
                    name="foreColor"
                    id="foreColor"
                  />
                  <FaPalette />
                </button>
              </div>
            </li>

            <li className="option" onClick={() => changePreview && changePreview()}>
              <span>
                {!preview ? <FaPen /> : <FaEye />}{" "}
              </span>
              <span className="text"> {!preview ? 'Edit' : 'Preview'} </span>
            </li>

            <li className="option glb-color">
              <input
                type="color"
                onChange={(e) => {
                  const _colors = document.querySelectorAll('.--primary-color');
                  const _bg = document.querySelectorAll('.--primary-bg');
                  const _border = document.querySelectorAll('.--primary-border-color');
                  const _icon = document.querySelectorAll('.--icon-color');

                  _colors.forEach((color) => (color as HTMLElement).style.color = e.target.value);
                  _bg.forEach((color) => (color as HTMLElement).style.backgroundColor = e.target.value);
                  _border.forEach((color) => (color as HTMLElement).style.borderColor = e.target.value);
                  _icon.forEach((color) => (color as SVGElement).style.color = e.target.value);
                }}
              />
              <span>
                <IoMdColorPalette />{" "}
              </span>
              <span className="text"> Colors</span>
            </li>
          </Fragment>
        )}

        <li>
          {preview === false && (
            <ReactToPdf
              filename={pdfFileName}
              options={{
                format: [330, 450],
                unit: 'px'
              }}
              targetRef={targetRef}
              scale={1}
            >
              {({ toPdf }) => (
                <button id="export" onClick={toPdf}>
                  <FaFilePdf />
                  <span> Export PDF</span>
                </button>
              )}
            </ReactToPdf>
          )}
        </li>

        <li>
          {preview === false && (
            <button id="export" onClick={exportImage} className="export-image">
              <FaFileImage />
              <span> Export Image</span>
            </button>
          )}
        </li>

        <li className="me">
          <p>
            Made with <FaHeart style={{ color: 'red' }} /> by{" "}
                   <a
              href="https://resumecraftr.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Your Name
            </a>
          </p>
        </li>
      </ul>

      <div className="pdf-file-name">
        {preview === false && (
          <input
            type="text"
            value={newPdfFileName}
            onChange={handlePdfFileNameChange}
            placeholder="Enter PDF file name"
          />
        )}
      </div>

      {preview === false && (
        <button
          className="download-pdf"
          onClick={handleDownloadPdf}
        >
          Download PDF
        </button>
      )}
    </div>
  );
};





   
   
