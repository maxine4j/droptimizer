import React, {Component} from 'react';
import RaidbotsTooltip from './RaidbotsTooltip';

class PlayerHeader extends Component {
    constructor(props) {
        super();
        this.state = {
            hideArmory : true,
            hideRaidbots : true,
            specs: {
                "Protection Warrior":"Tank",
                "Protection Paladin":"Tank",
                "Holy Paladin":"Healer",
                "Discipline Priest":"Healer",
                "Holy Priest":"Healer",
                "Blood Death Knight":"Tank",
                "Restoration Shaman":"Healer",
                "Brewmaster Monk":"Tank",
                "Mistweaver Monk":"Healer",
                "Guardian Druid":"Tank",
                "Restoration Druid":"Healer",
                "Vengeance Demon Hunter":"Tank",
            }
        }
    }

    updateState = (response) =>{
        if(response.data !== ''){
            this.setState({upgrade : response.data})
        }
    }

    raidbotsEnter = () =>{
        this.setState({hideRaidbots : false});
    }
    raidbotsLeave = () =>{
        this.setState({hideRaidbots : true});
    }
    armoryEnter = () =>{
        this.setState({hideArmory : false});
    }
    armoryLeave = () =>{
        this.setState({hideArmory : true});
    }

    render() {
        if(this.props.noPlayers === true && this.props.hasAnyone === false){
            return (
                <div className="PlayerListItem">
                    <div className="PlayerWrapper pr-auto">
                        <div className="PlayerHeader d-flex justify-content-center align-items-center py-2">
                        <h5 className="pl-3 pt-2 mx-2 text-muted">No Player Data</h5>
                        </div>
                    </div>
                </div>
            );
        }
        if(this.props.noPlayers === false){
            let cls = "class" + this.props.player.class;
            let upgradeMean = this.props.player.dps;
            let baseDps = this.props.player.baseDps;
            let increaseDps = upgradeMean - baseDps;
            let myPercent = increaseDps / baseDps * 100;
            let perc = 0;
            
            if(baseDps === 0){
                baseDps = 1;
            }
            if(this.props.isPercent){
                perc = (myPercent / this.props.boundaryH)*98;
                //console.log(perc)
                if(isNaN(perc)){
                    perc= 98;
                }
            }
            else{
                perc = (increaseDps / this.props.boundaryH)*98;
                //console.log(perc)
                if(isNaN(perc)){
                    perc= 98;
                }

            }
            let sign = '+';
            let signCls = "positive"

            if(increaseDps <= 0){
                sign = '';
                signCls = "negative";
                perc = 1.5;
            }
            

            let rankCls = "";
            switch(this.props.value+1){
                case 1:{
                    rankCls = "rank1";
                    break;
                }
                case 2:{
                    rankCls = "rank2";
                    break;
                }
                case 3:{
                    rankCls = "rank3";
                    break;
                } 
                default:{
                    break;
                }              
            }

            let textSmall = "";
            let textBig = "";

            if(this.props.isPercent){
                textBig = myPercent.toFixed(2)+"%";
                textSmall = sign+increaseDps.toFixed(0)+" dps";
            }
            else{
                textBig = sign+increaseDps.toFixed(0);
                textSmall = myPercent.toFixed(2)+"%";
            }

            let roleIcon = "wowico.png";
            if(this.props.player.spec !== null){
                let specrole = this.state.specs[this.props.player.spec];
                console.log(specrole);
                if(specrole === "Tank"){
                    roleIcon = "tankico.png";
                }
                if(specrole === "Healer"){
                    roleIcon = "healerico.png";
                }
                if(typeof specrole === 'undefined'){
                    console.log("DPS");
                    roleIcon = "dpsico.png";
                }
            }

            return (
                <div className="PlayerListItem rounded">
                    <div className="PlayerWrapper unselectable">  
                        <div className="PlayerHeader align-items-center row p-2">
                            <div className="col-7 col-md-4 pr-0 align-self-center order-first">
                                <div className="row">
                                    <h4 className={"PlayerRank text-center pt-1 pl-2 "+rankCls}>{this.props.value+1}</h4>
                                    <a className="armoryLink" href={"https://worldofwarcraft.com/en-us/character/frostmourne/"+this.props.player.name } rel="noopener noreferrer" target="_blank">
                                        <div className="row mx-0 p-0">
                                            <img className="PlayerImage rounded mr-2 align-self-center " alt="" src={"https://render-us.worldofwarcraft.com/character/"+this.props.player.thumbnail}/>
                                            <h5 className={"PlayerName pt-2 " + cls}>{this.props.player.name}</h5>
                                        </div>
                                    </a>
                                    <div className="row mx-auto mx-0 p-0">
                                        <a onMouseEnter={this.raidbotsEnter} onMouseLeave={this.raidbotsLeave} className="d-flex align-items-center mr-1 mb-1" rel="noopener noreferrer" href={"https://raidbots.com/simbot/report/"+this.props.player.reportID} target="_blank">
                                            <img className="rbIco " src={'src/'+this.props.rbIco} alt="" height="30px" />
                                        </a>
                                        { this.state.hideRaidbots ? null : <RaidbotsTooltip player={this.props.player} rbots={true} key={1}/> }
                                        <img onMouseEnter={this.armoryEnter} onMouseLeave={this.armoryLeave}  className="roleIco ml-3 align-self-center" src={'src/'+roleIcon} alt="" height="30px" />
                                        { this.state.hideArmory ? null : <RaidbotsTooltip player={this.props.player} rbots={false} key={1}/> }
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 d-md-none"></div>
                            
                            <div className="col d-block d-md-none"></div>
                            <div className='col-8 col-md-4 px-2 mx-4 ml-2 align-self-center'>
                                <div className='row justify-content-between'>
                                    <h5 className={"PlayerSim pt-1 mx-1 text-muted "}>{baseDps.toFixed(0) + " dps"}</h5>
                                    <i className="fas fa-arrow-right text-muted pt-2"></i>
                                    <h5 className={"PlayerSim pt-1 mx-1 text-muted "}>{upgradeMean.toFixed(0)+" dps"}</h5>
                                    <h5 className={"PlayerSim pt-1 mx-1 ml-2 "+signCls}>{textSmall}</h5>
                                </div>
                            </div>
                            <div className="col d-block d-md-none"></div>
                            
                            <div className="col align-self-center d-none d-md-flex p-0 mr-3" height="20px">
                                <svg className="graphSVG" width={"100%"}  height="12px">
                                    <rect className="svgLine1" width="100%" y="30%" height="2px" rx="2" ry="2"></rect>
                                    <rect className={"svgLine2 "+signCls} x={0} width={perc+"%"} y="27%" height="3px" rx="2" ry="2"></rect>
                                    <circle className="svgCircle" r="3.5" cx={perc+"%"} cy="42%"></circle> 
                                </svg>
                            </div>
                            
                            <div className="col-1 pr-2 d-none d-md-block ">
                                <div className="row justify-content-end ml-1 mr-1">
                                    <h4 className={"percentText "+signCls}>{textBig}</h4>
                                </div>
                            </div>
                            <div className="col-5 pr-2 d-block d-md-none order-first">
                                <div className="row justify-content-end ml-1 mr-1">
                                    <h4 className={"percentText "+signCls}>{textBig}</h4>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="PlayerListItem">
                    <div className="PlayerWrapper pr-auto">
                        <div className="PlayerHeader d-flex justify-content-center align-items-center py-2">
                        <img src="src/spinner.svg" alt="" height="40px" />

                        </div>
                    </div>
                </div>
            );
        }

        
        
        
        
    }
}

export default PlayerHeader;