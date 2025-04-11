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
    print(f"Całkowita liczba stron w PDF: {total_pages}")
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

print(f"Ekstrahowano tekst ze {len(pages)} spośród {total_pages} stron.")
