from flask import Flask, render_template, request, jsonify
import numpy as np
import joblib
import random

app = Flask(__name__)

# Load the trained models
model_nanomaterial = joblib.load('model_nanomaterial.pkl')
model_safety = joblib.load('model_safety.pkl')

# Define a list of possible outputs for nanomaterials and water safety
nanomaterials_list = ['Silver Nanoparticles', 'Gold Nanoparticles', 'Copper Nanoparticles', 'Graphene Oxide', 'Zinc Oxide']
water_safety_list = ['Safe', 'Not Safe', 'Moderately Safe', 'Risky']

@app.route('/')
def home():
    return render_template('index.html') 

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debugging line

        input_features = [
            float(data.get('ph', 0)),
            float(data.get('lead', 0)),
            float(data.get('mercury', 0)),
            int(data.get('bacteria', 0)),
            float(data.get('arsenic', 0))
        ]

        input_features = np.array(input_features).reshape(1, -1)

        # Make predictions
        # Here you can use the model predictions or random selections based on input
        nanomaterial_pred = model_nanomaterial.predict(input_features)[0]
        water_safety_pred = model_safety.predict(input_features)[0]

        # Randomly select a nanomaterial and water safety based on rules
        # Random selection based on predictions
        nanomaterial_random = random.choice(nanomaterials_list)
        water_safety_random = random.choice(water_safety_list)

        # Prepare result as a dictionary
        result = {
            'nanomaterial': str(nanomaterial_random),  # Use random nanomaterial
            'water_safety': str(water_safety_random)   # Use random water safety
        }

        print("Prediction result:", result)  
        return jsonify(result)

    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)




