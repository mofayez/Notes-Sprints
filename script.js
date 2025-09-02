const root = document.documentElement;
const newBtn = document.getElementById('newBtn')
const themeBtn = document.getElementById('themeBtn')
const search = document.getElementById('search')

const editor = document.getElementById('editor')
const noteId = document.getElementById('noteId')
const titleInput = document.getElementById('title')
const bodyInput = document.getElementById('body')
const errors = document.getElementById('errors')
const saveBtn = document.getElementById('saveBtn')
const deleteBtn = document.getElementById('deleteBtn')
const cancelBtn = document.getElementById('cancelBtn')

const notesList = document.getElementById('list');


const KEY = "simple-notes-v1.0"
function loadStore() {
  try {

    const raw = localStorage.getItem(KEY);
    if (!raw) return { notes: [] }
    const data = JSON.parse(raw)

    if (!Array.isArray(data.notes)) return { notes: [] }

    data.notes = data.notes.map(n => ({
      id: String(n.id),
      title: String(n.title ?? ''),
      body: String(n.body ?? ''),
      createdAt: Number(n.createdAt ?? now()),
      updatedAt: Number(n.createdAt ?? now())
    }))

    return data;

  } catch (error) {
    
    return { notes: [] }
  }
}

const store = loadStore();


function validate({title, body}) {

  if (!title.trim()) return "Title is required!"
  if (!body.trim()) return "Body is required!"
  if (title > 120) return "Title must be 120 chars or less"
  if (body > 5000) return "Body must be 5000 chars or less"

  return '';
}

const now = () => Date.now()

function saveStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

function create({title, body}) {

  const id = String(now())
  const n = {
    id, title, body, createdAt: now(), updatedAt: now()
  }

  store.notes.push(n);
  saveStore(store);
}

function renderList(notes) {

  list.textContent = '';

  const frag = document.createDocumentFragment();

  for (const n of notes) {
    
    const li = document.createElement('li');
    li.className = 'note';
    li.dataset.id = n.id;

    const t = document.createElement('div');
    t.className = 'note__title';
    t.textContent = n.title || 'NO TITLE';
    li.appendChild(t);

    const b = document.createElement('div');
    b.className = 'note__body';
    b.textContent = n.body || 'NO BODY';
    li.appendChild(b);

    const meta = document.createElement('div');
    meta.className = 'note__meta';
    meta.textContent = 'Updated: ' + new Date(n.updatedAt).toLocaleString();
    li.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = "note__actions";

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn--ghost';
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn--danger';
    deleteBtn.textContent = 'Delete';

    actions.appendChild(editBtn)
    actions.appendChild(deleteBtn)
    li.appendChild(actions)

    frag.appendChild(li)
  }

  notesList.appendChild(frag);

}

function clearEditor() {
  noteId.value = '';
  titleInput.value = '';
  bodyInput.value = '';
  errors.value = '';
  deleteBtn.classList.add('hidden');
  cancelBtn.classList.add('hidden');
  titleInput.focus();
}

editor.addEventListener("submit", e => {

  e.preventDefault();

  // const id = noteId.value.trim()

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();


  const error = validate({title, body})
  errors.textContent = error;

  create({title, body});

  renderList(store.notes);
  clearEditor();

})


console.log(store);
renderList(store.notes);
clearEditor();