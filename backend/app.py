from flask import Flask, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
import pdfplumber
import groq
from flask_cors import CORS
from pptx import Presentation
from pptx.util import Pt, Inches

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 # 50 MB max limit.

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)

client = groq.Groq(api_key=os.environ["GROQ_API_KEY"])


@app.route('/')
def home():
    return "Welcome to the PDF Story App"


def extractText(file):
    text = ''
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text+= page.extract_text()
    return text

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    text = extractText(file_path)  # Assuming you have a function `extract_text` that extracts text from the PDF.
    story = generateStory(text)
    

    return jsonify({'message': 'File uploaded and story generated', 'story': story}), 200

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf'}


def generateStory(text):
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant, for a student, that generates a story, which is based upon the     content i provide. The PDF is read, and the text is given to you. You need to generate an entire story, which explains the given text content. This basically helps user to understand the content, like a quick summary. And most importantly, highlight the words to be remembered. Do not give questions. Only the Story. Make the story captivating, and also include emojis in the story. No need to mention them separately at the end."
        },
        {
            "role": "user",
            "content": text
        }
    ]
    
    # Call Groq's API to generate the chat completion
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.1-70b-versatile",  # You can select from various models like 'Gemma', 'Mixtral', etc.
        temperature=0.7,  # Adjust as needed for response randomness
        max_tokens=1024,  # Adjust token length for your needs
        top_p=1,  # Set nucleus sampling for diversity
        stream=False  # Set this to True for streaming responses
    )

    # Return the generated content
    return chat_completion.choices[0].message.content

@app.route('/download_ppt', methods=['POST'])
def download_ppt():
    paragraphs = request.json.get('paragraphs', [])
    ppt = Presentation()
    
    # Add a title slide (optional)
    title_slide_layout = ppt.slide_layouts[0]
    slide = ppt.slides.add_slide(title_slide_layout)
    title = slide.shapes.title
    title.text = "Flashcards Generated from PDF"
    
    # Add each paragraph as a slide
    for para in paragraphs:
        # Use a basic text slide layout
        slide_layout = ppt.slide_layouts[1]  # Title and Content layout
        slide = ppt.slides.add_slide(slide_layout)
        
        # Add title and content
        title = slide.shapes.title
        title.text = "Flashcard"
        
        content = slide.placeholders[1]
        text_frame = content.text_frame
        p = text_frame.add_paragraph()
        p.text = para
        p.font.size = Pt(14)

    # Save the presentation to a temporary file
    ppt_path = "flashcards.pptx"
    ppt.save(ppt_path)

    return send_file(ppt_path, as_attachment=True, download_name="flashcards.pptx")


if __name__ == '__main__':
    app.run(debug=True)



