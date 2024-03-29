import React from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import '../../styles/components/_recipes-all.scss';

const RecipeAll = ({ recipes, search, setExtractedRecipe, cuisineType, setMissedIngredients, missedIngredients }) => {
  const selectRecipe = async (event, recipeId) => {
    event.preventDefault();
    try {
      const { data } = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          headers: {
            "x-api-key": apiConfig.apiKey,
          },
        }
      );

      const { data: recipeData } = await axios.get(
        `https://api.spoonacular.com/recipes/extract?url=${data.sourceUrl}`,
        {
          headers: {
            "x-api-key": apiConfig.apiKey,
          },
        }
      );

      setExtractedRecipe(recipeData);

      // Pass the entire recipe object to setMissedIngredients
      if (typeof setMissedIngredients === 'function') {
        setMissedIngredients(recipeData); // Pass the entire recipe object
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter recipes by cuisineType
  const filteredRecipes = cuisineType
    ? recipes.filter(recipe => recipe.cuisines.includes(cuisineType))
    : recipes;

  return (
    <div className="recipesAll">
      {recipes.length > 0 && <h1>Here is a list of recipes that match your search!</h1>}
  
      <ul className="recipes">
        {filteredRecipes.map((recipe) => (
          <li key={recipe.id} className="recipeItem">
            <button
              className="eachRecipe"
              value={recipe.id}
              onClick={(e) => {
                selectRecipe(e, recipe.id);
              }}
            >
            <img
                className="recipeThumbnail recipe-each"
                src={recipe.image}
                alt={recipe.title}
                
              />
              <span className="recipeTitle recipe-each">{recipe.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeAll;








