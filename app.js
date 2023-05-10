//#region Team Class
/**
 * Team Class
 * Author: Patrick Murray
 * Models a Team of Player objects */
class Team {
   constructor(_teamName) {
      console.log('---Team Constructor called');
      this.teamName = _teamName;
   }
}
//#endregion Team Class

//#region Player Class
/**
 * Player Class
 * Author: Patrick Murray
 * Models a Player object
 */
class Player {
   constructor(_playerName, _position, _teamName) {
      console.log('---Player Constructor called');
      this.playerName = _playerName;
      this.position = _position;
      this.teamName = _teamName;
   }
}
//#endregion Player Class

//#region UI Class
/**
 * UI Class
 * Author: Patrick Murray
 * Handles UI Tasks for App
 * Uses Static Methods
 */
class UI {
   // Adds teamlist to dropdown and playerList to the table
   static displayPlayerAndTeams() {
      console.log('UI.displayPlayerAndTeams called');
      let teamList = DataStorage.getTeams();
      let playerList = DataStorage.getPlayers().sort((a, b) => {
         if (a.teamName < b.teamName) {
            return -1;
         }
         if (a.teamName > b.teamName) {
            return 1;
         }
         return 0;
      });

      // Populate player list and team dropdown
      teamList.forEach(team => UI.addTeamToDropdown(team));
      playerList.forEach(player => UI.addPlayerToList(player));
   }

   //adds new row to table containing player data
   static addPlayerToList(player) {
      console.log('UI.addPlayerToList called');
      const tableList = document.querySelector('#player-list');
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${player.teamName}</td>
      <td>${player.playerName}</td>
      <td>${player.position}</td>
      <td><a href="#" class="btn btn-warning btn-sm edit">Edit</a></td>
      <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
      `;
      tableList.appendChild(row);
   }

   // adds team to dropdown
   static addTeamToDropdown(team) {
      console.log(`UI.addTeamToDropdown called`);
      const dropdownList = document.querySelector('#team-selector');
      const option = document.createElement('option');
      option.value = team.teamName;
      option.text = team.teamName;
      dropdownList.appendChild(option);
      UI.getTeamNamesFromDropdown();
   }

   // retrieves the list of team names and returns as an array
   static getTeamNamesFromDropdown() {
      console.log(`UI.getTeamNamesFromDropdown called`);
      const dropdownList = document.querySelector('#team-selector');
      const children = dropdownList.options;
      const arr = new Array();
      for (let i = 0; i < children.length; i++) {
         arr.push(children[i].value);
      }
      return children;
   }

   // displays alert message above Team form
   static showTeamAlert(message, className, timeout) {
      console.log(`UI.showTeamAlert called`);
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#team-form');
      container.insertBefore(div, form);

      // Set Alert Message to disappear
      setTimeout(() => document.querySelector('.alert').remove(), timeout);
   }

   // displays alert message above player form
   static showPlayerAlert(message, className, timeout) {
      console.log(`UI.showPlayerAlert called`);
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#player-form');
      container.insertBefore(div, form);

      // Set Alert Message to disappear
      setTimeout(() => document.querySelector('.alert').remove(), timeout);
   }

   // removes player from table
   static deletePlayer(element) {
      console.log(`UI.deletePlayer called`);
      // If target element has class "delete", remove from the Display
      if (element.classList.contains('delete')) {
         element.parentElement.parentElement.remove();
      }
      if (element.classList.contains('edit')) {
         element.parentElement.parentElement.remove();
      }
   }

   static toggleAddEditButton() {
      console.log('toggleAddEditButton called');
      let button = document.querySelector('#button-add');
      if (button.classList.contains('btn-player-add')) {
         // ---Toggle button from ADD to EDIT
         console.log('---Toggle button from ADD to EDIT');
         button.setAttribute('value', 'Edit Player');
         button.setAttribute('class', 'btn btn-primary mt-2 btn-player-edit');
      } else if (button.classList.contains('btn-player-edit')) {
         // ---Toggle button from EDIT to ADD
         console.log('---Toggle button from EDIT to ADD');
         button.setAttribute('value', 'Add New Player');
         button.setAttribute('class', 'btn btn-primary mt-2 btn-player-add');
      }
   }

   static editPlayer(player) {
      console.log(`UI.editPlayer called`);

      // Change Add  new player button to Edit player button
      let button = document.querySelector('#button-add');
      if (button.classList.contains('btn-player-add')) {
         UI.toggleAddEditButton();
      }
      // UI.toggleAddEditButton();
      UI.displaySelectedPlayerOnForm(player);
      DataStorage.removeData(player);
      // console.log(player);
   }

   static getPlayerValuesFromForm() {
      console.log(`getPlayerValuesFromForm called`);
      // Get the values from the form
      const playerName = document.querySelector('#player-name').value;
      const playerPosition = document.querySelector('#player-position').value;
      const teamName = document.querySelector('#team-selector').value;
      return new Player(playerName, playerPosition, teamName);
   }

   static displaySelectedPlayerOnForm(player) {
      console.log(`displaySelectedPlayerOnForm called`);
      document.querySelector('#player-name').value = player.playerName;
      document.querySelector('#player-position').value = player.position;
      document.querySelector('#team-selector').value = player.teamName;
   }

   // clear fields in team form
   static clearTeamFields() {
      console.log(`clearTeamFields called`);
      document.querySelector('#team-name').value = '';
   }

   //clear fields in player form
   static clearPlayerFields() {
      console.log(`clearPlayerFields called`);
      document.querySelector('#player-name').value = '';
      document.querySelector('#player-position').value = '';
   }
}
//#endregion UI Class

//#region DataStorage Class
/**
 * DataStorage Class
 * Author: Patrick Murray
 * Handles Data Management for App
 */
class DataStorage {
   // Gets player data from local storage
   static getPlayers() {
      console.log(`DataStorage.getPlayers called`);
      // Get players from local storage
      let players;

      // if players key/value does not exist then create it
      if (localStorage.getItem('players') === null) {
         players = [];
      } else {
         // Otherwise get key/value and parse
         players = JSON.parse(localStorage.getItem('players'));
         console.table(players);
      }
      return players.sort((a, b) => {
         if (a.teamName < b.teamName) {
            return -1;
         }
         if (a.teamName > b.teamName) {
            return 1;
         }
         return 0;
      });
   }

   // gets team data from local storage
   static getTeams() {
      console.log(`DataStorage.getTeams called`);
      // Get teams from local storage
      let teams;
      // if teams key/value does not exist then create it
      if (localStorage.getItem('teams') === null) {
         teams = [];
      } else {
         // Otherwise get key/value and parse
         teams = JSON.parse(localStorage.getItem('teams'));
      }
      return teams.sort((a, b) => {
         if (a.teamName < b.teamName) {
            return -1;
         }
         if (a.teamName > b.teamName) {
            return 1;
         }
         return 0;
      });
   }

   // adds new player to local storage
   static addPlayer(player) {
      console.log(`DataStorage.addPlayer called`);
      // Get players from local storage
      const players = DataStorage.getPlayers();
      // add new player to array
      players.push(player);
      players.sort((a, b) => {
         if (a.teamName < b.teamName) {
            return -1;
         }
         if (a.teamName > b.teamName) {
            return 1;
         }
         return 0;
      });
      // Stringify and store
      localStorage.setItem('players', JSON.stringify(players));
   }

   // adds new team to local storage
   static addTeam(team) {
      console.log(`DataStorage.addTeam called`);
      // Get teams from local storage
      let teams = DataStorage.getTeams();
      // add new team to array
      teams.sort((a, b) => {
         if (a.teamName < b.teamName) {
            return -1;
         }
         if (a.teamName > b.teamName) {
            return 1;
         }
         return 0;
      });
      teams.push(team);
      // Stringify and store
      localStorage.setItem('teams', JSON.stringify(teams));
   }

   static searchForMatchingPlayer(searchItem, players) {
      console.log(`DataStorage.searchForMatchingPlayer called`);
      // returns index of matching player if found, -1 if not found
      let result = -1;
      players.forEach((player, i) => {
         if (
            // item found
            searchItem.playerName === player.playerName &&
            searchItem.playerPosition === player.playerPosition &&
            searchItem.teamName === player.teamName
         ) {
            console.log(`index of found player: ${i}`);
            result = i;
         }
      });
      return result;
   }

   static updatePlayer(updPlayer) {
      console.log(`DataStorage.updatePlayer called`);
      // removes player from local storage
      const players = DataStorage.getPlayers();
      if (index !== -1) {
         players.splice(index, 1);
      }

      //gets values from form

      // Stringify and store
      localStorage.setItem('players', JSON.stringify(players));
   }
   static removeData(delPlayer) {
      console.log(`DataStorage.removeData called`);
      // removes player from local storage
      // Get teams from local storage
      const players = DataStorage.getPlayers();
      // search for matching player
      let index = DataStorage.searchForMatchingPlayer(delPlayer, players);
      if (index !== -1) {
         console.log('player to delete: ', players[index]);
         players.splice(index, 1);
         console.table(players);
      }
      // Stringify and store
      localStorage.setItem('players', JSON.stringify(players));
   }
}

//#endregion DataStorage Class

//#region Events
/**
 * Events Go in this section
 */

// VIEW EVENTS
// Event: Display Players
document.addEventListener('DOMContentLoaded', UI.displayPlayerAndTeams);

// ADD EVENTS
// Event: Add Team
document.querySelector('#team-form').addEventListener('submit', e => {
   console.log(`Add Team Event Listener called`);
   // Prevent Default Action
   e.preventDefault();

   // Get the values from the form
   const teamName = document.querySelector('#team-name').value;

   // Validate Form fields
   if (teamName === '') {
      // Alert user that data is required
      UI.showTeamAlert('Team Name is required', 'danger', 1800);
   } else {
      // Instantiate a new Team
      const team = new Team(teamName);

      //TODO - Check to make sure that team does not already exist

      // Add Team to UI
      UI.addTeamToDropdown(team);

      //Add book to local storage
      DataStorage.addTeam(team);

      // Alert user of success
      UI.showTeamAlert(`${teamName} added`, 'success', 1800);

      //clear fields
      UI.clearTeamFields();
   }
});

// Event: Add/Edit Player
document.querySelector('#player-form').addEventListener('submit', e => {
   console.log(`Add/EDIT Player Event Listener called`);
   // Prevent Default Action
   e.preventDefault();

   // element.parentElement.parentElement.remove();

   // Get the values from the form
   let player = UI.getPlayerValuesFromForm();

   // Validate Form fields
   if (
      player.playerName === '' ||
      player.position === '' ||
      player.teamName === ''
   ) {
      UI.showPlayerAlert(
         'Player Name and Position are required',
         'danger',
         1800
      );
   } else {
      let button = document.querySelector('#button-add');
      if (button.classList.contains('btn-player-add')) {
         // Add Player to UI
         UI.addPlayerToList(player);

         // Add player to local storage
         DataStorage.addPlayer(player);

         // Alert user of success
         UI.showPlayerAlert(
            `${player.playerName} has been added to the ${player.teamName}.`,
            'success',
            1800
         );

         // Clear fields
         UI.clearPlayerFields();
      }
      if (button.classList.contains('btn-player-edit')) {
         console.log('btn-player-edit is WORKING');
         console.log(player);
         //DataStorage.removeData(player);
         // get updated from values from form
         player = UI.getPlayerValuesFromForm();

         // Add Player to UI
         UI.addPlayerToList(player);

         // Add player to local storage
         DataStorage.addPlayer(player);

         // Alert user of success
         UI.showPlayerAlert(
            `${player.playerName} has been updated.`,
            'success',
            1800
         );
         UI.clearPlayerFields();
         //FIXME -
         // delete all players from List and rebuild list
         // UI.deletePlayer(e.target);
         UI.toggleAddEditButton();
      }
   }
});

// EDIT EVENTS
// Event: Edit Team
// TODO - Maybe code edit teams ???
// Event: Edit Player
// TODO - Edit Players Event
document.querySelector('#player-list').addEventListener('click', e => {
   console.log(`Edit Player Event Listener called`);
   e.preventDefault();
   if (e.target.classList.contains('edit')) {
      // Delete player from UI
      UI.deletePlayer(e.target);

      const teamName =
         e.target.parentElement.previousElementSibling.previousElementSibling
            .previousElementSibling.textContent;

      const playerName =
         e.target.parentElement.previousElementSibling.previousElementSibling
            .textContent;

      const playerPosition =
         e.target.parentElement.previousElementSibling.textContent;

      let player = new Player(playerName, playerPosition, teamName);
      UI.editPlayer(player);
      UI.displaySelectedPlayerOnForm(player);
   }
});
// Event: Remove Team
// TODO - Maybe...

// Event: Remove Player
document.querySelector('#player-list').addEventListener('click', e => {
   console.log(`Remove Player Event Listener called`);
   e.preventDefault();
   if (e.target.classList.contains('delete')) {
      // Delete player from UI
      UI.deletePlayer(e.target);
      // console.log(e.target);

      //Delete player from local storage
      // Uses Event Propagation to select fields pertaining to the delete button clicked
      const teamName =
         e.target.parentElement.previousElementSibling.previousElementSibling
            .previousElementSibling.previousElementSibling.textContent;

      const playerName =
         e.target.parentElement.previousElementSibling.previousElementSibling
            .previousElementSibling.textContent;

      const playerPosition =
         e.target.parentElement.previousElementSibling.previousElementSibling
            .textContent;

      let tempPlayer = new Player(playerName, playerPosition, teamName);
      console.log(tempPlayer);
      DataStorage.removeData(tempPlayer);

      // Alert user that Player has been deleted
      UI.showPlayerAlert(`Player has been deleted.`, 'success', 1800);
   }
});
//#endregion Events
