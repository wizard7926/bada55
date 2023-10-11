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

  console.log( 'red='+r+' green='+g+' blue='+b);
  
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
  
}


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

        item.addEventListener("touchstart", (e) => {
            const touchStartY = e.touches[0].clientY;
            const parentUl = item.closest("ul");
            const maxLi = parentUl.querySelectorAll("li").length - 1;
            const initialMargin = parseFloat(getComputedStyle(parentUl).marginTop);

            item.addEventListener("touchmove", (e) => {
                const touchCurrentY = e.touches[0].clientY;
                const deltaY = touchStartY - touchCurrentY;
                parentUl.style.marginTop = (initialMargin - deltaY) + 'px';
            });

            item.addEventListener("touchend", () => {
                // Calculate which item is currently in the center
                var centerIndex = Math.round(-parseFloat(getComputedStyle(parentUl).marginTop) / parseFloat(getComputedStyle(item).height));

                // Fix the centerIndex if outside the bounds
                if (centerIndex < 0) {
                    centerIndex = 0;
                } else if (centerIndex > maxLi) {
                    centerIndex = maxLi;
                }

                parentUl.style.marginTop = -centerIndex * parseFloat(getComputedStyle(item).height) + 'px';

                // Update the selected item
                const items = parentUl.querySelectorAll("li");
                items.forEach((item, index) => {
                    if (index === centerIndex) {
                        item.classList.add("selected");
                    } else {
                        item.classList.remove("selected");
                    }
                });
                        
                // Call the function to update the --secret variable
                updateSecretColor();
            });
        });

        // Mouseup event handling for each item
        const parentUl = item.closest("ul");
        let isDragging = false;
        let startX, startY;
        let initialMargin;
        const minMargin = -(item.offsetHeight - parseFloat(getComputedStyle(item).height) - parseFloat(getComputedStyle(parentUl).fontSize));
        console.log(minMargin);

        item.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialMargin = parseFloat(getComputedStyle(parentUl).marginTop);

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        });

        function handleMouseMove(e) {
            if (isDragging) {
                const deltaY = startY - e.clientY;
                console.log( 'deltaY=' + deltaY + ' / initialMargin=' + initialMargin + ' / minMargin=' + minMargin );
              
                console.log( 'equals=' + Math.min(initialMargin - deltaY, 0) + 'px')
                parentUl.style.marginTop = Math.min(initialMargin - deltaY, 0) + 'px';
            }
        }

        function handleMouseUp() {
          isDragging = false;
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);

          const items = parentUl.querySelectorAll("li");

          // Find the index of the currently centered li based on the margin-top
          const currentIndex = Math.round(-parseFloat(getComputedStyle(parentUl).marginTop) / parseFloat(getComputedStyle(items[0]).height));

          // Ensure the index stays within bounds
          const selectedIndex = Math.max(0, Math.min(currentIndex, items.length - 1));

          // Get the li at the selectedIndex
          const nearestLi = items[selectedIndex];

          // Simulate a click on the nearest li
          nearestLi.click();
                    
          nearestLi.classList.add("selected");
                    
          // Call the function to update the --cheater variable
          updateSecretColor();
      }
      
      
    });

    // Simulate a "click" on the initially selected elements after page load
    window.addEventListener('load', () => {
        items.forEach((item) => {
            if (item.classList.contains('selected')) {
                item.click(); // Trigger a "click" event
            }
        });
      
        // Generate a random hex code
        const randomHex = Math.floor(Math.random() * 16777215).toString(16);

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
    });
});
