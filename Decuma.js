function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tarot')
    .addItem('Relationships', 'phase1rand')
    .addItem('Location', 'phase2rand')
    .addItem('Group Dynamics', 'phase3rand')
  .addToUi();
}

const randnum = (min,max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

function minorrand(xall,ymin,ymax){
  const x = xall[randnum(0,xall.length)]
  const y = randnum(ymin, ymax);
  const coord =`${x}${y}`
  const SH = SpreadsheetApp.getActiveSpreadsheet();
  const SHEET = SH.getSheetByName("Spread");

  const items = {
    a: SH.getSheetByName("Minor Arcana").getRange(`${x}1`).getValue(),
    b: SH.getSheetByName("Minor Arcana").getRange(`A${y}`).getValue(),
    image: `='Minor Arcana'!${coord}`,
    inverttof: inverttof()
  }

  const output = [[`${items.b} of ${items.a}`],[items.image],[items.inverttof]];
  SHEET.getRange("A1:A3").setValues(output);
}

function majorrand(ymin,ymax){
  const SH = SpreadsheetApp.getActiveSpreadsheet();
  const SHEET = SH.getSheetByName("Spread");
  const y = randnum(ymin,ymax);
  const output = [
    [SH.getSheetByName("Major Arcana").getRange(`A${y}`).getValue()],
    [`='Major Arcana'!B${y}`],
    [inverttof()]
  ]
  SHEET.getRange("A1:A3").setValues(output);
}

function reload() {
  SpreadsheetApp.flush();
  return
}

const inverttof = () => {
  const i = ["Regular Side Up", "Inverted Side Up"];
  return i[randnum(0,i.length)]
}

const phase1rand = () => {return minorrand(["B","C"],2,15)}
const phase2rand = () => {return minorrand(["D","E"],2,15)}
const phase3rand = () => {return majorrand(2,22)}
