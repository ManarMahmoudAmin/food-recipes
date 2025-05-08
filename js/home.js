const mealsContainer = document.querySelector(".meals-container");
import {setcookies,getcookies,get_user_info } from "./form.js";

(
  function(){
    let userList = JSON.parse(localStorage.getItem("userList")) || []; 
    const authArea = document.getElementById('user-area');
    const userCard = document.getElementById('userCard');
    const logoutBtn = document.getElementById('logoutBtn');// Retrieve users from localStorage or initialize an empty array
    document.addEventListener("DOMContentLoaded", () => {  
      // setcookies("name","shrouk",1) 
      // const accountBtns = document.querySelector("#account .account-buttons");
      // const accountProfile = document.querySelector("#account #myaccount");

      var signInUser=getcookies("signInUser")//to know if user sign in or not if ==null not sign in else return user-email
      if(!signInUser){
        authArea.innerHTML = ' <a class="btn btn-outline-primary ms-3" href="login.html">Sign In</a>';
      }
      else
      {
        var userInfo=JSON.parse(signInUser)
        console.log(userInfo);
        // debugger;
        var u=get_user_info(userInfo,userList)
        const profileHTML = `
        <div class="d-flex align-items-center gap-2 position-relative">
          <img src=${u.profile} alt="User" class="profile-pic" id="profilePic">
          <span class="fw-bold">${u.name}</span>
        </div>
      `;
      authArea.innerHTML = profileHTML;
      userCard.querySelector("#cardImg").src=u.profile
      userCard.querySelector("#cardName").innerText=u.name
      userCard.querySelector("#cardEmail").innerText=u.email

       
        // accountName.innerText=u.nam
        // accountEmail.innerText=u.email
        // accountImg.src=u.profile
        document.getElementById('profilePic').addEventListener('click', () => {
          userCard.style.display = userCard.style.display === 'block' ? 'none' : 'block';
          var nav=document.querySelector("nav")
          const nav_pos=nav.getBoundingClientRect()
          console.log(nav_pos);
          userCard.style.top=nav_pos.bottom+10+"px"
          if(window.innerWidth<992)
            userCard.style.width="95vw"
          else
            userCard.style.width="250px"
        });

  

      }
  });
  logoutBtn.addEventListener('click', () => {setcookies("signInUser","",1);window.location.reload()});
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#userCard') && !e.target.closest('#profilePic')) {
      userCard.style.display = 'none';
    }
  });
  window.addEventListener('resize',()=>{console.log(window.innerWidth);
    userCard.style.display = 'none';
  })

}()
);




export async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    //console.log(data);
    BuildCards(data);
  } catch (error) {
    console.log(`an error occured during fetching data ${error}`);
  }
}

getData("https://www.themealdb.com/api/json/v1/1/search.php?s=");

export function BuildCards(data) {
  mealsContainer.innerHTML = "";
  // debugger;
  data.meals.forEach((element) => {
    const card = document.createElement("div");
    card.className = "col-md-3";
    card.innerHTML = `<div class="card shadow-sm bg-light data-bs-toggle="modal" data-bs-target="#exampleModal" ">
                    <div class="card-body">
                        <img src="${element.strMealThumb}" class="card-img" />
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="card-title overflow-hidden">
                           <h5 class="card-title fs-3 mt-4 fw-bold">${element.strMeal}</h5>
                           <p class="card-text fs-5 mb-3"><span>Country: </span> ${element.strArea}</p>
                          </div>
                          <div>
                           <button class="btn btn-outline-danger add-favourite border-0 fs-3 bg" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add to favourites">
                            <i class="fa-regular fa-heart "></i>
                           </button>
                          </div>
                         </div>
                    </div>
                </div>`;

    // add click event to the current card
    card.addEventListener("click", (e) => {
      if (e.target.closest(".add-favourite")) {
        return;
      } else {
        const modal = new bootstrap.Modal(
          document.getElementById("exampleModal")
        );

        modal.show();
        let modalTitle = document.querySelector(".modal-title");
        let modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = `

      <div class="d-flex flex-column align-items-center">
                  <img src="${element.strMealThumb}" class="w-50 mb-3" />
                  <div class="d-flex gap-4  mb-3">
                    <span class="badge rounded-pill bg-primary text-black fs-4 "
                      >${element.strMeal}</span
                    >
                    <span class="badge rounded-pill bg-danger text-black fs-4 "
                      >${element.strArea}</span
                    >
                    <span class="badge rounded-pill bg-warning text-black  fs-4 "
                      >${element.strCategory}</span
                    >
                  </div>
                </div>
                <h3 class="fs-2">Instructions:</h3>
                <p class="fs-4">${element.strInstructions}</p>

                  <div>
                    <h4 class="text-danger"><strong>Ingredients:</strong></h4>
                    <ul class="p-1 fs-4">
                      ${getIngredientsList(element)}
                    </ul>
                  </div>

                <span class="fs-4 fw-bold">Tutorial :</span>
                <a href="${
                  element.strYoutube
                }" class="text-decoration-none fs-4">
                  Click Here</a
                >
      `;
      }
    });

    // append a child in cards container
    mealsContainer.appendChild(card);
  });
}

function getIngredientsList(element) {
  let list = "";

  for (let i = 1; i <= 20; i++) {
    let ingredient = element[`strIngredient${i}`];
    let measure = element[`strMeasure${i}`];

    if (ingredient) {
      ingredient = ingredient.trim();
      if (ingredient !== "") {
        list += `<li class="list-unstyled"><i class="fa-solid fa-utensils me-2 text-success"></i>${measure} ${ingredient}</li>`;
      }
    }
  }

  return list;
}

// tooltip
document.addEventListener("DOMContentLoaded", () => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
});
