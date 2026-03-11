const API_SUMMARY = "https://script.google.com/macros/s/AKfycbwjF8qz_ZOQJLbczkAuUS_xFb_OCg-W0QRSL7X8mclh_cknMX_l_J_zjU6zTl3vcWPK/exec?mode=summary"; 

fetch(API_SUMMARY)
  .then(res => res.json())
  .then(summary => {
    const el = document.getElementById("info-history");
    if(el){
      el.innerHTML = `
        累計ゲーム数: ${summary.totalRotations}<br>
        BIG合計: ${summary.totalBIG}<br>
        REG合計: ${summary.totalREG}<br>
        BIG確率: ${summary.totalBIGRate.toFixed(2)}<br>
        REG確率: ${summary.totalREGRate.toFixed(2)}<br>
        合計差枚: ${summary.totalDifference}<br>
        ビタ成功率合計: ${(summary.totalBita*100).toFixed(2)}%<br>
        期待値合計: ${summary.totalExpect.toFixed(2)}<br>
        欠損合計: ${summary.totalLoss.toFixed(2)}
      `;
    }
  })
  .catch(err => {
    console.error("summary取得エラー", err);
  });
