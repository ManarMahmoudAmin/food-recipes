const baseUrl = "https://www.themealdb.com/api/json/v1/1";
let arr = [];

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
    arr = await getIngredients();
    
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

