from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)

# CORS auf die gesamte App anwenden
CORS(app, resources={r"/locations": {"origins": "http://localhost:5173"}})

def format_coordinate(number):
    # Convert the number to a string
    num_str = str(number)
    
    # Insert a decimal point before the last four digits
    formatted_str = num_str[:-4] + '.' + num_str[-4:]
    
    return float(formatted_str)


def load_locations_from_excel():
    # Read Excel file
    df = pd.read_excel('locations.xlsx')

    # Convert the DataFrame to a list of dictionaries
    locations = df.to_dict(orient='records')
    df['lat'] = df['lat'].apply(lambda x: format_coordinate(int(x)))
    df['lng'] = df['lng'].apply(lambda x: format_coordinate(int(x)))
    


    locations = df.to_dict(orient='records')


    # Structure the data as needed for the frontend
    formatted_locations = [
        {
            "id": loc['id'],
            "name": loc['name'],
            "position": {"lat": loc['lat'], "lng": loc['lng']},
            "user": loc['user'],
            "infoText": loc['infoText']
        }
        for loc in locations
    ]

    return formatted_locations



# Beispielroute
@app.route('/', methods=['GET'])
def get_locations():
    locations = load_locations_from_excel()
    
    response = jsonify(locations)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)
