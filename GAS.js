function myFunction() { // AC/WAの出力
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('フォームの回答 1');
  const lastRow = sheet.getLastRow();
  
  const problem_id = sheet.getRange(lastRow, 2).getValue();
  const answer = sheet.getRange(lastRow, 3).getValue();
  const state = getState(problem_id, answer);
  sheet.getRange(lastRow, 5).setValue(state);
  sheet.getRange(lastRow, 5).setHorizontalAlignment('center');
  ranking();
}

function getState(problem_id, user_answer) { // 正誤ジャッジ
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('writer_answer');
  const writer_answer = sheet.getRange(problem_id, 2).getValue();
  if(writer_answer === user_answer) {
    return "AC";
  } else {
    return "WA";
  }
}

function ranking() { // ランキング表作成
  const formSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('フォームの回答 1');
  const formLastRow = formSheet.getLastRow();
  const rankSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ranking');
  const rankLastRow = rankSheet.getLastRow();
  
  const id = formSheet.getRange(2, 2, formLastRow, 2).getValues();
  const user = formSheet.getRange(2, 4, formLastRow, 4).getValues();
  const status = formSheet.getRange(2, 5, formLastRow, 5).getValues();
  let rankingData = {};
  for(var c = 0; c < formLastRow - 1; c++) {
    const i = id[c][0];
    const u = user[c][0];
    const s = status[c][0];
    if(s === 'AC') { // ACのとき
      if(!rankingData[u]) { // データが登録されているとき登録する
        rankingData[u] = {score : [u, 0, 0, 0, 0, 0, 0], sum : 0};
      }
      if(!rankingData[u].score[i]) { // 初めてACしたとき
        rankingData[u].score[i] = Number(i) * 100;
        rankingData[u].sum = Number(i) * 100;
      }
    }
  }
  
  let outputData = [];
  for(key in rankingData) {
    outputData.push(rankingData[key].score);
  }
  outputData.sort(function(a,b){
    if( a.sum > b.sum ) return -1;
    if( a.sum < b.sum ) return 1;
    return 0;
  });
  rankSheet.getRange(1, 1, outputData.length, 7 ).setValues(outputData);
}
