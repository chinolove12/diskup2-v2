const API="https://script.google.com/macros/s/AKfycbw_TxUk_XDnVgpkR5wprnzBAyLOW4D1_R98USUTeS-Qj2z0c-ff0MKgPj86UKJwlMeC/exec?mode=matrix"

const flags=[
"単独",
"一枚役A",
"一枚役B",
"一枚役C",
"一枚役D",
"共通１枚役",
"ベル",
"リプレイ",
"チェリー",
"スイカ",
"特リプ"
]

const bonus=[
"REG",
"赤BIG",
"青BIG",
"黒BIG",
"異色"
]

const theory={

"単独":{
"REG":"1/1365",
"赤BIG":"1/4681",
"青BIG":"1/5957",
"黒BIG":"1/1928",
"異色":"1/16384"
},

"一枚役A":{
"REG":"-",
"赤BIG":"1/5461",
"青BIG":"1/10922",
"黒BIG":"1/1928",
"異色":"1/13107"
},

"一枚役B":{
"REG":"1/5957",
"赤BIG":"1/7281",
"青BIG":"1/3449",
"黒BIG":"1/1928",
"異色":"-"
},

"一枚役C":{
"REG":"1/4369",
"赤BIG":"1/13107",
"青BIG":"1/16384",
"黒BIG":"1/7281",
"異色":"-"
},

"一枚役D":{
"REG":"1/4681",
"赤BIG":"1/6553",
"青BIG":"1/5957",
"黒BIG":"1/1928",
"異色":"-"
},

"共通１枚役":{
"REG":"1/5461",
"赤BIG":"1/9362",
"青BIG":"1/9362",
"黒BIG":"1/9362",
"異色":"-"
},

"ベル":{
"REG":"1/6553",
"赤BIG":"1/16384",
"青BIG":"1/16384",
"黒BIG":"1/16384",
"異色":"-"
},

"リプレイ":{
"REG":"1/6553",
"赤BIG":"-",
"青BIG":"1/10922",
"黒BIG":"1/10922",
"異色":"-"
},

"チェリー":{
"REG":"1/5461",
"赤BIG":"1/16384",
"青BIG":"1/16384",
"黒BIG":"1/16384",
"異色":"-"
},

"スイカ":{
"REG":"-",
"赤BIG":"1/16384",
"青BIG":"1/8192",
"黒BIG":"1/7281",
"異色":"-"
},

"特リプ":{
"REG":"-",
"赤BIG":"1/16384",
"青BIG":"1/16384",
"黒BIG":"-",
"異色":"-"
}

}

fetch(API)
.then(r=>r.json())
.then(data=>{

const table=document.getElementById("matrix")

let html="<tr><th>フラグ</th>"

bonus.forEach(b=>{
html+="<th>"+b+"</th>"
})

html+="</tr>"

const blueGroup=
data.count["単独"]["青BIG"]+
data.count["一枚役D"]["青BIG"]

const blackGroup=
data.count["単独"]["黒BIG"]+
data.count["一枚役A"]["黒BIG"]+
data.count["一枚役B"]["黒BIG"]+
data.count["一枚役D"]["黒BIG"]

flags.forEach(f=>{

html+="<tr>"
html+="<td>"+f+"</td>"

bonus.forEach(b=>{

let c=data.count?.[f]?.[b]??0

if(b==="青BIG"&&(f==="単独"||f==="一枚役D")){
c=blueGroup
}

if(
b==="黒BIG"&&
(
f==="単独"||
f==="一枚役A"||
f==="一枚役B"||
f==="一枚役D"
)
){
c=blackGroup
}

let actual="-"

if(c!==0){
const prob=Math.round(data.spin/c)
actual="1/"+prob
}

const t=theory[f][b]||""

html+=`
<td>
<div>${actual}</div>
<div class="theory">${t?`(${t})`:""}</div>
</td>
`

})

html+="</tr>"

})

table.innerHTML=html

})
