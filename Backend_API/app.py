from flask import Flask, jsonify
from flask_cors import CORS
from socket import gethostbyname, gethostname
from Utils.miniBoard import Mini

app = Flask(__name__)
CORS(app)

mini = Mini()

@app.route('/testroute', methods=['GET'])
def testroute():
    return jsonify({
        'user': 'clankau',
        'word': 'dog'
    })

@app.route('/generate_grid', methods=['GET'])
def generate_grid():
    mini.re_init()
    mini.generate_grid()
    return jsonify(mini.jsonify())

if __name__ == '__main__':
    # host_address = gethostbyname(gethostname())
    host_address = '127.0.0.1'
    app.run(host=host_address, port=5000, debug=True)