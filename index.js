const apiKey="48c66d31d7674ad6356f102faeabc3ff ";
const Url="https://api.edamam.com/api/recipes/v2?type=public&q="
const app_id="f885417f"
const user_id="Hashmi"
let recipes="chicken"
const searchInput = document.getElementById("search_input");
const searchButton = document.getElementById("search_btn");
const breakfast=document.getElementById("breakfast");
const lunch=document.getElementById("lunch");
const dinner=document.getElementById("dinner");

const american = document.getElementById("american");
const japanese = document.getElementById("japanese");
const italian = document.getElementById("italian");
const french = document.getElementById("french");
let foodData = async (recipes,mealType="",cuisineType="") => {
    try {
       let query = mealType ? `${recipes}&mealType=${mealType}` : recipes;
if (recipes.includes(",")) {
    query = recipes.split(",").map(ingredient => `q=${ingredient}`).join("&");
}

        let type = cuisineType ? `${recipes}&mealType=${cuisineType}` : recipes;
       
        let foodApiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(recipes,query,type)}&app_id=${app_id}&app_key=${apiKey}`;
        let response = await fetch(foodApiUrl, {
            headers: {
                "Edamam-Account-User": user_id
            }
        });
        let data = await response.json();
        let cardContainer = document.getElementById("card_container");
        cardContainer.innerHTML = "";

        data.hits.forEach(hit => {
            let recipe = hit.recipe;
            let card = document.createElement("div");
            card.className = "col-md-4 mb-4 col-lg-3";
            card.innerHTML = `
                <div class="card">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.label}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.label}</h5>
                        <p class="card-text">Calories: ${Math.round(recipe.calories)}</p>
                        <p class="card-text">Meal Type: ${recipe.mealType}</p>
                        <p class="card-text">Diet Lables: ${recipe.dietLabels}</p>
                        <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
                        <button class="btn btn-warning mt-2 favorite-btn" data-recipe="${encodeURIComponent(JSON.stringify(recipe))}">Add to Favorites</button>

                    </div>
                </div>
            `;

            cardContainer.appendChild(card);
            console.log(data)
        });
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                try {
                    let recipeData = JSON.parse(decodeURIComponent(e.target.getAttribute('data-recipe')));
                    addFavorite(recipeData);
                } catch (error) {
                    console.error("Error parsing recipe data:", error);
                }
            });
        });
        

    } catch (error) {
        console.log("Error fetching recipes:", error);
    }
};
document.getElementById("filter-btn").addEventListener("click", (e) => {
    e.preventDefault();

    // Get selected ingredients
    let selectedIngredients = Array.from(document.querySelectorAll("#ingredient-filter input[type='checkbox']:checked"))
        .map(checkbox => checkbox.value);

    if (selectedIngredients.length > 0) {
        // Combine the selected ingredients into a single query
        let ingredientQuery = selectedIngredients.join(",");
        foodData(ingredientQuery);
    } else {
        alert("Please select at least one ingredient.");
    }
});

// Add recipe to favorites
function addFavorite(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(fav => fav.uri === recipe.uri)) {
        favorites.push(recipe);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${recipe.label} added to favorites!`);
    } else {
        alert(`${recipe.label} is already in your favorites.`);
    }
}

// Display favorite recipes
function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cardContainer = document.getElementById("card_container");
    cardContainer.innerHTML = "";

    favorites.forEach(recipe => {
        let card = document.createElement("div");
        card.className = "col-md-4 mb-4 col-lg-3";
        card.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.label}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.label}</h5>
                    <p class="card-text">Calories: ${Math.round(recipe.calories)}</p>
                    <p class="card-text">Meal Type: ${recipe.mealType}</p>
                    <p class="card-text">Diet Labels: ${recipe.dietLabels}</p>
                    <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}
// Display favorite recipes with remove button
function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cardContainer = document.getElementById("card_container");
    cardContainer.innerHTML = "";

    favorites.forEach(recipe => {
        let card = document.createElement("div");
        card.className = "col-md-4 mb-4 col-lg-3";
        card.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.label}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.label}</h5>
                    <p class="card-text">Calories: ${Math.round(recipe.calories)}</p>
                    <p class="card-text">Meal Type: ${recipe.mealType}</p>
                    <p class="card-text">Diet Labels: ${recipe.dietLabels}</p>
                    <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
                    <button class="btn btn-danger mt-2 remove-favorite-btn" data-recipe-uri="${recipe.uri}">Remove from Favorites</button>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });

    // Attach event listeners for removing favorites
    document.querySelectorAll('.remove-favorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            let recipeUri = e.target.getAttribute('data-recipe-uri');
            removeFavorite(recipeUri);
        });
    });
}

// Remove recipe from favorites
function removeFavorite(recipeUri) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(recipe => recipe.uri !== recipeUri);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Recipe removed from favorites!");
    displayFavorites(); // Refresh the favorites list
}


// Handle favorites link click
document.getElementById("favoritesLink").addEventListener("click", (e) => {
    e.preventDefault();
    displayFavorites();
});


foodData("chicken");


searchButton.addEventListener("click", (e) => {
    e.preventDefault(); 
    let searchTerm = searchInput.value.trim();
    if (searchTerm) {
        foodData(searchTerm);
    }
});
breakfast.addEventListener("click", (e) => {
    e.preventDefault(); 
    foodData("breakfast", "Breakfast");
});
lunch.addEventListener("click", (e) => {
    e.preventDefault(); 
    foodData("lunch", "Lunch");
});
dinner.addEventListener("click", (e) => {
    e.preventDefault(); 
    foodData("dinner", "Dinner");
});
american.addEventListener("click", (e) => {
    e.preventDefault(); 
    foodData("american", "American");
});
japanese.addEventListener("click", (e) => {
    e.preventDefault(); 
    foodData("japanese", "Japanese");
});
italian.addEventListener("click", (e) => {
    e.preventDefault(); 
    foodData("italian", "Italian");
});
french.addEventListener("click", (e) => {
    e.preventDefault(); 
    foodData("french", "french");
});