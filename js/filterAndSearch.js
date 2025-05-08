const baseUrl = "https://www.themealdb.com/api/json/v1/1";
let arr = [];
let ingredients = [];
let searcedData={meals:[]}
var choosedIngredients=[];
var auto_list=document.querySelector(".autocomplete .list-group");
var items=auto_list.querySelectorAll("li");
import {getData, BuildCards} from "./home.js"


(
    function(){
       
        fillByIngredients();
        var current_focus=-1
        var search=document.querySelector("input[type=search]")

        search.addEventListener("input",()=>{
            auto_list.innerHTML=""
            if(search.value.length>0)
            {
                current_focus=-1
                ingredients.forEach(ing =>{
                    items=auto_list.querySelectorAll("li")

                    if((ing.strIngredient).toLowerCase().startsWith(search.value))
                    {
                        // console.log(ing.strIngredient);
                    
                        var li=document.createElement("li")
                        li.innerText=ing.strIngredient
                        li.classList.add("list-group-item")
                        if(items.length==0)
                            li.classList.add("border-top-0")
                        auto_list.appendChild(li)
                    }
                })
                // console.log(items);
                items.forEach((item)=>{
                    item.addEventListener("click",()=>{
                        choosedIngredients.push(item.innerText);
                        fill_ingredients()
                        search.value=""

                    })
                })
            }
        });
   
        
        search.addEventListener("keyup",(e)=>{
            // console.log("clicked",e.keyCode);
            
            items=auto_list.querySelectorAll("li")

            if(e.keyCode=="40")
            {                   
                current_focus=(current_focus+1)%items.length;
                // console.log(current_focus);
                highlight(current_focus)
            }
            else if(e.keyCode=="38")
            {
                current_focus=(current_focus-1+items.length)%items.length;
                // console.log(current_focus);
                highlight(current_focus)
            }
            else if(e.keyCode=="13")
            {
                if(current_focus>=0){
                items[current_focus].click()
                auto_list.innerHTML=""
                }
            }
        });
        document.addEventListener("click",()=>{
         if(document.activeElement!==search)
             auto_list.innerHTML=""
        });
        document.addEventListener("mousemove",function(){
            
            items.forEach((item,ind)=>{
                if(item.matches(':hover'))
                {
                    highlight(ind)
                    current_focus=ind;
                }
            })

        });
       
        
    
    }()
);
//search functions
//to hover on autocomplete search box
function highlight(i){
    items.forEach((item)=>{
        item.classList.remove("hover_col")

    })
    if(i>-1 && i<items.length){
        items[i].classList.add("hover_col")
        items[i].scrollIntoView({ block: 'nearest' });

    }
}
//function to fill ingredients used to search
async function fill_ingredients(){
    var ingreds=document.querySelector("#ingredients .row")
    ingreds.innerHTML=""
    if(choosedIngredients.length==0)
        getData("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    else{
        await getsearchedData(choosedIngredients)
        console.log("out function",searcedData);
        BuildCards(searcedData)
    }
    choosedIngredients.forEach((item,ind)=>{
        var ingredient=document.createElement("div")
        ingredient.innerHTML=`<span>${item}</span><button onclick="deleteIngredient(${ind})" class="btn close align-self-end text-secondary p-0  pb-1 border-0">x</button>`
        ingredient.classList.add("col-sm-auto","me-1","ps-2","d-flex","justify-content-between","align-items-center")
        ingreds.appendChild(ingredient)
    });
}
//function to delete ingredient if needed
window.deleteIngredient = deleteIngredient;

function deleteIngredient(i){
    choosedIngredients.splice(i,1)
    fill_ingredients();
}

//filter functions


  async function getsearchedData(ingredients) {
    searcedData={meals:[]}
    for (const ingredient of ingredients) {
        
        let response = await fetch(`${baseUrl}/filter.php?i=${ingredient}`);
        response = await response.json();
        response = await response.meals;

        // console.log(response.meals);
        
        if(searcedData.meals.length==0)
            searcedData.meals= await response;
        else
        {
             searcedData.meals = searcedData.meals.filter(obj1 =>
                response.some(obj2 => obj2.idMeal === obj1.idMeal)
              );
        }
        console.log("in function",searcedData);
        

    }
}



//categories functions
async function getCategories(){
    let response = await fetch(`${baseUrl}/categories.php`);
    response = await response.json();
    return response.categories;
}

async function fillByCategories() {
    arr = await getCategories();
    
    for (const element of arr) {
        let category = element.strCategory;
        await filterByCategory(category);
    }
    
}

async function filterByCategory(category) {
    let response = await fetch(`${baseUrl}/filter.php?c=${category}`);
    response =await response.json();
    
    console.log(category , "=> ", response.meals)
}

// fillByCategories()



//area functions

async function getArea() {
    let response = await fetch(`${baseUrl}/list.php?a=list`);
    response = await response.json();
    return response.meals;
}

async function fillByArea() {
    arr = await getArea();

    for (const element of arr) {
        area = element.strArea;
        filterByArea(area)
    }
}

async function filterByArea(area) {
    let response = await fetch(`${baseUrl}/filter.php?a=${area}`);
    response = await response.json()

    console.log(area, "=>", response.meals)
}

//fillByArea()




//ingredients functions

async function getIngredients() {
    let response = await fetch(`${baseUrl}/list.php?i=list`);
    response = await response.json();
    return response.meals;
}

async function fillByIngredients() {
    ingredients = await getIngredients();
    
    for(const element of arr) {
        ingredient = element.strIngredient;
        filterByIngredient(ingredient);
    }
}

async function filterByIngredient(ingredient){
    try {
        let response = await fetch(`${baseUrl}/filter.php?a=${ingredient}`);
        response = await response.json();

        if(!response.meals)
            console.log(ingredient, "=>", "NotFound");
        else
            console.log(ingredient , "=>", response.meals)
    }
    catch(error) {
        console.log(error)
    }
   
    
}

