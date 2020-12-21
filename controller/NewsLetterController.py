import sys
import socket
from flask import Flask, render_template, request, redirect, url_for

sys.path.append ('.')
sys.path.append ('../')
sys.path.append ('../model')
sys.path.append ('../utils')

from model import NewsLetterDB
from utils.FileHandling import *

user_db = None
def get_user_db ():
    global user_db
    if (user_db is None):
        user_db = NewsLetterDB.DataBaseManager ()
    return user_db
    
def user_login (request):
    global user_db
    user_db = get_user_db ()
    if (user_db is None):
        return ("<html><body><h1>Database connectivity problem</h1></body></html>")
    if (request.method == 'POST'):
        user_name = request.form['user_name']
        pswd = request.form['pswd']
        user_record = user_db.fetchOneUserRecord (user_name, pswd)
        if (user_record is None):
            return render_template("login_failed.html")
        else:
            file_path = "./tmp/"+user_record[1]+"_"+user_record[2]+".jpg"
            writeFileInBinary (file_path, user_record[3])
        return render_template("home.html", name = user_record[1])

def user_signup (request):
    global user_db
    user_db = get_user_db ()
    if (request.method == 'POST'):
        user_name = request.form ['user_name']
        user_surname = request.form ['user_surname']
        email = request.form ['email']
        pswd = request.form ['pswd']
        profile_img = readFileInBinary ("D:\\Photos\\IMG_20200430_194913379.jpg")
        user_record = (email, user_name, user_surname, pswd, profile_img)
        user_db.insertUserRecordInTable (user_record)
    return render_template("home.html", name = user_name)