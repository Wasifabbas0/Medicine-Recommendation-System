import os
import ast
import difflib
import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))

app = Flask(__name__)
CORS(app)

# Paths
MODEL_PATH = os.path.join(ROOT, "models", "svc.pkl")
LABEL_ENCODER_PATH = os.path.join(ROOT, "models", "label_encoder.pkl")
TRAINING_CSV = os.path.join(ROOT, "dataset", "Training.csv")
MEDICATIONS_CSV = os.path.join(ROOT, "dataset", "medications.csv")
DIETS_CSV = os.path.join(ROOT, "dataset", "diets.csv")
PRECAUTIONS_CSV = os.path.join(ROOT, "dataset", "precautions_df.csv")
DESCRIPTION_CSV = os.path.join(ROOT, "dataset", "description.csv")
WORKOUT_CSV = os.path.join(ROOT, "dataset", "workout_df.csv")


def safe_load(path):
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        return pickle.load(f)


model = safe_load(MODEL_PATH)
label_encoder = safe_load(LABEL_ENCODER_PATH)

# load feature columns from training CSV
feature_columns = []
if os.path.exists(TRAINING_CSV):
    try:
        df = pd.read_csv(TRAINING_CSV, nrows=1)
        feature_columns = [c for c in df.columns if c.lower().strip() != "prognosis"]
    except Exception:
        feature_columns = []

# load recommendation tables
meds_df = pd.read_csv(MEDICATIONS_CSV) if os.path.exists(MEDICATIONS_CSV) else None
diets_df = pd.read_csv(DIETS_CSV) if os.path.exists(DIETS_CSV) else None
prec_df = pd.read_csv(PRECAUTIONS_CSV) if os.path.exists(PRECAUTIONS_CSV) else None
desc_df = pd.read_csv(DESCRIPTION_CSV) if os.path.exists(DESCRIPTION_CSV) else None
workout_df = pd.read_csv(WORKOUT_CSV) if os.path.exists(WORKOUT_CSV) else None


def lookup_list(df, disease, colname):
    if df is None:
        return []
    # match case-insensitive
    match = df[df['Disease'].str.lower().str.strip() == disease.lower().strip()]
    if match.empty:
        return []
    raw = match.iloc[0][colname]
    try:
        return ast.literal_eval(raw)
    except Exception:
        # fallback: return raw as single-item list
        return [raw]


def map_symptoms_to_features(symptoms, feature_columns, cutoff=0.65):
    """Map user-entered symptom strings to the closest feature column names.

    Returns a tuple (matched_features_set, suggestions, unmatched)
    - matched_features_set: set of original feature column names that matched
    - suggestions: dict mapping input symptom -> matched feature (if any)
    - unmatched: list of input symptoms with no close match
    """
    if not feature_columns:
        return set(), {}, list(symptoms)

    # prepare lowercase mapping
    lower_to_orig = {c.lower().strip(): c for c in feature_columns}
    feature_names_lower = list(lower_to_orig.keys())

    suggestions = {}
    unmatched = []
    matched = set()

    for s in symptoms:
        key = s.lower().strip()
        if key in lower_to_orig:
            orig = lower_to_orig[key]
            matched.add(orig)
            suggestions[s] = orig
            continue

        # try fuzzy match
        close = difflib.get_close_matches(key, feature_names_lower, n=1, cutoff=cutoff)
        if close:
            orig = lower_to_orig[close[0]]
            matched.add(orig)
            suggestions[s] = orig
        else:
            unmatched.append(s)

    return matched, suggestions, unmatched


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    symptoms = data.get('symptoms', [])
    if not isinstance(symptoms, list):
        return jsonify({'error': 'symptoms should be a list of strings'}), 400

    # normalize user inputs
    normalized_inputs = [s for s in (s.strip() for s in symptoms if isinstance(s, str) and s.strip())]

    if not feature_columns:
        return jsonify({'error': 'feature columns not available on server'}), 500

    # Map user inputs to closest feature columns (tolerate typos)
    matched_features, suggestions, unmatched = map_symptoms_to_features(normalized_inputs, feature_columns)

    # build input vector using matched features
    input_vec = [1 if feat in matched_features else 0 for feat in feature_columns]

    if model is None:
        return jsonify({'error': 'model not found on server'}), 500

    try:
        pred = model.predict([input_vec])
    except Exception as e:
        return jsonify({'error': f'prediction failed: {str(e)}'}), 500

    try:
        disease = label_encoder.inverse_transform(pred)[0] if label_encoder is not None else str(pred[0])
    except Exception:
        disease = str(pred[0])

    medications = lookup_list(meds_df, disease, 'Medication')
    diet = lookup_list(diets_df, disease, 'Diet')
    precautions = []
    if prec_df is not None:
        # precautions table has multiple columns
        m = prec_df[prec_df['Disease'].str.lower().str.strip() == disease.lower().strip()]
        if not m.empty:
            row = m.iloc[0]
            # collect non-empty precaution columns
            for c in m.columns:
                if 'precaution' in c.lower() or c.lower().startswith('precaution'):
                    val = row[c]
                    if pd.notna(val) and str(val).strip():
                        precautions.append(str(val))

    # Get description
    description = ""
    if desc_df is not None:
        m = desc_df[desc_df['Disease'].str.lower().str.strip() == disease.lower().strip()]
        if not m.empty:
            desc_val = m.iloc[0].get('Description', '')
            description = str(desc_val) if pd.notna(desc_val) else ""

    # Get workout/exercise (multiple rows per disease)
    workout = []
    if workout_df is not None:
        # Note: workout_df has lowercase 'disease' column
        m = workout_df[workout_df['disease'].str.lower().str.strip() == disease.lower().strip()]
        if not m.empty:
            workout = [str(val) for val in m['workout'].dropna().unique()]

    return jsonify({
        'disease': disease,
        'medications': medications,
        'diet': diet,
        'precautions': precautions,
        'description': description,
        'workout': workout,
        'matched': suggestions,
        'unmatched': unmatched
    })


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

