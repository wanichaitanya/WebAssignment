import sys
from flask import Flask, render_template, request, redirect, url_for

sys.path.append (".")
sys.path.append ("./model")
sys.path.append ("./controller")

from controller.NewsLetterController import *
import NewsLetterDB
from utils.FileHandling import readFileInBinary, writeFileInBinary

app = Flask(__name__)
app.secret_key = os.urandom(16)

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def home ():
    return render_template ("index.html")

@app.route('/signup', methods=['GET', 'POST'])
def signup ():
    return render_template ("signup.html")

@app.route('/request_login', methods=['GET', 'POST'])
def request_login():
    return user_login (request)

@app.route('/request_signup', methods=['GET', 'POST'])
def request_signup():
    return user_signup (request)


if (__name__ == "__main__"):
    user_db = NewsLetterDB.DataBaseManager ()
    print (id(user_db))
    app.run (debug=True)