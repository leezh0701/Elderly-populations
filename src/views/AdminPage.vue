<template>
  <div class="admin-page">
    <h1>Welcome to the Admin Page</h1>
    <p>This page is accessible only by users with admin privileges.</p>

    <div class="admin-functions">
      <h2>Admin Actions</h2>
      <ul>
        <li>Manage Users</li>
        <li>View Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  </div>
</template>

<script setup></script>

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

.admin-functions {
  margin-top: 20px;
}

.admin-functions h2 {
  margin-bottom: 10px;
}

.admin-functions ul {
  list-style: none;
  padding: 0;
}

.admin-functions li {
  background-color: #e9ecef;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>
