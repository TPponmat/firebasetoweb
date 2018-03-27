import pyrebase
import random
import time
config = {
    "apiKey": "",
    "authDomain": "",
    "databaseURL": "",
    "storageBucket": "",
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

# # save data
# data = {"name": "Mortimer 'Morty' Smith"}
# db.child("users").push(data)

# update data
while True:
  random_x = random.randrange(1,100)
  # db.child("member").child("ipo_margin").set(random_x)
  # db.child("member").child("issue_reports").set(random_x)
  db.child("member").child("member_profit").set(random_x)
  # db.child("member").child("logistics").set(random_x)
  db.child("member").child("member_order").set(round(random_x*0.2))
  # db.child("member").child("payments").set(random_x)
  # db.child("member").child("revenue").set(random_x)
  # db.child("member").child("transactions").set(random_x)
  # db.child("member").child("weekly_orders").set(random_x)
  time.sleep(2)
