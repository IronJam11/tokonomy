export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIAgentProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  apiEndpoint?: string;
  agentName?: string;
}
