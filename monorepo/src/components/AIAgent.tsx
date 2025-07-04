'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAgentProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  apiEndpoint?: string;
  agentName?: string;
}

const AIAgent: React.FC<AIAgentProps> = ({
  position = 'bottom-right',
  apiEndpoint = '/api/chat',
  agentName = 'AI Assistant'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hi! I'm your ${agentName}. How can I help you today?`,
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
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50';
    switch (position) {
      case 'bottom-right':
        return `${baseClasses} bottom-15 right-6`;
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-6`;
      case 'top-right':
        return `${baseClasses} top-6 right-6`;
      case 'top-left':
        return `${baseClasses} top-6 left-6`;
      default:
        return `${baseClasses} bottom-6 right-6`;
    }
  };

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
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      
      setTimeout(() => {
        setIsTyping(false);
        if (response.ok) {
          const botMessage: Message = { 
            text: data.response, 
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatText = (text: string) => {
    // Basic markdown-like formatting
    let formatted = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italics
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br/>');

    return { __html: formatted };
  };

  const renderCodeBlock = (code: string) => {
    return (
      <div className="relative my-2">
        <button 
          onClick={() => navigator.clipboard.writeText(code)}
          className="absolute right-2 top-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
        >
          Copy
        </button>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const renderMessageContent = (text: string, isUser: boolean) => {
    if (isUser) {
      return text;
    }

    // Check for code blocks first
    const codeBlockMatch = text.match(/```[\s\S]*?```/);
    if (codeBlockMatch) {
      const codeContent = codeBlockMatch[0].replace(/```/g, '').trim();
      return (
        <>
          <div dangerouslySetInnerHTML={formatText(text.replace(/```[\s\S]*?```/, ''))} />
          {renderCodeBlock(codeContent)}
        </>
      );
    }

    return <div dangerouslySetInnerHTML={formatText(text)} />;
  };

  if (!isOpen) {
    return (
      <div className={getPositionClasses()}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg transition-all duration-300 hover:scale-105"
          size="icon"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
    );
  }

  return (
    <div className={getPositionClasses()}>
      <Card className={`w-[500px] ${isMinimized ? 'h-[90px]' : 'h-[600px]'} bg-white border-gray-200 shadow-2xl transition-all duration-300 ${isMinimized ? 'overflow-hidden' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{agentName}</h3>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Online
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-9 w-9 p-0 hover:bg-gray-200"
            >
              {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 p-0 hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[450px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isUser ? 'bg-gray-200' : 'bg-black'}`}>
                      {msg.isUser ? (
                        <User className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-4 ${msg.isUser ? 'bg-gray-100 text-gray-900' : 'bg-black text-white'}`}>
                      <div className="text-sm max-w-none">
                        {renderMessageContent(msg.text, msg.isUser)}
                      </div>
                      <p className={`text-xs mt-2 ${msg.isUser ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-black text-white rounded-lg p-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm mr-2">Typing</span>
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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

            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white px-5 h-11"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIAgent;