#!/usr/bin/env python
"""Simple Flask startup with warm-up."""
import os
import sys

# Suppress scipy warnings
import warnings
warnings.filterwarnings('ignore')

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

print("Starting backend... (initializing sklearn, this may take 30-60 seconds on first run)")

from app import app

if __name__ == '__main__':
    print("\n✓ Backend initialized!")
    print("✓ Server running on http://localhost:5000")
    print("✓ CORS enabled for frontend")
    print("\nEndpoint: POST http://localhost:5000/predict")
    print("  Body: {\"symptoms\": [\"fever\", \"cough\"]}\n")
    app.run(host='0.0.0.0', port=7860, debug=False, use_reloader=False)
