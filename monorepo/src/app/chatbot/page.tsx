'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Sparkles, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const renderMessageContent = (text: string, isUser: boolean) => {
  return text;
};

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your Tokonomy AI AGENT. I can help you with creating coins, researching tokens, and answering questions about the platform. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
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
      // Replace with your actual API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      
      // Handle different response types as in your original code
      if(data.response_type == 'create-coin') {
        console.log(data.data);
        // Handle create coin modal
      }

      if(data.response_type == 'token-research') {
        let tokenAddress = data.data.address;
        let type = data.data.target;
        
        if(type == 'token') {
          window.location.href = `/coin/${tokenAddress}`;
        }
        else if(type == 'creator') {
          window.location.href = `/profile/${tokenAddress}`;
        }
      }

      setTimeout(() => {
        setIsTyping(false);
        if (response.ok) {
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

  const quickActions = [
    { icon: <Sparkles className="h-4 w-4" />, text: "Create a new coin", action: "I want to create a new coin" },
    { icon: <MessageCircle className="h-4 w-4" />, text: "Research a token", action: "Help me research a token" },
    { icon: <Bot className="h-4 w-4" />, text: "How does this work?", action: "How does this platform work?" }
  ];

  const handleQuickAction = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tokobot</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    Online
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Ready to help</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Powered by AI
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-4 max-w-[80%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isUser ? 'bg-gray-200 dark:bg-gray-700' : 'bg-black dark:bg-white'}`}>
                    {msg.isUser ? (
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Bot className="h-5 w-5 text-white dark:text-black" />
                    )}
                  </div>
                  <div className={`rounded-xl p-4 ${msg.isUser ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}>
                    <div className="text-sm leading-relaxed">
                      {renderMessageContent(msg.text, msg.isUser)}
                    </div>
                    <p className={`text-xs mt-2 ${msg.isUser ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-4 max-w-[80%]">
                  <div className="h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white dark:text-black" />
                  </div>
                  <div className="bg-black dark:bg-white text-white dark:text-black rounded-xl p-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm mr-2">Typing</span>
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Quick actions</h3>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 border-gray-200 dark:border-gray-800"
                  >
                    {action.icon}
                    <span>{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                    {input.length > 0 && (
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        Enter to send
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-4 h-11 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-black"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {input.length}/1000
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;