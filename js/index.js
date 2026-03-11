const API_SUMMARY = "https://script.google.com/macros/s/AKfycbwjF8qz_ZOQJLbczkAuUS_xFb_OCg-W0QRSL7X8mclh_cknMX_l_J_zjU6zTl3vcWPK/exec?mode=summary"; 

fetch(API_SUMMARY)
  .then(res => res.json())
  .then(summary => {
    document.getElementById("totalRotations").textContent = summary.totalRotations;
    document.getElementById("totalBIG").textContent = summary.totalBIG;
    document.getElementById("totalREG").textContent = summary.totalREG;
    document.getElementById("totalBIGRate").textContent = summary.totalBIGRate.toFixed(2);
    document.getElementById("totalREGRate").textContent = summary.totalREGRate.toFixed(2);
    document.getElementById("totalDifference").textContent = summary.totalDifference;
    document.getElementById("totalBita").textContent = (summary.totalBita*100).toFixed(1) + '%';
    document.getElementById("totalExpect").textContent = summary.totalExpect.toFixed(0);
    document.getElementById("totalLoss").textContent = summary.totalLoss.toFixed(0);
  })
  .catch(err => {
    console.error("summary取得エラー", err);
  });
