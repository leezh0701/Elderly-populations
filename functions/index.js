import { Router } from 'itty-router';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SENDGRID_API_KEY = 'your_sendgrid_api_key_here';

const router = Router();

router.options('*', () => new Response(null, { headers: CORS_HEADERS }));

router.post('/sendEmail', async (request) => {
  try {
    const { to, subject, text } = await request.json();

    if (!to || !subject || !text) {
      return new Response('Missing required fields', { status: 400, headers: CORS_HEADERS });
    }

    const msg = {
      personalizations: [{ to: [{ email: to }] }],
      from: 'leezh0701@gmail.com',
      subject,
      text,
      html: `<strong>${text}</strong>`,
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(msg),
    });

    if (response.ok) {
      return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200, headers: CORS_HEADERS });
    } else {
      const error = await response.text();
      return new Response(`Failed to send email: ${error}`, { status: 500, headers: CORS_HEADERS });
    }
  } catch (error) {
    return new Response(`Server error: ${error.message}`, { status: 500, headers: CORS_HEADERS });
  }
});

router.post('/sendBulkEmail', async (request) => {
  try {
    const { emails, subject, text } = await request.json();

    if (!emails || emails.length === 0) {
      return new Response('No email addresses provided.', { status: 400, headers: CORS_HEADERS });
    }
    if (!subject || !text) {
      return new Response('Subject and text are required.', { status: 400, headers: CORS_HEADERS });
    }

    const msg = {
      personalizations: emails.map((email) => ({
        to: [{ email: email }],
      })),
      from: 'leezh0701@gmail.com',
      subject,
      text,
      html: `<strong>${text}</strong>`,
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(msg),
    });

    if (response.ok) {
      return new Response(JSON.stringify({ message: 'Bulk emails sent successfully' }), { status: 200, headers: CORS_HEADERS });
    } else {
      const error = await response.text();
      return new Response(`Failed to send emails: ${error}`, { status: 500, headers: CORS_HEADERS });
    }
  } catch (error) {
    return new Response(`Server error: ${error.message}`, { status: 500, headers: CORS_HEADERS });
  }
});

router.all('*', () => new Response('Not Found', { status: 404, headers: CORS_HEADERS }));

export default {
  async fetch(request) {
    return router.handle(request);
  },
};