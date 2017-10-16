# Time Folder

A modern download manager for MacOS. Supports HTTP, FTP, SFTP, and BitTorrent. Backend handled by  [aria2](https://aria2.github.io/).

This software is still in development and may contain bugs. If you are not a developer, please check back for future releases.

### Install

If you want to contribute to the development of Time Folder, you can set it up using the following instructions. For the upcoming official release, all of the steps below will be simplified into a single application.

1. Install [HomeBrew](https://brew.sh/) (A package manager for MacOS)

   ```bash
   /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   ```

2. Install [aria2](https://aria2.github.io/). There are plans to bundle aria2 into Time Folder, but for now it is installed separately.

   ```bash
   brew install aria2
   ```

3. Install [npm](https://www.npmjs.com/) (Node package manager) by going to [this link](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm)

4. Clone this GitHub repo to your desired location

   ```bash
   git clone https://github.com/ziyaointl/Time-Folder.git
   cd Time-Folder
   ```

5. Install other dependencies

   ```bash
   npm install
   ```

6. Create a downloads folder in your desired location

   ```bash
   mkdir Downloads
   cd Downloads
   ```

7. Copy aria2.conf to the downloads folder you just created

   ```bash
   cp /path/to/your/cloned/repository/Time-Folder/aria2.conf /path/to/your/downloads/folder
   ```

8. In the downloads folder, run aria2

   ```bash
   aria2c --conf=aria2.conf
   ```

9. In a new terminal window, cd to your cloned Time-Folder directory and start electron

   ```bash
   ./node_modules/.bin/electron .
   ```

   ​
