import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import fs from "fs";
import * as jwt from 'jsonwebtoken';
import { User } from "../interface/user";
import Jimp = require("jimp");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
export function generateJWT(user: User): string {
  return jwt.sign({username: user.username, id: user.id}, 'secret-token-test', {
    expiresIn: '10d'
  });
}

export function auth() {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    const tokenBearer = req.headers.authorization.replace('Bearer ', '');

    return jwt.verify(tokenBearer, "secret-token-test", (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
  }
}
