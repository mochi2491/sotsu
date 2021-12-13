#!/usr/bin/env python3

from firebase_admin import firestore
from firebase_admin import credentials
import firebase_admin
from websocket_server import WebsocketServer
import time
import os
users = {}
rooms = {}
userDatas = {}

cred = credentials.Certificate(
    'sample-3a85c-firebase-adminsdk-8f6p8-284203a193.json')
app = firebase_admin.initialize_app(cred)

db = firestore.client()

user_ref = db.collection(u'user')


def start():

    # クライアントが接続してきた時のイベント
    def new_client(client, server):
        print('New client {}:{} has joined.'.format(
            client['address'][0], client['address'][1]))
        server.send_message(client, 'login')

        # usersにユーザーを追加
        global users
        users[client['id']] = {"state": 0, "room": None,
                               "ID": client['id'], "Admin": False}

    # クライアントが切断した時のイベント
    def client_left(client, server):
        global users
        global rooms
        print('Client {}:{} has left.'.format(
            client['address'][0], client['address'][1]))
        if users[client['id']]["state"] != 0:
            rooms.pop(users[client['id']]["room"])
        users.pop(client['id'])
        print(client['address'], "closed")

    # クライアントからのメッセージを受信した時のイベント
    def message_received(client, server, message):

        # server.send_message(client,message)
        # server.send_message_to_all(message)
        global users
        global rooms

        if users[client['id']]["state"] == 0:
            users[client['id']]["room"] = message
            if message not in rooms:
                hoge = user_ref.where(u'id', u'==', message)
                docs = hoge.stream()
                for doc in docs:
                    print(u'{}={}'.format(doc.id, doc.to_dict()))
                rooms[message] = []
                print("make room", message)
            rooms[message].append(client)
            print(client['address'], "join room", message)
            print(rooms)
            users[client['id']]["state"] = 1
        elif users[client['id']]["state"] == 1:
            for speaker in rooms[users[client['id']]["room"]]:
                print(speaker)
                if client != speaker:
                    print("send")
                    server.send_message(speaker, message)
            print("room", users[client['id']],
                  client['address'], "send", message)
    # 10005番ポートでサーバーを立ち上げる
    server = WebsocketServer(port=10005, host='0.0.0.0')
    # イベントで使うメソッドの設定
    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    server.set_fn_message_received(message_received)
    # 実行
    server.run_forever()


if __name__ == "__main__":
    start()
