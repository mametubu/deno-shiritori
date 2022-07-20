import { serve } from "https://deno.land/std@0.138.0/http/server.ts";

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

const StartWord = [`りんご`,`ごりら`,`すし`,`らっぱ`,`ぱり`,`にく`,`めがね`,`りす`,`すいか`,`つばめ`,`めだか`,`かめ`,`めんたいこ`,`こま`,`まんとひひ`,`ひらがな`,`なっとう`,`うさぎ`,`ぎぞく`,`くり`,`りけい`,`いど`,`どれっしんぐ`,`ぐみ`];

let previousWord = StartWord[Math.floor(Math.random() * StartWord.length)];

let keepWord = [];

console.log("Listening on http://localhost:8000");

serve(async (req) => {

  const pathname = new URL(req.url).pathname;

  if (req.method === "GET" && pathname === "/shiritori") {

    return new Response(previousWord);

  }

  keepWord.push(previousWord);

  if (req.method === "POST" && pathname === "/shiritori") {

    const requestJson = await req.json();

    const nextWord = requestJson.nextWord;

    keepWord.pop(previousWord);

    if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {

      return new Response("前の単語に続いていません。", { status: 400 });

    }

    if(nextWord.lenght > 0 && keepWord.includes(nextWord)){

      return new Response("同じ単語は入力できません。",{ status: 400 });

    }

    if(nextWord.length > 0 && nextWord.charAt(nextWord.length - 1) == `ん`){

      keepWord = [];

      previousWord = StartWord[Math.floor(Math.random() * StartWord.length)];

      return new Response("単語の最後に「ん」がついてはいけません。",{ status: 400 });

    }

    previousWord = nextWord;

    return new Response(previousWord);

  }


  return serveDir(req, {

    fsRoot: "public",

    urlRoot: "",

    showDirListing: true,

    enableCors: true,

  });

});