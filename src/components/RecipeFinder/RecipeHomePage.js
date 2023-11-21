import React, { useState } from 'react';
import RecipeFinderForm from './RecipeFinderForm';
import RecipeAll from './RecipesAll';
import SingleRecipe from './SingleRecipe';
import '../../styles/pages/_recipe-home-page.scss'


const RecipeHomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState(false);

  // const [recipeID, setRecipeID] = useState("");
  // const [singleRecipe, setSingleRecipe] = useState([]);
  // const [index, setIndex] = useState();
  // const [url, setURL] = useState();
  const [extractedRecipe, setExtractedRecipe] = useState({});
  const [ingredientsList, setIngredientsList] = useState([]);

  // added below:
  const [missedIngredients, setMissedIngredients] = useState([]);
  

  return (
    <div className='recipe-homepage'>
      <RecipeFinderForm recipes={recipes} setRecipes={setRecipes} setSearch={setSearch} ingredientsList={ingredientsList} 
        setIngredientsList={setIngredientsList} setExtractedRecipe={setExtractedRecipe}/>
      {ingredientsList.length >= 1 && <RecipeAll recipes={recipes} search={search} setExtractedRecipe={setExtractedRecipe}
        // added below:
        setMissedIngredients={setMissedIngredients} missedIngredients={missedIngredients}
      />}
      {extractedRecipe.title && <SingleRecipe extractedRecipe={extractedRecipe}
        // added line:
        missedIngredients={missedIngredients}
      />}
    </div>
  );
}

export default RecipeHomePage;
