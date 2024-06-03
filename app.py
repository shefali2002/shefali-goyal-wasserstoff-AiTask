from flask import Flask, request, jsonify, render_template
from sentence_transformers import SentenceTransformer
import faiss
import json
import openai

app = Flask(__name__)

# Load the model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load FAISS index
index = faiss.read_index('vectors.index')

# Load text data
with open('text_data.json', 'r', encoding='utf-8') as file:
    text_data = json.load(file)

def retrieve_relevant_passages(query, top_k=5):
    # Vectorize the query
    query_vector = model.encode([query])
    
    # Search the FAISS index
    distances, indices = index.search(query_vector, top_k)
    
    # Retrieve corresponding passages
    retrieved_passages = [text_data[idx] for idx in indices[0]]
    return retrieved_passages

# Set your OpenAI API key
openai.api_key = 'your-api-key-here'

def generate_response(query, retrieved_passages):
    # Combine the query with the retrieved passages
    combined_input = "Query: " + query + "\n\nRelevant Passages:\n" + "\n".join(retrieved_passages)
    
    # Generate a response with gpt-3.5-turbo
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": combined_input}
        ],
        max_tokens=200,
        temperature=0.7,
        top_p=1,
        n=1,
        stop=None
    )
    return response.choices[0].message['content'].strip()

def chatbot(query):
    # Retrieve relevant passages
    retrieved_passages = retrieve_relevant_passages(query)
    
    # Generate and return the response
    response = generate_response(query, retrieved_passages)
    return response

@app.route('/')
def home():
    return render_template('popup.html')

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400
    response = chatbot(query)
    return jsonify({'response': response})

if __name__ == "__main__":
    app.run(debug=True)

    

