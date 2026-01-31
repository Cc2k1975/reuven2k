const https = require("https");
const fs = require("fs");

https.get("https://m.sport5.co.il/Pages/BroadcastSheet.aspx?FolderId=99", res => {
  let html = "";
  res.on("data", d => html += d);
  res.on("end", () => {
    const clean = html.replace(/<[^>]+>/g," ");
    const lines = clean.split("\n").filter(l=>l.includes(":"));
    
    const results = lines.map(l=>{
      return {
        time: (l.match(/\d{1,2}:\d{2}/)||[""])[0],
        channel: "ספורט 5",
        text: l.trim()
      };
    }).filter(x=>x.time);

    fs.writeFileSync("chanel/data.json", JSON.stringify(results,null,2));
    console.log("updated", results.length);
  });
});
