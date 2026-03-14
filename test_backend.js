fetch('http://localhost:3000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'hello', language: 'English' })
})
.then(res => { console.log('STATUS 3000:', res.status); return res.text(); })
.then(console.log)
.catch(console.error);
