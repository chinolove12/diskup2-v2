const API="https://script.google.com/macros/s/AKfycbyoJfkCuM_EmskTYi_0s42YEPej75clTLeZhn09QMg-7jZYUyk9Qpib7Xmi1hyYbzRU/exec"

let monthlyData={}

fetch(API)
.then(r=>r.json())
.then(data=>{

data.forEach(d=>{
monthlyData[d.date]=d.diff
})

drawCalendar()
drawGraph()

})
.catch(e=>{
console.log(e)
})


function drawCalendar(){

const now=new Date()
const year=now.getFullYear()
const month=now.getMonth()

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

for(let i=0;i<startWeek;i++){
html+="<td></td>"
}

for(let d=1;d<=totalDays;d++){

const dateStr=
`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`

const diff=monthlyData[dateStr]

let profitHTML=""

if(diff!==undefined){

const cls=diff>=0?"plus":"minus"
const sign=diff>0?"+":""

profitHTML=`<div class="profit ${cls}">${sign}${diff}</div>`

}

const w=(startWeek+d-1)%7

let cls=""
if(w===0) cls="sun"
if(w===6) cls="sat"

html+=`<td class="${cls}">${d}${profitHTML}</td>`

if(w===6 && d!==totalDays){
html+="</tr><tr>"
}

}

html+="</tr>"

document.getElementById("calendar").innerHTML=html

}


function drawGraph(){

const now=new Date()
const year=now.getFullYear()
const month=String(now.getMonth()+1).padStart(2,"0")

const labels=[]
const values=[]

Object.keys(monthlyData).forEach(d=>{

if(d.startsWith(`${year}-${month}`)){

labels.push(d.slice(8))
values.push(monthlyData[d])

}

})

new Chart(document.getElementById("chart"),{

type:"bar",

data:{
labels:labels,
datasets:[{
label:"差枚",
data:values
}]
}

})

}
