import sys
import pandas as pd
import joblib

# Load the trained pipeline (this includes both the preprocessor and the model)
pipeline = joblib.load('C:/CODING/Minor Project/unixchange/ML/currency_exchange_model.pkl')

def preprocess_input(base_currency, currency, day, month, year):
    # Create a DataFrame with the required input data
    input_data = pd.DataFrame({
        'BaseCurrency': [base_currency],
        'TargetCurrency': [currency],
        'Day': [int(day)],
        'Month': [int(month)],
        'Year': [int(year)]
    })

    return input_data

def predict_exchange_rate(base_currency, currency, day, month, year):
    # Preprocess the input data
    processed_input = preprocess_input(base_currency, currency, day, month, year)

    # Make prediction using the entire pipeline (which includes preprocessing and the model)
    prediction = pipeline.predict(processed_input)
    
    return f"{prediction[0]:.5f}"

if __name__ == "__main__":
    # Get input from the command line
    if len(sys.argv) != 6:
        print("Error: Missing arguments")
        sys.exit(1)

    base_currency = sys.argv[1]
    currency = sys.argv[2]
    day = sys.argv[3]
    month = sys.argv[4]
    year = sys.argv[5]

    # Predict exchange rate
    exchange_rate = predict_exchange_rate(base_currency, currency, day, month, year)

    # Output the result (which will be captured by the Node.js script)
    print(exchange_rate)
