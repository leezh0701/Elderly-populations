<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="admin-page">
    <v-container class="admin-container">
      <!-- Welcome card -->
      <v-card elevation="3" class="admin-card">
        <v-card-title>
          <h1>Welcome to the Admin Page</h1>
          <p v-if="currentUser && currentUser.role === 'admin'">You are logged in as an Admin.</p>
          <p v-else-if="currentUser">You are logged in as a regular user.</p>
          <p v-else>Loading user information...</p>
        </v-card-title>
        <v-card-text>
          <p>This page is accessible only by users with admin privileges.</p>
        </v-card-text>
      </v-card>

      <!-- Dashboard card -->
      <v-card v-if="currentUser && currentUser.role === 'admin'" elevation="3" class="dashboard-card">
        <v-card-title>
          <h2>Admin Dashboard</h2>
        </v-card-title>
        <v-card-text>
          <div class="dashboard">
            <div class="stat-card">
              <h3>Total Users: {{ totalUsers }}</h3>
            </div>
            <div class="stat-card">
              <h3>Admin Users: {{ adminUsers }}</h3>
            </div>
            <div class="stat-card">
              <h3>Regular Users: {{ regularUsers }}</h3>
            </div>
            <div class="stat-card">
              <h3>Total Appointments: {{ totalAppointments }}</h3>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Manage Users card -->
      <v-card v-if="currentUser && currentUser.role === 'admin' && users.length" elevation="3" class="user-management-card">
        <v-card-title>
          <h2>Manage Users</h2>
        </v-card-title>
        <v-card-actions>
          <v-btn @click="exportToCSV" color="primary" class="styled-button" outlined>Export Users to CSV</v-btn>
          <v-btn @click="exportToPDF" color="secondary" class="styled-button" outlined>Export Users to PDF</v-btn>
          <v-btn @click="sendBulkEmail" color="success" class="styled-button" outlined>Send Bulk Email</v-btn>
        </v-card-actions>

        <v-data-table
          :headers="userHeaders"
          :items="users"
          class="elevation-1 user-table"
          item-key="id"
          :items-per-page="5"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn @click="selectUser(item)" small color="primary" outlined class="styled-button">
              {{ selectedUsers.includes(item) ? 'Unselect' : 'Select' }}
            </v-btn>
            <v-btn @click="updateRole(item.id, 'admin')" small color="success" outlined class="styled-button">Make Admin</v-btn>
            <v-btn @click="updateRole(item.id, 'user')" small color="warning" outlined class="styled-button">Make User</v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- Loading or Access Denied message -->
      <v-card v-else elevation="3" class="loading-card">
        <v-card-text>
          <p>This page is only accessible to administrators.</p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import axios from 'axios';

const users = ref([]);
const selectedUsers = ref([]);
const currentUser = ref(null);
const db = getFirestore();

const totalUsers = ref(0);
const adminUsers = ref(0);
const regularUsers = ref(0);
const totalAppointments = ref(0);

onMounted(() => {
  const user = getAuth().currentUser;
  if (user) {
    const userDoc = getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
      if (docSnap.exists()) {
        currentUser.value = { id: user.uid, ...docSnap.data() };
      }
    });

    const bookingsQuery = collection(db, 'bookings');
    onSnapshot(bookingsQuery, (snapshot) => {
      totalAppointments.value = snapshot.size; 
      console.log('Total Appointments:', totalAppointments.value); // 调试日志
    });

    onSnapshot(collection(db, 'users'), (snapshot) => {
      totalUsers.value = snapshot.size;
      adminUsers.value = 0;
      regularUsers.value = 0;
      users.value = [];
      
      snapshot.forEach(doc => {
        users.value.push({ id: doc.id, ...doc.data() });
        if (doc.data().role === 'admin') {
          adminUsers.value++;
        } else {
          regularUsers.value++;
        }
      });
    });
  }
});

const userHeaders = ref([
  { text: 'Username', value: 'username' },
  { text: 'Role', value: 'role' },
  { text: 'Actions', value: 'actions', sortable: false }
]);

const updateRole = async (userId, newRole) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role: newRole });
  alert(`User role updated to ${newRole}!`);
};

const selectUser = (user) => {
  const index = selectedUsers.value.findIndex(u => u.id === user.id);
  if (index === -1) {
    selectedUsers.value.push(user);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

const sendBulkEmail = async () => {
  if (currentUser.value.role !== 'admin') {
    alert("You don't have permission to send emails.");
    return;
  }

  if (selectedUsers.value.length === 0) {
    alert("Please select at least one user to send an email.");
    return;
  }

  const emails = selectedUsers.value.map(user => user.username).filter(username => username);

  try {
    await axios.post('https://us-central1-fit5032-a3-1764f.cloudfunctions.net/sendBulkEmail', {
      emails
    });
    alert('Bulk emails sent successfully!');
  } catch (error) {
    alert('Failed to send bulk emails: ' + error.message);
  }
};

const exportToCSV = () => {
  const csvContent = [
    ["Username", "Role"],
    ...users.value.map(user => [user.username, user.role])
  ].map(e => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, "users_list.csv");
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("User List", 10, 10);
  let yOffset = 20;

  users.value.forEach((user, index) => {
    doc.text(`${index + 1}. Username: ${user.username}, Role: ${user.role}`, 10, yOffset);
    yOffset += 10;
  });

  doc.save("users_list.pdf");
};
</script>

<style scoped>
.admin-page {
  background-color: #f0f2f5;
  min-height: 100vh;
  padding-top: 60px;
}

.admin-container {
  max-width: 900px;
  margin: 0 auto;
}

.admin-card,
.dashboard-card,
.user-management-card,
.loading-card {
  margin-bottom: 20px;
  padding: 20px;
}

.dashboard {
  display: flex;
  gap: 20px;
}

.stat-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h1, h2 {
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
}

.styled-button {
  margin-right: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #000;
  color: #fff;
  border: 2px solid #000;
}

.styled-button:hover {
  background-color: #444;
  cursor: pointer;
}

.user-table {
  margin-top: 20px;
}
</style>
