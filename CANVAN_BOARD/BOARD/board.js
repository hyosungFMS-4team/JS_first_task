let currentSelectBoard = JSON.parse(localStorage.getItem('selectedBoard')) || 'allPosts';

document.addEventListener('DOMContentLoaded', () => {
  renderBoard(currentSelectBoard); // 기본적으로 자유게시판이 선택되어 있도록 설정
});

// 전역 변수로 더미 데이터 정의
const dummyData = {
  allPosts: [
    { id: 1, boardCategory: 'freeBoard', title: 'First FreeBoard Post', content: 'This is First FreeBoard Post.' },
    { id: 2, boardCategory: 'freeBoard', title: 'Second FreeBoard Post', content: 'This is Second FreeBoard Post.' },
    { id: 3, boardCategory: 'dailyBoard', title: 'First DailyBoard Post', content: 'This is First DailyBoard Post.' },
    { id: 4, boardCategory: 'dailyBoard', title: 'Second DailyBoard Post', content: 'This is Second DailyBoard Post.' },
  ],
  freeBoard: [
    { id: 1, boardCategory: 'freeBoard', title: 'First FreeBoard Post', content: 'This is First FreeBoard Post.' },
    { id: 2, boardCategory: 'freeBoard', title: 'Second FreeBoard Post', content: 'This is Second FreeBoard Post.' },
  ],
  dailyBoard: [
    { id: 1, boardCategory: 'dailyBoard', title: 'First DailyBoard Post', content: 'This is First DailyBoard Post.' },
    { id: 2, boardCategory: 'dailyBoard', title: 'Second DailyBoard Post', content: 'This is Second DailyBoard Post.' },
  ],
};

function renderBoard(category) {
  const boardContainer = document.getElementById('board');
  boardContainer.innerHTML = '';

  const filteredData = dummyData[category] || [];

  filteredData.forEach(item => {
    const boardItem = createBoardItem(item);
    boardContainer.appendChild(boardItem);
  });
}

function createBoardItem(data) {
  const boardItemDiv = document.createElement('div');
  boardItemDiv.classList.add('board-item');

  const titleElement = document.createElement('h5');
  titleElement.classList.add('board-item-title');
  titleElement.textContent = data.title;

  boardItemDiv.appendChild(titleElement);

  boardItemDiv.addEventListener('click', () => {
    window.location.href = `BoardItem.html?id=${data.id}&category=${data.boardCategory}`;
  });

  return boardItemDiv;
}

const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(menuItem => {
      menuItem.classList.remove('selected');
    });
    item.classList.add('selected');

    const selectedCategory = item.id;

    localStorage.setItem('selectedBoard', JSON.stringify(selectedCategory));

    renderBoard(selectedCategory);
  });
});
