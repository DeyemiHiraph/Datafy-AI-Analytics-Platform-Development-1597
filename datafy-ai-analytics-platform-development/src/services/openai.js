import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateSQLCompletion = async (prompt, schema = '') => {
  try {
    const systemPrompt = `You are an expert SQL developer. Help users write efficient SQL queries.
    
Available schema:
${schema}

Provide only the SQL code without explanations unless specifically asked.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI SQL completion error:', error);
    throw error;
  }
};

export const generatePythonCode = async (prompt, context = '') => {
  try {
    const systemPrompt = `You are an expert Python developer specializing in data analysis with pandas, matplotlib, and seaborn.
    
Context:
${context}

Generate clean, efficient Python code. Include necessary imports.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Python generation error:', error);
    throw error;
  }
};

export const generatePandasCode = async (prompt, dataDescription = '') => {
  try {
    const systemPrompt = `You are an expert in pandas data manipulation. Generate pandas code for data analysis tasks.
    
Data description:
${dataDescription}

Provide clean pandas code with proper variable names. Assume the main dataframe is called 'df'.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Pandas generation error:', error);
    throw error;
  }
};

export const explainCode = async (code, language = 'sql') => {
  try {
    const systemPrompt = `You are a code explanation expert. Explain the following ${language.toUpperCase()} code in simple terms.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Explain this code:\n\n${code}` }
      ],
      max_tokens: 400,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI code explanation error:', error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');

    const response = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1'
    });

    return response.text;
  } catch (error) {
    console.error('Whisper transcription error:', error);
    throw error;
  }
};

export const analyzeSchema = async (schemaData) => {
  try {
    const systemPrompt = `You are a database schema analysis expert. Analyze the provided schema and generate:
1. Column descriptions and data types
2. Potential relationships between tables
3. Suggested indexes for performance
4. Data quality insights`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this schema:\n${JSON.stringify(schemaData, null, 2)}` }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Schema analysis error:', error);
    throw error;
  }
};