import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import pyrebase

from helper.config import firebaseConfig
from helper.login import email, password

DIRECTORY = "./folder"

class Watcher:

    def __init__(self, directory=".", handler=FileSystemEventHandler()):
        self.observer = Observer()
        self.handler = handler
        self.directory = directory

    def run(self):
        self.observer.schedule(
            self.handler, self.directory, recursive=True)
        self.observer.start()
        print("\nWatcher Running in {}/\n".format(self.directory))
        try:
            while True:
                time.sleep(1)
        except:
            self.observer.stop()
        self.observer.join()
        print("\nWatcher Terminated\n")


class MyHandler(FileSystemEventHandler):

    def on_any_event(self, event):
        if event.event_type == "created" and event.src_path[-4:] == ".txt":
            f = open(event.src_path, "r")
            print(f.read())
        else:
            print("[{}] INFO: [{}] on: [{}] [No further action]".format(
                time.asctime(), event.event_type, event.src_path
                )
            )

if __name__=="__main__":
    # Initialize watcher
    w = Watcher(DIRECTORY, MyHandler())

    # Initialize Firebase
    firebase = pyrebase.initialize_app(firebaseConfig)
    # Authenticate user
    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password(email, password)

    # Run watcher
    w.run()