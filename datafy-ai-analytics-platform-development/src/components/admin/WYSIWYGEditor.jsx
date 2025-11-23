import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBold, FiItalic, FiList, FiLink, FiImage } = FiIcons;

// Simple WYSIWYG Editor without external dependencies
const WYSIWYGEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
  const handleContentChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const insertFormat = (format) => {
    const textarea = document.querySelector('.wysiwyg-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    switch (format) {
      case 'bold':
        newText = `${beforeText}**${selectedText || 'bold text'}**${afterText}`;
        break;
      case 'italic':
        newText = `${beforeText}_${selectedText || 'italic text'}_${afterText}`;
        break;
      case 'heading':
        newText = `${beforeText}## ${selectedText || 'heading'}${afterText}`;
        break;
      case 'list':
        newText = `${beforeText}\n- ${selectedText || 'list item'}${afterText}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newText = `${beforeText}[${selectedText || 'link text'}](${url})${afterText}`;
        } else {
          return;
        }
        break;
      case 'image':
        const imgUrl = prompt('Enter image URL:');
        if (imgUrl) {
          newText = `${beforeText}![${selectedText || 'image'}](${imgUrl})${afterText}`;
        } else {
          return;
        }
        break;
      default:
        return;
    }

    if (onChange) {
      onChange(newText);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-dark-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-dark-700 p-3 flex flex-wrap gap-2 bg-gray-50 dark:bg-dark-700">
        <button
          type="button"
          onClick={() => insertFormat('bold')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
          title="Bold"
        >
          <SafeIcon icon={FiBold} className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertFormat('italic')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
          title="Italic"
        >
          <SafeIcon icon={FiItalic} className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-dark-600 mx-1" />

        <button
          type="button"
          onClick={() => insertFormat('heading')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
          title="Heading"
        >
          <span className="text-sm font-bold">H</span>
        </button>

        <button
          type="button"
          onClick={() => insertFormat('list')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
          title="List"
        >
          <SafeIcon icon={FiList} className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-dark-600 mx-1" />

        <button
          type="button"
          onClick={() => insertFormat('link')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
          title="Link"
        >
          <SafeIcon icon={FiLink} className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormat('image')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
          title="Image"
        >
          <SafeIcon icon={FiImage} className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
        <textarea
          className="wysiwyg-textarea w-full h-full min-h-[300px] p-4 border-none outline-none resize-none bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          value={content || ''}
          onChange={handleContentChange}
          placeholder={placeholder}
        />
      </div>

      {/* Preview */}
      {content && (
        <div className="border-t border-gray-200 dark:border-dark-700 p-4 bg-gray-50 dark:bg-dark-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
          <div 
            className="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={{
              __html: content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/_(.*?)_/g, '<em>$1</em>')
                .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
                .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
                .replace(/\n/g, '<br>')
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WYSIWYGEditor;