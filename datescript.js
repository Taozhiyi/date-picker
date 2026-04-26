(function () {
  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const calendar = document.getElementById('calendar');

  let startDate = null, endDate = null;
  let visibleMonth = new Date();

  function toggleCalendar() {
    calendar.classList.toggle('hidden');
    renderCalendar();
  }

  startInput.addEventListener('click', () => { toggleCalendar(); focusField = 'start'; });
  endInput.addEventListener('click', () => { toggleCalendar(); focusField = 'end'; });

  function renderCalendar() {
    calendar.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'header';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    prevBtn.onclick = () => { visibleMonth.setMonth(visibleMonth.getMonth() - 1); renderCalendar(); };
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    nextBtn.onclick = () => { visibleMonth.setMonth(visibleMonth.getMonth() + 1); renderCalendar(); };

    const monthLabel = document.createElement('span');
const year = visibleMonth.getFullYear();
const month = String(visibleMonth.getMonth() + 1).padStart(2, '0');
monthLabel.textContent = `${year}.${month}`;

    header.append(prevBtn, monthLabel, nextBtn);
    calendar.appendChild(header);

    const daysGrid = document.createElement('div');
    daysGrid.className = 'days';

    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'day disabled';
      el.textContent = d;
      daysGrid.appendChild(el);
    });

    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const offset = firstDay.getDay();
    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth()+1, 0).getDate();

    for (let i = 0; i < offset + daysInMonth; i++) {
      const cell = document.createElement('div');
      const dayNum = i - offset + 1;
      if (i < offset) {
        cell.className = 'day disabled';
      } else {
        cell.className = 'day';
        cell.textContent = dayNum;
        const cellDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), dayNum);

        if (
          (startDate && cellDate.getTime() === startDate.getTime()) ||
          (endDate && cellDate.getTime() === endDate.getTime())
        ) {
          cell.classList.add('selected');
        }
        if (startDate && endDate && cellDate > startDate && cellDate < endDate) {
          cell.classList.add('in-range');
        }

        cell.onclick = () => {
          if (focusField === 'start') {
            startDate = cellDate;
            startInput.value = formatDate(startDate);
            focusField = 'end';
          } else {
            endDate = cellDate;
            if (endDate < startDate) [startDate, endDate] = [endDate, startDate];
            startInput.value = formatDate(startDate);
            endInput.value = formatDate(endDate);
            calendar.classList.add('hidden');
          }
          renderCalendar();
        };
      }
      daysGrid.appendChild(cell);
    }

    calendar.appendChild(daysGrid);
  }

  function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  let focusField = 'start';
  renderCalendar();
})();
