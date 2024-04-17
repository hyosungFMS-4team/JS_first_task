document.addEventListener('DOMContentLoaded', () => {
  renderBoardItem();
});

// 전역 변수로 더미 데이터 정의
const dummyData = {
  allPosts: [
    { id: 1, boardCategory: 'freeBoard', title: '첫 번째 자유게시물', content: '첫 번째 자유게시물 내용입니다.' },
    { id: 2, boardCategory: 'freeBoard', title: '두 번째 자유게시물', content: '두 번째 자유게시물 내용입니다.' },
    { id: 3, boardCategory: 'dailyBoard', title: '첫 번째 일상게시물', content: '첫 번째 일상게시물 내용입니다.' },
    { id: 4, boardCategory: 'dailyBoard', title: '두 번째 일상게시물', content: '두 번째 일상게시물 내용입니다.' },
  ],
  freeBoard: [
    { id: 1, boardCategory: 'freeBoard', title: '첫 번째 자유게시물', content: '첫 번째 자유게시물 내용입니다.' },
    { id: 2, boardCategory: 'freeBoard', title: '두 번째 자유게시물', content: '두 번째 자유게시물 내용입니다.' },
  ],
  dailyBoard: [
    { id: 1, boardCategory: 'dailyBoard', title: '첫 번째 일상게시물', content: '첫 번째 일상게시물 내용입니다.' },
    { id: 2, boardCategory: 'dailyBoard', title: '두 번째 일상게시물', content: '두 번째 일상게시물 내용입니다.' },
  ],
};

function renderBoardItem() {
  const queryParams = new URLSearchParams(window.location.search);
  const boardItemId = queryParams.get('id');

  // 게시물 ID에 따라 다른 내용을 렌더링합니다.
  if (boardItemId) {
    // 게시물 ID와 함께 보드 카테고리도 쿼리에서 가져옵니다.
    const queryParams = new URLSearchParams(window.location.search);
    const boardItemId = queryParams.get('id');
    const boardCategory = queryParams.get('category');

    // 게시물 ID와 보드 카테고리를 이용하여 게시물 데이터를 찾습니다.
    const boardItemData = findBoardItem(parseInt(boardItemId), boardCategory);
    if (boardItemData) {
      const titleElement = document.getElementById('title');
      const contentElement = document.getElementById('content');

      titleElement.textContent = boardItemData.title;
      contentElement.textContent = boardItemData.content;
    } else {
      alert('해당 게시물을 찾을 수 없습니다.');
    }
  } else {
    alert('게시물 ID가 지정되지 않았습니다.');
  }
}

function findBoardItem(id, boardCategory) {
  const boardItems = dummyData[boardCategory];
  return boardItems.find(item => item.id === id);
}

// 현재 선택된 메뉴 카테고리를 가져옵니다.
function getMenuCategory() {
  const menuItems = document.querySelectorAll('.menu-item');
  let selectedCategory = 'allPosts'; // 기본적으로 전체 글보기가 선택되어 있도록 설정
  menuItems.forEach(item => {
    if (item.classList.contains('selected')) {
      selectedCategory = item.id;
    }
  });
  return selectedCategory;
}
