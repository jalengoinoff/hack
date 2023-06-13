"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);


//  const starIcon = story.isFavorite ? "fas" : "far";
  //  const trashCanIcon = currentUser && currentUser.ownsStory(story) ? `<i class="fas fa-trash-alt trash-can"></i>` : "";
   const hostName = story.getHostName();
  return $(`
    <li id="${story.storyId}">
  
    
      ${showDeleteBtn ? Trashremove() : ""}
      ${showStar ? Starfav(story, currentUser) : ""}
      <a href="${story.url}" target="_blank" class="story-link">${story.title}</a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-username">posted by ${story.username}</small>
    </li>
  `);
}
function Trashremove() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

function Starfav(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  $allStoriesList.empty();


  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
    // Add event listener for removing a story
  $story.find(".trash-can").on("click", function () {
    if (currentUser) {
      currentUser.removeStory(story.storyId)
        .then(() => {
        $story.remove();
        })
          .catch(() => {
          console.error("Failed to remove story");
          });
      }
    });
}
    // Add event listener for toggling favorite status
    $story.find(".star").on("click", function () {
      if (currentUser) {
        currentUser.toggleFavorite(story.storyId)
          .then(() => {
            // Toggle the favorite status of the story
            story.isFavorite = !story.isFavorite;

  //           // Update the star icon
            const $starIcon = $story.find("i.fa-star");
            $starIcon.toggleClass("fas far");
          })
          .catch(() => {
            console.error("Failed to toggle favorite");
          });
      }
    });

     $allStoriesList.append($story);
 
   

/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
 await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

// /** Handle submitting new story form. */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // grab all info from form
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // hide the form and reset it
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

// /******************************************************************************
//  * Functionality for list of user's own stories
//  */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

// /******************************************************************************
//  * Functionality for favorites list and starr/un-starr a story
//  */

// /** Put favorites list on page. */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}


$storiesLists.on("click", ".star", toggleStoryFavorite);












// function generateStoryMarkup(story) {
//   // console.debug("generateStoryMarkup", story);

//   const hostName = story.getHostName();
//   return $(`
//       <li id="${story.storyId}">
//         <a href="${story.url}" target="a_blank" class="story-link">
//           ${story.title}
//         </a>
//         <small class="story-hostname">(${hostName})</small>
//         <small class="story-author">by ${story.author}</small>
//         <small class="story-user">posted by ${story.username}</small>
//       </li>
//     `);
// }

/** Gets list of stories from server, generates their HTML, and puts on page. */

// function putStoriesOnPage() {
//   console.debug("putStoriesOnPage");

//   $allStoriesList.empty();

//   // loop through all of our stories and generate HTML for them
//   for (let story of storyList.stories) {
//     const $story = generateStoryMarkup(story);
//     $allStoriesList.append($story);
//   }

//   $allStoriesList.show();
// }