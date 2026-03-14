fetch('http://localhost:5175/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'hello', language: 'English' })
})
.then(res => { console.log('STATUS:', res.status); return res.text(); })
.then(console.log)
.catch(console.error);
