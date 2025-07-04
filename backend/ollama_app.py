from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from flask import Flask, request, jsonify
import logging
import re
import requests

# Setup basic logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)

# Define a function to check if Ollama is running
def check_ollama_connection():
    """Check if Ollama server is running."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False

# Define a function to format text by converting Markdown bold syntax to HTML strong tags
def format_output(text):
    """Convert Markdown bold syntax to HTML strong tags."""
    return re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)

# Define chatbot initialization
def initialise_llama3():
    try:
        # Check if Ollama is running
        if not check_ollama_connection():
            raise ConnectionError("Ollama server is not running on localhost:11434")
        
        # Create chatbot prompt
        create_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "You are my personal assistant"),
                ("user", "Question: {question}")
            ]
        )
        
        # Initialize Ollama LLM and output parser
        lamma_model = OllamaLLM(model="llama3")
        output_parser = StrOutputParser()
        
        # Create chain
        chatbot_pipeline = create_prompt | lamma_model | output_parser
        return chatbot_pipeline
    except Exception as e:
        logging.error(f"Failed to initialize chatbot: {e}")
        raise

# Initialize chatbot with error handling
try:
    chatbot_pipeline = initialise_llama3()
    logging.info("Chatbot initialized successfully")
except Exception as e:
    logging.error(f"Failed to initialize chatbot: {e}")
    chatbot_pipeline = None

# Define API endpoint for chat
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Check if chatbot is initialized
        if chatbot_pipeline is None:
            return jsonify({
                'error': 'Chatbot not initialized. Please ensure Ollama is running.',
                'status': 'error'
            }), 503
        
        # Check if request contains JSON data
        if not request.is_json:
            return jsonify({
                'error': 'Request must be JSON',
                'status': 'error'
            }), 400
        
        # Get JSON data from request
        data = request.get_json()
        
        # Validate input
        if not data or 'question' not in data:
            return jsonify({
                'error': 'Missing required field: question',
                'status': 'error'
            }), 400
        
        question = data['question']
        
        # Validate question is not empty
        if not question or not question.strip():
            return jsonify({
                'error': 'Question cannot be empty',
                'status': 'error'
            }), 400
        
        # Process the question through the chatbot
        response = chatbot_pipeline.invoke({'question': question})
        formatted_response = format_output(response)
        
        # Return JSON response
        return jsonify({
            'question': question,
            'answer': formatted_response,
            'status': 'success'
        }), 200
        
    except Exception as e:
        logging.error(f"Error during chatbot invocation: {e}")
        return jsonify({
            'error': 'An error occurred while processing your request',
            'status': 'error'
        }), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    ollama_status = "running" if check_ollama_connection() else "not running"
    chatbot_status = "initialized" if chatbot_pipeline is not None else "not initialized"
    
    return jsonify({
        'status': 'healthy' if chatbot_pipeline is not None else 'unhealthy',
        'service': 'Llama3 Chatbot API',
        'ollama_server': ollama_status,
        'chatbot': chatbot_status
    }), 200

# API info endpoint
@app.route('/api/info', methods=['GET'])
def api_info():
    return jsonify({
        'service': 'Llama3 Chatbot API',
        'version': '1.0.0',
        'endpoints': {
            'chat': {
                'method': 'POST',
                'url': '/api/chat',
                'description': 'Send a question to the chatbot',
                'body': {
                    'question': 'string (required)'
                }
            },
            'health': {
                'method': 'GET',
                'url': '/api/health',
                'description': 'Check API health status'
            }
        }
    }), 200

# Error handler for 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'status': 'error'
    }), 404

# Error handler for 405 (Method Not Allowed)
@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'error': 'Method not allowed',
        'status': 'error'
    }), 405

if __name__ == '__main__':
    app.run(debug=True)