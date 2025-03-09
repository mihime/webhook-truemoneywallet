const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3331;

app.use(bodyParser.json());

//ใส่ secretKey - ที่ได้จาก ทรูมันนี้ 
const secretKey = '';


app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log("Received webhook payload:", payload);

  if (!payload.message) {
    console.error("No message found in payload");
    return res.status(400).json({ message: "No message found" });
  }

  const token = payload.message;

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);

    if (decoded.event_type === 'P2P' && decoded.amount > 0 && decoded.sender_mobile) {
      console.log(`Payment: ${decoded.amount} from ${decoded.sender_mobile}`);
    } else {
      console.log("Unhandled");
    }

    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error("verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(port, () => {
  console.log(`Server Port - ${port}`);
});
