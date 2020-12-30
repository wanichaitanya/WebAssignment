import sys
import os
from flask import Flask, render_template, request, redirect, url_for, session
from flask_session import Session

sys.path.append (".")
sys.path.append ("./model")
sys.path.append ("./controller")

from controller.NewsLetterController import *
import NewsLetterDB
from utils.FileHandling import readFileInBinary, writeFileInBinary

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(16)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_FILE_DIR'] = './tmp'

server_session = Session (app)

#========================================================================================

if (__name__ == "__main__"):
    app.run( debug = True)

#========================================================================================

@app.before_first_request
def server_startup ():
    user_db = get_user_db ()
#========================================================================================

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index ():
    return render_template ("index.html", response = '', title = 'Login')

#========================================================================================
 
@app.route('/signup', methods=['GET', 'POST'])
def signup ():
    return render_template ("signup.html", title = 'Sign Up')

#========================================================================================

@app.route('/request_login', methods=['GET', 'POST'])
def request_login():
    return user_login ()

#========================================================================================

@app.route('/request_signup', methods=['GET', 'POST'])
def request_signup():
    return user_signup ()

#========================================================================================

@app.route('/home/<user_id>', methods=['GET', 'POST'])
def home(user_id):
    user_info = session.get('user_info')
    if(user_info is None or user_id != str(user_info[0])):
        return redirect (url_for ('index')) 
    else:
        return render_template ("home.html", title = 'Home')

#========================================================================================