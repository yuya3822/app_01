import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyArSa1_P5OWlrwNjC-H0Fpmo-nQJ0qp3bo",
      authDomain: "modern-dev.firebaseapp.com",
      projectId: "modern-dev",
      storageBucket: "modern-dev.appspot.com",
      messagingSenderId: "912186124739",
      appId: "1:912186124739:web:4301607e391eb8ea447576"
    }
  )
}

export default firebase