const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- YL Sport Admin Password Generator ---');
rl.question('Enter the password you want to use: ', (password) => {
  if (!password) {
    console.error('Password cannot be empty.');
    rl.close();
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  console.log('\nCopy the following line to your .env file:');
  console.log('------------------------------------------------');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('------------------------------------------------');
  console.log(`(Password used: "${password}")`);

  rl.close();
});

