const API="https://script.google.com/macros/s/AKfycbyoJfkCuM_EmskTYi_0s42YEPej75clTLeZhn09QMg-7jZYUyk9Qpib7Xmi1hyYbzRU/exec"

let monthlyData={}
let current=new Date()

fetch(API)
.then(r=>r.json())
.then(data=>{

data.forEach(d=>{
monthlyData[d.date]=d.diff
})

draw()

})

document.getElementById("prev").onclick=()=>{
current.setMonth(current.getMonth()-1)
draw()
}

document.getElementById("next").onclick=()=>{
current.setMonth(current.getMonth()+1)
draw()
}

function draw(){

drawCalendar()
drawSummary()
drawGraph()

}


function drawCalendar(){

const year=current.getFullYear()
const month=current.getMonth()

document.getElementById("title").textContent=`${year}年 ${month+1}月`

const first=new Date(year,month,1)
const last=new Date(year,month+1,0)

const startWeek=first.getDay()
const totalDays=last.getDate()

const weeks=["日","月","火","水","木","金","土"]

let html="<tr>"

weeks.forEach((d,i)=>{

if(i===0) html+=`<th class="sun">${d}</th>`
else if(i===6) html+=`<th class="sat">${d}</th>`
else html+=`<th>${d}</th>`

})

html+="</tr><tr>"

for(let i=0;i<startWeek;i++) html+="<td></td>"

for(let d=1;d<=totalDays;d++){

const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`

const diff=monthlyData[dateStr]

let profitHTML=""
let cls=""

if(diff!==undefined){

const sign=diff>0?"+":""
const pcls=diff>=0?"plus":"minus"

profitHTML=`<div class="profit ${pcls}">${sign}${diff}</div>`

cls=diff>=0?"win":"lose"

}

const w=(startWeek+d-1)%7

let dayCls=""

if(w===0) dayCls="sun"
if(w===6) dayCls="sat"

html+=`<td class="${dayCls} ${cls}">${d}${profitHTML}</td>`

if(w===6 && d!==totalDays) html+="</tr><tr>"

}

html+="</tr>"

document.getElementById("calendar").innerHTML=html

}


function drawSummary(){

const year=current.getFullYear()
const month=String(current.getMonth()+1).padStart(2,"0")

let total=0
let win=0
let lose=0

Object.entries(monthlyData).forEach(([d,v])=>{

if(d.startsWith(`${year}-${month}`)){

total+=v

if(v>=0) win++
else lose++

}

})

document.getElementById("monthTotal").textContent=`月収支：${total}`

const rate=win+lose?Math.round(win/(win+lose)*100):0

document.getElementById("winRate").textContent=`勝率：${rate}%`

}


function drawGraph(){

const year=current.getFullYear()
const month=String(current.getMonth()+1).padStart(2,"0")

const labels=[]
const values=[]

Object.entries(monthlyData).forEach(([d,v])=>{

if(d.startsWith(`${year}-${month}`)){

labels.push(d.slice(8))
values.push(v)

}

})

new Chart(document.getElementById("chart"),{

type:"line",

data:{
labels:labels,
datasets:[{
label:"差枚",
data:values,
tension:0.3
}]
}

})

}
