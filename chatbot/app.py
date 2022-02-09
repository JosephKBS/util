from flask import Flask, render_template, request, jsonfy
from flask_cors import flask_cors
from chat import get_response

app = Flask(__name__)

CORS(app)
# 만약 CORS(app) 실행할거면 밑에 app.get전부 지우면 됨.

#@app.get("/")
#def index_get():
#    return render_template("base.html")

@app.post("/predict"):
def predict():
    text = request.get_json.get("message")
    # TODO: check if text is valid
    response = get_response(text)
    message = {"answer":response}
    return jsonfy(message)

if __name__=="__main__":
    app.run(debug=True)
