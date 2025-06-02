const bcrypt = require('bcryptjs');

const testing = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('testing', salt);

    console.log(await bcrypt.compare('testinga', hash));
  } catch (err) {
    console.log(err);
  }
}

testing();