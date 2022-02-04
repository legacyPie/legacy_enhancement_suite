Legacy Enhancement Suite
========================
Simple userscript that provides a variety of tweaks, enhacements, and fixes for [Legacy Game](http://legacy-game.net/).

Installation Instructions
-------------------------
### Firefox / Chrome
1. **Firefox**: Install [Tampermonkey](https://addons.mozilla.org/en-GB/firefox/addon/tampermonkey/) / **Chrome**: Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. [Click here.](https://github.com/legacyPie/legacy_enhancement_suite/raw/master/legacy_enhancement_suite.user.js)
3. Click on 'Install' when prompted.

### Internet Explorer / Safari / Other
1. Install [Firefox](https://www.mozilla.org/firefox/) or [Chrome](https://www.google.com/chrome/).
2. Refer to the Firefox/Chrome installation instructions above.

Features
--------
### Healing
- Binds the "H" key on your keyboard to a full heal.
 - As long as you are not in a text box and press "H", you will make a full heal.

### Player Profile
- You can now hover over Items in Players' Profiles to view it's details as a tool-tip.

### Market
- You can now hover over Items searched to view it's details as a tooltip.
 - Has the potential to return wrong data; check before purchasing.
- In the event you are adding an Item that is already found in your stand, the price field will be automatically filled to fit the existing price.
- Binds the "A" key on your keyboard to add the selected item to your stand.
As long as you are not in a text box and press "A", the item will be added to the stand; provided the price field is not invalid.
- When taking an Item from your stand or storage, your page will scroll back down to the same position; you no longer have to keep scrolling to find the same item.
- Adding items from profile will now automatically check the "Add all from inventory" checkbox. The "A" key will also work as a shortcut to add items from the inventory confirmation page.

### Abilities
- Fully Trained Abilities no longer show up in the drop-down menu.

### Top 10 Lists
- Creates 10 entries for the Top 10 separated by semi-colons for easy copy-pasting.
 - Example: 1;PlayerName;Points
 - This is available for all 6 Top 10 tables & the 2 Top 10 tables for Gangs.

### Gang Complete WFP List
- As above, export available for gang complete WFP list in format 1;PlayerName;Level;Points

### Jobs
- Automatically selects the maximum amount of times you can work with your current turns.

### Flags
- You can now upload Flags.
 - Images are converted automatically.
 - You can choose which part of the image is to be converted to the Flag.

### Hunting
- Allows the player to Hunt the same Hunting Group on the same page as the final hit that results in victory.
- Allows the player to combine a Crystal that just dropped with another if found in your Inventory.
- Shows remaining inventory spaces left after hunting.
- Tracks drops by hunting groups and shows drops and drop rates in the hunting page.

### Wastelands
- Hovering over a Gang Alert now shows a 3x3 grid of the area that was Alerted.

### Combat
- Attack Buttons are now rendered un-clickable when clicked once. This prevents multiple clicks which may break fights (multi-attack error).
- Show the combat search results page by default.
- Automatically fill in the first combat search result in the target box.

Acknowledgements
----------------
Many thanks to langer and rollin340 for their various contributions to this project, in the form of suggestions, code contributions, bug testing, and documentation.
