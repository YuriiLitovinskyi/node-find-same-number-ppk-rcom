const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/DBClientsPPK';

(() => {
    MongoClient.connect(url, async(err, db) => {
        if(err){
            console.log('No connection to Database! Please start MongoDB service on default port 27017!\n');                         
            console.log(err);
            await sleep(10000);
        } else {
            console.log('Connected to database successfully!\n\n'); 
            findSamePpkNumbers(db, async () => {
                console.log('\nApplication will be closed automatically in 2 minutes...');
                db.close();
                await sleep(120000);
            });
        };
    });
})();

const findSamePpkNumbers = (db, callback) => {
    db.collection('ppkState', async (err, collection) => {
        if(err) {
            console.log(err);
            db.close();
            await sleep(10000);
        }; 
        const allPpks = await collection.find({}).toArray();
        //console.log('allPpks', allPpks);       
      
        let samePpksNumberArray = allPpks
            .filter((elt, eltIndex) => allPpks
            .some((sameNameElt, sameNameEltIndex) => sameNameElt.ppk_num === elt.ppk_num && sameNameEltIndex !== eltIndex));
        //console.log("same ppks: ", samePpksNumberArray);

        let arrayOfPpks = [];

        for (let i = 0; i < samePpksNumberArray.length; i++){
            arrayOfPpks.push(samePpksNumberArray[i].ppk_num);
        };
        //console.log('ppknum:', arrayOfPpks);

        let counts = {};
        arrayOfPpks.forEach(function(i) { counts[i] = (counts[i] || 0) + 1; });
        //console.log('counts: ', counts);

        if(Object.keys(counts).length === 0){
            console.log('\nThere are no duplicate ppk numbers in current RCOM\'s database!');
        } else {
            for (let key in counts){
                console.log(`Ppk number ${key} count: ${counts[key]}`);
            };
            console.log('\n\nPlease, remove all duplicate ppk numbers from current database!');
        };     
        
        callback();
    });   
};

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};