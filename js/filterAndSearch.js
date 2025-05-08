const baseUrl = "https://www.themealdb.com/api/json/v1/1";
let arr = [];
let ingredients = [];
let searchedData = { meals: [] };
var choosedIngredients = [];
var auto_list = document.querySelector(".autocomplete .list-group");
var items = auto_list.querySelectorAll("li");
import { getData, BuildCards } from "./home.js";


document.getElementById("areaFilter").addEventListener("change", handleSearchAndFilter());
document.getElementById("categoryFilter").addEventListener("change", handleSearchAndFilter());
document.querySelector("input[type=search]").addEventListener("change", handleSearchAndFilter());


window.onload = async function() {
  await renderCategoriesOptions();
  await renderAreaOptions();
};


(function () {
  fillByIngredients();
  var current_focus = -1;
  var search = document.querySelector("input[type=search]");

  search.addEventListener("input", () => {
    auto_list.innerHTML = "";
    if (search.value.length > 0) {
      current_focus = -1;
      ingredients.forEach((ing) => {
        items = auto_list.querySelectorAll("li");

        if (ing.strIngredient.toLowerCase().startsWith(search.value)) {
          // console.log(ing.strIngredient);

          var li = document.createElement("li");
          li.innerText = ing.strIngredient;
          li.classList.add("list-group-item");
          if (items.length == 0) li.classList.add("border-top-0");
          auto_list.appendChild(li);
        }
      });
      // console.log(items);
      items.forEach((item) => {
        item.addEventListener("click", () => {
          choosedIngredients.push(item.innerText);
          fill_ingredients();
          search.value = "";
        });
      });
    }
  });

  search.addEventListener("keyup", (e) => {
    // console.log("clicked",e.keyCode);

    items = auto_list.querySelectorAll("li");

    if (e.keyCode == "40") {
      current_focus = (current_focus + 1) % items.length;
      // console.log(current_focus);
      highlight(current_focus);
    } else if (e.keyCode == "38") {
      current_focus = (current_focus - 1 + items.length) % items.length;
      // console.log(current_focus);
      highlight(current_focus);
    } else if (e.keyCode == "13") {
      if (current_focus >= 0) {
        items[current_focus].click();
        auto_list.innerHTML = "";
      }
    }
  });
  document.addEventListener("click", () => {
    if (document.activeElement !== search) auto_list.innerHTML = "";
  });
  document.addEventListener("mousemove", function () {
    items.forEach((item, ind) => {
      if (item.matches(":hover")) {
        highlight(ind);
        current_focus = ind;
      }
    });
  });
})();
//search functions
//to hover on autocomplete search box
function highlight(i) {
  items.forEach((item) => {
    item.classList.remove("hover_col");
  });
  if (i > -1 && i < items.length) {
    items[i].classList.add("hover_col");
    items[i].scrollIntoView({ block: "nearest" });
  }
}
//function to fill ingredients used to search
async function fill_ingredients() {
  var ingreds = document.querySelector("#ingredients .row");
  ingreds.innerHTML = "";
  if (choosedIngredients.length == 0)
    getData("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  else {
    await getsearchedData(choosedIngredients);
    console.log("out function", searchedData);
    BuildCards(searchedData);
  }
  choosedIngredients.forEach((item, ind) => {
    var ingredient = document.createElement("div");
    ingredient.innerHTML = `<span>${item}</span><button onclick="deleteIngredient(${ind})" class="btn close align-self-end text-secondary p-0  pb-1 border-0">x</button>`;
    ingredient.classList.add(
      "col-sm-auto",
      "me-1",
      "ps-2",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    ingreds.appendChild(ingredient);
  });
}
//function to delete ingredient if needed
window.deleteIngredient = deleteIngredient;

function deleteIngredient(i) {
  choosedIngredients.splice(i, 1);
  fill_ingredients();
}

//filter functions

// <<<<<<< HEAD

  // async function getsearchedData(ingredients) {
  //   searchedData={meals:[]}
  //   for (const ingredient of ingredients) {
        
  //       let response = await fetch(`${baseUrl}/filter.php?i=${ingredient}`);
  //       response = await response.json();
  //       response = await response.meals;

  //       // console.log(response.meals);
        
  //       if(searchedData.meals.length==0)
  //           searchedData.meals= await response;
  //       else
  //       {
  //            searchedData.meals = searchedData.meals.filter(obj1 =>
  //               response.some(obj2 => obj2.idMeal === obj1.idMeal)
  //             );
  //       }
  //   }
  // }     
  async function getsearchedData(ingredients) {
    searchedData = { meals: [] };
  
    for (const ingredient of ingredients) {
      let response = await fetch(`${baseUrl}/filter.php?i=${ingredient}`);
      let filteredMeals = await response.json();
      if (!filteredMeals.meals) continue;
  
      for (const meal of filteredMeals.meals) {
        let detailResponse = await fetch(`${baseUrl}/lookup.php?i=${meal.idMeal}`);
        let fullMealData = await detailResponse.json();
  
        if (
          !searchedData.meals.some(
            (m) => m.idMeal === fullMealData.meals[0].idMeal
          )
        ) {
          searchedData.meals.push(fullMealData.meals[0]);
        }
      }
    }
  
    // Filter meals to keep only those that appear in all selected ingredients
    if (ingredients.length > 1) {
      searchedData.meals = searchedData.meals.filter((meal) =>
        ingredients.every((ing) =>
          meal.strInstructions?.toLowerCase().includes(ing.toLowerCase()) ||
          Object.values(meal)
            .join(" ")
            .toLowerCase()
            .includes(ing.toLowerCase())
        )
      );
    }

    console.log(searchedData.meals)
  }
  

  
// =======
// async function getsearchedData(ingredients) {
//   searchedData = { meals: [] };
//   for (const ingredient of ingredients) {
//     console.log(`${baseUrl}/filter.php?i=${ingredient}`);

//     let response = await fetch(`${baseUrl}/filter.php?i=${ingredient}`);
//     let filteredMeals = await response.json();
//     if (!filteredMeals.meals) continue;
//     //for loop in the filteredmeals coming from api which make an api call
//     //based on the id of each meal in the filtered meal so that we get an object
//     //which has the same structure of the getAllMeals API
//     for (const meal of filteredMeals.meals) {
//       let detailResponse = await fetch(
//         `${baseUrl}/lookup.php?i=${meal.idMeal}`
//       );
//       let fullMealData = await detailResponse.json();

//       if (
//         !searchedData.meals.some(
//           (m) => m.idMeal === fullMealData.meals[0].idMeal
//         )
//       ) {
//         searchedData.meals.push(fullMealData.meals[0]);
//       }
// >>>>>>> ea0cebddf9bc2cd56b1a97b11e39a04a285ca33c
   

//categories functions
async function getCategories() {
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
  response = await response.json();

  console.log(category, "=> ", response.meals);
}


async function renderCategoriesOptions(){
  let categoryFilter = document.querySelector("#categoryFilter");
  
  // let defaultOption = document.createElement("option");
  // defaultOption.textContent = "All Categories";
  // defaultOption.value = "all"
  // categoryFilter.appendChild(defaultOption);
  
  let categories = await getCategories();
  
  categories.forEach(category => {
  let option = document.createElement("option");
  option.textContent = category.strCategory;
  option.value = category.strCategory.toLowerCase();
  categoryFilter.appendChild(option);
  })
  
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
    filterByArea(area);
  }
}

async function filterByArea(area) {
  let response = await fetch(`${baseUrl}/filter.php?a=${area}`);
  response = await response.json();

  console.log(area, "=>", response.meals);
}

async function renderAreaOptions(){
  let areaFilter = document.querySelector("#areaFilter");
  
  // let defaultOption = document.createElement("option");
  // defaultOption.textContent = "All Areas";
  // defaultOption.value = "all";
  // areaFilter.appendChild(defaultOption);
  
  let area = await getArea();
  
  area.forEach(area => {
  let option = document.createElement("option");
  option.textContent = area.strArea;
  option.value = area.strArea.toLowerCase();
  areaFilter.appendChild(option);
  })
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

  for (const element of arr) {
    ingredient = element.strIngredient;
    filterByIngredient(ingredient);
  }
}

async function filterByIngredient(ingredient) {
  try {
    let response = await fetch(`${baseUrl}/filter.php?a=${ingredient}`);
    response = await response.json();

    if (!response.meals) console.log(ingredient, "=>", "NotFound");
    else console.log(ingredient, "=>", response.meals);
  } catch (error) {
    console.log(error);
  }
}

async function handleSearchAndFilter() {
  const selectedArea = document.getElementById("areaFilter").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value.toLowerCase();
  const searchQuery = document.querySelector("input[type=search]").value.toLowerCase();

  
  await getsearchedData(choosedIngredients); 

  let filteredMeals = searchedData.meals

  if (selectedArea && selectedArea !== "all") {
    filteredMeals = filteredMeals.filter(meal =>
      meal.strArea?.toLowerCase() === selectedArea
    );
  }

  if (selectedCategory && selectedCategory !== "all") {
    filteredMeals = filteredMeals.filter(meal =>
      meal.strCategory?.toLowerCase() === selectedCategory
    );
  }




console.log()  

}