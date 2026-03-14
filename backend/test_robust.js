const url = 'http://localhost:3000/api/ai/chat';
console.log('Fetching', url);
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'hello', language: 'English' })
})
.then(res => { console.log('STATUS:', res.status); return res.text(); })
.then(txt => console.log('BODY:', txt))
.catch(err => console.error('ERROR:', err.message));
