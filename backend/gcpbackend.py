import os
import pymongo
import json
import random
import hashlib
import time
import vt
import re


import requests

from hashlib import sha256



class VirusTotal:
    def __init__(self, apikey) -> None:
        self.apikey = apikey

        
    def analyze_url(self, url):
        with vt.Client(self.apikey) as client:
            result = client.scan_url(url, wait_for_completion=True)
            return result.id

    def get_analyze(self, id):
        with vt.Client(self.apikey) as client:
            result = client.get_json(f"/analyses/{id}")
            return result


def geturl(s):
    urls = re.findall('https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', s)
    if len(urls) > 0:
        return urls[0]
    return "no valid url found"

def hashthis(st):


    hash_object = hashlib.md5(st.encode())
    h = str(hash_object.hexdigest())
    return h



def dummy(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'OPTIONS':
        # Allows GET requests from origin https://mydomain.com with
        # Authorization header
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        }
        return ('', 204, headers)

    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }

    request_json = request.get_json()



    receiver_public_key = os.environ.get('ownpublic')

    mongostr = os.environ.get('MONGOSTR')
    client = pymongo.MongoClient(mongostr)
    db = client["safeqr"]


    retjson = {}

    action = request_json['action']


    if action == "reportqrmarker":
        
        maxid = 1
        col = db.markers
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["type"] = request_json['type']
        payload["data"] = request_json['data']
        # payload["description"] = request_json['description']
        payload["timestamp"] = request_json['timestamp']
        payload["lat"] = request_json['latlng']['latitude']
        payload["lng"] = request_json['latlng']['longitude']
        

        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['markerid'] = id

        return json.dumps(retjson)




    if action == "getallmarkers":
        col = db.markers

        data = []

        for x in col.find():
            ami = {}
            latlng = {}
            ami["id"] = x["id"]
            ami["data"] = x["data"]
            ami["type"] = x["type"]
            # ami["description"] = x["description"]
            ami["timestamp"] = x["timestamp"]
            latlng["latitude"] = x["lat"]
            latlng["longitude"] = x["lng"]
            
            ami["latlng"] = latlng
            
            data.append(ami)

        retjson['markers'] = data

        return json.dumps(retjson)


    if action == "analyzeqr":

        retjson['inputqr'] = request_json['qrcode']

        col = db.qrcodes
        maxid = 1

        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        for x in col.find():
            if x['qrcode'] == request_json['qrcode']:
                retjson['result'] = x['result']
                
                return json.dumps(retjson)

        url = geturl(request_json['qrcode'])

        if url == "no valid url found":
            payload = {}
            payload['id'] = id
            payload['qrcode'] = request_json['qrcode']
            payload['result'] = "no valid url found"

            result=col.insert_one(payload)

            retjson['result'] = "no valid url found"
            return json.dumps(retjson)


        virustotal = VirusTotal("geturown") ##swap
        id = virustotal.analyze_url(url)
        result = virustotal.get_analyze(id)
        # print(result)
        
        # print ("****************")
        
        # print (result['data']['attributes']['stats'])

        retjson['result'] = result['data']['attributes']['stats']

        payload = {}
        payload['id'] = id
        payload['qrcode'] = request_json['qrcode']
        payload['result'] = result['data']['attributes']['stats']

        result=col.insert_one(payload)

        return json.dumps(retjson) 


    retstr = "action not done"

    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return retstr
