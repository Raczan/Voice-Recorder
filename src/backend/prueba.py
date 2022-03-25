import json

# JSON file
file = open('src/backend/recordStateFile.json', 'r')
datajson = json.loads(file.read())
 
print(datajson["record"])
file.close()