const SUMMARY_API = "https://script.google.com/macros/s/AKfycbwqPhvWPfQWY-VnolZDA1N69j0Q8oWhl0EDOUALmC2t1gGuTbMYhHVk85zuopPAv2hx/exec?mode=summary";

window.addEventListener("DOMContentLoaded", () => {
  const summaryEl = document.getElementById("summary");

  fetch(SUMMARY_API)
    .then(res => res.json())
    .then(data => {
      summaryEl.innerHTML = `
        <div>累計ゲーム数: ${data.totalRotations}</div>
        <div>BIG合計: ${data.totalBIG}</div>
        <div>REG合計: ${data.totalREG}</div>
        <div>BIG確率: ${data.totalBIGRate}</div>
        <div>REG確率: ${data.totalREGRate}</div>
        <div>合計差枚: ${data.totalDifference}</div>
        <div>ビタ成功率合計: ${data.totalBita}</div>
        <div>期待値合計: ${data.totalExpect}</div>
        <div>欠損合計: ${data.totalLoss}</div>
      `;
    })
    .catch(err => {
      console.error(err);
      summaryEl.innerHTML = `<div>データ取得エラー</div>`;
    });
});
