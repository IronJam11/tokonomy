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
    <div>
      <h1>Gemini Chat</h1>
      
      <div style={{ border: '1px solid #ccc', height: '400px', overflow: 'auto', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.isUser ? 'You: ' : 'Gemini: '}</strong>
            <span>{msg.text}</span>
          </div>
        ))}
        {isLoading && <div><strong>Gemini: </strong><em>typing...</em></div>}
      </div>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{ width: '70%', padding: '10px' }}
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{ padding: '10px', marginLeft: '10px' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;