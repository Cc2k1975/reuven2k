import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT  3000;

function gtinToPath(code){
  const clean = (code  '').replace(Dg,'');
  const parts = [];
  for(let i=0;iclean.length;i+=3) parts.push(clean.slice(i,i+3));
  return parts.join('');
}

function openFactsCandidates(code){
  const base = [
    'httpsimages.openfoodfacts.orgimagesproducts',
    'httpsimages.openbeautyfacts.orgimagesproducts',
    'httpsimages.openproductsfacts.orgimagesproducts'
  ];
  const path = gtinToPath(code);
  return [
    `${base[0]}${path}front.400.jpg`,
    `${base[0]}${path}front.jpg`,
    `${base[1]}${path}front.400.jpg`,
    `${base[1]}${path}front.jpg`,
    `${base[2]}${path}front.400.jpg`,
    `${base[2]}${path}front.jpg`,
  ];
}

function ramiLevyCandidates(code){
  const base = `httpsimg.rami-levy.co.ilproduct${code}`;
  return [
    `${base}small.jpg`,
    `${base}large.jpg`,
    `httpswww.rami-levy.co.il_ipxw_500,f_webp${base}small.jpg`,
    `httpswww.rami-levy.co.il_ipxw_800,f_webp${base}large.jpg`,
  ];
}

async function tryFetchImage(url){
  try{
    const res = await axios.get(url, {
      responseType 'arraybuffer',
       user-agent + referer סבירים
      headers {
        'User-Agent' 'Mozilla5.0 (POC Scanner)',
        'Referer' 'httpsexample.com'
      },
      timeout 8000
    });
    const type = res.headers['content-type']  'imagejpeg';
    return { ok true, buffer res.data, type };
  }catch(e){
    return { ok false };
  }
}

app.get('img', async (req, res) = {
  const code = (req.query.code  '').toString().trim();
  if(!code) return res.status(400).send('missing code');

  const candidates = [
    ...openFactsCandidates(code),
    ...ramiLevyCandidates(code),
  ];

  for(const url of candidates){
    const r = await tryFetchImage(url);
    if(r.ok){
      res.set('Content-Type', r.type);
       Cache קצר – שחררשנה לפי הצורך
      res.set('Cache-Control', 'public, max-age=3600');
      return res.send(r.buffer);
    }
  }
  res.status(404).send('image not found');
});

app.listen(PORT, () = {
  console.log(`Image proxy listening on httplocalhost${PORT}`);
});
