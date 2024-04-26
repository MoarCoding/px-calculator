document
  .getElementById('collate')
  .addEventListener('click', parsePxData);

function parsePxData() {
  var rows = document.getElementById('input').value.split('\n'),
    times = [],
    projects = {},
    currentProject;

  let currentDate;
  let projectsOfDay;

  for (let i = 0; i < rows.length; i++) {
    let currentRow = rows[i].trim();

    if(currentRow.match(/\d{4}-\d{2}-\d{2}/gi)) {
      if(currentDate) {
        console.log(currentDate, projectsOfDay);
      }

      currentDate = currentRow;
      projectsOfDay = [];
    } else if (currentRow !== '') {
      if (currentRow.match(/\d{2}:\d{2}-\d{2}:\d{2}/gi)) {
        const calculatedTime = calculateItemTime(currentRow);

        projects[currentProject] += calculatedTime;
        projectsOfDay[currentProject] += calculatedTime;
      } else if (currentRow.match(/\w* \d(,\d)?h/gi)) {
        const match = currentRow.match(
          /(\w*?) (\d(,\d)?)h/
        );
        const word = match[1];
        const amount = parseFloat(
          match[2].replace(',', '.'),
          10
        );
        
        projects[word] = (projects[word] ? projects[word] : 0) + amount; 
        projectsOfDay[word] = amount;

        // if (!projects[word]) {
        // 	projects[word] = amount;
        // 	projectsOfDay[word] = amount;
        // } else {
        // 	console.log(projectsOfDay[word]);
        // 	projects[word] += amount;
        // 	projectsOfDay[word] += amount;
        // }
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

  if(currentDate) {
    console.log(currentDate, projectsOfDay);
  }

  console.log(projects);
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

  times.length = 0;

  return precisionRound(minutesTotal);
}

function precisionRound(number, precision = 2) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
