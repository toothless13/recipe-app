import React, { useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import IngredientsList from './IngredientsList';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';
import '../../styles/components/_recipe-finder-form.scss';
import chopping from '../../styles/images/chopping_board.jpg'

const RecipeFinderForm = ({ setRecipes, setSearch, ingredientsList, setIngredientsList, setExtractedRecipe, setRandomSearch }) => {
  const initialState = {
    alert: {
      message: "",
      isSuccess: false,
    },
    ingredient: "",
  };

   const [ingredient, setIngredient] = useState(initialState.ingredient);
 
  const [cuisineType, setCuisineType] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [intolerances, setIntolerances] = useState(null);

  //change button color on hover
  const changeButtonBackgroundEnter = (e) => {
    e.target.style.background = '#896773';
  }

  const changeButtonBackgroundExit = (e) => {
    e.target.style.background = '#ded693';
  }
  
  const handleIngredientChange = (e) => {
    setIngredient(e.target.value);
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (ingredient.length > 0) {
      setIngredientsList([...ingredientsList, ingredient]);
      setIngredient(initialState.ingredient);
      toast.success("Ingredient added!");
    } else {
      toast.error("Please enter an ingredient");
    }
  };

  const handleCookingTimeChange = (e) => {
    setCookingTime(e.target.value);
  }

  const handleCuisineChange = (e) => {
    setCuisineType(e.target.value);
  };

  const intoleranceOptions = [
    { value: "dairy", label: "Dairy"},
    { value: "egg", label: "Egg" },
    { value: "gluten", label: "Gluten" },
    { value: "grain", label: "Grain"}
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ingredientsList.length > 0) {
      try {
        const ingredientsSearch = ingredientsList.join(",");
        let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredientsSearch}&number=50&ignorePantry=true`;

        if (cuisineType) {
          apiUrl += `&cuisine=${cuisineType}`;
        }

        if (cookingTime) {
          apiUrl += `&maxReadyTime=${cookingTime}`;
        }

        if (intolerances && intolerances.length > 0) {
          const intolerancesArray = intolerances.map(intolerance => intolerance.value);
          const intolerancesList = intolerancesArray.join(",");
          apiUrl += `&intolerances=${intolerancesList}`;
        }

        const { data } = await axios.get(apiUrl, {
          headers: {
            "x-api-key": apiConfig.apiKey,
          },
        });
        setRecipes(data.results);
        setSearch(true);
        setExtractedRecipe({});
        setSearch(true);
        if (data.results.length === 0) {
          toast.error("No recipes found :(");
        } else {
          toast.success("Recipes found!");
        }
      } catch (error) {
        console.log(error);
        setExtractedRecipe({});
        toast.error("No recipes found :(");
      }
    } else {
      toast.error("Please add an ingredient");
    }
  };

  const getRandomRecipes = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("https://api.spoonacular.com/recipes/random?number=10", {
        headers: {
          "x-api-key": apiConfig.apiKey,
        },
      });
      setSearch(true);
      setRecipes(data.recipes);
      setRandomSearch(true);
      toast.success("Here are your random recipes!");
    } catch (error) {
      toast.error("There was an error getting the recipes");
    }
  }

  return (
    <div className="form">
      <Toaster />
      <img src={chopping} alt="chopping board" className='choppingBoard'/>
      <h1>Search for a recipe...</h1>
      <h2> Type an ingredient into the search box, click ADD . Add as many as you like, then select SEARCH.
        If no results appear, try removing one of your selected ingredients.
      </h2>
      <form className="searchForm">
          <div className="entire-form">
          <div className="main-form">
          <div className="search-box">
          <label>Type Ingredient</label>
          
          <input
            type="text"
            placeholder="Add ingredients"
            value={ingredient}
            onChange={handleIngredientChange}
          />
        </div>
        <div className="cuisine-filter">
          <label>Select Cuisine Type</label>
          <select value={cuisineType} onChange={handleCuisineChange}>
            <option value="">All Cuisines</option>
            <option value="african">African</option>
            <option value="asian">Asian</option>
            <option value="american">American</option>
            <option value="british">British</option>
            <option value="cajun">Cajun</option>
            <option value="carribean">Carribean</option>
            <option value="chinese">Chinese</option>
            <option value="eastern european">Eastern European</option>
            <option value="european">European</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="greek">Greek</option>
            <option value="indian">Indian</option>
            <option value="irish">Irish</option>
            <option value="italian">Italian</option>
            <option value="japanese">Japanese</option>
            <option value="jewish">Jewish</option>
            <option value="korean">Korean</option>
            <option value="latin american">Latin American</option>
            <option value="meditteranean">Mediterranean</option>
            <option value="mexican">Mexican</option>
            <option value="middle eastern">Middle Eastern</option>
            <option value="nordic">Nordic</option>
            <option value="southern">Southern</option>
            <option value="spanish">Spanish</option>
            <option value="thai">Thai</option>
            <option value="vietnamese">Vietnamese</option>
          </select>
        </div>
        <div className="intolerances">
          <label>Select Any Intolerances</label>
          <Select 
            defaultValue={intolerances} 
            onChange={setIntolerances}
            options={intoleranceOptions}
            isMulti />
        </div>
        <div className="cooking-time">
          <label>Select Maximum Cooking Time (minutes)</label>
          <input type="number" value={cookingTime} name="cooking-time" onChange={handleCookingTimeChange}/>
        </div>
            <div className="form-buttons">
        <button className="buttonform" type="submit" onClick={handleAddIngredient}>Add</button>
            <button type="button" className="buttonform" onClick={handleSubmit}>Search</button>
            </div>
          
            <div className="added-ingredients">
              {ingredientsList.length >= 1 && <><IngredientsList ingredientsList={ingredientsList} setIngredientsList={setIngredientsList} /></>}
            </div>          
          </div>
          <div className="random-recipe">
            <h2 className="random">Or try out our RANDOM RECIPE button if you're not sure what to make!</h2>
            <button type="button" className="buttonform" onClick={getRandomRecipes}
              onMouseEnter={changeButtonBackgroundEnter}
              onMouseLeave={changeButtonBackgroundExit}
            >Get Random Recipes</button>
          </div>
          </div>
      
      </form>
    </div>
  );
};

export default RecipeFinderForm;