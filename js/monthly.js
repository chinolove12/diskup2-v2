const API="https://script.google.com/macros/s/AKfycbxl0ldOB2HGrjexrD_55zj62MqC5YIOPnyiYa5BJ4OzGiXV7rs-SNk3Uz4p1huZW5fV/exec?mode=calendar";

let monthlyData={}
let monthlyExpectedData = {}

let currentDate=new Date()
let currentYear=currentDate.getFullYear()
let currentMonth=currentDate.getMonth()

let chart=null


/* ======================
   データ取得
====================== */

fetch(API)
.then(r=>r.json())
.then(data=>{

data.forEach(d=>{

if(!monthlyData[d.date]){
monthlyData[d.date]=0
}

if(!monthlyExpectedData[d.date]){
  monthlyExpectedData[d.date]=0
}

monthlyData[d.date]+=Number(d.diff)

monthlyData[d.date]+=Number(d.diff)
monthlyExpectedData[d.date]+=Number(d.expected)

})

drawCalendar()
drawGraph()

})


/* ======================
   月変更
====================== */

function prevMonth(){

currentMonth--

if(currentMonth<0){
currentMonth=11
currentYear--
}

drawCalendar()
drawGraph()

}

function nextMonth(){

currentMonth++

if(currentMonth>11){
currentMonth=0
currentYear++
}

drawCalendar()
drawGraph()

}


/* ======================
   カレンダー描画
====================== */

function drawCalendar(){

let expectedTotal = 0

const first=new Date(currentYear,currentMonth,1)
const last=new Date(currentYear,currentMonth+1,0)

const startWeek=first.getDay()
const totalDays=last.getDate()

document.getElementById("title").textContent=
`${currentYear}年 ${currentMonth+1}月`

const weeks=["日","月","火","水","木","金","土"]

let html="<tr>"

weeks.forEach((d,i)=>{

if(i===0) html+=`<th class="sun">${d}</th>`
else if(i===6) html+=`<th class="sat">${d}</th>`
else html+=`<th>${d}</th>`

})

html+="</tr><tr>"


/* 給料日計算 */

let salaryDay=20
let salaryDate=new Date(currentYear,currentMonth,20)

while(salaryDate.getDay()===0 || salaryDate.getDay()===6){
salaryDate.setDate(salaryDate.getDate()-1)
}

const salaryStr=
`${salaryDate.getFullYear()}-${String(salaryDate.getMonth()+1).padStart(2,"0")}-${String(salaryDate.getDate()).padStart(2,"0")}`


for(let i=0;i<startWeek;i++){
html+="<td></td>"
}

for(let d=1; d<=totalDays; d++){

const dateStr=
`${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`

const diff=monthlyData[dateStr]

let profitHTML=""
let cellClass=""

const today=new Date()
const todayStr=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`

if(dateStr===todayStr){
cellClass+=" today"
}

if(dateStr===salaryStr){
cellClass+=" salary"
}

if(diff!==undefined){

const sign=diff>0?"+":""

if(diff>0){
profitHTML=`<div class="profit plus">${sign}${diff}</div>`
cellClass+=" win"
}

else if(diff<0){
profitHTML=`<div class="profit minus">${diff}</div>`
cellClass+=" lose"
}

else{
profitHTML=`<div class="profit zero">0</div>`
}

}

const w=(startWeek+d-1)%7

let cls=""

if(w===0) cls="sun"
if(w===6) cls="sat"

html+=`<td class="${cls} ${cellClass}" onclick="location.href='nippo.html?date=${dateStr}'">${d}${profitHTML}</td>`

if(w===6 && d!==totalDays){
html+="</tr><tr>"
}

}

html+="</tr>"

document.getElementById("calendar").innerHTML=html


/* ======================
   月収支・勝率計算
====================== */

let total=0
let winDays=0
let playDays=0

Object.keys(monthlyData).forEach(d=>{

if(d.startsWith(`${currentYear}-${String(currentMonth+1).padStart(2,"0")}`)){

const diff=Number(monthlyData[d])

total+=diff
playDays++

if(diff>0){
winDays++
}

}

})

Object.keys(monthlyExpectedData).forEach(d=>{

if(d.startsWith(`${currentYear}-${String(currentMonth+1).padStart(2,"0")}`)){

  expectedTotal += Number(monthlyExpectedData[d])

}

})

const winRate=playDays?Math.round(winDays/playDays*100):0

document.getElementById("monthTotal").textContent=`月収支：${total}`
document.getElementById("winRate").textContent=`勝率：${winRate}%`
document.getElementById("playDays").textContent=`稼働日数：${playDays}`
}


/* ======================
   グラフ描画（累計差枚）
====================== */

function drawGraph(){

    const labels = ["0"]
    const values = [0]

    let total = 0

    Object.keys(monthlyData)
    .sort()
    .forEach(d => {

        if(d.startsWith(`${currentYear}-${String(currentMonth+1).padStart(2,"0")}`)){

            const day = d.slice(8)

            total += Number(monthlyData[d])

            labels.push(day)
            values.push(total)
        }
    })

    // ===== ここ追加（0中心のための計算）=====
    let max = Math.max(...values)
    let min = Math.min(...values)
    let maxAbs = Math.max(Math.abs(max), Math.abs(min))

    // 全部0だった場合の保険
    if(maxAbs === 0){
        maxAbs = 1
    }
    // =======================================

    const ctx = document.getElementById("chart")

    if(chart){
        chart.destroy()
    }

    chart = new Chart(ctx,{

        type:"line",

        data:{
            labels:labels,
            datasets:[{
                label:"累計差枚",
                data:values,
                tension:0.3,
                fill:false
            }]
        },

        options:{
            responsive:true,

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{
                y:{
                    // ★ここが今回の肝
                    min: -maxAbs,
                    max: maxAbs
                }
            }

        }

    })

}

document.getElementById("prev").addEventListener("click", prevMonth)
document.getElementById("next").addEventListener("click", nextMonth)
