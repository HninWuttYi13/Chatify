export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Chatify</title>
  </head>

  <body style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #3f3f46;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fdf4ff;
  ">

    <!-- Header -->
    <div style="
      background: linear-gradient(to right, #4a044e, #86198f);
      padding: 35px;
      text-align: center;
      border-radius: 16px 16px 0 0;
    ">
      <img 
        src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg"
        alt="Chatify Logo"
        style="
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
          border-radius: 50%;
          background-color: white;
          padding: 10px;
        "
      />

      <h1 style="
        color: white;
        margin: 0;
        font-size: 28px;
        font-weight: 600;
      ">
        Welcome to Chatify 💬
      </h1>
    </div>

    <!-- Body -->
    <div style="
      background-color: #ffffff;
      padding: 35px;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    ">

      <p style="font-size: 18px; color: #4a044e;">
        <strong>Hello ${name},</strong>
      </p>

      <p>
        We're excited to have you join Chatify! Connect instantly with friends,
        share moments, and enjoy seamless real-time conversations.
      </p>

      <!-- Steps Box -->
      <div style="
        background-color: #f5d0fe;
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        border-left: 5px solid #4a044e;
      ">
        <p style="font-size: 16px; margin-bottom: 15px;">
          <strong>Get started in a few easy steps:</strong>
        </p>

        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;">Upload your profile picture</li>
          <li style="margin-bottom: 10px;">Add your contacts</li>
          <li style="margin-bottom: 10px;">Start chatting instantly</li>
          <li>Make audio calls and stay connected</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${clientURL}" style="
          background: linear-gradient(to right, #86198f, #4a044e);
          color: white;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 999px;
          font-weight: 600;
          display: inline-block;
        ">
          Open Chatify
        </a>
      </div>

      <p>If you need help, we're always here for you.</p>
      <p>Happy chatting! 🎉</p>

      <p style="margin-top: 25px;">
        Best regards,<br/>
        <strong>Chatify Team</strong>
      </p>

    </div>

    <!-- Footer -->
    <div style="
      text-align: center;
      padding: 20px;
      color: #a1a1aa;
      font-size: 12px;
    ">
      <p>© 2026 Chatify. All rights reserved.</p>

      <p>
        <a href="#" style="color: #86198f; text-decoration: none; margin: 0 10px;">
          Privacy Policy
        </a>
        <a href="#" style="color: #86198f; text-decoration: none; margin: 0 10px;">
          Terms of Service
        </a>
        <a href="#" style="color: #86198f; text-decoration: none; margin: 0 10px;">
          Contact
        </a>
      </p>
    </div>

  </body>
  </html>
  `;
}
