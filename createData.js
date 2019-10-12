const customData = require('./raw_data.json');
var fs = require('fs');


const data = customData.data;
console.log(data.length);
var dataArray = [];
var count = 0;
var file = fs.createWriteStream('./data.json');
file.on('error', function(err) { console.log(err)});

file.write('var data = [');

for(var i=0;i<data.length;i++)
{
    if(data[i].platform.id == 1027)
    {
        var str = `{ value: '${data[i].platform.token_address}', label:'${data[i].symbol}' },\n`;
        file.write(str);
    }
   
}

file.write('];');
file.end();

// fs.writeFile('./data.js',dataArray,function(req){
//     console.log(req);
// });

const colourOptions = [
    { value: 'abc', label: 'chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];