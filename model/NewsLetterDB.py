import sqlite3
import os
#========================================================================================
                        # Queries applied on User Table
CREATE_USER_TABLE = """CREATE TABLE USER (user_id TEXT NOT NULL PRIMARY KEY,
                                          name TEXT NOT NULL,
                                          surname TEXT NOT NULL,
                                          password TEXT NOT NULL,
                                          profile_img blob)"""

INSERT_INTO_USER = "INSERT INTO USER VALUES (?,?,?,?,?)"

GET_ALL_USERS_INFO = "SELECT user_id, name, surname FROM USER"

GET_USER_INFO = """SELECT user_id, name, surname, profile_img FROM USER WHERE
                   user_id = ? AND password = ?"""

SET_PASSWORD = "UPDATE USER SET password = ? WHERE user_id = ?"

#========================================================================================
class DataBaseManager:
    _instance = None
    def __new__ (cls, dbfile = './database/NewsLetter.db'):
        if (cls._instance is None):
            cls._instance = object.__new__ (cls)
        cls._instance.dbfile = dbfile
        cls._instance.connector = None
        cls._instance.dbcursor = None
        return cls._instance
    
    def CreateTables (self):
        self.connector =  sqlite3.connect (self.dbfile)
        self.dbcursor = self.connector.cursor()
        try:
            self.dbcursor.execute (CREATE_USER_TABLE)
        except Exception as e:
            print (str(e))
        finally:
            self.connector.commit ()
            self.connector.close ()

    def insertUserRecordInTable (self, user_record):
        self.connector =  sqlite3.connect (self.dbfile)
        self.dbcursor = self.connector.cursor()
        u_id = user_record[0]
        u_name = user_record[1]
        u_surname = user_record[2]
        u_password = user_record[3]
        u_profile_img = user_record[4]
        try:
            self.dbcursor.execute (INSERT_INTO_USER, (u_id, u_name, u_surname, u_password, u_profile_img))
        except Exception as e:
            print (str(e))
        finally:
            self.connector.commit ()
            self.connector.close ()

    def fetchAllFromUserTable (self):
        #This function will return user_id, name, surname
        self.connector =  sqlite3.connect (self.dbfile)
        self.dbcursor = self.connector.cursor()
        self.dbcursor.execute (GET_ALL_USERS_INFO)
        user_record = self.dbcursor.fetchall ()
        self.connector.commit ()
        self.connector.close ()
        
        return user_record

    def fetchOneUserRecord (self, user_id, password):
        #This function will return user_id, name, surname, profile_img
        user_record = None
        try:
            self.connector = sqlite3.connect (self.dbfile)
            self.dbcursor = self.connector.cursor()
        
            self.dbcursor.execute (GET_USER_INFO, (user_id, password))
            user_record = self.dbcursor.fetchone ()
            self.connector.commit ()
            self.connector.close ()
        except Exception as e:
            print (str(e))
        return user_record

    def updatePasswordInUserRecord (self, user_id, old_password, new_password):
        #This function will update the password of the user 
        self.connector =  sqlite3.connect (self.dbfile)
        self.dbcursor = self.connector.cursor()
        user_record = fetchOneUserRecord (user_id, old_password)
        if (user_record):
            self.dbcursor.execute (SET_PASSWORD, (new_password, user_id))
            self.connector.commit ()
            self.connector.close ()
        else:
            return -1

if (__name__ == "__main__"):
    user_db = DataBaseManager ()
    user_db.CreateTables ()