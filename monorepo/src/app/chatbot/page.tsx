'use client';
import { useState } from 'react';
import { NextPage } from 'next';

interface Message {
  text: string;
  isUser: boolean;
}

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
        
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
            
      if (response.ok) {
        const botMessage: Message = { text: data.response, isUser: false };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: Message = { text: `Error: ${data.error}`, isUser: false };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { text: 'Network error occurred', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black border-b border-gray-700 p-6 rounded-t-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Tokebot
          </h1>
          <p className="text-center text-gray-400 mt-2">Your AI conversation partner</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1  border-l border-r border-gray-700 p-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">Start a conversation with Tokebot</p>
                <p className="text-sm mt-2">Ask me anything!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-lg ${
                      msg.isUser
                        ? 'bg-white text-gray-900 rounded-br-none'
                        : 'bg-gray-800 text-white border border-gray-700 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            msg.isUser ? 'bg-gray-600' : 'bg-blue-400'
                          }`}
                        />
                        <span className={`text-xs font-medium ${
                          msg.isUser ? 'text-gray-600' : 'text-blue-400'
                        }`}>
                          {msg.isUser ? 'You' : 'Tokebot'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg rounded-bl-none bg-gray-800 border border-gray-700 shadow-lg">
                    <div className="flex items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs font-medium text-blue-400">Tokebot</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm text-gray-400">typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 p-6 rounded-b-lg shadow-lg">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:bg-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  <span>Sending</span>
                </div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;