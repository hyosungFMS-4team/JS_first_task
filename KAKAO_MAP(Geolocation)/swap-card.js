const carousel = document.getElementById('carousel');

const tasks = JSON.parse(localStorage.getItem('tasks'));
const length = tasks.length;
tasks.forEach((task, idx) => 
    appendCarouselItem(idx, {
        swapOff: {
            title: task.content,
            color: 'bg-blue'
        },
        swapOn: {
            title: task.content,
            color: 'bg-red'
        }
    }));

function appendCarouselItem(idx, data) {
    const item = document.createElement('div');

    item.innerHTML = `
        <label class="swap swap-flip carousel-item card">
            <input type="checkbox">

            <div id="${idx}" class="card-body swap-off ${data.swapOff.color}">
                <a href="#${(idx-1 >= 0) ? idx-1 : length-1}" class=“bg-transparent border-none text-7xl">❮</a>
                <div class="card-title">${data.swapOff.title}</div>
                <a href="#${(idx+1) % length}" class=“bg-transparent border-none text-7xl">❯</a>
            </div>

            <div id="${idx}" class="card-body swap-on ${data.swapOn.color}">
                <a href="#${(idx-1 >= 0) ? idx-1 : length-1}" class=“bg-transparent border-none text-7xl">❮</a>
                <div class="card-title">${data.swapOn.title}</div>
                <a href="#${(idx+1) % length}" class=“bg-transparent border-none text-7xl">❯</a>
            </div>
        </label>`;

    carousel.appendChild(item);
}