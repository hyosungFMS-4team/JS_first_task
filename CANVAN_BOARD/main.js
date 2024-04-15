let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// task 먼저 넣어주고 => 들어가있는 id 값들 저장해놨다가 걔네들만 빼고 quiz_items에 남은 애들 넣어주면 될듯?

// ================================================================================================
// OX 항목들 최초에 넣어주기

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

OXItems.forEach(buttonInfo => {
  const button = document.createElement('button');
  button.id = buttonInfo.id;
  button.textContent = buttonInfo.text;
  button.className = 'item_btn';
  button.draggable = true;
  if (buttonInfo.backgroundColor) {
    button.style.backgroundColor = buttonInfo.backgroundColor;
  }

  document.querySelector('.quiz_items').appendChild(button);
});

// ================================================================================================

document.addEventListener('DOMContentLoaded', () => {
  //   renderTasks();
});

// function renderTasks() {
//   const columns = ['quiz_items', 'o_section', 'x_section'];

//   columns.forEach(columnId => {
//     const column = document.getElementById(columnId);
//     // column.querySelector('.task-container').innerHTML = '';
//     column.innerHTML = '';

//     tasks.forEach(task => {
//       if (task.status === columnId) {
//         const taskElement = createTaskElement(task.content, task.id);
//         column.querySelector('.task-container').appendChild(taskElement);
//       }
//     });
//   });
// }

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

// 이벤트 전파 막기
function allowDrop(event) {
  event.preventDefault();
}

//
function drop(event, columnId) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(data);
  if (draggedElement) {
    // const taskStatus = columnId;
    // updateTaskStatus(data, taskStatus);

    // 이벤트 발생 타겟이 button 이면 button의 부모태그에 append => 이거 안해주면 버튼안에 버튼 들어감
    if (event.target.tagName === 'BUTTON') {
      event.target.parentNode.appendChild(draggedElement);
      return;
    }
    event.target.appendChild(draggedElement);
  }
}
