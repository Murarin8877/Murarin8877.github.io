var CourseHanziArray = JSON.parse(sessionStorage.getItem('CourseHanziArray')); //抓取SelectCourse.html傳來的漢字資料
var AllHanzi = CourseHanziArray; //此課程生字
let Hanzi_index = 0;//課程生字的在陣列位置
var Hanzi_SvgSize=''; //CourseAllHanzi
var screenWidth; // 獲取螢幕寬度
var screenHeight; // 獲取螢幕高度
var svgWidth; //設定AllHanzi-container svg的寬
var svgHeight;//設定AllHanzi-container svg的高
//設定 
var VarAnimationspeed  //設定動畫播報速度
var VarshowHintAfterMisses //設定錯誤次數提示
var VardrawingWidth //設定畫筆大小



//請勿動 筆順練習時需要以下數值來讀取繪畫筆畫位置 。
function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

window.onload = function () {
  
  setTimeout(function () {
        $(document).ready(function () {
            document.getElementById("loader").style.display = "none"; //載入區塊隱藏
            document.getElementById("myDiv").style.display = "block";//內容區塊 開啟
            updateCharacter();//避免筆順練習區塊 抓不到value
        });
     }, 800);
    CourseAllHanzi()//取得此課程的所有漢字
    updateCharacter();//更新 如有變動工具列數值等等
    getData();//漢字 部首 注音
    AllHintStroke();
    SettingUpdateValue();
    document.querySelector('#animation').addEventListener('click', function () {
      /* target.classList.remove('pen-icon');//移除鼠標樣式 */
      /* VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value; //繪畫速度 */
      
      /* console.log(Animationspeed); */
      updateCharacter();
      getData();
      writer.animateCharacter();
      /* HiddenCanvas(); */
    });
    //按下測驗按鈕
    document.querySelector('#generally').addEventListener('click', function () {
    /* VarshowHintAfterMisses = document.querySelector('[name="HintAfterMisses"]').value; //錯誤提示
    VardrawingWidth = document.querySelector('[name="drawingWidth"]').value //筆畫粗細 */
    updateCharacter();
    /* HiddenCanvas(); */
    let i=1;
    var opts = {
      
      onMistake: function(strokeData) {
        consoleLog('目前第'+  (strokeData.strokeNum+i) +'筆畫錯誤。');
        consoleLog("你在這個筆劃上犯了 " + strokeData.mistakesOnStroke + " 個錯誤!");
        consoleLog("目前總共錯誤 " + strokeData.totalMistakes + " 次。");
        consoleLog("距離完成還有" + strokeData.strokesRemaining + "個筆畫。");
        consoleLog("");
      },
      onCorrectStroke: function(strokeData) {
        consoleLog('很好! 你畫的第' + (strokeData.strokeNum+i) + '筆畫是正確的!');
        consoleLog("你在這個筆劃上犯了 " + strokeData.mistakesOnStroke + " 個錯誤!");
        consoleLog("目前總共錯誤 " + strokeData.totalMistakes+ " 次。");
        consoleLog("距離完成還有" + strokeData.strokesRemaining + "個筆畫。");
        consoleLog("");
      },
      onComplete: function(summaryData) {
        consoleLog('Ya~你完成了! 你畫完' + summaryData.character +"這個字了");
        consoleLog("總共錯誤 " + summaryData.totalMistakes + " 次。");
        consoleLog("");
      }
    }
    writer.quiz();
  });
  screenWidth = window.innerWidth; //螢幕寬度
  screenHeight = window.innerHeight; //螢幕高度
  svgWidth = screenHeight * 0.15; //設置課程的所有漢字SVG高度為螢幕寬度的16%
  svgHeight = screenHeight * 0.15;//設置課程的所有漢字SVG高度為螢幕高度的16%
};


//漢字筆順順序區塊
function renderFanningStrokes(target, strokes) {
  var docs_target_div = document.getElementById("docs-target-HintAllstroke");
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '80px';
  svg.style.height = '80px';
  svg.style.border = '1px solid black'
  svg.style.marginRight = '1px'
  svg.classList.add("docshanzi_Svg"); // 添加共同的 classname

  var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  var transformData = HanziWriter.getScalingTransform(80, 80);
  group.setAttributeNS(null, 'transform', transformData.transform);
  svg.appendChild(group);

  strokes.forEach(function(strokePath) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);
    path.style.fill = '#555';
    group.appendChild(path);
  });
  
  docs_target_div.appendChild(svg); // 將 SVG 加到 div 內
  docs_target_div.appendChild(document.createElement("br"));
  docs_target_div.appendChild(document.createElement("br"));
}
function AllHintStroke(){
  document.getElementById("docs-target-HintAllstroke").innerHTML = '';
  HanziWriter.loadCharacterData(AllHanzi[Hanzi_index]).then(function(charData) {
    var target = document.getElementById('target');
    for (var i = 0; i < charData.strokes.length; i++) {
      var strokesPortion = charData.strokes.slice(0, i + 1);
      renderFanningStrokes(target, strokesPortion);
    }
  });
}


//取得此課程的所有漢字  HanziWriter.loadCharacterData() 是非同步的函數
//此方法async/await 僅適用於現代瀏覽器 舊瀏覽器須注意
async function CourseAllHanzi() 
{
    var target = document.getElementById('AllHanzi-container'); //存放按下確定後的所有漢字的容器 div
    /* console.log(size); */
    for (var i = 0; i < AllHanzi.length; i++) {
      var charData = await HanziWriter.loadCharacterData(AllHanzi[i]);
      
      var hanziDiv = document.createElement('div');
      hanziDiv.className = 'Hanzi-container'; // 可以為這個div加上一個自定義的class名稱，以便您對它進行樣式設置
      target.appendChild(hanziDiv);
      
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.width = svgWidth;
      svg.style.height = svgHeight;
      svg.style.border = '1px solid black';
      svg.setAttribute('class', 'HanziSvg');
      svg.setAttribute('id', `HanziSvg_${i}`);
      hanziDiv.appendChild(svg);
  
      var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      // set the transform property on the g element so the character renders at 150x150
      var transformData = HanziWriter.getScalingTransform(svgWidth, svgHeight);
      group.setAttributeNS(null, 'transform', transformData.transform);
      svg.appendChild(group);
  
      hanziDiv.appendChild(document.createElement("br"));
      hanziDiv.appendChild(document.createElement("br"));
  
      charData.strokes.forEach(function(strokePath) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        // style the character paths
        path.style.fill = '#555';
        group.appendChild(path);
      });
    }
    let HanziSvg0 = document.getElementById('HanziSvg_0');
    HanziSvg0.style.border = '1px solid red';
}
/* 底下為統一在一個容器底下的code */
/* async function CourseAllHanzi() 
{
    var target = document.getElementById('tmp-svg'); //存放按下確定後的所有漢字 div
    for (var i = 0; i < AllHanzi.length; i++) {
      var charData = await HanziWriter.loadCharacterData(AllHanzi[i]);
      
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.width = 150;
      svg.style.height = 150;
      svg.style.border = '1px solid black';
      target.appendChild(svg);
  
      var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      // set the transform property on the g element so the character renders at 150x150
      var transformData = HanziWriter.getScalingTransform(150, 150);
      group.setAttributeNS(null, 'transform', transformData.transform);
      svg.appendChild(group);
  
      target.appendChild(document.createElement("br"));
      target.appendChild(document.createElement("br"));
  
      charData.strokes.forEach(function(strokePath) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        // style the character paths
        path.style.fill = '#555';
        group.appendChild(path);
      });
  
      
    }
  } */

  function updateCharacter() {
    /* 取得筆順區塊大小 */
    const divElement = document.getElementById('StrokeBlock');
    const divWidth = divElement.clientWidth;
    const divHeight = divElement.clientHeight;
    document.querySelector('#target').innerHTML = '';
    SettingUpdateValue();
    /* var character = document.querySelector('.js-char').value; */
  
    /* window.location.hash = character; */
    
    writer = HanziWriter.create('target', AllHanzi[Hanzi_index], {
      width: divWidth,
      height: divHeight,
      renderer: 'svg',
      onCorrectStroke: printStrokePoints,
      onMistake: printStrokePoints,
      radicalColor: '#166E16',//部首顏色
      showCharacter: false,
      strokeAnimationSpeed: VarAnimationspeed, //繪製筆畫速度
      strokeHighlightSpeed: 0.45, //提示筆畫速度
      highlightColor: '#ffa500',//提示顏色
      showHintAfterMisses: VarshowHintAfterMisses, 
      drawingWidth: VardrawingWidth, //繪製筆寬度 
    });
    isCharVisible = true;
    isOutlineVisible = true;
    window.writer = writer;
  }

//更新所設定之值
function SettingUpdateValue(){
  VarAnimationspeed = document.querySelector('[name="Animationspeed"]').value;
  VarshowHintAfterMisses = document.querySelector('[name = HintAfterMisses]').value;
  VardrawingWidth = document.querySelector('[name = drawingWidth]').value;
}

//AllHanzi-container
//被選擇到的框線 需變紅色
function HanziSvg_Activeborder(){
  var HanziSvg =document.getElementById( `HanziSvg_${Hanzi_index}`)
  HanziSvg.style.border = '1px solid red';
}
//復原框線顏色
function HanziSvg_Passiveborder() {
  var HanziSvg =document.getElementById( `HanziSvg_${Hanzi_index}`)
  HanziSvg.style.border = '1px solid black';
}

//使用箭頭來調整練習的漢字
function Previoushanzi()//按下 上一個 的按鈕 <=
{
  HanziSvg_Passiveborder();
  //如果是在第一個漢字 按下 "上一個箭頭"漢字就會到最後一個漢字
  if(Hanzi_index == 0)
  {
    Hanzi_index= AllHanzi.length-1
    /* console.log("到最後一個漢字"); */
  }
  else if(Hanzi_index>0)
  {
    Hanzi_index-=1;
  }
  /* console.log("目前是:"+Hanzi_index+"Prev"); */
  
  updateCharacter();
  getData();
  AllHintStroke();
  HanziSvg_Activeborder();
  /* HiddenAllHintstroke();
  HiddenCanvas(); */
}

function Nexthanzi()//按下 下一個 的按鈕 =>
{
  HanziSvg_Passiveborder();
  //如果是在最後一個漢字 按下 "下一個箭頭"漢字就會到第一個漢字
  if(Hanzi_index== AllHanzi.length-1){
    Hanzi_index=0
  }
  else if(Hanzi_index <AllHanzi.length)
  {
    Hanzi_index+=1;
  }
  /* console.log("目前是:"+Hanzi_index+"next"); */
  
  updateCharacter();
  getData();
  AllHintStroke();
  HanziSvg_Activeborder();

  /* HiddenAllHintstroke();
  HiddenCanvas(); */
}
const msg = new SpeechSynthesisUtterance(); //come from WEB Speech API
let voices = [];
let options = [];
let speakButton;
//語音播報 漢字資訊
window.addEventListener('load', function() {
  speakButton = document.querySelector('#speak');
  options = document.querySelectorAll('[type="range"], [id="customRange1txt"]');
  if (speakButton) {
    console.log('speak')
    speakButton.addEventListener('click',toggle);
  }
  // 利用 SpeechSynthesis.getVoices()方法，取得包含所有SpeechSynthesisVoice 物件的陣列，而這些物件表示當前設備上可用之語音
  function populateVoices(){
    voices = this.getVoices();
    console.log(voices);
    msg.lang = "zh-TW"
  }

  //觸發播放
  function toggle(startOver = true){
    speechSynthesis.cancel(); // stop speaking
    if(startOver){
    speechSynthesis.speak(msg); // restart speaking
    }
  }
  // 改變utterance的rate,pitch屬性的值
  function setOption(){
    if(this.name == 'rate'){
      console.log("成功");
      console.log(this.name,this.value);
      msg[this.name] = this.value;
      toggle();
      console.log(this.value);
      /* document.getElementById("customRange1txt").innerHTML = this.value; */
    }
  
  }
  speechSynthesis.addEventListener('voiceschanged',populateVoices);
  options.forEach(option => option.addEventListener('change',setOption));
});



//取得漢字的資訊 部首 筆畫
function getData()
{
  var a = AllHanzi[Hanzi_index];
  var xhr = new XMLHttpRequest();
  let s = "https://www.moedict.tw/raw/" + a

  xhr.open("GET", s, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var w_data = [data["title"], data["radical"], data["stroke_count"], data["heteronyms"][0]["bopomofo"]];
          var s = w_data[0] + ", " + w_data[1] + "部, " + "共" + w_data[2] + "畫, " + w_data[3]
          msg.text = s;
          if(w_data[1] == '{[8f54]}')//足部
          {
            const unicodeRadical = "8FB5"; // 該字的 Unicode 部首編碼
            const radicalChar = String.fromCodePoint(parseInt(unicodeRadical, 16));
            w_data[1]=radicalChar;
            console.log(radicalChar); // 顯示
          }
          else if(w_data[1] == '{[8ef3]}')
          {
            const unicodeRadical = "5E7F"; // 該字的 Unicode 部首編碼
            const radicalChar = String.fromCodePoint(parseInt(unicodeRadical, 16));
            w_data[1]=radicalChar;
            console.log(radicalChar); // 顯示
          }
          else if(w_data[1] == '{[fbfd]}')
          {
            const unicodeRadical = "5B80"; // 該字的 Unicode 部首編碼
            const radicalChar = String.fromCodePoint(parseInt(unicodeRadical, 16));
            w_data[1]=radicalChar;
            console.log(radicalChar); // 顯示
          }
          /* document.querySelector('[name="text"]').innerHTML=s */
          /* console.log(w_data[3]); */

          text2 = "<table> <tr>";

          text2 += "<th bgcolor='transparent' colspan='2'>" +"部首"+"</th>";
          text2 += "<th bgcolor='transparent' colspan='2'>" +"注音"+"</th>";
          text2 += "<th bgcolor='transparent' colspan='2'>" +"總筆畫"+"</th>";

          text2 += "</tr><tr>";
          text2 += "<th colspan='2'>" + w_data[1] + "</th>";
          text2 += "<th colspan='2'>" + "<rt>" +  w_data[3] + "</rt>" + "</th>";
          text2 += "<th colspan='2'>" + w_data[2] + "</th>";
          

          text2 += "</tr></table>";
          document.getElementById("char-dictionary").innerHTML = text2;
      }
  };
  xhr.send();
}

