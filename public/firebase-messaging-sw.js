// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  'https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js'
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyBGCtxcCDpEPrT1FzsxobctGaRvGCa-cbA',
  authDomain: 'rela-test.firebaseapp.com',
  projectId: 'rela-test',
  storageBucket: 'rela-test.firebasestorage.app',
  messagingSenderId: '549182367379',
  appId: '1:549182367379:web:2ac11a2d9bb13f42848f66',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

//Enable for having a message with logo

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/reLaLogo.png',
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
