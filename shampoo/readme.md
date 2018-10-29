<<<<<<< HEAD
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




=======
Software Dependencies:
1. NodeJS
2. Terminal/shell/command prompt

Node package dependncies:
1. Puppeteer

Software installation:
Install NodeJS from the following site: https://nodejs.org/en/download/ download and install depending on the system os (Windows/MAC/Linux) and architecture (x86/x64) this will automatically install NPM which is reuqired for the second part of installation.

Node Package installation:
1. Make sure NodeJS is installed on the system and is accessible through Terminal/shell/command prompt.
2. Check installation of NodeJS by running the following command in Terminal/shell/command prompt(without quotes): 'node -v' this will ouput the current installed version of NodeJS
3. Unzip the file at a particular directory/folder and open it
4. Open Terminal/shell/command prompt in the same directory/folder of the extracted files
5. Excute the following command to install Puppteer: npm install

Steps to run the program and extract details:
1. After the installtion of the dependencies is complete there are 2 files which fetchs the shampoo data
2. fetchShampooList.js is used to extract all the shampoo products listed on the site and stores them in shampooList.json file
3. fetchShampooDetails.js extarcts individual products from the list provided by the previous program
4. run the fetchShampooList.js first and mention the total page no as shown in the site
5. After completion of the above program proceed to the fetchShampooDetails.js
6. Extarcting all the data in one go might crash the program due to lack of harware resouces to a batch of 250 - 500 in a single go is advised
7. In order to define a batch we need to specify start and end numbers e.g.start=0 and end=500 means a single run of 500 products on the next go it should be incremented to start=501 and end = 1000 and so on
8. after all the individual product data is acaptured it's stored in the Shampoo_data.json
>>>>>>> c0cf08d96b313dd73e5004591058dddc7036162a
