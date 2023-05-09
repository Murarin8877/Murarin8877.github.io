document.querySelector('.js-hardquiz').addEventListener('click', function (){
    CanvasHanziBg(AllHanzi[Hanzi_index]);
    //canvas
    // Canvas DOM 元素

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    

    ctx.strokeStyle = 'black'
    
    //起始點座標
    let x1= 0
    let y1= 0

    // 終點座標
    let x2= 0
    let y2= 0

    // 宣告一個 hasTouchEvent 變數，來檢查是否有 touch 的事件存在
    const hasTouchEvent = 'ontouchstart' in window ? true : false

    // 透過上方的 hasTouchEvent 來決定要監聽的是 mouse 還是 touch 的事件
    const downEvent = hasTouchEvent ? 'ontouchstart' : 'mousedown'
    const moveEvent = hasTouchEvent ? 'ontouchmove' : 'mousemove'
    const upEvent = hasTouchEvent ? 'touchend' : 'mouseup'

    // 宣告 isMouseActive 為滑鼠點擊的狀態，因為我們需要滑鼠在 mousedown 的狀態時，才會監聽 mousemove 的狀態
    
    const btns = document.querySelectorAll('.btn-check');
    ctx.lineWidth = 10; //預設筆畫大小
    //根據選擇的筆順大小 來調整
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.id === 'btnradio1') {
          ctx.lineWidth = 10;
        } else if (btn.id === 'btnradio2') {
          ctx.lineWidth = 15;
        } else if (btn.id === 'btnradio3') {
          ctx.lineWidth = 20;
        }
      });
    });



    var isMouseActive = false;
    canvas.addEventListener("mousedown", function(e) {
      isMouseActive = true;
      x1 = e.offsetX;
      y1 = e.offsetY;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    });


    
    canvas.addEventListener("mousemove", function (e) {
      var eraser = document.getElementById("eraser");//橡皮擦按鈕
      if (eraser.checked && e.buttons === 1) { // 判斷左鍵是否按下
        
        isMouseActive = false;
        console.log("擦");
        var w = 20;
        var h = 20;
        var x = e.pageX - canvas.offsetLeft - w / 2;
        var y = e.pageY - canvas.offsetTop - h / 2;
        ctx.clearRect(x, y, w, h);
      } else {
        
        if (!isMouseActive) {
          return;
        }
        x2 = e.offsetX;
        y2 = e.offsetY;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke()
        // 更新起始點座標
        x1 = x2
        y1 = y2
      }
    });
    



    canvas.addEventListener(upEvent, function(e){
      isMouseActive = false
    })

    clear.onclick= function(){
      ClearCanvas();
      ctx.lineWidth = 10;//不加這行會導致 筆畫沒抓到值
    }
  });
  //清除畫布按鈕
  var clear = document.getElementById("clear-canvas");
  function ClearCanvas(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
  }  
  //鼠標改成橡皮擦
  /* const eraserCheckbox = document.getElementById('eraser');
  eraserCheckbox.addEventListener('change',function(){
    if (this.checked) {
      canvas.classList.add('eraser');
    } else {
      canvas.classList.remove('eraser');
    }
  }); */