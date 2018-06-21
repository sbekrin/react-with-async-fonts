import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import express from 'express';
import getPort from 'get-port';
import { Server } from 'http';

let server: Server;
let browser: puppeteer.Browser;
let page: puppeteer.Page;

beforeAll(async () => {
  const port = await getPort();
  const app = express();
  app.use(express.static(path.join(__dirname, '__fixtures__')));
  server = app.listen(port);
  browser = await puppeteer.launch();
  page = await browser.newPage();
  page.goto(`http://localhost:${port}`);
});

afterAll(async () => {
  await browser.close();
  await server.close();
});

describe('Integration', () => {
  it('sets class name once font is ready', async () => {
    await page.waitForSelector('.system-font');
    await page.waitForSelector('.roboto900-font');
  });
});
