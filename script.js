document.getElementById('collate').addEventListener('click', parsePxData);

function parsePxData() {
  var rows = document.getElementById('input').value.split('\n'),
    projects = {},
    currentProject;

  let currentDate;
  let projectsOfDay;

  // Clear previous table if it exists
  const outputContainer = document.getElementById('output');
  outputContainer.innerHTML = '';

  for (let i = 0; i < rows.length; i++) {
    let currentRow = rows[i].trim();

    if (currentRow.match(/\d{4}-\d{2}-\d{2}/gi)) {
      if (currentDate) {
        addTableRow(currentDate, projectsOfDay);
      }

      currentDate = currentRow;
      projectsOfDay = {};
    } else if (currentRow !== '') {
      if (currentRow.match(/\d{2}:\d{2}-\d{2}:\d{2}/gi)) {
        const calculatedTime = calculateItemTime(currentRow);

        projects[currentProject] = (projects[currentProject] || 0) + calculatedTime;
        projectsOfDay[currentProject] = (projectsOfDay[currentProject] || 0) + calculatedTime;
      } else if (currentRow.match(/\w* \d(,\d)?h/gi)) {
        const match = currentRow.match(/(\w*?) (\d(,\d)?)h/);
        const word = match[1];
        const amount = parseFloat(match[2].replace(',', '.'), 10);

        projects[word] = (projects[word] || 0) + amount;
        projectsOfDay[word] = (projectsOfDay[word] || 0) + amount;
      } else {
        currentProject = currentRow;

        if (!projects[currentProject]) {
          projects[currentProject] = 0;
        }

        if (!projectsOfDay[currentProject]) {
          projectsOfDay[currentProject] = 0;
        }
      }
    }
  }

  if (currentDate) {
    addTableRow(currentDate, projectsOfDay);
  }

  createSummaryTable(projects);
}

function calculateItemTime(times) {
  if (times.length === 0) return 0;

  var minutesTotal = 0;

  let split = times.split('-');

  let start = new Date(),
    end = new Date();

  start.setHours(split[0].split(':')[0]);
  start.setMinutes(split[0].split(':')[1]);

  end.setHours(split[1].split(':')[0]);
  end.setMinutes(split[1].split(':')[1]);

  minutesTotal += (end - start) / (60 * 60 * 1000);

  return precisionRound(minutesTotal);
}

function precisionRound(number, precision = 2) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function addTableRow(date, projectsOfDay) {
  const table = document.getElementById('daily-table') || createDailyTable();

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${date}</td>
    <td>
      ${Object.entries(projectsOfDay)
        .map(([task, hours]) => `${task}: ${hours.toFixed(2)}h`)
        .join('<br>')}
    </td>
  `;
  table.appendChild(row);
}

function createDailyTable() {
  const outputContainer = document.getElementById('output');
  const table = document.createElement('table');
  table.id = 'daily-table';
  table.className = 'styled-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Projects</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  outputContainer.appendChild(table);
  return table.querySelector('tbody');
}

function createSummaryTable(projects) {
  const outputContainer = document.getElementById('output');
  const table = document.createElement('table');
  table.className = 'styled-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Project</th>
        <th>Total Hours</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(projects)
        .map(([project, hours]) => `<tr><td>${project}</td><td>${hours.toFixed(2)}</td></tr>`)
        .join('')}
    </tbody>
  `;
  outputContainer.appendChild(table);
}
