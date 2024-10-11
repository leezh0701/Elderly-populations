import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Import Vuetify
import vuetify from './plugins/vuetify'
import 'vuetify/styles'

// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import store from './store' 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzV2RhEh1jayg5xHEwPzwF7uhmX1CNWeU",
  authDomain: "fit5032-a3-1764f.firebaseapp.com",
  projectId: "fit5032-a3-1764f",
  storageBucket: "fit5032-a3-1764f.appspot.com",
  messagingSenderId: "1007193921168",
  appId: "1:1007193921168:web:b101a6faaf866242602a15"
};

// Initialize Firebase and Firestore
const firebaseApp = initializeApp(firebaseConfig); 
const db = getFirestore(firebaseApp); 
const auth = getAuth(firebaseApp); 

const app = createApp(App)

// Use PrimeVue with theme
app.use(PrimeVue, { theme: { preset: Aura } })

// Use Vuetify
app.use(vuetify)

// Use router and store
app.use(router)
app.use(store)

// Firebase Auth State Change Listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid); 
      const userSnap = await getDoc(userRef); 
      if (userSnap.exists()) {
        const userData = userSnap.data();
        store.commit('setUser', { uid: user.uid, role: userData.role }); 
      } else {
        console.error('User data not found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    store.commit('clearUser'); 
  }
});

// Mount the app
app.mount('#app')

// Export Firestore instance
export { db };
