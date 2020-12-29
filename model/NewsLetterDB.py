import sqlite3
import os

dbfile = './model/database/NewsLetter.db'
#dbfile = './database/NewsLetter.db'
#========================================================================================
                        # Queries applied on User Table
CREATE_USER_TABLE = """CREATE TABLE USER (user_id TEXT PRIMARY KEY,
                                          name TEXT NOT NULL,
                                          password TEXT NOT NULL,
                                          profile_img blob)"""

INSERT_INTO_USER = "INSERT INTO USER VALUES (?,?,?,?)"

GET_ALL_USERS_INFO = "SELECT user_id, name FROM USER"

GET_USER_INFO = """SELECT user_id, name, profile_img FROM USER WHERE
                   user_id = ? AND password = ?"""

SET_PASSWORD = "UPDATE USER SET password = ? WHERE user_id = ?"

#========================================================================================
                        #Queries applied on Feeds table

CREATE_FEED_TABLE = """CREATE TABLE FEEDS (post_id INT NOT NULL PRIMARY KEY,
                                           content TEXT NOT NULL,
                                           file_data blob,
                                           is_single_file bool, 
                                           user_id TEXT NOT NULL,
                                           FOREIGN KEY (user_id)
                                           REFERENCES USER (user_id))"""

#========================================================================================

class DataBaseManager:
    _instance = None
    def __new__ (cls):
        if (cls._instance is None):
            cls._instance = object.__new__ (cls)
            cls._instance.dbfile = dbfile
            cls._instance.connector = None
            cls._instance.dbcursor = None
        return cls._instance

#========================================================================================
    
    def CreateTables (self):
        try:
            self.connector =  sqlite3.connect (self.dbfile)
            self.dbcursor = self.connector.cursor()
            self.dbcursor.execute (CREATE_USER_TABLE)
            self.dbcursor.execute (CREATE_FEED_TABLE)
            self.connector.commit ()
            self.connector.close ()
        except Exception as e:
            print (str(e))

#========================================================================================

    def insertUserRecordInTable (self, user_record):
        user_id = user_record[0]
        user_name = user_record[1]
        password = user_record[2]
        profile_img = user_record[3]
        try:
            self.connector =  sqlite3.connect (self.dbfile)
            self.dbcursor = self.connector.cursor()
            self.dbcursor.execute (INSERT_INTO_USER, (user_id, user_name, password, profile_img))
            self.connector.commit ()
            self.connector.close ()
        except sqlite3.IntegrityError as error:
            return str(error)
        except Exception as other_error:
            print (str(other_error))

#========================================================================================

    def fetchAllFromUserTable (self):
        #This function will return user_id, name
        try:
            self.connector =  sqlite3.connect (self.dbfile)
            self.dbcursor = self.connector.cursor()
            self.dbcursor.execute (GET_ALL_USERS_INFO)
            user_record = self.dbcursor.fetchall ()
            self.connector.commit ()
            self.connector.close ()
        except Exception as e:
            print (str (e))
        return user_record

#========================================================================================

    def fetchOneUserRecord (self, user_id, password):
        #This function will return user_id, name, profile_img
        user_record = None
        try:
            self.connector =  sqlite3.connect (self.dbfile)
            self.dbcursor = self.connector.cursor()
            self.dbcursor.execute (GET_USER_INFO, (user_id, password))
            user_record = self.dbcursor.fetchone ()
            self.connector.commit ()
            self.connector.close ()
        except Exception as e:
            print (str(e))
        return user_record

#========================================================================================

    def updatePasswordInUserRecord (self, user_id, old_password, new_password):
        #This function will update the password of the user
        try: 
            user_record = fetchOneUserRecord (user_id, old_password)
            if (user_record):
                self.connector =  sqlite3.connect (self.dbfile)
                self.dbcursor = self.connector.cursor()
                self.dbcursor.execute (SET_PASSWORD, (new_password, user_id))
                self.connector.commit ()
                self.connector.close ()
            else:
                return -1
        except Exception as e:
            print (str (e))

#========================================================================================

if (__name__ == "__main__"):
    user_db = DataBaseManager ()
    print (id (user_db))
    user_db.CreateTables ()