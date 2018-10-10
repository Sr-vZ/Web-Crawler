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
