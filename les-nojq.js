/**
 * Copyright (C) 2014 Rodrigo Muñoz <rod@rmk.pw>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// ==UserScript==
// @name        Legacy Enhancement Suite - Test
// @namespace   LES
// @description Improvements to Legacy Game
// @include     https://www.legacy-game.net/*
// @include     https://direct.legacy-game.net/*
// @include     https://dev.legacy-game.net/*
// @version     0.0.64
// @grant       none
// @require     https://raw.githubusercontent.com/nnnick/Chart.js/4aa274d5b2c82e28f7a7b2bb78db23b0429255a1/Chart.js
// @require     https://raw.githubusercontent.com/rodmk/locache/master/locache.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/sprintf/0.0.7/sprintf.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/URI.js/1.11.2/URI.min.js
// ==/UserScript==
/* global $, jQuery,locache, Mousetrap, URI, ddrivetip, hideddrivetip, bar1,
_,sprintf,Chart, positionToElement, select, pic */


// =============================================================================
//                                 Constants
// =============================================================================
const MS_IN_SEC = 1000;
const SEC_IN_MINUTE = 60;
const SEC_IN_HOUR = 60 * SEC_IN_MINUTE;
const SEC_IN_DAY = 24 * SEC_IN_HOUR;
const ITEM_FOUND_REGEX = /^Item Found : (.*)(?=\.$)/;

const templateColor = document.documentElement;
const style = getComputedStyle(templateColor);
const fontColor = style.getPropertyValue('--colortext').trim();
console.log(fontColor);

// Legacy server runs on EST (UTC-5)
const SERVER_UTC_OFFSET_HRS = -5;

var loaderAnim = "data:image/gif;base64,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";
// =============================================================================
//                              Script Set-Up
// =============================================================================
// Clear out expired cache values
locache.cleanup();

// =============================================================================
//                            Primary Entry Point
// =============================================================================
/**
 * Registers a function to be executed on pages where the path matches path
 * rules, where path_rules is an array of regexes. For example,
 * registerFunction(foo, ['bar.php', 'baz.php']) will register foo to be run
 * on bar.php and baz.php.
 */
var function_registry = {};

function registerFunction(fn, path_rules) {
  assert(
    path_rules !== undefined && path_rules.length > 0,
    'path_rules cannot be empty'
  );

  path_rules.forEach(function (rule) {
    if (rule in function_registry) {
      function_registry[rule].push(fn);
    } else {
      function_registry[rule] = [fn];
    }
  });
}

/**
 * Executes registered functions based on current path.
 */
function executeFunctions(registry) {
  const current_path = window.location.pathname;

  for (const [path, fns] of Object.entries(registry)) {
    if (current_path.match(path)) {
      fns.forEach(register => {
        try {
          register();
        } catch (e) {
          console.error(e.message);
          console.error(e.stack);
        }
      })
    }
  };
}

// =============================================================================
//                              Player Class Helper
// =============================================================================
var Player = {
  getHP: function () {
    var hp = 0;
    if (bar1 !== undefined) {
      hp = bar1; // from template.php
    }
    return hp;
  },

  getEnergy: () => parseInt(document.getElementById('turnbox-text').textContent.replace(/,/g, '')),

  isInWL: function () {
    if (typeof initialMapData === 'undefined') {
      return false
    } else {
      return true
    }
  }
};

/**
 * FEATURE: Binds 'h' to full heal.
 */
registerFunction(function addQuickHealKeybinding() {
  Mousetrap.bind('h', fullHeal);
}, [".*"]);

registerFunction(function getSessionToken() {
  // Check if the session token is set yet
  if (cacheGet("action_token")) {
    return;
  }

  // The action token isn't set yet so we need to load it into the cache
  uri = URI(document.querySelector("a[href*='map2.php'][href*=key]"));
  var action_token = uri.query(true).key;
  cacheSet("action_token", action_token, SEC_IN_DAY);
}, [".*"]);

/**
 * Heals the player fully via hospital/sanctuary
 */
function fullHeal() {
  // Skip attempting to heal if we're in the WL.
  if (Player.isInWL()) {
    return;
  }
  doFullHeal(cacheGet("action_token"), "&c=1")
}

//Return user cookies as object
  function getCookies() {
    return document.cookie
      .split(/[;\s]+/g)
      .reduce(function(a, b) {
        a[b.split('=')[0]] = b.split('=')[1];
        return a;
      }, {});
  }

registerFunction(function addItemHovercards() {
  const links = document.querySelectorAll('a[href*="javascript:modelesswin"]');

  links.forEach(linkElement => {
    let itemData = null;
    let isCurrentlyHovered = false;

    linkElement.addEventListener('mouseover', function () {
      const currentLink = this;
      isCurrentlyHovered = true;

      if (!itemData) {
        itemData = `<img src="${loaderAnim}" />`;
        ddrivetip(itemData, 30);

        const href = currentLink.getAttribute('href');
        const urlMatch = href.match(/'(.*)'/);
        const url = urlMatch ? urlMatch[1] : null;

        fetch(url)
          .then(response => {
            return response.text();
          })
          .then(htmlString => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            const centerElement = doc.querySelector('center');

            itemData = centerElement.innerHTML;

            if (isCurrentlyHovered) {
              ddrivetip(itemData, 450);
            }
          })
          .catch(error => {
            console.error('Error fetching hovercard data:', error);
            if (isCurrentlyHovered) {
              ddrivetip("Error loading data.", 450);
            }
          });
      } else {
        ddrivetip(itemData, 450);
      }
    });

    linkElement.addEventListener('mouseout', function () {
      isCurrentlyHovered = false;
      hideddrivetip();
    });
  });
}, [".*"]); //This was added to all pages to work with the Equipment template module

// =============================================================================
//                                 Utilities
// =============================================================================
function cacheSet(key, value, timeout) {
  if (value !== undefined) {
    locache.set(sessionKey(key), value, timeout);
  }
}

function cacheGet(key) {
  return locache.get(sessionKey(key));
}

/**
 * Loads the hunting drops data from localStorage.
 * If no data is found, initializes an empty object.
 */
function loadHuntingDrops() {
  let allHuntingDrops = {};
  const LOCAL_STORAGE_KEY = 'hunts';
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      allHuntingDrops = JSON.parse(storedData);
    } else {
      allHuntingDrops = {}; // Ensure it's an empty object if nothing found
    }
  } catch (e) {
    console.error('Error loading hunting drops data:', e);
    allHuntingDrops = {}; // Reset to empty on error to prevent broken state
  }

  return allHuntingDrops;
}

/**
 * Adds a new dropped item to localStorage.
 */
function addItemToLocalStorage(groupId, itemName) {
  // Load hunting drops
  var loadedHuntingDrops = loadHuntingDrops();
  // Ensure the hunting group exists in our data
  if (!loadedHuntingDrops[groupId]) {
    loadedHuntingDrops[groupId] = {
      // Use a distinct key like '_drops' or 'items' to store the item counts
      // to avoid conflict if an item name happens to be '_total'
      items: {},
      totalHunts: 0, // Initialise total hunts for this group
      totalDrops: 0 // Initialise total drops for this group
    };
  }

  const group = loadedHuntingDrops[groupId];

  // Ensure the item exists within this group's drops, then increment
  if (!group.items[itemName]) {
    group.items[itemName] = 0;
  }
  group.items[itemName]++;
  group.totalDrops++; // Increment the total drops for this group
  saveHuntingDrops(loadedHuntingDrops);
  // Console log the object - commented out normally but here for debugging.
  //console.log(loadedHuntingDrops);
}

function saveHuntingDrops(drops) {
  const LOCAL_STORAGE_KEY = 'hunts';
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drops));
  } catch (e) {
    console.error('Error saving hunting drops data:', e);
  }
}

function incrementTotalHunts(huntingGroup) {
  // Load hunting drops
  var loadedHuntingDrops = loadHuntingDrops();
  if (!loadedHuntingDrops[huntingGroup]) {
    loadedHuntingDrops[huntingGroup] = {
      // Use a distinct key like '_drops' or 'items' to store the item counts
      // to avoid conflict if an item name happens to be '_total'
      items: {},
      totalHunts: 0, // Initialise total hunts for this group
      totalDrops: 0 // Initialise total drops for this group
    };
  }

  const group = loadedHuntingDrops[huntingGroup];

  group.totalHunts++;
  saveHuntingDrops(loadedHuntingDrops);
}

//
// We check for hunting drops using this function
//
registerFunction(() => {
  // We have to iterate through all the pages font tags to know if there's a drop or not
  const fontTags = document.querySelectorAll('font');
  let cookie;
  cookie = getCookies();
  let drop;

  fontTags.forEach(fontTags => {
    if (fontTags.textContent.includes('Item Found')) {
      drop = fontTags.textContent;
      const drops = ITEM_FOUND_REGEX.exec(drop);
      const itemDroppedText = drops[1];
      addItemToLocalStorage(cookie.hunting_group, itemDroppedText)
    }

    if (fontTags.textContent.includes('collapses lifeless to the ground')) {
      incrementTotalHunts(cookie.hunting_group);
    }
  });
}, ['hunting3.php']);

function buildDropList(selectedNPC) {
  // This section creates a new section below the NPC selector
  // and displays drop stats. selectedNPC should be the hunting
  // group ID for the hunting group you want to see drops for.
  const targetTd = document.getElementById('group-desc');
  if (targetTd) {
    const lastFormTag = targetTd.querySelector('form:last-of-type');

    if (lastFormTag) {
      displayArea = document.createElement('div');
      displayArea.id = 'my-new-info';
      displayArea.style.marginTop = '10px';
      lastFormTag.after(displayArea);
    }
  }

  displayArea.innerHTML = '';
  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = 'Hunting Drop Statistics';
  sectionTitle.style.marginBottom = '10px';
  sectionTitle.style.color = fontColor;
  displayArea.appendChild(sectionTitle);

  huntObject = loadHuntingDrops();

  const selectedNPCDrops = huntObject[selectedNPC]

  if (selectedNPCDrops) {
    const totalDrops = selectedNPCDrops.totalDrops;
    const totalHunts = selectedNPCDrops.totalHunts;

    // Total Hunts and Total Drops
    const summaryPara = document.createElement('p');
    summaryPara.innerHTML = `Hunts: <strong>${totalHunts}</strong> | Total Drops: <strong>${totalDrops}</strong>`;
    summaryPara.style.marginBottom = '8px';
    displayArea.appendChild(summaryPara);

    const dropsList = document.createElement('ul');
    dropsList.style.listStyleType = 'none';
    dropsList.style.paddingLeft = '0';
    dropsList.style.marginTop = '5px';

    Object.entries(huntObject[selectedNPC].items).forEach(([itemName, quantity]) => {
      let dropPercent;
      dropPercent = (quantity/totalHunts*100).toFixed(0) + "%";
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong style="color:${fontColor};">${itemName}:</strong> ${quantity} --- ${dropPercent}`;
      dropsList.appendChild(listItem);
    });

    if (totalDrops != totalHunts) {
      const nothingDrop = totalHunts - totalDrops;
      const dropPercent = (nothingDrop/totalHunts*100).toFixed(0) + "%";
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong style="color:${fontColor};">Nothing:</strong> ${nothingDrop} --- ${dropPercent}`;
      dropsList.appendChild(listItem);
    }

    displayArea.appendChild(dropsList);
  } else {
    const summaryPara = document.createElement('p');
    summaryPara.innerHTML = "No drops yet.";
    summaryPara.style.marginBottom = '8px';
    displayArea.appendChild(summaryPara);
  };
}

//
// Display hunting drops below each NPC
//
registerFunction(() => {
  var currentlySelectedNPC = document.querySelectorAll('img[src="/img-bin/groups/selection.png"]')[0].parentElement.attributes.getNamedItem("data-row").value;
  var selectedNPC = document.querySelectorAll('div[class="groups-inner-div"]');
  var huntingNPC = selectedNPC[0];
  const config = { childList: true, subtree: true };

  buildDropList(currentlySelectedNPC);

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes.length) {
          switchedTo = mutation.addedNodes[0].parentElement.attributes.getNamedItem("data-row").value;
          if (switchedTo != currentlySelectedNPC) {
            currentlySelectedNPC = switchedTo;
          }
          buildDropList(currentlySelectedNPC);
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(huntingNPC, config);
}, ['hunting.php']);


// function phantomPopup() {
//   // Write something here to alert you a bit more obviously if you get a phantom item
// }

/**
 * Adds caching to a function. Fetches from cache if value is there, otherwise
 * generates, stores in cache, and returns results of fetch_fn.
 */
function cachedFetch(key, timeout, fetch_fn) {
  var value = cacheGet(key);
  if (value === null) {
    value = fetch_fn();
    cacheSet(key, value, timeout);
  }
  return value;
}

/**
 * Fetching/caching function. If already at url, applies fn, and stores result
 * in cache. Otherwise, fetches key from cache if available, and if not in
 * cache then does an ajax get to url and applies fn to compute return value.
 */
function cachedFetchWithRefresh(key, timeout, path, fn) {
  var value;

  if (window.location.pathname === path) {
    value = fn(document);
    if (value !== undefined) {
      cacheSet(key, value, timeout);
      return value;
    }
  }

  value = cachedFetch(key, timeout, function () {
    return syncGet(path)
      .then(data => {
        if (data) {
          return fn(data)
        } else {
          return null;
        }
      })
      .catch(error => {
        throw error;
      });
  });

  return value;
}

/**
 * Does an async get and returns the result.
 */
async function syncGet(url) {
  try {
    const response = await fetch(url); // Makes the request asynchronously

    if (!response.ok) { // Check for HTTP errors (e.g., 404, 500)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fetched_data = await response.text();

    return fetched_data;
  } catch (error) {
    console.error(`Fetch request to ${url} failed:`, error);
    // You might want to re-throw the error, or return null/undefined
    return null;
  }
}

/**
 * Transforms a key such that it is only valid for the current session. Should
 * be used for all cache keys.
 */
function sessionKey(key) {
  var legacy_hash;
  switch (URI(window.location.href).subdomain()) {
    case 'www':
      legacy_hash = document.cookie.match(/legacy_hash=(\w+)/)[1];
      break;
    case 'dev':
      legacy_hash = document.cookie.match(/legacy_hash_dev=(\w+)/)[1];
      break;
  }
  return key + ":" + legacy_hash;
}

/**
 * Simple utility assert function.
 */
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}

executeFunctions(function_registry);

class Item {
  constructor(name, slot, trades, id) {
    this.name = name;
    this.slot = slot;
    this.trades = trades;
    this.id = id;
  }
}

class Inventory {
  constructor(items) {
    this.items = items;
  }
}

function createInventory() {
  const url = `inventory.php`;

  fetch(url, {
      method: 'GET',
  })
  .then(response => {
      if (!response.ok) {
          return response.text().then(errorMessage => {
              throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
          });
      }
      return response.text();
  })
  .then(data => {
      console.log('Request successful. Response data:', data);
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      var items = doc.querySelectorAll('.itemicon');
      for (item of items) {
        itemId = item.attributes.id.value.split('|')[1];
        j = new Item(item.attributes.title.value, item.attributes.name.value, 0, itemId)
        // Uncomment this next line if you want to see all of the objects
        //console.log(j);
      }
  })
  .catch(error => {
      console.error('Merge request failed:', error);
  });
}

createInventory();