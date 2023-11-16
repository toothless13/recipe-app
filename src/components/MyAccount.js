import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import SavedRecipe from './RecipeFinder/SavedRecipe';
import '../styles/pages/_my-account.scss'


const MyAccount = () => {
  const { user } = useContext(Context);
  const [faveRecipes, setFaveRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState({});

  const getUserFaves = async () => {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    // console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      if (doc.data().uid === user.uid) {
        // console.log(`${doc.id} => ${doc.data().uid}`);
        // console.log(doc.data().recipe)
        setFaveRecipes(prevState => {
            return [...prevState, doc.data().recipe];    
        });
      }
    });
  }

  useEffect(() => {
    getUserFaves();
    setIsLoading(false);
  }, []);

  const viewSavedRecipe = (e) => {
    e.preventDefault();
    const recipeName = e.target.innerText;
    const recipeIndex = faveRecipes.findIndex(recipe => recipe.title === recipeName);
    console.log(recipeIndex);
    setSelectedRecipe(faveRecipes[recipeIndex]);
  }

  if (isLoading === true) {
    console.log("Loading");
    return <div>This is loading...</div>
  } else {
    console.log("Loaded");
    // console.log(faveRecipes);
    return (
      <div>
        <h1>{`${user.displayName}'s Account`}</h1>
        <h2>{faveRecipes.length > 0 && "Your Saved Recipes"}</h2>
        {/* <ul>
          {faveRecipes.map((recipe, index) => {
            return <li key={index}>{recipe.title}</li>
          })}
          {console.log(faveRecipes)}
        </ul> */}
        {faveRecipes.map((recipe, index) => {
          // return <SavedRecipe key={index} recipe={recipe} />
          return (
            <button className='eachRecipe' type='button' key={index} onClick={viewSavedRecipe}>
              {recipe.title}
            </button>
          )
        })}
        {selectedRecipe.title !== undefined && <SavedRecipe recipe={selectedRecipe} />}
      </div>
    )
  }
}

export default MyAccount