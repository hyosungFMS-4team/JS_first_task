// let currentSelectBoard = JSON.parse(localStorage.getItem('selectedBoard')) || 'ALL';

let currentSelectBoard = JSON.parse(localStorage.getItem('selectedBoard')) || 'ALL';

document.addEventListener('DOMContentLoaded', () => {
  if (currentSelectBoard !== ALL) {
    renderBoard('ALL');
    return;
  }
  renderBoard(currentSelectBoard);
});

// 전역 변수로 더미 데이터 정의
const dummyData = {
  ALL: [
    { id: 1, boardCategory: 'freeBoard', title: 'First FreeBoard Post', content: 'This is First FreeBoard Post.', writer: 'Mike', date: '2024-04-17' },
    { id: 2, boardCategory: 'freeBoard', title: 'Second FreeBoard Post', content: 'This is Second FreeBoard Post.', writer: 'Jason', date: '2024-04-17' },
    { id: 3, boardCategory: 'dailyBoard', title: 'First DailyBoard Post', content: 'This is First DailyBoard Post.', writer: 'Dave', date: '2024-04-17' },
    { id: 4, boardCategory: 'dailyBoard', title: 'Second DailyBoard Post', content: 'This is Second DailyBoard Post.', writer: 'Jane', date: '2024-04-17' },
  ],
  FreeBoard: [
    { id: 1, boardCategory: 'freeBoard', title: 'First FreeBoard Post', content: 'This is First FreeBoard Post.', writer: 'Mike', date: '2024-04-17' },
    { id: 2, boardCategory: 'freeBoard', title: 'Second FreeBoard Post', content: 'This is Second FreeBoard Post.', writer: 'Jason', date: '2024-04-17' },
  ],
  DailyBoard: [
    { id: 1, boardCategory: 'dailyBoard', title: 'First DailyBoard Post', content: 'This is First DailyBoard Post.', writer: 'Dave', date: '2024-04-17' },
    { id: 2, boardCategory: 'dailyBoard', title: 'Second DailyBoard Post', content: 'This is Second DailyBoard Post.', writer: 'Jane', date: '2024-04-17' },
  ],
};

function renderBoard(category) {
  const boardContainer = document.getElementById('board');
  boardContainer.innerHTML = '';

  let menuSelector = category;
  if (category === '"ALL"') {
    console.log(category.substr(1, 3));
    menuSelector = category.substr(1, 3);
  }

  //   const filteredData = dummyData[category] || [];
  const filteredData = dummyData[menuSelector] || [];

  filteredData.forEach(item => {
    const boardItem = createBoardItem(item);
    boardContainer.appendChild(boardItem);
  });
}

function createBoardItem(data) {
  const boardItemDiv = document.createElement('div');
  boardItemDiv.classList.add('post_description');

  const imgElement = document.createElement('img');
  imgElement.classList.add('post_description_img');
  imgElement.setAttribute('src', '../image/text_file.png');

  const titleElement = document.createElement('div');
  titleElement.classList.add('post_description_title');
  titleElement.textContent = `${data.title}.txt`;

  const writerElement = document.createElement('div');
  writerElement.classList.add('post_description_writer');
  writerElement.textContent = data.writer;

  const dateElement = document.createElement('div');
  dateElement.classList.add('post_description_date');
  dateElement.textContent = data.date;

  boardItemDiv.appendChild(imgElement);
  boardItemDiv.appendChild(titleElement);
  boardItemDiv.appendChild(writerElement);
  boardItemDiv.appendChild(dateElement);

  boardItemDiv.addEventListener('dblclick', () => {
    const modal = CreateModal(data.title, data.content, data.writer, data.date);
    document.body.appendChild(modal);
  });

  return boardItemDiv;
}

const menuItems = document.querySelectorAll('.menu-item');

let isFirstRender = true;

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(menuItem => {
      if (menuItem.querySelector('.item_title').classList.contains('selected')) {
        menuItem.querySelector('.item_title').classList.remove('selected');
        isFirstRender = false;
      }
    });

    item.querySelector('.item_title').classList.add('selected');

    const selectedCategory = item.id;

    document.querySelector('.board_bottom_left_area_text').textContent = `
        ${dummyData[item.id].length} post(s)
    `;
    document.querySelector('.current_board').textContent = `
        ${item.id}
    `;

    menuItems.forEach(menuItem => {
      if (menuItem.querySelector('.menu_folder').classList.contains('selected_folder')) {
        menuItem.querySelector('.menu_folder').classList.remove('selected_folder');
        menuItem.querySelector('.menu_folder').setAttribute('src', '../image/window_not_open_folder.png');
      }
    });

    item.querySelector('.menu_folder').classList.add('selected_folder');
    item.querySelector('.menu_folder').setAttribute('src', '../image/Windows_Folder_1995_open.png');

    localStorage.setItem('selectedBoard', JSON.stringify(selectedCategory));

    renderBoard(selectedCategory);
  });
});

if (isFirstRender) {
  document.getElementById('ALL').querySelector('.item_title').classList.add('selected');
  document.querySelector('.board_bottom_left_area_text').textContent = `
  ${dummyData['ALL'].length} post(s)
  `;

  document.querySelector('.current_board').textContent = `
    ALL
  `;
}

// Modal

let modalCount = 0;

function CreateModal(title, content, writer, date) {
  const modalId = `myModal${modalCount}`;
  modalCount++;

  const modalDiv = document.createElement('div');
  modalDiv.id = modalId;
  modalDiv.classList.add('modal-content');
  modalDiv.setAttribute('draggable', 'true');
  modalDiv.addEventListener('dragstart', e => drag_start(e));

  const boardMainDiv = document.createElement('div');
  boardMainDiv.classList.add('Modal_main');

  const boardTopDiv = document.createElement('div');
  boardTopDiv.classList.add('board_top');

  const boardTopTitleDiv = document.createElement('div');
  boardTopTitleDiv.classList.add('Modal_top_title');

  const boardTopTitleLeftDiv = document.createElement('div');
  boardTopTitleLeftDiv.classList.add('board_top_title_left');

  const imgElement = document.createElement('img');
  imgElement.src = '../image/text_file.png';
  imgElement.classList.add('title');
  imgElement.style.width = '25px';
  imgElement.style.height = '25px';

  const titleDiv = document.createElement('div');
  titleDiv.textContent = `${title}.txt`;
  titleDiv.classList.add('title');

  const boardTopTitleRightDiv = document.createElement('div');
  boardTopTitleRightDiv.classList.add('board_top_title_right');

  const helpButton = document.createElement('button');
  helpButton.textContent = '?';
  helpButton.classList.add('board_top_btn');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('board_top_btn');
  closeButton.onclick = () => closeModal(modalId);

  boardTopTitleLeftDiv.appendChild(imgElement);
  boardTopTitleLeftDiv.appendChild(titleDiv);

  boardTopTitleRightDiv.appendChild(helpButton);
  boardTopTitleRightDiv.appendChild(closeButton);

  boardTopTitleDiv.appendChild(boardTopTitleLeftDiv);
  boardTopTitleDiv.appendChild(boardTopTitleRightDiv);

  const boardTopNavAreaDiv = document.createElement('div');
  boardTopNavAreaDiv.classList.add('Modal_top_nav_area');

  const boardTopNavDiv = document.createElement('div');
  boardTopNavDiv.classList.add('Modal_top_nav');

  const fileDiv = document.createElement('div');
  fileDiv.innerHTML = '<span>F</span>ile';

  const editDiv = document.createElement('div');
  editDiv.innerHTML = '<span>E</span>dit';

  const viewDiv = document.createElement('div');
  viewDiv.innerHTML = '<span>V</span>iew';

  const helpDiv = document.createElement('div');
  helpDiv.innerHTML = '<span>H</span>elp';

  boardTopNavDiv.appendChild(fileDiv);
  boardTopNavDiv.appendChild(editDiv);
  boardTopNavDiv.appendChild(viewDiv);
  boardTopNavDiv.appendChild(helpDiv);

  boardTopNavAreaDiv.appendChild(boardTopNavDiv);

  boardTopDiv.appendChild(boardTopTitleDiv);
  boardTopDiv.appendChild(boardTopNavAreaDiv);

  const ModalMidDiv = document.createElement('div');
  ModalMidDiv.classList.add('Modal_mid');

  const titleP = document.createElement('p');
  titleP.textContent = `title : ${title}`;

  const contentP = document.createElement('p');
  contentP.textContent = `content : ${content}`;

  const writerP = document.createElement('p');
  writerP.textContent = `writer : ${writer}`;

  const dateP = document.createElement('p');
  dateP.textContent = `date : ${date}`;

  ModalMidDiv.appendChild(titleP);
  ModalMidDiv.appendChild(contentP);
  ModalMidDiv.appendChild(writerP);
  ModalMidDiv.appendChild(dateP);

  boardMainDiv.appendChild(boardTopDiv);
  boardMainDiv.appendChild(ModalMidDiv);

  modalDiv.appendChild(boardMainDiv);

  return modalDiv;
}

function closeModal(modalId) {
  const modalDiv = document.getElementById(modalId);
  modalDiv.style.display = 'none';
}

// drag element

function drag_start(event) {
  let style = window.getComputedStyle(event.target, null);

  var str = parseInt(style.getPropertyValue('left')) - event.clientX + ',' + (parseInt(style.getPropertyValue('top')) - event.clientY) + ',' + event.target.id;
  event.dataTransfer.setData('Text', str);
}

function drop(event) {
  let offset = event.dataTransfer.getData('Text').split(',');
  let dm = document.getElementById(offset[2]);
  dm.style.left = event.clientX + parseInt(offset[0], 10) + 'px';
  dm.style.top = event.clientY + parseInt(offset[1], 10) + 'px';
  event.preventDefault();
  return false;
}

function drag_over(event) {
  event.preventDefault();
  return false;
}

document.body.addEventListener('dragover', drag_over, false);
document.body.addEventListener('drop', drop, false);
