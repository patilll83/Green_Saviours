function add_row(){
    //alert("hi")
    var tableRow = document.getElementById("table");
var row = document.createElement("tr");
var cell1 = document.createElement("td");
var cell2 = document.createElement("td");
var cell3 = document.createElement("td");
var cell4 = document.createElement("td");
var cell5 = document.createElement("td");

cell1.innerHTML = "1";

var plantnm= document.getElementById("plant_name").value;
var qty= document.getElementById("qty").value;
if(qty==""){
    alert("please enter quantity");
    return 0;
}
var added_date= document.getElementById("added_date").value;
if(added_date==""){
    alert("please select date");
    return 0;
}
var s=document.getElementById("pl_de").value;


s=s+plantnm+"<==>"+qty+"<==>"+added_date+"<====>";
document.getElementById("pl_de").value=s;

// alert(s);
length = tableRow.rows.length;
document.getElementById("row_count").value=length;
cell1.innerHTML = length;

 cell2.innerHTML =plantnm;
 cell3.innerHTML =qty ;
 cell4.innerHTML =added_date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short",formatMatcher:" day, month,year,  hour, minute"}) ;
    
    
    
    
 cell5.innerHTML = "<a style='margin-top:2px;padding: 6px 15px;font-size: 18px;color: white;border-radius: 0px;background-color: #3fb545;' onclick='remove()'>Delete</a>";
 

 

 row.appendChild(cell1);
 row.appendChild(cell2);
 row.appendChild(cell3);
 row.appendChild(cell4);
 row.appendChild(cell5);


 


 tableRow.appendChild(row);
}


function add_row_volunteer(){
    //alert("hi")
    var tableRow = document.getElementById("table_v");
var row = document.createElement("tr");
var cell1 = document.createElement("td");
var cell2 = document.createElement("td");
var cell3 = document.createElement("td");
var cell4 = document.createElement("td");
var cell5 = document.createElement("td");

// cell1.innerHTML = "1";

var volunteers= document.getElementById("volunteers").value;

var added_date= document.getElementById("added_date").value;
if(added_date==""){
    alert("please select date");
    return 0;
}
var s=document.getElementById("pl_de").value;


s=s+volunteers+"<==>"+added_date+"<====>";
document.getElementById("pl_de").value=s;

// alert(s);
length = tableRow.rows.length;
document.getElementById("row_count").value=length;
cell1.innerHTML = length;
var aa=volunteers.toString();
		var	bb=aa.split("<==>");


 cell2.innerHTML = bb[0];
 cell3.innerHTML = added_date.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short",formatMatcher:" day, month,year,  hour, minute"});

 cell4.innerHTML = "<a style='margin-top:2px;padding: 6px 15px;font-size: 18px;color: white;border-radius: 0px;background-color: #3fb545;' onclick='remove()'>Delete</a>";
 
 document.getElementById("table").getElementsByTagName("tr").getElementsByTagName("td").style.padding="9px";
//  cell1.style.fontWeight='bold'
//  cell1.style.padding="9px";

//  cell2.style.padding="9px";
//  cell3.style.padding="9px";
//  cell4.style.padding="9px";


 row.appendChild(cell1);
 row.appendChild(cell2);
 row.appendChild(cell3);
 row.appendChild(cell4);



 


 tableRow.appendChild(row);
}