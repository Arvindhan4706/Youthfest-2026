import fetch from 'node-fetch';
const run = async () => {
  const res = await fetch('http://localhost:3000/api/send-od', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Avinash S',
      email: 'arvindhan2005@gmail.com', // Setting this for testing purposes, but normally we'd fetch the exact email
      phone: '1234567890',
      college: 'Chennai Institute of Technology',
      department: 'CSE',
      eventTitle: 'Squid Game'
    })
  });
  console.log(await res.json());
};
run();
