from urllib.request import urlopen 
import json

GET_GEO_LOCATION_FROM_IP = "https://api.ipgeolocationapi.com/geolocate/"

def get_country_from_ip (ip_address):
    if (ip_address is None):
        return "N/A"
    else:
        try:
            with urlopen(GET_GEO_LOCATION_FROM_IP+ip_address) as response:
                response_data = response.read()
                json_data = json.loads (response_data)
                return json_data['name']
        except Exception as e:
            print (str(e))
            return "N/A"

if (__name__=="__main__"):
    print (get_country_from_ip("103.121.155.197"))