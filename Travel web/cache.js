const redis = require("redis");
const client = redis.createClient();

app.get('/api/posts', (req, res) => {
  const cacheKey = 'posts';

  client.get(cacheKey, (err, data) => {
    if (err) throw err;

    if (data) {
      return res.json(JSON.parse(data));
    } else {
      // Fetch data from your database
      fetchDataFromDatabase((err, result) => {
        if (err) throw err;

        client.setex(cacheKey, 3600, JSON.stringify(result));
        return res.json(result);
      });
    }
  });
});
