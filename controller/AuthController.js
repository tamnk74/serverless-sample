import Response from '../helpers/Response';
import HTTPStatus from 'http-status';
import {authBusiness} from '../business';
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import config from '../config';

/**
 * Api login
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns {Response} response
 */
const login = async (event, context, callback) => {
  try {
    // Get request parameter
    const req = JSON.parse(event.body);
    const user = await authBusiness.getUserByName(req.name);
    if (!user || user.password.trim() !== req.password) {
      return Response.error({
        message: 'Incorrect username or password!'
      }, HTTPStatus.BAD_REQUEST);
    }
    // Sign jwt
    const payload = {
      user_id: user.user_id,
      name: user.name
    };
    const privateKey = fs.readFileSync(path.resolve('config', 'cert', 'private.key'), 'utf8');
    const signOptions = {
      issuer: 'Serverless',
      subject: 'admin@gmail.com',
      audience: 'https://serverless.com',
      expiresIn: "12h",
      algorithm: "RS256"
    };
    const token = jwt.sign(payload, privateKey, signOptions);
    return Response.success(token);
  }
  catch (e) {
    console.log('Error: ', e);
    return Response.error(e, HTTPStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * GET /api/auth/getUser
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns {Response} response
 */
const getUser = async (event, context, callback) => {
  try {
    const tokenBearer = event.headers.Authorization;
    const token = tokenBearer.slice(7, tokenBearer.length);
    if (!token) {
      throw new Error('Unauthorized');
    }
    const publicKey = fs.readFileSync(path.resolve('config', 'cert', 'public.key'), 'utf8');
    const verifyOptions = {
      issuer: 'Serverless',
      subject: 'admin@gmail.com',
      audience: 'https://serverless.com',
      expiresIn: "12h",
      algorithm: "RS256"
    };
    const decodeToken = jwt.verify(token, publicKey, verifyOptions);
    const user = await authBusiness.getUserById(decodeToken.user_id);
    return Response.success(user);
  }
  catch (e) {
    return Response.error(e, HTTPStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Api forget password
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns {Response} response
 */
const forgetPassword = async (event, context, callback) => {
  try {
    return Response.success({
    });
  }
  catch (e) {
    return Response.error(e, HTTPStatus.INTERNAL_SERVER_ERROR);
  }
};

export {
  login,
  getUser,
  forgetPassword,
}