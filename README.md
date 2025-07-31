# MedVerse1


# package lock json - medverse2

{
  "name": "medverse1-fullstack",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "medverse1-fullstack",
      "version": "1.0.0",
      "hasInstallScript": true
    }
  }
}




# package json- medverse2

{
  "name": "medverse1-fullstack",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "start": "node backend/server.js",
    "postinstall": "npm run build"
  }
}
