# encrypt_service.py
from flask import Flask, request, jsonify
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from base64 import b64encode
import json

app = Flask(__name__)

KEY = b'ThisIsASecretKey1234567890123456'  # 32 bytes for AES-256
IV = b'ThisIsAnInitVect'                   # 16 bytes

@app.route('/encrypt', methods=['POST'])
def encrypt():
    try:
        data = request.json
        raw = json.dumps(data).encode('utf-8')
        cipher = AES.new(KEY, AES.MODE_CBC, IV)
        encrypted = cipher.encrypt(pad(raw, AES.block_size))
        encoded = b64encode(encrypted).decode('utf-8')
        return jsonify({'encrypted': encoded})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
