const express = require("express");
const path = require('path');
const hbs  = require('hbs');
let candidates = [];  // Stores candidates
let result = [];         // result of winner - runner up
let votes = new Set();      //tores votes and validate for duplicate entry
let totalcandidate = 0;   // stores total number of candidates
let won=0,m1=0,m2=0,runner=0;  // stores the index of winner ,runner up/looser
const app = express();
const PORT = process.env.PORT || 3000; // PORT

// setup path for view 
app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'hbs');   // used hbs/handlebars 

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',function(req,res){
  res.render('homepage');
});

app.get('/addCandidates',function(req,res){
  res.render('addCandidates',{cans: candidates});
});

app.post('/add',function(req,res){
    if(!req.body.name)
    {
        res.render('addCandidates',{cans: candidates, msg: "Enter the candidate name --"});
    }
    else{
        candidates.push({name:req.body.name, votes:0});
        totalcandidate++;
        res.redirect('addCandidates');
    }
});

app.get('/vote',function(req,res){
  res.render('vote',{cans: candidates, msg:""});  
});

app.post('/votecount', function(req,res){
    if(req.body.id.length==0)
    {
        res.render('vote',{cans: candidates, msg: "Enter your ID to mark your vote"});
    }
    if(votes.has(req.body.id)){
        res.render('vote',{cans: candidates, msg: "Ops! It looks like you already voted,you can vote only once"});
    }
    else {
        votes.add(req.body.id);
        for(let i = 0; i< totalcandidate; i++){
            if(candidates[i].name == req.body.vote){
                candidates[i].votes++;
            }
        }
        res.render('vote',{cans: candidates, msg: "Thanks for voting"});
    }
});

app.get('/pollresult',function(req,res){

    if(candidates.length == 0){
    res.redirect("/");
    }

 for(let i=0;i<totalcandidate;i++){
     if(candidates[i].votes > m1){
         m2 = m1;runner = won;
         m1 = candidates[i].votes;
         won = i;
     } else if(candidates[i].votes < m1 && candidates[i].votes > m2){
        m2 = candidates[i].votes;
        runner = i;
     }
 }

 result.push({name: candidates[won].name, votes: candidates[won].votes});
 result.push({name: candidates[runner].name, votes: candidates[runner].votes});
 res.render('pollresult',{ress: result});
});

app.get('/votingsummary', function(req,res){
   res.render('votingsummary',{cans: candidates});
});

(async function runServer(){
    await app.listen(PORT);//connecting to the node server
    console.log(`Server Started at PORT ${PORT}`);
})();