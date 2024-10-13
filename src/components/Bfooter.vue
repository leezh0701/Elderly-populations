<template>
  <footer class="contact-us">
    <h2>Contact Us</h2>
    <address aria-labelledby="contact-details">
      <p id="contact-details"><strong>Phone:</strong> +61 0123 456 789</p>
      <p><strong>Address:</strong> 1234 Victoria st, Melbourne, Australia</p>
    </address>
    <div class="social-media">
      <a href="https://facebook.com" target="_blank" aria-label="Visit our Facebook page">Facebook</a> |
      <a href="https://twitter.com" target="_blank" aria-label="Visit our Twitter profile">Twitter</a> |
      <a href="https://instagram.com" target="_blank" aria-label="Visit our Instagram profile">Instagram</a>
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

.social-media a:focus, .social-media a:hover {
  outline: 2px solid #ff9800;
  text-decoration: underline;
}
</style>
