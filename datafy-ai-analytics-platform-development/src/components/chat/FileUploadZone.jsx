import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiFile, FiBarChart3, FiX, FiCheck } = FiIcons;

const FileUploadZone = ({ onFilesUploaded, isUploading = false, maxFiles = 5 }) => {
  const [uploadProgress, setUploadProgress] = useState({});

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      // Reset progress
      const initialProgress = {};
      acceptedFiles.forEach((file, index) => {
        initialProgress[index] = 0;
      });
      setUploadProgress(initialProgress);

      // Process files with simulated progress
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file, index) => {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setUploadProgress(prev => ({
              ...prev,
              [index]: progress
            }));
          }

          const fileData = await processFile(file);
          return {
            id: Date.now() + index,
            name: file.name,
            size: file.size,
            type: file.type,
            data: fileData,
            uploadedAt: new Date().toISOString()
          };
        })
      );

      onFilesUploaded(processedFiles);
      setUploadProgress({});
    },
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxFiles,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const processFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target.result;
        
        try {
          if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            // Parse CSV
            const lines = result.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const rows = lines.slice(1, 11).map(line => 
              line.split(',').map(cell => cell.trim().replace(/"/g, ''))
            );
            
            resolve({
              type: 'csv',
              headers,
              preview: rows,
              rowCount: lines.length - 1,
              summary: `${headers.length} columns, ${lines.length - 1} rows`
            });
          } else if (file.type.includes('json')) {
            const jsonData = JSON.parse(result);
            const isArray = Array.isArray(jsonData);
            const keys = isArray && jsonData.length > 0 
              ? Object.keys(jsonData[0]) 
              : Object.keys(jsonData);
            
            resolve({
              type: 'json',
              data: isArray ? jsonData.slice(0, 10) : jsonData,
              keys,
              summary: isArray ? `${keys.length} fields, ${jsonData.length} records` : 'JSON object'
            });
          } else if (file.type.includes('excel') || file.name.match(/\.(xlsx|xls)$/)) {
            resolve({
              type: 'excel',
              summary: 'Excel file ready for analysis',
              note: 'Excel files will be processed when you ask questions about the data'
            });
          } else if (file.type === 'application/pdf') {
            resolve({
              type: 'pdf',
              summary: 'PDF document uploaded',
              note: 'PDF content will be extracted for analysis'
            });
          } else {
            resolve({
              type: 'text',
              content: result.slice(0, 1000),
              summary: `Text file, ${result.length} characters`
            });
          }
        } catch (error) {
          reject(new Error(`Failed to parse ${file.name}: ${error.message}`));
        }
      };
      
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const getFileIcon = (file) => {
    if (file.type.includes('csv') || file.name.endsWith('.csv')) return FiBarChart3;
    if (file.type.includes('excel') || file.name.match(/\.(xlsx|xls)$/)) return FiBarChart3;
    if (file.type.includes('json')) return FiFile;
    return FiFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-dark-700'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-xl flex items-center justify-center mx-auto">
            {isUploading ? (
              <LoadingSpinner size="md" />
            ) : (
              <SafeIcon icon={FiUpload} className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isDragActive ? 'Drop your files here' : 'Upload data files'}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              or click to browse • CSV, Excel, JSON, PDF, TXT
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Max {maxFiles} files, 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploading files...
          </h4>
          {acceptedFiles.map((file, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={getFileIcon(file)} className="w-4 h-4 text-primary-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[index] || 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {uploadProgress[index] || 0}%
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
            Some files couldn't be uploaded:
          </h4>
          <div className="space-y-1">
            {fileRejections.map(({ file, errors }, index) => (
              <div key={index} className="text-sm text-red-700 dark:text-red-300">
                <span className="font-medium">{file.name}</span>: {errors[0].message}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Examples */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          💡 What you can upload:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-200">
          <div>• Sales data (CSV/Excel)</div>
          <div>• Customer lists</div>
          <div>• Financial reports</div>
          <div>• Survey responses</div>
          <div>• Marketing data</div>
          <div>• API responses (JSON)</div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;