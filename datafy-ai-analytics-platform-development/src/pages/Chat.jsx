import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useDropzone } from 'react-dropzone';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DataVisualization from '../components/chat/DataVisualization';
import ReportPreview from '../components/chat/ReportPreview';
import * as FiIcons from 'react-icons/fi';

const {
  FiSend,
  FiUser,
  FiBot,
  FiBarChart3,
  FiDownload,
  FiCopy,
  FiUpload,
  FiFile,
  FiX,
  FiPaperclip,
  FiShare2,
  FiTrendingUp,
  FiAlertCircle
} = FiIcons;

const Chat = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {
    chatHistory,
    sendChatMessage,
    suggestedQuestions,
    uploadedFiles,
    addUploadedFile,
    removeUploadedFile
  } = useData();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      
      setIsUploading(true);
      try {
        const processedFiles = await Promise.all(
          acceptedFiles.map(async (file) => {
            const fileData = await processFile(file);
            const processedFile = {
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              data: fileData,
              uploadedAt: new Date().toISOString()
            };
            
            // Add to context
            await addUploadedFile(processedFile);
            return processedFile;
          })
        );

        // Auto-suggest based on uploaded files
        if (processedFiles.length > 0) {
          const fileName = processedFiles[0].name;
          setMessage(`I've uploaded ${fileName}. Please analyze this data and provide key insights.`);
        }
      } catch (error) {
        console.error('Error processing files:', error);
      } finally {
        setIsUploading(false);
      }
    },
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
      'text/plain': ['.txt']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024
  });

  const processFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        
        try {
          if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
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
            const keys = isArray && jsonData.length > 0 ? Object.keys(jsonData[0]) : Object.keys(jsonData);
            
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
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');

    try {
      await sendChatMessage(userMessage, {
        files: uploadedFiles.map(f => ({
          name: f.name,
          type: f.data?.type,
          summary: f.data?.summary
        }))
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSuggestedQuestion = async (question) => {
    setMessage(question);
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const copyResponse = (text) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const shareReport = (report) => {
    if (report?.shareableLink) {
      navigator.clipboard.writeText(report.shareableLink);
      // Could add toast notification here
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type?.includes('csv') || file.name?.endsWith('.csv')) return FiBarChart3;
    if (file.type?.includes('json')) return FiFile;
    if (file.type?.includes('excel') || file.name?.endsWith('.xlsx')) return FiBarChart3;
    return FiFile;
  };

  const isTyping = chatHistory.some(msg => msg.type === 'typing');

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-dark-900">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiBot} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Data Analyst</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload data and ask questions in plain English
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>AI Analytics Engine Active</span>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Data Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Upload your data files and start asking questions. I'll provide insights, create visualizations, and generate comprehensive reports automatically.
            </p>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`max-w-md mx-auto mb-6 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
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
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {isDragActive ? 'Drop your files here' : 'Upload data files to start'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    CSV, Excel, JSON • Max 10MB per file
                  </p>
                </div>
              </div>
            </div>

            {/* Example Questions */}
            <div className="max-w-2xl mx-auto">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Example questions:
              </h4>
              <div className="grid gap-2">
                {[
                  'What are the key trends in my sales data?',
                  'Which customer segments are most profitable?',
                  'Show me a forecast for next quarter',
                  'Create a comprehensive analysis report',
                  'What correlations exist in my dataset?'
                ].map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setMessage(question)}
                    className="text-left p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {chatHistory.map((chat, index) => (
              <AnimatePresence key={chat.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4"
                >
                  {/* User Message */}
                  {chat.type === 'user' && (
                    <div className="flex justify-end">
                      <div className="flex items-start space-x-3 max-w-2xl">
                        <div className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white p-4 rounded-2xl rounded-tr-md">
                          <p className="text-sm">{chat.message}</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 dark:bg-dark-600 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {chat.type === 'typing' && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiBot} className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-4 rounded-2xl rounded-tl-md">
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Analyzing your data...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Response */}
                  {chat.type === 'ai' && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-4xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <SafeIcon icon={FiBot} className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-4 rounded-2xl rounded-tl-md flex-1">
                          {/* AI Response Text */}
                          <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                            <div className={`whitespace-pre-wrap text-sm ${chat.error ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                              {chat.error && <SafeIcon icon={FiAlertCircle} className="w-4 h-4 inline mr-2" />}
                              {chat.response}
                            </div>
                          </div>

                          {/* Visualization */}
                          {chat.visualization && (
                            <DataVisualization data={chat.visualization} />
                          )}

                          {/* Generated Report Preview */}
                          {chat.generatedReport && (
                            <ReportPreview
                              report={chat.generatedReport}
                              onShare={() => shareReport(chat.generatedReport)}
                            />
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-dark-700">
                            <button
                              onClick={() => copyResponse(chat.response)}
                              className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                            >
                              <SafeIcon icon={FiCopy} className="w-3 h-3" />
                              <span>Copy</span>
                            </button>
                            {chat.generatedReport && (
                              <button
                                onClick={() => shareReport(chat.generatedReport)}
                                className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                              >
                                <SafeIcon icon={FiShare2} className="w-3 h-3" />
                                <span>Share Report</span>
                              </button>
                            )}
                            <button className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200">
                              <SafeIcon icon={FiDownload} className="w-3 h-3" />
                              <span>Export</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
              📊 Analyzing {uploadedFiles.length} file(s)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-2 bg-white dark:bg-dark-800 border border-blue-200 dark:border-blue-700 rounded-lg p-2 text-sm"
              >
                <SafeIcon icon={getFileIcon(file)} className="w-4 h-4 text-primary-500" />
                <span className="text-gray-900 dark:text-white truncate max-w-32">{file.name}</span>
                <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                <button
                  onClick={() => removeUploadedFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-dark-700 border-t border-gray-200 dark:border-dark-600 p-4"
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            💡 Suggested questions for your data:
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 4).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 p-6"
      >
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question about your data or upload files..."
                className="w-full p-4 pr-12 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors duration-200"
                rows={1}
                style={{ minHeight: '52px', maxHeight: '120px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div
                {...getRootProps()}
                className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors duration-200"
              >
                <input {...getInputProps()} />
                <SafeIcon icon={FiPaperclip} className="w-4 h-4" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={FiSend} className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </p>
          {uploadedFiles.length > 0 && (
            <p className="text-xs text-primary-600 dark:text-primary-400">
              Ready to analyze {uploadedFiles.length} file(s)
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;