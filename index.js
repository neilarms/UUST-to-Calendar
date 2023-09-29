const group_name = '';
const week = 6;
const date_start = 20231002; //Format: YYYYMMDD
const URL = `https://isu.ugatu.su/api/new_schedule_api/?schedule_semestr_id=231&WhatShow=1&student_group_id=${group_id}&weeks=${week}`

/* Ниже код нет необходимости трогать т.к. все адаптируемые под Вас данные меняются выше */

let axios = require('axios');
const fs = require('fs').promises;
const cheerio = require('cheerio');

function openFile(week) {
  try {
    const Header = 'BEGIN:VCALENDAR\n';
    fs.writeFile(`Расписание_занятий_для_группы_${group_name}_на_${week}-ю_неделю.ics`, Header);
  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
}

function closeFile(week) {
  try {
    const Footer = '\nEND:VCALENDAR\n';
    fs.writeFile(`Расписание_занятий_для_группы_${group_name}_на_${week}-ю_неделю.ics`, Footer, { flag: 'a' });
  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
}

function addLesson(summary, dtstart, dtend, week) {
  try {
    const csvLine = `\nBEGIN:VEVENT\nSUMMARY: ${summary}\nDTSTART;VALUE=DATE-TIME:${dtstart}\nDTEND;VALUE=DATE-TIME:${dtend}\nEND:VEVENT\n`;
    fs.writeFile(`Расписание_занятий_для_группы_${group_name}_на_${week}-ю_неделю.ics`, csvLine, { flag: 'a' });
  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
}

async function script() {
  let startTime = new Date().getTime();

  //начало парсера

  let data = await axios.get(
    encodeURI(URL)
  );
  const $ = cheerio.load(data.data);
  let tables = $('tbody');
  let lessons = [];
  let subjectsCount = tables.eq(0).find('tr').length;

  let point = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 10; j++) {
      lessons[point] = {
        subject: tables.find('tr').eq(point).find('td').eq(2).text().trim(),
        type: tables.find('tr').eq(point).find('td').eq(3).text().trim(),
        teacher: tables.find('tr').eq(point).find('td').eq(4).text().trim(),
        cabinet: tables.find('tr').eq(point).find('td').eq(5).text().trim(),
      };
      point++;
    }
  }

  //формирование файла-календаря
  openFile(week);

  let SUMMARY;
  let DTSTART;
  let DTEND;
let date = date_start
  point = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 10; j++) {
      if (lessons[point].subject != 'Нет информации') {
        switch (j) {
          case 0: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T080000';
            DTEND = date + 'T092000';
            break;
          }
          case 1: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T093500';
            DTEND = date + 'T105500';
            break;
          }
          case 2: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T113500';
            DTEND = date + 'T125500';
            break;
          }
          case 3: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T131000';
            DTEND = date + 'T143000';
            break;
          }
          case 4: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T151000';
            DTEND = date + 'T163000';
            break;
          }
          case 5: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T164500';
            DTEND = date + 'T180500';
            break;
          }
          case 6: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T182000';
            DTEND = date + 'T194000';
            break;
          }
          case 7: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T195500';
            DTEND = date + 'T211500';
            break;
          }
          case 8: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T212500';
            DTEND = date + 'T224500';
            break;
          }
          case 9: {
            SUMMARY = lessons[point].cabinet + ' ' + lessons[point].subject + ' ' + lessons[point].type + ' ' + lessons[point].teacher;
            DTSTART = date + 'T225500';
            DTEND = date + 'T230000';
            break;
          }
        }

        addLesson(SUMMARY, DTSTART, DTEND, week);
      }
      point++;
    }
    if (date == 20230930) date == 20231001; //Вот тут необходимо менять даты каждый месяц
    else date++;
  }

  closeFile(week);

  let endTime = new Date().getTime();
  console.log(`Время выполнения ${endTime - startTime} ms`);
}

script();
