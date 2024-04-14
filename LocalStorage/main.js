let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let idx = JSON.parse(localStorage.getItem('idx')) || 0;
let totalCnt = JSON.parse(localStorage.getItem('totalCnt')) || 0;

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});

const items = document.querySelector('.item_list');
const input = document.querySelector('.foot_input');
const addBtn = document.querySelector('.foot_input_btn');
const title = document.querySelector('.main_title');

function renderTasks() {
  let existingIds = new Set();

  if (totalCnt === 0) {
    const noItemDesc = document.createElement('div');
    noItemDesc.classList.add('no_item_desc');
    noItemDesc.textContent = '추가된 상품이 없습니다 🥲';
    items.appendChild(noItemDesc);
  } else {
    while (items.firstChild) {
      items.removeChild(items.firstChild);
    }

    tasks.forEach(task => {
      if (!existingIds.has(task.id)) {
        const taskElement = createTaskElement(task.content, task.id);
        items.appendChild(taskElement);
        existingIds.add(task.id);
      }
    });
  }

  title.innerText = `🌟 현재 추가된 항목 (${totalCnt})`;
}

function deleteRenderTasks(idx) {
  const taskToRemove = document.getElementById(idx);
  if (taskToRemove) {
    items.removeChild(taskToRemove);
  }

  if (totalCnt === 0) {
    const noItemDesc = document.createElement('li');
    noItemDesc.classList.add('no_item_desc');
    noItemDesc.textContent = '추가된 상품이 없습니다 🥲';
    items.appendChild(noItemDesc);
  }
  title.innerText = `🌟 현재 추가된 항목 (${totalCnt})`;
}

function addTask() {
  const input_task = input.value;
  if (input_task === '') {
    return;
  }

  const newTask = {
    id: idx,
    content: input_task,
  };

  tasks.push(newTask);
  totalCnt++;
  idx++;
  updateLocalStorage();
  renderTasks();

  input.value = '';
  input.focus();
  scrollToBottom();
}

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('totalCnt', JSON.stringify(totalCnt));
  localStorage.setItem('idx', JSON.stringify(idx));
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  totalCnt--;

  updateLocalStorage();
  deleteRenderTasks(taskId);
}

function createTaskElement(content, taskId) {
  const task = document.createElement('li');
  task.id = taskId; // 고유한 ID 할당
  task.className = 'item';

  task.innerHTML = `
  <div>▶️ ${content}</div>
  <div><img onclick="deleteTask(${taskId})" class="item_remove_btn" src="./image/trash-svgrepo-com.svg" alt="" /></div>
  `;

  return task;
}

addBtn.addEventListener('click', () => addTask());
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    addTask();
  }
});

function scrollToBottom() {
  items.scrollTop = items.scrollHeight;
}

//

function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  hours = hours % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  const currentTimeElement = document.getElementById('current-time');
  currentTimeElement.textContent = timeString;
}

updateTime();

setInterval(updateTime, 60000);
