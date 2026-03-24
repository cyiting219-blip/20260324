// 宣告用來存放水草資料的陣列，與要抽取的顏色組合
let seaweeds = [];
const colors = ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4'];

function setup() {
  // 採用全螢幕畫布
  let canvas = createCanvas(windowWidth, windowHeight);

  // 設定畫布為絕對定位並置頂，使用 pointer-events: none 讓滑鼠操作能穿透畫布，點擊到下方的 iframe
  canvas.position(0, 0);
  canvas.style('pointer-events', 'none');
  canvas.style('z-index', '10');

  // 去除網頁預設邊距，避免出現捲軸
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';

  // 產生充滿整個視窗的 iframe 並置於底層
  let iframe = document.createElement('iframe');
  iframe.src = 'https://www.et.tku.edu.tw/';
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.zIndex = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  // 初始化 80 條水草
  for (let i = 0; i < 80; i++) {
    // 從陣列中隨機抽出顏色並轉換為 p5 的 color 物件，加入透明度 (0~255)
    let seaweedColor = color(random(colors));
    seaweedColor.setAlpha(180); // 180 代表保留約 70% 的不透明度

    seaweeds.push({
      // X 座標比例 (0 ~ 1)，讓水草隨機散佈於視窗左到右
      xRatio: random(1),
      // 儲存帶有透明度設定的顏色
      c: seaweedColor,
      // 水草粗細落在 40 到 50 之間
      weight: random(40, 50),
      // 頂部高度設定為視窗高度的大約一半 (45% ~ 55%)
      hRatio: random(0.45, 0.55),
      // 讓每條水草的搖晃速度不一樣
      speed: random(0.005, 0.03),
      // 給予 noise 不同的初始偏移量，確保大家不會同時往同一邊搖
      offset: random(1000)
    });
  }
}

function draw() {
  // 每一幀先清空畫布，避免半透明背景與水草產生殘影
  clear();

  // 繪製透明度為 0.3 的背景 (#90e0ef 轉換為 RGB 是 144, 224, 239，透明度 0.3 即為 255 * 0.3 = 76.5)
  noStroke();
  fill(144, 224, 239, 76.5);
  rect(0, 0, width, height);

  // 明確指定使用 BLEND 混合模式，讓具有透明度的顏色能夠自然交疊
  blendMode(BLEND);

  noFill();

  // 迴圈讀取陣列，畫出 80 條水草
  for (let i = 0; i < seaweeds.length; i++) {
    let s = seaweeds[i];
    stroke(s.c);
    strokeWeight(s.weight);

    beginShape();
    // 取得這根水草專屬的目標高度
    let targetY = height * s.hRatio;
    for (let y = height; y > targetY; y -= 10) {
      // 代入這根水草的搖晃速度與時間偏移值，產出獨立的擺動幅度
      let n = noise(frameCount * s.speed + s.offset, y * 0.005);
      let xOffset = map(n, 0, 1, -75, 75);
      let sway = map(y, height, targetY, 0, 1);
      
      // 將寬度乘上比例取得真實的 X 座標
      vertex((width * s.xRatio) + xOffset * sway, y);
    }
    endShape();
  }
}

// 當視窗大小改變時，重新調整畫布以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
