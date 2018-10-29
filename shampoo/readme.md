Please follow the steps to install the necessary softwares before running the actual program:
1. Install NodeJS from the following link: https://nodejs.org/en/download/ choose the appropriate version based on your system OS (Windows/Mac or Linux) and architecture (x86/x64) this will also install npm which is required for next step.

Node Package dependencies: Puppteer

Puppteer is required to run the code. In order to install the puppteer follow the next steps:
1. Extract the zip file to a location/folder.
2. After installation of NodeJS is complete open terminal/command prompt/shell on that folder
3. Enter the following commands: npm install
4. It will install the puppteer package which might take some time
5. After package installation is complete you are now ready to run the program.

How to extract the shampoo details:
There are two parts of the code 1. fetchShampooList.js and 2. fetchShampooDetails.js

1. fetchShampooList.js:
This crawls the site to capture all the shampoo names and links listed on the site to the shampooList.json this is a helper file for extracting the further details of the individual products. Open the following link https://www.ewg.org/skindeep/browse.php?category=shampoo&atatime=500&&showmore=products&start=1 in the browser and check the pages shown in the site for example right now it's 9. Open the fetchShampooList.js and enter 9 after totalPages variable. After that open the terminal/command prompt/shell on the same folder and run the following command: node fetchShampooList.js
This might take some time and will result in the shampooList.json as output next we will proceed to the next step of extracting individual product details.

2. fetchShampooDetails.js




