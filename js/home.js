const mealsContainer = document.querySelector(".meals-container");

async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    BuildCards(data);
  } catch (error) {
    console.log(`an error occured during fetching data ${error}`);
  }
}

getData("https://www.themealdb.com/api/json/v1/1/search.php?s=");

function BuildCards(data) {
  data.meals.forEach((element) => {
    const card = document.createElement("div");
    card.className = "col-md-3";
    card.innerHTML = `<div class="card  shadow-sm bg-light data-bs-toggle="modal" data-bs-target="#exampleModal" ">
                    <div class="card-body">
                        <img src="${element.strMealThumb}" class="card-img" />
                        <h5 class="card-title fs-3 mt-4 fw-bold">${element.strMeal}</h5>
                        <p class="card-text fs-5 mb-3">Country: ${element.strArea}</p>
                    </div>
                </div>`;

    // add click event to the current card
    card.addEventListener("click", () => {
      const modal = new bootstrap.Modal(
        document.getElementById("exampleModal")
      );
      modal.show();
      let modalTitle = document.querySelector(".modal-title");
      let modalBody = document.querySelector(".modal-body");
      modalBody.innerHTML = `

      <div class="d-flex flex-column align-items-center">
                  <img src="${element.strMealThumb}" class="w-50 mb-3" />
                  <div class="">
                    <span class="badge rounded-pill bg-primary text-black fs-4 mx-5"
                      >${element.strMeal}</span
                    >
                    <span class="badge rounded-pill bg-danger text-black fs-4 mx-5"
                      >${element.strArea}</span
                    >
                    <span class="badge rounded-pill bg-warning text-black  fs-4 mx-5"
                      >${element.strCategory}</span
                    >
                  </div>
                </div>
                <h3 class="fs-2">Instructions:</h3>
                <p class="fs-4">${element.strInstructions}</p>
                <span class="fs-4 fw-bold">Tutorial :</span>
                <a href="${element.strYoutube}" class="text-decoration-none fs-4">
                  Click Here</a
                >
      `;
    });

    // append a child in cards container
    mealsContainer.appendChild(card);
  });
}
