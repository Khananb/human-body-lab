// scoreManager.js
(function(){
  // Migrate old key if exists
  if(localStorage.getItem('score') !== null) {
    localStorage.setItem('labScore', localStorage.getItem('score'));
    localStorage.removeItem('score');
  }
  if(localStorage.getItem('labScore') === null) {
    localStorage.setItem('labScore', '0');
  }
  window.addXP = function(points = 1) {
    let current = parseInt(localStorage.getItem('labScore')) || 0;
    current += points;
    localStorage.setItem('labScore', current);
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
    return current;
  };
  window.getXP = function() {
    return parseInt(localStorage.getItem('labScore')) || 0;
  };
})();
