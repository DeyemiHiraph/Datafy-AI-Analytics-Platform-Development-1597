import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import { generateSQLCompletion, explainCode } from '../../services/openai';
import { useSubscription } from '../../contexts/SubscriptionContext';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiCode, FiHelpCircle, FiZap, FiSave, FiDownload, FiLock } = FiIcons;

const SQLEditor = ({ schema = '', onQueryExecute }) => {
  const [code, setCode] = useState('-- Write your SQL query here\nSELECT * FROM users LIMIT 10;');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const editorRef = useRef(null);
  const { hasFeatureAccess, canUseFeature, incrementUsage } = useSubscription();

  const hasAccess = hasFeatureAccess('ai_editors');

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure SQL language features
    monaco.languages.setLanguageConfiguration('sql', {
      comments: {
        lineComment: '--',
        blockComment: ['/*', '*/']
      },
      brackets: [['(', ')']],
      autoClosingPairs: [
        { open: '(', close: ')' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
      ]
    });

    // Add AI completion command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      handleAICompletion();
    });
  };

  const handleAICompletion = async () => {
    if (!hasAccess) {
      alert('AI SQL completion requires a Business plan or higher. Please upgrade to continue.');
      return;
    }

    if (!editorRef.current || isGenerating) return;

    if (!canUseFeature('aiQueries')) {
      alert('AI query limit reached. Please upgrade your plan to continue.');
      return;
    }

    const editor = editorRef.current;
    const position = editor.getPosition();
    const model = editor.getModel();
    const textBeforeCursor = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });

    setIsGenerating(true);
    try {
      await incrementUsage('aiQueries');
      const completion = await generateSQLCompletion(textBeforeCursor, schema);
      
      // Insert the completion at cursor position
      editor.executeEdits('ai-completion', [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: completion
      }]);
    } catch (error) {
      console.error('AI completion failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromPrompt = async () => {
    if (!hasAccess) {
      alert('AI SQL generation requires a Business plan or higher. Please upgrade to continue.');
      return;
    }

    if (!prompt.trim() || isGenerating) return;

    if (!canUseFeature('aiQueries')) {
      alert('AI query limit reached. Please upgrade your plan to continue.');
      return;
    }

    setIsGenerating(true);
    try {
      await incrementUsage('aiQueries');
      const generatedCode = await generateSQLCompletion(prompt, schema);
      setCode(generatedCode);
      setPrompt('');
      setShowPrompt(false);
    } catch (error) {
      console.error('Code generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const explainCurrentCode = async () => {
    if (!hasAccess) {
      alert('AI code explanation requires a Business plan or higher. Please upgrade to continue.');
      return;
    }

    if (!code.trim() || isExplaining) return;

    if (!canUseFeature('aiQueries')) {
      alert('AI query limit reached. Please upgrade your plan to continue.');
      return;
    }

    setIsExplaining(true);
    try {
      await incrementUsage('aiQueries');
      const explanation = await explainCode(code, 'sql');
      setExplanation(explanation);
    } catch (error) {
      console.error('Code explanation failed:', error);
    } finally {
      setIsExplaining(false);
    }
  };

  const executeQuery = () => {
    if (onQueryExecute && code.trim()) {
      onQueryExecute(code);
    }
  };

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiLock} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Upgrade Required
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          AI SQL Editor requires a Business plan or higher.
        </p>
        <button 
          onClick={() => window.location.href = '/pricing'}
          className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <SafeIcon icon={FiCode} className="w-5 h-5 text-blue-500" />
            <span>AI SQL Editor</span>
          </h3>
          {isGenerating && (
            <div className="flex items-center space-x-2 text-blue-500">
              <LoadingSpinner size="sm" />
              <span className="text-sm">AI Generating...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiZap} className="w-4 h-4" />
            <span>AI Generate</span>
          </button>
          <button
            onClick={explainCurrentCode}
            disabled={isExplaining}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiHelpCircle} className="w-4 h-4" />
            <span>Explain</span>
          </button>
          <button
            onClick={executeQuery}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlay} className="w-4 h-4" />
            <span>Execute</span>
          </button>
        </div>
      </div>

      {/* AI Prompt Input */}
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to query (e.g., 'Show top 10 customers by revenue')"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && generateFromPrompt()}
            />
            <button
              onClick={generateFromPrompt}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isGenerating ? <LoadingSpinner size="sm" /> : 'Generate'}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Tip: Press Ctrl+Space in the editor for AI completions
          </p>
        </motion.div>
      )}

      {/* Editor */}
      <div className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
        <Editor
          height="400px"
          language="sql"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            wordBasedSuggestions: true
          }}
        />
      </div>

      {/* Code Explanation */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800"
        >
          <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-2 flex items-center space-x-2">
            <SafeIcon icon={FiHelpCircle} className="w-4 h-4" />
            <span>Code Explanation</span>
          </h4>
          <p className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
            {explanation}
          </p>
        </motion.div>
      )}

      {/* Schema Reference */}
      {schema && (
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Available Schema</h4>
          <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32">
            {schema}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SQLEditor;