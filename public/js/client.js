const current_time = document.getElementById('current_time');

const workInBtn = document.getElementById('workInBtn');
const workOutBtn = document.getElementById('workOutBtn');
let workStart = document.getElementById('workStart');
let workEnd = document.getElementById('workEnd');
let workTotal = document.getElementById('workTotal');

const breakInBtn = document.getElementById('breakInBtn');
const breakOutBtn = document.getElementById('breakOutBtn');
let breakStart = document.getElementById('breakStart');
let breakEnd = document.getElementById('breakEnd');
let breakTotal = document.getElementById('breakTotal');

const logoutBtn = document.getElementById('logoutBtn');

const totalTime = document.getElementById('totalTime');

const cMonth = document.getElementById('cMonth');
const cYear = document.getElementById('cYear');

const user = document.getElementById('userName').innerHTML;
const email = document.getElementById('userEmail').innerHTML;

//Global variable
let workInTime = null;
let workOutTime = null;
let breakInTime = null;
let breakOutTime = null;
let workingTimeActual = null;
let breakTimeTotal = '00:00';
let attendances = [];

let workMonth = currentMonth();
let workYear = new Date().getFullYear();

cMonth.innerHTML = workMonth;
cYear.innerHTML = workYear;
current_date.innerHTML = currentDate();

function currentDate() {
 const d = new Date();
 return d
  .toLocaleDateString('en-GB', {
   day: '2-digit',
   month: 'long',
   year: 'numeric'
  })
  .replace(/ /g, ' ');
}

function currentMonth() {
 const d = new Date();
 return d.toLocaleDateString('en-GB', { month: 'long' });
}

function displayCurrentTime() {
 const d = new Date();
 const time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

 return (current_time.innerHTML = time.toLocaleString());
}

// Time separation from two time (hours, minutes)
function totalMinutes(time) {
 var parts = time.split(':');
 return +parts[0] * 60 + +parts[1];
}
function timeDiff(time1, time2) {
 var mins1 = totalMinutes(time1);
 var mins2 = totalMinutes(time2);

 // if (mins2 < mins1) {
 //   mins2 += 1440
 // }

 var diff = mins2 - mins1;
 var hours = '0' + Math.floor(diff / 60);
 var minutes = '0' + (diff - hours * 60);
 return hours.slice(-2) + ':' + minutes.slice(-2);
}

console.log(timeDiff('08:50', '11:02'));

//------[ time separation end]-----------

function workIn() {
 const d = new Date();
 let workInHours = d.getHours();
 workInHours = workInHours > 9 ? workInHours : '0' + workInHours;
 let workInMinutes = d.getMinutes();
 workInMinutes = workInMinutes > 9 ? workInMinutes : '0' + workInMinutes;
 workInTime = workInHours + ':' + workInMinutes;

 workInBtn.classList.add('disabled');
 workOutBtn.classList.remove('disabled');
 breakInBtn.classList.remove('disabled');

 localStorage.setItem('workInTime', workInTime);
 workStart.innerHTML = workInTime;
 console.log(workInTime);
}

//Break time
function breakIn() {
 const d = new Date();
 let breakInHours = d.getHours();
 breakInHours = breakInHours > 9 ? breakInHours : '0' + breakInHours;
 let breakInMinutes = d.getMinutes();
 breakInMinutes = breakInMinutes > 9 ? breakInMinutes : '0' + breakInMinutes;
 breakInTime = breakInHours + ':' + breakInMinutes;
 breakStart.innerHTML = breakInTime;

 breakInBtn.classList.add('disabled');
 workOutBtn.classList.add('disabled');
 breakOutBtn.classList.remove('disabled');
 localStorage.setItem('breakInTime', breakInTime);
}

function breakOut() {
 const d = new Date();
 let breakOutHours = d.getHours();
 breakOutHours = breakOutHours > 9 ? breakOutHours : '0' + breakOutHours;
 let breakOutMinutes = d.getMinutes();
 breakOutMinutes =
  breakOutMinutes > 9 ? breakOutMinutes : '0' + breakOutMinutes;
 breakOutTime = breakOutHours + ':' + breakOutMinutes;
 breakEnd.innerHTML = breakOutTime;

 breakTimeTotal = timeDiff(breakInTime, breakOutTime);

 breakTotal.innerHTML = breakTimeTotal;

 breakOutBtn.classList.add('disabled');
 breakInBtn.classList.add('disabled');
 workOutBtn.classList.remove('disabled');

 localStorage.setItem('breakOutTime', breakOutTime);
 localStorage.setItem('breakTimeTotal', breakTimeTotal);
}

function workOut() {
 const d = new Date();
 let workOutHours = d.getHours();
 workOutHours = workOutHours > 9 ? workOutHours : '0' + workOutHours;
 let workOutMinutes = d.getMinutes();
 workOutMinutes = workOutMinutes > 9 ? workOutMinutes : '0' + workOutMinutes;
 workOutTime = workOutHours + ':' + workOutMinutes;
 workEnd.innerHTML = workOutTime;

 let workingTimeTotal = timeDiff(workInTime, workOutTime);

 workingTimeActual = timeDiff(breakTimeTotal, workingTimeTotal);

 workTotal.innerHTML = workingTimeActual;

 workOutBtn.classList.add('disabled');
 breakInBtn.classList.add('disabled');

 localStorage.setItem('workOutTime', workOutTime);
 localStorage.setItem('workingTimeActual', workingTimeActual);

 //localStorage.clear();

 return workingTimeActual;
}

// Add attendances to DOM list
function addAttendanceDOM(data) {
 const item = document.createElement('li');
 item.innerHTML = `<span>Day ${data.dayNo}</span><span>${data.date}</span><span>${data.hours}</span> `;
 list.appendChild(item);
}

//get data from server
async function getData() {
 const response = await fetch('/api/v1/attendances');
 const data = await response.json();

 attendances = data.data;
 attendances.forEach(addAttendanceDOM);

 //
 const hoursTotal = function () {
  let totalTime = 0;
  attendances.map(function totalTimeCal(attendance) {
   const timeSplit = attendance.hours.split(':');
   const timeInMinutes = Number(timeSplit[0]) * 60 + Number(timeSplit[1]);
   totalTime += timeInMinutes;
  });

  return (totalTime / 60).toFixed(2);
 };

 //
 const totalTimes = hoursTotal();
 totalTime.innerHTML = totalTimes;
}

//Post data to server
async function postData(e) {
 e.preventDefault();

 const data = {
  dayNo: attendances.length + 1,
  date: currentDate(),
  hours: workOut(),
  month: workMonth,
  year: workYear,
  user: user,
  email: email
 };

 const options = {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
 };
 const response = await fetch('/api/v1/attendances', options);
 const json = await response.json();
 //localStorage.clear();
 location.reload(); //this method reloads the current URL, like the Refresh button.
}

function checkLocalStorage() {
 //Work Start
 if (localStorage.getItem('workInTime') != null) {
  workInBtn.classList.add('disabled');
  breakInBtn.classList.remove('disabled');
  workOutBtn.classList.remove('disabled');
  workInTime = localStorage.getItem('workInTime');
  workStart.innerHTML = workInTime;
  console.log('Work started' + ' ' + workInTime);
 }
 //break Start
 if (localStorage.getItem('breakInTime') != null) {
  breakInBtn.classList.add('disabled');
  breakOutBtn.classList.remove('disabled');
  workOutBtn.classList.add('disabled');
  breakInTime = localStorage.getItem('breakInTime');
  breakStart.innerHTML = breakInTime;
  console.log('break started' + ' ' + breakInTime);
 }
 //break End
 if (localStorage.getItem('breakOutTime') != null) {
  breakOutBtn.classList.add('disabled');
  workOutBtn.classList.remove('disabled');
  breakOutTime = localStorage.getItem('breakOutTime');
  breakEnd.innerHTML = breakOutTime;

  breakTimeTotal = localStorage.getItem('breakTimeTotal');
  breakTotal.innerHTML = breakTimeTotal;

  console.log('Break Ended' + ' ' + breakOutTime);
 }
 //Work End
 if (localStorage.getItem('workOutTime') != null) {
  workInBtn.classList.remove('disabled');
  workOutTime = localStorage.getItem('workOutTime');
  workEnd.innerHTML = workOutTime;

  workingTimeActual = localStorage.getItem('workingTimeActual');
  workTotal.innerHTML = workingTimeActual;

  console.log('Work Ended');
 }
}

//logout Btn
function logOut() {
 localStorage.clear();
}

workInBtn.addEventListener('click', workIn);
workOutBtn.addEventListener('click', postData);
breakInBtn.addEventListener('click', breakIn);
breakOutBtn.addEventListener('click', breakOut);
logoutBtn.addEventListener('click', logOut);

function init() {
 list.innerHTML = '';
 getData();
 setInterval(displayCurrentTime, 1000);
 checkLocalStorage();
}

init();
