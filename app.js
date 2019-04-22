const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')[1];
    req.token = bearer;
    next();
  } else {
    res.sendStatus(403);
  };
};

app.get('/api', (req, res) => {
  res.json({
    message: 'welcome to the api'
  });
});

app.post('/api/posts', verifyToken, async (req, res) => {
  try {
    const authData = await jwt.verify(req.token, 'secretkey');
    await res.json({
      message: 'post created',
      authData,
    });
  } catch (err) {
    res.sendStatus(403);
  };
});

app.listen(5000, () => {
  console.log('server running on 5000');
});

app.post('/api/login', async (req, res) => {
  const userData = {
    id: 1,
    username: 'james',
    email: 'senbce@gmail.com',
  };
  try {
    const token = await jwt.sign({ user: userData }, 'secretkey', { expiresIn: '30s' });
    await res.json({ token });
  } catch (err) {
    console.log(err);
  }
});
