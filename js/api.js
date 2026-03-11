const API_URL="https://script.google.com/macros/s/AKfycbx6YwdFjjnO8h9prGPlLeAZX97XUblQUDItY8NV2e-5zLNq6n-ouFUww4aZLf7bMhcw/exec?mode=records"

let records=[]

function addRecord(){

const spin=document.getElementById("spin").value
const role=document.getElementById("role").value
const triggers=document.getElementById("triggers").value
const memo=document.getElementById("memo").value

if(!spin||!role){
alert("回転数 と 当選役 は必須です")
return
}

const data={
spin:Number(spin),
role:role,
triggers:triggers,
memo:memo
}

fetch(API_URL,{
method:"POST",
body:JSON.stringify(data)
})
.then(()=>{
clearInput()
loadRecords()
})

}

function clearInput(){

document.getElementById("spin").value=""
document.getElementById("role").value=""
document.getElementById("triggers").value=""
document.getElementById("memo").value=""

}

function loadRecords(){

fetch(API_URL)
.then(res=>res.json())
.then(data=>{

records=data.map(r=>({
spin:r[1],
role:r[2],
triggers:r[3],
memo:r[4]
}))

render()

})

}

function getColorClass(role){

switch(role){
case "赤BIG": return "red"
case "青BIG": return "blue"
case "黒BIG": return "black"
case "REG": return "gray"
case "異色BIG": return "mixed"
default: return ""
}

}

function render(){

const list=document.getElementById("list")
list.innerHTML=""

for(let i=records.length-1;i>=0;i--){

const r=records[i]

const div=document.createElement("div")
div.className="record "+getColorClass(r.role)

div.innerHTML=`
<div>回転数：${r.spin}</div>
<div>当選役：${r.role}</div>
<div>当選契機：${r.triggers || "－"}</div>
<div>メモ：${r.memo || "－"}</div>
`

list.appendChild(div)

}

updateStatus()

}

function updateStatus(){

const totalGames=records.reduce((s,r)=>s+Number(r.spin),0)

const bigCount=records.filter(r=>r.role.includes("BIG")).length
const regCount=records.filter(r=>r.role==="REG").length

const bigProb=bigCount?`1/${Math.round(totalGames/bigCount)}`:"-"
const regProb=regCount?`1/${Math.round(totalGames/regCount)}`:"-"

document.getElementById("status").innerHTML=
`合計ゲーム数：${totalGames}<br>
BIG合計：${bigCount}<br>
REG合計：${regCount}<br>
BIG確率：${bigProb}<br>
REG確率：${regProb}`

}

window.onload=loadRecords
