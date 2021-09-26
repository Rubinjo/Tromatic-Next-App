# Sender component

<p align="center">
  <a aria-label="Python_shield" href="https://www.python.org/" target="_blank">
    <img alt="Made with Python" src="http://ForTheBadge.com/images/badges/made-with-python.svg" target="_blank" />
  </a>
</p>

## Setup

1. Use Python 3.6+
2. Execute the following command to install required packages:

```
pip install -r ./helper/requirements.txt
```

3. Create a config.py file within the helper folder with the Firebase configuration, like the following:

```
firebaseConfig = {
  "apiKey": "apiKey",
  "authDomain": "projectId.firebaseapp.com",
  "databaseURL": "https://databaseName.firebasedatabase.app",
  "projectId": "projectId",
  "storageBucket": "projectId.appspot.com",
  "messagingSenderId": "messagingSenderId",
  "appId": "appId"
}
```

4. Create a login.py file within the helper folder with login credentials for Firebase, like the following:

```
email = "email"
password = "password"
```
