<template>
  <footer class="contact-us">
    <h2>Contact Us</h2>
    <p><strong>Phone:</strong> +61 0123 456 789</p>
    <p><strong>Address:</strong> 1234 Victoria st, Melbourne, Australia</p>
    <div class="social-media">
      <a href="https://facebook.com" target="_blank">Facebook</a> |
      <a href="https://twitter.com" target="_blank">Twitter</a> |
      <a href="https://instagram.com" target="_blank">Instagram</a>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.contact-us {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
  text-align: center;
}

.contact-us h2 {
  margin-bottom: 10px;
}

.contact-us p {
  margin: 5px 0;
}

.social-media a {
  margin: 0 5px;
  color: #007bff;
  text-decoration: none;
}

.social-media a:hover {
  text-decoration: underline;
}
</style>
