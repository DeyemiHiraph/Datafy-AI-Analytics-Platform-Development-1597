import OpenAI from 'openai';

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Validate API key on initialization
if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error('❌ OpenAI API key is missing! Please add VITE_OPENAI_API_KEY to your .env file');
} else if (import.meta.env.VITE_OPENAI_API_KEY.startsWith('sk-')) {
  console.log('✅ OpenAI API key loaded successfully');
} else {
  console.warn('⚠️ OpenAI API key format might be incorrect');
}

const SYSTEM_PROMPT = `You are an expert AI data analyst. Your role is to analyze data and provide clear, actionable business insights.

IMPORTANT GUIDELINES:
1. Always respond in plain English, no code or technical jargon
2. Structure your responses with clear headings and bullet points
3. Focus on business value and actionable recommendations
4. If you see patterns, explain what they mean for the business
5. Always be specific with numbers and percentages when possible

When analyzing data, always include:
- Key findings (3-5 main insights)
- What this means for the business
- Specific recommendations
- Any concerning trends or opportunities

Format your response like this:
🔍 **KEY FINDINGS:**
• [Main insight with specific numbers]
• [Another key finding]
• [Third insight]

📊 **BUSINESS IMPACT:**
[Explain what these findings mean for the business]

💡 **RECOMMENDATIONS:**
• [Specific actionable recommendation]
• [Another recommendation]
• [Third recommendation]

⚠️ **AREAS OF CONCERN:**
[Any issues or risks identified]

🎯 **OPPORTUNITIES:**
[Growth opportunities or positive trends]

If the user asks for visualizations, suggest specific chart types that would be most helpful.
Always end with a question to encourage further analysis.`;

export const analyzeDataWithAI = async (userQuestion, dataContext, fileData = null) => {
  try {
    // Check if API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // Add data context if available
    if (dataContext || fileData) {
      const contextMessage = buildDataContext(dataContext, fileData);
      messages.push({ role: "system", content: contextMessage });
    }

    // Add user question
    messages.push({ role: "user", content: userQuestion });

    console.log('🔄 Sending request to OpenAI...', {
      model: "gpt-3.5-turbo",
      messageCount: messages.length,
      userQuestion: userQuestion.substring(0, 100)
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 1500,
      temperature: 0.3,
      functions: [
        {
          name: "generate_visualization",
          description: "Generate a data visualization based on the analysis",
          parameters: {
            type: "object",
            properties: {
              chartType: {
                type: "string",
                enum: ["bar", "line", "pie", "scatter"],
                description: "Type of chart to create"
              },
              data: {
                type: "array",
                description: "Data points for the visualization",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    value: { type: "number" }
                  }
                }
              },
              title: {
                type: "string",
                description: "Chart title"
              },
              xLabel: {
                type: "string",
                description: "X-axis label"
              },
              yLabel: {
                type: "string",
                description: "Y-axis label"
              }
            },
            required: ["chartType", "data", "title"]
          }
        },
        {
          name: "create_report",
          description: "Generate a comprehensive data analysis report",
          parameters: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Report title"
              },
              summary: {
                type: "string",
                description: "Executive summary"
              },
              keyFindings: {
                type: "array",
                items: { type: "string" },
                description: "List of key findings"
              },
              recommendations: {
                type: "array",
                items: { type: "string" },
                description: "Business recommendations"
              },
              metrics: {
                type: "object",
                description: "Key performance metrics"
              }
            },
            required: ["title", "summary", "keyFindings", "recommendations"]
          }
        }
      ],
      function_call: "auto"
    });

    console.log('✅ OpenAI response received:', {
      model: response.model,
      usage: response.usage,
      hasFunction: !!response.choices[0].message.function_call
    });

    const result = response.choices[0];
    
    // Check if a function was called
    if (result.message.function_call) {
      console.log('🎯 Function called:', result.message.function_call.name);
      return {
        type: 'function_call',
        function: result.message.function_call.name,
        arguments: JSON.parse(result.message.function_call.arguments),
        message: result.message.content || "I've generated additional insights for you."
      };
    }

    return {
      type: 'response',
      message: result.message.content,
      usage: response.usage
    };

  } catch (error) {
    console.error('❌ AI Analysis Error:', error);
    
    // Provide specific error messages for common issues
    if (error.message.includes('API key')) {
      return {
        type: 'error',
        message: '🔑 **API Key Issue**: Your OpenAI API key seems to be invalid or missing. Please check your configuration.',
        error: error.message
      };
    } else if (error.message.includes('quota') || error.message.includes('billing')) {
      return {
        type: 'error',
        message: '💳 **Quota Exceeded**: Your OpenAI API usage has exceeded the current quota. Please check your OpenAI account billing.',
        error: error.message
      };
    } else if (error.message.includes('rate limit')) {
      return {
        type: 'error',
        message: '⏱️ **Rate Limited**: Too many requests sent too quickly. Please wait a moment and try again.',
        error: error.message
      };
    } else if (error.message.includes('model')) {
      return {
        type: 'error',
        message: '🤖 **Model Error**: There was an issue with the AI model. Please try again in a moment.',
        error: error.message
      };
    }
    
    return {
      type: 'error',
      message: `❌ **Analysis Failed**: I encountered an issue analyzing your data. Error: ${error.message}. Please try rephrasing your question or check your data format.`,
      error: error.message
    };
  }
};

const buildDataContext = (dataContext, fileData) => {
  let context = "AVAILABLE DATA:\n\n";
  
  if (fileData && fileData.length > 0) {
    fileData.forEach((file, index) => {
      context += `📁 **File ${index + 1}: ${file.name}**\n`;
      
      if (file.data?.type === 'csv' && file.data.headers) {
        context += `📊 Type: CSV Dataset\n`;
        context += `📋 Columns (${file.data.headers.length}): ${file.data.headers.join(', ')}\n`;
        context += `📈 Total Rows: ${file.data.rowCount || 'Unknown'}\n`;
        
        if (file.data.preview && file.data.preview.length > 0) {
          context += `🔍 Sample Data:\n`;
          // Add headers
          context += `   ${file.data.headers.slice(0, 5).join(' | ')}\n`;
          // Add sample rows
          file.data.preview.slice(0, 3).forEach((row, i) => {
            context += `   ${row.slice(0, 5).join(' | ')}\n`;
          });
          context += `   ... (showing first 3 rows)\n`;
        }
      } else if (file.data?.type === 'json' && file.data.keys) {
        context += `📊 Type: JSON Data\n`;
        context += `🏷️ Fields (${file.data.keys.length}): ${file.data.keys.join(', ')}\n`;
        context += `📊 Summary: ${file.data.summary || 'Multiple records'}\n`;
      } else if (file.data?.type === 'excel') {
        context += `📊 Type: Excel Spreadsheet\n`;
        context += `✅ Status: Ready for analysis\n`;
      } else {
        context += `📄 Type: ${file.data?.type || 'Unknown'}\n`;
        context += `📝 Summary: ${file.data?.summary || 'Data file uploaded'}\n`;
      }
      context += '\n';
    });
  }

  if (dataContext) {
    context += `📝 **Additional Context:**\n${dataContext}\n\n`;
  }

  context += `🎯 **Analysis Instructions:**
- Focus on business insights and actionable recommendations
- Use specific numbers and percentages when possible
- Identify trends, patterns, and outliers
- Suggest areas for improvement or growth opportunities
- Highlight any concerning patterns or risks\n`;

  return context;
};

export const generateDataSummary = async (fileData) => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured.');
    }

    const contextMessage = buildDataContext(null, fileData);
    
    console.log('🔄 Generating data summary...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: contextMessage },
        { 
          role: "user", 
          content: "Please provide a comprehensive summary of this dataset. Include key statistics, data quality insights, and suggest 3-5 important questions I should ask about this data to get valuable business insights." 
        }
      ],
      max_tokens: 1200,
      temperature: 0.3
    });

    console.log('✅ Data summary generated successfully');

    return {
      type: 'summary',
      message: response.choices[0].message.content,
      usage: response.usage
    };

  } catch (error) {
    console.error('❌ Data Summary Error:', error);
    return {
      type: 'error',
      message: 'Failed to generate data summary. Please try again.',
      error: error.message
    };
  }
};

export const suggestQuestions = (fileData) => {
  const suggestions = [];
  
  if (fileData && fileData.length > 0) {
    fileData.forEach(file => {
      if (file.data?.type === 'csv' && file.data.headers) {
        const headers = file.data.headers.map(h => h.toLowerCase());
        
        // Generate context-aware suggestions based on column names
        if (headers.some(h => h.includes('sales') || h.includes('revenue') || h.includes('price') || h.includes('amount'))) {
          suggestions.push(
            `What are the top performing products by sales?`,
            `Show me sales trends over time`,
            `Which categories generate the most revenue?`,
            `What's the average order value trends?`
          );
        }
        
        if (headers.some(h => h.includes('customer') || h.includes('user') || h.includes('client'))) {
          suggestions.push(
            `Analyze customer behavior patterns`,
            `What's the customer retention rate?`,
            `Which customer segments are most valuable?`,
            `Show me customer acquisition trends`
          );
        }
        
        if (headers.some(h => h.includes('date') || h.includes('time') || h.includes('month') || h.includes('year'))) {
          suggestions.push(
            `Show me trends over time`,
            `What are the seasonal patterns?`,
            `Forecast next quarter's performance`,
            `Identify peak and low periods`
          );
        }
        
        if (headers.some(h => h.includes('category') || h.includes('type') || h.includes('segment'))) {
          suggestions.push(
            `Compare performance by category`,
            `Which categories are growing fastest?`,
            `Show me category distribution`,
            `Identify underperforming segments`
          );
        }

        if (headers.some(h => h.includes('region') || h.includes('location') || h.includes('city') || h.includes('country'))) {
          suggestions.push(
            `Analyze performance by region`,
            `Which locations are most profitable?`,
            `Show me geographical distribution`,
            `Identify expansion opportunities`
          );
        }
      }
    });
  }
  
  // Default suggestions if no specific patterns found
  if (suggestions.length === 0) {
    suggestions.push(
      `Summarize the key insights from this data`,
      `What are the most important trends?`,
      `Show me the top performers`,
      `What opportunities do you see?`,
      `Identify any concerning patterns`,
      `Create a comprehensive analysis report`
    );
  }
  
  // Remove duplicates and limit to 6 suggestions
  return [...new Set(suggestions)].slice(0, 6);
};

// Test API connection
export const testOpenAIConnection = async () => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API key not found in environment variables');
      return false;
    }

    console.log('🔄 Testing OpenAI connection...');

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5
    });

    console.log('✅ OpenAI API connection successful:', {
      model: response.model,
      usage: response.usage
    });
    return true;
  } catch (error) {
    console.error('❌ OpenAI API connection failed:', error);
    return false;
  }
};