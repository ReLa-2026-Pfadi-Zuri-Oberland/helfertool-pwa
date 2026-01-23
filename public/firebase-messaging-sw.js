// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
// eslint-disable-next-line no-undef
importScripts(
  'https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js',
);
// eslint-disable-next-line no-undef
importScripts(
  'https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js',
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: 'AIzaSyCwy-FV4dcszTnmMdARKGrCVUIAfN1phqQ',
  authDomain: 'helfendentool-rela26.firebaseapp.com',
  projectId: 'helfendentool-rela26',
  storageBucket: 'helfendentool-rela26.firebasestorage.app',
  messagingSenderId: '576502766595',
  appId: '1:576502766595:web:7823335135438baa8a4236',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
// eslint-disable-next-line no-unused-vars, no-undef
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
