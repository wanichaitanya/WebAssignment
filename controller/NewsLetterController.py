import sys
import socket
from flask import Flask, session, g, render_template, request, redirect, url_for, jsonify, make_response
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash

sys.path.append ('.')
sys.path.append ('../')
sys.path.append ('../model')
sys.path.append ('../utils')

from model import NewsLetterDB
from utils.FileHandling import *

USER_SIGNUP_ERROR_MSG = 'User is already registered with same email address!'
USER_LOGIN_ERROR_MSG = 'Invalid User ID or Password'
DATABASE_CONNECTIVITY_ERROR_MSG = 'Database connectivity problem'
#========================================================================================
def set_user_session_data (user_id, ip_addr, user_name):
    session ['user_info'] = [user_id, ip_addr, user_name]
    #TODO: Instead of ip_addr add location

#========================================================================================
user_db = None
def get_user_db ():
    global user_db
    if (user_db is None):
        user_db = NewsLetterDB.DataBaseManager ()
    return user_db

#========================================================================================
   
def user_login ():
    user_db = get_user_db ()
    if (user_db is None):
        return render_template ("index.html", response = DATABASE_CONNECTIVITY_ERROR_MSG,
                                title = 'Login')# Instead of html render, write this message in log file
    if (request.method == 'POST'):
        user_id = request.form ['user_id']
        password = request.form['password']
        user_record = user_db.fetchOneUserRecord (user_id)
        if ((user_record is not None) and check_password_hash(user_record[3], password)):
            #file_path = "./tmp/"+user_record[1]+".jpg"
            #writeFileInBinary (file_path, user_record[2])
            set_user_session_data (user_record[0],
                                   request.environ.get('HTTP_X_REAL_IP', request.remote_addr),
                                   user_record[1])
            return redirect (url_for('home', user_id = user_id))
        else:
            return render_template ("index.html", response = USER_LOGIN_ERROR_MSG, title = 'Login')

#========================================================================================

def user_signup ():
    result = None
    user_db = get_user_db ()
    if (request.method == 'POST'):
        user_name = request.form ['user_name']
        user_id = request.form ['user_id']

        password = request.form ['password']
        hashed_password = generate_password_hash(password)
        profile_img = readFileInBinary ("D:\\Photos\\IMG_20200430_194913379.jpg")
        user_record = (user_id, user_name, hashed_password, profile_img)

        result = user_db.insertUserRecordInTable (user_record)
        if (result == "UNIQUE constraint failed: USER.user_id"):
            return render_template ("signup.html", response = USER_SIGNUP_ERROR_MSG)
        else:
            set_user_session_data (user_id,
                                   request.environ.get('HTTP_X_REAL_IP', request.remote_addr),
                                   user_name)
    return redirect (url_for('home', user_id = user_id))

#========================================================================================

def get_feeds (user_id):
        dict_data = []
        user_info = session.get ('user_info')
        if (user_id is not None and user_info is not None and user_id == user_info[0]):
            feed_data_from_db = user_db.fetchAllFromFeedsTable ()
            for item in feed_data_from_db:

                if (user_id == item[1]):
                    self_post_by_user = 1
                else:
                    self_post_by_user = 0

                feed_data = {'user_name': item[0], 'user_id': item[1],
                             'post_id': item[2], 'content': item[3],
                             'date': item[4], 'location': item[5],
                             'self_post_by_user' : self_post_by_user}

                dict_data.append (feed_data)
            return render_template ('home.html', user_id = user_id, title = 'Home', res = dict_data)
        else:
            return redirect (url_for ('index', title = 'Login'))

#========================================================================================

def insert_feed_in_db ():
    user_info = session.get('user_info')
    user_id = user_info[0]
    location = "Pune"
    status_code = 200
    response_text = "SUCCESS"
    result = None
    if (request.method == 'POST'):
        post_content = request.form ['post']
        feeds_data = (post_content, location, user_id)
        result = user_db.insertFeedsDataInTable (feeds_data)
        if (result is not None):
            status_code = 500
            response_text = "PROBLEM OCCURED WHILE STORING THE NEW FEED"
        
        response = {
            "response" : response_text
        }        
        json_response = jsonify (response)
        return redirect (url_for ('home', user_id = user_id, title = 'Home')) 

#========================================================================================

def delete_feed_from_db (post_id):
    user_info = session.get('user_info')
    user_id = user_info[0]
    user_db.deleteFeedsDataFromTable (post_id, user_id)
    return redirect (url_for('home', user_id = user_id))