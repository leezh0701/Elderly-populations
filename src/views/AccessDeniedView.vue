<template>
  <div class="access-denied">
    <h1>Access Denied</h1>
    <p>You do not have access to this page. Please <router-link to="/login">login</router-link>.</p>
  </div>
</template>

<script setup></script>

<style scoped>
.access-denied {
  padding: 50px;
  text-align: center;
  margin-top: 50px;
}
</style>
