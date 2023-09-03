// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "replace-with-your-client-api-key",
	authDomain: "your-project.firebaseapp.com",
	databaseURL:
		"https://your-project-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "your-project",
	storageBucket: "your-project.appspot.com",
	messagingSenderId: "your-sender-id",
	appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
