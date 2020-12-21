import os

def readFileInBinary (file_path):
        file_data = None
        try:
            file_handle = open (file_path, 'rb')
            file_data = file_handle.read ()
            file_handle.close ()
        except Exception as e:
            print (str(e))
        return file_data

def writeFileInBinary (file_path, file_data):
    try:
        file_handle = open (file_path, 'wb')
        file_handle.write (file_data)
        file_handle.close ()
    except Exception as e:
        print (str (e))