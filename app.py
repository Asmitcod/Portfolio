from flask import Flask, request, jsonify, render_template, redirect
import os
import json
from datetime import datetime
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Create messages directory with absolute path
# For production, use a dedicated directory that's writable by the web server
# You may need to adjust this based on your hosting provider
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MESSAGES_DIR = os.path.join(BASE_DIR, 'messages')
os.makedirs(MESSAGES_DIR, exist_ok=True)

@app.route('/')
def index():
    # Check if this is a form submission via GET
    if request.args.get('name') and request.args.get('email') and request.args.get('message'):
        # If it's a form submission, handle it and redirect to avoid resubmission on refresh
        save_message_from_args(request.args)
        return redirect('/')
    return app.send_static_file('index.html')

def save_message_from_args(args):
    try:
        # Create a timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        
        # Create a unique filename using the timestamp and absolute path
        filename = os.path.join(MESSAGES_DIR, f"message_{timestamp}.json")
        
        # Save the message with metadata
        message_data = {
            'name': args.get('name', ''),
            'email': args.get('email', ''),
            'message': args.get('message', ''),
            'timestamp': timestamp,
            'ip': request.remote_addr,
            'source': 'get_request'
        }
        
        # Write to file
        with open(filename, 'w') as f:
            json.dump(message_data, f, indent=4)
        
        return True
    except Exception as e:
        print(f"Error saving message from GET: {str(e)}")
        return False

@app.route('/send-message', methods=['POST'])
def send_message():
    try:
        # Handle different content types
        if request.is_json:
            data = request.json
        else:
            data = request.form.to_dict()
        
        # Validate data
        if not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'success': False, 'error': 'Please fill all fields'})
        
        # Create a timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        
        # Create a unique filename using the timestamp and absolute path
        filename = os.path.join(MESSAGES_DIR, f"message_{timestamp}.json")
        
        # Save the message with metadata
        message_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'message': data.get('message'),
            'timestamp': timestamp,
            'ip': request.remote_addr,
            'source': 'post_request'
        }
        
        # Write to file
        with open(filename, 'w') as f:
            json.dump(message_data, f, indent=4)
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    # In production, the app will be run by the WSGI server
    # This block is only used for local development
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)