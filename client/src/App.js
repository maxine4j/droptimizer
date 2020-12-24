import React, {Component} from 'react';
import BossWrapper from './components/BossWrapper';
import PageHeader from './components/PageHeader';
import axios from 'axios'

const API_CHARACTER = 'https://api.loot.arwic.io/1/character';
const API_ITEM = 'https://api.loot.arwic.io/1/item/'

class App extends Component {

    state = {
        players:[

        ],
        bossCollapsed : false,
    };
    bosses = [
        {
            'name': 'Champion of the Light',
            'image': 'src/champion.png',
            'loot': [
                {
                    'id': 165517,
                    'searchTerms': ["Leather","Wrist","Crit","Vers","Versatility","bracers"]
                },
                {
                    'id': 165501,
                    'searchTerms': ["Cloth","Wrist","haste","Vers","versatility","bracers"]
                },
                {
                    'id': 165550,
                    'searchTerms': ["Plate","Chest","azerite"]
                },
                {
                    'id': 165519,
                    'searchTerms': ["Leather","Helm","Helmet","Head","azerite"]
                },
                {
                    'id': 165549,
                    'searchTerms': ["Plate","Hands","Gloves","crit","haste"]
                },
                {
                    'id': 165586,
                    'searchTerms': ["Weapon","Sword","2h","Two-Hand","Strength","str","haste","mastery"]
                },
                {
                    'id': 165919,
                    'searchTerms': ["Weapon","Dagger","1h","One-Hand","Intellect","int","crit","vers","versatility"]
                },
                {
                    'id': 165834,
                    'searchTerms': ["Cloth","chest","azerite"]
                },
                {
                    'id': 165514,
                    'searchTerms': ["Leather","Hands","Gloves","crit","haste"]
                },
                {
                    'id': 165533,
                    'searchTerms': ["Mail","feet","boots","crit","mastery"]
                },
                {
                    'id': 165921,
                    'searchTerms': ["mail","shoulder","shoulders","azerite"]
                },
                {
                    'id': 165584,
                    'searchTerms': ["shield","offhand","off-hand","crit","haste"]
                },
                {
                    'id': 165569,
                    'searchTerms': ["trinket","intellect","int","healing","healer"]
                }
            ]
        },
        {
            'name': 'Jadefire Masters',
            'image': 'src/jadefire.png',
            'loot': [
                {
                    'id': 165565,
                    'searchTerms': ["ring","finger","crit","vers","versatility"]
                },
                {
                    'id': 165500,
                    'searchTerms': ["cloth","head","helmet","helm","azerite"]
                },
                {
                    'id': 165521,
                    'searchTerms': ["leather","legs","pants","haste","vers","versatility"]
                },
                {
                    'id': 165552,
                    'searchTerms': ["plate","belt","waist","crit","versatility","vers"]
                },
                {
                    'id': 165531,
                    'searchTerms': ["mail","gloves","hands","haste","mastery"]
                },
                {
                    'id': 165548,
                    'searchTerms': ["head","helm","helmet","plate","azerite"]
                },
                {
                    'id': 165568,
                    'searchTerms': ["agility","trinket","dps","aoe","agi","damage"]
                },
                {
                    'id': 165764,
                    'searchTerms': ["cloth","gloves","hands","crit","haste"]
                },
                {
                    'id': 165777,
                    'searchTerms': ["leather","azerite","shoulders","shoulder"]
                },
                {
                    'id': 165540,
                    'searchTerms': ["mail","chest","azerite"]
                },
                {
                    'id': 165587,
                    'searchTerms': ["weapon","staff","2h","two-hand","crit","mastery","int","intellect"]
                },
            ]
        },
        {
            'name': 'Grong, the Revenant',
            'image': 'src/grong.png',
            'loot': [
                {
                    'id': 165920,
                    'searchTerms': ["weapon","mace","1h","one-hand","strength","crit","mastery","str"]
                },
                {
                    'id': 165534,
                    'searchTerms': ["mail","wrist","vers","versatility","mastery","bracers"]
                },
                {
                    'id': 165588,
                    'searchTerms': ["weapon","fist","1h","one-hand","haste","mastery","agi","agility"]
                },
                {
                    'id': 165922,
                    'searchTerms': ["cloth","shoulder","shoulders","azerite"]
                },
                {
                    'id': 165582,
                    'searchTerms': ["offhand","int","intellect","haste","vers","versatility"]
                },
                {
                    'id': 165515,
                    'searchTerms': ["leather","chest","azerite"]
                },
                {
                    'id': 165574,
                    'searchTerms': ["trinket","strength","str","aoe","dps","damage"]
                },
                {
                    'id': 165589,
                    'searchTerms': ["weapon","polearm","2h","two-hand","agi","agility","crit","haste"]
                },
                {
                    'id': 165499,
                    'searchTerms': ["cloth","legs","crit","vers","versatility"]
                },
                {
                    'id': 165513,
                    'searchTerms': ["back","cloak","vers","versatility","mastery"]
                },
                {
                    'id': 165535,
                    'searchTerms': ["mail","helm","helmet","head","azerite"]
                },
                {
                    'id': 165555,
                    'searchTerms': ["plate","shoulder","shoulders","azerite"]
                },
                {
                    'id': 165551,
                    'searchTerms': ["plate","wrist","crit","haste","bracers"]
                },
                {
                    'id': 165525,
                    'searchTerms': ["leather","belt","waist","crit","mastery"]
                },
                
            ]
        },
        {
            'name': 'Opulence',
            'image': 'src/opulence.png',
            'loot': [
                {
                    'id': 165524,
                    'searchTerms': ["wrist","leather","haste","mastery","bracers"]
                },
                {
                    'id': 165591,
                    'searchTerms': ["weapon","glaive","warglaive","1h","one-hand","haste","versatility","agi","agility","vers"]
                },
                {
                    'id': 165541,
                    'searchTerms': ["mail","boots","feet","crit","haste"]
                },
                {
                    'id': 165561,
                    'searchTerms': ["plate","boots","feet","mastery","haste"]
                },
                {
                    'id': 165526,
                    'searchTerms': ["helm","head","helmet","leather","azerite"]                    
                },
                {
                    'id': 165821,
                    'searchTerms': ["helm","head","helmet","plate","azerite"]                    
                },
                {
                    'id': 165818,
                    'searchTerms': ["helm","head","helmet","cloth","azerite"]                    
                },
                {
                    'id': 165573,
                    'searchTerms': ["trinket","agi","agility","str","strength","tank"]                    
                },
                {
                    'id': 165820,
                    'searchTerms': ["helm","head","helmet","mail","azerite"]                    
                },
                {
                    'id': 165592,
                    'searchTerms': ["weapon","mace","1h","one-hand","int","intellect","haste","mastery"]                    
                },
                {
                    'id': 165538,
                    'searchTerms': ["belt","waist","mail","crit","vers","versatility"]                    
                },
                {
                    'id': 165593,
                    'searchTerms': ["weapon","dagger","1h","one-hand","agility","agi","haste","mastery"]      
                },
                {
                    'id': 165571,
                    'searchTerms': ["trinket","int","intellect","crit","mastery","dps","damage"]
                },
                {
                    'id': 165504,
                    'searchTerms': ["belt","waist","cloth","crit","haste","mastery"]      
                },
            ]
        },
        {
            'name': 'Conclave of the Chosen',
            'image': 'src/conclave.png',
            'loot': [
                {
                    'id': 165594,
                    'searchTerms': ["weapon","axe","1h","one-hand","vers","versatility","crit","int","intellect"]      
                },
                {
                    'id': 165560,
                    'searchTerms': ["legs","plate","crit","mastery"]      
                },
                {
                    'id': 165595,
                    'searchTerms': ["weapon","sword","1h","one-hand","vers","versatility","haste","str","strength"]    
                },
                {
                    'id': 166418,
                    'searchTerms': ["trinket","int","intellect","haste","speed","dps","healer"]    
                },
                {
                    'id': 165532,
                    'searchTerms': ["mail","chest","azerite"] 
                },
                {
                    'id': 165579,
                    'searchTerms': ["trinket","bleed","leech","agi","agility","dps"]      
                },
                {
                    'id': 165502,
                    'searchTerms': ["cloth","boots","feet","crit","haste"]      
                },
                {
                    'id': 165512,
                    'searchTerms': ["back","cape","crit","haste"]      
                },
                {
                    'id': 165507,
                    'searchTerms': ["cloth","shoulder","shoulders","azerite"]      
                },
                {
                    'id': 165599,
                    'searchTerms': ["weapon","bow","gun","ranged","agi","agility","haste","mastery","2h","two-hand"]      
                },
                {
                    'id': 165562,
                    'searchTerms': ["plate","shoulder","shoulders","azerite"]      
                },
                {
                    'id': 165833,
                    'searchTerms': ["leather","chest","azerite"]      
                }
            ]
        },
        {
            'name': 'King Rastakhan',
            'image': 'src/king.png',
            'loot': [
                {
                    'id': 165832,
                    'searchTerms': ["plate","chest","azerite"]
                },
                {
                    'id': 165577,
                    'searchTerms': ["trinket","agi","agility","str","strength","tank"]
                },
                
                {
                    'id': 165536,
                    'searchTerms': ["legs","mail","haste","mastery"]
                },
                
                {
                    'id': 165597,
                    'searchTerms': ["weapon","staff","2h","two-hand","int","intellect","haste","vers","versatility"]
                },
                
                {
                    'id': 165596,
                    'searchTerms': ["weapon","dagger","1h","one-hand","agi","agility","crit","vers","versatility"]
                },
                
                {
                    'id': 165537,
                    'searchTerms': ["mail","shoulder","shoulders","azerite"]
                },
                
                {
                    'id': 165578,
                    'searchTerms': ["trinket","int","intellect","healer","heal"]
                },
                
                {
                    'id': 165523,
                    'searchTerms': ["leather","shoulder","shoulders","azerite"]
                },
                
                {
                    'id': 165558,
                    'searchTerms': ["plate","wrist","haste","vers","versatility","bracers"]
                },
                
                {
                    'id': 165567,
                    'searchTerms': ["ring","finger","haste","vers","versatility"]
                },
                
                {
                    'id': 165498,
                    'searchTerms': ["cloth","chest","azerite"]
                }
            ]
        },
        {
            'name': 'High Tinker Mekkatorque',
            'image': 'src/tinker.png',
            'loot': [
                {
                    'id': 165825,
                    'searchTerms': ["plate","shoulder","shoulders","azerite"]
                },
                {
                    'id': 165497,
                    'searchTerms': ["cloth","shoulder","shoulders","azerite"]
                },
                {
                    'id': 165924,
                    'searchTerms': ["cape","back","crit","mastery"]
                },
                {
                    'id': 165508,
                    'searchTerms': ["cloth","wrist","crit","mastery","bracers"]
                },
                {
                    'id': 165522,
                    'searchTerms': ["hands","leather","gloves","vers","versatility","mastery"]
                },
                {
                    'id': 165830,
                    'searchTerms': ["leather","chest","azerite"]
                },
                {
                    'id': 165580,
                    'searchTerms': ["trinket","str","strength","haste","speed","dps","damage"]
                },
                {
                    'id': 165598,
                    'searchTerms': ["weapon","mace","1h","one-hand","str","strength","crit","haste"]
                },
                {
                    'id': 165543,
                    'searchTerms': ["mail","helm","helmet","head","azerite"]
                },
                {
                    'id': 165600,
                    'searchTerms': ["weapon","ranged","bow","gun","2h","two-hand","agi","agility"]
                },
                {
                    'id': 165572,
                    'searchTerms': ["trinket","agi","agility","crit","dps","damage"]
                }
            ]
        },
        {
            'name': 'Stormwall Blockade',
            'image': 'src/blockade.png',
            'loot': [
                {
                    'id': 165585,
                    'searchTerms': ["shield","off-hand","offhand","str","strength","int","intellect","vers","versatility","mastery"]
                },
                {
                    'id': 165822,
                    'searchTerms': ["cloth","helm","helmet","head","azerite"]
                },
                {
                    'id': 165602,
                    'searchTerms': ["weapon","axe","2h","two-hand","crit","versatility","vers","str","strength"]
                },
                {
                    'id': 165590,
                    'searchTerms': ["weapon","polearm","agi","agility","2h","two-hand","vers","versatility","mastery"]
                },
                {
                    'id': 165528,
                    'searchTerms': ["leather","legs","crit","haste"]
                },
                {
                    'id': 165557,
                    'searchTerms': ["plate","chest","azerite"]
                },
                {
                    'id': 165603,
                    'searchTerms': ["weapon","ranged","wand","1h","one-hand","int","intellect","haste","mastery"]
                },
                {
                    'id': 165546,
                    'searchTerms': ["mail","hands","gloves","vers","versatility","mastery"]
                },
                {
                    'id': 165601,
                    'searchTerms': ["weapon","1h","one-hand","axe","agi","agility","crit","vers","versatility"]
                },
                {
                    'id': 165556,
                    'searchTerms': ["plate","hands","gloves","vers","versatility","mastery"]
                },
                {
                    'id': 165923,
                    'searchTerms': ["mail","shoulder","shoulders","azerite"]
                },
                {
                    'id': 165819,
                    'searchTerms': ["leather","helm","helmet","head","azerite"]
                },
                {
                    'id': 165506,
                    'searchTerms': ["cloth","legs","haste","mastery"]
                },  
            ]
        },
        {
            'name': 'Lady Jaina Proudmoore',
            'image': 'src/jaina.png',
            'loot': [
                {
                    'id': 165824,
                    'searchTerms': ["leather","shoulder","shoulders","azerite"]
                },
                {
                    'id': 165604,
                    'searchTerms': ["weapon","1h","one-hand","sword","agi","agility","crit","mastery"]
                },
                {
                    'id': 165527,
                    'searchTerms': ["leather","feet","boots","haste","mastery"]
                },
                {
                    'id': 165570,
                    'searchTerms': ["trinket","str","strength","dps","damage"]
                },
                {
                    'id': 165831,
                    'searchTerms': ["mail","chest","azerite"]
                },
                {
                    'id': 165583,
                    'searchTerms': ["offhand","off-hand","int","intellect","crit","mastery"]
                },
                {
                    'id': 165823,
                    'searchTerms': ["plate","helm","helmet","head","azerite"]
                },
                {
                    'id': 165559,
                    'searchTerms': ["plate","waist","belt","crit","mastery"]
                },
                {
                    'id': 165542,
                    'searchTerms': ["mail","wrist","crit","vers","versatility","bracers"]
                },
                {
                    'id': 165566,
                    'searchTerms': ["ring","finger","haste","mastery"]
                },
                {
                    'id': 165505,
                    'searchTerms': ["cloth","chest","azerite"]
                },
                {
                    'id': 165576,
                    'searchTerms': ["trinket","int","intellect","dps","damage","aoe"]
                }  
            ]
        }
    ]
    items = [];
    loading = true;

    updateItemState = () =>{
        let promises = [];
        let requests = [];
        for(let i = 0; i < this.bosses.length; i++){
            for (var j = 0; j < this.bosses[i].loot.length; j++){
                let url = API_ITEM+this.bosses[i].loot[j].id;
                requests.push(url);
            }
            
        }
        for(let i = 0; i < requests.length; i++){
            promises.push(axios.get(requests[i], {crossdomain: true}));
        }
        axios.all(promises).then(axios.spread((...args) => {
            this.items = [];
            for(let i = 0; i < args.length; i++){
                if(args[i].data !== ''){
                    for(let m = 0; m < this.bosses.length; m++){
                        let bItems = this.bosses[m].loot;
                        let out = {};
                        for(let k = 0; k < bItems.length; k++){
                            if(bItems[k].id === args[i].data.id){
                                let terms = [];
                                terms.push(args[i].data.name);

                                let result = args[i].data;
                                if(typeof(bItems[k].searchTerms) !== 'undefined'){
                                    for(let n = 0; n < bItems[k].searchTerms.length; n++){
                                        terms.push(bItems[k].searchTerms[n]);
                                        
                                    }
                                }
                                result.searchTerms = terms;
                                out = result;
                            }
                        }
                        if(Object.keys(out).length > 0){
                            this.items.push(out);
                        }
                    }
                }
                else{
                }
            }
            this.loading = false;

        }));
    } 

    componentDidMount(){
        this.updateItemState();
        axios.get(API_CHARACTER,{ crossdomain: true } )
        .then(response => this.setState({players: response.data}))
    }

    setBossCollapse = (boo) =>{
        this.setState({bossCollapsed : boo});
    }

    render() {
        if(this.loading === false){
            return (
                <div className="container-fluid align-items-center">
                    <PageHeader loading={this.loading}  bosses={this.bosses} items={this.items} players={this.state.players} update={this.updateItemState} setBossCollapse = {this.setBossCollapse} />
                    { this.state.bossCollapsed ? null : <BossWrapper loading={this.loading} bosses={this.bosses} items={this.items} update={this.updateItemState} players={this.state.players} /> }
                </div>
            );
        }
        else{
            return (
                <div className="container-fluid align-items-center">
                    <PageHeader loading={this.loading} bosses={this.bosses} items={this.items} players={this.state.players} update={this.updateItemState} setBossCollapse = {this.setBossCollapse} />
                    { this.state.bossCollapsed ? null : <BossWrapper loading={this.loading} bosses={this.bosses} items={this.items} update={this.updateItemState} players={this.state.players} /> }
                </div>
            );
        }
        
    }
}

export default App;