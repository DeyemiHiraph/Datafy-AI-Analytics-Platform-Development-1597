import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import { generatePythonCode, explainCode } from '../../services/openai';
import { useSubscription } from '../../contexts/SubscriptionContext';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiCode, FiHelpCircle, FiZap, FiDownload, FiBarChart3, FiLock } = FiIcons;

const PythonEditor = ({ context = '', onCodeExecute }) => {
  const [code, setCode] = useState(`# AI-Powered Python Editor
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Your data analysis code here
df = pd.read_csv('data.csv')
print(df.head())`);
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const editorRef = useRef(null);
  const { hasFeatureAccess, canUseFeature, incrementUsage } = useSubscription();

  const hasAccess = hasFeatureAccess('ai_editors');

  // Initialize Pyodide for Python execution
  useEffect(() => {
    const initPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        });
        
        // Install common packages
        await pyodideInstance.loadPackage(['pandas', 'matplotlib', 'numpy']);
        setPyodide(pyodideInstance);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
      }
    };

    if (window.loadPyodide) {
      initPyodide();
    } else {
      // Load Pyodide script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.onload = initPyodide;
      document.head.appendChild(script);
    }
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure Python language features
    monaco.languages.setLanguageConfiguration('python', {
      comments: {
        lineComment: '#',
        blockComment: ['"""', '"""']
      },
      brackets: [['(', ')'], ['[', ']'], ['{', '}']],
      autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: "'", close: "'" },
        { open: '"', close: '"' },
        { open: '"""', close: '"""' }
      ]
    });

    // Add AI completion command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      handleAICompletion();
    });
  };

  const handleAICompletion = async () => {
    if (!hasAccess) {
      alert('AI Python completion requires a Business plan or higher. Please upgrade to continue.');
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
      const completion = await generatePythonCode(textBeforeCursor, context);
      
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
      alert('AI Python generation requires a Business plan or higher. Please upgrade to continue.');
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
      const generatedCode = await generatePythonCode(prompt, context);
      setCode(generatedCode);
      setPrompt('');
      setShowPrompt(false);
    } catch (error) {
      console.error('Code generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const executeCode = async () => {
    if (!pyodide || !code.trim() || isExecuting) return;

    setIsExecuting(true);
    setOutput('');

    try {
      // Redirect stdout to capture print statements
      pyodide.runPython(`
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()
      `);

      // Execute the user code
      pyodide.runPython(code);

      // Get the output
      const output = pyodide.runPython('mystdout.getvalue()');

      // Restore stdout
      pyodide.runPython('sys.stdout = old_stdout');

      setOutput(output || 'Code executed successfully (no output)');

      if (onCodeExecute) {
        onCodeExecute(code, output);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
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
      const explanation = await explainCode(code, 'python');
      setExplanation(explanation);
    } catch (error) {
      console.error('Code explanation failed:', error);
    } finally {
      setIsExplaining(false);
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
          AI Python Editor requires a Business plan or higher.
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
            <SafeIcon icon={FiCode} className="w-5 h-5 text-green-500" />
            <span>AI Python Editor</span>
          </h3>
          {isGenerating && (
            <div className="flex items-center space-x-2 text-green-500">
              <LoadingSpinner size="sm" />
              <span className="text-sm">AI Generating...</span>
            </div>
          )}
          {!pyodide && (
            <div className="flex items-center space-x-2 text-yellow-500">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Loading Python Environment...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
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
            onClick={executeCode}
            disabled={!pyodide || isExecuting}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <SafeIcon icon={FiPlay} className="w-4 h-4" />
            <span>{isExecuting ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* AI Prompt Input */}
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
        >
          <div className="flex space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your data analysis task (e.g., 'Create a bar chart of sales by category')"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && generateFromPrompt()}
            />
            <button
              onClick={generateFromPrompt}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
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
          language="python"
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

      {/* Output */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-green-400 rounded-lg p-4 border border-gray-700"
        >
          <h4 className="font-medium text-green-300 mb-2 flex items-center space-x-2">
            <SafeIcon icon={FiBarChart3} className="w-4 h-4" />
            <span>Output</span>
          </h4>
          <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto max-h-64">
            {output}
          </pre>
        </motion.div>
      )}

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
    </div>
  );
};

export default PythonEditor;