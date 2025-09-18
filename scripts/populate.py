import pymongo
from dotenv import load_dotenv
import os
import json

load_dotenv()

# Load MongoDB URI
mongo_uri = os.getenv("MONGODB_URI")

# Connect to MongoDB
client = pymongo.MongoClient(mongo_uri)
db = client["bear_care"]  # Database name
patients_collection = db["records"]  # Collection name

# Read patients.json
with open("scripts/records.json", "r", encoding="utf-8") as f:
    patients_data = json.load(f)

# Insert data into 'patients' collection
if isinstance(patients_data, list):
    patients_collection.insert_many(patients_data)
else:
    patients_collection.insert_one(patients_data)

print("Inserted records data into MongoDB.")