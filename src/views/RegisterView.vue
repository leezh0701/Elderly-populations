<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const role = ref('user')
const usernameError = ref('')
const passwordError = ref('')

const register = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  // check username avaliable
  if (usernameError.value) {
    return
  }

  if (!passwordError.value) {
    users.push({ username: username.value, password: password.value, role: role.value })
    localStorage.setItem('users', JSON.stringify(users))
    alert('Registration successful!')
    router.push('/')
  }
}

// check username
const validateUsername = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.some((user) => user.username === username.value)) {
    usernameError.value = 'Username already exists!'
  } else {
    usernameError.value = ''
  }
}

// check password
const validatePassword = () => {
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/
  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long.'
  } else if (!specialCharPattern.test(password.value)) {
    passwordError.value = 'Password must contain at least one special character.'
  } else {
    passwordError.value = ''
  }
}
</script>

<template>
  <div class="register-container">
    <h2>Register</h2>
    <input v-model="username" placeholder="Username" @input="validateUsername" />
    <div v-if="usernameError" class="error">{{ usernameError }}</div>
    <input type="password" v-model="password" placeholder="Password" @input="validatePassword" />
    <div v-if="passwordError" class="error">{{ passwordError }}</div>
    <select v-model="role">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
    <button @click="register">Register</button>
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
