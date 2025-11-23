import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { analyzeDataWithAI, generateDataSummary, suggestQuestions } from '../services/dataAnalytics';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialState = {
  dataSources: [],
  reports: [],
  chatHistory: [],
  insights: [],
  uploadedFiles: [],
  currentAnalysis: null,
  suggestedQuestions: [],
  loading: false,
  error: null,
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DATA_SOURCES':
      return { ...state, dataSources: action.payload, loading: false };
    case 'ADD_DATA_SOURCE':
      return { ...state, dataSources: [...state.dataSources, action.payload] };
    case 'SET_REPORTS':
      return { ...state, reports: action.payload, loading: false };
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] };
    case 'SET_CHAT_HISTORY':
      return { ...state, chatHistory: action.payload, loading: false };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'REMOVE_TYPING_MESSAGE':
      return { 
        ...state, 
        chatHistory: state.chatHistory.filter(msg => msg.type !== 'typing') 
      };
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload, loading: false };
    case 'ADD_UPLOADED_FILE':
      const newSuggestions = suggestQuestions([...state.uploadedFiles, action.payload]);
      return { 
        ...state, 
        uploadedFiles: [...state.uploadedFiles, action.payload],
        suggestedQuestions: newSuggestions
      };
    case 'REMOVE_UPLOADED_FILE':
      const updatedFiles = state.uploadedFiles.filter(file => file.id !== action.payload);
      return {
        ...state,
        uploadedFiles: updatedFiles,
        suggestedQuestions: suggestQuestions(updatedFiles)
      };
    case 'CLEAR_UPLOADED_FILES':
      return { ...state, uploadedFiles: [], suggestedQuestions: [] };
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload };
    case 'SET_SUGGESTED_QUESTIONS':
      return { ...state, suggestedQuestions: action.payload };
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { user } = useAuth();

  // Mock data for MVP demonstration
  useEffect(() => {
    if (user) {
      dispatch({ type: 'SET_LOADING', payload: true });
      setTimeout(() => {
        // Mock data sources
        dispatch({
          type: 'SET_DATA_SOURCES',
          payload: [
            {
              id: '1',
              name: 'Sales Data 2024',
              type: 'CSV',
              size: '2.5 MB',
              status: 'active',
              created_at: new Date().toISOString(),
              records: 15420,
            },
            {
              id: '2',
              name: 'Customer Database',
              type: 'PostgreSQL',
              size: '45.2 MB',
              status: 'active',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              records: 8760,
            },
            {
              id: '3',
              name: 'Marketing Campaigns',
              type: 'Excel',
              size: '1.8 MB',
              status: 'processing',
              created_at: new Date(Date.now() - 172800000).toISOString(),
              records: 2340,
            },
          ],
        });

        // Mock reports
        dispatch({
          type: 'SET_REPORTS',
          payload: [
            {
              id: '1',
              title: 'Q1 Sales Performance Analysis',
              type: 'Executive Summary',
              created_at: new Date().toISOString(),
              status: 'completed',
              insights: 12,
              summary: 'Sales increased by 23% compared to Q4 2023, with strong performance in technology and services sectors.',
              keyFindings: [
                'Technology products drove 40% of total revenue growth',
                'Customer acquisition cost decreased by 15%',
                'Average deal size increased by 28%'
              ],
              shareableLink: `${window.location.origin}/reports/shared/q1-sales-2024`,
            },
            {
              id: '2',
              title: 'Customer Segmentation Analysis',
              type: 'Predictive Analytics',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              status: 'completed',
              insights: 8,
              summary: 'Identified three distinct customer segments with varying lifetime values and behaviors.',
              keyFindings: [
                'Premium segment represents 20% of customers but 60% of revenue',
                'Mid-tier customers have highest retention rate at 94%',
                'Entry-level segment shows strong upsell potential'
              ],
              shareableLink: `${window.location.origin}/reports/shared/customer-segments-2024`,
            }
          ],
        });

        // Mock insights
        dispatch({
          type: 'SET_INSIGHTS',
          payload: [
            {
              id: '1',
              title: 'Revenue Growth Acceleration',
              description: 'Sales increased by 23% month-over-month',
              type: 'positive',
              confidence: 0.95,
            },
            {
              id: '2',
              title: 'Customer Acquisition Cost Rising',
              description: 'CAC increased by 12% in the last 30 days',
              type: 'warning',
              confidence: 0.87,
            },
            {
              id: '3',
              title: 'High-Value Customer Segment Identified',
              description: 'Premium customers contribute 45% of total revenue',
              type: 'insight',
              confidence: 0.92,
            },
          ],
        });
      }, 1000);
    } else {
      dispatch({ type: 'CLEAR_DATA' });
    }
  }, [user]);

  const sendChatMessage = async (message, options = {}) => {
    console.log('🔄 Starting chat message analysis...', { message, options });

    const userMessage = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toISOString(),
      type: 'user',
      files: options.files || []
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

    // Show typing indicator
    const typingMessage = {
      id: (Date.now() + 1).toString(),
      type: 'typing',
      timestamp: new Date().toISOString()
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: typingMessage });

    try {
      console.log('📊 Analyzing with AI...', {
        message,
        fileCount: state.uploadedFiles.length,
        context: options.context
      });

      // Use AI to analyze the data and question
      const aiResult = await analyzeDataWithAI(
        message,
        options.context || '',
        state.uploadedFiles
      );

      console.log('✅ AI analysis completed:', aiResult);

      // Remove typing indicator
      dispatch({ type: 'REMOVE_TYPING_MESSAGE' });

      let aiMessage = {
        id: (Date.now() + 2).toString(),
        message: message,
        response: aiResult.message,
        timestamp: new Date().toISOString(),
        type: 'ai',
        analysis: aiResult
      };

      // Handle function calls (visualizations, reports)
      if (aiResult.type === 'function_call') {
        if (aiResult.function === 'create_report') {
          // Auto-generate report
          const newReport = await generateReport(aiResult.arguments);
          aiMessage.generatedReport = newReport;
          aiMessage.response += `\n\n📊 **I've generated a comprehensive report for you!** You can view it in your Reports section or share it using the link provided.`;
        } else if (aiResult.function === 'generate_visualization') {
          aiMessage.visualization = aiResult.arguments;
          aiMessage.response += `\n\n📈 **Visualization created!** See the chart above for a visual representation of your data.`;
        }
      }

      // Handle error responses
      if (aiResult.type === 'error') {
        aiMessage.error = true;
        aiMessage.response = aiResult.message;
      }

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });

      // Update current analysis
      dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: aiResult });

      return aiMessage;

    } catch (error) {
      console.error('❌ Chat message error:', error);
      
      // Remove typing indicator
      dispatch({ type: 'REMOVE_TYPING_MESSAGE' });

      const errorMessage = {
        id: (Date.now() + 2).toString(),
        message: message,
        response: `❌ **Analysis Failed**: I encountered an issue analyzing your data. ${error.message || 'Please try rephrasing your question or ensure your data is properly formatted.'}`,
        timestamp: new Date().toISOString(),
        type: 'ai',
        error: true
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage });
      return errorMessage;
    }
  };

  const generateReport = async (reportData) => {
    const newReport = {
      id: Date.now().toString(),
      title: reportData.title || 'AI-Generated Data Analysis Report',
      type: 'AI Analysis',
      created_at: new Date().toISOString(),
      status: 'completed',
      insights: reportData.keyFindings?.length || 0,
      summary: reportData.summary || 'Comprehensive analysis of uploaded data',
      keyFindings: reportData.keyFindings || [],
      recommendations: reportData.recommendations || [],
      metrics: reportData.metrics || {},
      shareableLink: `${window.location.origin}/reports/shared/${Date.now()}`,
      aiGenerated: true
    };

    dispatch({ type: 'ADD_REPORT', payload: newReport });
    return newReport;
  };

  const generateDataSummaryForFiles = async (files) => {
    try {
      console.log('📋 Generating data summary for files...', files);
      const summary = await generateDataSummary(files);
      
      const summaryMessage = {
        id: Date.now().toString(),
        message: 'Auto-generated data summary',
        response: summary.message,
        timestamp: new Date().toISOString(),
        type: 'ai',
        autoGenerated: true
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: summaryMessage });
      return summary;
    } catch (error) {
      console.error('❌ Error generating data summary:', error);
      return null;
    }
  };

  const addUploadedFile = async (file) => {
    console.log('📁 Adding uploaded file:', file.name);
    dispatch({ type: 'ADD_UPLOADED_FILE', payload: file });

    // Auto-generate summary for the uploaded file
    setTimeout(() => {
      generateDataSummaryForFiles([file]);
    }, 1000);
  };

  const removeUploadedFile = (fileId) => {
    console.log('🗑️ Removing uploaded file:', fileId);
    dispatch({ type: 'REMOVE_UPLOADED_FILE', payload: fileId });
  };

  const clearUploadedFiles = () => {
    console.log('🗑️ Clearing all uploaded files');
    dispatch({ type: 'CLEAR_UPLOADED_FILES' });
  };

  const shareReport = async (reportId, shareType = 'link') => {
    const report = state.reports.find(r => r.id === reportId);
    if (!report) return null;

    switch (shareType) {
      case 'link':
        return report.shareableLink;
      case 'image':
        // Generate image URL (would be implemented with canvas/html2canvas)
        return `${window.location.origin}/reports/export/${reportId}.png`;
      case 'powerpoint':
        // Generate PowerPoint download link
        return `${window.location.origin}/reports/export/${reportId}.pptx`;
      default:
        return report.shareableLink;
    }
  };

  const value = {
    ...state,
    sendChatMessage,
    generateReport,
    addUploadedFile,
    removeUploadedFile,
    clearUploadedFiles,
    shareReport,
    generateDataSummaryForFiles
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};