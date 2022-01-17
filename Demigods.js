function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Dice')
      .addSubMenu(ui.createMenu('Roll')
        .addItem('Prowess', 'rollprowess')
        .addItem('Mettle', 'rollmettle')
        .addItem('Awe', 'rollawe')
        .addItem('Judgement', 'rolljudgement')
        .addItem('Wyrd', 'rollwyrd'))
      .addItem('Extra Die', 'extradie')
      .addItem('Clear Roll', 'clearroll')
  .addToUi();
}

const ROLL_RESULT = "E5";
const PLAYER_ROLL_RESULT = "F12";
const SHEET_NAME = 'Menu';

function alert(message,append,glbl){
  /*if (append){
  SpreadsheetApp.getUi().alert(message);
  } else {
    SpreadsheetApp.getUi().alert("You" + message); 
  }*/

  var menusheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!menusheet) {
    SpreadsheetApp.getUi().alert("No Menu Sheet. Make a sheet called " + SHEET_NAME);
    return
  }
  const menu = menusheet.getRange(ROLL_RESULT);
  if (append) {
    menu.setValue(menu.getValue()+'\n'+message);
  } else {
    menu.setValue(`${glbl} ${message}`);
  }
  
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for(const sheet of sheets){
    if (sheet.getSheetName().toLowerCase().startsWith("player")) {
      const dialouge = sheet.getRange(PLAYER_ROLL_RESULT);
      if (append) {
        dialouge.setValue(`${dialouge.getValue()}\n${message}`);
      } else {
        dialouge.setValue(`${glbl} ${message}`);
      }
    }
  }
}

function rollprowess() {
  roll("Prowess", "H2");
}
function rollmettle() {
  roll("Mettle", "H3");
}
function rollawe() {
  roll("Awe", "H4");
}
function rolljudgement() {
  roll("Judgement", "H5");
}
function rollwyrd() {
  roll("Wyrd", "H6");
}

function roll(name, abil) {
  if (!abil || !name) return;

  var playersheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!playersheet.getSheetName().startsWith("Player")){
    SpreadsheetApp.getUi().alert("Not a player sheet!");
    return
  }

  const mod = playersheet.getRange(abil).getValue();

  if (!mod && mod !== 0){
    SpreadsheetApp.getUi().alert(`Please set a ${name} stat at range ${abil} using the data validation to roll!`);
    return
  }

  const dice = [
    Math.floor(Math.random() * 5) +1,
    Math.floor(Math.random() * 5) +1,
    Math.floor(Math.random() * 5) +1
  ];

  var response = [" rolled"];

  //Fates (Dis)favor
  const ff = playersheet.getRange("J1").getValue();
  const fdf = playersheet.getRange("J2").getValue();
  if (ff || fdf) {
    response.push(dice.join(' and '));
    if (ff) {
      response.push(`with Fate's Favor`);
      dice.sort((a,b)=>{return b-a});
    }
    else if (fdf) {
      response.push(`with Fate's Disfavor`);
      dice.sort((a,b)=>{return a-b});
    }
    response.push("and");
  } else {
    response.push(`${dice[0]} and ${dice[1]}`);
  }

  var answer = eval(`${dice[0] + dice[1]} + ${mod}`);

  response.push(`with a ${name} of ${mod} for a total of ${answer}.`);

  if(dice[0] == dice[1]) response.push('\nDOUBLES! Take a thread!');

  //health
  var hp = 0;
  for (const h_p of playersheet.getRange("E6:E12").getValues()) {
    if (h_p[0]) hp++;
  }
  if (hp > 3) response.push(`\n-1 to rolls due to health, totalling to ${answer-1}.`);


  alert(response.join(' '),false,playersheet.getSheetName());
}

function clearroll(){
  var menusheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!menusheet) {
    SpreadsheetApp.getUi().alert("No Menu Sheet. Make a sheet called " + SHEET_NAME);
    return
  }
  menusheet.getRange(ROLL_RESULT).setValue("");
}

function extradie(){
  var die = Math.floor(Math.random() * 5) + 1;

  alert(`Fate has added a ${die} to the table`,true);
}
