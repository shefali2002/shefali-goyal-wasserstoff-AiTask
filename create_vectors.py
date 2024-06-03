from sentence_transformers import SentenceTransformer
import faiss
import json

# Load the model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load text data (for demonstration, this is hardcoded, but in practice, load your page-content.txt)
with open('C:\\Users\\Shefali\\Downloads\\page-content.txt', 'r',encoding='utf-8') as file:
    text_data = file.readlines()
# Remove any leading/trailing whitespace characters from each line
text_data = [line.strip() for line in text_data]
# Vectorize text data
vectors = model.encode(text_data)

# Create a FAISS index
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)

# Save the index
faiss.write_index(index, 'vectors.index')

# Save text data with corresponding vector IDs
with open('text_data.json', 'w',encoding='utf-8') as file:
    json.dump(text_data, file,ensure_ascii=False)
