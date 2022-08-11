import React, {Component} from 'react';
import PlayerHeader from './PlayerHeader';
import axios from 'axios';

const API_UPGRADE = 'https://api.droptimizer.tim-ings.com/1/upgrade/';

class PlayerList extends Component {

    constructor(props) {
        super();
        this.state = {
            upgrades : [],
            boundaryH : 0,
            boundaryL : 100,
            hasPlayer : true,
            showFilter : false,
            filterClicked : false,
            loadingPlayers : false,
            icons : ['rb1.png','rb2.png','rb3.png','rb4.png','rb5.png','rb6.png','rb7.png']
        }
    }
    

    sortMyArray = () =>{
        if(this.state.upgrades !== []){
            var obj = [...this.state.upgrades];
            obj.sort((a,b) => {
                if(this.props.isPercent){
                    //console.log("percent");
                    let aPercent = (a.dps - a.baseDps) / a.baseDps * 100;
                    let bPercent = (b.dps - b.baseDps) / b.baseDps * 100;
                    if(aPercent < bPercent){
                        return 1;
                    }
                    else return -1;
                }
                else{
                    //console.log('numbers');
                    let aIncrease = a.dps - a.baseDps;
                    let bIncrease = b.dps - b.baseDps;
                    if(aIncrease < bIncrease){
                        return 1;
                    }
                    else return -1;
                }
            });
            return obj;
        }
        

    }
    getBoundaries = (upgrades) => {
        let bH = 0;
        let bL = 1000;
        for(let i = 0; i < upgrades.length; i++){
            let base = upgrades[i].baseDps;
            let mean = upgrades[i].dps;
            let increaseDps = mean - base;
            if(this.props.isPercent){
                let percent = increaseDps / base * 100;
                if(percent > bH ){
                    bH = percent;
                }
                if(percent < bL){
                    bL = percent;
                }
            }
            else{
                if(increaseDps > bH){
                    bH = increaseDps;
                }
                if(increaseDps < bL){
                    bL = increaseDps;
                }
            }
        }
        return [bH, bL];
    }
    

    

    componentDidMount = () => {
        this.setState({loadingPlayers : true});
        let promises = [];
        let requests = [];
        for(let i = 0; i < this.props.players.length; i++){
            let url = API_UPGRADE+this.props.players[i].name+'/'+this.props.item.id;
            requests.push(url);
        }
        for(let i = 0; i < requests.length; i++){
            promises.push(axios.get(requests[i], {crossdomain: true}));
        }
        axios.all(promises).then(axios.spread((...args) => {
            for(let i = 0; i < args.length; i++){
                if(args[i].data !== ''){
                    var newUpgrades = this.state.upgrades.slice();
                    newUpgrades.push(args[i].data);  
                    this.setState({upgrades:newUpgrades})
                    //console.log(args[i].data);
                    this.props.filter(false);
                }
                else{
                    this.setState({hasPlayer : false})
                }
            }
            this.setState({loadingPlayers : false});
        }));
    }

    render() {
        let playerHeaders = [];
        let upgrades = this.sortMyArray();
        let bHL = this.getBoundaries(upgrades);
        
        for (var i = 0; i < this.state.upgrades.length; i++) {
            if(this.state.loadingPlayers === false){
                let rand = this.state.icons[Math.floor(Math.random()*this.state.icons.length)];
                playerHeaders.push(<PlayerHeader player={upgrades[i]} isPercent={this.props.isPercent} boundaryH={bHL[0]} boundaryL={bHL[1]} key={i} value={i} item={this.props.item} rbIco={rand} noPlayers={false} />)
            }
        }
        if(playerHeaders.length === 0){
            playerHeaders.push(<PlayerHeader player={null} key={i} value={i} item={this.props.item} noPlayers={true} hasAnyone={this.state.hasPlayer}/>)
        }
        return (
            <div className="col-12 playerScroller rounded">
                <div className="PlayerList rounded-bottom m-auto">
                    {playerHeaders}
                </div>
            </div>
        );
    }
}

export default PlayerList;
