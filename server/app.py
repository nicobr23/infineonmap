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
    # Load the Excel file
    df = pd.read_excel('InfineonMap.xlsx')
    
    # Split the 'Geo-Koordinaten' into 'lat' and 'lng'
    df[['lat', 'lng']] = df['Geo-Koordinaten'].str.split(',', expand=True)
    
    # Convert lat and lng to floats and format them
    # df['lat'] = df['lat'].apply(lambda x: format_coordinate(float(x.strip())))
    # df['lng'] = df['lng'].apply(lambda x: format_coordinate(float(x.strip())))

    # Convert the DataFrame to a list of dictionaries
    locations = df.to_dict(orient='records')

    # Structure the data as needed for the frontend
    formatted_locations = [
        {
            "id": index,  # Using the index as the id
            "name": loc['Bezeichnung des Ortes'],
            "position": {"lat": float(loc['lat']), "lng": float(loc['lng'])},
            "user": loc['Created By'],
            "infoText": loc['kurze Beschreibung / Begründung']
        }
        for index, loc in enumerate(locations)
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
