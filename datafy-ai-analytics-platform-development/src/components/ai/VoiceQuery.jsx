import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import { transcribeAudio } from '../../services/openai';
import { useSubscription } from '../../contexts/SubscriptionContext';
import * as FiIcons from 'react-icons/fi';

const { FiMic, FiMicOff, FiPlay, FiStop, FiSend, FiLock } = FiIcons;

const VoiceQuery = ({ onTranscription, onVoiceQuery }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const { hasFeatureAccess, canUseFeature, incrementUsage } = useSubscription();

  const hasAccess = hasFeatureAccess('voice_queries');

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (!hasAccess) {
      alert('Voice queries require a Business plan or higher. Please upgrade to continue.');
      return;
    }

    if (!canUseFeature('aiQueries')) {
      alert('AI query limit reached. Please upgrade your plan to continue.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Transcribe audio
        await transcribeAudioBlob(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const transcribeAudioBlob = async (audioBlob) => {
    setIsProcessing(true);
    try {
      await incrementUsage('aiQueries');
      // Convert webm to wav for better compatibility
      const wavBlob = await convertToWav(audioBlob);
      const text = await transcribeAudio(wavBlob);
      setTranscription(text);
      
      if (onTranscription) {
        onTranscription(text);
      }
    } catch (error) {
      console.error('Transcription failed:', error);
      setTranscription('Transcription failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToWav = async (webmBlob) => {
    // Simple conversion - in production, use a proper audio conversion library
    return webmBlob;
  };

  const submitVoiceQuery = () => {
    if (transcription && onVoiceQuery) {
      onVoiceQuery(transcription);
      setTranscription('');
      setAudioURL('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiLock} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Upgrade Required
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Voice queries require a Business plan or higher.
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
      {/* Voice Recording Interface */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiMic} className="w-5 h-5 text-blue-500" />
          <span>Voice Query</span>
        </h3>

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            } disabled:opacity-50`}
          >
            <SafeIcon 
              icon={isRecording ? FiStop : FiMic} 
              className="w-8 h-8 text-white" 
            />
          </button>
          
          {isRecording && (
            <div className="text-center">
              <div className="text-2xl font-mono text-gray-900 dark:text-white">
                {formatTime(recordingTime)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Recording...
              </div>
            </div>
          )}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <LoadingSpinner size="md" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Processing audio...
            </p>
          </motion.div>
        )}

        {/* Audio Playback */}
        {audioURL && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <audio controls className="w-full">
              <source src={audioURL} type="audio/webm" />
              Your browser does not support audio playback.
            </audio>
          </motion.div>
        )}

        {/* Transcription Result */}
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                Transcription:
              </h4>
              <p className="text-blue-800 dark:text-blue-200">
                {transcription}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={submitVoiceQuery}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <SafeIcon icon={FiSend} className="w-4 h-4" />
                <span>Send Query</span>
              </button>
              <button
                onClick={() => {
                  setTranscription('');
                  setAudioURL('');
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            How to use Voice Query:
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Click the microphone button to start recording</li>
            <li>• Speak your query clearly (e.g., "Show me sales data for Q2")</li>
            <li>• Click stop when finished</li>
            <li>• Review the transcription and send your query</li>
          </ul>
        </div>
      </div>

      {/* Quick Voice Commands */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Example Voice Commands:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Show me revenue for the last quarter",
            "Create a chart of sales by product category",
            "What are the top 10 customers by revenue?",
            "Compare this month's performance to last month",
            "Show me the customer churn rate trends",
            "Generate a report for the marketing team"
          ].map((command, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg text-sm text-gray-600 dark:text-gray-300"
            >
              "{command}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceQuery;