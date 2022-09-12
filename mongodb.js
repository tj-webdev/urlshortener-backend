const mongoose = require('mongoose');

const dbConnect =  async (DB_URL) => {
  await mongoose.connect(DB_URL);
}

module.exports = dbConnect;