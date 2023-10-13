// Create a <style> element and set the custom property and hex variables
const styleElement = document.createElement('style');

// Find the footer element (you may need to adjust the selector)
const underBody = document.querySelector('body');

// Insert the <style> element below the footer
underBody.parentNode.insertBefore(styleElement, underBody.nextSibling);



// Get the random hex luminance to set the invert color 
function getLuminance(hexCode) {
  // Convert the color to its RGB components
  const r = parseInt(hexCode.slice(0,2), 16) / 255;
  const g = parseInt(hexCode.slice(2,4), 16) / 255;
  const b = parseInt(hexCode.slice(4,6), 16) / 255;

  //////// console.log( 'red='+r+' green='+g+' blue='+b);
  
  // Calculate luminance
  const luminance = 0.2126 * Math.pow(r, 2.2) + 0.7152 * Math.pow(g, 2.2) + 0.0722 * Math.pow(b, 2.2);

  if (luminance > 0.5) {
    var textcolor = 'dark';
  } else {
    var textcolor = 'light';
  }
  
  document.querySelector('body').setAttribute('text-color', textcolor);
  document.querySelector('body').setAttribute('luminance', luminance);

  return luminance;
}

// function prevHexColor() {
//   var redoHex = document.querySelector('#copy').getAttribute('data-value');
//   document.querySelector('#next').setAttribute('data-value', redoHex);
  
//   var undoHex = document.querySelector('#prev').getAttribute('data-value');
//   selectHexValues(undoHex);
//   updateSecretColor();
//   document.querySelector('.BADA55').innerHTML = redoHex;
  
//   document.querySelector('#copy').setAttribute('data-value', undoHex);
//   document.querySelector('#prev').removeAttribute('data-value');
// }

// function nextHexColor() {
//   var undoHex = document.querySelector('#copy').getAttribute('data-value');
//   document.querySelector('#prev').setAttribute('data-value', undoHex);
  
//   var redoHex = document.querySelector('#next').getAttribute('data-value');
//   selectHexValues(redoHex);
//   updateSecretColor();
//   document.querySelector('.BADA55').innerHTML = undoHex;
  
//   document.querySelector('#copy').setAttribute('data-value', redoHex);
//   document.querySelector('#next').removeAttribute('data-value');
// }

// show/hide manual edit textbox
function manualEdit() {
  const editButton = document.getElementById('edit');
  const editForm = document.getElementById('editForm');
  const editField = document.getElementById('editField');
  const copyButton = document.getElementById('copy');

  if (editForm.classList.contains('active')) {
    editField.blur(); // Trigger a blur event to save the value
  } else {
    // Add the "active" class
    editForm.classList.add('active');
    editField.focus();

    // Listen for the input's input event
    editField.addEventListener('input', function() {
      editField.value = editField.value.toUpperCase();
      
      // Update the data-value with the input value
      copyButton.setAttribute('data-value', editField.value);
      selectHexValues(editField.value);
    });

    // Listen for the input's blur event
    editField.addEventListener('blur', function() {
      setTimeout(function() {
        editForm.classList.remove('active');
      }, 100);
      
      // Update the data-value with the input value
      copyButton.setAttribute('data-value', editField.value);
      selectHexValues(editField.value);
    });

    // Listen for the Enter key
    editField.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        editField.blur(); // Trigger a blur event to save the value
      }
    });
  }
}



function submitManualEdit() {
  const editField = document.getElementById('editField');
  const copyButton = document.getElementById('copy');

  // Update the data-value with the input value
  copyButton.setAttribute('data-value', editField.value);
  editField.blur();
}


// copy the current hex code
function copyHexColor() {
  // Get the value
  const copyButton = document.getElementById('copy');
  var copyHex = copyButton.getAttribute("data-value");
  const modalElement = document.querySelector('.modal');
  const sectionElement = document.querySelector('section');

   // Copy the text inside the text field
  navigator.clipboard.writeText('#'+copyHex);

  
  // Change the icon to a checkmark
  const copyIcon = copyButton.querySelector('span');
  let txt = copyIcon.innerText;
  copyIcon.innerText = txt == 'content_copy' ? 'check' : 'content_copy';
  sectionElement.classList.add('copied');
  
  setTimeout(() => {
    sectionElement.classList.remove('copied');
  }, 100); 
  
  setTimeout(() => {
    copyIcon.classList.add('fade');
  }, 1000); 
  
  // Change it back
  setTimeout(() => {
    copyIcon.classList.remove('fade');
    copyIcon.innerText = 'content_copy';
  }, 2000); 
  
  // Alert the copied text
  // alert("Copied the text: #"+copyHex);
}


// Get a new rando hex code
function randomHexColor() {
  //var previousHex = document.querySelector('#copy').getAttribute('data-value');
  //document.querySelector('#prev').setAttribute('data-value', previousHex);
  //document.querySelector('.BADA55').innerHTML = previousHex;
  
  // Generate a random hex code
  const characters = '0123456789ABCDEF';
  let randomHex = '';
  for (let i = 0; i < 6; i++) {
    randomHex += characters[Math.floor(Math.random() * characters.length)];
  }

  // Split the hex code into 6 variables
  const hex1 = randomHex[0];
  const hex2 = randomHex[1];
  const hex3 = randomHex[2];
  const hex4 = randomHex[3];
  const hex5 = randomHex[4];
  const hex6 = randomHex[5];

  // Create an object to hold all the values
  const styles = {
    randomHex,
    hex1,
    hex2,
    hex3,
    hex4,
    hex5,
    hex6,
  };

  // Update the --cheater CSS variable
  styleElement.innerHTML = `:root {
    --cheater: #${styles.randomHex};
    --hex1: #${styles.hex1};
    --hex2: #${styles.hex2};
    --hex3: #${styles.hex3};
    --hex4: #${styles.hex4};
    --hex5: #${styles.hex5};
    --hex6: #${styles.hex6};
  }`;

  // grab that luminance
  const luminance = getLuminance(randomHex);

  // update the columns to reflect new values
  const columns = document.querySelectorAll("ul");

  for (let i = 0; i < randomHex.length && i < columns.length; i++) {
    const column = columns[i];
    const hexChar = randomHex.charAt(i);

    for (const li of column.querySelectorAll("li")) {
      if (li.getAttribute("data-value") === hexChar) {
        li.click(); // Trigger a "click" event on the matching li
        break; // Stop searching once a match is found
      }
    }
  }
  
  document.querySelector('#copy').setAttribute('data-value', randomHex);
  document.querySelector('#editField').setAttribute('data-value', randomHex);
  document.querySelector('#editField').setAttribute('value', randomHex);
}


// Apply the newest group of hex values to existing columns
function selectHexValues(hexCode) {
  const columns = document.querySelectorAll("ul");

  for (let i = 0; i < hexCode.length && i < columns.length; i++) {
    const column = columns[i];
    const hexChar = hexCode.charAt(i);

    for (const li of column.querySelectorAll("li")) {
      if (li.getAttribute("data-value") === hexChar) {
        li.click(); // Trigger a "click" event on the matching li
        break; // Stop searching once a match is found
      }
    }
  }
}



// Calc the new hex code, drop it in the background
function updateSecretColor() {
  // Get the selected characters from each ul group
  const selectedChars = [];
  const uls = document.querySelectorAll("ul");
  
  uls.forEach((ul) => {
    const selectedElement = ul.querySelector('.selected');
    if (selectedElement) {
      selectedChars.push(selectedElement.dataset.value);
    }
  });

  // Convert selected characters into a hex code
  const hexCode = selectedChars.join('');

  // Update the --cheater CSS variable
  // Split the hex code into 6 variables
        const hex1 = hexCode[0];
        const hex2 = hexCode[1];
        const hex3 = hexCode[2];
        const hex4 = hexCode[3];
        const hex5 = hexCode[4];
        const hex6 = hexCode[5];

        // Create an object to hold all the values
        const styles = {
          hexCode,
          hex1,
          hex2,
          hex3,
          hex4,
          hex5,
          hex6,
        };

        // Update the --cheater CSS variable
        styleElement.innerHTML = `:root {
          --cheater: #${styles.hexCode};
          --hex1: #${styles.hex1};
          --hex2: #${styles.hex2};
          --hex3: #${styles.hex3};
          --hex4: #${styles.hex4};
          --hex5: #${styles.hex5};
          --hex6: #${styles.hex6};
        }`;

  // grab that luminance
  const luminance = getLuminance(hexCode);
  
  document.querySelector('#copy').setAttribute('data-value', hexCode);
  document.querySelector('#editField').setAttribute('data-value', hexCode);
  document.querySelector('#editField').setAttribute('value', hexCode);
  document.querySelector('.BADA55').innerHTML = hexCode;
}



//const randoButton = document.querySelectorAll("#rando");
//randoButton.addEventListener("click", randomHexColor());


const uls = document.querySelectorAll("ul");

uls.forEach((ul) => {
    const items = ul.querySelectorAll("li");

    items.forEach((item) => {
        item.addEventListener("click", (e) => {
            const clickedItem = e.target;
            const parentUl = clickedItem.closest("ul");

            for (let listItem of parentUl.querySelectorAll("li")) {
                if (listItem === clickedItem) {
                    listItem.classList.add("selected");
                } else {
                    listItem.classList.remove("selected");
                }
            }

            // Get the selected element
            const selectedElement = parentUl.querySelector('.selected');

            // Get the index of the selected element
            const selectedIndex = Array.from(parentUl.children).indexOf(selectedElement);

            // Calculate the margin-top based on the index
            const marginTop = -selectedIndex + 'em';

            // Apply the margin-top to the ul
            parentUl.style.marginTop = marginTop;
          
            // Call the function to update the --secret variable
            updateSecretColor();
        });

//         item.addEventListener("touchstart", (e) => {
//             const touchStartY = e.touches[0].clientY;
//             const parentUl = item.closest("ul");
//             const maxLi = parentUl.querySelectorAll("li").length - 1;
//             const initialMargin = parseFloat(getComputedStyle(parentUl).marginTop);

//             item.addEventListener("touchmove", (e) => {
//                 const touchCurrentY = e.touches[0].clientY;
//                 const deltaY = touchStartY - touchCurrentY;
//                 parentUl.style.marginTop = (initialMargin - deltaY) + 'px';
//             });

//             item.addEventListener("touchend", () => {
//                 // Calculate which item is currently in the center
//                 var centerIndex = Math.round(-parseFloat(getComputedStyle(parentUl).marginTop) / parseFloat(getComputedStyle(item).height));

//                 // Fix the centerIndex if outside the bounds
//                 if (centerIndex < 0) {
//                     centerIndex = 0;
//                 } else if (centerIndex > maxLi) {
//                     centerIndex = maxLi;
//                 }

//                 parentUl.style.marginTop = -centerIndex * parseFloat(getComputedStyle(item).height) + 'px';

//                 // Update the selected item
//                 const items = parentUl.querySelectorAll("li");
//                 items.forEach((item, index) => {
//                     if (index === centerIndex) {
//                         item.classList.add("selected");
//                     } else {
//                         item.classList.remove("selected");
//                     }
//                 });
                        
//                 // Call the function to update the --secret variable
//                 updateSecretColor();
//             });
//         });

        // Mouseup event handling for each item
//         const parentUl = item.closest("ul");
//         let isDragging = false;
//         let startX, startY;
//         let initialMargin;
//         const minMargin = -(item.offsetHeight - parseFloat(getComputedStyle(item).height) - parseFloat(getComputedStyle(parentUl).fontSize));
//         console.log(minMargin);

//         item.addEventListener("mousedown", (e) => {
//             isDragging = true;
//             startX = e.clientX;
//             startY = e.clientY;
//             initialMargin = parseFloat(getComputedStyle(parentUl).marginTop);

//             document.addEventListener("mousemove", handleMouseMove);
//             document.addEventListener("mouseup", handleMouseUp);
//         });

//         function handleMouseMove(e) {
//             if (isDragging) {
//                 const deltaY = startY - e.clientY;
//                 console.log( 'deltaY=' + deltaY + ' / initialMargin=' + initialMargin + ' / minMargin=' + minMargin );
              
//                 console.log( 'equals=' + Math.min(initialMargin - deltaY, 0) + 'px')
//                 parentUl.style.marginTop = Math.min(initialMargin - deltaY, 0) + 'px';
//             }
//         }

//         function handleMouseUp() {
//           isDragging = false;
//           document.removeEventListener("mousemove", handleMouseMove);
//           document.removeEventListener("mouseup", handleMouseUp);

//           const items = parentUl.querySelectorAll("li");

//           // Find the index of the currently centered li based on the margin-top
//           const currentIndex = Math.round(-parseFloat(getComputedStyle(parentUl).marginTop) / parseFloat(getComputedStyle(items[0]).height));

//           // Ensure the index stays within bounds
//           const selectedIndex = Math.max(0, Math.min(currentIndex, items.length - 1));

//           // Get the li at the selectedIndex
//           const nearestLi = items[selectedIndex];

//           // Simulate a click on the nearest li
//           nearestLi.click();
//           nearestLi.classList.add("selected");
                    
//           // Call the function to update the --cheater variable
//           updateSecretColor();
//       }
      
      
    });

    // Simulate a "click" on the initially selected elements after page load
    window.addEventListener('load', () => {
        // items.forEach((item) => {
        //     if (item.classList.contains('selected')) {
        //         item.click(); // Trigger a "click" event
        //     }
        // });
      
        selectHexValues('BADA55');
      
        //randomHexColor();
      
        // setTimeout(() => {
        //   randomHexColor();
        // }, 3000);
    });
});
