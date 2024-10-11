<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth' 
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  age: '',
  address: '',
  gender: '',
  region: ''
})

const errors = ref({
  username: null,
  password: null,
  general: null
})

const auth = getAuth()
const db = getFirestore()

const register = () => {
  validateName(true)
  validatePassword(true)

  if (!errors.value.username && !errors.value.password) {
    createUserWithEmailAndPassword(auth, formData.value.username, formData.value.password)
      .then(async (userCredential) => {
        const user = userCredential.user
        
        await setDoc(doc(db, 'users', user.uid), {
          username: formData.value.username,
          role: 'user',
          age: formData.value.age,
          address: formData.value.address,
          gender: formData.value.gender,
          region: formData.value.region
        })

        alert('Registration successful!')
        router.push('/homepage') 
      })
      .catch((error) => {
        errors.value.general = error.message || 'Registration failed.'
      })
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    age: '',
    address: '',
    gender: '',
    region: ''
  }
  errors.value.general = null
}

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  if (formData.value.password.length < 8) {
    if (blur) errors.value.password = 'Password must be at least 8 characters long.'
  } else {
    errors.value.password = null
  }
}
</script>

<template>
  <div class="register-container">
    <h2>Register</h2>
    <input v-model="formData.username" placeholder="Email" />
    <div v-if="errors.username" class="error">{{ errors.username }}</div>
    <input type="password" v-model="formData.password" placeholder="Password" @input="validatePassword" />
    <div v-if="errors.password" class="error">{{ errors.password }}</div>

    <input v-model="formData.age" placeholder="Age (optional)" />
    <input v-model="formData.address" placeholder="Address (optional)" />
    <select v-model="formData.gender">
      <option value="">Select Gender (optional)</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    <input v-model="formData.region" placeholder="Region (optional)" />

    <button @click="register">Register</button>
    <button @click="clearForm">Clear</button>

    <div v-if="errors.general" class="error">{{ errors.general }}</div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  gap: 10px;
}

input,
select,
button {
  width: 200px;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 0.9em;
}
</style>
