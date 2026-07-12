//app.js
const API_BASE_URL = window.location.hostname.includes("app.github.dev")
  ? window.location.origin.replace("-5173", "-3000")
  : "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const itemList = document.querySelector("#items");
const form = document.querySelector("#add-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const statusBox = document.querySelector("#status");

function setStatus(message) {
  statusBox.textContent = message;
}

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = `${item.id}: ${item.name} (${item.quantity}) `;
    li.appendChild(label);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(item));
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteItem(item.id));
    li.appendChild(deleteBtn);

    itemList.appendChild(li);
  }
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);

    if (!response.ok) {
      throw new Error(`GET /api/items failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function addItem(name, quantity) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function updateItem(id, name, quantity) {
  setStatus("Updating item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `PUT /api/items/${id} failed with status ${response.status}`);
    }

    setStatus(`Updated item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteItem(id) {
  setStatus("Deleting item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "DELETE"
    });

    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      throw new Error(data.message ?? `DELETE /api/items/${id} failed with status ${response.status}`);
    }

    setStatus(`Deleted item ${id}.`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

function startEdit(item) {
  itemNameInput.value = item.name;
  itemQuantityInput.value = item.quantity;
  form.dataset.editingId = item.id;
  setStatus(`Editing item ${item.id}. Submit the form to save changes.`);
}

loadButton.addEventListener("click", loadItems);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  const editingId = form.dataset.editingId;

  itemNameInput.value = "";
  itemQuantityInput.value = "0";

  if (editingId) {
    delete form.dataset.editingId;
    await updateItem(Number(editingId), name, quantity);
  } else {
    await addItem(name, quantity);
  }
});