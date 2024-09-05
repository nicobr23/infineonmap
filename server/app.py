from flask import Flask, jsonify

app = Flask(__name__)

locations = [
    {
        "id": 1,
        "name": "Schloss Neuschwanstein",
        "position": {"lat": 47.5575, "lng": 10.7498},
        "user": "John Doe",
        "infoText": "A breathtaking castle in the Bavarian Alps."
    },
    {
        "id": 2,
        "name": "Marienplatz München",
        "position": {"lat": 48.1371, "lng": 11.5754},
        "user": "Jane Smith",
        "infoText": "The heart of Munich's city center."
    },
    {
        "id": 3,
        "name": "Würzburg Residenz",
        "position": {"lat": 49.7913, "lng": 9.9534},
        "user": "Max Mustermann",
        "infoText": "A famous Baroque palace in Europe."
    }
]

@app.route('/locations', methods=['GET'])
def get_locations():
    return jsonify(locations)

if __name__ == '__main__':
    app.run(debug=True)
