from flask import Flask, request, jsonify
from flask_cors import CORS
import language_tool_python
from langdetect import detect, LangDetectException

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize LanguageTool objects for different languages
tools = {
    'en': language_tool_python.LanguageTool('en-US'),
    'es': language_tool_python.LanguageTool('es'),
    'fr': language_tool_python.LanguageTool('fr')
}

@app.route('/check', methods=['POST'])
def check_text():
    data = request.json
    text = data.get('text', '')

    # Check if text is provided
    if not text:
        return jsonify({'error': 'Text is required.'}), 400

    try:
        # Detect the language of the text
        detected_language = detect(text)

        # Select the appropriate LanguageTool based on the detected language
        tool = tools.get(detected_language[:2], tools['en'])  # Default to English if language not supported

        # Perform grammar check
        matches = tool.check(text)
        corrected_text = language_tool_python.utils.correct(text, matches)

        # Prepare the errors list with mistakes and corrections
        errors = [{
            'mistake': text[match.offset:match.offset + match.errorLength],
            'correction': match.replacements,
            'message': match.message,
            'offset': match.offset,
            'errorLength': match.errorLength
        } for match in matches]

        return jsonify({'corrected_text': corrected_text, 'errors': errors, 'detected_language': detected_language})
    
    except LangDetectException:
        return jsonify({'error': 'Could not detect language.'}), 400

if __name__ == '__main__':
    app.run(debug=True)
