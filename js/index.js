const API_SUMMARY = "https://script.google.com/macros/s/AKfycbwjF8qz_ZOQJLbczkAuUS_xFb_OCg-W0QRSL7X8mclh_cknMX_l_J_zjU6zTl3vcWPK/exec?mode=summary"; // GAS URLに置換

// summaryを取得して履歴入力下に表示
fetch(API_SUMMARY)
  .then(res => res.json())
  .then(summary => {
    const el = document.getElementById("info-history");
    if(el){
      el.innerHTML = `
        累計ゲーム数: ${summary.B3}<br>
        BIG合計: ${summary.C3}<br>
        REG合計: ${summary.D3}<br>
        BIG確率: ${summary.E3}<br>
        REG確率: ${summary.F3}<br>
        合計差枚: ${summary.H3}<br>
        ビタ成功率合計: ${summary.J3}<br>
        期待値合計: ${summary.K3}<br>
        欠損合計: ${summary.L3}
      `;
    }
  })
  .catch(err => {
    console.error("summary取得エラー", err);
  });
