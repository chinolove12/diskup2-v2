const API_SUMMARY = "https://script.google.com/macros/s/AKfycbwjF8qz_ZOQJLbczkAuUS_xFb_OCg-W0QRSL7X8mclh_cknMX_l_J_zjU6zTl3vcWPK/exec?mode=summary";

// summaryを取得してサマリーカードに反映
fetch(API_SUMMARY)
  .then(res => res.json())
  .then(summary => {
    const keys = [
      "totalRotations",
      "totalBIG",
      "totalREG",
      "totalBIGRate",
      "totalREGRate",
      "totalDifference",
      "totalBita",
      "totalExpect",
      "totalLoss"
    ];
    const cards = document.querySelectorAll(".summary-card");
    keys.forEach((key, i) => {
      if(cards[i]){
        let val = summary[key];
    
        if(typeof val === "number"){
          if(key === "totalBita"){
            val = Math.round(val * 100) + "%";
          }else if(key === "totalBIGRate" || key === "totalREGRate"){
            val = "1/" + Math.round(val); // 例：1/200
          }
          }else{
            val = Math.round(val);
          }
        }
    
        cards[i].innerHTML = `${cards[i].textContent.split(":")[0]}: ${val}`;
      }
    });
  })
  .catch(err => console.error("summary取得エラー", err));
