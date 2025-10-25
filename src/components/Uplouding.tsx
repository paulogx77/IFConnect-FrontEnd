'use client';

import { fetchFromAPI } from '@/lib/api';

interface UploadingProps {
  onUpload: (url: string) => void;
}

const Uploading = ({ onUpload }: UploadingProps) => {
  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUpload(data.url);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

export default Uploading;