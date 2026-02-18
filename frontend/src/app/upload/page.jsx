'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UploadArea from '../../components/UploadArea';
import Chatbot from '../../components/Chatbot';
import { analyzePdf } from '../../lib/api';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      // Wrap XHR in a Promise for better async/await handling
      const response = await new Promise((resolve, reject) => {
        xhr.open("POST", "http://localhost:3001/api/upload");
        xhr.onload = () => resolve(xhr);
        xhr.onerror = () => reject(new Error("Network error while uploading file"));
        xhr.onabort = () => reject(new Error("Upload was cancelled"));
        xhr.send(form);
      });

      if (response.status >= 400) {
        let errorInfo = "Upload failed";
        try {
          const errorResponse = JSON.parse(response.responseText);
          errorInfo = errorResponse.error || `Upload failed with status ${response.status}`;
        } catch (e) {
          // Ignore if response is not JSON
        }
        throw new Error(errorInfo);
      }

      let responseBody;
      try {
        responseBody = JSON.parse(response.responseText);
      } catch (err) {
        console.error("Failed to parse JSON response:", err);
        throw new Error("Invalid response from server");
      }
      
      console.log("Upload successful:", responseBody);
      
      // Store the parsed data in session storage
      sessionStorage.setItem('analysisResults', JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        ...responseBody
      }));
      
      // Redirect to results page
      router.push('/results');
      
    } catch (err) {
      console.error("Upload failed:", err);
      // Show user-friendly error message
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header showUploadButton={false} />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            Upload your document
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Drop a PDF file below and we&apos;ll simplify it for you.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <UploadArea
            onFileSelect={handleFileSelect}
            file={file}
            onRemove={handleRemove}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
          
          {/* Action Buttons */}
          {file && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {uploading ? 'Processing...' : 'Simplify document'}
              </button>
              <button
                onClick={handleRemove}
                disabled={uploading}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-8">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            What we look for
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Data collection practices - what info they gather</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Third-party sharing - who else sees your data</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Your rights - how to access, delete, or update info</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Security measures - how your data is protected</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
}
