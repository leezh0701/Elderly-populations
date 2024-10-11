<template>
  <div class="admin-page">
    <h1>Welcome to the Admin Page</h1>
    <p>This page is accessible only by users with admin privileges.</p>

    <div v-if="users.length" class="user-management">
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="updateRole(user.id, 'admin')">Make Admin</button>
              <button @click="updateRole(user.id, 'user')">Make User</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Loading users...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'

const users = ref([])
const db = getFirestore()

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'users'))
  querySnapshot.forEach((doc) => {
    users.value.push({ id: doc.id, ...doc.data() })
  })
})

const updateRole = async (userId, newRole) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { role: newRole })
  alert(`User role updated to ${newRole}!`)
}
</script>

<style scoped>
.admin-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.user-management {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}

button {
  padding: 5px 10px;
  margin-right: 5px;
}
</style>
