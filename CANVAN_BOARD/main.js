let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ================================================================================================

//dummy
const OXItems = [
  { id: '1', text: '제 이름은 윤동훈입니다.', answer: 'o' },
  { id: '2', text: '저는 1996년생입니다', backgroundColor: '#d83434', answer: 'o' },
  { id: '3', text: '저는 현재 강북구에 살고있습니다', backgroundColor: '#38667f', answer: 'o' },
  { id: '4', text: '저는 현재 강북구에 살고있습니다', backgroundColor: '#38667f', answer: 'o' },
  { id: '5', text: '저는 현재 강북구에 살고있습니다', backgroundColor: '#38667f', answer: 'o' },
  { id: '6', text: 'Click at me', backgroundColor: '#9f7db1', answer: 'x' },
  { id: '7', text: 'Click at me', backgroundColor: '#ff5722', answer: 'x' },
  { id: '8', text: 'Click at me', backgroundColor: '#009688', answer: 'x' },
  { id: '9', text: 'Click at me', backgroundColor: '#009688', answer: 'x' },
  { id: '10', text: 'Click at me', backgroundColor: '#009688', answer: 'x' },
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
        answer: item.answer,
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
  event.dataTransfer.setData('text/plain', event.target.id);
}

function allowDrop(event) {
  event.preventDefault();

  const sectionClass = event.target.classList;

  if (sectionClass.contains('o_drop_main')) {
    event.target.style.background = '#1d4ed8bf';
  } else if (sectionClass.contains('x_drop_main')) {
    event.target.style.background = '#ff0000bf';
  }
}

function handleDragLeave(event) {
  // 해당 영역의 스타일을 초기화합니다.
  if (event.target.tagName === 'BUTTON') {
    return;
  }
  event.target.style.backgroundColor = '';
}

function drop(event, columnId) {
  event.preventDefault();

  // 드롭된 섹션의 스타일을 되돌립니다.
  if (event.target.tagName === 'BUTTON') {
  } else {
    event.target.style.backgroundColor = '';
  }

  const data = event.dataTransfer.getData('text/plain');
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

const dropSections = document.querySelectorAll('.o_drop_main, .x_drop_main');
dropSections.forEach(section => {
  section.addEventListener('dragenter', allowDrop);
  section.addEventListener('dragover', allowDrop);
  section.addEventListener('dragleave', handleDragLeave);
});

function updateTaskStatus(taskId, newStatus) {
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, status: newStatus };
    }
    return task;
  });
  updateLocalStorage();
}

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

// 채점 - 제출 로직

const submitBtn = document.querySelector('.submit_btn');
submitBtn.addEventListener('click', submitAnswer);

function submitAnswer() {
  if (!isAllItemDrop()) {
    openModal();
    return;
  }

  const oneScore = Math.floor(100 / tasks.length);
  let score = 0;
  let answerSheet = [];

  tasks.forEach(item => {
    const newAnswer = {
      id: item.id,
      content: item.content,
      isCorrect: null,
    };
    if (item.status[0] === item.answer) {
      score += oneScore;
      newAnswer.isCorrect = true;
    } else {
      newAnswer.isCorrect = false;
    }

    answerSheet.push(newAnswer);
  });

  localStorage.setItem('score', score);
  localStorage.setItem('answerSheet', JSON.stringify(answerSheet));
}

function isAllItemDrop() {
  let flag = true;
  for (const item of tasks) {
    if (item.status === 'quiz_items') {
      flag = false;
      break;
    }
  }

  return flag;
}

// Modal

const modal = document.getElementById('myModal');

function openModal() {
  modal.style.display = 'block';

  let cnt = 0;
  tasks.forEach(item => {
    if (item.status === 'quiz_items') {
      cnt++;
    }
  });

  const showLeftTask = document.querySelector('.modal_bottom div');
  showLeftTask.innerHTML = `남은 문항 ( <span style="color: #ff0000;">${cnt}</span> / ${tasks.length} )`;

  document.querySelector('.modal_bottom').appendChild(showLeftTask);
  setTimeout(() => {
    closeModal();
  }, 3000);
}

function closeModal() {
  modal.style.display = 'none';
}

// 모달 외부를 클릭하면 닫는 코드
window.onclick = function (event) {
  var modal = document.getElementById('myModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
