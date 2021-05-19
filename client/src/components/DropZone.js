import React, { useState } from "react"
import './DropZone.css'

const DropZone = ({ formState, formDispatch }) => {

    const [selectedFile, setSelectedFile] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const dragOver = (e) => {
        e.preventDefault();
    }
    
    const dragEnter = (e) => {
        e.preventDefault();
    }
    
    const dragLeave = (e) => {
        e.preventDefault();
    }
    
    const fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
       if (files.length > 1) {
            alert("You cannot upload more than one image file")
        } else if (selectedFile !== "") {
            alert("You've already selected a file for upload")
        } else if (files.length === 1) {
            validateFile(files[0])
        }
    }

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
        if (validTypes.indexOf(file.type) === -1) {
            file['invalid'] = true
            setErrorMessage('File type not permitted')
        } else {
            formDispatch({
                type: "image",
                payload: file
            })
        }
        setSelectedFile(file)
    }

    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = () => {
        setSelectedFile("")
        formDispatch({
            type: "image",
            payload: {name: ""}
        })
    }

    return (
        <div className="dropzoneContainer">
            <div className="dropContainer"
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
            >
                {selectedFile === "" &&
                <div className="dropMessage">
                    <div className="uploadIcon"></div>
                        Drag &#38; drop an image file here or click to upload
                </div>
                }
            </div>

            <div className="file-display-container">
                { selectedFile !== "" && 
                <div className="file-status-bar">
                    <div>
                        <div className="file-type-logo"></div>
                        <div className="file-type">{fileType(selectedFile.name)}</div>
                        <span className={`file-name ${selectedFile.invalid ? 'file-error' : ''}`}>{selectedFile.name.length < 10 ? selectedFile.name : `${selectedFile.name.substring(0, 8)}...`}</span>
                        <span className="file-size">({fileSize(selectedFile.size)})</span> {selectedFile.invalid && <span className='file-error-message'>({errorMessage})</span>}
                    </div>
                    <div className="file-remove" onClick={() => removeFile()}>X</div>
                </div>
                }
            </div>

        </div>
    )
}

export default DropZone