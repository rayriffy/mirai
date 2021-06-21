import firebase_admin
import os

from firebase_admin import credentials
from firebase_admin import firestore

import time

arcadeId = os.environ.get('MIRAI_ARCADE_ID')
serviceAccountPath = os.environ.get('MIRAI_SERVICE_ACCOUNT')

# authenticate to firebase server

cred = credentials.Certificate(serviceAccountPath)
firebase_admin.initialize_app(cred)

# listen firebase server

db = firestore.client()

# function to service transaction
def processTransaction(transaction):
  transactionData = transaction.document.to_dict()
  print(f'{transaction.document.id}')

  # lock to not be able to cancel
  db.collection(u'transactions').document(transaction.document.id).update({
    u'status': 'processing',
    u'updatedAt': firestore.SERVER_TIMESTAMP,
  })

  # insert coin (firing signal)
  for i in range(transactionData.get('token')):
    time.sleep(0.1)
    numberCoin = i + 1
    print(f'insert coin {numberCoin}')

  # success
  db.collection(u'transactions').document(transaction.document.id).update({
    u'status': 'success',
    u'updatedAt': firestore.SERVER_TIMESTAMP,
  })

def onSnapshot(col_snapshot, transactions, read_time):
  for transaction in transactions:
    if transaction.type.name == 'ADDED':
      processTransaction(transaction)

listener = db.collection(u'transactions').where(u'type', u'==', u'payment').where(u'arcadeId', u'==', arcadeId).where(u'status', u'==', u'pending').order_by(u'createdAt', u'DESCENDING').on_snapshot(onSnapshot)

while True:
  time.sleep(1)