/**
 * client.js
 *
 * A basic Node.js client that exercises the Course Task Tracker API.
 * Uses the built-in fetch (Node 18+), no extra dependencies needed.
 *
 * Run:  node src/client.js
 * (Make sure the server is running first: npm start)
 */

const BASE_URL = 'http://localhost:3000';

async function main() {
  // 1. Health check
  console.log('--- GET /health ---');
  let res = await fetch(`${BASE_URL}/health`);
  console.log('Status:', res.status);
  console.log(await res.json());

  // 2. Create a task
  console.log('\n--- POST /api/tasks (create) ---');
  res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Prepare exam submission', course: 'CS453' }),
  });
  console.log('Status:', res.status);
  const created = await res.json();
  console.log(created);

  // 3. List all tasks
  console.log('\n--- GET /api/tasks (list all) ---');
  res = await fetch(`${BASE_URL}/api/tasks`);
  console.log('Status:', res.status);
  console.log(await res.json());

  // 4. Get one task by id
  console.log(`\n--- GET /api/tasks/${created.id} (get one) ---`);
  res = await fetch(`${BASE_URL}/api/tasks/${created.id}`);
  console.log('Status:', res.status);
  console.log(await res.json());

  // 5. Update the task (partial update via PATCH)
  console.log(`\n--- PATCH /api/tasks/${created.id} (update) ---`);
  res = await fetch(`${BASE_URL}/api/tasks/${created.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true }),
  });
  console.log('Status:', res.status);
  console.log(await res.json());

  // 6. Delete the task
  console.log(`\n--- DELETE /api/tasks/${created.id} (delete) ---`);
  res = await fetch(`${BASE_URL}/api/tasks/${created.id}`, { method: 'DELETE' });
  console.log('Status:', res.status);

  // Bonus check: confirm it's really gone
  console.log(`\n--- GET /api/tasks/${created.id} (should now 404) ---`);
  res = await fetch(`${BASE_URL}/api/tasks/${created.id}`);
  console.log('Status:', res.status);
  console.log(await res.json());
}

main().catch((err) => {
  console.error('Client error:', err);
  process.exit(1);
});
