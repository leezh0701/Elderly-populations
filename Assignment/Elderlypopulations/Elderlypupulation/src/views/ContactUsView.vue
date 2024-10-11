<template>
  <div class="contact-us">
    <h1>Contact Us</h1>
    <p>If you have any questions, please feel free to reach out to us!</p>

    <form @submit.prevent="sendEmail" class="contact-form">
      <div class="form-group">
        <label for="email">Your Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="subject">Subject:</label>
        <input v-model="subject" type="text" id="subject" required />
      </div>

      <div class="form-group">
        <label for="message">Message:</label>
        <textarea v-model="message" id="message" required></textarea>
      </div>

      <div class="form-group">
        <label for="attachment">Attachment (optional):</label>
        <input type="file" @change="onFileChange" />
      </div>

      <button type="submit" class="btn btn-primary">Send Email</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const subject = ref('')
const message = ref('')
const file = ref(null)

const onFileChange = (event) => {
  file.value = event.target.files[0]
}

const sendEmail = async () => {
  const formData = new FormData()
  formData.append('to', email.value)
  formData.append('subject', subject.value)
  formData.append('text', message.value)

  if (file.value) {
    formData.append('attachmentPath', file.value)
  }

  try {
    const response = await fetch('https://us-central1-fit5032-a3-1764f.cloudfunctions.net/sendEmail', {
      method: 'POST',
      body: JSON.stringify({
        to: email.value,
        subject: subject.value,
        text: message.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (response.ok) {
      alert('Email sent successfully!');
    } else {
      alert('Failed to send email: ' + result.error);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Error sending email');
  }
}
</script>

<style scoped>
.contact-us {
  padding: 20px;
  text-align: center;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: start;
}

input, textarea, button {
  padding: 10px;
  font-size: 16px;
  width: 100%;
}

button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>
