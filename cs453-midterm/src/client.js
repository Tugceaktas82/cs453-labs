// quick script to hit all the endpoints of my Course Task Tracker API
// uses the built-in fetch (Node 18+) so no extra packages needed
// run: node src/client.js (make sure the server is running first with npm start)

const BASE_URL = 'http://localhost:3000';

async function main() {
  //health check
  console.log('--- GET /health ---');
  let res = await fetch(`${BASE_URL}/health`);
  console.log('Status:', res.status);
  console.log(await res.json());

  //create a task
  console.log('\n--- POST /api/tasks (create) ---');
  res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Prepare exam submission', course: 'CS453' }),
  });
  console.log('Status:', res.status);
  const created = await res.json();
  console.log(created);

  //list all tasks
  console.log('\n--- GET /api/tasks (list all) ---');
  res = await fetch(`${BASE_URL}/api/tasks`);
  console.log('Status:', res.status);
  console.log(await res.json());

  //get the one we just created
  console.log(`\n--- GET /api/tasks/${created.id} (get one) ---`);
  res = await fetch(`${BASE_URL}/api/tasks/${created.id}`);
  console.log('Status:', res.status);
  console.log(await res.json());

  //update it (PATCH, just marking it completed)
  console.log(`\n--- PATCH /api/tasks/${created.id} (update) ---`);
  res = await fetch(`${BASE_URL}/api/tasks/${created.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true }),
  });
  console.log('Status:', res.status);
  console.log(await res.json());

  //delete it
  console.log(`\n--- DELETE /api/tasks/${created.id} (delete) ---`);
  res = await fetch(`${BASE_URL}/api/tasks/${created.id}`, { method: 'DELETE' });
  console.log('Status:', res.status);
}

main().catch((err) => {
  console.error('Client error:', err);
  process.exit(1);
});