import { useState, useRef } from 'react';
import { uploadImage } from '../services/uploadService';
import '../styles/ImageUploader.css';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function ImageUploader({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Formats file sizes nicely
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Handles file selection changes
  const handleFileChange = (e) => {
    setError('');
    setSuccess(false);
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG and WEBP images are allowed');
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File size cannot exceed ${MAX_SIZE_MB}MB`);
      return;
    }

    setSelectedFile(file);

    // Create a local object URL for instant previewing
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  // Handles uploading to the server
  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const responseData = await uploadImage(selectedFile);
      if (responseData && responseData.url) {
        setUploadedUrl(responseData.url);
        setSuccess(true);
        if (onUploadSuccess) {
          onUploadSuccess(responseData.url);
        }
      } else {
        throw new Error('Upload response did not contain a URL');
      }
    } catch (err) {
      let msg = 'Failed to upload image. Please try again.';
      if (err.response) {
        msg = err.response.data?.message || err.response.data?.error || msg;
        if (err.response.status === 401 || err.response.status === 403) {
          msg = 'Session expired or unauthorized. Please re-login.';
        }
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resets component state completely
  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedUrl('');
    setSuccess(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUploadSuccess) {
      onUploadSuccess('');
    }
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        style={{ display: 'none' }}
        id="image-uploader-file-input"
      />

      {!previewUrl ? (
        <div 
          className="image-uploader__input-label"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="image-uploader__icon">📷</span>
          <span className="image-uploader__text">Add request image</span>
          <span className="image-uploader__hint">Supports JPG, PNG or WEBP up to 5MB</span>
        </div>
      ) : (
        <div className="image-uploader__preview-container">
          <div className="image-uploader__preview-wrapper">
            <img 
              src={previewUrl} 
              alt="Selected Preview" 
              className="image-uploader__preview" 
            />
          </div>
          
          <div className="image-uploader__meta">
            <p className="image-uploader__filename"><strong>{selectedFile.name}</strong></p>
            <p className="image-uploader__filesize">{formatFileSize(selectedFile.size)}</p>
          </div>

          <div className="image-uploader__actions">
            {!success && (
              <button
                type="button"
                className="image-uploader__btn image-uploader__btn--upload"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading && <span className="image-uploader__spinner" />}
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            )}
            <button
              type="button"
              className="image-uploader__btn image-uploader__btn--remove"
              onClick={handleRemove}
              disabled={loading}
            >
              Remove Image
            </button>
          </div>
        </div>
      )}

      {success && (
        <p className="image-uploader__status image-uploader__status--success">
          ✓ Image uploaded successfully
        </p>
      )}

      {error && (
        <p className="image-uploader__status image-uploader__status--error">
          {error}
        </p>
      )}
    </div>
  );
}
