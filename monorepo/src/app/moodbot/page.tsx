'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Heart, Smile, Zap, Sun, Moon, Star, Sparkles } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const renderMessageContent = (text: string, isUser: boolean) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = text.split(linkRegex);
  
  return parts.map((part, index) => {
    if (index % 3 === 1) {
      return (
        <a
          key={index}
          href={parts[index + 1]}
          className={`underline hover:opacity-80 ${
            isUser ? 'text-blue-300 hover:text-blue-200' : 'text-yellow-300 hover:text-yellow-200'
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    } else if (index % 3 === 2) {
      return null;
    } else {
      return part;
    }
  });
};

export default function MoodBotPage() {
  const { openCreateCoinModal } = useModal();
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `🎉 Yo! I am MoodBot — your vibing Mood Mint Machine! 🪙✨
        Got a wild story? A random thought? A moment that felt so you? Drop it here, and I will spin it into a shiny token on the Zora Protocol.

        📦 Memories, moods, weird dreams, late-night rants — if you can feel it, I can mint it.
        Let your day live forever on-chain.

        🔥 So go ahead — share your feels, flex your feels, mint your moments.

        `,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  type Mood = 'happy' | 'excited' | 'calm' | 'energetic' | 'creative' | 'peaceful';

  const [currentMood, setCurrentMood] = useState<Mood>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const moodColors: Record<Mood, string> = {
    happy: 'from-yellow-400 via-orange-400 to-pink-500',
    excited: 'from-pink-500 via-purple-500 to-indigo-500',
    calm: 'from-blue-400 via-cyan-400 to-teal-500',
    energetic: 'from-green-400 via-lime-400 to-yellow-500',
    creative: 'from-purple-500 via-pink-500 to-red-500',
    peaceful: 'from-teal-400 via-blue-400 to-indigo-500'
  };

  const moodIcons: Record<Mood, React.ComponentType<any>> = {
    happy: Sun,
    excited: Zap,
    calm: Moon,
    energetic: Star,
    creative: Heart,
    peaceful: Smile
  };

  const floatingElements = ['🌟', '✨', '🌈', '💫', '🎨', '🎭', '🌸', '🦋'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Cycle through moods for dynamic header
    const moodCycle: Mood[] = ['happy', 'excited', 'calm', 'energetic', 'creative', 'peaceful'];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % moodCycle.length;
      setCurrentMood(moodCycle[currentIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      text: input, 
      isUser: true, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);

    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/moodbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      console.log(data);
      
      if(data.response_type == 'create-coin') {
        console.log(data.data);
        openCreateCoinModal(data.data,data['predict-performance'],data['analyze-content']);
      }

      if(data.response_type == 'token-research') {
        let tokenAddress = data.data.address;
        let type = data.data.target;
        console.log(tokenAddress, type);

        if(type == 'token') {
          window.location.href = `/coin/${tokenAddress}`;
        }
        else if(type == 'creator') {
          window.location.href = `/profile/${tokenAddress}`;
        }
      }

      setTimeout(() => {
        setIsTyping(false);
        if (response) {
          const botMessage: Message = { 
            text: data.message, 
            isUser: false, 
            timestamp: new Date() 
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          const errorMessage: Message = { 
            text: `Error: ${data.error}`, 
            isUser: false, 
            timestamp: new Date() 
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        const errorMessage: Message = { 
          text: 'Network error occurred', 
          isUser: false, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMessage]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleGoBack = () => {
    console.log('Going back...');
  };

  const CurrentMoodIcon = moodIcons[currentMood];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 opacity-10 transition-all duration-1000`} />
      
      {/* Floating Elements */}
      {/* {floatingElements.map((element, index) => (
        <div
          key={index}
          className="absolute text-2xl animate-pulse opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {element}
        </div>
      ))} */}

      <div className="relative z-10 min-h-screen flex flex-col backdrop-blur-sm">
        {/* Header */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoBack}
                  className="p-2 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className={`h-12 w-12 bg-gradient-to-r ${moodColors[currentMood]} rounded-full flex items-center justify-center shadow-lg animate-pulse`}>
                    <CurrentMoodIcon className="h-6 w-6 text-white animate-bounce" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900 dark:text-white text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                      MoodBot ✨
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        Vibing Online 🌈
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {(Object.keys(moodIcons) as Mood[]).map((mood) => {
                  const Icon = moodIcons[mood] as React.ElementType;
                  return (
                    <button
                      key={mood}
                      onClick={() => setCurrentMood(mood as Mood)}
                      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                        currentMood === mood
                          ? `bg-gradient-to-r ${moodColors[mood]} shadow-lg`
                          : 'bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${currentMood === mood ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse' 
                        : `bg-gradient-to-r ${moodColors[currentMood]} animate-pulse`
                    }`}>
                      {msg.isUser ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white animate-bounce" />
                      )}
                    </div>
                    <div className={`rounded-2xl p-4 shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                      msg.isUser 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/30' 
                        : `bg-gradient-to-r ${moodColors[currentMood]} text-white border-white/20`
                    }`}>
                      <div className="text-sm max-w-none leading-relaxed font-medium">
                        {renderMessageContent(msg.text, msg.isUser)}
                      </div>
                      <p className="text-xs mt-2 text-white/70">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className={`h-10 w-10 bg-gradient-to-r ${moodColors[currentMood]} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse`}>
                      <Bot className="h-5 w-5 text-white animate-bounce" />
                    </div>
                    <div className={`bg-gradient-to-r ${moodColors[currentMood]} text-white rounded-2xl p-4 shadow-lg backdrop-blur-sm border border-white/20`}>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm mr-2 font-medium">Vibing</span>
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                        <Sparkles className="h-4 w-4 text-white/70 animate-spin ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your mood, story, or vibe... ✨"
                  className="w-full px-4 py-4 border-2 border-gray-300/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm bg-white/80 dark:bg-black/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg backdrop-blur-sm font-medium transition-all duration-300 hover:shadow-xl"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Heart className="h-5 w-5 text-pink-400 animate-pulse" />
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={`bg-gradient-to-r ${moodColors[currentMood]} hover:shadow-xl text-white px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg font-semibold flex items-center space-x-2`}
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Vibe</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}