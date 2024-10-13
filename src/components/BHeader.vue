<template>
  <div class="container">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header role="banner" class="header d-flex justify-content-between align-items-center py-3">
      <div class="d-flex flex-column align-items-center">
        <img src="@/assets/logo.png" alt="Logo" class="logo mb-1" />
        <span class="institution-name">Elderly Population</span>
      </div>

      <nav aria-label="Main Navigation" class="nav nav-pills">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/homepage" class="nav-link" active-class="active">Homepage</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/service" class="nav-link" active-class="active">Service</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/blog" class="nav-link" active-class="active">Blog</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact-us" class="nav-link" active-class="active">Contact Us</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin-page" class="nav-link" active-class="active">Admin Page</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/map" class="nav-link" active-class="active">Map</router-link>
          </li>
        </ul>
      </nav>

      <ul class="nav nav-pills ms-auto">
        <li class="nav-item">
          <button @click="handleAuthAction" class="nav-link btn btn-link">
            {{ isAuthenticated ? 'Logout' : 'Login' }}
          </button>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const auth = getAuth()
const db = getFirestore()
const router = useRouter()

const isAuthenticated = ref(false)
const isAdmin = ref(false)

const checkUserStatus = async () => {
  const user = auth.currentUser
  if (user) {
    isAuthenticated.value = true

    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const userData = userSnap.data()
      isAdmin.value = userData.role === 'admin'
    } else {
      console.error('No user data found in Firestore')
    }
  } else {
    isAuthenticated.value = false
    isAdmin.value = false
  }
}

const handleAuthAction = async () => {
  if (isAuthenticated.value) {
    await signOut(auth)
    isAuthenticated.value = false
    isAdmin.value = false
  } else {
    router.push('/login')
  }
}

onMounted(() => {
  checkUserStatus()
  auth.onAuthStateChanged(() => {
    checkUserStatus()
  })
})
</script>

<style scoped>
.header {
  background-color: #000;
  color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 4px 15px;
}

.logo {
  height: 40px;
  width: auto;
}

.institution-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 10px;
  padding: 0;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  padding: 4px 8px;
}

.nav-link:focus, .nav-link:hover {
  outline: 2px solid #ff9800;
  background-color: #333;
  border-radius: 5px;
  color: #fff;
}

button {
  padding: 4px 8px;
  color: #fff;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

.container {
  margin-top: 60px;
}
</style>