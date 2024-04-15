let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ================================================================================================

//dummy
const OXItems = [
  { id: '1', text: '제 이름은 윤동훈입니다.' },
  { id: '2', text: '저는 1996년생입니다', backgroundColor: '#d83434' },
  { id: '3', text: '저는 현재 강북구에 살고있습니다', backgroundColor: '#38667f' },
  { id: '4', text: '저는 현재 강북구에 살고있습니다', backgroundColor: '#38667f' },
  { id: '5', text: '저는 현재 강북구에 살고있습니다', backgroundColor: '#38667f' },
  { id: '6', text: 'Click at me', backgroundColor: '#9f7db1' },
  { id: '7', text: 'Click at me', backgroundColor: '#ff5722' },
  { id: '8', text: 'Click at me', backgroundColor: '#009688' },
  { id: '9', text: 'Click at me', backgroundColor: '#009688' },
  { id: '10', text: 'Click at me', backgroundColor: '#009688' },
];

// ================================================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});

function renderTasks() {
  if (!tasks.length) {
    OXItems.forEach(item => {
      const newTask = {
        id: item.id,
        content: item.text,
        backgroundColor: item.backgroundColor,
        status: 'quiz_items',
      };
      tasks.push(newTask);
    });
  }

  const columns = ['quiz_items', 'o_section', 'x_section'];

  columns.forEach(columnId => {
    const column = document.querySelector(`.${columnId}`);
    column.innerHTML = '';

    tasks.forEach(task => {
      if (task.status === columnId) {
        const taskElement = createTaskElement(task.content, task.id, task.backgroundColor);
        taskElement.addEventListener('dragstart', drag);
        column.appendChild(taskElement);
      }
    });
  });
}

// item_btn 이라는 클래스를 가지는 요소를 전부 가져와서
const itemBtnList = document.querySelectorAll('.item_btn');

// 돔이 Load 될 떄, 해당 아이템들에게 drag 이벤트 걸어줌
window.addEventListener('DOMContentLoaded', () => {
  itemBtnList.forEach(item => {
    item.addEventListener('dragstart', drag);
  });
});

function drag(event) {
  console.log(event.target);
  event.dataTransfer.setData('text/plain', event.target.id);
}

// 이벤트 전파 막기
function allowDrop(event) {
  event.preventDefault();
}

//
function drop(event, columnId) {
  event.preventDefault();
  console.log(columnId);
  const data = event.dataTransfer.getData('text/plain');
  console.log(data);
  const draggedElement = document.getElementById(data);

  const taskStatus = columnId;
  if (draggedElement) {
    // 이벤트 발생 타겟이 button 이면 button의 부모태그에 append => 이거 안해주면 버튼안에 버튼 들어감
    if (event.target.tagName === 'BUTTON') {
      updateTaskStatus(data, taskStatus);
      event.target.parentNode.appendChild(draggedElement);
      return;
    }
    updateTaskStatus(data, taskStatus);
    event.target.appendChild(draggedElement);
  }
}

// FIXME:
function updateTaskStatus(taskId, newStatus) {
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, status: newStatus };
    }
    return task;
  });
  updateLocalStorage();
}

//   FIXME:
function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(content, id, backgroundColor) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = content;
  button.className = 'item_btn';
  button.draggable = true;
  if (backgroundColor) {
    button.style.backgroundColor = backgroundColor;
  }

  return button;
}
