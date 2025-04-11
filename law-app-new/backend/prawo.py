# ===== Cell 1: Install/Import Libraries =====
# (When running locally, ensure you have installed these packages using pip beforehand.)
# Required packages: pdfplumber, faiss-cpu, openai, pytesseract, pdf2image
# If not already installed, you can install via:
#    pip install pdfplumber faiss-cpu openai pytesseract pdf2image
import sys
import pdfplumber
import openai
import faiss
import numpy as np
import os
import logging
import signal
import pytesseract
from pdf2image import convert_from_path

# Note: The google.colab.files module is only for Colab.
# For local use, the user must input the file path directly.
# from google.colab import files

# ===== Cell 2: Set API Key =====
# Replace with your actual API key. (Your friend will use your API key.)
from dotenv import load_dotenv
import os
load_dotenv()  # load from .env

question = sys.stdin.read()
user_question = question.strip()
# Replace "YOUR_OPENAI_API_KEY" with your actual key.
openai.api_key = os.getenv('API_KEY')
# ===== Cell 3: PDF Extraction with OCR Fallback =====
# Here, instead of using the Colab file upload widget, the code expects the user to edit the file path.
# pdf_filename = input("Podaj pełną ścieżkę do pliku PDF (np. C:\\ścieżka\\do\\law.pdf lub /home/user/law.pdf): ").strip()
pdf_filename = "uploads/law.pdf"  # Example path for local testing.

if not os.path.exists(pdf_filename):
    raise FileNotFoundError(f"Plik PDF nie został znaleziony: {pdf_filename}")
# else:
#     print("Plik znaleziony:", pdf_filename)

# Suppress repeated CropBox warnings.
logging.getLogger("pdfminer.pdfpage").setLevel(logging.ERROR)

# Set up a timeout mechanism for text extraction.
class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException("Przekroczono limit czasu ekstrakcji tekstu.")

signal.signal(signal.SIGALRM, timeout_handler)

def extract_text_with_timeout(page, timeout_seconds=5):
    signal.alarm(timeout_seconds)
    try:
        text = page.extract_text()  # Attempt native extraction.
    except TimeoutException:
        text = ""
        print("Przekroczono limit czasu ekstrakcji pdfplumber; pomijam tę stronę.")
    except Exception as e:
        text = ""
        print(f"Błąd podczas ekstrakcji pdfplumber: {e}")
    finally:
        signal.alarm(0)
    return text

def extract_text_from_page(page, page_num, ocr_threshold=20, timeout_seconds=5):
    # Try native extraction first.
    text = extract_text_with_timeout(page, timeout_seconds=timeout_seconds)
    if text is None or len(text.strip()) < ocr_threshold:
        try:
            print(f"Strona {page_num}: Tylko {len(text.strip()) if text else 0} znaków. Wywołuję OCR...")
            pil_image = page.to_image(resolution=300).original
            ocr_text = pytesseract.image_to_string(pil_image)
            return ocr_text
        except Exception as e:
            print(f"Błąd OCR na stronie {page_num}: {e}")
            return ""
    return text

pages = []
with pdfplumber.open(pdf_filename) as pdf:
    total_pages = len(pdf.pages)
    # print(f"Całkowita liczba stron w PDF: {total_pages}")
    for i, page in enumerate(pdf.pages):
        page_num = i + 1
        try:
            page_text = extract_text_from_page(page, page_num, ocr_threshold=20, timeout_seconds=5)
            if page_text and page_text.strip():
                pages.append({"page_num": page_num, "text": page_text})
            else:
                print(f"Strona {page_num} nie zawiera tekstu.")
        except Exception as e:
            print(f"Nie udało się przetworzyć strony {page_num}: {e}")

# print(f"Ekstrahowano tekst ze {len(pages)} spośród {total_pages} stron.")

# ===== Cell 4: Chunking the Text =====
def chunk_text(page_text, page_num, max_len=500):
    chunks = []
    paragraphs = page_text.split("\n")
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if paragraph:
            if len(paragraph) > max_len:
                for i in range(0, len(paragraph), max_len):
                    chunk = paragraph[i:i+max_len]
                    chunks.append({"page_num": page_num, "text": chunk})
            else:
                chunks.append({"page_num": page_num, "text": paragraph})
    return chunks

all_chunks = []
for page in pages:
    chunks = chunk_text(page["text"], page["page_num"])
    all_chunks.extend(chunks)
# print(f"Utworzono {len(all_chunks)} fragmentów tekstu.")

# ===== Cell 5: Compute Embeddings and Build FAISS Index =====
import requests

# Używamy podanego klucza API (patrz Cell 2).
def get_embeddings_batch(texts, model="text-embedding-3-large"):
    headers = {
        "Authorization": f"Bearer {openai.api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "input": texts
    }
    response = requests.post("https://api.openai.com/v1/embeddings", headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Błąd {response.status_code}: {response.text}")
    data = response.json()
    embeddings = [np.array(item["embedding"], dtype=np.float32) for item in data["data"]]
    return embeddings

if "all_chunks" not in globals():
    raise Exception("Variable 'all_chunks' is not defined.")

batch_size = 10
all_embeddings = []
for i in range(0, len(all_chunks), batch_size):
    batch_texts = [chunk["text"] for chunk in all_chunks[i:i+batch_size]]
    try:
        batch_embeddings = get_embeddings_batch(batch_texts)
        all_embeddings.extend(batch_embeddings)
    except Exception as e:
        print(f"Błąd przy przetwarzaniu partii od indeksu {i}: {e}")

embeddings = np.vstack(all_embeddings)
embedding_dim = embeddings.shape[1]

index = faiss.IndexFlatL2(embedding_dim)
index.add(embeddings)

chunk_id_to_data = {i: all_chunks[i] for i in range(len(all_chunks))}
# print(f"Indeks FAISS utworzony z {index.ntotal} wektorami.")

# ===== Cell 6: Retrieve All Candidate Chunks =====
def get_query_embedding(query, model="text-embedding-3-large"):
    batch = get_embeddings_batch([query], model=model)
    return batch[0]

def retrieve_all_relevant_chunks(query):
    query_embedding = get_query_embedding(query)
    query_embedding = np.expand_dims(query_embedding, axis=0)
    top_k = index.ntotal
    distances, indices = index.search(query_embedding, top_k)
    retrieved_chunks = []
    for idx in indices[0]:
        chunk_data = chunk_id_to_data.get(idx)
        if chunk_data is not None:
            retrieved_chunks.append(chunk_data)
    return retrieved_chunks

user_query = user_question
retrieved_chunks = retrieve_all_relevant_chunks(user_query)
# print("Pobrane kandydackie fragmenty:")
for chunk in retrieved_chunks:
    preview = chunk['text'] if len(chunk['text']) < 200 else chunk['text'][:200] + "..."
    # print(f"Strona {chunk.get('page_num', '?')}: {preview}")

# ===== Cell 7 (Refinement): Polish Output with Filtering (>50% Score) =====
import json

def get_chat_completion(messages, model="gpt-4", temperature=0.2, max_tokens=1200):
    # Direct HTTP call to Chat Completions endpoint.
    headers = {
        "Authorization": f"Bearer {openai.api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Błąd {response.status_code}: {response.text}")
    data = response.json()
    return data["choices"][0]["message"]["content"]

def refine_candidate_chunks_pl(query, candidate_chunks, model="gpt-4", temperature=0.2, max_tokens=1200, max_candidates=10):
    """
    Funkcja przyjmuje zapytanie prawne oraz listę fragmentów kandydackich.
    Zadania:
    1. Ocenić każdy fragment pod względem relewantności do zapytania.
    2. Osadzić fragment w pełnych zdaniach (podając otaczający kontekst).
    3. Napisz krótkie wyjaśnienie (1–2 zdania), dlaczego fragment jest istotny.
    4. Przypisz wynik jako ciąg procentowy (tylko fragmenty powyżej 50% mają być brane pod uwagę).
    5. Oznacz fragment jako istotny (true, jeśli wynik >50%) lub nie (false).
    Zwróć wynik jako tablicę JSON, gdzie każdy obiekt ma klucze:
        "page_num", "text", "explanation", "score", "relevant".
    W promptie uwzględnij tylko pierwsze {max_candidates} fragmentów.
    """
    limited_candidates = candidate_chunks[:max_candidates]
    candidate_context = ""
    for i, chunk in enumerate(limited_candidates, start=1):
        fragment_preview = chunk["text"][:200].replace("\n", " ") + ("..." if len(chunk["text"]) > 200 else "")
        candidate_context += f"Fragment {i} - Strona {chunk['page_num']}: {fragment_preview}\n"

    prompt = f"""Jesteś ekspertem prawnym. Otrzymałeś zapytanie prawne oraz listę fragmentów wyekstrahowanych z dokumentu.
    Twoim zadaniem jest:
    1. Ocenić każdy przedstawiony fragment pod kątem relewantności do poniższego zapytania.
    2. Dla fragmentów, które są relewantne (tj. osiągną wynik powyżej 50%), osadź je w pełnych, spójnym zdaniach, aby zapewnić pełny kontekst (podaj zdania otaczające oryginalny fragment).
    3. Napisz krótkie wyjaśnienie (1–2 zdania) dlaczego dany fragment jest istotny.
    4. Przypisz fragmentowi wynik relewantności jako ciąg procentowy (np. "75%"). **Pomiń fragmenty, które osiągną wynik 50% lub poniżej.**
    5. Oznacz każdy fragment wartością logiczną: true, jeśli jest istotny (wynik >50%), lub false w przeciwnym przypadku.
    
    Zwróć wynik wyłącznie jako tablicę JSON, w której każdy obiekt ma dokładnie te klucze:
    "page_num" – numer strony,
    "text" – pełny tekst fragmentu osadzony w kontekście (pełne zdania otaczające dany fragment),
    "explanation" – krótkie wyjaśnienie relewantności,
    "score" – wynik jako ciąg procentowy (np. "75%"),
    "relevant" – wartość logiczna (true lub false).
    
    Zapytanie prawne: "{query}"
    
    Fragmenty kandydackie:
    {candidate_context}

    Upewnij się, że wynik jest poprawnym JSONem i NIE zawiera dodatkowego tekstu.
    """
    messages = [
        {"role": "system", "content": "Jesteś ekspertem prawnym."},
        {"role": "user", "content": prompt}
    ]

    response_json_str = get_chat_completion(messages, model=model, temperature=temperature, max_tokens=max_tokens)

    try:
        refined_chunks = json.loads(response_json_str)
        # Sprawdź, czy każdy obiekt zawiera wymagane klucze.
        for obj in refined_chunks:
            for key in ["page_num", "text", "explanation", "score", "relevant"]:
                if key not in obj:
                    raise ValueError(f"Brakuje klucza: {key}")
        return refined_chunks
    except Exception as e:
        print("Błąd podczas parsowania JSON z odpowiedzi ChatGPT:", e)
        print("Otrzymana odpowiedź:", response_json_str)
        return []

final_chunks = refine_candidate_chunks_pl(user_query, retrieved_chunks)
# print("Ostatecznie przefiltrowane fragmenty (tylko te z wynikiem powyżej 50%):")

def parse_percentage(score_str):
    try:
        return float(score_str.strip('%'))
    except:
        return 0.0

final_chunks_sorted = sorted(final_chunks, key=lambda x: parse_percentage(x["score"]), reverse=True)

result = []

for chunk in final_chunks_sorted:
    result.append(f"Strona {chunk['page_num']} (Wynik: {chunk['score']} - Istotny: {chunk['relevant']}):\n")
    result.append(f"Tekst: {chunk['text']}\n")
    result.append(f"Wyjaśnienie: {chunk['explanation']}\n")
    result.append("-----\n\n")

# Join all parts and print the result as a single string
print(''.join(result))