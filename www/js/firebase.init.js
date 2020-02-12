angular.module('firebaseConfig', ['firebase'])

.run(function(){
  var firebaseConfig = {
    apiKey: "",
    authDomain: "grapebase-mobile.firebaseapp.com",
    databaseURL: "https://grapebase-mobile.firebaseio.com",
    projectId: "grapebase-mobile",
    storageBucket: "grapebase-mobile.appspot.com",
    messagingSenderId: "",
    appId: "1:21502601884:web:3507913bf28304472e1b59",
    measurementId: ""
  };
  firebase.initializeApp(firebaseConfig);
  var storage = firebase.storage();
  var auth = firebase.auth();
});
